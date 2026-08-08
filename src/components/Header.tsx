'use client';

import React from 'react';
import { Shield, LogOut, User as UserIcon, Sparkles, FileDown } from 'lucide-react';
import { User } from '@/lib/api';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onOpenAddModal: () => void;
  onExport?: () => void;
  exporting?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onOpenAddModal, onExport, exporting }) => {
  return (
    <header className="bg-[#0F1420] border-b border-[#20283A] sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#4F7CFF] to-[#7C5CFF] flex items-center justify-center shadow-md shadow-[#4F7CFF]/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-wider text-[#F5F7FA]">NOVA</span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#20283A] text-[#8993A4] font-medium tracking-wide uppercase">
                Vault MVP
              </span>
            </div>
            <p className="text-[11px] text-[#8993A4] hidden sm:block">Hệ thống quản lý tài khoản nội bộ</p>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-3">
          {/* User Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#080B12] border border-[#20283A]">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
            <span className="text-xs font-semibold text-[#F5F7FA]">
              {user ? (user.role === 'ADMIN' ? 'Admin' : 'Operator') : 'Admin'}
            </span>
            <span className="text-xs text-[#8993A4]">● Online</span>
          </div>

          {/* Export Backup Button */}
          {onExport && (
            <button
              onClick={onExport}
              disabled={exporting}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#20283A] hover:bg-[#2A354D] border border-[#20283A] text-[#F5F7FA] text-xs font-semibold transition-all active:scale-95 disabled:opacity-50"
              title="Tải backup .txt (phòng khi mất dữ liệu)"
            >
              <FileDown className="w-4 h-4 text-[#7C5CFF]" />
              <span className="hidden sm:inline">{exporting ? 'Đang xuất...' : 'Backup .txt'}</span>
            </button>
          )}

          {/* Quick Add Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#4F7CFF] hover:bg-[#3B69EE] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#4F7CFF]/20 active:scale-95"
          >
            <span className="text-base font-bold leading-none">+</span>
            <span>Thêm tài khoản</span>
          </button>

          {/* Logout button */}
          <button
            onClick={onLogout}
            className="p-2 rounded-lg text-[#8993A4] hover:text-[#EF4444] hover:bg-[#20283A]/50 transition-colors"
            title="Đăng xuất"
            aria-label="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
