'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Search,
  X,
  Bell,
  FileDown,
  Plus,
  Menu,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { User } from '@/lib/api';
import { useDashboard } from '@/lib/dashboard-context';

interface TopbarProps {
  user: User | null;
}

export const Topbar: React.FC<TopbarProps> = ({ user }) => {
  const { logout, openAddAccount, handleExport, exporting, setMobileNavOpen } = useDashboard();
  const inputRef = useRef<HTMLInputElement>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  // Ctrl/Cmd + K to focus search (scrolls to accounts search if on accounts page)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const el = document.getElementById('account-search');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          (el.querySelector('input') as HTMLInputElement)?.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 h-16 bg-[rgba(7,11,20,0.8)] backdrop-blur-xl border-b border-[rgba(148,163,184,0.12)]">
      <div className="h-full flex items-center gap-3 px-4 sm:px-6">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileNavOpen(true)}
          className="lg:hidden p-2 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[rgba(148,163,184,0.08)] transition-colors"
          aria-label="Mở menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Brand */}
        <div className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div className="leading-none">
            <div className="text-sm font-bold tracking-wider text-[#F8FAFC]">NOVA</div>
            <div className="text-[9px] font-mono text-[#64748B] uppercase tracking-widest mt-0.5">
              Vault MVP
            </div>
          </div>
        </div>

        {/* Global Search (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md ml-4">
          <div className="relative w-full group">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-[#4D7CFF]" />
            <input
              ref={inputRef}
              type="text"
              onFocus={() => {
                // Route to accounts + focus the search input
                const el = document.getElementById('account-search');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  (el.querySelector('input') as HTMLInputElement)?.focus();
                }
              }}
              placeholder="Tìm tài khoản (NOVA ID, username, ghi chú...)"
              className="w-full bg-[rgba(10,15,28,0.6)] text-[13px] text-[#F8FAFC] placeholder-[#64748B] rounded-lg pl-10 pr-16 py-2 border border-[rgba(148,163,184,0.12)] focus:outline-none focus:border-[#4D7CFF]/50 focus:shadow-glow-blue-sm transition-all duration-200"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <span className="hidden sm:inline-block text-[10px] font-mono bg-[rgba(148,163,184,0.1)] text-[#64748B] px-1.5 py-0.5 rounded border border-[rgba(148,163,184,0.1)]">
                Ctrl+K
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex-1 lg:flex-none flex items-center justify-end gap-2 ml-auto">
          {/* Mobile Search — scrolls to the main search bar */}
          <button
            onClick={() => {
              const el = document.getElementById('account-search');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                (el.querySelector('input') as HTMLInputElement)?.focus();
              }
            }}
            className="md:hidden p-2 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[rgba(148,163,184,0.08)] transition-colors"
            aria-label="Tìm kiếm"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* User Badge (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgba(10,15,28,0.6)] border border-[rgba(148,163,184,0.12)]">
            <span className="w-2 h-2 rounded-full bg-[#00D084] animate-pulse-glow" />
            <span className="text-xs font-semibold text-[#F8FAFC]">
              {user ? (user.role === 'ADMIN' ? 'Admin' : 'Operator') : 'Admin'}
            </span>
            <span className="text-[11px] text-[#64748B]">Online</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[rgba(148,163,184,0.08)] transition-colors"
              aria-label="Thông báo"
            >
              <Bell className="w-[18px] h-[18px]" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#4D7CFF] shadow-glow-blue-sm" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-xl glass-panel-subtle animate-slide-up overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-[rgba(148,163,184,0.1)]">
                  <div className="text-sm font-semibold text-[#F8FAFC]">Thông báo</div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">Hệ thống NOVA VAULT</div>
                </div>
                <div className="p-3 text-center text-[13px] text-[#64748B] py-8">
                  Không có thông báo mới
                </div>
              </div>
            )}
          </div>

          {/* Backup Button (Desktop) */}
          <button
            onClick={handleExport}
            disabled={exporting}
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[rgba(10,15,28,0.6)] border border-[rgba(148,163,184,0.12)] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[rgba(139,92,246,0.3)] text-xs font-medium transition-all duration-200 disabled:opacity-50"
            title="Tải backup .txt (phòng khi mất dữ liệu)"
          >
            <FileDown className="w-4 h-4 text-[#8B5CF6]" />
            <span>{exporting ? 'Đang xuất...' : 'Backup .txt'}</span>
          </button>

          {/* Add Account CTA */}
          <button
            onClick={openAddAccount}
            className="btn-primary flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-[13px] shadow-glow-blue-sm"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Thêm tài khoản</span>
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="p-2 rounded-lg text-[#64748B] hover:text-[#F43F5E] hover:bg-[rgba(244,63,94,0.1)] transition-colors"
            title="Đăng xuất"
            aria-label="Đăng xuất"
          >
            <LogOut className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
    </header>
  );
};
