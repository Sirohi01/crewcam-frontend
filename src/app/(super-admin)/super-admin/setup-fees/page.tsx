'use client';
import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { DataTable, Column } from '@/components/shared/DataTable';
import { Loader2 } from 'lucide-react';
import api from '@/lib/axios';

function formatMoney(amount: number, currency: 'INR' | 'USD' = 'INR') {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount || 0);
}

export default function SuperAdminSetupFeesPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [actingOnId, setActingOnId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['super-admin', 'tenants'],
    queryFn: async () => (await api.get('/super-admin/tenants')).data,
  });

  const rows = (data || []).filter((t: any) => {
    if (statusFilter && t.setupFeeStatus !== statusFilter) return false;
    if (search && !t.name?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPending = rows.filter((t: any) => t.setupFeeStatus === 'PENDING')
    .reduce((sum: number, t: any) => sum + (t.setupFeeAmount || 0), 0);
  const totalCollected = (data || []).filter((t: any) => t.setupFeeStatus === 'PAID')
    .reduce((sum: number, t: any) => sum + (t.setupFeeAmount || 0), 0);

  const handleMarkPaid = async (id: string) => {
    setActingOnId(id);
    try {
      await api.post(`/super-admin/tenants/${id}/mark-setup-fee-paid`);
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'tenants'] });
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to mark setup fee as paid');
    } finally {
      setActingOnId(null);
    }
  };

  const columns: Column<any>[] = [
    { key: 'name', label: 'COMPANY', sortable: true },
    { key: 'admin.email', label: 'ADMIN EMAIL', render: (_v, row) => row.admin?.email || 'N/A' },
    {
      key: 'setupFeeAmount',
      label: 'AMOUNT',
      width: '120px',
      render: (_v, row) => formatMoney(row.setupFeeAmount, row.setupFeeCurrency),
    },
    {
      key: 'setupFeeStatus',
      label: 'STATUS',
      width: '110px',
      render: (_v, row) => (
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
          row.setupFeeStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700'
            : row.setupFeeStatus === 'WAIVED' ? 'bg-zinc-100 text-zinc-600'
            : 'bg-amber-100 text-amber-700'
        }`}>
          {row.setupFeeStatus || 'PENDING'}
        </span>
      ),
    },
    {
      key: 'setupFeePaidAt',
      label: 'PAID ON',
      width: '140px',
      render: (_v, row) => row.setupFeePaidAt ? new Date(row.setupFeePaidAt).toLocaleDateString() : '—',
    },
    {
      key: 'actions',
      label: '',
      width: '120px',
      sortable: false,
      filterable: false,
      render: (_v, row) => row.setupFeeStatus === 'PENDING' ? (
        <Button
          size="sm"
          disabled={actingOnId === row._id}
          onClick={() => handleMarkPaid(row._id)}
          className="h-7 text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {actingOnId === row._id ? <Loader2 size={12} className="animate-spin" /> : 'Mark Paid'}
        </Button>
      ) : null,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Setup Fees</h1>
          <p className="text-xs text-zinc-500">One-time onboarding fee billed to every company at provisioning.</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="text-right">
            <p className="text-zinc-400">Pending</p>
            <p className="font-md text-amber-600">{formatMoney(totalPending)}</p>
          </div>
          <div className="text-right">
            <p className="text-zinc-400">Collected (all time)</p>
            <p className="font-md text-emerald-600">{formatMoney(totalCollected)}</p>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 border border-zinc-200 rounded-lg text-xs px-2.5 bg-white"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="WAIVED">Waived</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        rowKey="_id"
        loading={isLoading}
        showActions={false}
        enableColumnFilters={false}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search company..."
        currentPage={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        emptyMessage="No companies found."
      />
    </div>
  );
}
