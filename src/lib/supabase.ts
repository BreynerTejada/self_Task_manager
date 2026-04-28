import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

if (!env.isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    '[supabase] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY — running in offline mode. ' +
      'Copy .env.example to .env.local and fill in your project credentials.',
  );
}

// We hand-maintain types in @/types/database. Annotating the client with the
// full generated Database generic adds churn for every schema tweak — instead
// we cast at query boundaries where we care.
export const supabase: SupabaseClient = createClient(
  env.supabaseUrl || 'http://localhost:54321',
  env.supabaseAnonKey || 'public-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'tessera.auth',
    },
    realtime: {
      params: { eventsPerSecond: 10 },
    },
  },
);

export const isSupabaseConfigured = env.isSupabaseConfigured;
