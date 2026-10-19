import { NextResponse } from 'next/server';
import { findUserByEmail, createUser } from '../../../../lib/db';
import { signAuthToken, createSessionCookie } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name, phone, uid } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists in database
    let user = await findUserByEmail(cleanEmail);

    if (!user) {
      // Create account automatically from Firebase verified profile
      user = await createUser({
        name: (name || cleanEmail.split('@')[0] || 'Industrial Client').trim(),
        email: cleanEmail,
        phone: (phone || '').trim(),
        passwordHash: `firebase_auth_${uid || Date.now()}`,
        role: 'customer'
      });
    }

    // Issue unified session token
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
      message: 'Signed in successfully with Firebase.'
    });

    response.headers.set('Set-Cookie', createSessionCookie(token));
    return response;
  } catch (err) {
    console.error('[API Firebase Session Error]:', err);
    return NextResponse.json({ error: 'Failed to establish authenticated session.' }, { status: 500 });
  }
}
