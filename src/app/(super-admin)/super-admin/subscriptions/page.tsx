'use client';
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { DataTable, Column } from '@/components/shared/DataTable';
import { Loader2 } from 'lucide-react';
import api from '@/lib/axios';

function formatMoney(amount: number, currency: 'INR' | 'USD' = 'INR') {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount || 0);
}

export default function SuperAdminSubscriptionsPage() {
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

  const now = new Date();
  const rows = (data || []).filter((t: any) => {
    if (statusFilter && t.subscriptionStatus !== statusFilter) return false;
    if (search && !t.name?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const mrr = (data || [])
    .filter((t: any) => t.subscriptionStatus === 'ACTIVE')
    .reduce((sum: number, t: any) => sum + (t.billingCycle === 'YEARLY' ? (t.subscriptionAmount || 0) / 12 : (t.subscriptionAmount || 0)), 0);

  const overdueCount = (data || []).filter((t: any) =>
    t.subscriptionStatus === 'PAST_DUE' || (t.subscriptionStatus === 'ACTIVE' && t.nextRenewalDate && new Date(t.nextRenewalDate) <= now)
  ).length;

  const handleRecordPayment = async (id: string) => {
    setActingOnId(id);
    try {
      await api.post(`/super-admin/tenants/${id}/record-subscription-payment`);
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'tenants'] });
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to record subscription payment');
    } finally {
      setActingOnId(null);
    }
  };

  const columns: Column<any>[] = [
    { key: 'name', label: 'COMPANY', sortable: true },
    {
      key: 'billingCycle',
      label: 'CYCLE',
      width: '90px',
      render: (_v, row) => row.billingCycle === 'YEARLY' ? 'Yearly' : 'Monthly',
    },
    {
      key: 'subscriptionAmount',
      label: 'AMOUNT / CYCLE',
      width: '130px',
      render: (_v, row) => formatMoney(row.subscriptionAmount, row.subscriptionCurrency),
    },
    {
      key: 'subscriptionStatus',
      label: 'STATUS',
      width: '110px',
      render: (_v, row) => {
        const overdue = row.subscriptionStatus === 'ACTIVE' && row.nextRenewalDate && new Date(row.nextRenewalDate) <= now;
        const label = overdue ? 'RENEWAL DUE' : (row.subscriptionStatus || 'PENDING');
        return (
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
            row.subscriptionStatus === 'PAST_DUE' || overdue ? 'bg-rose-100 text-rose-700'
              : row.subscriptionStatus === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700'
              : 'bg-zinc-100 text-zinc-600'
          }`}>
            {label}
          </span>
        );
      },
    },
    {
      key: 'nextRenewalDate',
      label: 'NEXT RENEWAL',
      width: '130px',
      render: (_v, row) => row.nextRenewalDate ? new Date(row.nextRenewalDate).toLocaleDateString() : '—',
    },
    {
      key: 'actions',
      label: '',
      width: '140px',
      sortable: false,
      filterable: false,
      render: (_v, row) => (
        <Button
          size="sm"
          disabled={actingOnId === row._id}
          onClick={() => handleRecordPayment(row._id)}
          className="h-7 text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {actingOnId === row._id ? <Loader2 size={12} className="animate-spin" /> : 'Record Payment'}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Subscriptions</h1>
          <p className="text-xs text-zinc-500">Recurring monthly or yearly billing cycle and renewal status per company.</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="text-right">
            <p className="text-zinc-400">Active MRR</p>
            <p className="font-md text-emerald-600">{formatMoney(mrr)}</p>
          </div>
          <div className="text-right">
            <p className="text-zinc-400">Overdue</p>
            <p className="font-md text-rose-600">{overdueCount}</p>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 border border-zinc-200 rounded-lg text-xs px-2.5 bg-white"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="PAST_DUE">Past Due</option>
            <option value="CANCELLED">Cancelled</option>
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
