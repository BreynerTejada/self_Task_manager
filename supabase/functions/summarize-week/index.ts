// Deno edge function: summarize-week
// Generates a Spanish weekly summary + time-management recommendations
// for the calling user's tasks, using Google Gemini 2.0 Flash, then upserts
// the result into public.weekly_insights.
//
// Required env vars (configure with `supabase secrets set ...`):
//   SUPABASE_URL                 — auto-populated by Supabase runtime
//   SUPABASE_ANON_KEY            — auto-populated by Supabase runtime
//   GEMINI_API_KEY               — your Google AI Studio API key

// @ts-nocheck — Deno runtime types differ from app TS config.
import { createClient } from 'jsr:@supabase/supabase-js@2';

const MODEL = 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...CORS_HEADERS },
  });

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return json({ error: 'Missing Authorization header' }, 401);

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData?.user) return json({ error: 'Invalid session' }, 401);
  const user = userData.user;

  let body: { weekStart?: string; weekEnd?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }
  const weekStart = body.weekStart ?? '';
  const weekEnd = body.weekEnd ?? '';
  if (!ISO_DATE.test(weekStart) || !ISO_DATE.test(weekEnd)) {
    return json({ error: 'weekStart and weekEnd must be YYYY-MM-DD' }, 400);
  }

  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) return json({ error: 'GEMINI_API_KEY not configured' }, 500);

  const { data: tasks, error: tasksErr } = await supabase
    .from('tasks')
    .select('title, description, due_date, due_time, priority, status, category:categories(name)')
    .gte('due_date', weekStart)
    .lte('due_date', weekEnd)
    .order('due_date', { ascending: true });
  if (tasksErr) return json({ error: tasksErr.message }, 500);

  const taskList = (tasks ?? []).map((t) => ({
    title: t.title,
    description: t.description,
    due_date: t.due_date,
    due_time: t.due_time,
    priority: t.priority,
    status: t.status,
    category: t.category?.name ?? null,
  }));

  const prompt = `Eres un coach de productividad cálido, directo y práctico. Responde SIEMPRE en español.

El usuario tiene las siguientes tareas para la semana del ${weekStart} al ${weekEnd} (formato JSON):

${JSON.stringify(taskList, null, 2)}

Devuelve EXCLUSIVAMENTE un objeto JSON válido con dos claves:
- "summary": string. Un resumen narrativo de 2 a 3 párrafos (150-250 palabras) que cubra:
    · cuántas tareas hay y cómo se distribuyen por prioridad/categoría;
    · qué hay vencido o atrasado y qué está completado;
    · los días o bloques con más carga.
  Usa lenguaje natural, tono cálido pero conciso. Incluye saltos de línea entre párrafos.
- "recommendations": array de 3 a 5 strings. Cada string es una recomendación accionable y concreta para gestionar mejor el tiempo de esta semana específica (ej. "Agrupa las tareas de alta prioridad del martes por la mañana"). Evita consejos genéricos.

Si la lista de tareas está vacía, en "summary" indícalo cordialmente y en "recommendations" sugiere hábitos para planificar la semana.

No incluyas markdown, comentarios, ni texto fuera del JSON.`;

  const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.6,
      },
    }),
  });

  if (!geminiRes.ok) {
    const errText = await geminiRes.text();
    return json({ error: `Gemini API error: ${geminiRes.status}`, details: errText }, 502);
  }

  const geminiBody = await geminiRes.json();
  const rawText: string | undefined = geminiBody?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) return json({ error: 'Empty response from Gemini' }, 502);

  let parsed: { summary?: string; recommendations?: string[] };
  try {
    parsed = JSON.parse(rawText);
  } catch {
    return json({ error: 'Gemini returned non-JSON output', raw: rawText }, 502);
  }
  const summary = (parsed.summary ?? '').trim();
  const recommendations = Array.isArray(parsed.recommendations)
    ? parsed.recommendations.filter((r): r is string => typeof r === 'string' && r.trim().length > 0)
    : [];
  if (!summary || recommendations.length === 0) {
    return json({ error: 'Gemini response missing summary or recommendations', raw: parsed }, 502);
  }

  const { data: upserted, error: upsertErr } = await supabase
    .from('weekly_insights')
    .upsert(
      {
        user_id: user.id,
        week_start: weekStart,
        week_end: weekEnd,
        summary,
        recommendations,
        model: MODEL,
        task_count: taskList.length,
        generated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,week_start' },
    )
    .select('*')
    .single();
  if (upsertErr) return json({ error: upsertErr.message }, 500);

  return json(upserted);
});
