'use client';

import React from 'react';
import {
  Eye,
  Copy,
  Edit2,
  Archive,
  Check,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
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
            className="h-14 bg-[rgba(10,15,28,0.6)] border border-[rgba(148,163,184,0.12)] rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-12 text-center my-6">
        <div className="relative w-14 h-14 rounded-full bg-gradient-primary-soft flex items-center justify-center mx-auto mb-4">
          <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-20 blur-lg" />
          <span className="relative text-[#4D7CFF] text-2xl">✦</span>
        </div>
        <h4 className="text-base font-bold text-[#F8FAFC] mb-1">Chưa có tài khoản nào</h4>
        <p className="text-xs text-[#94A3B8] mb-6 max-w-sm mx-auto">
          Tạo tài khoản NOVA đầu tiên với tên gọi ngẫu nhiên và mật khẩu an toàn trong vài giây.
        </p>
        <button
          onClick={onOpenAddModal}
          className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold"
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[rgba(0,208,132,0.1)] text-[#00D084] border border-[rgba(0,208,132,0.25)] shadow-[0_0_12px_rgba(0,208,132,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D084] shadow-[0_0_6px_rgba(0,208,132,0.6)] animate-pulse-glow" />
            ACTIVE
          </span>
        );
      case 'PAUSED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[rgba(245,158,11,0.1)] text-[#F59E0B] border border-[rgba(245,158,11,0.25)] shadow-[0_0_12px_rgba(245,158,11,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
            PAUSED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[rgba(139,92,246,0.1)] text-[#8B5CF6] border border-[rgba(139,92,246,0.25)] shadow-[0_0_12px_rgba(139,92,246,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] shadow-[0_0_6px_rgba(139,92,246,0.6)]" />
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

  const actionButton = (
    label: string,
    onClick: () => void,
    icon: React.ReactNode,
    color = '#94A3B8',
    hoverColor = '#F8FAFC'
  ) => (
    <button
      onClick={onClick}
      className="group/btn relative p-2 rounded-lg bg-[rgba(10,15,28,0.6)] border border-[rgba(148,163,184,0.12)] transition-all duration-200 hover:shadow-glow-blue-sm"
      title={label}
      aria-label={label}
      style={{ color }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = hoverColor;
        e.currentTarget.style.borderColor = 'rgba(77,124,255,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = color;
        e.currentTarget.style.borderColor = 'rgba(148,163,184,0.12)';
      }}
    >
      {icon}
    </button>
  );

  return (
    <div className="hidden md:block glass-panel rounded-xl overflow-hidden my-6">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[rgba(148,163,184,0.12)] bg-[rgba(5,8,18,0.4)] text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
              <th className="py-3.5 px-4 font-semibold">ID</th>
              <th className="py-3.5 px-4 font-semibold">USERNAME</th>
              <th className="py-3.5 px-4 font-semibold">STATUS</th>
              <th className="py-3.5 px-4 font-semibold">GHI CHÚ</th>
              <th className="py-3.5 px-4 font-semibold">CREATED</th>
              <th className="py-3.5 px-4 text-right font-semibold">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(148,163,184,0.06)]">
            {accounts.map((acc) => (
              <tr
                key={acc.id}
                className="group relative transition-colors duration-150 hover:bg-[rgba(77,124,255,0.03)]"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(77,124,255,0.04), transparent)',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '0% 100%',
                  backgroundPosition: 'left center',
                  transition: 'background-size 0.3s ease, background-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundSize = '100% 100%';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundSize = '0% 100%';
                }}
              >
                <td className="py-3.5 px-4">
                  <span className="font-mono font-bold text-[13px] text-[#4D7CFF] tracking-wide">
                    {acc.nova_id}
                  </span>
                </td>
                <td className="py-3.5 px-4 relative">
                  <span className="font-mono font-semibold text-[13px] text-[#F8FAFC]">
                    {acc.username}
                  </span>
                </td>
                <td className="py-3.5 px-4 relative">{statusBadge(acc.status)}</td>
                <td className="py-3.5 px-4 relative text-xs text-[#94A3B8] max-w-[180px] truncate" title={acc.notes || ''}>
                  {acc.notes || <span className="text-[#64748B]/50 italic">—</span>}
                </td>
                <td className="py-3.5 px-4 relative text-xs text-[#94A3B8] font-mono">
                  {formatDate(acc.created_at)}
                </td>
                <td className="py-3.5 px-4 relative">
                  <div className="flex items-center justify-end gap-1.5">
                    {actionButton('Xem / Sử dụng ngay', () => onView(acc), <Eye className="w-4 h-4" />, '#4D7CFF', '#4D7CFF')}
                    {actionButton('Copy Username', () => onCopyUsername(acc.username), <Copy className="w-4 h-4" />)}
                    {actionButton('Copy Password', () => onCopyPassword(acc), <span className="text-[10px] font-mono font-bold px-0.5">PWD</span>, '#8B5CF6', '#8B5CF6')}
                    {actionButton('Chỉnh sửa', () => onEdit(acc), <Edit2 className="w-4 h-4" />, '#94A3B8', '#4D7CFF')}
                    {acc.status === 'ACTIVE' && actionButton('Tạm dừng', () => onEdit(acc), <Pause className="w-4 h-4" />, '#F59E0B', '#F59E0B')}
                    {acc.status === 'PAUSED' && actionButton('Kích hoạt', () => onEdit(acc), <Play className="w-4 h-4" />, '#00D084', '#00D084')}
                    {acc.status !== 'ARCHIVED' && actionButton('Lưu trữ', () => onArchive(acc), <Archive className="w-4 h-4" />, '#F43F5E', '#F43F5E')}
                    {acc.status === 'ARCHIVED' && (
                      <span className="w-9 h-9 flex items-center justify-center text-[#64748B]/40">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer / Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-[rgba(148,163,184,0.12)] bg-[rgba(5,8,18,0.3)]">
        <div className="text-[11px] text-[#64748B]">
          Hiển thị <span className="text-[#F8FAFC] font-semibold">1</span> đến{' '}
          <span className="text-[#F8FAFC] font-semibold">{accounts.length}</span> của{' '}
          <span className="text-[#F8FAFC] font-semibold">{accounts.length}</span> tài khoản
        </div>

        <div className="flex items-center gap-1">
          <button
            className="p-1.5 rounded-lg bg-[rgba(10,15,28,0.6)] border border-[rgba(148,163,184,0.12)] text-[#64748B] hover:text-[#F8FAFC] hover:border-[#4D7CFF]/30 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            disabled
            aria-label="Trang trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold bg-gradient-primary text-white shadow-glow-blue-sm border border-[rgba(77,124,255,0.3)]"
            aria-current="page"
          >
            1
          </button>
          <button
            className="p-1.5 rounded-lg bg-[rgba(10,15,28,0.6)] border border-[rgba(148,163,184,0.12)] text-[#64748B] hover:text-[#F8FAFC] hover:border-[#4D7CFF]/30 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            disabled
            aria-label="Trang sau"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
