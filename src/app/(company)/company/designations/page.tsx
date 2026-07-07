'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Plus, Trash2, X } from 'lucide-react';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';
import api from '@/lib/axios';

type Department = { _id: string; name: string; code: string; };
type Designation = { _id: string; name: string; code: string; departmentId: string | Department; level: number; };

const emptyDesignation = { name: '', code: '', level: '', departmentId: '' };

export default function DesignationsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [levels, setLevels] = useState<any[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [modal, setModal] = useState<boolean>(false);
  const [modalItem, setModalItem] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [desigData, setDesigData] = useState(emptyDesignation);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterDepartmentId, setFilterDepartmentId] = useState('');
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    fetchData();
  }, [page, debouncedSearch, filterDepartmentId]);

  const departmentMap = useMemo(() => new Map(departments.map((item) => [item._id, item.name])), [departments]);
  const deptOptions = useMemo(() => departments.map(d => ({ label: d.name, value: d._id })), [departments]);
  const levelOptions = useMemo(() => levels.map(l => ({ label: l.name, value: String(l.level) })), [levels]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [dRes, desRes, lRes] = await Promise.all([
        api.get('/companies/departments?limit=1000'),
        api.get(`/companies/designations?page=${page}&limit=10&search=${encodeURIComponent(debouncedSearch)}&departmentId=${filterDepartmentId}`),
        api.get('/master-data/levels?limit=1000'),
      ]);
      setDepartments(dRes.data.data || []);
      setDesignations(desRes.data.data || []);
      setLevels(lRes.data.data || []);
      if (desRes.data.meta) setMeta(desRes.data.meta);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to load designations');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setError('');
    setDesigData(emptyDesignation);
    setModalItem(null);
    setModal(true);
  };

  const openEdit = (item: any) => {
    setError('');
    setDesigData({ name: item.name || '', code: item.code || '', level: String(item.level || ''), departmentId: resolveId(item.departmentId) });
    setModalItem(item);
    setModal(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...desigData, level: desigData.level ? Number(desigData.level) : undefined };
      if (modalItem?._id) {
        await api.put(`/companies/designations/${modalItem._id}`, payload);
      } else {
        await api.post('/companies/designations', payload);
      }
      setModal(false);
      await fetchData();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const executeDelete = async () => {
    if (!deleteConfirm) return;
    setSaving(true);
    setError('');
    try {
      await api.delete(`/companies/designations/${deleteConfirm.id}`);
      setDeleteConfirm(null);
      await fetchData();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Delete failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Manage Designations</h1>
          <p className="text-xs text-zinc-500">Add or edit designations and assign them to departments.</p>
        </div>
      </div>

      {error && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}

      <div className="mt-4">
        <Card className="border-zinc-200 shadow-sm dark:border-zinc-800 flex flex-col min-h-[400px]">
          <CardHeader className="py-3 px-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <CardTitle className="text-sm font-medium">Designations List</CardTitle>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search designations..."
                className="w-full sm:w-48 border border-zinc-200 dark:border-zinc-700 rounded-md text-sm px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white dark:bg-zinc-900"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="w-full sm:w-48">
                <SearchableDropdown
                  value={filterDepartmentId}
                  onChange={(val) => { setFilterDepartmentId(val); setPage(1); }}
                  options={[{ label: 'All Departments', value: '' }, ...deptOptions]}
                  placeholder="All Departments"
                />
              </div>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0" onClick={openCreate}>
                <Plus size={14} className="mr-1.5" /> Add Designation
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col justify-between">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-xs text-zinc-500 font-medium">
                  <tr>
                    <th className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800">Designation Name</th>
                    <th className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800">Code</th>
                    <th className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800">Department</th>
                    <th className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800">Level</th>
                    <th className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800">Last Modified</th>
                    <th className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800 w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {loading && <tr><td colSpan={6} className="p-8 text-center text-sm text-zinc-500">Loading...</td></tr>}
                  {!loading && designations.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-sm text-zinc-500">No designations found.</td></tr>}
                  {!loading && designations.map((item) => {
                    const departmentId = resolveId(item.departmentId);
                    return (
                      <tr key={item._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group">
                        <td className="px-5 py-3 font-medium text-zinc-900 dark:text-zinc-100">{item.name}</td>
                        <td className="px-5 py-3 text-zinc-600 dark:text-zinc-400">{item.code}</td>
                        <td className="px-5 py-3 text-zinc-600 dark:text-zinc-400">{departmentMap.get(departmentId) || '-'}</td>
                        <td className="px-5 py-3 text-zinc-600 dark:text-zinc-400">{item.level ? ({
                          '1': 'Level 1: Junior Employee (L1)',
                          '2': 'Level 2: Mid-Level (L2)',
                          '3': 'Level 3: Senior (L3)',
                          '4': 'Level 4: Team Lead / Manager (L4)',
                          '5': 'Level 5: Director / VP (L5)'
                        } as any)[String(item.level)] || item.level : '-'}</td>
                        <td className="px-5 py-3">
                          <AuditInfo item={item} />
                        </td>
                        <td className="px-5 py-3 text-center">
                          <div className="flex justify-end gap-2 transition-opacity">
                            <button onClick={() => openEdit(item)} className="text-zinc-500 hover:text-indigo-600 p-1 rounded"><Edit2 size={14} /></button>
                            <button onClick={() => setDeleteConfirm({ id: item._id, name: item.name })} className="text-rose-500 hover:text-rose-700 p-1 rounded"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {meta.totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <span className="text-xs text-zinc-500">
                  Showing {(meta.page - 1) * meta.limit + 1} to {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} entries
                </span>
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
          </CardContent>
        </Card>
      </div>

      {deleteConfirm && (
        <ConfirmModal title={`Delete ${deleteConfirm.name}?`} busy={saving} onCancel={() => setDeleteConfirm(null)} onConfirm={executeDelete}>
          This will deactivate the designation. Linked child records must be removed first.
        </ConfirmModal>
      )}

      {modal && (
        <Modal title={`${modalItem ? 'Edit' : 'Create'} Designation`} onClose={() => setModal(false)} onSubmit={submit} busy={saving}>
          <div className="space-y-4">
            <Input label="Designation Name" value={desigData.name} onChange={(e: any) => setDesigData({ ...desigData, name: e.target.value })} required />
            <Input label="Code" value={desigData.code} onChange={(e: any) => setDesigData({ ...desigData, code: e.target.value })} required />
            <div className="space-y-1.5">
              <label className="block text-xs font-md text-zinc-700 dark:text-zinc-300">Level</label>
              <SearchableDropdown
                value={desigData.level}
                onChange={(val) => setDesigData({ ...desigData, level: val })}
                options={levelOptions}
                placeholder="Select Level"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-md text-zinc-700 dark:text-zinc-300">Department <span className="text-rose-500">*</span></label>
              <SearchableDropdown
                value={desigData.departmentId}
                onChange={(val) => setDesigData({ ...desigData, departmentId: val })}
                options={deptOptions}
                placeholder="Select Department"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Panel({ title, onAdd, loading, empty, children }: { title: string; onAdd: () => void; loading: boolean; empty: string; children: React.ReactNode }) {
  const hasChildren = React.Children.count(children) > 0;
  return (
    <Card className="border-zinc-200 shadow-sm dark:border-zinc-800 flex flex-col h-[600px]">
      <CardHeader className="py-2.5 px-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onAdd}><Plus size={14} /></Button>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-y-auto">
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {loading && <div className="p-4 text-xs text-zinc-500">Loading...</div>}
          {!loading && !hasChildren && <div className="p-4 text-xs text-zinc-500">{empty}</div>}
          {!loading && children}
        </div>
      </CardContent>
    </Card>
  );
}


function Modal({ title, onClose, onSubmit, children, busy }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-md border border-zinc-200/50 dark:border-zinc-800">
        <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center rounded-t-xl bg-zinc-50/50 dark:bg-zinc-900/50">
          <h2 className="text-sm font-md text-zinc-900 dark:text-zinc-100">{title}</h2>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-zinc-600 p-1 rounded-md"><X size={16} /></button>
        </div>
        <form onSubmit={onSubmit} className="p-5 space-y-5">
          {children}
          <div className="pt-3 flex justify-end gap-3">
            <Button type="button" variant="outline" className="h-9 px-4 text-xs" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={busy} className="h-9 px-4 text-xs bg-indigo-600 hover:bg-indigo-700 text-white">{busy ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmModal({ title, children, onCancel, onConfirm, busy }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-sm border border-zinc-200/50 dark:border-zinc-800">
        <div className="p-5">
          <h3 className="text-lg font-md text-zinc-900 dark:text-zinc-50 mb-2">{title}</h3>
          <p className="text-sm text-zinc-500 mb-6">{children}</p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
            <Button size="sm" disabled={busy} className="bg-rose-600 hover:bg-rose-700 text-white" onClick={onConfirm}>{busy ? 'Deleting...' : 'Delete'}</Button>
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
      <input className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-transparent" {...props} />
    </div>
  );
}

function Select({ label, options, ...props }: any) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-md text-zinc-700 dark:text-zinc-300">{label}</label>
      <select className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-transparent" {...props}>
        <option value="">Select...</option>
        {options.map((o: any) => <option key={o._id} value={o._id}>{o.name}</option>)}
      </select>
    </div>
  );
}

function resolveId(value: any) {
  return typeof value === 'object' && value ? value._id : value || '';
}

function AuditInfo({ item }: { item: any }) {
  if (item.updatedBy && item.updatedAt) {
    return (
      <div className="text-[10px]">
        <div className="text-zinc-900 dark:text-zinc-100 font-medium">Updated by {item.updatedBy.firstName} {item.updatedBy.lastName}</div>
        <div className="text-zinc-500">{new Date(item.updatedAt).toLocaleString()}</div>
      </div>
    );
  }
  if (item.createdBy && item.createdAt) {
    return (
      <div className="text-[10px]">
        <div className="text-zinc-900 dark:text-zinc-100 font-medium">Created by {item.createdBy.firstName} {item.createdBy.lastName}</div>
        <div className="text-zinc-500">{new Date(item.createdAt).toLocaleString()}</div>
      </div>
    );
  }
  return <div className="text-zinc-500">-</div>;
}
