'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable, Column } from '@/components/shared/DataTable';
import api from '@/lib/axios';

interface AuditLogRow {
  _id: string;
  tenantId: string;
  tenantName?: string;
  userId?: { firstName?: string; lastName?: string; email?: string } | null;
  action: string;
  module: string;
  status: 'SUCCESS' | 'FAILURE';
  ipAddress?: string;
  createdAt: string;
}

export default function SuperAdminAuditLogsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['super-admin', 'audit-logs', page, pageSize, search, statusFilter, moduleFilter],
    queryFn: async () => (await api.get('/super-admin/audit-logs', {
      params: {
        page,
        limit: pageSize,
        search: search || undefined,
        status: statusFilter || undefined,
        module: moduleFilter || undefined,
      },
    })).data,
  });

  const rows: AuditLogRow[] = data?.data || [];
  const total = data?.pagination?.total ?? 0;

  const columns: Column<AuditLogRow>[] = [
    {
      key: 'createdAt',
      label: 'TIMESTAMP',
      width: '170px',
      render: (value) => new Date(value).toLocaleString(),
    },
    { key: 'tenantName', label: 'COMPANY', width: '160px' },
    {
      key: 'userId',
      label: 'USER',
      width: '180px',
      render: (value) => value ? `${value.firstName || ''} ${value.lastName || ''}`.trim() || value.email : 'System',
    },
    { key: 'module', label: 'MODULE', width: '120px' },
    { key: 'action', label: 'ACTION' },
    {
      key: 'status',
      label: 'STATUS',
      width: '100px',
      render: (value) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${value === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
          {value}
        </span>
      ),
    },
    { key: 'ipAddress', label: 'IP ADDRESS', width: '130px' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Audit Logs</h1>
          <p className="text-xs text-zinc-500">Cross-company activity trail — logins, writes, and system events recorded in real time.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="h-8 border border-zinc-200 rounded-lg text-xs px-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All Statuses</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILURE">Failure</option>
          </select>
          <input
            value={moduleFilter}
            onChange={(e) => { setModuleFilter(e.target.value); setPage(1); }}
            placeholder="Filter by module..."
            className="h-8 border border-zinc-200 rounded-lg text-xs px-2.5 w-40 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      <DataTable<AuditLogRow>
        columns={columns}
        data={rows}
        rowKey="_id"
        loading={isLoading}
        showActions={false}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search action or module..."
        enableColumnFilters={false}
        currentPage={page}
        pageSize={pageSize}
        totalItems={total}
        onPageChange={setPage}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        emptyMessage="No audit events found"
      />
    </div>
  );
}
