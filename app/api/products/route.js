import { NextResponse } from 'next/server';
import { getSessionUser } from '../../../lib/auth';
import { getAllDbProducts, createDbProduct } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await getAllDbProducts();
    return NextResponse.json({ success: true, products });
  } catch (err) {
    console.error('[API Products GET Error]:', err);
    return NextResponse.json({ error: 'Failed to retrieve products.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // 1. Authenticate admin user
    const user = await getSessionUser(request);
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      return NextResponse.json(
        { error: 'Forbidden. Administrative authorization required to add products.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, categoryId, price } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Product name/title is required.' }, { status: 400 });
    }

    if (!categoryId) {
      return NextResponse.json({ error: 'Product category is required.' }, { status: 400 });
    }

    if (price === undefined || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      return NextResponse.json({ error: 'Valid product price is required.' }, { status: 400 });
    }

    // Only non-superadmins are restricted from custom images
    if (user.role !== 'superadmin') {
      delete body.image;
    }
    const newProduct = await createDbProduct(body);

    return NextResponse.json({
      success: true,
      message: `Product "${newProduct.name}" created successfully.`,
      product: newProduct
    }, { status: 201 });
  } catch (err) {
    console.error('[API Products POST Error]:', err);
    return NextResponse.json({ error: err.message || 'Failed to create product.' }, { status: 500 });
  }
}
