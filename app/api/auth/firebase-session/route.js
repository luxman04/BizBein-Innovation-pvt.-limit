import { NextResponse } from 'next/server';
import { findUserByEmail, findUserByPhone, createUser } from '../../../../lib/db';
import { signAuthToken, createSessionCookie } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name, phone, uid } = body;

    const cleanPhone = (phone || '').trim();
    const cleanEmail = email && email.includes('@')
      ? email.toLowerCase().trim()
      : (cleanPhone ? `${cleanPhone.replace(/[^0-9]/g, '')}@bizbein-phone.internal` : '');

    if (!cleanEmail && !cleanPhone) {
      return NextResponse.json({ error: 'Valid email address or contact number is required.' }, { status: 400 });
    }

    // Check if user already exists in database by phone or email
    let user = null;
    if (cleanPhone) {
      user = await findUserByPhone(cleanPhone);
    }
    if (!user && cleanEmail) {
      user = await findUserByEmail(cleanEmail);
    }

    const superAdminEmails = [
      (process.env.SUPERADMIN_EMAIL || '').toLowerCase().trim(),
      'luxmankumar628@gmail.com',
      'luxmank628@gmail.com'
    ].filter(Boolean);

    const isSuperAdmin = cleanEmail && superAdminEmails.includes(cleanEmail);

    if (!user) {
      // Create account automatically from Firebase verified profile
      user = await createUser({
        name: (name || cleanEmail.split('@')[0] || `Client ${cleanPhone.slice(-4)}` || 'Industrial Client').trim(),
        email: cleanEmail,
        phone: cleanPhone,
        passwordHash: `firebase_auth_${uid || Date.now()}`,
        role: isSuperAdmin ? 'superadmin' : 'customer'
      });
    } else if (isSuperAdmin && user.role !== 'superadmin') {
      user.role = 'superadmin';
    }

    if (uid && user) {
      user.firebaseUid = uid;
    }

    // Persist directly to Cloud Firestore users collection
    try {
      const { saveUserToFirestore } = await import('../../../../lib/firestore-users');
      await saveUserToFirestore({
        id: uid || user.id,
        firebaseUid: uid || user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: 'active'
      });
    } catch (e) {
      console.warn('[Firebase Session] Firestore user role sync deferred:', e.message);
    }

    // Issue unified session token
    const token = signAuthToken(user);
    const safeUser = {
      id: user.id,
      firebaseUid: uid || user.firebaseUid || user.id,
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
