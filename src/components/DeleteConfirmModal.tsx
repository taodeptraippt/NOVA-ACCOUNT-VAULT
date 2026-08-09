'use client';

import React from 'react';
import { AlertTriangle, X, ShieldCheck } from 'lucide-react';
import { Account } from '@/lib/api';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  account: Account | null;
  onClose: () => void;
  onConfirm: (account: Account) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  account,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !account) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full sm:max-w-sm max-h-[92vh] overflow-y-auto bg-[#0A0F1C] border-t sm:border border-[rgba(148,163,184,0.12)] sm:rounded-xl shadow-2xl animate-slide-up sm:animate-scale-in">
        {/* Ambient red glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(244,63,94,0.06) 0%, transparent 60%)',
          }}
        />

        {/* Header */}
        <div className="relative flex items-center justify-between px-5 py-4 border-b border-[rgba(148,163,184,0.12)] bg-[rgba(5,8,18,0.4)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[rgba(244,63,94,0.1)] border border-[rgba(244,63,94,0.2)] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-[#F43F5E]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F8FAFC]">XÁC NHẬN LƯU TRỮ</h3>
              <p className="text-[10px] text-[#64748B] mt-0.5">Chuyển tài khoản sang ARCHIVED</p>
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

        {/* Content */}
        <div className="relative p-5 space-y-3 text-center">
          <p className="text-xs text-[#94A3B8]">
            Tài khoản này sẽ được chuyển sang trạng thái{' '}
            <strong className="text-[#F8FAFC]">ARCHIVED</strong>.
          </p>
          <div className="relative overflow-hidden bg-[rgba(5,8,18,0.6)] border border-[rgba(148,163,184,0.12)] rounded-lg p-4 my-3">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(244,63,94,0.05) 0%, transparent 60%)',
              }}
            />
            <div className="relative">
              <div className="font-mono text-sm font-bold text-[#4D7CFF]">{account.nova_id}</div>
              <div className="font-mono text-base font-bold text-[#F8FAFC] mt-1">{account.username}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="relative flex items-center justify-end gap-2.5 px-5 py-4 border-t border-[rgba(148,163,184,0.12)] bg-[rgba(5,8,18,0.4)]">
          <button
            onClick={onClose}
            className="px-4 py-3 rounded-lg text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[rgba(148,163,184,0.08)] transition-colors min-h-[44px]"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              onConfirm(account);
              onClose();
            }}
            className="flex items-center gap-1.5 px-5 py-3 rounded-lg bg-gradient-to-r from-[#F43F5E] to-[#E11D48] text-white text-xs font-semibold shadow-glow-red active:scale-95 transition-all duration-200 min-h-[44px]"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Lưu trữ ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
};
