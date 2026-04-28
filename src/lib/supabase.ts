import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    '[supabase] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY — running in offline mode. ' +
      'Copy .env.example to .env and fill in your project credentials.',
  );
}

// We hand-maintain types in @/types/database. Annotating the client with the
// full generated Database generic adds churn for every schema tweak — instead
// we cast at query boundaries where we care.
export const supabase: SupabaseClient = createClient(
  url ?? 'http://localhost:54321',
  anonKey ?? 'public-anon-key',
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

export const isSupabaseConfigured = Boolean(url && anonKey);
