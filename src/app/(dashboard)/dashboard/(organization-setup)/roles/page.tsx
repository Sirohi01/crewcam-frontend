// 'use client';
// import React, { useEffect, useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Edit2, Plus, Search, Trash2, X } from 'lucide-react';
// import api from '@/lib/axios';
// import { ROLE_SCOPES, getRoleScopeLabel } from '@/lib/roleScopes';
// import { LOGIN_TYPES, ROLE_PRESET_GROUPS, EMPLOYER_PERMISSION_CHIPS, RolePreset } from '@/lib/rolePresets';

// type Role = { _id: string; name: string; description: string; scope: string; loginType: string; permissions: string[]; createdAt: string; updatedAt: string; createdBy?: any; updatedBy?: any; };

// const emptyRole = { name: '', description: '', scope: 'self', loginType: 'employee', permissions: '' };

// export default function RolesPage() {
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState('');
//   const [modal, setModal] = useState<boolean>(false);
//   const [modalItem, setModalItem] = useState<any>(null);
//   const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
//   const [roleData, setRoleData] = useState(emptyRole);

//   const [search, setSearch] = useState('');

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const res = await api.get('/companies/roles');
//       setRoles(res.data.data || []);
//     } catch (e: any) {
//       setError(e.response?.data?.message || 'Failed to load roles');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openCreate = () => {
//     setError('');
//     setRoleData(emptyRole);
//     setModalItem(null);
//     setModal(true);
//   };

//   const openEdit = (item: any) => {
//     setError('');
//     setRoleData({
//       name: item.name || '',
//       description: item.description || '',
//       scope: item.scope || 'self',
//       loginType: item.loginType || 'employee',
//       permissions: Array.isArray(item.permissions) ? item.permissions.join(', ') : ''
//     });
//     setModalItem(item);
//     setModal(true);
//   };

//   const applyPreset = (preset: RolePreset) => {
//     setRoleData({
//       name: preset.name,
//       description: '',
//       scope: preset.scope,
//       loginType: preset.loginType,
//       permissions: preset.permissions.join(', '),
//     });
//   };

//   const togglePermissionChip = (permissions: string[]) => {
//     setRoleData((prev) => {
//       const current = new Set(prev.permissions.split(',').map((p) => p.trim()).filter(Boolean));
//       const allPresent = permissions.every((p) => current.has(p));
//       permissions.forEach((p) => (allPresent ? current.delete(p) : current.add(p)));
//       return { ...prev, permissions: Array.from(current).join(', ') };
//     });
//   };

//   const submit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);
//     setError('');
//     try {
//       const payload = {
//         ...roleData,
//         permissions: roleData.permissions.split(',').map(p => p.trim()).filter(Boolean)
//       };
//       if (modalItem?._id) {
//         await api.put(`/companies/roles/${modalItem._id}`, payload);
//       } else {
//         await api.post('/companies/roles', payload);
//       }
//       setModal(false);
//       await fetchData();
//     } catch (e: any) {
//       setError(e.response?.data?.message || 'Save failed');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const executeDelete = async () => {
//     if (!deleteConfirm) return;
//     setSaving(true);
//     setError('');
//     try {
//       await api.delete(`/companies/roles/${deleteConfirm.id}`);
//       setDeleteConfirm(null);
//       await fetchData();
//     } catch (e: any) {
//       setError(e.response?.data?.message || 'Delete failed');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const filteredRoles = roles.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || (r.description || '').toLowerCase().includes(search.toLowerCase()));

//   return (
//     <div className="flex flex-col gap-4 animate-in fade-in duration-300 pb-6 max-w-[1200px] mx-auto">
//       <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
//         <div>
//           <h1 className="text-lg font-medium tracking-tight text-zinc-900 dark:text-zinc-50">Manage Roles</h1>
//           <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium">Access permissions and user roles</p>
//         </div>
//         <Button onClick={openCreate} className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
//           <Plus size={14} className="mr-1" /> Add Role
//         </Button>
//       </div>

//       {error && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}

