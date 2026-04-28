import { z } from 'zod';

const schema = z.object({
  VITE_SUPABASE_URL: z.string().url().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  VITE_VAPID_PUBLIC_KEY: z.string().optional().default(''),
});

const parsed = schema.safeParse({
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  VITE_VAPID_PUBLIC_KEY: import.meta.env.VITE_VAPID_PUBLIC_KEY,
});

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('[env] Invalid environment variables:', parsed.error.flatten().fieldErrors);
}

const data = parsed.success ? parsed.data : { VITE_VAPID_PUBLIC_KEY: '' };

export const env = {
  supabaseUrl: data.VITE_SUPABASE_URL ?? '',
  supabaseAnonKey: data.VITE_SUPABASE_ANON_KEY ?? '',
  vapidPublicKey: data.VITE_VAPID_PUBLIC_KEY ?? '',
  isSupabaseConfigured: Boolean(data.VITE_SUPABASE_URL && data.VITE_SUPABASE_ANON_KEY),
} as const;
