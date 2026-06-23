'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, X } from 'lucide-react';

interface Option {
  label: string;
  value: string;
}

interface MultiSearchableDropdownProps {
  options: Option[];
  values?: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSearchableDropdown({
  options,
  values,
  onChange,
  placeholder = 'Select options...',
  className = '',
}: MultiSearchableDropdownProps) {
  // Always safe — never undefined
  const safeValues: string[] = Array.isArray(values) ? values : [];

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 200);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    setMenuStyle({
      position: 'fixed',
      ...(spaceBelow >= 200
        ? { top: rect.bottom + 4 }
        : { bottom: window.innerHeight - rect.top + 4 }),
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
    });
  }, []);

  const handleOpen = () => {
    if (!isOpen) updatePosition();
    setIsOpen((p) => !p);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handle = (e: MouseEvent) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        menuRef.current && !menuRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition]);

  const toggle = (val: string) => {
    if (safeValues.includes(val)) {
      onChange(safeValues.filter((v) => v !== val));
    } else {
      onChange([...safeValues, val]);
    }
  };

  const removeTag = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(safeValues.filter((v) => v !== val));
  };

  const filtered = options.filter((opt) => {
    if (!debouncedSearch) return true;
    try {
      return new RegExp(debouncedSearch, 'i').test(opt.label);
    } catch {
      return opt.label.toLowerCase().includes(debouncedSearch.toLowerCase());
    }
  });

  const selectedLabels = safeValues
    .map((v) => options.find((o) => o.value === v)?.label)
    .filter(Boolean) as string[];

  return (
    <div className={`relative ${className}`} ref={triggerRef}>
      {/* Trigger */}
      <button
        type="button"
        className={`flex w-full min-h-[30px] flex-wrap items-center gap-1 rounded-md border px-2 py-1 text-xs focus:outline-none transition-colors ${isOpen ? 'border-[#0e4778] ring-1 ring-blue-200' : 'border-slate-300 bg-white'}`}
        onClick={handleOpen}
      >
        {selectedLabels.length === 0 ? (
          <span className="text-slate-400 pr-1 flex-1 text-left">{placeholder}</span>
        ) : (
          <div className="flex flex-wrap gap-1 flex-1">
            {selectedLabels.map((label, i) => (
              <span
                key={safeValues[i]}
                className="inline-flex items-center gap-1 bg-blue-50 text-[#0e4778] border border-blue-200 rounded px-1.5 py-0.5 text-[10px] font-medium"
              >
                {label}
                <X
                  size={10}
                  className="cursor-pointer hover:text-red-500"
                  onMouseDown={(e) => removeTag(safeValues[i], e)}
                />
              </span>
            ))}
          </div>
        )}
        <ChevronDown
          size={14}
          className={`text-slate-400 shrink-0 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Portal menu */}
      {isOpen && typeof window !== 'undefined' && createPortal(
        <div
          ref={menuRef}
          style={menuStyle}
          className="rounded-md border border-slate-200 bg-white shadow-xl overflow-hidden"
        >
          <div className="px-2 pt-2 pb-1.5 border-b border-slate-100 bg-white">
            <div className="relative">
              <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-slate-400" />
              <input
                autoFocus
                type="text"
                className="w-full rounded border border-slate-200 pl-7 pr-3 py-1 text-xs focus:border-[#0e4778] focus:outline-none"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <ul className="max-h-44 overflow-y-auto py-1 custom-scrollbar">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-xs text-slate-400 text-center">No results found</li>
            ) : (
              filtered.map((opt) => {
                const selected = safeValues.includes(opt.value);
                return (
                  <li
                    key={opt.value}
                    className={`cursor-pointer px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-slate-50 ${selected ? 'text-[#0e4778] font-medium' : 'text-slate-700'}`}
                    onMouseDown={(e) => { e.preventDefault(); toggle(opt.value); }}
                  >
                    <span className={`h-3.5 w-3.5 rounded border flex items-center justify-center shrink-0 ${selected ? 'bg-[#0e4778] border-[#0e4778]' : 'border-slate-300'}`}>
                      {selected && (
                        <svg viewBox="0 0 10 8" fill="none" className="h-2 w-2">
                          <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    {opt.label}
                  </li>
                );
              })
            )}
          </ul>
          {safeValues.length > 0 && (
            <div className="px-3 py-1.5 border-t border-slate-100 flex justify-between items-center">
              <span className="text-[10px] text-slate-500">{safeValues.length} selected</span>
              <button
                type="button"
                className="text-[10px] text-red-500 hover:underline"
                onMouseDown={(e) => { e.preventDefault(); onChange([]); }}
              >
                Clear all
              </button>
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