//       <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800">
//         <CardHeader className="py-3 px-4 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
//           <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
//             <CardTitle className="text-[13px] text-zinc-800 dark:text-zinc-200">Role Directory</CardTitle>
//             <div className="relative w-full sm:w-64">
//               <Search className="absolute left-2.5 top-1.5 h-3.5 w-3.5 text-zinc-400" />
//               <Input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search roles..."
//                 className="h-7 pl-8 text-xs bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-indigo-500/20"
//               />
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent className="p-0">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left text-sm whitespace-nowrap">
//               <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-xs text-zinc-500 font-medium">
//                 <tr>
//                   <th className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800">Role Name</th>
//                   <th className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800">Login Type</th>
//                   <th className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800">Scope</th>
//                   <th className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800">Description</th>
//                   <th className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800">Last Modified</th>
//                   <th className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800 w-16"></th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
//                 {loading && <tr><td colSpan={6} className="p-8 text-center text-sm text-zinc-500">Loading...</td></tr>}
//                 {!loading && filteredRoles.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-sm text-zinc-500">No roles found.</td></tr>}
//                 {!loading && filteredRoles.map((item) => (
//                   <tr key={item._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group">
//                     <td className="px-5 py-3 font-medium text-zinc-900 dark:text-zinc-100">{item.name}</td>
//                     <td className="px-5 py-3">
//                       <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium ${item.loginType === 'employer' ? 'bg-amber-50 text-amber-700' : 'bg-sky-50 text-sky-700'}`}>
//                         {item.loginType === 'employer' ? 'Employer' : 'Employee'}
//                       </span>
//                     </td>
//                     <td className="px-5 py-3 text-zinc-600 dark:text-zinc-400">
//                       <span className="inline-flex rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700">
//                         {getRoleScopeLabel(item.scope)}
//                       </span>
//                     </td>
//                     <td className="px-5 py-3 text-zinc-600 dark:text-zinc-400 whitespace-normal min-w-[200px] text-xs">
//                       {item.description || '-'}
//                     </td>
//                     <td className="px-5 py-3">
//                       <AuditInfo item={item} />
//                     </td>
//                     <td className="px-5 py-3 align-middle text-center">
//                       <div className="flex justify-end gap-1">
//                         <button onClick={() => openEdit(item)} className="text-zinc-400 hover:bg-zinc-200 hover:text-indigo-600 p-1.5 rounded-md transition-colors border border-transparent hover:border-zinc-300">
//                           <Edit2 size={14} />
//                         </button>
//                         <button onClick={() => setDeleteConfirm({ id: item._id, name: item.name })} className="text-zinc-400 hover:bg-rose-100 hover:text-rose-600 p-1.5 rounded-md transition-colors border border-transparent hover:border-rose-300">
//                           <Trash2 size={14} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>

//       {deleteConfirm && (
//         <ConfirmModal title={`Delete ${deleteConfirm.name}?`} busy={saving} onCancel={() => setDeleteConfirm(null)} onConfirm={executeDelete}>
//           This will deactivate the role. Users with this role may lose access to the system.
//         </ConfirmModal>
//       )}

//       {modal && (
//         <Modal title={`${modalItem ? 'Edit' : 'Create'} Role`} onClose={() => setModal(false)} onSubmit={submit} busy={saving}>
//           <div className="space-y-4">
//             {!modalItem && (
//               <div className="space-y-1.5">
//                 <label className="text-xs font-medium block text-zinc-700 dark:text-zinc-300">Quick presets</label>
//                 <div className="space-y-2">
//                   {ROLE_PRESET_GROUPS.map((g) => (
//                     <div key={g.group}>
//                       <p className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1">{g.group}</p>
//                       <div className="flex flex-wrap gap-1.5">
//                         {g.roles.map((preset) => (
//                           <button
//                             key={preset.name}
//                             type="button"
//                             onClick={() => applyPreset(preset)}
//                             className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${roleData.name === preset.name ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}
//                           >
//                             {preset.name}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <p className="text-[10px] text-zinc-500 mt-1">Or just type your own role name below — these are only starting points.</p>
//               </div>
//             )}

//             <Field label="Role Name" value={roleData.name} onChange={(val: string) => setRoleData(prev => ({ ...prev, name: val }))} placeholder="e.g. Finance Admin" required />

//             <div className="space-y-1.5">
//               <label className="text-xs font-medium block text-zinc-700 dark:text-zinc-300">Login Type</label>
//               <select
//                 value={roleData.loginType}
//                 onChange={(e) => setRoleData(prev => ({ ...prev, loginType: e.target.value }))}
//                 className="flex h-8 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
//                 required
//               >
//                 {LOGIN_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
//               </select>
//               <p className="text-[10px] text-zinc-500">Which company-portal login screen users with this role sign in through.</p>
//             </div>

