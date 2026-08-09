'use client';

import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  DatabaseBackup,
  Activity,
  Settings,
  ShieldCheck,
  KeyRound,
  X,
  Vault,
  LogOut,
} from 'lucide-react';
import { User } from '@/lib/api';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  activePage: string;
  onNavigate: (page: string) => void;
  onOpenAddModal?: () => void;
  onLogout?: () => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-[18px] h-[18px]" /> },
  { id: 'accounts', label: 'Tài khoản', icon: <Users className="w-[18px] h-[18px]" /> },
  { id: 'add', label: 'Thêm tài khoản', icon: <UserPlus className="w-[18px] h-[18px]" /> },
  { id: 'backup', label: 'Backup', icon: <DatabaseBackup className="w-[18px] h-[18px]" /> },
  { id: 'activity', label: 'Nhật ký hoạt động', icon: <Activity className="w-[18px] h-[18px]" /> },
  { id: 'settings', label: 'Cài đặt', icon: <Settings className="w-[18px] h-[18px]" /> },
  { id: 'users', label: 'Người dùng', icon: <ShieldCheck className="w-[18px] h-[18px]" /> },
  { id: 'roles', label: 'Vai trò & Phân quyền', icon: <KeyRound className="w-[18px] h-[18px]" /> },
];

const BOTTOM_NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'accounts', label: 'Tài khoản', icon: <Users className="w-5 h-5" /> },
  { id: 'backup', label: 'Backup', icon: <DatabaseBackup className="w-5 h-5" /> },
  { id: 'activity', label: 'Hoạt động', icon: <Activity className="w-5 h-5" /> },
  { id: 'more', label: 'Thêm', icon: <ShieldCheck className="w-5 h-5" /> },
];

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  user,
  activePage,
  onNavigate,
  onOpenAddModal,
  onLogout,
}) => {
  const handleNav = (id: string) => {
    if (id === 'add' && onOpenAddModal) {
      onOpenAddModal();
      onClose();
      return;
    }
    if (id === 'logout' && onLogout) {
      onLogout();
      onClose();
      return;
    }
    onNavigate(id);
    if (id !== 'more') {
      onClose();
    }
  };

  return (
    <>
      {/* Drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Drawer Panel */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-[280px] max-w-[85vw] bg-[#070B14] border-r border-[rgba(148,163,184,0.12)] flex flex-col transform transition-transform duration-300 ease-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{
            boxShadow: '8px 0 32px rgba(0,0,0,0.5), inset -1px 0 0 rgba(255,255,255,0.03)',
          }}
        >
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 60% 40% at 20% 0%, rgba(77,124,255,0.08) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 90% 100%, rgba(139,92,246,0.06) 0%, transparent 60%)',
            }}
          />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between px-4 py-4 border-b border-[rgba(148,163,184,0.1)]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-blue-sm">
                <Vault className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-sm tracking-wider text-[#F8FAFC] leading-none">
                  NOVA
                </div>
                <div className="text-[9px] font-mono text-[#64748B] mt-1 uppercase tracking-widest">
                  Vault MVP
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[rgba(148,163,184,0.08)] transition-colors"
              aria-label="Đóng menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin info */}
          <div className="relative z-10 flex items-center gap-3 px-4 py-3 border-b border-[rgba(148,163,184,0.1)]">
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">
                {(user?.email?.[0] || 'A').toUpperCase()}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00D084] border-2 border-[#070B14]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-[#F8FAFC] truncate">
                {user?.role === 'ADMIN' ? 'Admin' : 'Operator'}
              </div>
              <div className="text-[11px] text-[#64748B] truncate">
                {user?.role === 'ADMIN' ? 'Quản trị viên' : 'Nhân viên'}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="relative z-10 flex-1 px-3 py-3 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className="group relative w-full flex items-center gap-3 px-3 py-3 rounded-lg text-[13px] font-medium transition-all duration-200 min-h-[44px]"
                >
                  {isActive && (
                    <span
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(77,124,255,0.15) 0%, rgba(139,92,246,0.1) 100%)',
                        border: '1px solid rgba(77,124,255,0.2)',
                        boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.04)',
                      }}
                    />
                  )}
                  <span
                    className={`relative z-10 transition-colors ${
                      isActive ? 'text-[#4D7CFF]' : 'text-[#64748B] group-hover:text-[#94A3B8]'
                    }`}
                    style={
                      isActive
                        ? { filter: 'drop-shadow(0 0 6px rgba(77,124,255,0.5))' }
                        : undefined
                    }
                  >
                    {item.icon}
                  </span>
                  <span
                    className={`relative z-10 flex-1 text-left ${
                      isActive ? 'text-[#F8FAFC]' : 'text-[#94A3B8] group-hover:text-[#F8FAFC]'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="relative z-10 p-3 border-t border-[rgba(148,163,184,0.1)]">
            <button
              onClick={() => handleNav('logout')}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-[13px] text-[#F43F5E] hover:bg-[rgba(244,63,94,0.1)] transition-colors min-h-[44px]"
            >
              <LogOut className="w-[18px] h-[18px]" />
              <span>Đăng xuất</span>
            </button>
            <div className="mt-2 px-3 text-[10px] text-[#64748B] text-center">
              NOVA VAULT — Bảo mật. Tối ưu. Hiệu quả.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[rgba(7,11,20,0.9)] backdrop-blur-xl border-t border-[rgba(148,163,184,0.12)] safe-bottom"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-stretch justify-around px-2 py-1.5">
          {BOTTOM_NAV.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'more') {
                    onNavigate('more');
                    return;
                  }
                  handleNav(item.id);
                }}
                className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-h-[48px] min-w-[56px]"
              >
                <span
                  className={`transition-all duration-200 ${
                    isActive
                      ? 'text-[#4D7CFF] scale-110'
                      : 'text-[#64748B] hover:text-[#94A3B8]'
                  }`}
                  style={
                    isActive
                      ? { filter: 'drop-shadow(0 0 8px rgba(77,124,255,0.5))' }
                      : undefined
                  }
                >
                  {item.icon}
                </span>
                <span
                  className={`text-[9px] font-medium transition-colors ${
                    isActive ? 'text-[#4D7CFF]' : 'text-[#64748B]'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
