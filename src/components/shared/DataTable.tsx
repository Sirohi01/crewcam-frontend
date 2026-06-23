import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Edit2, Trash2, Eye, Printer, Search, ArrowUpDown, ArrowUp, ArrowDown, PlusCircle, ArrowRight } from 'lucide-react';
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
  enableSorting?: boolean;
  enableColumnFilters?: boolean;
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

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'in-progress': 'bg-blue-50 text-blue-700 border-blue-200',
    completed: 'bg-green-50 text-green-700 border-green-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <span className={cn('text-[10px] font-bold px-2.5 py-1 rounded-[4px] border uppercase tracking-wider', map[status] || 'bg-yellow-50 text-yellow-700 border-yellow-200')}>
      {status}
    </span>
  );
}

const TH = 'px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white whitespace-nowrap select-none bg-[#0d3c68]';

export function DataTable<T extends { id?: string | number; _id?: string | number }>({
  columns, data, onEdit, onDelete, onView, onPrint, onAddPayment, disableAddPayment,
  onNextStep, onRowClick, rowKey, selectedId, showActions = true,
  emptyMessage = 'No records found', pageSize: pageSizeProp = 5,
  currentPage: currentPageProp, totalItems, onPageChange, onPageSizeChange,
  loading = false, selectable = false, onBulkDelete, enableSorting = true,
  enableColumnFilters = true, showSearch = true, showEntries = true, showPrint = true,
  showPagination = true, searchValue: searchValueProp = '', onSearchChange,
  searchPlaceholder = 'Search records...', onSelectionChange,
}: DataTableProps<T>) {

  // Internal state (used when parent doesn't control)
  const [internalPage, setInternalPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(pageSizeProp);
  const [internalSearch, setInternalSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null }>({ key: '', direction: null });
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const isControlled = onPageChange !== undefined;
  const currentPage = isControlled ? (currentPageProp ?? 1) : internalPage;
  const pageSize = isControlled ? pageSizeProp : internalPageSize;
  const searchValue = onSearchChange ? searchValueProp : internalSearch;

  const getId = (row: T) => {
    if (rowKey && (row as any)[rowKey] != null) return String((row as any)[rowKey]);
    if ((row as any)._id != null) return String((row as any)._id);
    if ((row as any).id != null) return String((row as any).id);
    return '';
  };

  const handlePageChange = (page: number) => {
    if (isControlled) onPageChange?.(page);
    else setInternalPage(page);
  };
  const handlePageSizeChange = (size: number) => {
    if (isControlled) onPageSizeChange?.(size);
    else { setInternalPageSize(size); setInternalPage(1); }
  };
  const handleSearchChange = (val: string) => {
    if (onSearchChange) onSearchChange(val);
    else { setInternalSearch(val); setInternalPage(1); }
  };

  const handleSort = (key: string) => {
    if (!enableSorting) return;
    let direction: 'asc' | 'desc' | null = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    else if (sortConfig.key === key && sortConfig.direction === 'desc') direction = null;
    setSortConfig({ key, direction });
  };

  const getSearchStrings = (val: unknown): string[] => {
    const raw = String(val ?? '').toLowerCase();
    const strings = [raw];
    if (!val || typeof val !== 'string') return strings;
    const isoMatch = val.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      const [, year, month, day] = isoMatch;
      strings.push(`${day}/${month}/${year}`, `${month}/${day}/${year}`);
    }
    return strings;
  };

  const processedData = useMemo(() => {
    let result = [...data];
    if (searchValue) {
      const lower = searchValue.toLowerCase();
      result = result.filter(row => columns.some(col => {
        const val = (row as any)[col.key as string];
        return getSearchStrings(val).some(s => s.includes(lower));
      }));
    }
    Object.keys(columnFilters).forEach(key => {
      const fv = columnFilters[key].toLowerCase();
      if (fv) result = result.filter(row => String((row as any)[key] ?? '').toLowerCase().includes(fv));
    });
    if (sortConfig.key && sortConfig.direction) {
      result.sort((a, b) => {
        const va = (a as any)[sortConfig.key];
        const vb = (b as any)[sortConfig.key];
        if (va < vb) return sortConfig.direction === 'asc' ? -1 : 1;
        if (va > vb) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [data, columnFilters, sortConfig, searchValue, columns]);

  const pagedData = processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const total = totalItems ?? processedData.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const isAllSelected = selectable && pagedData.length > 0 && pagedData.every(r => selectedIds.has(getId(r)));
  const selectedRows: T[] = data.filter(r => selectedIds.has(getId(r)));

  return (
    <div className="bg-white rounded-[4px] shadow-sm border border-slate-200 overflow-hidden">

      {/* ── Toolbar ── */}
      {(showEntries || showSearch) && (
        <div className="bg-white px-4 py-2.5 flex flex-col sm:flex-row justify-between items-center gap-3 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {showEntries && (
              <div className="flex items-center gap-2 text-[13px] text-gray-600">
                <select
                  value={pageSize}
                  onChange={e => handlePageSizeChange(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-[12px] bg-white focus:outline-none"
                >
                  {[5, 10, 20, 50, 100].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <span className="text-sm font-medium text-gray-500">Entries</span>
              </div>
            )}
            {showPrint && onPrint && (
              <button onClick={() => onPrint(null as any)} className="h-7 px-3 bg-white hover:bg-gray-50 text-gray-700 text-[11px] font-bold rounded-[2px] shadow-sm border border-gray-300 flex items-center gap-1.5 uppercase">
                <Printer size={13} /> PRINT
              </button>
            )}
            {selectable && selectedRows.length > 0 && onBulkDelete && (
              <button onClick={() => onBulkDelete(selectedRows)} className="h-7 px-3 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded-[2px] flex items-center gap-1.5 uppercase">
                <Trash2 size={12} /> Delete ({selectedRows.length})
              </button>
            )}
          </div>
          {showSearch && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm font-medium text-gray-500 whitespace-nowrap">Search:</span>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                <input
                  type="text" value={searchValue}
                  onChange={e => handleSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full h-8 bg-white border border-gray-300 rounded-[4px] pl-9 pr-3 text-[12px] focus:outline-none focus:ring-1 focus:ring-[#0d3c68]"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse data-table">
          <thead>
            <tr>
              {selectable && (
                <th className={cn(TH, 'w-10 text-center')}>
                  <input type="checkbox" checked={isAllSelected}
                    onChange={() => {
                      if (isAllSelected) { setSelectedIds(new Set()); onSelectionChange?.([]); }
                      else { const ids = pagedData.map(getId); setSelectedIds(new Set(ids)); onSelectionChange?.(ids); }
                    }}
                    className="w-3.5 h-3.5 rounded-[1px] accent-white cursor-pointer"
                  />
                </th>
              )}
              {columns.map(col => (
                <th key={String(col.key)} style={{ width: col.width }}
                  className={cn(TH, col.sortable !== false && enableSorting && 'cursor-pointer hover:bg-[#0a2e50] transition-colors',
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left')}
                  onClick={() => col.sortable !== false && handleSort(String(col.key))}>
                  <div className={cn('flex items-center gap-1.5', col.align === 'center' ? 'justify-center' : col.align === 'right' ? 'justify-end' : 'justify-start')}>
                    {col.label}
                    {col.sortable !== false && enableSorting && (
                      sortConfig.key === String(col.key)
                        ? sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3 text-white" />
                          : sortConfig.direction === 'desc' ? <ArrowDown className="h-3 w-3 text-white" />
                            : <ArrowUpDown className="h-3 w-3 text-white/40" />
                        : <ArrowUpDown className="h-3 w-3 text-white/40" />
                    )}
                  </div>
                </th>
              ))}
              {showActions && <th className={cn(TH, 'text-center')} style={{ minWidth: '120px' }}>ACTION</th>}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={columns.length + (showActions ? 1 : 0) + (selectable ? 1 : 0)} className="py-16 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-7 h-7 border-2 border-[#0d3c68] border-t-transparent rounded-full animate-spin" />
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Loading Records...</p>
                </div>
              </td></tr>
            ) : pagedData.length === 0 ? (
              <tr><td colSpan={columns.length + (showActions ? 1 : 0) + (selectable ? 1 : 0)} className="py-14 text-center">
                <div className="flex flex-col items-center gap-2 opacity-40">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-2xl">📭</div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{emptyMessage}</p>
                </div>
              </td></tr>
            ) : (
              pagedData.map((row, rowIndex) => {
                const id = getId(row);
                const isChecked = selectable && selectedIds.has(id);
                const isRowSelected = selectedId === (row as any).id || (row as any)._id === selectedId;
                return (
                  <tr key={id || rowIndex}
                    onClick={() => onRowClick?.(row)}
                    className={cn('group transition-all duration-150 border-b border-slate-50 last:border-0',
                      onRowClick && 'cursor-pointer',
                      isRowSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50/80')}>
                    {selectable && (
                      <td className="px-3 py-1.5 text-center border-r border-slate-100/50">
                        <input type="checkbox" checked={isChecked}
                          onChange={e => {
                            e.stopPropagation();
                            setSelectedIds(prev => {
                              const n = new Set(prev);
                              n.has(id) ? n.delete(id) : n.add(id);
                              onSelectionChange?.(Array.from(n));
                              return n;
                            });
                          }}
                          className="w-3.5 h-3.5 rounded-[1px] accent-[#0d3c68] cursor-pointer"
                        />
                      </td>
                    )}
                    {columns.map(col => {
                      const value = (row as any)[col.key as string];
                      return (
                        <td key={String(col.key)}
                          className={cn('px-3 py-1.5 text-[11px] text-slate-700 border-r border-slate-100/50 last:border-r-0 whitespace-nowrap',
                            col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left')}>
                          {col.render ? col.render(value, row, (currentPage - 1) * pageSize + rowIndex) : String(value ?? '')}
                        </td>
                      );
                    })}
                    {showActions && (
                      <td className="px-2 py-1.5">
                        <div className="flex items-center gap-1 justify-center">
                          {onView && (
                            <button onClick={e => { e.stopPropagation(); onView(row); }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-[2px] transition-colors bg-white border border-blue-200 shadow-sm" title="View">
                              <Eye className="h-3 w-3" />
                            </button>
                          )}
                          {onAddPayment && (
                            <button onClick={e => { e.stopPropagation(); !(disableAddPayment?.(row)) && onAddPayment(row); }}
                              disabled={disableAddPayment?.(row)}
                              className={cn('p-1.5 rounded-[2px] transition-colors shadow-sm border',
                                disableAddPayment?.(row) ? 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed' : 'text-emerald-600 hover:bg-emerald-50 bg-white border-emerald-200')}
                              title="Add Payment"><PlusCircle className="h-3 w-3" /></button>
                          )}
                          {onEdit && (
                            <button onClick={e => { e.stopPropagation(); onEdit(row); }}
                              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-[2px] transition-colors bg-white border border-amber-200 shadow-sm" title="Edit">
                              <Edit2 className="h-3 w-3" />
                            </button>
                          )}
                          {onNextStep && (
                            <button onClick={e => { e.stopPropagation(); onNextStep(row); }}
                              className="p-1.5 text-white bg-[#e74c3c] hover:bg-red-700 rounded-[2px] transition-colors shadow-sm border border-red-700" title="Next Step">
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          )}
                          {onDelete && (
                            <button onClick={e => { e.stopPropagation(); onDelete(row); }}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-[2px] transition-colors bg-white border border-red-200 shadow-sm" title="Delete">
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

          {/* Filter footer */}
          {enableColumnFilters && (
            <tfoot className="bg-slate-50 border-t border-slate-200">
              <tr>
                {selectable && <td className="p-1 border-r border-slate-100" />}
                {columns.map(col => (
                  <td key={`f-${String(col.key)}`} className="p-1 border-r border-slate-100 last:border-r-0">
                    {col.filterable !== false && (
                      <div className="relative">
                        <input type="text" placeholder={col.label}
                          value={columnFilters[String(col.key)] || ''}
                          onChange={e => { setColumnFilters(p => ({ ...p, [String(col.key)]: e.target.value })); handlePageChange(1); }}
                          className="w-full bg-white border border-slate-200 text-[10px] rounded-[2px] px-2 py-1 pr-6 focus:outline-none focus:ring-1 focus:ring-[#0d3c68] placeholder:text-slate-400 font-medium"
                        />
                        <Search className="absolute right-1.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-slate-300" />
                      </div>
                    )}
                  </td>
                ))}
                {showActions && <td className="p-1" />}
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* ── Pagination footer ── */}
      {showPagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-2.5 bg-slate-50 border-t border-slate-200 gap-3">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Showing <span className="text-slate-900">{Math.min((currentPage - 1) * pageSize + 1, total)}</span> to{' '}
            <span className="text-slate-900">{Math.min(currentPage * pageSize, total)}</span> of{' '}
            <span className="text-slate-900">{total}</span> Entries
          </div>
          <div className="flex items-center border border-slate-200 bg-white rounded-[2px] overflow-hidden shadow-sm">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
              className="px-2.5 py-2 text-slate-500 hover:text-[#0d3c68] disabled:opacity-30 disabled:cursor-not-allowed border-r border-slate-200 transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let p: number;
              if (totalPages <= 5) p = i + 1;
              else if (currentPage <= 3) p = i + 1;
              else if (currentPage >= totalPages - 2) p = totalPages - 4 + i;
              else p = currentPage - 2 + i;
              return (
                <button key={p} onClick={() => handlePageChange(p)}
                  className={cn('w-9 h-9 text-[11px] font-bold border-r border-slate-200 last:border-r-0 transition-all',
                    currentPage === p ? 'bg-[#0d3c68] text-white' : 'text-slate-600 hover:bg-slate-50')}>
                  {p}
                </button>
              );
            })}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
              className="px-2.5 py-2 text-slate-500 hover:text-[#0d3c68] disabled:opacity-30 disabled:cursor-not-allowed border-l border-slate-200 transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
