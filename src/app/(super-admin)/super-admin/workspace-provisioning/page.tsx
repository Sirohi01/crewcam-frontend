'use client';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable, Column } from '@/components/shared/DataTable';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import api from '@/lib/axios';

interface TenantRow {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  admin?: { email?: string } | null;
  credentialsEmailStatus: 'PENDING' | 'SENT' | 'FAILED';
  credentialsEmailSentAt?: string;
}

function StepBadge({ done, label }: { done: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${done ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-500'}`}>
      {done ? <CheckCircle2 size={11} /> : <Clock size={11} />}
      {label}
    </span>
  );
}

export default function SuperAdminWorkspaceProvisioningPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ['super-admin', 'tenants'],
    queryFn: async () => (await api.get('/super-admin/tenants')).data,
  });

  const rows: TenantRow[] = (data || []).filter((t: any) =>
    !search || t.name?.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<TenantRow>[] = [
    { key: 'name', label: 'COMPANY', sortable: true },
    {
      key: 'createdAt',
      label: 'PROVISIONED ON',
      width: '150px',
      render: (v) => new Date(v).toLocaleString(),
    },
    {
      key: 'steps',
      label: 'PROVISIONING CHECKLIST',
      sortable: false,
      filterable: false,
      render: (_v, row) => (
        <div className="flex flex-wrap items-center gap-1.5">
          <StepBadge done label="Workspace Created" />
          <StepBadge done label="Admin Account" />
          <StepBadge done={row.credentialsEmailStatus === 'SENT'} label={row.credentialsEmailStatus === 'SENT' ? 'Credentials Emailed' : row.credentialsEmailStatus === 'FAILED' ? 'Email Failed' : 'Credentials Pending'} />
        </div>
      ),
    },
    {
      key: 'isActive',
      label: 'STATUS',
      width: '100px',
      render: (v) => (
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${v ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
          {v ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
          {v ? 'Live' : 'Inactive'}
        </span>
      ),
    },
  ];

  const failedEmails = (data || []).filter((t: any) => t.credentialsEmailStatus === 'FAILED').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Workspace Provisioning</h1>
          <p className="text-xs text-zinc-500">Technical setup status of every company workspace — database, admin account, and credential delivery.</p>
        </div>
        {failedEmails > 0 && (
          <div className="text-xs text-rose-600 font-medium">{failedEmails} credential email(s) failed — resend from Companies page</div>
        )}
      </div>

      <DataTable<TenantRow>
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
        emptyMessage="No companies provisioned yet."
      />
    </div>
  );
}
