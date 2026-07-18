'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit2, Plus, Search, Trash2, X } from 'lucide-react';
import api from '@/lib/axios';
import { ROLE_SCOPES, getRoleScopeLabel } from '@/lib/roleScopes';
import { LOGIN_TYPES, ROLE_PRESET_GROUPS, EMPLOYER_PERMISSION_CHIPS, RolePreset } from '@/lib/rolePresets';

type Role = { _id: string; name: string; description: string; scope: string; loginType: string; permissions: string[]; createdAt: string; updatedAt: string; createdBy?: any; updatedBy?: any; };

const emptyRole = { name: '', description: '', scope: 'self', loginType: 'employee', permissions: '' };

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [modal, setModal] = useState<boolean>(false);
  const [modalItem, setModalItem] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [roleData, setRoleData] = useState(emptyRole);

  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/companies/roles');
      setRoles(res.data.data || []);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setError('');
    setRoleData(emptyRole);
    setModalItem(null);
    setModal(true);
  };

  const openEdit = (item: any) => {
    setError('');
    setRoleData({
      name: item.name || '',
      description: item.description || '',
      scope: item.scope || 'self',
      loginType: item.loginType || 'employee',
      permissions: Array.isArray(item.permissions) ? item.permissions.join(', ') : ''
    });
    setModalItem(item);
    setModal(true);
  };

  const applyPreset = (preset: RolePreset) => {
    setRoleData({
      name: preset.name,
      description: '',
      scope: preset.scope,
      loginType: preset.loginType,
      permissions: preset.permissions.join(', '),
    });
  };

  const togglePermissionChip = (permissions: string[]) => {
    setRoleData((prev) => {
      const current = new Set(prev.permissions.split(',').map((p) => p.trim()).filter(Boolean));
      const allPresent = permissions.every((p) => current.has(p));
      permissions.forEach((p) => (allPresent ? current.delete(p) : current.add(p)));
      return { ...prev, permissions: Array.from(current).join(', ') };
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...roleData,
        permissions: roleData.permissions.split(',').map(p => p.trim()).filter(Boolean)
      };
      if (modalItem?._id) {
        await api.put(`/companies/roles/${modalItem._id}`, payload);
      } else {
        await api.post('/companies/roles', payload);
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
      await api.delete(`/companies/roles/${deleteConfirm.id}`);
      setDeleteConfirm(null);
      await fetchData();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Delete failed');
    } finally {
      setSaving(false);
    }
  };

  const filteredRoles = roles.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || (r.description || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300 pb-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h1 className="text-lg font-medium tracking-tight text-zinc-900 dark:text-zinc-50">Manage Roles</h1>
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium">Access permissions and user roles</p>
        </div>
        <Button onClick={openCreate} className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
          <Plus size={14} className="mr-1" /> Add Role
        </Button>
      </div>

      {error && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}

      <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800">
        <CardHeader className="py-3 px-4 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
            <CardTitle className="text-[13px] text-zinc-800 dark:text-zinc-200">Role Directory</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1.5 h-3.5 w-3.5 text-zinc-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search roles..."
                className="h-7 pl-8 text-xs bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-indigo-500/20"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-xs text-zinc-500 font-medium">
                <tr>
                  <th className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800">Role Name</th>
                  <th className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800">Login Type</th>
                  <th className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800">Scope</th>
                  <th className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800">Description</th>
                  <th className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800">Last Modified</th>
                  <th className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800 w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {loading && <tr><td colSpan={6} className="p-8 text-center text-sm text-zinc-500">Loading...</td></tr>}
                {!loading && filteredRoles.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-sm text-zinc-500">No roles found.</td></tr>}
                {!loading && filteredRoles.map((item) => (
                  <tr key={item._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group">
                    <td className="px-5 py-3 font-medium text-zinc-900 dark:text-zinc-100">{item.name}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium ${item.loginType === 'employer' ? 'bg-amber-50 text-amber-700' : 'bg-sky-50 text-sky-700'}`}>
                        {item.loginType === 'employer' ? 'Employer' : 'Employee'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-zinc-600 dark:text-zinc-400">
                      <span className="inline-flex rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700">
                        {getRoleScopeLabel(item.scope)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-zinc-600 dark:text-zinc-400 whitespace-normal min-w-[200px] text-xs">
                      {item.description || '-'}
                    </td>
                    <td className="px-5 py-3">
                      <AuditInfo item={item} />
                    </td>
                    <td className="px-5 py-3 align-middle text-center">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEdit(item)} className="text-zinc-400 hover:bg-zinc-200 hover:text-indigo-600 p-1.5 rounded-md transition-colors border border-transparent hover:border-zinc-300">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => setDeleteConfirm({ id: item._id, name: item.name })} className="text-zinc-400 hover:bg-rose-100 hover:text-rose-600 p-1.5 rounded-md transition-colors border border-transparent hover:border-rose-300">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {deleteConfirm && (
        <ConfirmModal title={`Delete ${deleteConfirm.name}?`} busy={saving} onCancel={() => setDeleteConfirm(null)} onConfirm={executeDelete}>
          This will deactivate the role. Users with this role may lose access to the system.
        </ConfirmModal>
      )}

      {modal && (
        <Modal title={`${modalItem ? 'Edit' : 'Create'} Role`} onClose={() => setModal(false)} onSubmit={submit} busy={saving}>
          <div className="space-y-4">
            {!modalItem && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium block text-zinc-700 dark:text-zinc-300">Quick presets</label>
                <div className="space-y-2">
                  {ROLE_PRESET_GROUPS.map((g) => (
                    <div key={g.group}>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1">{g.group}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {g.roles.map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => applyPreset(preset)}
                            className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${roleData.name === preset.name ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-zinc-500 mt-1">Or just type your own role name below — these are only starting points.</p>
              </div>
            )}

            <Field label="Role Name" value={roleData.name} onChange={(val: string) => setRoleData(prev => ({ ...prev, name: val }))} placeholder="e.g. Finance Admin" required />

            <div className="space-y-1.5">
              <label className="text-xs font-medium block text-zinc-700 dark:text-zinc-300">Login Type</label>
              <select
                value={roleData.loginType}
                onChange={(e) => setRoleData(prev => ({ ...prev, loginType: e.target.value }))}
                className="flex h-8 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                required
              >
                {LOGIN_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <p className="text-[10px] text-zinc-500">Which company-portal login screen users with this role sign in through.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium block text-zinc-700 dark:text-zinc-300">Scope</label>
              <select
                value={roleData.scope}
                onChange={(e) => setRoleData(prev => ({ ...prev, scope: e.target.value }))}
                className="flex h-8 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                required
              >
                {ROLE_SCOPES.map((s) => <option key={s.value} value={s.value}>{s.label} — {s.hint}</option>)}
              </select>
              <p className="text-[10px] text-zinc-500">How much company data this role can see — separate from Login Type.</p>
            </div>

            {roleData.loginType === 'employer' && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium block text-zinc-700 dark:text-zinc-300">Add permissions</label>
                <div className="flex flex-wrap gap-1.5">
                  {EMPLOYER_PERMISSION_CHIPS.map((chip) => {
                    const current = roleData.permissions.split(',').map((p) => p.trim());
                    const active = chip.permissions.every((p) => current.includes(p));
                    return (
                      <button
                        key={chip.label}
                        type="button"
                        onClick={() => togglePermissionChip(chip.permissions)}
                        className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${active ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}
                      >
                        {chip.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium block text-zinc-700 dark:text-zinc-300">Permissions (Comma separated)</label>
              <Input
                value={roleData.permissions}
                onChange={(e) => setRoleData(prev => ({ ...prev, permissions: e.target.value }))}
                placeholder="e.g. EMPLOYEE_READ, ORG_WRITE, or * for all"
                className="h-8 text-xs"
              />
              <p className="text-[10px] text-zinc-500 mt-1">Leave empty for basic employee access. Use * for full company admin access.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium block text-zinc-700 dark:text-zinc-300">Description</label>
              <textarea
                value={roleData.description}
                onChange={(e) => setRoleData(prev => ({ ...prev, description: e.target.value }))}
                className="flex min-h-[60px] w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                placeholder="Briefly describe what this role can do."
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Field({ label, value, onChange, ...props }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium block text-zinc-700 dark:text-zinc-300">{label}</label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="h-8 text-xs" {...props} />
    </div>
  );
}

function Modal({ title, onClose, onSubmit, children, busy }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-md border border-zinc-200/50 dark:border-zinc-800 flex flex-col max-h-[90vh]">
        <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center shrink-0">
          <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{title}</h2>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-zinc-600 p-1 rounded-md"><X size={16} /></button>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col min-h-0 flex-1">
          <div className="p-5 space-y-5 overflow-y-auto min-h-0">
            {children}
          </div>
          <div className="px-5 py-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3 shrink-0">
            <Button type="button" variant="outline" className="h-9 px-4 text-xs" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={busy} className="h-9 px-4 text-xs bg-indigo-600 hover:bg-indigo-700 text-white">{busy ? 'Saving...' : 'Save Role'}</Button>
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
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50 mb-2">{title}</h3>
          <p className="text-sm text-zinc-500 mb-6">{children}</p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
            <Button size="sm" disabled={busy} className="bg-rose-600 hover:bg-rose-700 text-white" onClick={onConfirm}>{busy ? 'Deleting...' : 'Delete Role'}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuditInfo({ item }: { item: any }) {
  if (!item) return null;
  const by = item.updatedBy || item.createdBy;
  const name = (by && by.firstName) ? `${by.firstName} ${by.lastName}` : 'System generated';
  const time = new Date(item.updatedAt || item.createdAt).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  return (
    <div>
      <div className="text-[11px] text-zinc-400">Updated by {name}</div>
      <div className="text-[10px] text-zinc-500 mt-0.5">{time}</div>
    </div>
  );
}
