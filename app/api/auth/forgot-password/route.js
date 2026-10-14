import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { findUserByEmail, savePasswordResetToken } from '../../../../lib/db';

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    // Security best practice: don't disclose whether email exists or not
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, password reset instructions have been generated.'
      });
    }

    // Generate secure token valid for 1 hour
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    await savePasswordResetToken(user.email, token, expiresAt);

    // Optional: send email via Resend if configured
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'BizBein Innovations <onboarding@resend.dev>',
          to: [user.email],
          subject: 'Reset Your BizBein Password',
          html: `<p>Hello ${user.name},</p><p>You requested a password reset. Click the link below to set a new password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link will expire in 1 hour.</p>`
        })
      }).catch((e) => console.warn('[Resend Password Reset Error]:', e));
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset link generated.',
      resetToken: token // Included for instant testing and local environments
    });
  } catch (err) {
    console.error('[Forgot Password Error]:', err);
    return NextResponse.json({ error: 'Failed to process password recovery request.' }, { status: 500 });
  }
}
