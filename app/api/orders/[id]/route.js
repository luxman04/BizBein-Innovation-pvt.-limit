import { NextResponse } from 'next/server';
import { getSessionUser } from '../../../../lib/auth';
import { findOrderById, updateOrderStatus } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const order = await findOrderById(id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    const user = await getSessionUser(request);
    // If authenticated: enforce ownership unless admin
    if (user && user.role !== 'admin') {
      const isOwner = order.userId === user.id || 
        (user.email && order.customerEmail && order.customerEmail.toLowerCase() === user.email.toLowerCase());
      if (!isOwner) {
        return NextResponse.json({ error: 'Access denied to this order.' }, { status: 403 });
      }
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

export async function PATCH(request, { params }) {
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

    // Access control
    if (order.userId !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied to this order.' }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const { action, reason, orderStatus } = body;

    if (action === 'cancel' || orderStatus === 'Cancelled') {
      if (order.orderStatus === 'Delivered') {
        return NextResponse.json({ error: 'Delivered orders cannot be cancelled.' }, { status: 400 });
      }
      if (order.orderStatus === 'Cancelled') {
        return NextResponse.json({ error: 'Order is already cancelled.' }, { status: 400 });
      }

      const updated = await updateOrderStatus(id, {
        orderStatus: 'Cancelled',
        cancelReason: reason || 'Cancelled by customer',
        cancelledAt: new Date().toISOString()
      });

      return NextResponse.json({ success: true, order: updated });
    }

    if (action === 'receive' || orderStatus === 'Delivered') {
      const updated = await updateOrderStatus(id, {
        orderStatus: 'Delivered',
        receivedAt: new Date().toISOString()
      });
      return NextResponse.json({ success: true, order: updated });
    }

    if (user.role === 'admin') {
      const updated = await updateOrderStatus(id, body);
      return NextResponse.json({ success: true, order: updated });
    }

    return NextResponse.json({ error: 'Invalid update action.' }, { status: 400 });
  } catch (err) {
    console.error('[API Update Order Error]:', err);
    return NextResponse.json({ error: 'Failed to update order status.' }, { status: 500 });
  }
}
