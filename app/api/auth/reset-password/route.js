import { NextResponse } from 'next/server';
import {
  findPasswordResetToken,
  deletePasswordResetToken,
  findUserByEmail,
  updateUser
} from '../../../../lib/db';
import { hashPassword } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Reset token is required.' }, { status: 400 });
    }
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters long.' }, { status: 400 });
    }

    const resetRecord = await findPasswordResetToken(token);
    if (!resetRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired password reset token. Please request a new link.' },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(resetRecord.email);
    if (!user) {
      return NextResponse.json({ error: 'User account not found.' }, { status: 404 });
    }

    const newHash = await hashPassword(newPassword);
    await updateUser(user.id, { passwordHash: newHash });
    await deletePasswordResetToken(token);

    return NextResponse.json({
      success: true,
      message: 'Password has been successfully updated. You may now log in.'
    });
  } catch (err) {
    console.error('[Reset Password Error]:', err);
    return NextResponse.json({ error: 'Failed to reset password.' }, { status: 500 });
  }
}
