export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { seedDefaultUsers, authenticateUser, issueToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    seedDefaultUsers();
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ detail: 'Invalid JSON body' }, { status: 400 });
    }

    const email = (body?.email || '').trim();
    const password = (body?.password || '').trim();

    const user = authenticateUser(email, password);
    if (!user) {
      return NextResponse.json({ detail: 'Incorrect email or password' }, { status: 401 });
    }

    return NextResponse.json({
      access_token: issueToken(user),
      token_type: 'bearer',
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (e: any) {
    console.error('[auth/login] failed', e);
    return NextResponse.json({ detail: e?.message || 'Internal server error' }, { status: 500 });
  }
}

