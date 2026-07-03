"use client";
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
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
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
  enableSorting?: boolean;
  enableColumnFilters?: boolean;
  showSearch?: boolean;
  showEntries?: boolean;
  showPrint?: boolean;
  showPagination?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

const TH_BASE = 'px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-600 whitespace-nowrap select-none bg-slate-50 border-b border-slate-200';

export function DataTable<T extends { id?: string | number; _id?: string | number }>({
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

  const processedData = useMemo(() => {
    let result = [...data];

    if (searchValue) {
      const lowerSearch = searchValue.toLowerCase();
      result = result.filter(row => {
        return columns.some(col => {
          const val = col.key.toString().includes('.')
            ? col.key.toString().split('.').reduce((obj, k) => (obj as any)?.[k], row)
            : (row as any)[col.key as string];
          return String(val ?? '').toLowerCase().includes(lowerSearch);
        });
      });
    }

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
    <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden w-full">
      {(showEntries || showSearch || (showPrint && onPrint)) && (
        <div className="bg-white px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3 border-b border-gray-200 shadow-sm w-full">
          <div className="flex items-center gap-4">
            {showEntries && (
              <div className="flex items-center gap-2 text-[13px] text-gray-600 whitespace-nowrap">
                <select
                  value={pageSize}
                  onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-[12px] bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {[5, 10, 20, 30, 50, 100].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <span className="text-sm font-medium text-gray-500">Entries</span>
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
          {showSearch && (
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <span className="text-sm font-medium text-gray-500">Search:</span>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => {
                    onSearchChange?.(e.target.value);
                    if (onPageChange) onPageChange(1);
                  }}
                  placeholder={searchPlaceholder}
                  className="w-full h-8 bg-white border border-gray-300 rounded-[4px] pl-9 pr-4 text-[12px]"
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="overflow-x-auto relative w-full">
        <table className="min-w-full border-collapse data-table w-full">
          <thead>
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
                    className="w-3.5 h-3.5 rounded-[2px] accent-indigo-600 cursor-pointer"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  style={{ width: column.width }}
                  className={cn(
                    TH_BASE,
                    column.sortable !== false && enableSorting && 'cursor-pointer hover:bg-slate-100 transition-colors',
                    column.align === 'right' ? 'text-right' : column.align === 'left' ? 'text-left' : 'text-center'
                  )}
                  onClick={() => column.sortable !== false && handleSort(String(column.key))}
                >
                  <div className={cn(
                    "flex items-center gap-2",
                    column.align === 'right' ? 'justify-end' : column.align === 'left' ? 'justify-start' : 'justify-center'
                  )}>
                    {column.label}
                    {column.sortable !== false && enableSorting && (
                      <div className="flex flex-col">
                        {sortConfig.key === column.key ? (
                          sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3 text-slate-500" /> :
                            sortConfig.direction === 'desc' ? <ArrowDown className="h-3 w-3 text-slate-500" /> :
                              <ArrowUpDown className="h-2.5 w-2.5 text-slate-300" />
                        ) : (
                          <ArrowUpDown className="h-2.5 w-2.5 text-slate-300" />
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
                    <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Loading Records...</p>
                  </div>
                </td>
              </tr>
            ) : displayData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (showActions ? 1 : 0) + (selectable ? 1 : 0)} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2 opacity-40 mx-auto">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-2xl mx-auto">📭</div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mx-auto">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              (totalItems !== undefined ? displayData : displayData.slice((currentPage - 1) * pageSize, currentPage * pageSize)).map((row, rowIndex) => {
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
                      isRowSelected ? 'bg-indigo-50/60' : 'hover:bg-slate-50/80'
                    )}
                  >
                    {selectable && (
                      <td className="px-3 py-2 text-center border-r border-slate-100/50">
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
                          className="w-3.5 h-3.5 rounded-[2px] accent-indigo-600 cursor-pointer"
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
                            "px-3 py-2 text-[11px] text-slate-600 border-r border-slate-100/50 last:border-r-0 whitespace-nowrap",
                            column.align === 'right' ? 'text-right' : column.align === 'left' ? 'text-left' : 'text-center'
                          )}
                        >
                          {column.render ? column.render(value, row, rowIndex) : String(value ?? '')}
                        </td>
                      );
                    })}

                    {showActions && (
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1.5 justify-center transition-opacity duration-200">
                          {onView && (
                            <button onClick={(e) => { e.stopPropagation(); onView(row); }} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-[2px] transition-colors shadow-sm bg-white border border-indigo-100" title="View">
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

          {enableColumnFilters && (
            <tfoot className="bg-slate-50/80 border-t border-slate-200">
              <tr>
                {selectable && <td className="p-1 border-r border-slate-100"></td>}
                {columns.map((column) => (
                  <td key={`foot-filter-${String(column.key)}`} className="p-1 border-r border-slate-100 last:border-r-0 font-normal align-middle">
                    {column.filterable !== false && (
                      <div className="relative flex items-center justify-center w-full px-1 py-1">
                        <input
                          type="text"
                          placeholder={column.label}
                          value={columnFilters[String(column.key)] || ''}
                          onChange={(e) => handleFilterChange(String(column.key), e.target.value)}
                          className="w-full bg-white border border-slate-200 text-[10px] rounded-[3px] pl-2 pr-6 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400 font-medium"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-300 pointer-events-none" />
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

      {showPagination && onPageChange && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200 gap-4 mt-auto w-full">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Showing <span className="text-slate-900">{totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}</span> to <span className="text-slate-900">{Math.min(currentPage * pageSize, totalItems ?? displayData.length)}</span> of <span className="text-slate-900">{totalItems ?? displayData.length}</span> entries
          </div>

          <div className="flex items-center border border-slate-200 bg-white rounded-[2px] overflow-hidden shadow-sm">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed border-r border-slate-200 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPages || 1) }, (_, i) => {
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
                    currentPage === pageNum ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                  )}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-2 text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed border-l border-slate-200 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
