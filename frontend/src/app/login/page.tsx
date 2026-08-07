'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Shield, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@nova.vault');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.login(email.trim(), password.trim());
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại. Kiểm tra lại email/mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoAccount = (role: 'admin' | 'worker') => {
    if (role === 'admin') {
      setEmail('admin@nova.vault');
      setPassword('admin123');
    } else {
      setEmail('worker@nova.vault');
      setPassword('worker123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#080B12] relative overflow-hidden">
      {/* Subtle Ambient Accent Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#4F7CFF]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#0F1420] border border-[#20283A] rounded-xl p-6 sm:p-8 shadow-2xl relative z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#4F7CFF] to-[#7C5CFF] flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#4F7CFF]/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="font-extrabold text-2xl tracking-wider text-[#F5F7FA]">NOVA</span>
          </div>
          <h2 className="text-xs uppercase tracking-widest text-[#8993A4] font-semibold">
            ACCOUNT VAULT MVP
          </h2>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#8993A4] uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#080B12] border border-[#20283A] text-[#F5F7FA] text-sm rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#4F7CFF] transition-colors"
              placeholder="operator@nova.vault"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8993A4] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#080B12] border border-[#20283A] text-[#F5F7FA] text-sm rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#4F7CFF] transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#4F7CFF] hover:bg-[#3B69EE] text-white text-sm font-bold tracking-wide transition-all shadow-lg shadow-[#4F7CFF]/20 active:scale-98 disabled:opacity-50 mt-2"
          >
            <span>{loading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Quick Fill Buttons */}
        <div className="mt-6 pt-4 border-t border-[#20283A] text-center">
          <span className="text-[11px] text-[#8993A4] block mb-2 font-medium">Tài khoản demo sẵn có:</span>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setDemoAccount('admin')}
              className="px-3 py-1.5 rounded-md bg-[#080B12] border border-[#20283A] hover:border-[#4F7CFF] text-xs text-[#8993A4] hover:text-[#F5F7FA] transition-colors font-mono"
            >
              Admin Demo
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount('worker')}
              className="px-3 py-1.5 rounded-md bg-[#080B12] border border-[#20283A] hover:border-[#4F7CFF] text-xs text-[#8993A4] hover:text-[#F5F7FA] transition-colors font-mono"
            >
              Worker Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
