'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  DatabaseBackup,
  Activity,
  Settings,
  ShieldCheck,
  KeyRound,
  ChevronDown,
  Vault,
} from 'lucide-react';
import { User } from '@/lib/api';
import { useDashboard } from '@/lib/dashboard-context';

interface SidebarProps {
  user: User | null;
  onOpenAddModal?: () => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-[18px] h-[18px]" /> },
  { id: 'accounts', path: '/accounts', label: 'Tài khoản', icon: <Users className="w-[18px] h-[18px]" /> },
  { id: 'add', path: '/accounts?add=1', label: 'Thêm tài khoản', icon: <UserPlus className="w-[18px] h-[18px]" /> },
  { id: 'backup', path: '/backup', label: 'Backup', icon: <DatabaseBackup className="w-[18px] h-[18px]" /> },
  { id: 'activity', path: '/activity', label: 'Nhật ký hoạt động', icon: <Activity className="w-[18px] h-[18px]" /> },
  { id: 'settings', path: '/settings', label: 'Cài đặt', icon: <Settings className="w-[18px] h-[18px]" /> },
  { id: 'users', path: '/users', label: 'Người dùng', icon: <ShieldCheck className="w-[18px] h-[18px]" /> },
  { id: 'roles', path: '/roles', label: 'Vai trò & Phân quyền', icon: <KeyRound className="w-[18px] h-[18px]" /> },
];

export const Sidebar: React.FC<SidebarProps> = ({ user, onOpenAddModal }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useDashboard();
  const [profileOpen, setProfileOpen] = useState(false);

  // Derive active page from current route
  const activePage =
    pathname === '/'
      ? 'dashboard'
      : pathname === '/accounts'
      ? 'accounts'
      : pathname === '/backup'
      ? 'backup'
      : pathname === '/activity'
      ? 'activity'
      : pathname === '/settings'
      ? 'settings'
      : pathname === '/users'
      ? 'users'
      : pathname === '/roles'
      ? 'roles'
      : '';

  const handleNav = (id: string) => {
    if (id === 'add') {
      if (onOpenAddModal) onOpenAddModal();
      return;
    }
    const item = NAV_ITEMS.find((n) => n.id === id);
    if (item) {
      router.push(item.path);
    }
  };

  return (
    <aside className="hidden lg:flex flex-col w-[260px] shrink-0 h-[calc(100vh-64px)] sticky top-16 bg-gradient-sidebar border-r border-[rgba(148,163,184,0.12)] overflow-hidden">
      {/* Ambient inner glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 20% 0%, rgba(77,124,255,0.08) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 90% 100%, rgba(139,92,246,0.06) 0%, transparent 60%)',
        }}
      />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-3 px-3 pb-5 mb-2 border-b border-[rgba(148,163,184,0.1)]">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-blue">
            <Vault className="w-5 h-5 text-white" />
            <div className="absolute inset-0 rounded-xl bg-gradient-primary opacity-50 blur-md -z-10" />
          </div>
          <div>
            <div className="font-bold text-[15px] tracking-wider text-[#F8FAFC] leading-none">
              NOVA
            </div>
            <div className="text-[10px] font-mono text-[#64748B] mt-1 uppercase tracking-widest">
              Vault MVP
            </div>
          </div>
        </div>

        {/* Nav items */}
        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? 'text-[#F8FAFC]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[rgba(148,163,184,0.06)]'
              }`}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-full bg-gradient-primary shadow-glow-blue" />
              )}

              {/* Active glow background */}
              {isActive && (
                <span
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(77,124,255,0.15) 0%, rgba(139,92,246,0.1) 100%)',
                    border: '1px solid rgba(77,124,255,0.2)',
                    boxShadow:
                      'inset 0 1px 0 0 rgba(255,255,255,0.04), 0 0 20px rgba(77,124,255,0.1)',
                  }}
                />
              )}

              {/* Icon with glow on active */}
              <span
                className={`relative z-10 transition-colors duration-200 ${
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

              <span className="relative z-10 flex-1 text-left">{item.label}</span>

              {isActive && (
                <span className="relative z-10 w-1.5 h-1.5 rounded-full bg-[#8B5CF6] shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Admin Profile Card */}
      <div className="relative z-10 p-3 border-t border-[rgba(148,163,184,0.1)]">
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[rgba(10,15,28,0.6)] border border-[rgba(148,163,184,0.1)] hover:bg-[rgba(10,15,28,0.8)] transition-all duration-200 group"
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-glow-blue-sm">
              {(user?.email?.[0] || 'A').toUpperCase()}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00D084] border-2 border-[#0A0F1C]" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="text-[13px] font-semibold text-[#F8FAFC] truncate">
              {user?.role === 'ADMIN' ? 'Admin' : 'Operator'}
            </div>
            <div className="text-[11px] text-[#64748B] truncate">
              {user?.role === 'ADMIN' ? 'Quản trị viên' : 'Nhân viên'}
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-[#64748B] transition-transform duration-200 ${
              profileOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown */}
        {profileOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 p-1.5 rounded-xl glass-panel-subtle animate-slide-up z-20">
            <button
              onClick={() => {
                setProfileOpen(false);
                router.push('/settings');
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-[13px] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[rgba(148,163,184,0.08)] transition-colors"
            >
              Cài đặt
            </button>
            <button
              onClick={() => {
                setProfileOpen(false);
                logout();
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-[13px] text-[#F43F5E] hover:bg-[rgba(244,63,94,0.1)] transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        )}

        {/* NOVA VAULT Footer */}
        <div className="mt-3 px-3 py-3 rounded-xl bg-gradient-primary-soft border border-[rgba(77,124,255,0.15)] relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background:
                'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(77,124,255,0.5) 0%, transparent 60%)',
            }}
          />
          <div className="relative z-10 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#4D7CFF]" />
            <span className="text-[11px] font-semibold text-[#F8FAFC] tracking-wider">
              NOVA VAULT
            </span>
          </div>
          <p className="relative z-10 text-[10px] text-[#94A3B8] mt-1 leading-relaxed">
            Bảo mật. Tối ưu. Hiệu quả.
          </p>
          {/* Decorative vault visual */}
          <div className="relative z-10 mt-2 flex items-center gap-1 opacity-40">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full"
                style={{
                  background: `linear-gradient(90deg, rgba(77,124,255,${0.3 + i * 0.15}), rgba(139,92,246,${0.3 + i * 0.15}))`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
