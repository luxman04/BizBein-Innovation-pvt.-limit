// BizBein Innovations Pvt. Ltd. — OTP Session Tracking Lifecycle
import crypto from 'crypto';

export const OTP_EXPIRATION_MS = 5 * 60 * 1000; // 5 minutes
export const OTP_RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
export const OTP_MAX_ATTEMPTS = 5;

/**
 * Create an OTP verification session tracking record.
 * Real OTP code generation and dispatch is handled securely by Supabase Auth.
 */
export function createOtpChallenge({ email, purpose, pendingUserData = null }) {
  const challengeId = `otp_${crypto.randomBytes(16).toString('hex')}`;
  const now = Date.now();

  const challenge = {
    challengeId,
    email: email.toLowerCase().trim(),
    purpose, // 'login' | 'register'
    attempts: 0,
    maxAttempts: OTP_MAX_ATTEMPTS,
    expiresAt: now + OTP_EXPIRATION_MS,
    lastSentAt: now,
    verified: false,
    invalidated: false,
    pendingUserData,
    createdAt: new Date(now).toISOString()
  };

  return { challengeId, challenge };
}
