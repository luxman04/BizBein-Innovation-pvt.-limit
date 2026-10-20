import { NextResponse } from 'next/server';
import { findUserByEmail, saveOtpChallenge, checkRateLimit, getOtpCooldownSeconds } from '../../../../lib/db';
import { verifyPassword, getClientIp } from '../../../../lib/auth';
import { createOtpChallenge } from '../../../../lib/otp';
import { sendOtpEmail } from '../../../../lib/notifications';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const ip = getClientIp(request);

    // Rate limiting: IP level
    const ipLimit = await checkRateLimit({
      key: `login_ip:${ip}`,
      limit: 15,
      windowMs: 15 * 60 * 1000
    });
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: `Too many login requests from this device. Please try again in ${ipLimit.retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }

    // Rate limiting: Email level
    const emailLimit = await checkRateLimit({
      key: `login_email:${cleanEmail}`,
      limit: 8,
      windowMs: 15 * 60 * 1000
    });
    if (!emailLimit.allowed) {
      return NextResponse.json(
        { error: `Too many login attempts for this account. Please try again in ${emailLimit.retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }

    // Account enumeration prevention: consistent response for missing user or bad password
    const user = await findUserByEmail(cleanEmail);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Enforce 60-second cooldown if an OTP was recently sent
    const cooldownRemaining = await getOtpCooldownSeconds(cleanEmail);
    if (cooldownRemaining > 0) {
      return NextResponse.json(
        {
          error: `Please wait ${cooldownRemaining} seconds before requesting a new verification code.`,
          cooldownRemaining
        },
        { status: 429 }
      );
    }

    // Generate secure 6-digit OTP challenge (stores hash, returns plainOtp for email dispatch)
    const { plainOtp, challenge } = createOtpChallenge({
      email: cleanEmail,
      purpose: 'login'
    });

    // Dispatch real email OTP via Resend
    const emailResult = await sendOtpEmail({
      to: cleanEmail,
      otp: plainOtp,
      purpose: 'login',
      userName: user.name
    });

    if (!emailResult?.success) {
      const errText = emailResult?.error || 'Failed to dispatch verification email.';
      return NextResponse.json({ error: errText }, { status: 400 });
    }

    // Save session tracking challenge
    await saveOtpChallenge(challenge);

    // NOTE: Authenticated session is NOT granted until OTP verification succeeds.
    return NextResponse.json({
      success: true,
      otpRequired: true,
      challengeId: challenge.challengeId,
      email: cleanEmail,
      user: {
        name: user.name,
        email: cleanEmail
      },
      cooldownSeconds: 60,
      message: 'A 6-digit verification code has been sent to your email.'
    });
  } catch (err) {
    console.error('[API Login Error]:', err);
    return NextResponse.json({ error: 'An unexpected error occurred during login.' }, { status: 500 });
  }
}
