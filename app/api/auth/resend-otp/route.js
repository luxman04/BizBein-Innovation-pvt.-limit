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
import { sendOtpEmail } from '../../../../lib/notifications';

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
    let userName = '';

    if (challengeId) {
      const oldChallenge = await findOtpChallenge(challengeId, cleanEmail);
      if (oldChallenge) {
        purpose = oldChallenge.purpose || 'login';
        pendingUserData = oldChallenge.pendingUserData || null;
        if (pendingUserData?.name) {
          userName = pendingUserData.name;
        }
        await invalidateOtpChallenge(challengeId);
      }
    }

    if (!userName) {
      const user = await findUserByEmail(cleanEmail);
      if (user?.name) userName = user.name;
    }

    // Generate secure 6-digit OTP challenge (stores hash, returns plainOtp for email dispatch)
    const { plainOtp, challenge: newChallenge } = createOtpChallenge({
      email: cleanEmail,
      purpose,
      pendingUserData
    });

    // Dispatch fresh real OTP via Resend
    const emailResult = await sendOtpEmail({
      to: cleanEmail,
      otp: plainOtp,
      purpose,
      userName
    });

    if (!emailResult?.success) {
      const errText = emailResult?.error || 'Failed to dispatch verification email.';
      return NextResponse.json({ error: errText }, { status: 400 });
    }

    // Create and save fresh challenge session
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
