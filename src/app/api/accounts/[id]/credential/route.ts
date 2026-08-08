import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getAccountCredential } from '@/lib/account_service';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = requireAuth(req);
  if (!user) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });

  const id = parseInt(params.id, 10);
  if (isNaN(id)) return NextResponse.json({ detail: 'Invalid account id' }, { status: 400 });

  try {
    const { account, password } = getAccountCredential(id);
    return NextResponse.json({ id: account.id, nova_id: account.nova_id, username: account.username, password });
  } catch (e: any) {
    return NextResponse.json({ detail: e.message || 'Account not found' }, { status: 404 });
  }
}
