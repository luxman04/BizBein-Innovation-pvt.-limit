import { NextResponse } from 'next/server';
import { findUserByEmail, checkRateLimit } from '../../../../lib/db';
import { verifyPassword, signAuthToken, createSessionCookie, getClientIp } from '../../../../lib/auth';

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
        { error: `Too many login requests. Please try again in ${ipLimit.retryAfterSeconds} seconds.` },
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
        { error: `Too many login attempts. Please try again in ${emailLimit.retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }

    // Verify user credentials
    let user = await findUserByEmail(cleanEmail);
    const superAdminEmail = (process.env.SUPERADMIN_EMAIL || '').toLowerCase().trim();
    const superAdminPassword = process.env.SUPERADMIN_PASSWORD;

    let isValid = false;
    if (superAdminEmail && cleanEmail === superAdminEmail && superAdminPassword && password === superAdminPassword) {
      isValid = true;
      if (!user) {
        user = await findUserByEmail(cleanEmail);
      }
    } else if (user) {
      isValid = await verifyPassword(password, user.passwordHash);
    }

    if (!user || !isValid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Direct password login: Issue session token
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
      message: 'Signed in successfully.'
    });

    response.headers.set('Set-Cookie', createSessionCookie(token));
    return response;
  } catch (err) {
    console.error('[API Login Error]:', err);
    return NextResponse.json({ error: 'An unexpected error occurred during login.' }, { status: 500 });
  }
}
