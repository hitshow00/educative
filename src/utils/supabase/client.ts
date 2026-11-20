import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

/**
 * Client Supabase pour les Client Components ('use client').
 * Gère automatiquement la synchronisation des cookies de session avec @supabase/ssr.
 */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
