'use client';

import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Sparkles, Eye, EyeOff, Save, Check } from 'lucide-react';
import { api, Account, Credential } from '@/lib/api';

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
  const [showPassword, setShowPassword] = useState(true); // Default visible for instant review
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
    } catch (err: any) {
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
    } catch (err: any) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0F1420] border border-[#20283A] rounded-xl max-w-lg w-full overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#20283A] bg-[#080B12]/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#4F7CFF]" />
            <h3 className="text-base font-bold text-[#F5F7FA]">THÊM TÀI KHOẢN MỚI</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#8993A4] hover:text-[#F5F7FA] p-1 rounded-lg hover:bg-[#20283A] transition-colors"
            aria-label="Đóng modal (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* Username Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#8993A4] uppercase tracking-wider">
                Username (Bắt buộc chứa `Nova`)
              </label>
              <button
                type="button"
                onClick={handleRegenUsername}
                disabled={genLoadingUser}
                className="flex items-center gap-1 text-xs text-[#4F7CFF] hover:text-[#7C5CFF] font-medium transition-colors"
                title="Tạo ngẫu nhiên username mới"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${genLoadingUser ? 'animate-spin' : ''}`} />
                <span>Random Username</span>
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ví dụ: NovaSky4821"
                className="w-full bg-[#080B12] border border-[#20283A] text-[#F5F7FA] font-mono text-base rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#4F7CFF] transition-colors pr-10"
              />
              <button
                type="button"
                onClick={handleRegenUsername}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8993A4] hover:text-[#4F7CFF] p-1"
                title="Tạo ngẫu nhiên lại"
              >
                <RefreshCw className={`w-4 h-4 ${genLoadingUser ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#8993A4] uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={handleRegenPassword}
                disabled={genLoadingPwd}
                className="flex items-center gap-1 text-xs text-[#4F7CFF] hover:text-[#7C5CFF] font-medium transition-colors"
                title="Tạo ngẫu nhiên mật khẩu mới"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${genLoadingPwd ? 'animate-spin' : ''}`} />
                <span>Random Password</span>
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập hoặc tạo ngẫu nhiên mật khẩu"
                className="w-full bg-[#080B12] border border-[#20283A] text-[#F5F7FA] font-mono text-base rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#4F7CFF] transition-colors pr-20"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#8993A4] hover:text-[#F5F7FA] p-1"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Xem mật khẩu'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleRegenPassword}
                  className="text-[#8993A4] hover:text-[#4F7CFF] p-1"
                  title="Tạo lại mật khẩu"
                >
                  <RefreshCw className={`w-4 h-4 ${genLoadingPwd ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Status Field */}
          <div>
            <label className="block text-xs font-semibold text-[#8993A4] uppercase tracking-wider mb-1.5">
              Trạng thái
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full bg-[#080B12] border border-[#20283A] text-[#F5F7FA] text-sm rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#4F7CFF] transition-colors cursor-pointer"
            >
              <option value="ACTIVE" className="bg-[#0F1420] text-[#22C55E]">● ACTIVE (Hoạt động)</option>
              <option value="PAUSED" className="bg-[#0F1420] text-[#F59E0B]">● PAUSED (Tạm dừng)</option>
              <option value="ARCHIVED" className="bg-[#0F1420] text-[#8993A4]">● ARCHIVED (Đã lưu trữ)</option>
            </select>
          </div>

          {/* Notes Field (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-[#8993A4] uppercase tracking-wider mb-1.5">
              Ghi chú (Tùy chọn)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="VD: Tài khoản chính, Server US-East..."
              className="w-full bg-[#080B12] border border-[#20283A] text-[#F5F7FA] text-sm rounded-lg px-3.5 py-2 focus:outline-none focus:border-[#4F7CFF] transition-colors"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-[#20283A] bg-[#080B12]/50">
          <span className="text-[11px] text-[#8993A4] hidden sm:inline">Nhấn <kbd className="bg-[#20283A] px-1.5 py-0.5 rounded text-white font-mono">Enter</kbd> để lưu ngay</span>
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-[#8993A4] hover:text-[#F5F7FA] hover:bg-[#20283A] transition-colors"
            >
              Hủy (Esc)
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-[#4F7CFF] hover:bg-[#3B69EE] text-white text-sm font-bold transition-all shadow-lg shadow-[#4F7CFF]/20 active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Đang lưu...' : 'LƯU TÀI KHOẢN'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
