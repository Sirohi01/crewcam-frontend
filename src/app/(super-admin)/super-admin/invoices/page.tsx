'use client';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Receipt, History } from 'lucide-react';
import { DataTable, Column } from '@/components/shared/DataTable';
import api from '@/lib/axios';

function formatMoney(amount: number, currency: 'INR' | 'USD' = 'INR') {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount || 0);
}

const INVOICE_STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  PARTIAL: 'bg-blue-100 text-blue-700',
  PAID: 'bg-emerald-100 text-emerald-700',
  REFUNDED: 'bg-zinc-100 text-zinc-600',
  CANCELLED: 'bg-rose-100 text-rose-700',
};

interface InvoiceRow {
  _id: string;
  tenantId: { _id: string; name: string } | string;
  invoiceNumber: string;
  type: 'SETUP_FEE' | 'SUBSCRIPTION';
  amount: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  amountPaid: number;
  couponCode?: string;
  currency: 'INR' | 'USD';
  status: string;
  dueDate?: string;
  pdfUrl?: string;
  createdAt: string;
}

interface PaymentRow {
  _id: string;
  tenantId: { _id: string; name: string } | string;
  type: 'SETUP_FEE' | 'SUBSCRIPTION' | 'AI_CREDIT_TOPUP';
  amount: number;
  currency: 'INR' | 'USD';
  paidAt: string;
  gateway?: string;
  recordedBy?: { firstName?: string; lastName?: string; email?: string } | null;
}

