'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Search, X, ArrowUpDown, Filter } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Keyboard shortcut Ctrl/Cmd + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync internal state if parent changes
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  // Debounce search input (250ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localQuery !== searchQuery) {
        onSearchChange(localQuery);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [localQuery, searchQuery, onSearchChange]);

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-4">
      {/* Search Input */}
      <div className="relative w-full sm:max-w-md">
        <Search className="w-4 h-4 text-[#8993A4] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          ref={inputRef}
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="🔍 Tìm tài khoản (NOVA ID, username, ghi chú)..."
          className="w-full bg-[#0F1420] text-[#F5F7FA] placeholder-[#8993A4] text-sm rounded-lg pl-10 pr-20 py-2.5 border border-[#20283A] focus:outline-none focus:border-[#4F7CFF] transition-colors"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {localQuery ? (
            <button
              onClick={() => {
                setLocalQuery('');
                onSearchChange('');
              }}
              className="text-[#8993A4] hover:text-[#F5F7FA] p-1"
              aria-label="Xóa tìm kiếm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="hidden sm:inline-block text-[10px] bg-[#20283A] text-[#8993A4] px-1.5 py-0.5 rounded font-mono">
              Ctrl+K
            </span>
          )}
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex items-center gap-2.5 w-full sm:w-auto">
        {/* Filter Dropdown */}
        <div className="flex items-center gap-1.5 bg-[#0F1420] border border-[#20283A] rounded-lg px-2.5 py-1.5 text-xs text-[#8993A4]">
          <Filter className="w-3.5 h-3.5 text-[#4F7CFF]" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-transparent text-[#F5F7FA] text-xs focus:outline-none cursor-pointer pr-1"
          >
            <option value="ALL" className="bg-[#0F1420]">Tất cả trạng thái</option>
            <option value="ACTIVE" className="bg-[#0F1420]">Active</option>
            <option value="PAUSED" className="bg-[#0F1420]">Paused</option>
            <option value="ARCHIVED" className="bg-[#0F1420]">Archived</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-1.5 bg-[#0F1420] border border-[#20283A] rounded-lg px-2.5 py-1.5 text-xs text-[#8993A4]">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#7C5CFF]" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-transparent text-[#F5F7FA] text-xs focus:outline-none cursor-pointer pr-1"
          >
            <option value="newest" className="bg-[#0F1420]">Mới nhất</option>
            <option value="oldest" className="bg-[#0F1420]">Cũ nhất</option>
            <option value="username_asc" className="bg-[#0F1420]">Username A-Z</option>
            <option value="username_desc" className="bg-[#0F1420]">Username Z-A</option>
          </select>
        </div>
      </div>
    </div>
  );
};
