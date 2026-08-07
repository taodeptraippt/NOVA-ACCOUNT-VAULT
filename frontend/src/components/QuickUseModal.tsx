'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Plus, Eye, EyeOff, Sparkles, ShieldCheck } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0F1420] border border-[#20283A] rounded-xl max-w-md w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#20283A] bg-[#080B12]/60">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-[#4F7CFF] bg-[#4F7CFF]/10 px-2 py-0.5 rounded border border-[#4F7CFF]/30">
              {account.nova_id}
            </span>
            <span className="text-xs font-semibold text-[#22C55E] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
              Sẵn sàng sử dụng
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#8993A4] hover:text-[#F5F7FA] p-1 rounded-lg hover:bg-[#20283A] transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Credentials View */}
        <div className="p-5 space-y-4">
          {/* Username Item */}
          <div className="bg-[#080B12] border border-[#20283A] rounded-lg p-3">
            <div className="text-[11px] font-bold text-[#8993A4] uppercase tracking-wider mb-1">
              Username
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-base font-bold text-[#F5F7FA] truncate">
                {account.username}
              </span>
              <button
                onClick={() => copyToClipboard(account.username, 'username')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#20283A] hover:bg-[#4F7CFF] text-[#F5F7FA] text-xs font-semibold transition-colors flex-shrink-0"
              >
                {copiedField === 'username' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span>Đã Copy</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Password Item */}
          <div className="bg-[#080B12] border border-[#20283A] rounded-lg p-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#8993A4] uppercase tracking-wider mb-1">
              <span>Password</span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#8993A4] hover:text-[#F5F7FA] flex items-center gap-1 text-[11px] lowercase"
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showPassword ? 'Ẩn' : 'Hiện'}</span>
              </button>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-base font-bold text-[#F5F7FA] truncate">
                {showPassword ? plainPassword : '••••••••••••••••'}
              </span>
              <button
                onClick={() => copyToClipboard(plainPassword, 'password')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#20283A] hover:bg-[#4F7CFF] text-[#F5F7FA] text-xs font-semibold transition-colors flex-shrink-0"
              >
                {copiedField === 'password' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span>Đã Copy</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Large Action Buttons */}
          <div className="space-y-2 pt-2">
            {/* Copy Both */}
            <button
              onClick={() => copyToClipboard(copyBothText, 'both')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#20283A] hover:bg-[#2A354D] border border-[#20283A] text-[#F5F7FA] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              {copiedField === 'both' ? (
                <>
                  <Check className="w-4 h-4 text-[#22C55E]" />
                  <span>ĐÃ COPY CẢ USERNAME & PASSWORD</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#7C5CFF]" />
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
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#4F7CFF] hover:bg-[#3B69EE] text-white text-sm font-bold tracking-wide transition-all shadow-lg shadow-[#4F7CFF]/25 active:scale-98"
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
