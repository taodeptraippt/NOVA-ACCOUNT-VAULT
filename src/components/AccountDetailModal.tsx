'use client';

import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Copy, Check, RefreshCw, Save, Archive } from 'lucide-react';
import { api, Account } from '@/lib/api';

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

  const copyToClipboard = (text: string, field: 'username' | 'password' | 'both') => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    if (field === 'username') showToast('✓ Đã copy Username', 'success');
    else if (field === 'password') showToast('✓ Đã copy Mật khẩu', 'success');
    else showToast('✓ Đã copy Username & Mật khẩu', 'success');

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0F1420] border border-[#20283A] rounded-xl max-w-lg w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#20283A] bg-[#080B12]/60">
          <div className="flex items-center gap-2">
            <span className="font-mono text-base font-bold text-[#4F7CFF] bg-[#4F7CFF]/10 px-2.5 py-0.5 rounded border border-[#4F7CFF]/30">
              {account.nova_id}
            </span>
            <span className="text-sm font-semibold text-[#F5F7FA]">
              {currentMode === 'edit' ? 'CHỈNH SỬA TÀI KHOẢN' : 'CHI TIẾT TÀI KHOẢN'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#8993A4] hover:text-[#F5F7FA] p-1 rounded-lg hover:bg-[#20283A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-[#8993A4] uppercase tracking-wider mb-1.5">
              Username
            </label>
            {currentMode === 'edit' ? (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#080B12] border border-[#20283A] text-[#F5F7FA] font-mono text-base rounded-lg px-3.5 py-2 focus:outline-none focus:border-[#4F7CFF]"
              />
            ) : (
              <div className="flex items-center justify-between bg-[#080B12] border border-[#20283A] rounded-lg px-3.5 py-2.5">
                <span className="font-mono text-base font-bold text-[#F5F7FA]">{account.username}</span>
                <button
                  onClick={() => copyToClipboard(account.username, 'username')}
                  className="flex items-center gap-1 text-xs text-[#4F7CFF] hover:text-[#7C5CFF] font-semibold"
                >
                  {copiedField === 'username' ? <Check className="w-4 h-4 text-[#22C55E]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#8993A4] uppercase tracking-wider">
                Password
              </label>
              {currentMode === 'edit' && (
                <button
                  type="button"
                  onClick={handleRegenPassword}
                  className="flex items-center gap-1 text-xs text-[#4F7CFF] font-medium"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Generate new</span>
                </button>
              )}
            </div>

            <div className="flex items-center justify-between bg-[#080B12] border border-[#20283A] rounded-lg px-3.5 py-2.5">
              {loadingCredential ? (
                <span className="text-xs text-[#8993A4] animate-pulse">Đang giải mã mật khẩu...</span>
              ) : (
                <span className="font-mono text-base font-bold text-[#F5F7FA]">
                  {showPassword ? password : '••••••••••••••••'}
                </span>
              )}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#8993A4] hover:text-[#F5F7FA] p-1"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Xem mật khẩu'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {currentMode === 'view' && (
                  <button
                    type="button"
                    onClick={() => copyToClipboard(password, 'password')}
                    className="text-[#4F7CFF] hover:text-[#7C5CFF] p-1"
                    title="Copy password"
                  >
                    {copiedField === 'password' ? <Check className="w-4 h-4 text-[#22C55E]" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-[#8993A4] uppercase tracking-wider mb-1.5">
              Trạng thái
            </label>
            {currentMode === 'edit' ? (
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-[#080B12] border border-[#20283A] text-[#F5F7FA] text-sm rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#4F7CFF]"
              >
                <option value="ACTIVE" className="bg-[#0F1420]">ACTIVE</option>
                <option value="PAUSED" className="bg-[#0F1420]">PAUSED</option>
                <option value="ARCHIVED" className="bg-[#0F1420]">ARCHIVED</option>
              </select>
            ) : (
              <div className="bg-[#080B12] border border-[#20283A] rounded-lg px-3.5 py-2.5 text-sm font-semibold">
                {account.status === 'ACTIVE' && <span className="text-[#22C55E]">● ACTIVE</span>}
                {account.status === 'PAUSED' && <span className="text-[#F59E0B]">● PAUSED</span>}
                {account.status === 'ARCHIVED' && <span className="text-[#8993A4]">● ARCHIVED</span>}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#8993A4] uppercase tracking-wider mb-1.5">
              Ghi chú
            </label>
            {currentMode === 'edit' ? (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full bg-[#080B12] border border-[#20283A] text-[#F5F7FA] text-sm rounded-lg px-3.5 py-2 focus:outline-none focus:border-[#4F7CFF]"
              />
            ) : (
              <div className="bg-[#080B12] border border-[#20283A] rounded-lg px-3.5 py-2.5 text-sm text-[#F5F7FA]">
                {account.notes || <span className="text-[#8993A4] italic">Không có ghi chú</span>}
              </div>
            )}
          </div>

          {/* Metadata dates */}
          <div className="grid grid-cols-2 gap-3 text-xs text-[#8993A4] pt-2 border-t border-[#20283A]/60">
            <div>
              <span className="block text-[10px] uppercase font-semibold">Ngày tạo</span>
              <span>{formatDate(account.created_at)}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-semibold">Cập nhật</span>
              <span>{formatDate(account.updated_at)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-[#20283A] bg-[#080B12]/60">
          {currentMode === 'view' ? (
            <>
              <button
                onClick={() => onArchive(account)}
                className="flex items-center gap-1.5 text-xs text-[#EF4444] hover:underline"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Lưu trữ tài khoản</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentMode('edit')}
                  className="px-4 py-2 rounded-lg bg-[#20283A] hover:bg-[#2A354D] text-[#F5F7FA] text-xs font-bold transition-colors"
                >
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => copyToClipboard(`Username: ${account.username}\nPassword: ${password}`, 'both')}
                  className="px-4 py-2 rounded-lg bg-[#4F7CFF] hover:bg-[#3B69EE] text-white text-xs font-bold transition-colors"
                >
                  Copy Both
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-end gap-2 w-full">
              <button
                onClick={() => setCurrentMode('view')}
                className="px-4 py-2 rounded-lg text-xs text-[#8993A4] hover:text-[#F5F7FA]"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#4F7CFF] hover:bg-[#3B69EE] text-white text-xs font-bold transition-all shadow-md"
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
