import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getAllAccountsWithPasswords } from '@/lib/account_service';

export async function GET(req: NextRequest) {
  const user = requireAuth(req);
  if (!user) return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });

  const accounts = getAllAccountsWithPasswords();

  let content = '═══════════════════════════════════════════\n';
  content += '  NOVA ACCOUNT VAULT — BACKUP (Auto Export)\n';
  content += `  Ngày xuất: ${new Date().toLocaleString('vi-VN')}\n`;
  content += `  Tổng số tài khoản: ${accounts.length}\n`;
  content += '═══════════════════════════════════════════\n\n';

  accounts.forEach((a, idx) => {
    content += `[${a.nova_id}] — ${a.status}\n`;
    content += `  Username : ${a.username}\n`;
    content += `  Password : ${a.password}\n`;
    content += `  Ghi chú  : ${a.notes || '(trống)'}\n`;
    content += `  Ngày tạo : ${a.created_at}\n`;
    content += `-----------------------------------------------\n`;
  });

  if (accounts.length === 0) {
    content += 'Chưa có tài khoản nào trong vault.\n';
  }

  const filename = `nova_vault_backup_${new Date().toISOString().slice(0, 10)}.txt`;
  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
