'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0F1420] border border-[#20283A] rounded-xl max-w-sm w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#20283A] bg-[#080B12]/60">
          <div className="flex items-center gap-2 text-[#EF4444]">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-base font-bold">XÁC NHẬN LƯU TRỮ</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#8993A4] hover:text-[#F5F7FA] p-1 rounded-lg hover:bg-[#20283A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3 text-center">
          <p className="text-xs text-[#8993A4]">
            Tài khoản này sẽ được chuyển sang trạng thái <strong className="text-[#F5F7FA]">ARCHIVED</strong>.
          </p>
          <div className="bg-[#080B12] border border-[#20283A] rounded-lg p-3 my-2">
            <div className="font-mono text-sm font-bold text-[#4F7CFF]">{account.nova_id}</div>
            <div className="font-mono text-base font-bold text-[#F5F7FA] mt-0.5">{account.username}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 px-5 py-4 border-t border-[#20283A] bg-[#080B12]/60">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-[#8993A4] hover:text-[#F5F7FA] hover:bg-[#20283A]"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              onConfirm(account);
              onClose();
            }}
            className="px-5 py-2 rounded-lg bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-bold transition-all shadow-md"
          >
            Lưu trữ ngay
          </button>
        </div>
      </div>
    </div>
  );
};
