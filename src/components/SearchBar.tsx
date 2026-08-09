'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Search, X, ArrowUpDown, Filter, ChevronDown } from 'lucide-react';

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
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

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

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filterOptions = [
    { value: 'ALL', label: 'Tất cả trạng thái', color: '#94A3B8' },
    { value: 'ACTIVE', label: 'Active', color: '#00D084' },
    { value: 'PAUSED', label: 'Paused', color: '#F59E0B' },
    { value: 'ARCHIVED', label: 'Archived', color: '#8B5CF6' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'oldest', label: 'Cũ nhất' },
    { value: 'username_asc', label: 'Username A-Z' },
    { value: 'username_desc', label: 'Username Z-A' },
  ];

  const currentFilter = filterOptions.find((f) => f.value === statusFilter);
  const currentSort = sortOptions.find((s) => s.value === sortBy);

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-4">
      {/* Search Input */}
      <div id="account-search" className="relative w-full sm:max-w-md group">
        <Search className="w-4 h-4 text-[#64748B] absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-[#4D7CFF]" />
        <input
          ref={inputRef}
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Tìm tài khoản (NOVA ID, username, ghi chú...)"
          className="w-full bg-[rgba(10,15,28,0.6)] text-[#F8FAFC] placeholder-[#64748B] text-sm rounded-lg pl-11 pr-20 py-2.5 border border-[rgba(148,163,184,0.12)] focus:outline-none focus:border-[#4D7CFF]/50 focus:shadow-glow-blue-sm transition-all duration-200"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {localQuery ? (
            <button
              onClick={() => {
                setLocalQuery('');
                onSearchChange('');
              }}
              className="text-[#64748B] hover:text-[#F8FAFC] p-1 rounded"
              aria-label="Xóa tìm kiếm"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="hidden sm:inline-block text-[10px] font-mono bg-[rgba(148,163,184,0.1)] text-[#64748B] px-2 py-1 rounded border border-[rgba(148,163,184,0.1)]">
              Ctrl+K
            </span>
          )}
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex items-center gap-2.5 w-full sm:w-auto">
        {/* Filter Dropdown */}
        <div className="relative flex-1 sm:flex-none" ref={filterRef}>
          <button
            onClick={() => {
              setFilterOpen(!filterOpen);
              setSortOpen(false);
            }}
            className="flex items-center gap-2 w-full bg-[rgba(10,15,28,0.6)] border border-[rgba(148,163,184,0.12)] hover:border-[rgba(148,163,184,0.2)] rounded-lg px-3 py-2.5 text-xs text-[#94A3B8] hover:text-[#F8FAFC] transition-all duration-200"
            aria-haspopup="listbox"
            aria-expanded={filterOpen}
          >
            <Filter className="w-3.5 h-3.5 text-[#4D7CFF]" />
            <span className="flex-1 text-left">
              {currentFilter?.label || 'Tất cả trạng thái'}
            </span>
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: currentFilter?.color || '#94A3B8' }}
            />
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                filterOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {filterOpen && (
            <div className="absolute left-0 right-0 sm:right-auto sm:w-48 mt-2 p-1.5 rounded-xl glass-panel-subtle animate-slide-up z-30">
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onStatusChange(opt.value);
                    setFilterOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs transition-colors min-h-[40px] ${
                    statusFilter === opt.value
                      ? 'bg-[rgba(77,124,255,0.1)] text-[#F8FAFC]'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[rgba(148,163,184,0.06)]'
                  }`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: opt.color }}
                  />
                  <span className="flex-1 text-left">{opt.label}</span>
                  {statusFilter === opt.value && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4D7CFF] shadow-glow-blue-sm" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative flex-1 sm:flex-none" ref={sortRef}>
          <button
            onClick={() => {
              setSortOpen(!sortOpen);
              setFilterOpen(false);
            }}
            className="flex items-center gap-2 w-full bg-[rgba(10,15,28,0.6)] border border-[rgba(148,163,184,0.12)] hover:border-[rgba(148,163,184,0.2)] rounded-lg px-3 py-2.5 text-xs text-[#94A3B8] hover:text-[#F8FAFC] transition-all duration-200"
            aria-haspopup="listbox"
            aria-expanded={sortOpen}
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span className="flex-1 text-left">{currentSort?.label || 'Mới nhất'}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                sortOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {sortOpen && (
            <div className="absolute left-0 right-0 sm:right-auto sm:w-48 mt-2 p-1.5 rounded-xl glass-panel-subtle animate-slide-up z-30">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onSortChange(opt.value);
                    setSortOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs transition-colors min-h-[40px] ${
                    sortBy === opt.value
                      ? 'bg-[rgba(139,92,246,0.1)] text-[#F8FAFC]'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[rgba(148,163,184,0.06)]'
                  }`}
                >
                  <span className="flex-1 text-left">{opt.label}</span>
                  {sortBy === opt.value && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] shadow-glow-violet" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
