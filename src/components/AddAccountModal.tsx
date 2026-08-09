'use client';

import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Sparkles, Eye, EyeOff, Save, Check, ShieldCheck } from 'lucide-react';
import { api, Account } from '@/lib/api';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (account: Account, plainPassword: string) => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const AddAccountModal: React.FC<AddAccountModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  showToast,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'PAUSED' | 'ARCHIVED'>('ACTIVE');
  const [notes, setNotes] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [genLoadingUser, setGenLoadingUser] = useState(false);
  const [genLoadingPwd, setGenLoadingPwd] = useState(false);

  // Auto generate credentials when modal opens
  useEffect(() => {
    if (isOpen) {
      autoGenerateAll();
    }
  }, [isOpen]);

  // Keyboard shortcut handler (Enter = Save, Esc = Close)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter' && !e.shiftKey && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, username, password, status, notes]);

  const autoGenerateAll = async () => {
    setLoading(true);
    try {
      const [userRes, pwdRes] = await Promise.all([
        api.generateUsername(),
        api.generatePassword(),
      ]);
      setUsername(userRes.username);
      setPassword(pwdRes.password);
      setStatus('ACTIVE');
      setNotes('');
    } catch (err: any) {
      showToast(err.message || 'Không thể tạo tự động thông tin', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenUsername = async () => {
    setGenLoadingUser(true);
    try {
      const res = await api.generateUsername();
      setUsername(res.username);
    } catch {
      showToast('Không thể tạo lại username', 'error');
    } finally {
      setGenLoadingUser(false);
    }
  };

  const handleRegenPassword = async () => {
    setGenLoadingPwd(true);
    try {
      const res = await api.generatePassword();
      setPassword(res.password);
    } catch {
      showToast('Không thể tạo lại mật khẩu', 'error');
    } finally {
      setGenLoadingPwd(false);
    }
  };

  const handleSave = async () => {
    if (!username.trim() || !password.trim()) {
      showToast('Vui lòng nhập Username và Mật khẩu', 'error');
      return;
    }

    setLoading(true);
    try {
      const newAcc = await api.createAccount({
        username: username.trim(),
        password: password.trim(),
        status,
        notes: notes.trim(),
      });
      showToast(`✓ Đã tạo ${newAcc.nova_id}`, 'success');
      onSuccess(newAcc, password.trim());
    } catch (err: any) {
      showToast(err.message || 'Không thể tạo tài khoản', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto bg-[#0A0F1C] border-t sm:border border-[rgba(148,163,184,0.12)] sm:rounded-xl shadow-2xl animate-slide-up sm:animate-scale-in">
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(77,124,255,0.08) 0%, transparent 60%)',
          }}
        />

        {/* Header */}
        <div className="relative flex items-center justify-between px-5 py-4 border-b border-[rgba(148,163,184,0.12)] bg-[rgba(5,8,18,0.4)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary-soft border border-[rgba(77,124,255,0.2)] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#4D7CFF]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F8FAFC]">THÊM TÀI KHOẢN MỚI</h3>
              <p className="text-[10px] text-[#64748B] mt-0.5">Tạo tài khoản NOVA an toàn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[rgba(148,163,184,0.08)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Đóng modal (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="relative p-5 space-y-4">
          {/* Username Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                Username <span className="text-[#F43F5E]">*</span>
              </label>
              <button
                type="button"
                onClick={handleRegenUsername}
                disabled={genLoadingUser}
                className="flex items-center gap-1 text-[11px] text-[#4D7CFF] hover:text-[#8B5CF6] font-medium transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${genLoadingUser ? 'animate-spin' : ''}`} />
                <span>Random</span>
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ví dụ: NovaSky4821"
                className="w-full bg-[rgba(5,8,18,0.6)] border border-[rgba(148,163,184,0.12)] text-[#F8FAFC] font-mono text-sm rounded-lg px-3.5 py-3 focus:outline-none focus:border-[#4D7CFF]/50 focus:shadow-glow-blue-sm transition-all duration-200 pr-10"
              />
              <button
                type="button"
                onClick={handleRegenUsername}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#4D7CFF] p-1.5 min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Tạo ngẫu nhiên lại"
              >
                <RefreshCw className={`w-4 h-4 ${genLoadingUser ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                Password <span className="text-[#F43F5E]">*</span>
              </label>
              <button
                type="button"
                onClick={handleRegenPassword}
                disabled={genLoadingPwd}
                className="flex items-center gap-1 text-[11px] text-[#4D7CFF] hover:text-[#8B5CF6] font-medium transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${genLoadingPwd ? 'animate-spin' : ''}`} />
                <span>Random</span>
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập hoặc tạo ngẫu nhiên mật khẩu"
                className="w-full bg-[rgba(5,8,18,0.6)] border border-[rgba(148,163,184,0.12)] text-[#F8FAFC] font-mono text-sm rounded-lg px-3.5 py-3 focus:outline-none focus:border-[#4D7CFF]/50 focus:shadow-glow-blue-sm transition-all duration-200 pr-20"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#64748B] hover:text-[#F8FAFC] p-1.5 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Xem mật khẩu'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleRegenPassword}
                  className="text-[#64748B] hover:text-[#4D7CFF] p-1.5 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  title="Tạo lại mật khẩu"
                >
                  <RefreshCw className={`w-4 h-4 ${genLoadingPwd ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Status Field */}
          <div>
            <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
              Trạng thái
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full bg-[rgba(5,8,18,0.6)] border border-[rgba(148,163,184,0.12)] text-[#F8FAFC] text-sm rounded-lg px-3.5 py-3 focus:outline-none focus:border-[#4D7CFF]/50 transition-all duration-200 cursor-pointer"
            >
              <option value="ACTIVE" className="bg-[#0A0F1C] text-[#00D084]">● ACTIVE (Hoạt động)</option>
              <option value="PAUSED" className="bg-[#0A0F1C] text-[#F59E0B]">● PAUSED (Tạm dừng)</option>
              <option value="ARCHIVED" className="bg-[#0A0F1C] text-[#94A3B8]">● ARCHIVED (Đã lưu trữ)</option>
            </select>
          </div>

          {/* Notes Field */}
          <div>
            <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
              Ghi chú (Tùy chọn)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="VD: Tài khoản chính, Server US-East..."
              className="w-full bg-[rgba(5,8,18,0.6)] border border-[rgba(148,163,184,0.12)] text-[#F8FAFC] text-sm rounded-lg px-3.5 py-3 focus:outline-none focus:border-[#4D7CFF]/50 transition-all duration-200"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="relative flex items-center justify-between px-5 py-4 border-t border-[rgba(148,163,184,0.12)] bg-[rgba(5,8,18,0.4)]">
          <span className="hidden sm:inline text-[10px] text-[#64748B]">
            Nhấn <kbd className="bg-[rgba(148,163,184,0.1)] px-1.5 py-0.5 rounded text-[#F8FAFC] font-mono">Enter</kbd> để lưu
          </span>
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-lg text-sm text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[rgba(148,163,184,0.08)] transition-colors min-h-[44px]"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-gradient-primary text-white text-sm font-semibold shadow-glow-blue-sm active:scale-95 transition-all duration-200 disabled:opacity-50 min-h-[44px]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'Đang lưu...' : 'LƯU TÀI KHOẢN'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
