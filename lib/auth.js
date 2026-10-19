// BizBein Innovations Pvt. Ltd. — Authentication & Session Service
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserById } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'bizbein_industrial_jwt_secret_2026_production';
export const AUTH_COOKIE_NAME = 'bizbein_session_token';

// ---------------- PASSWORD UTILITIES ----------------
export async function hashPassword(plainTextPassword) {
  if (!plainTextPassword || plainTextPassword.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainTextPassword, salt);
}

export async function verifyPassword(plainTextPassword, hashedPassword) {
  if (!plainTextPassword || !hashedPassword) return false;
  return bcrypt.compare(plainTextPassword, hashedPassword);
}

// ---------------- TOKEN & SESSION UTILITIES ----------------
export function signAuthToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role || 'customer',
    name: user.name
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d'
  });
}

export function verifyAuthToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

// Extract session token from Request (headers or cookies)
export function extractTokenFromRequest(request) {
  if (!request) return null;

  // 1. Authorization: Bearer <token>
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  // 2. Cookie header parsing
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = cookieHeader.split(';').map((c) => c.trim());
  for (const c of cookies) {
    if (c.startsWith(`${AUTH_COOKIE_NAME}=`)) {
      return decodeURIComponent(c.substring(AUTH_COOKIE_NAME.length + 1));
    }
  }

  return null;
}

// Get the authenticated user from a Next.js Request object
export async function getSessionUser(request) {
  const token = extractTokenFromRequest(request);
  if (!token) return null;

  const payload = verifyAuthToken(token);
  if (!payload || !payload.userId) return null;

  const user = await findUserById(payload.userId);
  if (!user) return null;

  // Exclude sensitive password hash
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

// Cookie header builder for responses
export function createSessionCookie(token, maxAgeSeconds = 7 * 24 * 60 * 60) {
  const isProd = process.env.NODE_ENV === 'production';
  return `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}${isProd ? '; Secure' : ''}`;
}

export function createClearSessionCookie() {
  const isProd = process.env.NODE_ENV === 'production';
  return `${AUTH_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${isProd ? '; Secure' : ''}`;
}

export function getClientIp(request) {
  if (!request) return '127.0.0.1';
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

