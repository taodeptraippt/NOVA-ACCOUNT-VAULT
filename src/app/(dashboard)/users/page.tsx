'use client';

import React from 'react';
import { Users, ShieldCheck, Search, Plus, Mail, Calendar } from 'lucide-react';

export default function UsersPage() {
  // No user list API exists yet — show empty state structure
  // This page is prepared for future user management integration

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F8FAFC]">Người dùng</h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Quản lý người dùng truy cập hệ thống NOVA VAULT
          </p>
        </div>
        <button
          disabled
          className="btn-primary hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold opacity-40 cursor-not-allowed"
          title="Coming soon"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Thêm người dùng</span>
        </button>
      </div>

      {/* Search Bar (disabled - no data yet) */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          disabled
          placeholder="Tìm kiếm người dùng..."
          className="w-full bg-[rgba(10,15,28,0.6)] text-[13px] text-[#F8FAFC] placeholder-[#64748B] rounded-lg pl-10 pr-4 py-2.5 border border-[rgba(148,163,184,0.12)] focus:outline-none focus:border-[#4D7CFF]/50 focus:shadow-glow-blue-sm transition-all duration-200 opacity-50 cursor-not-allowed"
        />
      </div>

      {/* Empty State */}
      <div className="glass-panel rounded-xl p-12 text-center">
        <div className="relative w-16 h-16 rounded-full bg-gradient-primary-soft flex items-center justify-center mx-auto mb-4">
          <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-20 blur-lg" />
          <Users className="w-7 h-7 text-[#4D7CFF] relative" />
        </div>
        <h4 className="text-base font-bold text-[#F8FAFC] mb-1">Chưa có người dùng</h4>
        <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
          Danh sách người dùng sẽ xuất hiện tại đây. Tính năng quản lý người dùng sẽ được hỗ trợ
          trong phiên bản tiếp theo.
        </p>

        {/* Table structure preview for future integration */}
        <div className="mt-8 max-w-2xl mx-auto opacity-40">
          <div className="glass-panel-subtle rounded-lg overflow-hidden">
            <div className="grid grid-cols-4 gap-3 px-4 py-3 border-b border-[rgba(148,163,184,0.1)] text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
              <div>Người dùng</div>
              <div>Vai trò</div>
              <div>Trạng thái</div>
              <div>Ngày tạo</div>
            </div>
            <div className="flex items-center gap-3 px-4 py-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary-soft flex items-center justify-center">
                <Mail className="w-4 h-4 text-[#4D7CFF]" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-xs text-[#94A3B8]">admin@nova.vault</div>
                <div className="text-[10px] text-[#64748B]">Quản trị viên</div>
              </div>
              <ShieldCheck className="w-4 h-4 text-[#00D084]" />
              <Calendar className="w-4 h-4 text-[#64748B]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
