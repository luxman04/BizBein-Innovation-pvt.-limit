import { NextResponse } from 'next/server';
import {
  findOtpChallenge,
  saveOtpChallenge,
  invalidateOtpChallenge,
  getOtpCooldownSeconds,
  checkRateLimit,
  findUserByEmail
} from '../../../../lib/db';
import { getClientIp } from '../../../../lib/auth';
import { createOtpChallenge } from '../../../../lib/otp';
import { sendSupabaseOtp } from '../../../../lib/supabase';

export async function POST(request) {
  try {
    const body = await request.json();
    const { challengeId, email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const ip = getClientIp(request);

    // Rate limiting: IP level
    const ipLimit = await checkRateLimit({
      key: `resend_ip:${ip}`,
      limit: 10,
      windowMs: 15 * 60 * 1000
    });
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: `Too many resend requests from this device. Please wait ${ipLimit.retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }

    // Rate limiting: Email level
    const emailLimit = await checkRateLimit({
      key: `resend_email:${cleanEmail}`,
      limit: 6,
      windowMs: 15 * 60 * 1000
    });
    if (!emailLimit.allowed) {
      return NextResponse.json(
        { error: `Too many resend requests for this email. Please wait ${emailLimit.retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }

    // Enforce 60-second cooldown
    const cooldownRemaining = await getOtpCooldownSeconds(cleanEmail);
    if (cooldownRemaining > 0) {
      return NextResponse.json(
        {
          error: `Please wait ${cooldownRemaining} seconds before requesting a new code.`,
          cooldownRemaining
        },
        { status: 429 }
      );
    }

    // Invalidate previous challenge if provided
    let purpose = 'login';
    let pendingUserData = null;

    if (challengeId) {
      const oldChallenge = await findOtpChallenge(challengeId, cleanEmail);
      if (oldChallenge) {
        purpose = oldChallenge.purpose || 'login';
        pendingUserData = oldChallenge.pendingUserData || null;
        await invalidateOtpChallenge(challengeId);
      }
    }

    // Dispatch fresh real OTP via Supabase Auth
    const emailResult = await sendSupabaseOtp(cleanEmail);
    if (!emailResult?.success) {
      const errText = emailResult?.error || 'Failed to dispatch verification email.';
      const isRateLimit = errText.toLowerCase().includes('rate limit');
      const userMessage = isRateLimit
        ? 'Supabase email rate limit exceeded (3 emails/hr on default service). Please wait before requesting another code, or enable Custom SMTP in Supabase Dashboard.'
        : errText;
      return NextResponse.json({ error: userMessage }, { status: isRateLimit ? 429 : 500 });
    }

    // Create and save fresh challenge session
    const { challenge: newChallenge } = createOtpChallenge({
      email: cleanEmail,
      purpose,
      pendingUserData
    });
    await saveOtpChallenge(newChallenge);

    return NextResponse.json({
      success: true,
      challengeId: newChallenge.challengeId,
      email: cleanEmail,
      cooldownSeconds: 60,
      message: 'A new 6-digit verification code has been sent to your email.'
    });
  } catch (err) {
    console.error('[API Resend OTP Error]:', err);
    return NextResponse.json({ error: 'An unexpected error occurred while resending code.' }, { status: 500 });
  }
}
