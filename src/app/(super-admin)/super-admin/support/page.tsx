'use client';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable, Column } from '@/components/shared/DataTable';
import api from '@/lib/axios';

interface TicketRow {
  _id: string;
  tenantId: { _id: string; name: string } | string;
  employeeId?: { firstName?: string; lastName?: string; email?: string } | null;
  department: string;
  subject: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In_Progress' | 'Resolved' | 'Closed';
  createdAt: string;
}

const PRIORITY_COLOR: Record<string, string> = {
  Low: 'bg-zinc-100 text-zinc-600',
  Medium: 'bg-blue-100 text-blue-700',
  High: 'bg-amber-100 text-amber-700',
  Urgent: 'bg-rose-100 text-rose-700',
};

const STATUS_COLOR: Record<string, string> = {
  Open: 'bg-amber-100 text-amber-700',
  In_Progress: 'bg-blue-100 text-blue-700',
  Resolved: 'bg-emerald-100 text-emerald-700',
  Closed: 'bg-zinc-100 text-zinc-600',
};

export default function SuperAdminSupportPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['super-admin', 'tickets', page, pageSize, statusFilter, search],
    queryFn: async () => (await api.get('/super-admin/tickets', {
      params: { page, limit: pageSize, status: statusFilter || undefined, search: search || undefined },
    })).data,
  });

  const rows: TicketRow[] = data?.data || [];
  const total = data?.pagination?.total ?? 0;

  const columns: Column<TicketRow>[] = [
    {
      key: 'tenantId',
      label: 'COMPANY',
      width: '160px',
      render: (v) => (typeof v === 'object' ? v?.name : v) || 'N/A',
    },
    { key: 'subject', label: 'SUBJECT' },
    { key: 'department', label: 'DEPARTMENT', width: '120px' },
    {
      key: 'employeeId',
      label: 'RAISED BY',
      width: '160px',
      render: (v) => v ? `${v.firstName || ''} ${v.lastName || ''}`.trim() || v.email : 'N/A',
    },
    {
      key: 'priority',
      label: 'PRIORITY',
      width: '100px',
      render: (v) => <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${PRIORITY_COLOR[v]}`}>{v}</span>,
    },
    {
      key: 'status',
      label: 'STATUS',
      width: '110px',
      render: (v) => <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${STATUS_COLOR[v]}`}>{v.replace('_', ' ')}</span>,
    },
    {
      key: 'createdAt',
      label: 'RAISED ON',
      width: '140px',
      render: (v) => new Date(v).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Support</h1>
          <p className="text-xs text-zinc-500">Cross-company view of helpdesk tickets raised by employees inside each company workspace.</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="text-right">
            <p className="text-zinc-400">Open / In Progress</p>
            <p className="font-md text-amber-600">{data?.openCount ?? 0}</p>
          </div>
          <div className="text-right">
            <p className="text-zinc-400">Urgent (unresolved)</p>
            <p className="font-md text-rose-600">{data?.urgentCount ?? 0}</p>
          </div>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="h-8 border border-zinc-200 rounded-lg text-xs px-2.5 bg-white">
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In_Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      <DataTable<TicketRow>
        columns={columns}
        data={rows}
        rowKey="_id"
        loading={isLoading}
        showActions={false}
        enableColumnFilters={false}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search subject or department..."
        currentPage={page}
        pageSize={pageSize}
        totalItems={total}
        onPageChange={setPage}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        emptyMessage="No support tickets raised yet."
      />
    </div>
  );
}
