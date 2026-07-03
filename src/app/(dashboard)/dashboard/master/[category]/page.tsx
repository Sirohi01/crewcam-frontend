'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Plus, Search, Trash2, X, AlertCircle } from 'lucide-react';
import api from '@/lib/axios';
import { useParams, useRouter } from 'next/navigation';

type FieldKey = 'code' | 'level' | 'category' | 'description' | 'defaultDays';

type MasterConfig = {
  key: string;
  title: string;
  endpoint: string;
  help: string;
  example: string;
  fields: FieldKey[];
};

const MASTER_CONFIGS: MasterConfig[] = [
  { key: 'degrees', title: 'Degrees', endpoint: '/master-data/degrees', help: 'Employee education qualifications.', example: 'B.Tech, MBA, B.Com', fields: ['code', 'level'] },
  { key: 'marks', title: 'Marks / Grades', endpoint: '/master-data/marks', help: 'Academic marks or grade labels.', example: 'First Division, CGPA 8+', fields: ['code', 'level'] },
  { key: 'subjects', title: 'Subjects', endpoint: '/master-data/subjects', help: 'Education or training subjects.', example: 'Computer Science, Finance', fields: ['code', 'category'] },
  { key: 'levels', title: 'Job Levels', endpoint: '/master-data/levels', help: 'Employee seniority levels used in org structure.', example: 'L1 Trainee, L2 Executive, L5 Manager', fields: ['code', 'level'] },
  { key: 'statuses', title: 'Statuses', endpoint: '/master-data/statuses', help: 'Reusable workflow/status values.', example: 'Active, Pending, Approved, Rejected', fields: ['code', 'category'] },
  { key: 'policies', title: 'Policies', endpoint: '/master-data/policies', help: 'Company policy names for HR and onboarding.', example: 'IT Policy, Code of Conduct', fields: ['code', 'category', 'description'] },
  { key: 'leave-types', title: 'Leave Types', endpoint: '/master-data/leave-types', help: 'Leave buckets employees can apply from.', example: 'Casual Leave, Sick Leave, Earned Leave', fields: ['code', 'defaultDays', 'description'] },
  { key: 'leave-natures', title: 'Leave Natures', endpoint: '/master-data/leave-natures', help: 'Classification of leave behavior.', example: 'Paid, Unpaid, Compensatory', fields: ['code', 'description'] },
  { key: 'attendance-rules', title: 'Attendance Rules', endpoint: '/master-data/attendance-rules', help: 'Rules for attendance calculation.', example: 'Grace 15 mins, Half-day after 4 hrs', fields: ['code', 'description'] },
  { key: 'relaxation-rules', title: 'Relaxation Rules', endpoint: '/master-data/relaxation-rules', help: 'Special attendance relaxations.', example: 'Late arrival allowance, WFH exception', fields: ['code', 'description'] },
  { key: 'bank-names', title: 'Bank Names', endpoint: '/master-data/bank-names', help: 'Banks used in payroll/profile forms.', example: 'HDFC Bank, SBI, ICICI Bank', fields: ['code'] },
  { key: 'expense-heads', title: 'Expense Heads', endpoint: '/master-data/expense-heads', help: 'Expense categories for reimbursements.', example: 'Travel, Food, Internet', fields: ['code', 'category'] },
  { key: 'holidays', title: 'Holidays', endpoint: '/master-data/holidays', help: 'Holiday labels or holiday calendar items.', example: 'Diwali, Republic Day, Christmas', fields: ['code', 'category'] },
  { key: 'it-inventories', title: 'IT Inventory', endpoint: '/master-data/it-inventories', help: 'IT asset types issued to employees.', example: 'Laptop, Mouse, ID Card', fields: ['code', 'category'] },
  { key: 'stationeries', title: 'Stationery', endpoint: '/master-data/stationeries', help: 'Office stationery items.', example: 'Notebook, Pen, Visiting Cards', fields: ['code', 'category'] },
  { key: 'providers', title: 'Providers', endpoint: '/master-data/providers', help: 'Vendors or service providers.', example: 'Airtel, Dell Partner, Courier Vendor', fields: ['code', 'category'] },
  { key: 'brands', title: 'Brands', endpoint: '/master-data/brands', help: 'Asset or product brand names.', example: 'Dell, HP, Lenovo', fields: ['code', 'category'] },
  { key: 'services', title: 'Services', endpoint: '/master-data/services', help: 'Services used by the company.', example: 'Internet, Courier, Security', fields: ['code', 'category'] },
  { key: 'mobile-services', title: 'Mobile Services', endpoint: '/master-data/mobile-services', help: 'Mobile plans or telecom services.', example: 'Corporate SIM, Data Plan', fields: ['code', 'category'] },
  { key: 'utility-providers', title: 'Utility Providers', endpoint: '/master-data/utility-providers', help: 'Utility vendors for office operations.', example: 'Electricity Board, Water Supplier', fields: ['code', 'category'] },
  { key: 'question-papers', title: 'Question Papers', endpoint: '/master-data/question-papers', help: 'Assessment/test paper names.', example: 'Aptitude Test, HR Screening', fields: ['code', 'category'] },
  { key: 'option-questions', title: 'Option Questions', endpoint: '/master-data/option-questions', help: 'MCQ/question bank items.', example: 'Multiple-choice hiring questions', fields: ['code', 'category', 'description'] },
];

