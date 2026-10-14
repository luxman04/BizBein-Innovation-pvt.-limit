import { NextResponse } from 'next/server';
import { getSessionUser } from '../../../../lib/auth';
import { findOrderById } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const { id } = params;
    const order = await findOrderById(id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    // Access control: customer can only view their own order; admin can view any
    if (order.userId !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied to this order.' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      order
    });
  } catch (err) {
    console.error('[API Get Single Order Error]:', err);
    return NextResponse.json({ error: 'Failed to retrieve order details.' }, { status: 500 });
  }
}
