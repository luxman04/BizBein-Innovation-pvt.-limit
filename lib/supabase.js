import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY;

export function getSupabaseClient() {
  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl.includes('placeholder') ||
    supabaseUrl.includes('your-project') ||
    supabaseAnonKey.includes('your_supabase_anon_key')
  ) {
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

export async function sendSupabaseOtp(email) {
  const supabase = getSupabaseClient();
  if (!supabase) return { configured: false };
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true }
  });
  if (error) {
    console.error('[Supabase Auth] signInWithOtp error:', error.message);
    return { configured: true, success: false, error: error.message };
  }
  return { configured: true, success: true };
}

export async function verifySupabaseOtp(email, token) {
  const supabase = getSupabaseClient();
  if (!supabase) return { configured: false };
  let res = await supabase.auth.verifyOtp({ email, token, type: 'email' });
  if (res.error) {
    res = await supabase.auth.verifyOtp({ email, token, type: 'signup' });
  }
  return {
    configured: true,
    success: !res.error,
    user: res.data?.user || null,
    error: res.error?.message
  };
}
