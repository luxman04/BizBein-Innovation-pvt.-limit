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
 * Dispatch a real email verification OTP via Supabase Auth.
 * Never generates or returns mock OTP codes.
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
    console.error('[Supabase Auth] signInWithOtp error:', error.message, error.code);
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
 * Register a user via Supabase Auth signUp with email verification.
 */
export async function signUpSupabaseUser({ email, password, name, phone }) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      configured: false,
      success: false,
      error: 'Supabase credentials not configured in environment variables.'
    };
  }

  const cleanEmail = email.toLowerCase().trim();
  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: {
      data: {
        name: name ? name.trim() : '',
        phone: phone ? phone.trim() : ''
      }
    }
  });

  if (error) {
    console.error('[Supabase Auth] signUp error:', error.message, error.code);
    return {
      configured: true,
      success: false,
      error: error.message,
      code: error.code,
      status: error.status || 400
    };
  }

  return { configured: true, success: true, user: data.user, session: data.session };
}

/**
 * Verify a 6-digit email OTP using Supabase Auth.
 * Genuine cryptographic verification only — no mock fallbacks.
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

  // 1. Try verify with type: 'email' (from signInWithOtp passwordless flow)
  let res = await supabase.auth.verifyOtp({
    email: cleanEmail,
    token: cleanToken,
    type: 'email'
  });

  // 2. If rejected, try type: 'signup' (from signUp verification flow)
  if (res.error) {
    res = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: cleanToken,
      type: 'signup'
    });
  }

  if (res.error) {
    console.warn('[Supabase Auth] verifyOtp failed:', res.error.message);
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
