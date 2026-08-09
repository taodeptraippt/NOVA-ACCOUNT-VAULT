'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api, Account, Stats } from '@/lib/api';
import { useDashboard } from '@/lib/dashboard-context';
import { StatsCards } from '@/components/StatsCards';
import {
  Plus,
  DatabaseBackup,
  Users,
  Activity,
  ShieldCheck,
  ArrowRight,
  FileDown,
  Clock,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { openAddAccount, handleExport, exporting, showToast } = useDashboard();

  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, paused: 0, archived: 0 });
  const [recentAccounts, setRecentAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, recentData] = await Promise.all([
        api.getStats(),
        api.getAccounts('', 'ALL', 'newest'),
      ]);
      setStats(statsData);
      setRecentAccounts(recentData.slice(0, 5));
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi tải dữ liệu dashboard', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const statusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[rgba(0,208,132,0.1)] text-[#00D084] border border-[rgba(0,208,132,0.25)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D084]" />
            ACTIVE
          </span>
        );
      case 'PAUSED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[rgba(245,158,11,0.1)] text-[#F59E0B] border border-[rgba(245,158,11,0.25)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
            PAUSED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[rgba(139,92,246,0.1)] text-[#8B5CF6] border border-[rgba(139,92,246,0.25)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
            ARCHIVED
          </span>
        );
    }
  };

  const quickActions = [
    {
      label: 'Thêm tài khoản',
      desc: 'Tạo tài khoản NOVA mới',
      icon: <Plus className="w-5 h-5" />,
      accent: '#4D7CFF',
      onClick: openAddAccount,
    },
    {
      label: 'Xem tài khoản',
      desc: 'Quản lý toàn bộ tài khoản',
      icon: <Users className="w-5 h-5" />,
      accent: '#8B5CF6',
      onClick: () => router.push('/accounts'),
    },
    {
      label: 'Backup .txt',
      desc: 'Tải backup toàn bộ dữ liệu',
      icon: <DatabaseBackup className="w-5 h-5" />,
      accent: '#00D084',
      onClick: handleExport,
      loading: exporting,
    },
    {
      label: 'Nhật ký',
      desc: 'Xem hoạt động hệ thống',
      icon: <Activity className="w-5 h-5" />,
      accent: '#F59E0B',
      onClick: () => router.push('/activity'),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F8FAFC]">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Tổng quan hệ thống NOVA VAULT
          </p>
        </div>
        <button
          onClick={openAddAccount}
          className="btn-primary hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Thêm tài khoản</span>
        </button>
      </div>

      {/* Stats Cards */}
      <StatsCards
        stats={stats}
        selectedStatus="ALL"
        onSelectStatus={(st) => router.push(`/accounts`)}
      />

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            disabled={action.loading}
            className="group relative glass-panel rounded-xl p-4 text-left transition-all duration-200 hover:border-[rgba(77,124,255,0.3)] disabled:opacity-50"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
              style={{
                background: `linear-gradient(135deg, ${action.accent}20 0%, ${action.accent}10 100%)`,
                border: `1px solid ${action.accent}30`,
                boxShadow: `0 0 12px ${action.accent}20`,
                color: action.accent,
              }}
            >
              {action.icon}
            </div>
            <div className="text-sm font-semibold text-[#F8FAFC]">
              {action.loading ? 'Đang xuất...' : action.label}
            </div>
            <div className="text-[11px] text-[#64748B] mt-0.5">{action.desc}</div>
          </button>
        ))}
      </div>

      {/* Recent Accounts */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-[rgba(148,163,184,0.12)]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#4D7CFF]" />
            <h2 className="text-sm font-bold text-[#F8FAFC]">Tài khoản gần đây</h2>
          </div>
          <button
            onClick={() => router.push('/accounts')}
            className="flex items-center gap-1 text-xs text-[#4D7CFF] hover:text-[#8B5CF6] transition-colors"
          >
            Xem tất cả
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-[rgba(10,15,28,0.6)] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : recentAccounts.length === 0 ? (
          <div className="p-8 text-center">
            <div className="relative w-14 h-14 rounded-full bg-gradient-primary-soft flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-6 h-6 text-[#4D7CFF]" />
            </div>
            <h4 className="text-base font-bold text-[#F8FAFC] mb-1">Chưa có tài khoản nào</h4>
            <p className="text-xs text-[#94A3B8] mb-4">
              Tạo tài khoản NOVA đầu tiên để bắt đầu sử dụng hệ thống.
            </p>
            <button
              onClick={openAddAccount}
              className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm tài khoản đầu tiên</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[rgba(148,163,184,0.08)]">
            {recentAccounts.map((acc) => (
              <button
                key={acc.id}
                onClick={() => router.push('/accounts')}
                className="w-full flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-[rgba(148,163,184,0.04)] transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-primary-soft flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-[#4D7CFF] font-mono">
                    {acc.nova_id.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#F8FAFC] truncate font-mono">
                    {acc.username}
                  </div>
                  <div className="text-[11px] text-[#64748B] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(acc.created_at).toLocaleDateString('vi-VN')}
                  </div>
                </div>
                {statusBadge(acc.status)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
