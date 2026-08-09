export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getAllAccountsWithPasswords } from '@/lib/account_service';

export async function GET(req: NextRequest) {
  const user = requireAuth(req);
  if (!user) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });

  const accounts = getAllAccountsWithPasswords();
  const lines: string[] = [];
  lines.push('════════════════════════════════════════════════════════════');
  lines.push('  NOVA ACCOUNT VAULT — BACKUP (Auto Export)');
  lines.push('════════════════════════════════════════════════════════════');
  lines.push('  Ngày xuất: ' + new Date().toLocaleString('vi-VN'));
  lines.push('  Tổng số tài khoản: ' + accounts.length);
  lines.push('════════════════════════════════════════════════════════════');
  lines.push('');

  if (accounts.length === 0) {
    lines.push('Chưa có tài khoản nào trong vault.');
  } else {
    accounts.forEach((account, idx) => {
      lines.push(`[${idx + 1}] ${account.nova_id} — ${account.status}`);
      lines.push('      Username: ' + account.username);
      lines.push('      Password: ' + account.password);
      lines.push('      Notes: ' + (account.notes || '(không có)'));
      lines.push('      Created: ' + account.created_at);
      lines.push('');
    });
  }

  const text = lines.join('\n');
  const filename = 'nova_vault_backup_' + new Date().toISOString().slice(0, 10) + '.txt';

  return new NextResponse(text, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': 'attachment; filename="' + filename + '"',
    },
  });
}
