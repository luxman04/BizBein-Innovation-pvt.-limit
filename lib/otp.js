// BizBein Innovations Pvt. Ltd. — OTP Cryptographic & Lifecycle Service
import crypto from 'crypto';

export const OTP_EXPIRATION_MS = 5 * 60 * 1000; // 5 minutes
export const OTP_RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
export const OTP_MAX_ATTEMPTS = 5;

// Generate secure random 6-digit numerical code (100000 - 999999)
export function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

// Generate random cryptographic salt
export function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

// Compute salted SHA-256 hash of OTP
export function hashOtp(otp, salt) {
  return crypto.createHash('sha256').update(`${salt}:${otp.toString().trim()}`).digest('hex');
}

// Timing-safe constant-time hash comparison to prevent timing attacks
export function verifyOtpHash(inputOtp, salt, storedHash) {
  if (!inputOtp || !salt || !storedHash) return false;
  const computedHash = hashOtp(inputOtp, salt);
  const bufComputed = Buffer.from(computedHash, 'utf8');
  const bufStored = Buffer.from(storedHash, 'utf8');
  if (bufComputed.length !== bufStored.length) return false;
  return crypto.timingSafeEqual(bufComputed, bufStored);
}

// Create an OTP challenge record (stores salt & hash only in DB, returns plainOtp for email dispatch)
export function createOtpChallenge({ email, purpose, pendingUserData = null }) {
  const challengeId = `otp_${crypto.randomBytes(16).toString('hex')}`;
  const salt = generateSalt();
  const plainOtp = generateOtp();
  const otpHash = hashOtp(plainOtp, salt);
  const now = Date.now();

  const challenge = {
    challengeId,
    email: email.toLowerCase().trim(),
    purpose, // 'login' | 'register'
    salt,
    otpHash,
    attempts: 0,
    maxAttempts: OTP_MAX_ATTEMPTS,
    expiresAt: now + OTP_EXPIRATION_MS,
    lastSentAt: now,
    verified: false,
    invalidated: false,
    pendingUserData,
    createdAt: new Date(now).toISOString()
  };

  return { plainOtp, challenge };
}
