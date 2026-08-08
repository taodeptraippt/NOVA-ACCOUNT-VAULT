'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api, Account, Stats, User } from '@/lib/api';
import { Header } from '@/components/Header';
import { StatsCards } from '@/components/StatsCards';
import { SearchBar } from '@/components/SearchBar';
import { AccountTable } from '@/components/AccountTable';
import { AccountCardList } from '@/components/AccountCard';
import { AddAccountModal } from '@/components/AddAccountModal';
import { QuickUseModal } from '@/components/QuickUseModal';
import { AccountDetailModal } from '@/components/AccountDetailModal';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { ToastContainer, ToastMessage } from '@/components/Toast';
import { Plus } from 'lucide-react';

export default function VaultPage() {
  const router = useRouter();

  // User & Auth State
  const [user, setUser] = useState<User | null>(null);

  // Accounts Data State
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, paused: 0, archived: 0 });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');

  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Quick Use Modal State (Immediate use after creation or viewing)
  const [quickUseState, setQuickUseState] = useState<{
    isOpen: boolean;
    account: Account | null;
    plainPassword: string;
  }>({
    isOpen: false,
    account: null,
    plainPassword: '',
  });

  // Account Detail / Edit Modal State
  const [detailModalState, setDetailModalState] = useState<{
    isOpen: boolean;
    account: Account | null;
    mode: 'view' | 'edit';
  }>({
    isOpen: false,
    account: null,
    mode: 'view',
  });

  // Archive / Delete Modal State
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    account: Account | null;
  }>({
    isOpen: false,
    account: null,
  });

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch current user on mount
  useEffect(() => {
    api
      .getMe()
      .then((userData) => setUser(userData))
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  // Load Accounts & Stats
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [accList, statsData] = await Promise.all([
        api.getAccounts(searchQuery, statusFilter, sortBy),
        api.getStats(),
      ]);
      setAccounts(accList);
      setStats(statsData);
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi tải danh sách tài khoản', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, sortBy, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Logout handler
  const handleLogout = async () => {
    await api.logout();
    router.push('/login');
  };

  // Export backup .txt
  const handleExport = async () => {
    setExporting(true);
    try {
      await api.exportTxt();
      showToast('✓ Đã tải backup .txt (toàn bộ tài khoản + mật khẩu)', 'success');
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi xuất backup', 'error');
    } finally {
      setExporting(false);
    }
  };

  // Fast Add Account Success handler -> Immediately open Quick Use modal
  const handleAddSuccess = (newAccount: Account, plainPassword: string) => {
    setIsAddModalOpen(false);
    loadData();
    // Open Quick Use Modal immediately
    setQuickUseState({
      isOpen: true,
      account: newAccount,
      plainPassword: plainPassword,
    });
  };

  // View Account (fetches decrypted password for quick use)
  const handleViewAccount = async (account: Account) => {
    try {
      const cred = await api.getCredential(account.id);
      setQuickUseState({
        isOpen: true,
        account: account,
        plainPassword: cred.password,
      });
    } catch (err: any) {
      showToast('Không thể giải mã mật khẩu tài khoản này', 'error');
    }
  };

  // Fast Copy Username
  const handleCopyUsername = (username: string) => {
    navigator.clipboard.writeText(username);
    showToast('✓ Đã copy Username', 'success');
  };

  // Fast Copy Password directly from list
  const handleCopyPassword = async (account: Account) => {
    try {
      const cred = await api.getCredential(account.id);
      navigator.clipboard.writeText(cred.password);
      showToast(`✓ Đã copy Mật khẩu (${account.nova_id})`, 'success');
    } catch (err: any) {
      showToast('Lỗi copy mật khẩu', 'error');
    }
  };

  // Archive Account Handler
  const handleArchiveConfirm = async (account: Account) => {
    try {
      await api.archiveAccount(account.id);
      showToast(`✓ Đã lưu trữ tài khoản ${account.nova_id}`, 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi lưu trữ tài khoản', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#080B12] text-[#F5F7FA] pb-16">
      {/* Header */}
      <Header
        user={user}
        onLogout={handleLogout}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onExport={handleExport}
        exporting={exporting}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Page Title & Add Button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F5F7FA]">
              Tài khoản của bạn
            </h1>
            <p className="text-xs sm:text-sm text-[#8993A4]">
              Tạo, lưu trữ và sử dụng nhanh thông tin tài khoản NOVA
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#4F7CFF] hover:bg-[#3B69EE] text-white text-sm font-bold transition-all shadow-lg shadow-[#4F7CFF]/20 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Thêm tài khoản</span>
          </button>
        </div>

        {/* Stats Summary */}
        <StatsCards
          stats={stats}
          selectedStatus={statusFilter}
          onSelectStatus={(st) => setStatusFilter(st)}
        />

        {/* Search & Filter Bar */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={(q) => setSearchQuery(q)}
          statusFilter={statusFilter}
          onStatusChange={(st) => setStatusFilter(st)}
          sortBy={sortBy}
          onSortChange={(s) => setSortBy(s)}
        />

        {/* Accounts Table (Desktop) */}
        <AccountTable
          accounts={accounts}
          loading={loading}
          onView={handleViewAccount}
          onCopyUsername={handleCopyUsername}
          onCopyPassword={handleCopyPassword}
          onEdit={(acc) => setDetailModalState({ isOpen: true, account: acc, mode: 'edit' })}
          onArchive={(acc) => setDeleteModalState({ isOpen: true, account: acc })}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />

        {/* Accounts Cards (Mobile) */}
        <AccountCardList
          accounts={accounts}
          loading={loading}
          onView={handleViewAccount}
          onCopyUsername={handleCopyUsername}
          onCopyPassword={handleCopyPassword}
          onEdit={(acc) => setDetailModalState({ isOpen: true, account: acc, mode: 'edit' })}
          onArchive={(acc) => setDeleteModalState({ isOpen: true, account: acc })}
        />
      </main>

      {/* MODALS */}
      {/* 1. Add Account Modal (Pre-filled Auto Generator) */}
      <AddAccountModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
        showToast={showToast}
      />

      {/* 2. Quick Use Modal (Immediate use, Copy, and Create Next) */}
      <QuickUseModal
        isOpen={quickUseState.isOpen}
        account={quickUseState.account}
        plainPassword={quickUseState.plainPassword}
        onClose={() => setQuickUseState({ isOpen: false, account: null, plainPassword: '' })}
        onCreateNext={() => setIsAddModalOpen(true)}
        showToast={showToast}
      />

      {/* 3. Account Detail & Edit Modal */}
      <AccountDetailModal
        isOpen={detailModalState.isOpen}
        account={detailModalState.account}
        mode={detailModalState.mode}
        onClose={() => setDetailModalState({ isOpen: false, account: null, mode: 'view' })}
        onUpdateSuccess={loadData}
        onArchive={(acc) => {
          setDetailModalState({ isOpen: false, account: null, mode: 'view' });
          setDeleteModalState({ isOpen: true, account: acc });
        }}
        showToast={showToast}
      />

      {/* 4. Delete / Archive Confirm Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        account={deleteModalState.account}
        onClose={() => setDeleteModalState({ isOpen: false, account: null })}
        onConfirm={handleArchiveConfirm}
      />

      {/* Toast System */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
