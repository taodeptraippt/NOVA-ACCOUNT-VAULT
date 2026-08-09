'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, User } from '@/lib/api';
import { ToastMessage } from '@/components/Toast';

interface DashboardContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  handleExport: () => Promise<void>;
  exporting: boolean;
  toasts: ToastMessage[];
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  openAddAccount: () => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
};

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [exporting, setExporting] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    router.push('/login');
  }, [router]);

  // Export backup .txt
  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      await api.exportTxt();
      showToast('✓ Đã tải backup .txt (toàn bộ tài khoản + mật khẩu)', 'success');
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi xuất backup', 'error');
    } finally {
      setExporting(false);
    }
  }, [showToast]);

  const openAddAccount = useCallback(() => {
    router.push('/accounts?add=1');
  }, [router]);

  return (
    <DashboardContext.Provider
      value={{
        user,
        setUser,
        logout,
        handleExport,
        exporting,
        toasts,
        showToast,
        dismissToast,
        mobileNavOpen,
        setMobileNavOpen,
        openAddAccount,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
