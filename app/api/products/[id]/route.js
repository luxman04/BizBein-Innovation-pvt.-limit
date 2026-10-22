import { NextResponse } from 'next/server';
import { getSessionUser } from '../../../../lib/auth';
import { findDbProductById, updateDbProduct, deleteDbProduct } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { id } = await Promise.resolve(params);
    const product = await findDbProductById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  } catch (err) {
    console.error('[API Product GET Error]:', err);
    return NextResponse.json({ error: 'Failed to retrieve product details.' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const user = await getSessionUser(request);
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      return NextResponse.json(
        { error: 'Forbidden. Administrative authorization required to update products.' },
        { status: 403 }
      );
    }

    const { id } = await Promise.resolve(params);
    const body = await request.json();
    
    // Non-superadmins cannot modify images
    if (user.role !== 'superadmin') {
      delete body.image;
    }

    const updated = await updateDbProduct(id, body);

    return NextResponse.json({
      success: true,
      message: `Product "${updated.name}" updated successfully.`,
      product: updated
    });
  } catch (err) {
    console.error('[API Product PATCH Error]:', err);
    return NextResponse.json({ error: err.message || 'Failed to update product.' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getSessionUser(request);
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      return NextResponse.json(
        { error: 'Forbidden. Administrative authorization required to delete products.' },
        { status: 403 }
      );
    }

    const { id } = await Promise.resolve(params);
    await deleteDbProduct(id);
    return NextResponse.json({ success: true, message: 'Product removed from catalog.' });
  } catch (err) {
    console.error('[API Product DELETE Error]:', err);
    return NextResponse.json({ error: err.message || 'Failed to delete product.' }, { status: 500 });
  }
}
