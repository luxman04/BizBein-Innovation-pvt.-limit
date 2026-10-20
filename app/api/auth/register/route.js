import { NextResponse } from 'next/server';
import { findUserByEmail, saveOtpChallenge, checkRateLimit, getOtpCooldownSeconds } from '../../../../lib/db';
import { hashPassword, getClientIp } from '../../../../lib/auth';
import { createOtpChallenge } from '../../../../lib/otp';
import { sendSupabaseOtp } from '../../../../lib/supabase';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, password } = body;

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Full name is required.' }, { status: 400 });
    }
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const ip = getClientIp(request);

    // Rate limiting: IP level
    const ipLimit = await checkRateLimit({
      key: `register_ip:${ip}`,
      limit: 10,
      windowMs: 15 * 60 * 1000
    });
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: `Too many registration requests from this device. Please try again in ${ipLimit.retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }

    // Rate limiting: Email level
    const emailLimit = await checkRateLimit({
      key: `register_email:${cleanEmail}`,
      limit: 5,
      windowMs: 15 * 60 * 1000
    });
    if (!emailLimit.allowed) {
      return NextResponse.json(
        { error: `Too many registration attempts for this email. Please try again in ${emailLimit.retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }

    // Check duplicate user
    const existing = await findUserByEmail(cleanEmail);
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email address already exists. Please sign in instead.' },
        { status: 409 }
      );
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

    // Hash password and store pending user data safely inside the challenge
    const passwordHash = await hashPassword(password);
    const pendingUserData = {
      name: name.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : '',
      passwordHash,
      role: 'customer'
    };

    // Dispatch real email OTP via Supabase Auth
    const emailResult = await sendSupabaseOtp(cleanEmail);
    if (!emailResult?.success) {
      const errText = emailResult?.error || 'Failed to dispatch verification email.';
      const isRateLimit = errText.toLowerCase().includes('rate limit');
      const userMessage = isRateLimit
        ? 'Supabase email rate limit exceeded (3 emails/hr on default service). Please wait before requesting another code, or enable Custom SMTP in Supabase Dashboard.'
        : errText;
      return NextResponse.json({ error: userMessage }, { status: isRateLimit ? 429 : 500 });
    }

    // Save session tracking challenge with pending registration details
    const { challenge } = createOtpChallenge({
      email: cleanEmail,
      purpose: 'register',
      pendingUserData
    });
    await saveOtpChallenge(challenge);

    // NOTE: Authenticated session is NOT granted until OTP verification succeeds.
    return NextResponse.json({
      success: true,
      otpRequired: true,
      challengeId: challenge.challengeId,
      email: cleanEmail,
      user: {
        name: name.trim(),
        email: cleanEmail
      },
      cooldownSeconds: 60,
      message: 'A 6-digit verification code has been sent to your email.'
    });
  } catch (err) {
    console.error('[API Register Error]:', err);
    return NextResponse.json({ error: err.message || 'Internal server error.' }, { status: 500 });
  }
}