function InvoicesTab() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['super-admin', 'invoices-all', page, pageSize, statusFilter, typeFilter],
    queryFn: async () => (await api.get('/super-admin/invoices', {
      params: { page, limit: pageSize, status: statusFilter || undefined, type: typeFilter || undefined },
    })).data,
  });

  const rows: InvoiceRow[] = data?.data || [];
  const total = data?.pagination?.total ?? 0;

  const columns: Column<InvoiceRow>[] = [
    { key: 'invoiceNumber', label: 'INVOICE #', width: '140px' },
    { key: 'tenantId', label: 'COMPANY', render: (v) => (typeof v === 'object' ? v?.name : v) || 'N/A' },
    {
      key: 'type', label: 'TYPE', width: '110px',
      render: (v) => v === 'SETUP_FEE' ? 'Setup Fee' : 'Subscription',
    },
    { key: 'amount', label: 'SUBTOTAL', width: '100px', render: (v, row) => formatMoney(v, row.currency) },
    {
      key: 'discountAmount', label: 'DISCOUNT', width: '110px',
      render: (v, row) => v > 0 ? <span className="text-rose-600">-{formatMoney(v, row.currency)}{row.couponCode ? ` (${row.couponCode})` : ''}</span> : '—',
    },
    { key: 'taxAmount', label: 'GST', width: '90px', render: (v, row) => v > 0 ? formatMoney(v, row.currency) : '—' },
    { key: 'totalAmount', label: 'TOTAL', width: '110px', render: (v, row) => <strong>{formatMoney(v, row.currency)}</strong> },
    { key: 'amountPaid', label: 'PAID', width: '110px', render: (v, row) => formatMoney(v, row.currency) },
    {
      key: 'status', label: 'STATUS', width: '100px',
      render: (v) => <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${INVOICE_STATUS_COLOR[v]}`}>{v}</span>,
    },
    { key: 'dueDate', label: 'DUE', width: '120px', render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
    {
      key: 'pdfUrl', label: '', width: '60px', sortable: false, filterable: false,
      render: (v) => v ? <a href={v} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-700">PDF</a> : null,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 justify-end">
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="h-8 border border-zinc-200 rounded-lg text-xs px-2.5 bg-white">
          <option value="">All Statuses</option>
          {['PENDING', 'PARTIAL', 'PAID', 'REFUNDED', 'CANCELLED'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }} className="h-8 border border-zinc-200 rounded-lg text-xs px-2.5 bg-white">
          <option value="">All Types</option>
          <option value="SETUP_FEE">Setup Fee</option>
          <option value="SUBSCRIPTION">Subscription</option>
        </select>
      </div>
      <DataTable<InvoiceRow>
        columns={columns}
        data={rows}
        rowKey="_id"
        loading={isLoading}
        showActions={false}
        enableColumnFilters={false}
        showSearch={false}
        currentPage={page}
        pageSize={pageSize}
        totalItems={total}
        onPageChange={setPage}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        emptyMessage="No invoices generated yet — generate one from a company's Lifecycle page."
      />
    </div>
  );
}

function PaymentHistoryTab() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [typeFilter, setTypeFilter] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['super-admin', 'payments', page, pageSize, typeFilter, from, to],
    queryFn: async () => (await api.get('/super-admin/payments', {
      params: { page, limit: pageSize, type: typeFilter || undefined, from: from || undefined, to: to || undefined },
    })).data,
  });

  const rows: PaymentRow[] = data?.data || [];
  const total = data?.pagination?.total ?? 0;
  const pageTotal = rows.reduce((sum, p) => sum + (p.currency === 'USD' ? p.amount * 83.5 : p.amount), 0);

  const columns: Column<PaymentRow>[] = [
    { key: 'paidAt', label: 'DATE', width: '140px', render: (v) => new Date(v).toLocaleDateString() },
    { key: 'tenantId', label: 'COMPANY', render: (v) => (typeof v === 'object' ? v?.name : v) || 'N/A' },
    {
      key: 'type', label: 'TYPE', width: '120px',
      render: (v) => {
        const labels: Record<string, string> = { SETUP_FEE: 'Setup Fee', SUBSCRIPTION: 'Subscription', AI_CREDIT_TOPUP: 'AI Credit Top-up' };
        const colors: Record<string, string> = { SETUP_FEE: 'bg-indigo-100 text-indigo-700', SUBSCRIPTION: 'bg-emerald-100 text-emerald-700', AI_CREDIT_TOPUP: 'bg-violet-100 text-violet-700' };
        return <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${colors[v]}`}>{labels[v] || v}</span>;
      },
    },
    { key: 'amount', label: 'AMOUNT', width: '110px', render: (v, row) => formatMoney(v, row.currency) },
    { key: 'gateway', label: 'GATEWAY', width: '100px', render: (v) => v || 'MANUAL' },
    {
      key: 'recordedBy', label: 'RECORDED BY', width: '180px',
      render: (v) => v ? `${v.firstName || ''} ${v.lastName || ''}`.trim() || v.email : 'System',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(1); }} className="h-8 border border-zinc-200 rounded-lg text-xs px-2" />
        <span className="text-zinc-400 text-xs">to</span>
        <input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(1); }} className="h-8 border border-zinc-200 rounded-lg text-xs px-2" />
        <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }} className="h-8 border border-zinc-200 rounded-lg text-xs px-2.5 bg-white">
          <option value="">All Types</option>
          <option value="SETUP_FEE">Setup Fee</option>
          <option value="SUBSCRIPTION">Subscription</option>
          <option value="AI_CREDIT_TOPUP">AI Credit Top-up</option>
        </select>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <div className="text-zinc-500">Showing <span className="font-md text-zinc-900">{total}</span> payments</div>
        <div className="text-zinc-500">Page total: <span className="font-md text-emerald-600">{formatMoney(pageTotal)}</span></div>
      </div>

      <DataTable<PaymentRow>
        columns={columns}
        data={rows}
        rowKey="_id"
        loading={isLoading}
        showActions={false}
        enableColumnFilters={false}
        showSearch={false}
        currentPage={page}
        pageSize={pageSize}
        totalItems={total}
        onPageChange={setPage}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        emptyMessage="No payments recorded yet"
      />
    </div>
  );
}

export default function SuperAdminInvoicesPage() {
  const [tab, setTab] = useState<'invoices' | 'history'>('invoices');

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Invoices</h1>
        <p className="text-xs text-zinc-500">Setup fee and subscription invoices, payment status, and the underlying payment ledger.</p>
      </div>

      <div className="inline-flex rounded-md border border-zinc-200 bg-white p-0.5">
        <button onClick={() => setTab('invoices')} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded ${tab === 'invoices' ? 'bg-indigo-600 text-white' : 'text-zinc-600'}`}>
          <Receipt size={13} /> Invoices
        </button>
        <button onClick={() => setTab('history')} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded ${tab === 'history' ? 'bg-indigo-600 text-white' : 'text-zinc-600'}`}>
          <History size={13} /> Payment History
        </button>
      </div>

      {tab === 'invoices' ? <InvoicesTab /> : <PaymentHistoryTab />}
    </div>
  );
}
