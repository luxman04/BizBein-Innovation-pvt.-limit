import { NextResponse } from 'next/server';
import { getSessionUser } from '../../../../../lib/auth';
import { updateOrderStatus, findOrderById } from '../../../../../lib/db';

export async function PATCH(request, { params }) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    if (user.role !== 'admin' && user.role !== 'superadmin') {
      return NextResponse.json(
        { error: 'Access denied. Administrator privileges required.' },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { orderStatus, paymentStatus, trackingNumber } = body;

    const existing = await findOrderById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    const updated = await updateOrderStatus(id, {
      orderStatus,
      paymentStatus,
      trackingNumber
    });

    return NextResponse.json({
      success: true,
      order: updated,
      message: `Order ${id} updated successfully.`
    });
  } catch (err) {
    console.error('[API Admin Update Order Error]:', err);
    return NextResponse.json({ error: 'Failed to update order status.' }, { status: 500 });
  }
}
