'use client';
import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  Eye,
  Printer,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  PlusCircle,
  ArrowRight,
} from 'lucide-react';
// import { showDeleteConfirmation, showSuccessAlert } from '@/utils/alerts';

import { cn } from '@/lib/utils';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  onPrint?: (row: T) => void;
  onAddPayment?: (row: T) => void;
  disableAddPayment?: (row: T) => boolean;
  onNextStep?: (row: T) => void;
  onRowClick?: (row: T) => void;
  rowKey?: keyof T;
  selectedId?: string | number | null;
  showActions?: boolean;
  emptyMessage?: string;
  pageSize?: number;
  currentPage?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  loading?: boolean;
  selectable?: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
  onBulkDelete?: (rows: T[]) => void | Promise<void>;
  // Advanced features
  enableSorting?: boolean;
  enableColumnFilters?: boolean;
  // Toolbar features
  showSearch?: boolean;
  showEntries?: boolean;
  showPrint?: boolean;
  showPagination?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  title?: string;
  showTitle?: boolean;
  showRecordInfo?: boolean;
  showRowPrint?: boolean;
}

export function StatusBadge({ status }: { status: 'pending' | 'in-progress' | 'completed' | 'rejected' | string }) {
  const statusClasses = {
    pending: 'badge-pending',
    'in-progress': 'badge-in-progress',
    completed: 'badge-completed',
    rejected: 'badge-rejected',
  };

  const statusLabels = {
    pending: 'Pending',
    'in-progress': 'In Progress',
    completed: 'Completed',
    rejected: 'Rejected',
  };

  return (
    <span className={statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'}>
      {statusLabels[status as keyof typeof statusLabels] || status}
    </span>
  );
}

const TH_BASE = 'px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white whitespace-nowrap select-none bg-black';

export function DataTable<T extends { id?: string | number; _id?: string | number }>({
  title,
  showTitle = true,
  showRecordInfo = true,
  columns,
  data,
  onEdit,
  onDelete,
  onView,
  onPrint,
  onAddPayment,
  disableAddPayment,
  onNextStep,
  onRowClick,
  rowKey,
  selectedId,
  showActions = true,
  emptyMessage = 'No records found',
  pageSize = 5,
  currentPage = 1,
  totalItems,
  onPageChange,
  onPageSizeChange,
  loading = false,
  selectable = false,
  onBulkDelete,
  enableSorting = true,
  enableColumnFilters = true,
  showSearch = true,
  showEntries = true,
  showPrint = true,
  showPagination = true,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search records...',
  onSelectionChange,
  showRowPrint = true,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null }>({ key: '', direction: null });
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  const getId = (row: T) => {
    if (rowKey && (row as any)[rowKey] != null) return String((row as any)[rowKey]);
    if ((row as any)._id != null) return String((row as any)._id);
    if ((row as any).id != null) return String((row as any).id);
    return '';
  };

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const selectedRows: T[] = data.filter(r => selectedIds.has(getId(r)));

  const handleSort = (key: string) => {
    if (!enableSorting) return;
    let direction: 'asc' | 'desc' | null = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    else if (sortConfig.key === key && sortConfig.direction === 'desc') direction = null;
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (key: string, value: string) => {
    setColumnFilters(prev => ({ ...prev, [key]: value }));
    if (onPageChange) onPageChange(1);
  };

  // Internal filtering and sorting
  const processedData = useMemo(() => {
    let result = [...data];

    // Helper: get all searchable string representations of a value (including date formats)
    const getSearchStrings = (val: unknown): string[] => {
      const raw = String(val ?? '').toLowerCase();
      const strings = [raw];

      if (!val || typeof val !== 'string') return strings;

      const MONTH_SHORT = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      const MONTH_LONG = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

      // Match ISO: YYYY-MM-DD (with optional time component)
      const isoMatch = val.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (isoMatch) {
        const year = isoMatch[1], month = isoMatch[2], day = isoMatch[3];
        const mIdx = parseInt(month, 10) - 1;
        const mon = MONTH_SHORT[mIdx] || '';
        const monFull = MONTH_LONG[mIdx] || '';
        strings.push(`${day}/${month}/${year}`);    // DD/MM/YYYY
        strings.push(`${month}/${day}/${year}`);    // MM/DD/YYYY
        strings.push(`${day}/${mon}/${year}`);      // DD/Mon/YYYY  e.g. 01/jun/2026
        strings.push(`${day}/${monFull}/${year}`);  // DD/June/YYYY
        strings.push(`${day}-${month}-${year}`);    // DD-MM-YYYY
        strings.push(mon);                          // jun
        strings.push(monFull);                      // june
        strings.push(`${day} ${mon} ${year}`);      // 01 jun 2026
        strings.push(`${day} ${monFull} ${year}`);  // 01 june 2026
        strings.push(year);                         // 2026
      }

      // Match already-formatted DD/MM/YYYY
      const slashMatch = val.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (slashMatch) {
        const day = slashMatch[1].padStart(2, '0');
        const month = slashMatch[2].padStart(2, '0');
        const year = slashMatch[3];
        const mIdx = parseInt(month, 10) - 1;
        const mon = MONTH_SHORT[mIdx] || '';
        const monFull = MONTH_LONG[mIdx] || '';
        strings.push(`${day}/${mon}/${year}`);
        strings.push(`${day}/${monFull}/${year}`);
        strings.push(mon);
        strings.push(monFull);
        strings.push(year);
      }

      return strings;
    };

    // Apply global search
    if (searchValue) {
      const lowerSearch = searchValue.toLowerCase();
      result = result.filter(row => {
        return columns.some(col => {
          const val = col.key.toString().includes('.')
            ? col.key.toString().split('.').reduce((obj, k) => (obj as any)?.[k], row)
            : (row as any)[col.key as string];
          return getSearchStrings(val).some(s => s.includes(lowerSearch));
        });
      });
    }

    // Apply column filters
    Object.keys(columnFilters).forEach(key => {
      const filterValue = columnFilters[key].toLowerCase();
      if (filterValue) {
        result = result.filter(row => {
          const cellValue = key.includes('.')
            ? key.split('.').reduce((obj, k) => (obj as any)?.[k], row)
            : (row as any)[key];
          return String(cellValue ?? '').toLowerCase().includes(filterValue);
        });
      }
    });

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      result.sort((a, b) => {
        const valA = sortConfig.key.includes('.')
          ? sortConfig.key.split('.').reduce((obj, k) => (obj as any)?.[k], a)
          : (a as any)[sortConfig.key];
        const valB = sortConfig.key.includes('.')
          ? sortConfig.key.split('.').reduce((obj, k) => (obj as any)?.[k], b)
          : (b as any)[sortConfig.key];

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, columnFilters, sortConfig, searchValue, columns]);

  const displayData = processedData;
  const totalPages = totalItems ? Math.ceil(totalItems / pageSize) : Math.ceil(displayData.length / pageSize);
  const isAllSelected = selectable && displayData.length > 0 && displayData.every(r => selectedIds.has(getId(r)));

  return (
    <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden">

      {/* NEW HEADER (CommonHeader style) */}
      {(showEntries || showSearch || (showPrint && onPrint)) && (
        <div className="bg-white rounded-t-[4px] px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3 border-b border-gray-200 shadow-sm">
          {/* LEFT */}
          <div className="flex items-center gap-4">

            {/* ENTRIES (Now on the left side) */}
            {showEntries && (
              <div className="flex items-center gap-2 text-[13px] text-gray-600 whitespace-nowrap">
                <select
                  value={pageSize}
                  onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-[12px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {[5, 10, 20, 30, 50, 100].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <span className='text-sm font-medium text-gray-500'>Entries</span>
              </div>
            )}

            {showPrint && onPrint && (
              <button
                onClick={() => onPrint?.(null as any)}
                className="h-8 px-4 bg-white hover:bg-gray-50 text-gray-700 text-[11px] font-bold rounded-[2px] shadow-sm border border-gray-300 transition-all flex items-center gap-2 uppercase tracking-wider"
              >
                <Printer size={14} strokeWidth={3} />
                PRINT
              </button>
            )}
          </div>
          {/* RIGHT */}
          {showSearch && (
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {/* SEARCH (Stays on the right) */}
              <span className='text-sm font-medium text-gray-500'>Search:</span>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />

                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => {
                    onSearchChange?.(e.target.value);
                    if (onPageChange) onPageChange(1);
                  }}
                  placeholder="Search records..."
                  className="w-full h-8 bg-white border border-gray-300 rounded-[4px] pl-9 pr-4 text-[12px]"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Table Container ───────────────────────────────────── */}
      <div className="overflow-x-auto relative">
        <table className="min-w-full border-collapse">
          <thead>
            {/* Main Headers */}
            <tr>
              {selectable && (
                <th className={cn(TH_BASE, 'w-10 text-center')}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={() => {
                      if (isAllSelected) {
                        setSelectedIds(new Set());
                        onSelectionChange?.([]);
                      } else {
                        const newIds = displayData.map(getId);
                        setSelectedIds(new Set(newIds));
                        onSelectionChange?.(newIds);
                      }
                    }}
                    className="w-3 h-3 rounded-[1px] accent-white cursor-pointer"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  style={{ width: column.width }}
                  className={cn(
                    TH_BASE,
                    column.sortable !== false && enableSorting && 'cursor-pointer hover:bg-[#0a2e50] transition-colors',
                    column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'
                  )}
                  onClick={() => column.sortable !== false && handleSort(String(column.key))}
                >
                  <div className={cn(
                    "flex items-center gap-2",
                    column.align === 'right' ? 'justify-end' : column.align === 'center' ? 'justify-center' : 'justify-start'
                  )}>
                    {column.label}
                    {column.sortable !== false && enableSorting && (
                      <div className="flex flex-col">
                        {sortConfig.key === column.key ? (
                          sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3 text-white" /> :
                            sortConfig.direction === 'desc' ? <ArrowDown className="h-3 w-3 text-white" /> :
                              <ArrowUpDown className="h-2.5 w-2.5 text-white/30" />
                        ) : (
                          <ArrowUpDown className="h-2.5 w-2.5 text-white/30" />
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
              {showActions && <th className={cn(TH_BASE, 'text-center')} style={{ width: '120px' }}>Action</th>}
            </tr>

          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length + (showActions ? 1 : 0) + (selectable ? 1 : 0)} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-[#0d3c68] border-t-transparent rounded-full animate-spin" />
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Loading Records...</p>
                  </div>
                </td>
              </tr>
            ) : displayData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (showActions ? 1 : 0) + (selectable ? 1 : 0)} className="py-16 text-start">
                  <div className="flex flex-col items-center gap-2 opacity-40">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-2xl">📭</div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              displayData.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((row, rowIndex) => {
                const id = getId(row);
                const isChecked = selectable && selectedIds.has(id);
                const isRowSelected = selectedId === (row as any).id || (row as any)._id === selectedId;

                return (
                  <tr
                    key={id ? `row-${id}` : `idx-${rowIndex}`}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      "group transition-all duration-200 border-b border-slate-50 last:border-0",
                      onRowClick && 'cursor-pointer',
                      isRowSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50/80'
                    )}
                  >
                    {selectable && (
                      <td className="px-3 py-1 text-center border-r border-slate-100/50">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            e.stopPropagation();
                            setSelectedIds(prev => {
                              const n = new Set(prev);
                              if (n.has(id)) n.delete(id);
                              else n.add(id);
                              onSelectionChange?.(Array.from(n));
                              return n;
                            });
                          }}
                          className="w-3.5 h-3.5 rounded-[1px] accent-[#0d3c68] cursor-pointer"
                        />
                      </td>
                    )}

                    {columns.map((column) => {
                      const value = column.key.toString().includes('.')
                        ? column.key.toString().split('.').reduce((obj, key) => (obj as any)?.[key], row)
                        : (row as any)[column.key as string];

                      return (
                        <td
                          key={String(column.key)}
                          className={cn(
                            `px-3 py-1 text-[11px] text-slate-600 border-r border-slate-100/50 last:border-r-0 whitespace-nowrap ${String(column.key).toLowerCase().includes('email') ? 'lowercase' : 'capitalize'}`,
                            column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'
                          )}
                        >
                          {column.render ? column.render(value, row, rowIndex) : String(value ?? '')}
                        </td>
                      );
                    })}

                    {showActions && (
                      <td className="px-3 py-1">
                        <div className="flex items-center gap-1.5 justify-center transition-opacity duration-200">
                          {onView && (
                            <button onClick={(e) => { e.stopPropagation(); onView(row); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-[2px] transition-colors shadow-sm bg-white border border-blue-100" title="View">
                              <Eye className="h-3 w-3" />
                            </button>
                          )}
                          {onAddPayment && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!(disableAddPayment && disableAddPayment(row as any))) {
                                  onAddPayment(row);
                                }
                              }}
                              className={cn(
                                "p-1.5 rounded-[2px] transition-colors shadow-sm border",
                                disableAddPayment && disableAddPayment(row as any)
                                  ? "text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed"
                                  : "text-emerald-600 hover:bg-emerald-50 bg-white border-emerald-100"
                              )}
                              title="Add Payment"
                              disabled={disableAddPayment && disableAddPayment(row as any)}
                            >
                              <PlusCircle className="h-3 w-3" />
                            </button>
                          )}
                          {onEdit && (
                            <button onClick={(e) => { e.stopPropagation(); onEdit(row); }} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-[2px] transition-colors shadow-sm bg-white border border-amber-100" title="Edit">
                              <Edit2 className="h-3 w-3" />
                            </button>
                          )}
                          {/* {onPrint && showRowPrint && (
                            <button onClick={(e) => { e.stopPropagation(); onPrint(row); }} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-[2px] transition-colors shadow-sm bg-white border border-emerald-100" title="Print">
                              <Printer className="h-3 w-3" />
                            </button>
                          )} */}
                          {onNextStep && (
                            <button
                              onClick={(e) => { e.stopPropagation(); onNextStep(row); }}
                              className="p-1.5 text-white bg-red-600 hover:bg-red-700 rounded-[2px] transition-colors shadow-sm border border-red-700"
                              title="Go to Next Step"
                            >
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          )}
                          {onDelete && (
                            <button onClick={(e) => { e.stopPropagation(); onDelete(row); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded-[2px] transition-colors shadow-sm bg-white border border-red-100" title="Delete">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>

          {/* Filter Footer */}
          {enableColumnFilters && (
            <tfoot className="bg-slate-50 border-t border-slate-200">
              <tr>
                {selectable && <td className="p-1 border-r border-slate-100"></td>}
                {columns.map((column) => (
                  <td key={`footer-filter-${String(column.key)}`} className="p-1 border-r border-slate-100 last:border-r-0">
                    {column.filterable !== false && (
                      <div className="relative">
                        <input
                          type="text"
                          placeholder={column.label}
                          value={columnFilters[String(column.key)] || ''}
                          onChange={(e) => handleFilterChange(String(column.key), e.target.value)}
                          className="w-full bg-white border border-slate-200 text-[10px] rounded-[2px] px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#0d3c68] placeholder:text-slate-400/90 font-medium"
                        />
                        <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-slate-300" />
                      </div>
                    )}
                  </td>
                ))}
                {showActions && <td className="p-1"></td>}
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* ── Footer / Pagination ────────────────────────────────── */}
      {showPagination && onPageChange && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200 gap-4 mt-auto">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Showing <span className="text-slate-900">{(currentPage - 1) * pageSize + 1}</span> to <span className="text-slate-900">{Math.min(currentPage * pageSize, totalItems ?? displayData.length)}</span> of <span className="text-slate-900">{totalItems ?? displayData.length}</span> entries
          </div>

          <div className="flex items-center border border-slate-200 bg-white rounded-[2px] overflow-hidden shadow-sm">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-slate-400 hover:text-[#0d3c68] disabled:opacity-30 disabled:cursor-not-allowed border-r border-slate-200 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={cn(
                    'w-9 h-9 text-[11px] font-bold border-r border-slate-200 last:border-r-0 transition-all',
                    currentPage === pageNum ? 'bg-[#0d3c68] text-white' : 'text-slate-600 hover:bg-slate-50'
                  )}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-slate-400 hover:text-[#0d3c68] disabled:opacity-30 disabled:cursor-not-allowed border-l border-slate-200 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
