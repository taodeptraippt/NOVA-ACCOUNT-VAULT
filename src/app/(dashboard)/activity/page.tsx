'use client';

import React, { useState } from 'react';
import { Activity, Search, Filter, Clock, ShieldCheck } from 'lucide-react';

export default function ActivityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('ALL');

  // No activity API exists yet — show empty state structure
  // This page is prepared for future API integration

  const filters = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'ACCOUNT', label: 'Tài khoản' },
    { value: 'AUTH', label: 'Đăng nhập' },
    { value: 'SETTINGS', label: 'Cài đặt' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F8FAFC]">
          Nhật ký hoạt động
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
          Theo dõi các hoạt động trên hệ thống NOVA VAULT
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm hoạt động..."
            className="w-full bg-[rgba(10,15,28,0.6)] text-[13px] text-[#F8FAFC] placeholder-[#64748B] rounded-lg pl-10 pr-4 py-2.5 border border-[rgba(148,163,184,0.12)] focus:outline-none focus:border-[#4D7CFF]/50 focus:shadow-glow-blue-sm transition-all duration-200"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#8B5CF6]" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[rgba(10,15,28,0.6)] border border-[rgba(148,163,184,0.12)] text-[#94A3B8] text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#4D7CFF]/50 transition-all duration-200"
          >
            {filters.map((f) => (
              <option key={f.value} value={f.value} className="bg-[#0A0F1C] text-[#94A3B8]">
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Empty State — no activity data yet */}
      <div className="glass-panel rounded-xl p-12 text-center">
        <div className="relative w-16 h-16 rounded-full bg-gradient-primary-soft flex items-center justify-center mx-auto mb-4">
          <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-20 blur-lg" />
          <Activity className="w-7 h-7 text-[#4D7CFF] relative" />
        </div>
        <h4 className="text-base font-bold text-[#F8FAFC] mb-1">Chưa có hoạt động</h4>
        <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
          Dữ liệu hoạt động sẽ xuất hiện tại đây. Các hành động như tạo tài khoản, đăng nhập, chỉnh
          sửa, backup sẽ được ghi lại.
        </p>

        {/* Timeline structure for future integration */}
        <div className="mt-8 max-w-lg mx-auto text-left opacity-40">
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#4D7CFF] shadow-glow-blue-sm" />
              <div className="w-px h-12 bg-[rgba(148,163,184,0.2)]" />
            </div>
            <div className="glass-panel-subtle rounded-lg px-4 py-3 flex-1">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                <span className="text-[11px] text-[#64748B] font-mono">--/--/---- --:--</span>
              </div>
              <div className="text-xs text-[#94A3B8] mt-1">Hoạt động sẽ hiển thị tại đây</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