//             <div className="space-y-1.5">
//               <label className="text-xs font-medium block text-zinc-700 dark:text-zinc-300">Scope</label>
//               <select
//                 value={roleData.scope}
//                 onChange={(e) => setRoleData(prev => ({ ...prev, scope: e.target.value }))}
//                 className="flex h-8 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
//                 required
//               >
//                 {ROLE_SCOPES.map((s) => <option key={s.value} value={s.value}>{s.label} — {s.hint}</option>)}
//               </select>
//               <p className="text-[10px] text-zinc-500">How much company data this role can see — separate from Login Type.</p>
//             </div>

//             {roleData.loginType === 'employer' && (
//               <div className="space-y-1.5">
//                 <label className="text-xs font-medium block text-zinc-700 dark:text-zinc-300">Add permissions</label>
//                 <div className="flex flex-wrap gap-1.5">
//                   {EMPLOYER_PERMISSION_CHIPS.map((chip) => {
//                     const current = roleData.permissions.split(',').map((p) => p.trim());
//                     const active = chip.permissions.every((p) => current.includes(p));
//                     return (
//                       <button
//                         key={chip.label}
//                         type="button"
//                         onClick={() => togglePermissionChip(chip.permissions)}
//                         className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${active ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}
//                       >
//                         {chip.label}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}

//             <div className="space-y-1.5">
//               <label className="text-xs font-medium block text-zinc-700 dark:text-zinc-300">Permissions (Comma separated)</label>
//               <Input
//                 value={roleData.permissions}
//                 onChange={(e) => setRoleData(prev => ({ ...prev, permissions: e.target.value }))}
//                 placeholder="e.g. EMPLOYEE_READ, ORG_WRITE, or * for all"
//                 className="h-8 text-xs"
//               />
//               <p className="text-[10px] text-zinc-500 mt-1">Leave empty for basic employee access. Use * for full company admin access.</p>
//             </div>

//             <div className="space-y-1.5">
//               <label className="text-xs font-medium block text-zinc-700 dark:text-zinc-300">Description</label>
//               <textarea
//                 value={roleData.description}
//                 onChange={(e) => setRoleData(prev => ({ ...prev, description: e.target.value }))}
//                 className="flex min-h-[60px] w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
//                 placeholder="Briefly describe what this role can do."
//               />
//             </div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// }

// function Field({ label, value, onChange, ...props }: any) {
//   return (
//     <div className="space-y-1.5">
//       <label className="text-xs font-medium block text-zinc-700 dark:text-zinc-300">{label}</label>
//       <Input value={value} onChange={(e) => onChange(e.target.value)} className="h-8 text-xs" {...props} />
//     </div>
//   );
// }

// function Modal({ title, onClose, onSubmit, children, busy }: any) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
//       <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-md border border-zinc-200/50 dark:border-zinc-800 flex flex-col max-h-[90vh]">
//         <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center shrink-0">
//           <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{title}</h2>
//           <button type="button" onClick={onClose} className="text-zinc-400 hover:text-zinc-600 p-1 rounded-md"><X size={16} /></button>
//         </div>
//         <form onSubmit={onSubmit} className="flex flex-col min-h-0 flex-1">
//           <div className="p-5 space-y-5 overflow-y-auto min-h-0">
//             {children}
//           </div>
//           <div className="px-5 py-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3 shrink-0">
//             <Button type="button" variant="outline" className="h-9 px-4 text-xs" onClick={onClose}>Cancel</Button>
//             <Button type="submit" disabled={busy} className="h-9 px-4 text-xs bg-indigo-600 hover:bg-indigo-700 text-white">{busy ? 'Saving...' : 'Save Role'}</Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// function ConfirmModal({ title, children, onCancel, onConfirm, busy }: any) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm">
//       <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-sm border border-zinc-200/50 dark:border-zinc-800">
//         <div className="p-5">
//           <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50 mb-2">{title}</h3>
//           <p className="text-sm text-zinc-500 mb-6">{children}</p>
//           <div className="flex justify-end gap-3">
//             <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
//             <Button size="sm" disabled={busy} className="bg-rose-600 hover:bg-rose-700 text-white" onClick={onConfirm}>{busy ? 'Deleting...' : 'Delete Role'}</Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function AuditInfo({ item }: { item: any }) {
//   if (!item) return null;
//   const by = item.updatedBy || item.createdBy;
//   const name = (by && by.firstName) ? `${by.firstName} ${by.lastName}` : 'System generated';
//   const time = new Date(item.updatedAt || item.createdAt).toLocaleString('en-IN', {
//     day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
//   });
//   return (
//     <div>
//       <div className="text-[11px] text-zinc-400">Updated by {name}</div>
//       <div className="text-[10px] text-zinc-500 mt-0.5">{time}</div>
//     </div>
//   );
// }
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Edit2, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

