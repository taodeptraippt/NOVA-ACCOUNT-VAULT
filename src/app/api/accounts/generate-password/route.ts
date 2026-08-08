import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { generateStrongPassword } from '@/lib/password';

export async function POST(req: NextRequest) {
  const user = requireAuth(req);
  if (!user) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });

  return NextResponse.json({ password: generateStrongPassword() });
}