const initialForm = { name: '', code: '', level: '', category: '', description: '', defaultDays: '' };

export default function MasterDataCategoryPage() {
  const params = useParams();
  const categoryKey = params.category as string;
  const active = useMemo(() => MASTER_CONFIGS.find((item) => item.key === categoryKey), [categoryKey]);
  const router = useRouter();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });

  const [modalItem, setModalItem] = useState<any | null>(null);
  const [deleteItem, setDeleteItem] = useState<any | null>(null);
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    if (!active) return;
    setPage(1);
    setSearch('');
    fetchItems();
  }, [active]);

  useEffect(() => {
    fetchItems();
  }, [page, debouncedSearch]);

  const fetchItems = async () => {
    if (!active) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`${active.endpoint}?page=${page}&limit=10&search=${encodeURIComponent(debouncedSearch)}`);
      setItems(res.data.data || []);
      if (res.data.meta) setMeta(res.data.meta);
    } catch (e: any) {
      setError(e.response?.data?.message || `Failed to load ${active.title}`);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setFormData(initialForm);
    setModalItem({});
    setError('');
  };

  const openEdit = (item: any) => {
    setFormData({
      name: item.name || '',
      code: item.code || '',
      level: item.level || '',
      category: item.category || '',
      description: item.description || '',
      defaultDays: item.defaultDays === undefined ? '' : String(item.defaultDays),
    });
    setModalItem(item);
    setError('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!active) return;
    setSaving(true);
    setError('');
    try {
      const payload: any = { name: formData.name };
      active.fields.forEach((field) => {
        const value = formData[field];
        if (value !== '') payload[field] = field === 'defaultDays' ? Number(value) : value;
      });
      if (modalItem?._id) await api.put(`${active.endpoint}/${modalItem._id}`, payload);
      else await api.post(active.endpoint, payload);
      setModalItem(null);
      await fetchItems();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const executeDelete = async () => {
    if (!deleteItem || !active) return;
    setSaving(true);
    setError('');
    try {
      await api.delete(`${active.endpoint}/${deleteItem._id}`);
      setDeleteItem(null);
      await fetchItems();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Delete failed');
    } finally {
      setSaving(false);
    }
  };

  if (!active) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertCircle size={48} className="text-zinc-300 mb-4" />
        <h2 className="text-xl font-md">Master Data Category Not Found</h2>
        <p className="text-zinc-500 mt-2">The category you are looking for does not exist.</p>
        <Button onClick={() => router.push('/dashboard')} className="mt-6">Return to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-md tracking-tight text-zinc-900 dark:text-zinc-50">{active.title} Master Data</h1>
          <p className="text-xs text-zinc-500 mt-1">Manage {active.title.toLowerCase()} used across the system.</p>
        </div>
        <Button onClick={openCreate} className="h-9 text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
          <Plus size={14} className="mr-1.5" /> Add {active.title}
        </Button>
      </div>

      {error && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}

      <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
        <CardHeader className="py-3 px-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-sm font-medium">{active.title} List</CardTitle>
              <p className="mt-1 text-xs text-zinc-500">{active.help}</p>
              <p className="mt-0.5 text-[11px] text-zinc-400">Example: {active.example}</p>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${active.title}...`} className="h-9 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-3 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-sm" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading && <div className="p-6 text-sm text-center text-zinc-500">Loading {active.title}...</div>}
          {!loading && items.length === 0 && (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
                <Search size={24} className="text-zinc-400" />
              </div>
              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">No {active.title} found</div>
              <div className="mt-1 text-xs text-zinc-500">Click “Add {active.title}” to create your first record. Example: {active.example}.</div>
            </div>
          )}
          {!loading && items.length > 0 && (
            <div className="flex flex-col overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 text-xs font-md text-zinc-500 uppercase tracking-wider">
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Details</th>
                    <th className="px-5 py-3 font-medium">Audit Info</th>
                    <th className="px-5 py-3 font-medium w-24">Status</th>
                    <th className="px-5 py-3 font-medium text-center w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {items.map((item) => (
                    <tr key={item._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group">
                      <td className="px-5 py-3 align-middle">
                        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.name}</div>
                      </td>
                      <td className="px-5 py-3 align-middle">
                        <div className="text-xs text-zinc-500">{describeItem(item, active)}</div>
                      </td>
                      <td className="px-5 py-3 align-middle">
                        <div className="text-[11px] text-zinc-400">
                          {item.updatedBy?.firstName ? `Updated by ${item.updatedBy.firstName} ${item.updatedBy.lastName}` : (item.createdBy?.firstName ? `Created by ${item.createdBy.firstName} ${item.createdBy.lastName}` : 'System generated')}
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">
                          {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : (item.createdAt ? new Date(item.createdAt).toLocaleString() : '-')}
                        </div>
                      </td>
                      <td className="px-5 py-3 align-middle">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-md uppercase bg-emerald-100 text-emerald-700 border border-emerald-200">Active</span>
                      </td>
                      <td className="px-5 py-3 align-middle text-center">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => openEdit(item)} className="text-zinc-400 hover:bg-zinc-200 hover:text-indigo-600 p-1.5 rounded-md transition-colors border border-transparent hover:border-zinc-300"><Edit2 size={14} /></button>
                          <button onClick={() => setDeleteItem(item)} className="text-zinc-400 hover:bg-rose-100 hover:text-rose-600 p-1.5 rounded-md transition-colors border border-transparent hover:border-rose-300"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {meta.totalPages > 1 && (
                <div className="px-4 py-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
                  <span className="text-xs text-zinc-500">Showing page {meta.page} of {meta.totalPages}</span>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" disabled={meta.page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</Button>
                    {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(p => (
                      <Button key={p} variant={p === meta.page ? 'default' : 'outline'} size="sm" onClick={() => setPage(p)} className={p === meta.page ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : ''}>
                        {p}
                      </Button>
                    ))}
                    <Button variant="outline" size="sm" disabled={meta.page >= meta.totalPages} onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}>Next</Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {modalItem && (
        <Modal title={`${modalItem._id ? 'Edit' : 'Add'} ${active.title}`} busy={saving} onClose={() => setModalItem(null)} onSubmit={submit}>
          <div className="rounded-md bg-indigo-50/50 border border-indigo-100 px-4 py-3 text-xs text-indigo-800 mb-4">
            <span className="font-md block mb-0.5">Tip:</span> Add values like: <span className="font-medium">{active.example}</span>
          </div>
          <div className="space-y-4">
            <Input label="Name" value={formData.name} onChange={(e: any) => setFormData({ ...formData, name: e.target.value })} required />
            {active.fields.includes('code') && <Input label="Code / Abbreviation" value={formData.code} onChange={(e: any) => setFormData({ ...formData, code: e.target.value })} />}
            {active.fields.includes('level') && <Input label="Level / Tier" value={formData.level} onChange={(e: any) => setFormData({ ...formData, level: e.target.value })} />}
            {active.fields.includes('category') && <Input label="Category" value={formData.category} onChange={(e: any) => setFormData({ ...formData, category: e.target.value })} />}
            {active.fields.includes('defaultDays') && <Input label="Default Days per Year" type="number" min={0} value={formData.defaultDays} onChange={(e: any) => setFormData({ ...formData, defaultDays: e.target.value })} required />}
            {active.fields.includes('description') && <Textarea label="Description / Notes" value={formData.description} onChange={(e: any) => setFormData({ ...formData, description: e.target.value })} />}
          </div>
        </Modal>
      )}

      {deleteItem && (
        <ConfirmModal busy={saving} title={`Delete ${deleteItem.name}?`} onCancel={() => setDeleteItem(null)} onConfirm={executeDelete}>
          Are you sure you want to deactivate <span className="font-md text-zinc-900">{deleteItem.name}</span>? This item will no longer appear in dropdowns across the system.
        </ConfirmModal>
      )}
    </div>
  );
}

function describeItem(item: any, config: MasterConfig) {
  const parts = config.fields
    .map((field) => {
      if (item[field] === undefined || item[field] === '') return '';
      if (field === 'defaultDays') return `Default: ${item[field]} days/yr`;
      return `${field.charAt(0).toUpperCase() + field.slice(1)}: ${item[field]}`;
    })
    .filter(Boolean);
  return parts.length ? parts.join(' • ') : 'Standard Record';
}

function Modal({ title, onClose, onSubmit, children, busy }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl w-full max-w-md border border-zinc-200 dark:border-zinc-800 transform transition-all">
        <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center rounded-t-xl bg-zinc-50/50 dark:bg-zinc-900/50">
          <h2 className="text-base font-md text-zinc-900 dark:text-zinc-100">{title}</h2>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-1.5 rounded-md transition-colors"><X size={16} /></button>
        </div>
        <form onSubmit={onSubmit} className="p-5">
          {children}
          <div className="pt-6 mt-2 flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800">
            <Button type="button" variant="outline" className="h-9 px-4 text-xs font-medium" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={busy} className="h-9 px-5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">{busy ? 'Saving...' : 'Save Record'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmModal({ title, children, onCancel, onConfirm, busy }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl w-full max-w-sm border border-zinc-200 dark:border-zinc-800 transform transition-all">
        <div className="p-6">
          <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center mb-4">
            <Trash2 size={20} className="text-rose-600" />
          </div>
          <h3 className="text-lg font-md text-zinc-900 dark:text-zinc-50 mb-2">{title}</h3>
          <p className="text-sm text-zinc-500 mb-6 leading-relaxed">{children}</p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="sm" className="h-9 font-medium" onClick={onCancel}>Cancel</Button>
            <Button size="sm" disabled={busy} className="h-9 bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-sm" onClick={onConfirm}>{busy ? 'Deleting...' : 'Delete Record'}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-md text-zinc-700 dark:text-zinc-300">{label}</label>
      <input className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white dark:bg-zinc-900 shadow-sm transition-all" {...props} />
    </div>
  );
}

function Textarea({ label, ...props }: any) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-md text-zinc-700 dark:text-zinc-300">{label}</label>
      <textarea rows={3} className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white dark:bg-zinc-900 shadow-sm transition-all resize-none" {...props} />
    </div>
  );
}
