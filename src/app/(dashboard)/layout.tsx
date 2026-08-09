'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { DashboardProvider, useDashboard } from '@/lib/dashboard-context';
import { BackgroundFX } from '@/components/BackgroundFX';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { MobileNav } from '@/components/MobileNav';
import { ToastContainer } from '@/components/Toast';

function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, setUser, logout, toasts, dismissToast, mobileNavOpen, setMobileNavOpen, openAddAccount } = useDashboard();

  // Authenticate once on first mount of the shared shell
  useEffect(() => {
    let cancelled = false;
    api
      .getMe()
      .then((userData) => {
        if (!cancelled) setUser(userData);
      })
      .catch(() => {
        if (!cancelled) router.push('/login');
      });
    return () => {
      cancelled = true;
    };
  }, [router, setUser]);

  return (
    <div className="min-h-screen bg-[#050812] text-[#F8FAFC]">
      <BackgroundFX />

      <div className="relative flex min-h-screen">
        {/* Sidebar (Desktop) */}
        <Sidebar user={user} onOpenAddModal={openAddAccount} />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Topbar */}
          <Topbar user={user} />

          {/* Main Content */}
          <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8 pb-24 lg:pb-8">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        user={user}
        onOpenAddModal={openAddAccount}
        onLogout={logout}
      />

      {/* Toast System */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardShell>{children}</DashboardShell>
    </DashboardProvider>
  );
}
