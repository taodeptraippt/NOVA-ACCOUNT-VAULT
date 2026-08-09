'use client';

import React, { useState } from 'react';
import { KeyRound, ShieldCheck, Users, Check, X, AlertTriangle, Lock } from 'lucide-react';

export default function RolesPage() {
  const [selectedRole, setSelectedRole] = useState('admin');

  // UI foundation only — backend permission logic does not exist yet
  const roles = [
    {
      id: 'admin',
      name: 'Admin',
      description: 'Toàn quyền quản trị hệ thống',
      users: 1,
      color: '#4D7CFF',
      permissions: {
        accounts: { view: true, create: true, edit: true, delete: true },
        backup: { view: true, export: true, restore: true },
        users: { view: true, manage: true },
        settings: { view: true, edit: true },
      },
    },
    {
      id: 'manager',
      name: 'Manager',
      description: 'Quản lý tài khoản và báo cáo',
      users: 0,
      color: '#8B5CF6',
      permissions: {
        accounts: { view: true, create: true, edit: true, delete: false },
        backup: { view: true, export: true, restore: false },
        users: { view: true, manage: false },
        settings: { view: true, edit: false },
      },
    },
    {
      id: 'viewer',
      name: 'Viewer',
      description: 'Chỉ xem dữ liệu',
      users: 0,
      color: '#00D084',
      permissions: {
        accounts: { view: true, create: false, edit: false, delete: false },
        backup: { view: true, export: false, restore: false },
        users: { view: false, manage: false },
        settings: { view: false, edit: false },
      },
    },
  ];

  const selected = roles.find((r) => r.id === selectedRole) || roles[0];

  const permissionGroups = [
    { key: 'accounts', label: 'Tài khoản', items: [
      { key: 'view', label: 'Xem tài khoản' },
      { key: 'create', label: 'Tạo tài khoản' },
      { key: 'edit', label: 'Chỉnh sửa' },
      { key: 'delete', label: 'Xóa / Lưu trữ' },
    ]},
    { key: 'backup', label: 'Backup', items: [
      { key: 'view', label: 'Xem backup' },
      { key: 'export', label: 'Xuất backup' },
      { key: 'restore', label: 'Khôi phục' },
    ]},
    { key: 'users', label: 'Người dùng', items: [
      { key: 'view', label: 'Xem người dùng' },
      { key: 'manage', label: 'Quản lý người dùng' },
    ]},
    { key: 'settings', label: 'Cài đặt', items: [
      { key: 'view', label: 'Xem cài đặt' },
      { key: 'edit', label: 'Chỉnh sửa cài đặt' },
    ]},
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F8FAFC]">
          Vai trò & Phân quyền
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
          Quản lý vai trò và quyền truy cập hệ thống
        </p>
      </div>

      {/* Coming Soon Notice */}
      <div className="flex items-start gap-3 glass-panel rounded-xl p-4 border-[rgba(245,158,11,0.2)]">
        <AlertTriangle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
        <div>
          <div className="text-sm font-semibold text-[#F59E0B]">Giao diện quản lý quyền</div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Đây là giao diện nền tảng cho việc quản lý vai trò. Hệ thống phân quyền thực tế sẽ được
            kích hoạt khi backend hỗ trợ. Hiện tại các quyền hiển thị chỉ mang tính tham khảo.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Roles List */}
        <div className="glass-panel rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 px-2 py-2">
            <KeyRound className="w-4 h-4 text-[#4D7CFF]" />
            <h2 className="text-sm font-bold text-[#F8FAFC]">Vai trò</h2>
          </div>

          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 text-left ${
                selectedRole === role.id
                  ? 'border-[rgba(77,124,255,0.4)] bg-[rgba(77,124,255,0.08)]'
                  : 'border-[rgba(148,163,184,0.12)] bg-[rgba(10,15,28,0.6)] hover:border-[rgba(148,163,184,0.3)]'
              }`}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: `${role.color}20`,
                  border: `1px solid ${role.color}30`,
                  color: role.color,
                }}
              >
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[#F8FAFC]">{role.name}</div>
                <div className="text-[11px] text-[#64748B] truncate">{role.description}</div>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[#64748B]">
                <Users className="w-3 h-3" />
                {role.users}
              </div>
            </button>
          ))}
        </div>

        {/* Permissions Matrix */}
        <div className="glass-panel rounded-xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  background: `${selected.color}20`,
                  border: `1px solid ${selected.color}30`,
                  color: selected.color,
                }}
              >
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#F8FAFC]">Quyền của {selected.name}</h2>
                <p className="text-[11px] text-[#64748B]">{selected.description}</p>
              </div>
            </div>
            <span className="text-[10px] text-[#64748B] flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Chỉ xem
            </span>
          </div>

          <div className="space-y-4">
            {permissionGroups.map((group) => (
              <div key={group.key} className="bg-[rgba(10,15,28,0.6)] border border-[rgba(148,163,184,0.12)] rounded-lg p-4">
                <div className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-3">
                  {group.label}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {group.items.map((item) => {
                    const perms = selected.permissions[group.key as keyof typeof selected.permissions] as Record<string, boolean>;
                    const allowed = perms?.[item.key] ?? false;
                    return (
                      <div key={item.key} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[rgba(5,8,18,0.4)]">
                        <span className="text-xs text-[#94A3B8]">{item.label}</span>
                        {allowed ? (
                          <span className="flex items-center gap-1 text-[11px] text-[#00D084]">
                            <Check className="w-3.5 h-3.5" />
                            Cho phép
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] text-[#64748B]">
                            <X className="w-3.5 h-3.5" />
                            Từ chối
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
