import { NextResponse } from 'next/server';
import {
  findOtpChallenge,
  recordOtpAttempt,
  consumeOtpChallenge,
  invalidateOtpChallenge,
  findUserByEmail,
  createUser,
  checkRateLimit
} from '../../../../lib/db';
import { signAuthToken, createSessionCookie, getClientIp } from '../../../../lib/auth';
import { verifyOtpHash } from '../../../../lib/otp';

export async function POST(request) {
  try {
    const body = await request.json();
    const { challengeId, email, otp } = body;

    if (!challengeId || !email || !otp) {
      return NextResponse.json(
        { error: 'Verification code, email, and challenge ID are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim();
    const ip = getClientIp(request);

    // Rate limiting: Prevent IP brute-force guessing
    const ipLimit = await checkRateLimit({
      key: `verify_ip:${ip}`,
      limit: 25,
      windowMs: 15 * 60 * 1000
    });
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: `Too many verification attempts from this network. Please wait ${ipLimit.retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }

    // Format validation: 6-digit number
    if (!/^\d{6}$/.test(cleanOtp)) {
      return NextResponse.json(
        { error: 'Verification code must be exactly 6 numeric digits.' },
        { status: 400 }
      );
    }

    // Retrieve challenge
    const challenge = await findOtpChallenge(challengeId, cleanEmail);
    if (!challenge || challenge.invalidated || challenge.verified) {
      return NextResponse.json(
        { error: 'Invalid or expired verification session. Please request a new code.' },
        { status: 400 }
      );
    }

    // Check expiration (5 minutes)
    if (Date.now() > challenge.expiresAt) {
      await invalidateOtpChallenge(challengeId);
      return NextResponse.json(
        { error: 'Verification code has expired. Please request a new code.', expired: true },
        { status: 400 }
      );
    }

    // Check attempt limits (max 5 attempts)
    if (challenge.attempts >= (challenge.maxAttempts || 5)) {
      await invalidateOtpChallenge(challengeId);
      return NextResponse.json(
        { error: 'Maximum attempts exceeded. This code is now invalid. Please request a new code.', attemptsRemaining: 0 },
        { status: 400 }
      );
    }

    // Increment attempt counter atomically before comparison
    const updatedChallenge = await recordOtpAttempt(challengeId);

    // Cryptographically verify OTP with timing-safe comparison against stored salt and hash
    const isValid = verifyOtpHash(cleanOtp, challenge.salt, challenge.otpHash);

    if (!isValid) {
      const attemptsRemaining = Math.max(0, (challenge.maxAttempts || 5) - updatedChallenge.attempts);
      if (attemptsRemaining <= 0) {
        await invalidateOtpChallenge(challengeId);
        return NextResponse.json(
          {
            error: 'Maximum attempts exceeded. This code has been invalidated. Please request a new code.',
            attemptsRemaining: 0
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        {
          error: `Incorrect verification code. ${attemptsRemaining} attempt${attemptsRemaining === 1 ? '' : 's'} remaining.`,
          attemptsRemaining
        },
        { status: 400 }
      );
    }

    // OTP is valid! Consume challenge atomically to prevent replay
    await consumeOtpChallenge(challengeId);

    let user = null;

    if (challenge.purpose === 'register') {
      // Check if user already exists
      user = await findUserByEmail(cleanEmail);
      if (!user && challenge.pendingUserData) {
        user = await createUser(challenge.pendingUserData);
      }
    } else {
      user = await findUserByEmail(cleanEmail);
    }

    if (!user) {
      return NextResponse.json({ error: 'User account not found.' }, { status: 404 });
    }

    // Issue JWT session
    const token = signAuthToken(user);
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    };

    const response = NextResponse.json({
      success: true,
      user: safeUser,
      message: 'Verified and signed in successfully.'
    });

    response.headers.set('Set-Cookie', createSessionCookie(token));
    return response;
  } catch (err) {
    console.error('[API Verify OTP Error]:', err);
    return NextResponse.json({ error: 'An unexpected error occurred during verification.' }, { status: 500 });
  }
}
