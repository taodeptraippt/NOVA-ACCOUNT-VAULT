'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Plus, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';
import { Account } from '@/lib/api';

interface QuickUseModalProps {
  isOpen: boolean;
  account: Account | null;
  plainPassword: string;
  onClose: () => void;
  onCreateNext: () => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const QuickUseModal: React.FC<QuickUseModalProps> = ({
  isOpen,
  account,
  plainPassword,
  onClose,
  onCreateNext,
  showToast,
}) => {
  const [showPassword, setShowPassword] = useState(true);
  const [copiedField, setCopiedField] = useState<'username' | 'password' | 'both' | null>(null);

  if (!isOpen || !account) return null;

  const copyToClipboard = (text: string, field: 'username' | 'password' | 'both') => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    if (field === 'username') showToast('✓ Đã copy Username', 'success');
    else if (field === 'password') showToast('✓ Đã copy Mật khẩu', 'success');
    else showToast('✓ Đã copy Username & Mật khẩu', 'success');

    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const copyBothText = `Username: ${account.username}\nPassword: ${plainPassword}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full sm:max-w-md max-h-[92vh] overflow-y-auto bg-[#0A0F1C] border-t sm:border border-[rgba(148,163,184,0.12)] sm:rounded-xl shadow-2xl animate-slide-up sm:animate-scale-in">
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
              <ShieldCheck className="w-4 h-4 text-[#4D7CFF]" />
            </div>
            <div>
              <span className="font-mono text-sm font-bold text-[#4D7CFF]">{account.nova_id}</span>
              <span className="flex items-center gap-1 mt-0.5 text-[10px] font-semibold text-[#00D084]">
                <span className="w-1 h-1 rounded-full bg-[#00D084] shadow-[0_0_6px_rgba(0,208,132,0.6)] animate-pulse-glow" />
                Sẵn sàng sử dụng
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[rgba(148,163,184,0.08)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Credentials View */}
        <div className="relative p-5 space-y-4">
          {/* Username Item */}
          <div className="bg-[rgba(5,8,18,0.6)] border border-[rgba(148,163,184,0.12)] rounded-lg p-3.5">
            <div className="flex items-center justify-between text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">
              <span>Username</span>
              <span className="text-[#64748B] normal-case tracking-normal">thông tin đăng nhập</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-sm font-bold text-[#F8FAFC] truncate">
                {account.username}
              </span>
              <button
                onClick={() => copyToClipboard(account.username, 'username')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[rgba(77,124,255,0.1)] border border-[rgba(77,124,255,0.2)] hover:bg-[rgba(77,124,255,0.2)] text-[#4D7CFF] text-xs font-semibold transition-all duration-200 min-h-[44px] flex-shrink-0"
              >
                {copiedField === 'username' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#00D084]" />
                    <span>Đã copy</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Password Item */}
          <div className="bg-[rgba(5,8,18,0.6)] border border-[rgba(148,163,184,0.12)] rounded-lg p-3.5">
            <div className="flex items-center justify-between text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">
              <span>Password</span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#94A3B8] hover:text-[#F8FAFC] flex items-center gap-1 text-[10px] normal-case tracking-normal"
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showPassword ? 'Ẩn' : 'Hiện'}</span>
              </button>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-sm font-bold text-[#F8FAFC] truncate">
                {showPassword ? plainPassword : '••••••••••••••••'}
              </span>
              <button
                onClick={() => copyToClipboard(plainPassword, 'password')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[rgba(77,124,255,0.1)] border border-[rgba(77,124,255,0.2)] hover:bg-[rgba(77,124,255,0.2)] text-[#4D7CFF] text-xs font-semibold transition-all duration-200 min-h-[44px] flex-shrink-0"
              >
                {copiedField === 'password' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#00D084]" />
                    <span>Đã copy</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Large Action Buttons */}
          <div className="space-y-2.5 pt-2">
            {/* Copy Both */}
            <button
              onClick={() => copyToClipboard(copyBothText, 'both')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[rgba(10,15,28,0.6)] border border-[rgba(148,163,184,0.12)] hover:border-[rgba(139,92,246,0.3)] text-[#F8FAFC] text-xs font-semibold transition-all duration-200 min-h-[44px]"
            >
              {copiedField === 'both' ? (
                <>
                  <Check className="w-4 h-4 text-[#00D084]" />
                  <span>ĐÃ COPY CẢ USERNAME & PASSWORD</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#8B5CF6]" />
                  <span>COPY BOTH (USERNAME + PASSWORD)</span>
                </>
              )}
            </button>

            {/* Next Account Button */}
            <button
              onClick={() => {
                onClose();
                onCreateNext();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-primary text-white text-sm font-semibold shadow-glow-blue-sm active:scale-95 transition-all duration-200 min-h-[44px]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ TẠO TÀI KHOẢN TIẾP THEO</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
