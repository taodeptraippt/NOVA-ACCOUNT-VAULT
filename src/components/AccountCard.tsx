'use client';

import React from 'react';
import { Eye, Copy, Edit2, Archive, MoreHorizontal } from 'lucide-react';
import { Account } from '@/lib/api';

interface AccountCardProps {
  accounts: Account[];
  loading: boolean;
  onView: (account: Account) => void;
  onCopyUsername: (username: string) => void;
  onCopyPassword: (account: Account) => void;
  onEdit: (account: Account) => void;
  onArchive: (account: Account) => void;
}

export const AccountCardList: React.FC<AccountCardProps> = ({
  accounts,
  loading,
  onView,
  onCopyUsername,
  onCopyPassword,
  onEdit,
  onArchive,
}) => {
  if (loading) {
    return (
      <div className="md:hidden space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-[#0F1420] border border-[#20283A] rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="text-[11px] font-semibold text-[#22C55E] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
            ACTIVE
          </span>
        );
      case 'PAUSED':
        return (
          <span className="text-[11px] font-semibold text-[#F59E0B] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
            PAUSED
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-semibold text-[#8993A4] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8993A4]"></span>
            ARCHIVED
          </span>
        );
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="md:hidden space-y-3">
      {accounts.map((acc) => (
        <div
          key={acc.id}
          className="bg-[#0F1420] border border-[#20283A] rounded-xl p-4 shadow-md space-y-3"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#20283A]/60 pb-2">
            <span className="font-mono text-sm font-bold text-[#4F7CFF]">{acc.nova_id}</span>
            {statusBadge(acc.status)}
          </div>

          {/* Body */}
          <div>
            <div className="font-mono text-base font-bold text-[#F5F7FA] mb-1">{acc.username}</div>
            <div className="text-[11px] text-[#8993A4]">Tạo ngày: {formatDate(acc.created_at)}</div>
            {acc.notes && <div className="text-xs text-[#8993A4] mt-1 italic">"{acc.notes}"</div>}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onView(acc)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#4F7CFF] text-white text-xs font-bold transition-all active:scale-95"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Xem / Sử dụng</span>
            </button>

            <button
              onClick={() => onCopyUsername(acc.username)}
              className="px-3 py-2 rounded-lg bg-[#20283A] text-[#F5F7FA] text-xs font-semibold hover:bg-[#2A354D] transition-colors"
              title="Copy Username"
            >
              Copy User
            </button>

            <button
              onClick={() => onCopyPassword(acc)}
              className="px-3 py-2 rounded-lg bg-[#20283A] text-[#7C5CFF] text-xs font-semibold hover:bg-[#2A354D] transition-colors"
              title="Copy Password"
            >
              Copy Pwd
            </button>

            <button
              onClick={() => onEdit(acc)}
              className="p-2 rounded-lg bg-[#20283A] text-[#8993A4] hover:text-[#F5F7FA] transition-colors"
              aria-label="Sửa"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
