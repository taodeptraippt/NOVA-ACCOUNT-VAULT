'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { api, Stats } from '@/lib/api';
import { useDashboard } from '@/lib/dashboard-context';
import {
  DatabaseBackup,
  FileDown,
  Upload,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
} from 'lucide-react';

export default function BackupPage() {
  const { handleExport, exporting, showToast } = useDashboard();
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, paused: 0, archived: 0 });
  const [lastBackup, setLastBackup] = useState<string | null>(null);

  // Load real stats for backup overview
  const loadData = useCallback(async () => {
    try {
      const statsData = await api.getStats();
      setStats(statsData);
    } catch {
      // ignore — stats may not be available
    }
  }, []);

  useEffect(() => {
    loadData();
    // Check if a backup was performed this session (from localStorage)
    const saved = localStorage.getItem('nova_last_backup');
    if (saved) setLastBackup(saved);
  }, [loadData]);

  const handleExportWithTimestamp = async () => {
    await handleExport();
    const now = new Date().toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    localStorage.setItem('nova_last_backup', now);
    setLastBackup(now);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F8FAFC]">Backup</h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
          Sao lưu dữ liệu tài khoản NOVA VAULT
        </p>
      </div>

      {/* Backup Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Overview Card */}
        <div className="glass-panel rounded-xl p-5 lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow-blue-sm">
              <DatabaseBackup className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#F8FAFC]">Tổng quan backup</h2>
              <p className="text-[11px] text-[#64748B]">Dữ liệu tài khoản NOVA</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[rgba(10,15,28,0.6)] border border-[rgba(148,163,184,0.12)] rounded-lg p-3">
              <div className="text-2xl font-bold font-mono text-[#4D7CFF]">{stats.total}</div>
              <div className="text-[10px] text-[#64748B] mt-1">Tổng tài khoản</div>
            </div>
            <div className="bg-[rgba(10,15,28,0.6)] border border-[rgba(148,163,184,0.12)] rounded-lg p-3">
              <div className="text-2xl font-bold font-mono text-[#00D084]">{stats.active}</div>
              <div className="text-[10px] text-[#64748B] mt-1">Đang hoạt động</div>
            </div>
            <div className="bg-[rgba(10,15,28,0.6)] border border-[rgba(148,163,184,0.12)] rounded-lg p-3">
              <div className="text-2xl font-bold font-mono text-[#F59E0B]">{stats.paused}</div>
              <div className="text-[10px] text-[#64748B] mt-1">Tạm dừng</div>
            </div>
            <div className="bg-[rgba(10,15,28,0.6)] border border-[rgba(148,163,184,0.12)] rounded-lg p-3">
              <div className="text-2xl font-bold font-mono text-[#8B5CF6]">{stats.archived}</div>
              <div className="text-[10px] text-[#64748B] mt-1">Đã lưu trữ</div>
            </div>
          </div>
        </div>

        {/* Last Backup Status */}
        <div className="glass-panel rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: lastBackup
                  ? 'rgba(0,208,132,0.1)'
                  : 'rgba(245,158,11,0.1)',
                border: `1px solid ${lastBackup ? 'rgba(0,208,132,0.25)' : 'rgba(245,158,11,0.25)'}`,
                color: lastBackup ? '#00D084' : '#F59E0B',
              }}
            >
              {lastBackup ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#F8FAFC]">Trạng thái backup</h2>
              <p className="text-[11px] text-[#64748B]">Lần backup gần nhất</p>
            </div>
          </div>

          {lastBackup ? (
            <div className="flex items-center gap-2 text-[13px] text-[#00D084]">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{lastBackup}</span>
            </div>
          ) : (
            <div className="text-[13px] text-[#F59E0B]">
              Chưa có backup nào trong phiên này
            </div>
          )}

          <div className="text-[11px] text-[#64748B] mt-2">
            {stats.total} tài khoản sẽ được bao gồm trong file backup
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="glass-panel rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary-soft flex items-center justify-center">
            <FileDown className="w-5 h-5 text-[#8B5CF6]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#F8FAFC]">Xuất backup</h2>
            <p className="text-[11px] text-[#64748B]">
              Tải file .txt chứa toàn bộ tài khoản và mật khẩu
            </p>
          </div>
        </div>

        <button
          onClick={handleExportWithTimestamp}
          disabled={exporting}
          className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
        >
          <FileDown className="w-4 h-4" />
          <span>{exporting ? 'Đang xuất...' : 'Export backup .txt'}</span>
        </button>

        <div className="mt-4 flex items-start gap-2 text-[11px] text-[#64748B]">
          <ShieldCheck className="w-4 h-4 text-[#4D7CFF] flex-shrink-0 mt-0.5" />
          <p>
            File backup chứa toàn bộ thông tin tài khoản (username, mật khẩu, ghi chú). Hãy lưu trữ
            file này ở nơi an toàn.
          </p>
        </div>
      </div>

      {/* Restore Section — Coming Soon (no backend restore API exists) */}
      <div className="glass-panel rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.25)] flex items-center justify-center">
            <Upload className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#F8FAFC]">Khôi phục dữ liệu</h2>
            <p className="text-[11px] text-[#64748B]">Khôi phục từ file backup</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[13px] text-[#F59E0B] mb-3">
          <AlertTriangle className="w-4 h-4" />
          <span>Coming soon</span>
        </div>

        <p className="text-xs text-[#64748B]">
          Tính năng khôi phục dữ liệu từ file backup sẽ được hỗ trợ trong phiên bản tiếp theo.
          Hiện tại bạn chỉ có thể xuất backup dưới dạng file .txt.
        </p>
      </div>
    </div>
  );
}
