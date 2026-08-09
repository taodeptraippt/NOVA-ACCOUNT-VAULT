'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Shield, Lock, ArrowRight, CheckCircle2, Vault } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#050812]">
      {/* Layered Background FX */}
      <div className="nova-bg-fx" aria-hidden="true">
        <div className="nova-grid-overlay" />
        <div
          className="nova-ambient-orb"
          style={{
            width: '500px',
            height: '500px',
            top: '-150px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'radial-gradient(circle, rgba(77,124,255,0.5) 0%, transparent 70%)',
          }}
        />
        <div
          className="nova-ambient-orb"
          style={{
            width: '350px',
            height: '350px',
            bottom: '-100px',
            right: '10%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Glass Card */}
        <div className="relative glass-panel rounded-2xl p-6 sm:p-8 animate-scale-in">
          {/* Ambient glow inside card */}
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              background:
                'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(77,124,255,0.06) 0%, transparent 60%)',
            }}
          />

          {/* Decorative line */}
          <div
            className="absolute top-0 left-8 right-8 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(77,124,255,0.4), transparent)',
            }}
          />

          {/* Brand */}
          <div className="relative text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow-blue">
                <Vault className="w-7 h-7 text-white" />
              </div>
              <div
                className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-30 blur-xl -z-10"
                style={{ transform: 'scale(1.2)' }}
              />
            </div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="font-extrabold text-2xl tracking-wider text-[#F8FAFC]">NOVA</span>
            </div>
            <h2 className="text-xs uppercase tracking-widest text-[#94A3B8] font-semibold">
              ACCOUNT VAULT MVP
            </h2>
            <p className="text-[10px] text-[#64748B] mt-2 font-mono">
              Bảo mật. Tối ưu. Hiệu quả.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="relative mb-4 p-3 rounded-lg bg-[rgba(244,63,94,0.1)] border border-[rgba(244,63,94,0.3)] text-[#F43F5E] text-xs font-semibold animate-fade-in">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="relative space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                Email
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[rgba(5,8,18,0.6)] border border-[rgba(148,163,184,0.12)] text-[#F8FAFC] text-sm rounded-lg pl-10 pr-3.5 py-3 focus:outline-none focus:border-[#4D7CFF]/50 focus:shadow-glow-blue-sm transition-all duration-200"
                  placeholder="operator@nova.vault"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Shield className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[rgba(5,8,18,0.6)] border border-[rgba(148,163,184,0.12)] text-[#F8FAFC] text-sm rounded-lg pl-10 pr-3.5 py-3 focus:outline-none focus:border-[#4D7CFF]/50 focus:shadow-glow-blue-sm transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-primary text-white text-sm font-semibold shadow-glow-blue-sm active:scale-[0.98] transition-all duration-200 disabled:opacity-50 min-h-[48px] mt-2"
            >
              <span>{loading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo Quick Fill Buttons */}
          <div className="relative mt-6 pt-4 border-t border-[rgba(148,163,184,0.12)] text-center">
            <span className="text-[10px] text-[#64748B] block mb-2 font-medium">
              Tài khoản demo sẵn có:
            </span>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setDemoAccount('admin')}
                className="px-3 py-2 rounded-lg bg-[rgba(5,8,18,0.6)] border border-[rgba(148,163,184,0.12)] hover:border-[#4D7CFF]/40 text-xs text-[#94A3B8] hover:text-[#F8FAFC] transition-all duration-200 font-mono min-h-[44px]"
              >
                Admin Demo
              </button>
              <button
                type="button"
                onClick={() => setDemoAccount('worker')}
                className="px-3 py-2 rounded-lg bg-[rgba(5,8,18,0.6)] border border-[rgba(148,163,184,0.12)] hover:border-[#4D7CFF]/40 text-xs text-[#94A3B8] hover:text-[#F8FAFC] transition-all duration-200 font-mono min-h-[44px]"
              >
                Worker Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
