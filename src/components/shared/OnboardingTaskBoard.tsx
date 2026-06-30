'use client';
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { DataTable, Column } from '@/components/shared/DataTable';
import { Plus, X } from 'lucide-react';
import api from '@/lib/axios';

const STATUSES = ['PENDING', 'IN_PROGRESS', 'DONE', 'BLOCKED'] as const;
const STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-zinc-100 text-zinc-600',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  DONE: 'bg-emerald-100 text-emerald-700',
  BLOCKED: 'bg-rose-100 text-rose-700',
};

const EMPTY_FORM = { tenantId: '', title: '', description: '', status: 'PENDING' as typeof STATUSES[number], assignee: '', dueDate: '' };

export function OnboardingTaskBoard({ category, title, description }: { category: 'IMPLEMENTATION' | 'DEPLOYMENT'; title: string; description: string }) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const queryKey = ['super-admin', 'onboarding-tasks', category, page, pageSize, statusFilter, search];

  const { data: tasksData, isLoading } = useQuery({
    queryKey,
    queryFn: async () => (await api.get('/super-admin/onboarding-tasks', {
      params: { category, page, limit: pageSize, status: statusFilter || undefined, search: search || undefined },
    })).data,
  });

  const { data: tenants } = useQuery({
    queryKey: ['super-admin', 'tenants'],
    queryFn: async () => (await api.get('/super-admin/tenants')).data,
  });

  const rows = tasksData?.data || [];
  const total = tasksData?.pagination?.total ?? 0;

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['super-admin', 'onboarding-tasks'] });

  const openCreate = () => { setEditId(null); setFormData(EMPTY_FORM); setFormError(''); setIsModalOpen(true); };
  const openEdit = (row: any) => {
    setEditId(row._id);
    setFormData({
      tenantId: row.tenantId?._id || row.tenantId,
      title: row.title,
      description: row.description || '',
      status: row.status,
      assignee: row.assignee || '',
      dueDate: row.dueDate ? row.dueDate.slice(0, 10) : '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      const payload = { ...formData, category };
      if (editId) await api.put(`/super-admin/onboarding-tasks/${editId}`, payload);
      else await api.post('/super-admin/onboarding-tasks', payload);
      setIsModalOpen(false);
      invalidate();
    } catch (e: any) {
      setFormError(e?.response?.data?.message || 'Failed to save task');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/super-admin/onboarding-tasks/${deleteId}`);
      setDeleteId(null);
      invalidate();
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to delete task');
    }
  };

  const columns: Column<any>[] = [
    { key: 'title', label: 'TASK', sortable: true },
    {
      key: 'tenantId',
      label: 'COMPANY',
      width: '160px',
      render: (v) => (typeof v === 'object' ? v?.name : v) || 'N/A',
    },
    { key: 'assignee', label: 'ASSIGNEE', width: '130px', render: (v) => v || '—' },
    {
      key: 'status',
      label: 'STATUS',
      width: '110px',
      render: (v) => <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${STATUS_COLOR[v]}`}>{v.replace('_', ' ')}</span>,
    },
    {
      key: 'dueDate',
      label: 'DUE',
      width: '120px',
      render: (v) => v ? new Date(v).toLocaleDateString() : '—',
    },
    {
      key: 'actions',
      label: '',
      width: '110px',
      sortable: false,
      filterable: false,
      render: (_v, row) => (
        <div className="flex justify-end gap-1.5">
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
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">{title}</h1>
          <p className="text-xs text-zinc-500">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="h-8 border border-zinc-200 rounded-lg text-xs px-2.5 bg-white">
            <option value="">All Statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
          <Button onClick={openCreate} className="h-8 text-xs bg-zinc-900 text-white hover:bg-zinc-800">
            <Plus size={14} className="mr-1" /> Add Task
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
        searchPlaceholder="Search task or company..."
        currentPage={page}
        pageSize={pageSize}
        totalItems={total}
        onPageChange={setPage}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        emptyMessage="No tasks yet."
      />

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm border border-zinc-200/50">
            <div className="p-5">
              <h3 className="text-lg font-md text-zinc-900 mb-2">Delete Task?</h3>
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
              <h2 className="text-sm font-md text-zinc-900">{editId ? 'Edit Task' : 'Add Task'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-1 rounded-md">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {formError && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{formError}</div>}
              <div className="space-y-1.5">
                <label className="block text-xs font-md text-zinc-700">Company *</label>
                <select required value={formData.tenantId} onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2">
                  <option value="">Select a company</option>
                  {(tenants || []).map((t: any) => <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-md text-zinc-700">Task Title *</label>
                <input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-md text-zinc-700">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2">
                    {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-md text-zinc-700">Due Date</label>
                  <input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-md text-zinc-700">Assignee</label>
                <input value={formData.assignee} onChange={(e) => setFormData({ ...formData, assignee: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2" placeholder="Name of person handling this task" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-md text-zinc-700">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2" />
              </div>
              <div className="pt-3 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">{editId ? 'Save Changes' : 'Create Task'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
