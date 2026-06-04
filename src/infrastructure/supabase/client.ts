import 'react-native-url-polyfill/auto';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { createSupabaseAuthStorage } from './auth-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

let client: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return supabaseUrl.length > 0 && supabaseAnonKey.length > 0;
}

/** Logged once at first client init — helps debug publishable vs anon key issues. */
export function logSupabaseClientConfig(): void {
  const keyPrefix = supabaseAnonKey.slice(0, 12);
  console.log('[supabase] client config', {
    url: supabaseUrl || '(missing)',
    keyPrefix: keyPrefix ? `${keyPrefix}…` : '(missing)',
    publishableKey: supabaseAnonKey.startsWith('sb_publishable_'),
  });
}

export function getSupabaseClient(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase is not configured. Copy .env.example to .env and set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.',
    );
  }
  if (!client) {
    logSupabaseClientConfig();
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: createSupabaseAuthStorage(),
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  }
  return client;
}
