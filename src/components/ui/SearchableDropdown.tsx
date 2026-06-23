'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search } from 'lucide-react';

interface Option {
  label: string;
  value: string;
}

interface SearchableDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  allowManualEntry?: boolean;
}

export function SearchableDropdown({ options, value, onChange, placeholder = "Select an option...", className = '', allowManualEntry = false }: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : (value || placeholder);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm), 200);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Position the portal menu relative to the trigger button
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const menuHeight = 280;

    if (spaceBelow >= menuHeight || spaceBelow >= 150) {
      // Open downward
      setMenuStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    } else {
      // Open upward
      setMenuStyle({
        position: 'fixed',
        bottom: window.innerHeight - rect.top + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    }
  }, []);

  const handleOpen = () => {
    if (!isOpen) {
      updatePosition();
    }
    setIsOpen((prev) => !prev);
  };

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        menuRef.current && !menuRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  // Reposition on scroll/resize
  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition]);

  const filteredOptions = options.filter(opt => {
    if (!debouncedSearchTerm) return true;
    try {
      const regex = new RegExp(debouncedSearchTerm, 'i');
      return regex.test(opt.label);
    } catch {
      return opt.label.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    }
  });

  return (
    <div className={`relative ${className}`} ref={triggerRef}>
      <button
        type="button"
        className={`flex w-full items-center justify-between rounded-md border px-3 py-1.5 text-sm focus:border-[#0e4778] focus:outline-none focus:ring-1 focus:ring-blue-200 transition-colors ${isOpen ? 'border-[#0e4778] ring-1 ring-blue-200' : 'border-slate-300 bg-white'}`}
        onClick={handleOpen}
      >
        <span className={value ? 'text-slate-900 truncate pr-2 text-xs' : 'text-slate-400 truncate pr-2 text-xs'}>
          {displayValue}
        </span>
        <ChevronDown size={14} className={`text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && typeof window !== 'undefined' && createPortal(
        <div
          ref={menuRef}
          style={menuStyle}
          className="rounded-md border border-slate-200 bg-white shadow-xl overflow-hidden"
        >
          {/* Search */}
          <div className="px-2 pt-2 pb-1.5 border-b border-slate-100 bg-white">
            <div className="relative">
              <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                autoFocus
                className="w-full rounded border border-slate-200 pl-7 pr-3 py-1 text-xs focus:border-[#0e4778] focus:outline-none"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          {/* Options */}
          <ul className="max-h-44 overflow-y-auto py-1 custom-scrollbar">
            {allowManualEntry && searchTerm && !options.find(o => o.label.toLowerCase() === searchTerm.toLowerCase()) && (
              <li
                className="cursor-pointer px-3 py-1.5 text-xs text-blue-600 hover:bg-slate-50 font-medium"
                onMouseDown={(e) => { e.preventDefault(); onChange(searchTerm); setIsOpen(false); setSearchTerm(''); }}
              >
                + Add "{searchTerm}"
              </li>
            )}
            {filteredOptions.length === 0 && (!allowManualEntry || !searchTerm) ? (
              <li className="px-3 py-2 text-xs text-slate-400 text-center">No results found</li>
            ) : (
              filteredOptions.map((opt) => (
                <li
                  key={opt.value}
                  className={`cursor-pointer px-3 py-1.5 text-xs hover:bg-slate-50 ${value === opt.value ? 'bg-blue-50 font-medium text-[#0e4778]' : 'text-slate-700'}`}
                  onMouseDown={(e) => { e.preventDefault(); onChange(opt.value); setIsOpen(false); setSearchTerm(''); }}
                >
                  {opt.label}
                </li>
              ))
            )}
          </ul>
        </div>,
        document.body
      )}
    </div>
  );
}
