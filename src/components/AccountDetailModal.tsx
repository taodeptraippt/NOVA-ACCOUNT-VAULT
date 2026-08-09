'use client';

import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Copy, Check, RefreshCw, Save, Archive, ShieldCheck } from 'lucide-react';
import { api, Account } from '@/lib/api';
import { copyTextToClipboard } from '@/lib/clipboard';

interface AccountDetailModalProps {
  isOpen: boolean;
  account: Account | null;
  mode: 'view' | 'edit';
  onClose: () => void;
  onUpdateSuccess: () => void;
  onArchive: (account: Account) => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const AccountDetailModal: React.FC<AccountDetailModalProps> = ({
  isOpen,
  account,
  mode,
  onClose,
  onUpdateSuccess,
  onArchive,
  showToast,
}) => {
  const [currentMode, setCurrentMode] = useState<'view' | 'edit'>(mode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'PAUSED' | 'ARCHIVED'>('ACTIVE');
  const [notes, setNotes] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loadingCredential, setLoadingCredential] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copiedField, setCopiedField] = useState<'username' | 'password' | 'both' | null>(null);

  useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  useEffect(() => {
    if (isOpen && account) {
      setUsername(account.username);
      setStatus(account.status);
      setNotes(account.notes || '');
      setPassword('');
      setShowPassword(false);
      fetchCredential();
    }
  }, [isOpen, account]);

  const fetchCredential = async () => {
    if (!account) return;
    setLoadingCredential(true);
    try {
      const cred = await api.getCredential(account.id);
      setPassword(cred.password);
    } catch (err: any) {
      showToast('Không thể lấy mật khẩu giải mã', 'error');
    } finally {
      setLoadingCredential(false);
    }
  };

  if (!isOpen || !account) return null;