interface Role {
  _id: string;
  name: string;
  description?: string;
  scope: string;
  isActive: boolean;
  updatedAt?: string;
  updatedBy?: { name: string } | string;
}

export default function RoleManagementPage() {
  const queryClient = useQueryClient();
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    scope: 'TENANT_ALL',
    isActive: true,
  });

  const { data: rolesRes, isLoading } = useQuery({
    queryKey: ['companies', 'roles'],
    queryFn: async () => (await api.get('/companies/roles')).data,
  });
  const roles: Role[] = rolesRes?.data || [];

  const createMutation = useMutation({
    mutationFn: async (payload: Partial<Role>) =>
      (await api.post('/companies/roles', payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies', 'roles'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<Role> }) =>
      (await api.put(`/companies/roles/${id}`, payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies', 'roles'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) =>
      (await api.delete(`/companies/roles/${id}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies', 'roles'] });
    },
  });

  const resetForm = () => {
    setEditId(null);
    setFormData({
      name: '',
      description: '',
      scope: 'TENANT_ALL',
      isActive: true,
    });
  };

  const handleEdit = (role: Role) => {
    setEditId(role._id);
    setFormData({
      name: role.name,
      description: role.description || '',
      scope: role.scope || 'TENANT_ALL',
      isActive: role.isActive,
    });
  };

  const handleSave = () => {
    if (editId) {
      updateMutation.mutate({ id: editId, payload: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  // Pagination & Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus ? (filterStatus === 'active' ? role.isActive : !role.isActive) : true;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredRoles.length / pageSize);
  const paginatedRoles = filteredRoles.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize, filterStatus]);

  return (
    <div className="flex flex-col gap-2 animate-in fade-in duration-300 p-2 w-full font-sans text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">Role Management</h1>
          <p className="text-[13px] text-zinc-500 mt-1">Manage all role types used across the platform</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 mt-2">

        {/* LEFT PANE - Add/Edit Form */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <Card className="border-zinc-200/80 shadow-sm overflow-hidden">
            <CardHeader className="pb-3 border-b border-zinc-100">
              <CardTitle className="text-[13px] font-semibold text-zinc-900">
                {editId ? 'Edit Role' : 'Add New Role'}
              </CardTitle>
              <p className="text-[12px] text-zinc-500 mt-1">
                {editId ? 'Update role details' : 'Create a new role type'}
              </p>
            </CardHeader>
            <CardContent className="pt-2 flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-zinc-900">Role Name <span className="text-red-500">*</span></label>
                <Input
                  placeholder="Enter role name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-8 text-[12px] border-zinc-200 focus-visible:ring-zinc-900/20"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-zinc-900">Description (Optional)</label>
                <textarea
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-[80px] text-[12px] p-2 rounded-md border border-zinc-200 bg-white shadow-sm placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900/20 resize-y"
                />
              </div>

              <div className="flex flex-col gap-1 mt-1">
                <label className="text-[12px] font-medium text-zinc-900">Status <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.isActive}
                      onChange={() => setFormData({ ...formData, isActive: true })}
                      className="text-zinc-900 focus:ring-zinc-900 w-3 h-3"
                    />
                    <span className="text-[12px] text-zinc-700">Active</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={!formData.isActive}
                      onChange={() => setFormData({ ...formData, isActive: false })}
                      className="text-zinc-900 focus:ring-zinc-900 w-3 h-3"
                    />
                    <span className="text-[12px] text-zinc-700">Inactive</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button variant="outline" onClick={resetForm} className="h-8 text-[12px] px-4 rounded-md border-zinc-200 text-zinc-600">
                  Cancel
                </Button>
                <Button
                  className="h-8 text-[12px] px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-md font-medium"
                  onClick={handleSave}
                  disabled={!formData.name || createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) ? <Loader2 size={14} className="animate-spin" /> : editId ? 'Update Role' : 'Save Role'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT PANE - List */}
        <div className="lg:col-span-9 flex flex-col gap-4">
          <Card className="border-zinc-200/80 shadow-sm h-full flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-zinc-100">
              <div>
                <CardTitle className="text-[13px] font-semibold text-zinc-900">Role List</CardTitle>
                <p className="text-[11px] text-zinc-500 mt-0.5">All roles in the system</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Input
                    placeholder="Search role..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 w-64 text-[13px] pl-9 border-zinc-200 focus-visible:ring-zinc-900/20"
                  />
                  <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                </div>
                <Button
                  variant={showFilters ? "default" : "outline"}
                  onClick={() => setShowFilters(!showFilters)}
                  className={`h-9 px-4 text-[13px] flex items-center gap-2 ${showFilters ? 'bg-zinc-900 text-white hover:bg-zinc-800 border-zinc-900' : 'border-zinc-200'}`}
                >
                  <FilterIcon className="h-3.5 w-3.5" /> Filter
                </Button>
              </div>
            </CardHeader>

            {showFilters && (
              <div className="flex items-center gap-5 px-6 py-3 border-b border-zinc-100 bg-zinc-50/50 text-[12px]">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-zinc-600">Status:</span>
                  <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="h-7 border border-zinc-200 rounded px-2 bg-white outline-none focus:border-zinc-900"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                {filterStatus && (
                  <button
                    onClick={() => { setFilterStatus(''); }}
                    className="text-red-500 hover:text-red-700 ml-auto font-medium"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}

            <CardContent className="p-0 flex-1 overflow-x-auto">
              {isLoading ? (
                <div className="p-12 text-center text-sm text-zinc-500">Loading roles...</div>
              ) : (
                <div className="min-w-full">
                  <table className="w-full text-[13px] text-left">
                    <thead className="bg-white border-b border-zinc-100">
                      <tr>
                        <th className="px-3 py-2 font-semibold text-zinc-900 w-16">#</th>
                        <th className="px-3 py-2 font-semibold text-zinc-900">Role Name</th>
                        <th className="px-3 py-2 font-semibold text-zinc-900">Status</th>
                        <th className="px-3 py-2 font-semibold text-zinc-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100/80">
                      {paginatedRoles.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">No roles found.</td>
                        </tr>
                      ) : (
                        paginatedRoles.map((role, index) => (
                          <tr key={role._id} className="hover:bg-zinc-50/50 transition-colors bg-white whitespace-nowrap">
                            <td className="px-3 py-2 text-zinc-500">{(currentPage - 1) * pageSize + index + 1}</td>
                            <td className="px-3 py-2 font-medium text-zinc-800">{role.name}</td>
                            <td className="px-3 py-2">
                              <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium ${role.isActive ? 'bg-green-100/60 text-green-700' : 'bg-red-100/60 text-red-600'}`}>
                                {role.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-3 py-2">
                              <div className="flex items-center gap-4">
                                <button onClick={() => handleEdit(role)} className="text-zinc-900 hover:text-zinc-700 transition-colors">
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
                                      deleteMutation.mutate(role._id);
                                    }
                                  }}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
            {/* Pagination */}
            {!isLoading && filteredRoles.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 bg-white">
                <div className="flex items-center gap-3 text-[13px] text-zinc-500">
                  <span>Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredRoles.length)} of {filteredRoles.length} roles</span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="h-8 rounded-md border border-zinc-200 bg-white px-2 py-1 text-[13px] outline-none focus:border-zinc-900"
                  >
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                  </select>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="h-8 w-8 p-0 text-[12px] border-zinc-200">&laquo;</Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="h-8 w-8 p-0 text-[12px] border-zinc-200">&lsaquo;</Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .map((page, i, arr) => (
                      <React.Fragment key={page}>
                        {i > 0 && arr[i - 1] !== page - 1 && <span className="px-2 text-zinc-400">...</span>}
                        <Button
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={`h-8 w-8 p-0 text-[12px] ${currentPage === page ? 'bg-zinc-900 text-white hover:bg-zinc-800 border-zinc-900' : 'border-zinc-200'}`}
                        >
                          {page}
                        </Button>
                      </React.Fragment>
                    ))}
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="h-8 w-8 p-0 text-[12px] border-zinc-200">&rsaquo;</Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="h-8 w-8 p-0 text-[12px] border-zinc-200">&raquo;</Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

// Simple icons to avoid missing imports
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function FilterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}
