import { NextResponse } from 'next/server';
import { getSessionUser } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      user
    });
  } catch (err) {
    console.error('[API Me Error]:', err);
    return NextResponse.json({ authenticated: false, user: null });
  }
}
