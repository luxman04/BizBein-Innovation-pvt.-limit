import { NextResponse } from 'next/server';
import { getSessionUser } from '../../../lib/auth';
import { findOrdersByUserId } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    // Customers only access their own orders
    const orders = await findOrdersByUserId(user.id);
    return NextResponse.json({
      success: true,
      orders
    });
  } catch (err) {
    console.error('[API Get User Orders Error]:', err);
    return NextResponse.json({ error: 'Failed to retrieve orders.' }, { status: 500 });
  }
}