  const copyToClipboard = async (text: string, field: 'username' | 'password' | 'both') => {
    const copied = await copyTextToClipboard(text);
    setCopiedField(field);
    if (copied) {
      if (field === 'username') showToast('✓ Đã copy Username', 'success');
      else if (field === 'password') showToast('✓ Đã copy Mật khẩu', 'success');
      else showToast('✓ Đã copy Username & Mật khẩu', 'success');
    } else {
      showToast('Không thể sao chép. Vui lòng thử lại.', 'error');
    }

    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleRegenPassword = async () => {
    try {
      const res = await api.generatePassword();
      setPassword(res.password);
      setShowPassword(true);
      showToast('Đã tạo mật khẩu mới. Bấm Lưu để xác nhận.', 'info');
    } catch (err: any) {
      showToast('Lỗi tạo mật khẩu', 'error');
    }
  };

  const handleSave = async () => {
    if (!username.trim()) {
      showToast('Username không được để trống', 'error');
      return;
    }

    setSaving(true);
    try {
      await api.updateAccount(account.id, {
        username: username.trim(),
        password: password.trim() ? password.trim() : undefined,
        status,
        notes: notes.trim(),
      });
      showToast('✓ Đã cập nhật tài khoản', 'success');
      onUpdateSuccess();
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Lỗi cập nhật tài khoản', 'error');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleString('vi-VN');
    } catch {
      return isoString;
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[rgba(0,208,132,0.1)] text-[#00D084] border border-[rgba(0,208,132,0.25)] shadow-[0_0_12px_rgba(0,208,132,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D084] shadow-[0_0_6px_rgba(0,208,132,0.6)] animate-pulse-glow" />
            ACTIVE
          </span>
        );
      case 'PAUSED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[rgba(245,158,11,0.1)] text-[#F59E0B] border border-[rgba(245,158,11,0.25)] shadow-[0_0_12px_rgba(245,158,11,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
            PAUSED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[rgba(139,92,246,0.1)] text-[#8B5CF6] border border-[rgba(139,92,246,0.25)] shadow-[0_0_12px_rgba(139,92,246,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] shadow-[0_0_6px_rgba(139,92,246,0.6)]" />
            ARCHIVED
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto bg-[#0A0F1C] border-t sm:border border-[rgba(148,163,184,0.12)] sm:rounded-xl shadow-2xl animate-slide-up sm:animate-scale-in">
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(77,124,255,0.08) 0%, transparent 60%)',
          }}
        />

        {/* Header */}
        <div className="relative flex items-center justify-between px-5 py-4 border-b border-[rgba(148,163,184,0.12)] bg-[rgba(5,8,18,0.4)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary-soft border border-[rgba(77,124,255,0.2)] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-[#4D7CFF]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-[#4D7CFF]">{account.nova_id}</span>
                {statusBadge(account.status)}
              </div>
              <p className="text-[10px] text-[#64748B] mt-0.5">
                {currentMode === 'edit' ? 'CHỈNH SỬA TÀI KHOẢN' : 'CHI TIẾT TÀI KHOẢN'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[rgba(148,163,184,0.08)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="relative p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Username */}
          <div>
            <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
              Username
            </label>
            {currentMode === 'edit' ? (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[rgba(5,8,18,0.6)] border border-[rgba(148,163,184,0.12)] text-[#F8FAFC] font-mono text-sm rounded-lg px-3.5 py-3 focus:outline-none focus:border-[#4D7CFF]/50 focus:shadow-glow-blue-sm transition-all duration-200"
              />
            ) : (
              <div className="flex items-center justify-between bg-[rgba(5,8,18,0.6)] border border-[rgba(148,163,184,0.12)] rounded-lg px-3.5 py-3">
                <span className="font-mono text-sm font-bold text-[#F8FAFC]">{account.username}</span>
                <button
                  onClick={() => copyToClipboard(account.username, 'username')}
                  className="flex items-center gap-1 text-xs text-[#4D7CFF] hover:text-[#8B5CF6] font-semibold p-2 min-h-[44px] min-w-[44px] justify-center"
                >
                  {copiedField === 'username' ? <Check className="w-4 h-4 text-[#00D084]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                Password
              </label>
              {currentMode === 'edit' && (
                <button
                  type="button"
                  onClick={handleRegenPassword}
                  className="flex items-center gap-1 text-[11px] text-[#4D7CFF] font-medium"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Generate new</span>
                </button>
              )}
            </div>

            <div className="flex items-center justify-between bg-[rgba(5,8,18,0.6)] border border-[rgba(148,163,184,0.12)] rounded-lg px-3.5 py-3">
              {loadingCredential ? (
                <span className="text-xs text-[#94A3B8] animate-pulse">Đang giải mã mật khẩu...</span>
              ) : (
                <span className="font-mono text-sm font-bold text-[#F8FAFC]">
                  {showPassword ? password : '••••••••••••••••'}
                </span>
              )}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#94A3B8] hover:text-[#F8FAFC] p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Xem mật khẩu'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {currentMode === 'view' && (
                  <button
                    type="button"
                    onClick={() => copyToClipboard(password, 'password')}
                    className="text-[#4D7CFF] hover:text-[#8B5CF6] p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    title="Copy password"
                  >
                    {copiedField === 'password' ? <Check className="w-4 h-4 text-[#00D084]" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
              Trạng thái
            </label>
            {currentMode === 'edit' ? (
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-[rgba(5,8,18,0.6)] border border-[rgba(148,163,184,0.12)] text-[#F8FAFC] text-sm rounded-lg px-3.5 py-3 focus:outline-none focus:border-[#4D7CFF]/50 transition-all duration-200 cursor-pointer"
              >
                <option value="ACTIVE" className="bg-[#0A0F1C]">● ACTIVE</option>
                <option value="PAUSED" className="bg-[#0A0F1C]">● PAUSED</option>
                <option value="ARCHIVED" className="bg-[#0A0F1C]">● ARCHIVED</option>
              </select>
            ) : (
              <div className="bg-[rgba(5,8,18,0.6)] border border-[rgba(148,163,184,0.12)] rounded-lg px-3.5 py-3">
                {statusBadge(account.status)}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
              Ghi chú
            </label>
            {currentMode === 'edit' ? (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full bg-[rgba(5,8,18,0.6)] border border-[rgba(148,163,184,0.12)] text-[#F8FAFC] text-sm rounded-lg px-3.5 py-3 focus:outline-none focus:border-[#4D7CFF]/50 transition-all duration-200"
              />
            ) : (
              <div className="bg-[rgba(5,8,18,0.6)] border border-[rgba(148,163,184,0.12)] rounded-lg px-3.5 py-3 text-sm text-[#F8FAFC]">
                {account.notes || <span className="text-[#64748B] italic">Không có ghi chú</span>}
              </div>
            )}
          </div>

          {/* Metadata dates */}
          <div className="grid grid-cols-2 gap-3 text-xs text-[#94A3B8] pt-3 border-t border-[rgba(148,163,184,0.12)]">
            <div>
              <span className="block text-[10px] uppercase font-semibold text-[#64748B]">Ngày tạo</span>
              <span className="font-mono">{formatDate(account.created_at)}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-semibold text-[#64748B]">Cập nhật</span>
              <span className="font-mono">{formatDate(account.updated_at)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative flex items-center justify-between px-5 py-4 border-t border-[rgba(148,163,184,0.12)] bg-[rgba(5,8,18,0.4)]">
          {currentMode === 'view' ? (
            <>
              <button
                onClick={() => onArchive(account)}
                className="flex items-center gap-1.5 text-xs text-[#F43F5E] hover:text-[#E11D48] p-2 min-h-[44px] transition-colors"
              >
                <Archive className="w-4 h-4" />
                <span>Lưu trữ</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentMode('edit')}
                  className="px-4 py-2.5 rounded-lg bg-[rgba(10,15,28,0.6)] border border-[rgba(148,163,184,0.12)] hover:border-[rgba(148,163,184,0.25)] text-[#F8FAFC] text-xs font-semibold transition-all duration-200 min-h-[44px]"
                >
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => copyToClipboard(`Username: ${account.username}\nPassword: ${password}`, 'both')}
                  className="px-4 py-2.5 rounded-lg bg-gradient-primary text-white text-xs font-semibold shadow-glow-blue-sm active:scale-95 transition-all duration-200 min-h-[44px]"
                >
                  Copy Both
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-end gap-2 w-full">
              <button
                onClick={() => setCurrentMode('view')}
                className="px-4 py-2.5 rounded-lg text-xs text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[rgba(148,163,184,0.08)] transition-colors min-h-[44px]"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-gradient-primary text-white text-xs font-semibold shadow-glow-blue-sm active:scale-95 transition-all duration-200 min-h-[44px] disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
