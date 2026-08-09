export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getAccounts, createAccount } from '@/lib/account_service';

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    if (!user) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });

    const params = req.nextUrl.searchParams;
    const query = params.get('query');
    const status = params.get('status');
    const sortBy = params.get('sort_by') || 'newest';

    const accounts = getAccounts({ query, status, sortBy });
    return NextResponse.json(accounts);
  } catch (e: any) {
    console.error('[accounts GET] failed', e);
    return NextResponse.json({ detail: e?.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    if (!user) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ detail: 'Invalid JSON body' }, { status: 400 });
    }

    const username = (body?.username || '').trim();
    const password = (body?.password || '').trim();
    const status = (body?.status || 'ACTIVE').toUpperCase();
    const notes = (body?.notes || '').trim();

    if (!username || !password) {
      return NextResponse.json({ detail: 'Username and password are required' }, { status: 400 });
    }

    try {
      const acc = createAccount({ username, password, status, notes });
      return NextResponse.json(acc, { status: 201 });
    } catch (e: any) {
      return NextResponse.json({ detail: e.message || 'Failed to create account' }, { status: 400 });
    }
  } catch (e: any) {
    console.error('[accounts POST] failed', e);
    return NextResponse.json({ detail: e?.message || 'Internal server error' }, { status: 500 });
  }
}

