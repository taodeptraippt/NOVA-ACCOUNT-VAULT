'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Eye,
  Copy,
  Edit2,
  Archive,
  MoreHorizontal,
  Play,
  Pause,
  Check,
  Trash2,
} from 'lucide-react';
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
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (loading) {
    return (
      <div className="md:hidden space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-36 bg-[rgba(10,15,28,0.6)] border border-[rgba(148,163,184,0.12)] rounded-xl animate-pulse"
          />
        ))}
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
      return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="md:hidden space-y-3 pb-24">
      {accounts.map((acc) => (
        <div
          key={acc.id}
          className="relative overflow-hidden rounded-xl bg-[rgba(10,15,28,0.65)] border border-[rgba(148,163,184,0.12)] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.03)] backdrop-blur-sm"
        >
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-50"
            style={{
              background:
                acc.status === 'ACTIVE'
                  ? 'radial-gradient(ellipse 60% 40% at 100% 0%, rgba(0,208,132,0.06) 0%, transparent 70%)'
                  : acc.status === 'PAUSED'
                  ? 'radial-gradient(ellipse 60% 40% at 100% 0%, rgba(245,158,11,0.06) 0%, transparent 70%)'
                  : 'radial-gradient(ellipse 60% 40% at 100% 0%, rgba(139,92,246,0.06) 0%, transparent 70%)',
            }}
          />
          {/* Decorative line */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                acc.status === 'ACTIVE'
                  ? 'linear-gradient(90deg, transparent, rgba(0,208,132,0.3), transparent)'
                  : acc.status === 'PAUSED'
                  ? 'linear-gradient(90deg, transparent, rgba(245,158,11,0.3), transparent)'
                  : 'linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)',
            }}
          />

          {/* Header */}
          <div className="relative flex items-center justify-between mb-3">
            <span className="font-mono text-sm font-bold text-[#4D7CFF] tracking-wide">
              {acc.nova_id}
            </span>
            <div className="flex items-center gap-2">
              {statusBadge(acc.status)}
              {/* Overflow menu */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setOpenMenuId(openMenuId === acc.id ? null : acc.id)}
                  className="p-2 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[rgba(148,163,184,0.08)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Thao tác khác"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>

                {openMenuId === acc.id && (
                  <div className="absolute right-0 top-full mt-1 w-48 p-1.5 rounded-xl bg-[#0A0F1C] border border-[rgba(148,163,184,0.15)] shadow-2xl animate-slide-up z-30">
                    <button
                      onClick={() => {
                        onCopyUsername(acc.username);
                        setOpenMenuId(null);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[rgba(148,163,184,0.06)] transition-colors min-h-[44px]"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy Username</span>
                    </button>
                    <button
                      onClick={() => {
                        onCopyPassword(acc);
                        setOpenMenuId(null);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[rgba(148,163,184,0.06)] transition-colors min-h-[44px]"
                    >
                      <Copy className="w-4 h-4 text-[#8B5CF6]" />
                      <span>Copy Password</span>
                    </button>
                    <button
                      onClick={() => {
                        onEdit(acc);
                        setOpenMenuId(null);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[rgba(148,163,184,0.06)] transition-colors min-h-[44px]"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Chỉnh sửa</span>
                    </button>
                    {acc.status !== 'ARCHIVED' && (
                      <button
                        onClick={() => {
                          onArchive(acc);
                          setOpenMenuId(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs text-[#F43F5E] hover:bg-[rgba(244,63,94,0.1)] transition-colors min-h-[44px]"
                      >
                        <Archive className="w-4 h-4" />
                        <span>Lưu trữ</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="relative mb-3">
            <div className="font-mono text-base font-bold text-[#F8FAFC] mb-1">
              {acc.username}
            </div>
            <div className="text-[11px] text-[#64748B]">
              Tạo ngày: {formatDate(acc.created_at)}
            </div>
            {acc.notes && (
              <div className="text-xs text-[#94A3B8] mt-1.5 italic truncate">"{acc.notes}"</div>
            )}
          </div>

          {/* Primary Action */}
          <div className="relative flex items-center gap-2">
            <button
              onClick={() => onView(acc)}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-lg bg-gradient-primary text-white text-xs font-semibold shadow-glow-blue-sm active:scale-95 transition-all duration-200 min-h-[44px]"
            >
              <Eye className="w-4 h-4" />
              <span>Xem / Sử dụng</span>
            </button>
            <button
              onClick={() => onEdit(acc)}
              className="w-[44px] h-[44px] flex items-center justify-center rounded-lg bg-[rgba(10,15,28,0.6)] border border-[rgba(148,163,184,0.12)] text-[#94A3B8] hover:text-[#4D7CFF] hover:border-[#4D7CFF]/30 transition-all duration-200"
              aria-label="Chỉnh sửa"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
