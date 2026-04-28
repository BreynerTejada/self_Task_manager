import { env } from './env';
import { supabase } from './supabase';
import { urlBase64ToUint8Array } from './utils';

export async function registerPushSubscription(userId: string): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !env.vapidPublicKey) {
    return false;
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return false;

  const reg = await navigator.serviceWorker.register('/sw.js');
  await navigator.serviceWorker.ready;

  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(env.vapidPublicKey),
    });
  }

  const json = sub.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) return false;

  await supabase
    .from('push_subscriptions')
    .upsert(
      {
        user_id: userId,
        endpoint: json.endpoint,
        p256dh: json.keys.p256dh,
        auth: json.keys.auth,
        user_agent: navigator.userAgent,
      },
      { onConflict: 'endpoint' },
    );

  return true;
}
