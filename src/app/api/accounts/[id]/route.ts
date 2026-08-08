import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getAccountById, updateAccount, archiveAccount } from '@/lib/account_service';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = requireAuth(req);
  if (!user) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });

  const id = parseInt(params.id, 10);
  if (isNaN(id)) return NextResponse.json({ detail: 'Invalid account id' }, { status: 400 });

  const acc = getAccountById(id);
  if (!acc) return NextResponse.json({ detail: 'Account not found' }, { status: 404 });

  return NextResponse.json(acc);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = requireAuth(req);
  if (!user) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });

  const id = parseInt(params.id, 10);
  if (isNaN(id)) return NextResponse.json({ detail: 'Invalid account id' }, { status: 400 });

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    const acc = updateAccount(id, {
      username: body?.username !== undefined ? body.username.trim() : undefined,
      password: body?.password !== undefined ? body.password : undefined,
      status: body?.status !== undefined ? (body.status as string).toUpperCase() : undefined,
      notes: body?.notes !== undefined ? body.notes : undefined,
    });
    return NextResponse.json(acc);
  } catch (e: any) {
    return NextResponse.json({ detail: e.message || 'Failed to update account' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = requireAuth(req);
  if (!user) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });

  const id = parseInt(params.id, 10);
  if (isNaN(id)) return NextResponse.json({ detail: 'Invalid account id' }, { status: 400 });

  try {
    const acc = archiveAccount(id);
    return NextResponse.json(acc);
  } catch (e: any) {
    return NextResponse.json({ detail: e.message || 'Account not found' }, { status: 404 });
  }
}
