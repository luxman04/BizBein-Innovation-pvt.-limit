import { NextResponse } from 'next/server';
import { getSessionUser } from '../../../../lib/auth';
import { getAllOrders } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied. Administrator privileges required.' },
        { status: 403 }
      );
    }

    const orders = await getAllOrders();
    return NextResponse.json({
      success: true,
      orders
    });
  } catch (err) {
    console.error('[API Admin Get Orders Error]:', err);
    return NextResponse.json({ error: 'Failed to retrieve orders.' }, { status: 500 });
  }
}
