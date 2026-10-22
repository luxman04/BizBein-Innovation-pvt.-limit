import { NextResponse } from 'next/server';
import { getSessionUser } from '../../../../lib/auth';
import { getAllUsersForAdmin, setUserRole, createAdminAccount } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    if (user.role !== 'superadmin') {
      return NextResponse.json(
        { error: 'Forbidden. Super Administrator privileges required.' },
        { status: 403 }
      );
    }

    const users = await getAllUsersForAdmin('superadmin');
    return NextResponse.json({
      success: true,
      users
    });
  } catch (err) {
    console.error('[API SuperAdmin GET Users Error]:', err);
    return NextResponse.json({ error: err.message || 'Failed to retrieve user registry.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    if (user.role !== 'superadmin') {
      return NextResponse.json(
        { error: 'Forbidden. Super Administrator privileges required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, phone, password } = body;

    const newAdmin = await createAdminAccount({ name, email, phone, password }, user);

    return NextResponse.json({
      success: true,
      message: `Administrator "${newAdmin.name}" (${newAdmin.email}) created successfully.`,
      admin: newAdmin
    }, { status: 201 });
  } catch (err) {
    console.error('[API SuperAdmin Create Admin Error]:', err);
    return NextResponse.json({ error: err.message || 'Failed to create administrator.' }, { status: 400 });
  }
}

export async function PATCH(request) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    if (user.role !== 'superadmin') {
      return NextResponse.json(
        { error: 'Forbidden. Super Administrator privileges required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json({ error: 'Target userId and new role are required.' }, { status: 400 });
    }

    const updatedUser = await setUserRole(userId, role, user);

    return NextResponse.json({
      success: true,
      message: `User privileges updated to "${role}".`,
      user: updatedUser
    });
  } catch (err) {
    console.error('[API SuperAdmin Update Role Error]:', err);
    return NextResponse.json({ error: err.message || 'Failed to update user privileges.' }, { status: 400 });
  }
}
