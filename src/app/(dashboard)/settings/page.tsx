'use client';

import React, { useState, useEffect } from 'react';
import { useDashboard } from '@/lib/dashboard-context';
import {
  Settings,
  Palette,
  ShieldCheck,
  Bell,
  LogOut,
  Moon,
  Sun,
  Monitor,
  KeyRound,
  AlertTriangle,
} from 'lucide-react';

export default function SettingsPage() {
  const { logout, user } = useDashboard();

  // Local settings state (persisted in localStorage)
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [notifications, setNotifications] = useState({
    accountCreated: true,
    backupReminder: true,
    securityAlerts: true,
  });
  const [security, setSecurity] = useState({
    autoLock: false,
    showPasswords: false,
  });

  // Load saved preferences
  useEffect(() => {
    const saved = localStorage.getItem('nova_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.theme) setTheme(parsed.theme);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.security) setSecurity(parsed.security);
      } catch {
        // ignore
      }
    }
  }, []);

  // Save preferences
  const saveSettings = (key: string, value: any) => {
    const current = JSON.parse(localStorage.getItem('nova_settings') || '{}');
    const updated = { ...current, [key]: value };
    localStorage.setItem('nova_settings', JSON.stringify(updated));
  };

  const handleThemeChange = (t: 'dark' | 'light' | 'system') => {
    setTheme(t);
    saveSettings('theme', t);
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    saveSettings('notifications', updated);
  };

  const handleSecurityChange = (key: keyof typeof security) => {
    const updated = { ...security, [key]: !security[key] };
    setSecurity(updated);
    saveSettings('security', updated);
  };

  const SectionHeader = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-lg bg-gradient-primary-soft flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h2 className="text-sm font-bold text-[#F8FAFC]">{title}</h2>
        <p className="text-[11px] text-[#64748B]">{desc}</p>
      </div>
    </div>
  );

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
        checked ? 'bg-gradient-primary' : 'bg-[rgba(148,163,184,0.2)]'
      }`}
      aria-pressed={checked}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? 'translate-x-5' : ''
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F8FAFC]">Cài đặt</h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
          Quản lý tùy chọn và bảo mật hệ thống
        </p>
      </div>

      {/* General Section */}
      <div className="glass-panel rounded-xl p-5">
        <SectionHeader
          icon={<Settings className="w-5 h-5 text-[#4D7CFF]" />}
          title="Cài đặt chung"
          desc="Tùy chọn hiển thị và hệ thống"
        />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-[#F8FAFC]">Ngôn ngữ</div>
              <div className="text-[11px] text-[#64748B]">Tiếng Việt</div>
            </div>
            <span className="text-xs text-[#64748B]">Việt Nam</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-[#F8FAFC]">Phiên bản</div>
              <div className="text-[11px] text-[#64748B]">NOVA VAULT MVP</div>
            </div>
            <span className="text-xs text-[#4D7CFF] font-mono">v1.0.0</span>
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="glass-panel rounded-xl p-5">
        <SectionHeader
          icon={<Palette className="w-5 h-5 text-[#8B5CF6]" />}
          title="Giao diện"
          desc="Tùy chọn chủ đề và hiển thị"
        />
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'dark', label: 'Tối', icon: <Moon className="w-4 h-4" /> },
            { value: 'light', label: 'Sáng', icon: <Sun className="w-4 h-4" /> },
            { value: 'system', label: 'Hệ thống', icon: <Monitor className="w-4 h-4" /> },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleThemeChange(opt.value as any)}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all duration-200 ${
                theme === opt.value
                  ? 'border-[#4D7CFF]/50 bg-[rgba(77,124,255,0.1)] text-[#F8FAFC]'
                  : 'border-[rgba(148,163,184,0.12)] bg-[rgba(10,15,28,0.6)] text-[#94A3B8] hover:border-[rgba(148,163,184,0.3)]'
              }`}
            >
              {opt.icon}
              <span className="text-xs">{opt.label}</span>
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-start gap-2 text-[11px] text-[#64748B]">
          <AlertTriangle className="w-4 h-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
          <p>Chế độ sáng sẽ được hỗ trợ trong phiên bản tiếp theo. Hiện tại giao diện luôn ở chế độ tối.</p>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="glass-panel rounded-xl p-5">
        <SectionHeader
          icon={<Bell className="w-5 h-5 text-[#F59E0B]" />}
          title="Thông báo"
          desc="Tùy chọn thông báo hệ thống"
        />
        <div className="space-y-4">
          {[
            { key: 'accountCreated', label: 'Tài khoản mới', desc: 'Thông báo khi tạo tài khoản mới' },
            { key: 'backupReminder', label: 'Nhắc backup', desc: 'Nhắc nhở sao lưu định kỳ' },
            { key: 'securityAlerts', label: 'Cảnh báo bảo mật', desc: 'Thông báo khi có hoạt động đăng nhập' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#F8FAFC]">{item.label}</div>
                <div className="text-[11px] text-[#64748B]">{item.desc}</div>
              </div>
              <Toggle
                checked={notifications[item.key as keyof typeof notifications]}
                onChange={() => handleNotificationChange(item.key as keyof typeof notifications)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Security Section */}
      <div className="glass-panel rounded-xl p-5">
        <SectionHeader
          icon={<ShieldCheck className="w-5 h-5 text-[#00D084]" />}
          title="Bảo mật"
          desc="Tùy chọn bảo mật tài khoản"
        />
        <div className="space-y-4">
          {[
            { key: 'autoLock', label: 'Tự động khóa', desc: 'Tự động khóa phiên khi không hoạt động (Coming soon)' },
            { key: 'showPasswords', label: 'Hiện mật khẩu', desc: 'Hiện mật khẩu khi xem tài khoản' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#F8FAFC]">{item.label}</div>
                <div className="text-[11px] text-[#64748B]">{item.desc}</div>
              </div>
              <Toggle
                checked={security[item.key as keyof typeof security]}
                onChange={() => handleSecurityChange(item.key as keyof typeof security)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Session Section */}
      <div className="glass-panel rounded-xl p-5">
        <SectionHeader
          icon={<KeyRound className="w-5 h-5 text-[#F43F5E]" />}
          title="Phiên làm việc"
          desc="Quản lý phiên đăng nhập"
        />
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-[#F8FAFC]">Đăng xuất khỏi hệ thống</div>
            <div className="text-[11px] text-[#64748B]">
              {user?.email || 'Đang tải thông tin...'}
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[rgba(244,63,94,0.1)] border border-[rgba(244,63,94,0.25)] text-[#F43F5E] text-xs font-semibold hover:bg-[rgba(244,63,94,0.2)] transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>
  );
}
