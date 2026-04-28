// Deno edge function: send-reminders
// Schedule via pg_cron to call this every minute (see schema.sql).
// Sends Web Push notifications for any tasks whose reminder_at falls in the
// next 5-minute window and have not yet been notified.
//
// Required env vars (configure with `supabase secrets set ...`):
//   SUPABASE_URL                 — auto-populated by Supabase runtime
//   SUPABASE_SERVICE_ROLE_KEY    — auto-populated by Supabase runtime
//   VAPID_PUBLIC_KEY             — your VAPID public key (base64url)
//   VAPID_PRIVATE_KEY            — your VAPID private key (base64url)
//   VAPID_SUBJECT                — `mailto:you@example.com`

// @ts-nocheck — Deno runtime types differ from app TS config.
import { createClient } from 'jsr:@supabase/supabase-js@2';
import webpush from 'npm:web-push@3.6.7';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

webpush.setVapidDetails(
  Deno.env.get('VAPID_SUBJECT') ?? 'mailto:reminders@tessera.app',
  Deno.env.get('VAPID_PUBLIC_KEY')!,
  Deno.env.get('VAPID_PRIVATE_KEY')!,
);

Deno.serve(async () => {
  const now = new Date();
  const windowEnd = new Date(now.getTime() + 5 * 60_000);

  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('id, user_id, title, reminder_at, status')
    .neq('status', 'completed')
    .gte('reminder_at', now.toISOString())
    .lte('reminder_at', windowEnd.toISOString());

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  if (!tasks || tasks.length === 0) {
    return new Response(JSON.stringify({ checked: 0, sent: 0 }), {
      headers: { 'content-type': 'application/json' },
    });
  }

  const userIds = Array.from(new Set(tasks.map((t) => t.user_id)));
  const { data: subs } = await supabase
    .from('push_subscriptions')
    .select('*')
    .in('user_id', userIds);

  const byUser = new Map<string, typeof subs>();
  for (const s of subs ?? []) {
    if (!byUser.has(s.user_id)) byUser.set(s.user_id, []);
    byUser.get(s.user_id)!.push(s);
  }

  let sent = 0;
  const failedSubs: string[] = [];

  for (const task of tasks) {
    const userSubs = byUser.get(task.user_id) ?? [];
    for (const sub of userSubs) {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify({
            title: 'Reminder · Tessera',
            body: task.title,
            url: `/tasks/${task.id}`,
            tag: `task-${task.id}`,
          }),
        );
        sent += 1;
      } catch (err) {
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) {
          failedSubs.push(sub.endpoint);
        }
      }
    }
  }

  if (failedSubs.length > 0) {
    await supabase.from('push_subscriptions').delete().in('endpoint', failedSubs);
  }

  return new Response(JSON.stringify({ checked: tasks.length, sent, pruned: failedSubs.length }), {
    headers: { 'content-type': 'application/json' },
  });
});
