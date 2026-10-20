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

/**
 * Dispatch an email OTP via Supabase Auth.
 */
export async function sendSupabaseOtp(email) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      configured: false,
      success: false,
      error: 'Supabase credentials not configured in environment variables.'
    };
  }

  const cleanEmail = email.toLowerCase().trim();
  const { data, error } = await supabase.auth.signInWithOtp({
    email: cleanEmail,
    options: {
      shouldCreateUser: true
    }
  });

  if (error) {
    return {
      configured: true,
      success: false,
      error: error.message,
      code: error.code,
      status: error.status || 400
    };
  }

  return { configured: true, success: true, data };
}

/**
 * Verify an email OTP via Supabase Auth.
 */
export async function verifySupabaseOtp(email, token) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      configured: false,
      success: false,
      error: 'Supabase credentials not configured in environment variables.'
    };
  }

  const cleanEmail = email.toLowerCase().trim();
  const cleanToken = token.toString().trim();

  let res = await supabase.auth.verifyOtp({
    email: cleanEmail,
    token: cleanToken,
    type: 'email'
  });

  if (res.error) {
    res = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: cleanToken,
      type: 'signup'
    });
  }

  if (res.error) {
    return {
      configured: true,
      success: false,
      error: res.error.message || 'Invalid or expired verification code.'
    };
  }

  return {
    configured: true,
    success: true,
    user: res.data?.user || null,
    session: res.data?.session || null
  };
}
