'use client';

import React from 'react';
import { Stats } from '@/lib/api';
import { ShieldCheck, PauseCircle, Archive, Database, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  stats: Stats;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, selectedStatus, onSelectStatus }) => {
  const total = stats.total || 1;
  const activePct = Math.round((stats.active / total) * 1000) / 10;
  const pausedPct = Math.round((stats.paused / total) * 1000) / 10;
  const archivedPct = Math.round((stats.archived / total) * 1000) / 10;

  const cards = [
    {
      id: 'ALL',
      label: 'TỔNG TÀI KHOẢN',
      count: stats.total,
      pct: '100%',
      pctLabel: 'tổng số tài khoản',
      icon: <Database className="w-5 h-5" />,
      accent: '#4D7CFF',
      accent2: '#8B5CF6',
      glow: 'rgba(77,124,255,0.25)',
      bg: 'rgba(77,124,255,0.08)',
      iconBg: 'linear-gradient(135deg, rgba(77,124,255,0.2) 0%, rgba(139,92,246,0.2) 100%)',
      border: 'rgba(77,124,255,0.2)',
    },
    {
      id: 'ACTIVE',
      label: 'ACTIVE',
      count: stats.active,
      pct: `${activePct}%`,
      pctLabel: 'đang hoạt động',
      icon: <ShieldCheck className="w-5 h-5" />,
      accent: '#00D084',
      accent2: '#00D084',
      glow: 'rgba(0,208,132,0.2)',
      bg: 'rgba(0,208,132,0.06)',
      iconBg: 'linear-gradient(135deg, rgba(0,208,132,0.2) 0%, rgba(0,208,132,0.1) 100%)',
      border: 'rgba(0,208,132,0.2)',
    },
    {
      id: 'PAUSED',
      label: 'PAUSED',
      count: stats.paused,
      pct: `${pausedPct}%`,
      pctLabel: 'tạm dừng',
      icon: <PauseCircle className="w-5 h-5" />,
      accent: '#F59E0B',
      accent2: '#F59E0B',
      glow: 'rgba(245,158,11,0.2)',
      bg: 'rgba(245,158,11,0.06)',
      iconBg: 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(245,158,11,0.1) 100%)',
      border: 'rgba(245,158,11,0.2)',
    },
    {
      id: 'ARCHIVED',
      label: 'ARCHIVED',
      count: stats.archived,
      pct: `${archivedPct}%`,
      pctLabel: 'đã lưu trữ',
      icon: <Archive className="w-5 h-5" />,
      accent: '#8B5CF6',
      accent2: '#6366F1',
      glow: 'rgba(139,92,246,0.2)',
      bg: 'rgba(139,92,246,0.06)',
      iconBg: 'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(99,102,241,0.1) 100%)',
      border: 'rgba(139,92,246,0.2)',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-6">
      {cards.map((c) => {
        const isActive = selectedStatus === c.id;
        return (
          <div
            key={c.id}
            onClick={() => onSelectStatus(c.id)}
            className="relative group cursor-pointer overflow-hidden rounded-xl transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: isActive ? c.bg : 'rgba(10,15,28,0.65)',
              border: `1px solid ${isActive ? c.border : 'rgba(148,163,184,0.12)'}`,
              boxShadow: isActive
                ? `0 0 20px ${c.glow}, inset 0 1px 0 0 rgba(255,255,255,0.04)`
                : 'inset 0 1px 0 0 rgba(255,255,255,0.03)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            {/* Ambient glow */}
            <div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${c.glow} 0%, transparent 70%)`,
              }}
            />

            {/* Decorative grid */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.15]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(148,163,184,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.05) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
                maskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%, black 0%, transparent 80%)',
                WebkitMaskImage:
                  'radial-gradient(ellipse 80% 80% at 50% 0%, black 0%, transparent 80%)',
              }}
            />

            {/* Decorative line */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${c.accent}40, transparent)`,
              }}
            />

            {/* Content */}
            <div className="relative z-10 p-3.5 sm:p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-[#94A3B8] uppercase group-hover:text-[#F8FAFC] transition-colors">
                  {c.label}
                </span>
                {/* Icon orb */}
                <div
                  className="relative w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{
                    background: c.iconBg,
                    border: `1px solid ${c.border}`,
                    boxShadow: `0 0 12px ${c.glow}`,
                  }}
                >
                  <span style={{ color: c.accent }}>{c.icon}</span>
                  {/* Orb inner glow */}
                  <div
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${c.accent}20 0%, transparent 60%)`,
                    }}
                  />
                </div>
              </div>

              {/* Count */}
              <div className="flex items-baseline gap-2">
                <span
                  className="text-2xl sm:text-3xl font-bold font-mono tracking-tight"
                  style={{ color: isActive ? c.accent : '#F8FAFC' }}
                >
                  {c.count}
                </span>
                <span
                  className="text-[11px] font-semibold font-mono"
                  style={{ color: c.accent }}
                >
                  {c.pct}
                </span>
              </div>

              {/* Footer */}
              <div className="flex items-center gap-1 mt-1.5">
                <TrendingUp className="w-3 h-3" style={{ color: c.accent }} />
                <span className="text-[10px] text-[#64748B]">{c.pctLabel}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
