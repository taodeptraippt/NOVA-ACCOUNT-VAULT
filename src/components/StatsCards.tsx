'use client';

import React from 'react';
import { Stats } from '@/lib/api';
import { ShieldCheck, PauseCircle, Archive, Database } from 'lucide-react';

interface StatsCardsProps {
  stats: Stats;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, selectedStatus, onSelectStatus }) => {
  const cards = [
    {
      id: 'ALL',
      label: 'TỔNG TÀI KHOẢN',
      count: stats.total,
      icon: <Database className="w-4 h-4 text-[#4F7CFF]" />,
      border: 'hover:border-[#4F7CFF]/50',
      activeBorder: 'border-[#4F7CFF]',
    },
    {
      id: 'ACTIVE',
      label: 'ACTIVE',
      count: stats.active,
      icon: <ShieldCheck className="w-4 h-4 text-[#22C55E]" />,
      border: 'hover:border-[#22C55E]/50',
      activeBorder: 'border-[#22C55E]',
    },
    {
      id: 'PAUSED',
      label: 'PAUSED',
      count: stats.paused,
      icon: <PauseCircle className="w-4 h-4 text-[#F59E0B]" />,
      border: 'hover:border-[#F59E0B]/50',
      activeBorder: 'border-[#F59E0B]',
    },
    {
      id: 'ARCHIVED',
      label: 'ARCHIVED',
      count: stats.archived,
      icon: <Archive className="w-4 h-4 text-[#8993A4]" />,
      border: 'hover:border-[#8993A4]/50',
      activeBorder: 'border-[#8993A4]',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-6">
      {cards.map((c) => {
        const isActive = selectedStatus === c.id;
        return (
          <div
            key={c.id}
            onClick={() => onSelectStatus(c.id)}
            className={`bg-[#0F1420] border ${
              isActive ? c.activeBorder : 'border-[#20283A]'
            } ${c.border} rounded-xl p-3.5 sm:p-4 cursor-pointer transition-all duration-150 hover:bg-[#151C2C] group`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold tracking-wider text-[#8993A4] uppercase group-hover:text-[#F5F7FA] transition-colors">
                {c.label}
              </span>
              <div className="p-1.5 rounded-lg bg-[#080B12] border border-[#20283A]">{c.icon}</div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#F5F7FA] font-mono tracking-tight">{c.count}</div>
          </div>
        );
      })}
    </div>
  );
};
