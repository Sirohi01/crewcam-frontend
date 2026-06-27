'use client';
import React, { Suspense, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DataTable, Column } from '@/components/shared/DataTable';
import { Plus, X } from 'lucide-react';
import api from '@/lib/axios';

const STAGES = ['LEAD', 'DEMO_SCHEDULED', 'PROPOSAL_SENT', 'QUOTATION_APPROVED', 'WON', 'LOST'] as const;
const SOURCES = ['WEBSITE', 'REFERRAL', 'OUTBOUND', 'EVENT', 'OTHER'] as const;

const STAGE_COLOR: Record<string, string> = {
  LEAD: 'bg-blue-100 text-blue-700',
  DEMO_SCHEDULED: 'bg-indigo-100 text-indigo-700',
  PROPOSAL_SENT: 'bg-violet-100 text-violet-700',
  QUOTATION_APPROVED: 'bg-amber-100 text-amber-700',
  WON: 'bg-emerald-100 text-emerald-700',
  LOST: 'bg-zinc-100 text-zinc-500',
};

function formatMoney(amount: number, currency: 'INR' | 'USD' = 'INR') {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount || 0);
}

const EMPTY_FORM = {
  companyName: '', contactName: '', contactEmail: '', contactPhone: '',
  source: 'OTHER' as typeof SOURCES[number], stage: 'LEAD' as typeof STAGES[number],
  estimatedValue: 0, currency: 'INR' as 'INR' | 'USD', notes: '', lostReason: '',
};

export default function SuperAdminLeadsPage() {
  return (
    <Suspense fallback={null}>
      <SuperAdminLeadsPageInner />
    </Suspense>
  );
}

function SuperAdminLeadsPageInner() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [stageFilter, setStageFilter] = useState(searchParams.get('stage') || '');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['super-admin', 'leads', page, pageSize, stageFilter, search],
    queryFn: async () => (await api.get('/super-admin/leads', {
      params: { page, limit: pageSize, stage: stageFilter || undefined, search: search || undefined },
    })).data,
  });

  const rows = data?.data || [];
  const total = data?.pagination?.total ?? 0;

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['super-admin', 'leads'] });

  const openCreate = () => { setEditId(null); setFormData(EMPTY_FORM); setFormError(''); setIsModalOpen(true); };
  const openEdit = (row: any) => {
    setEditId(row._id);
    setFormData({
      companyName: row.companyName, contactName: row.contactName, contactEmail: row.contactEmail,
      contactPhone: row.contactPhone || '', source: row.source, stage: row.stage,
      estimatedValue: row.estimatedValue || 0, currency: row.currency || 'INR',
      notes: row.notes || '', lostReason: row.lostReason || '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      if (editId) await api.put(`/super-admin/leads/${editId}`, formData);
      else await api.post('/super-admin/leads', formData);
      setIsModalOpen(false);
      invalidate();
    } catch (e: any) {
      setFormError(e?.response?.data?.message || 'Failed to save lead');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/super-admin/leads/${deleteId}`);
      setDeleteId(null);
      invalidate();
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to delete lead');
    }
  };

  const columns: Column<any>[] = [
    { key: 'companyName', label: 'COMPANY', sortable: true },
    { key: 'contactName', label: 'CONTACT' },
    { key: 'contactEmail', label: 'EMAIL' },
    { key: 'source', label: 'SOURCE', width: '100px' },
    {
      key: 'stage',
      label: 'STAGE',
      width: '110px',
      render: (v) => <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${STAGE_COLOR[v]}`}>{v}</span>,
    },
    {
      key: 'estimatedValue',
      label: 'VALUE',
      width: '110px',
      render: (v, row) => formatMoney(v, row.currency),
    },
    {
      key: 'actions',
      label: '',
      width: '170px',
      sortable: false,
      filterable: false,
      render: (_v, row) => (
        <div className="flex justify-end gap-1.5">
          {row.stage === 'WON' && !row.convertedTenantId && (
            <Link href={`/super-admin/companies?fromLead=${row._id}`} className="text-xs font-medium text-emerald-600 hover:text-emerald-700 px-1.5">Convert</Link>
          )}
          <button onClick={() => openEdit(row)} className="text-xs font-medium text-indigo-600 hover:text-indigo-700 px-1.5">Edit</button>
          <button onClick={() => setDeleteId(row._id)} className="text-xs font-medium text-rose-600 hover:text-rose-700 px-1.5">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Leads</h1>
          <p className="text-xs text-zinc-500">Inbound and outbound prospects before they become a provisioned company.</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={stageFilter} onChange={(e) => { setStageFilter(e.target.value); setPage(1); }} className="h-8 border border-zinc-200 rounded-lg text-xs px-2.5 bg-white">
            <option value="">All Stages</option>
            {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <Button onClick={openCreate} className="h-8 text-xs bg-zinc-900 text-white hover:bg-zinc-800">
            <Plus size={14} className="mr-1" /> Add Lead
          </Button>
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
        searchPlaceholder="Search company, contact, or email..."
        currentPage={page}
        pageSize={pageSize}
        totalItems={total}
        onPageChange={setPage}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        emptyMessage="No leads yet."
      />

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm border border-zinc-200/50">
            <div className="p-5">
              <h3 className="text-lg font-md text-zinc-900 mb-2">Delete Lead?</h3>
              <p className="text-sm text-zinc-500 mb-6">This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" size="sm" onClick={() => setDeleteId(null)}>Cancel</Button>
                <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white" onClick={handleDelete}>Delete</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4 overflow-y-auto py-10">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg border border-zinc-200/50 my-auto">
            <div className="px-5 py-4 border-b border-zinc-100 flex justify-between items-center">
              <h2 className="text-sm font-md text-zinc-900">{editId ? 'Edit Lead' : 'Add Lead'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-1 rounded-md">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {formError && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{formError}</div>}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2">
                  <label className="block text-xs font-md text-zinc-700">Company Name *</label>
                  <input required value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-md text-zinc-700">Contact Name *</label>
                  <input required value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-md text-zinc-700">Contact Phone</label>
                  <input value={formData.contactPhone} onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2" />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <label className="block text-xs font-md text-zinc-700">Contact Email *</label>
                  <input required type="email" value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-md text-zinc-700">Source</label>
                  <select value={formData.source} onChange={(e) => setFormData({ ...formData, source: e.target.value as any })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2">
                    {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-md text-zinc-700">Stage</label>
                  <select value={formData.stage} onChange={(e) => setFormData({ ...formData, stage: e.target.value as any })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2">
                    {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-md text-zinc-700">Estimated Value</label>
                  <input type="number" min={0} value={formData.estimatedValue} onChange={(e) => setFormData({ ...formData, estimatedValue: Number(e.target.value) || 0 })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-md text-zinc-700">Currency</label>
                  <select value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2">
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
                <div className="space-y-1.5 col-span-2">
                  <label className="block text-xs font-md text-zinc-700">Notes</label>
                  <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={2} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2" />
                </div>
                {formData.stage === 'LOST' && (
                  <div className="space-y-1.5 col-span-2">
                    <label className="block text-xs font-md text-zinc-700">Lost Reason</label>
                    <input value={formData.lostReason} onChange={(e) => setFormData({ ...formData, lostReason: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2" />
                  </div>
                )}
              </div>
              <div className="pt-3 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">{editId ? 'Save Changes' : 'Create Lead'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
