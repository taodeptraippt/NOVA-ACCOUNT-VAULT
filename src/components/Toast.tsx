'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 2000); // Auto dismiss after 2s
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const bgStyles = {
    success: 'bg-[#0F1420] border-[#22C55E] text-[#F5F7FA]',
    error: 'bg-[#0F1420] border-[#EF4444] text-[#F5F7FA]',
    info: 'bg-[#0F1420] border-[#4F7CFF] text-[#F5F7FA]',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#22C55E] flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-[#4F7CFF] flex-shrink-0" />,
  };

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-lg border shadow-lg transition-all transform translate-y-0 animate-in fade-in duration-200 ${bgStyles[toast.type]}`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {icons[toast.type]}
        <span className="text-sm font-medium truncate">{toast.text}</span>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-[#8993A4] hover:text-[#F5F7FA] transition-colors p-1"
        aria-label="Đóng thông báo"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
