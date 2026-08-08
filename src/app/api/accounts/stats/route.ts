import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getAccountStats } from '@/lib/account_service';

export async function GET(req: NextRequest) {
  const user = requireAuth(req);
  if (!user) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });

  return NextResponse.json(getAccountStats());
}
