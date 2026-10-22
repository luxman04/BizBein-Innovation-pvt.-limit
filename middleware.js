import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'bizbein_industrial_jwt_secret_2026_production';
const AUTH_COOKIE_NAME = 'bizbein_session_token';

async function verifyJwt(token, secret) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, signatureB64] = parts;

  let payload;
  try {
    const rawPayload = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
    payload = JSON.parse(rawPayload);
  } catch (e) {
    return null;
  }

  // Check expiration timestamp
  if (payload.exp && Date.now() >= payload.exp * 1000) {
    return null;
  }

  // Cryptographically verify signature using Web Crypto API
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(`${headerB64}.${payloadB64}`);
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const binarySig = atob(signatureB64.replace(/-/g, '+').replace(/_/g, '/'));
    const sigBytes = new Uint8Array(binarySig.length);
    for (let i = 0; i < binarySig.length; i++) {
      sigBytes[i] = binarySig.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, data);
    return isValid ? payload : null;
  } catch (err) {
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  const payload = await verifyJwt(token, JWT_SECRET);

  // If token is invalid or missing
  if (!payload) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Authentication required. Please sign in with email verification.' },
        { status: 401 }
      );
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If admin route, enforce admin or superadmin role on the server
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (payload.role !== 'admin' && payload.role !== 'superadmin') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Forbidden. Administrator privileges required.' },
          { status: 403 }
        );
      }
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/checkout',
    '/admin/:path*',
    '/account/:path*',
    '/api/admin/:path*'
  ]
};
