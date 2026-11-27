import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (adminClient) {
    return adminClient;
  }

  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const secretKey = process.env.SUPABASE_SECRET_KEY?.trim();

  if (!supabaseUrl || !secretKey) {
    throw new Error('SUPABASE_URL atau SUPABASE_SECRET_KEY belum dikonfigurasi di .env.local');
  }

  adminClient = createClient(supabaseUrl, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return adminClient;
}