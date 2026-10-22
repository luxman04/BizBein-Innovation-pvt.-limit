import { NextResponse } from 'next/server';
import { getSessionUser } from '../../../../lib/auth';
import { createOrder, findDbProductById } from '../../../../lib/db';
import { products as catalogProducts } from '../../../../data/products';
import { sendOrderNotifications } from '../../../../lib/notifications';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    // 1. Verify Authentication
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in to complete your order.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { items, shippingAddress, paymentMethod, orderNotes } = body;

    // 2. Validate Items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty. Please add items to checkout.' }, { status: 400 });
    }

    // 3. Server-side Price & Product Validation (Never trust client prices)
    const validatedItems = [];
    let serverSubtotal = 0;

    for (const item of items) {
      const product = (await findDbProductById(item.id)) || catalogProducts.find((p) => p.id === item.id);
      if (!product) {
        return NextResponse.json(
          { error: `Product "${item.name || item.id}" was not found in our catalog.` },
          { status: 400 }
        );
      }

      const qty = Math.max(1, parseInt(item.qty, 10) || 1);
      const unitPrice = product.price;
      const itemSubtotal = unitPrice * qty;

      serverSubtotal += itemSubtotal;
      validatedItems.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        image: product.image,
        unit: product.unit,
        price: unitPrice,
        qty,
        subtotal: itemSubtotal
      });
    }

    // Industrial standard: 18% GST
    const serverGst = Math.round(serverSubtotal * 0.18);
    const serverTotal = serverSubtotal + serverGst;

    // 4. Validate Shipping Address
    if (
      !shippingAddress ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      return NextResponse.json({ error: 'Please provide a complete delivery address with PIN code.' }, { status: 400 });
    }

    // 5. Generate Unique Order ID
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD-BIZ-${dateStr}-${randomSuffix}`;
    const targetUid = body.firebaseUid || user.firebaseUid || user.id;

    const newOrder = {
      orderId,
      userId: targetUid,
      uid: targetUid,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phone || shippingAddress.phone || '',
      companyName: shippingAddress.companyName || '',
      gstin: shippingAddress.gstin || '',
      shippingAddress: {
        fullName: shippingAddress.fullName || user.name,
        phone: shippingAddress.phone || user.phone || '',
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        pincode: shippingAddress.pincode.trim()
      },
      items: validatedItems,
      subtotal: serverSubtotal,
      gst: serverGst,
      freight: 0, // Free factory dispatch
      total: serverTotal,
      paymentMethod: paymentMethod || 'Bank Transfer / NEFT / RTGS',
      paymentStatus: paymentMethod === 'Pay on Delivery' ? 'Pending' : 'Pending Verification',
      orderStatus: 'Confirmed',
      orderNotes: orderNotes || '',
      notificationStatus: {
        email: 'pending',
        whatsapp: 'pending'
      },
      createdAt: new Date().toISOString()
    };

    // 6. Save in Database
    const savedOrder = await createOrder(newOrder);

    // 7. Dispatch Notifications asynchronously (non-blocking)
    sendOrderNotifications(savedOrder)
      .then((res) => {
        console.log(`[Order Notification] ${orderId} results:`, res);
      })
      .catch((e) => console.warn('[Order Notification Notice]:', e.message));

    return NextResponse.json({
      success: true,
      order: savedOrder,
      message: 'Order created successfully.'
    });
  } catch (err) {
    console.error('[API Create Order Error]:', err);
    return NextResponse.json({ error: err.message || 'Internal server error placing order.' }, { status: 500 });
  }
}
