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
    <div className="fixed bottom-20 right-4 sm:bottom-5 sm:right-5 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100%-2rem)] sm:w-full pointer-events-none">
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
    }, 2000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const config = {
    success: {
      border: 'rgba(0,208,132,0.3)',
      glow: '0 0 20px rgba(0,208,132,0.15)',
      icon: <CheckCircle2 className="w-5 h-5 text-[#00D084] flex-shrink-0" />,
      accent: '#00D084',
    },
    error: {
      border: 'rgba(244,63,94,0.3)',
      glow: '0 0 20px rgba(244,63,94,0.15)',
      icon: <AlertCircle className="w-5 h-5 text-[#F43F5E] flex-shrink-0" />,
      accent: '#F43F5E',
    },
    info: {
      border: 'rgba(77,124,255,0.3)',
      glow: '0 0 20px rgba(77,124,255,0.15)',
      icon: <Info className="w-5 h-5 text-[#4D7CFF] flex-shrink-0" />,
      accent: '#4D7CFF',
    },
  }[toast.type];

  return (
    <div
      className="pointer-events-auto relative flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl bg-[rgba(10,15,28,0.9)] border backdrop-blur-xl animate-slide-up overflow-hidden"
      style={{
        borderColor: config.border,
        boxShadow: `${config.glow}, 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 0 rgba(255,255,255,0.04)`,
      }}
    >
      {/* Accent line */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{
          background: `linear-gradient(to bottom, ${config.accent}, transparent)`,
        }}
      />
      <div className="flex items-center gap-2.5 min-w-0 pl-1">
        {config.icon}
        <span className="text-sm font-medium text-[#F8FAFC] truncate">{toast.text}</span>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-[#64748B] hover:text-[#F8FAFC] transition-colors p-1.5 rounded-lg min-w-[32px] min-h-[32px] flex items-center justify-center"
        aria-label="Đóng thông báo"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
