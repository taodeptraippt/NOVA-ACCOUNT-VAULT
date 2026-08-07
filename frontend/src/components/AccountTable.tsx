'use client';

import React from 'react';
import { Eye, Copy, Edit2, Archive, Check } from 'lucide-react';
import { Account } from '@/lib/api';

interface AccountTableProps {
  accounts: Account[];
  loading: boolean;
  onView: (account: Account) => void;
  onCopyUsername: (username: string) => void;
  onCopyPassword: (account: Account) => void;
  onEdit: (account: Account) => void;
  onArchive: (account: Account) => void;
  onOpenAddModal: () => void;
}

export const AccountTable: React.FC<AccountTableProps> = ({
  accounts,
  loading,
  onView,
  onCopyUsername,
  onCopyPassword,
  onEdit,
  onArchive,
  onOpenAddModal,
}) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-14 bg-[#0F1420] border border-[#20283A] rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="bg-[#0F1420] border border-[#20283A] rounded-xl p-12 text-center my-6">
        <div className="w-12 h-12 rounded-full bg-[#20283A] text-[#4F7CFF] flex items-center justify-center mx-auto mb-4 font-bold text-xl">
          ✦
        </div>
        <h4 className="text-base font-bold text-[#F5F7FA] mb-1">Chưa có tài khoản nào</h4>
        <p className="text-xs text-[#8993A4] mb-6 max-w-sm mx-auto">
          Tạo tài khoản NOVA đầu tiên với tên gọi ngẫu nhiên và mật khẩu an toàn trong vài giây.
        </p>
        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#4F7CFF] hover:bg-[#3B69EE] text-white text-xs font-bold transition-all shadow-lg shadow-[#4F7CFF]/20"
        >
          <span>+ Thêm tài khoản đầu tiên</span>
        </button>
      </div>
    );
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
            ACTIVE
          </span>
        );
      case 'PAUSED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
            PAUSED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#8993A4]/10 text-[#8993A4] border border-[#8993A4]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8993A4]"></span>
            ARCHIVED
          </span>
        );
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="hidden md:block overflow-hidden rounded-xl border border-[#20283A] bg-[#0F1420] shadow-xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#20283A] bg-[#080B12]/80 text-[11px] font-bold text-[#8993A4] uppercase tracking-wider">
            <th className="py-3.5 px-4">ID</th>
            <th className="py-3.5 px-4">USERNAME</th>
            <th className="py-3.5 px-4">STATUS</th>
            <th className="py-3.5 px-4">CREATED</th>
            <th className="py-3.5 px-4 text-right">ACTION</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#20283A] text-sm">
          {accounts.map((acc) => (
            <tr key={acc.id} className="hover:bg-[#151C2C] transition-colors group">
              <td className="py-3.5 px-4 font-mono font-bold text-[#4F7CFF]">{acc.nova_id}</td>
              <td className="py-3.5 px-4 font-mono font-semibold text-[#F5F7FA]">
                {acc.username}
              </td>
              <td className="py-3.5 px-4">{statusBadge(acc.status)}</td>
              <td className="py-3.5 px-4 text-xs text-[#8993A4] font-mono">
                {formatDate(acc.created_at)}
              </td>
              <td className="py-3.5 px-4 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => onView(acc)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#20283A] hover:bg-[#4F7CFF] text-[#F5F7FA] text-xs font-semibold transition-colors"
                    title="Xem / Sử dụng ngay"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Xem</span>
                  </button>
                  <button
                    onClick={() => onCopyUsername(acc.username)}
                    className="p-1.5 rounded bg-[#20283A] hover:bg-[#2A354D] text-[#8993A4] hover:text-[#F5F7FA] transition-colors"
                    title="Copy Username"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onCopyPassword(acc)}
                    className="p-1.5 rounded bg-[#20283A] hover:bg-[#2A354D] text-[#8993A4] hover:text-[#7C5CFF] transition-colors"
                    title="Copy Password"
                  >
                    <span className="text-[10px] font-mono font-bold px-0.5">PWD</span>
                  </button>
                  <button
                    onClick={() => onEdit(acc)}
                    className="p-1.5 rounded bg-[#20283A] hover:bg-[#2A354D] text-[#8993A4] hover:text-[#F5F7FA] transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {acc.status !== 'ARCHIVED' && (
                    <button
                      onClick={() => onArchive(acc)}
                      className="p-1.5 rounded bg-[#20283A] hover:bg-[#EF4444]/20 text-[#8993A4] hover:text-[#EF4444] transition-colors"
                      title="Lưu trữ"
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
