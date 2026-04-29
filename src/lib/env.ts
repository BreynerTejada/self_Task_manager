import { z } from 'zod';

const schema = z.object({
  VITE_SUPABASE_URL: z.string().url().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  VITE_SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  VITE_VAPID_PUBLIC_KEY: z.string().optional().default(''),
});

const parsed = schema.safeParse({
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  VITE_VAPID_PUBLIC_KEY: import.meta.env.VITE_VAPID_PUBLIC_KEY,
});

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('[env] Invalid environment variables:', parsed.error.flatten().fieldErrors);
}

const data = parsed.success ? parsed.data : { VITE_VAPID_PUBLIC_KEY: '' };

const supabaseKey =
  (data as { VITE_SUPABASE_ANON_KEY?: string }).VITE_SUPABASE_ANON_KEY ??
  (data as { VITE_SUPABASE_PUBLISHABLE_KEY?: string }).VITE_SUPABASE_PUBLISHABLE_KEY ??
  '';

export const env = {
  supabaseUrl: (data as { VITE_SUPABASE_URL?: string }).VITE_SUPABASE_URL ?? '',
  supabaseAnonKey: supabaseKey,
  vapidPublicKey: data.VITE_VAPID_PUBLIC_KEY ?? '',
  isSupabaseConfigured: Boolean(
    (data as { VITE_SUPABASE_URL?: string }).VITE_SUPABASE_URL && supabaseKey,
  ),
} as const;
