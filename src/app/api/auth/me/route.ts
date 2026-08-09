export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });
    }
    return NextResponse.json({ id: user.id, email: user.email, role: user.role });
  } catch (e: any) {
    console.error('[auth/me] failed', e);
    return NextResponse.json({ detail: e?.message || 'Internal server error' }, { status: 500 });
  }
}

