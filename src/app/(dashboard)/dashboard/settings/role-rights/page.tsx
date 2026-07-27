'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Edit2, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

interface Role {
  _id: string;
  name: string;
  permissions: string[];
  isActive: boolean;
}

interface SidebarItem {
  _id: string;
  section: string;
  label: string;
  requiredPermission?: string;
  order: number;
}

export default function RoleRightsPage() {
  const queryClient = useQueryClient();
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  const { data: rolesRes, isLoading: loadingRoles } = useQuery({
    queryKey: ['companies', 'roles'],
    queryFn: async () => (await api.get('/companies/roles')).data,
  });
  const roles: Role[] = rolesRes?.data || [];

  const { data: sidebarItems, isLoading: loadingSidebar } = useQuery<SidebarItem[]>({
    queryKey: ['admin', 'sidebar-config'],
    queryFn: async () => (await api.get('/permissions/sidebar-config')).data,
  });

  const selectedRole = roles.find((r) => r._id === selectedRoleId);
  const [localPermissions, setLocalPermissions] = useState<string[]>([]);

  // When selected role changes, load its permissions into local state
  React.useEffect(() => {
    if (selectedRole) {
      setLocalPermissions(selectedRole.permissions || []);
    } else {
      setLocalPermissions([]);
    }
  }, [selectedRole]);

  const updateRole = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<Role> }) =>
      (await api.put(`/companies/roles/${id}`, payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies', 'roles'] });
      alert('Role rights saved successfully!');
      setSelectedRoleId(null);
      setLocalPermissions([]);
    },
  });

  const getBasePerm = (item: SidebarItem) => {
    if (item.requiredPermission) return item.requiredPermission.replace(/_READ|_WRITE|_DELETE/g, '');
    return item.label.toUpperCase().replace(/\s+/g, '_');
  };

  const hasPerm = (perm: string) => localPermissions.includes(perm);

  const togglePerm = (perm: string) => {
    setLocalPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleAllToggle = (basePerm: string, isChecked: boolean) => {
    const perms = [`${basePerm}_READ`, `${basePerm}_WRITE`, `${basePerm}_DELETE`];
    if (isChecked) {
      setLocalPermissions((prev) => Array.from(new Set([...prev, ...perms])));
    } else {
      setLocalPermissions((prev) => prev.filter((p) => !perms.includes(p)));
    }
  };

  const isAllChecked = (basePerm: string) => {
    const perms = [`${basePerm}_READ`, `${basePerm}_WRITE`, `${basePerm}_DELETE`];
    return perms.every((p) => localPermissions.includes(p));
  };

  const getSectionPerms = (section: string) => {
    return (groupedItems[section] || []).flatMap(item => {
      const basePerm = getBasePerm(item);
      return [`${basePerm}_READ`, `${basePerm}_WRITE`, `${basePerm}_DELETE`];
    });
  };

  const isSectionAllChecked = (section: string) => {
    const perms = getSectionPerms(section);
    return perms.length > 0 && perms.every(p => localPermissions.includes(p));
  };

  const handleSectionAllToggle = (section: string, isChecked: boolean) => {
    const perms = getSectionPerms(section);
    if (isChecked) {
      setLocalPermissions(prev => Array.from(new Set([...prev, ...perms])));
    } else {
      setLocalPermissions(prev => prev.filter(p => !perms.includes(p)));
    }
  };

  const getAllPerms = () => {
    return (sidebarItems || []).flatMap(item => {
      const basePerm = getBasePerm(item);
      return [`${basePerm}_READ`, `${basePerm}_WRITE`, `${basePerm}_DELETE`];
    });
  };

  const isGlobalAllChecked = () => {
    const perms = getAllPerms();
    return perms.length > 0 && perms.every(p => localPermissions.includes(p));
  };

  const handleGlobalAllToggle = (isChecked: boolean) => {
    const perms = getAllPerms();
    if (isChecked) {
      setLocalPermissions(prev => Array.from(new Set([...prev, ...perms])));
    } else {
      setLocalPermissions(prev => prev.filter(p => !perms.includes(p)));
    }
  };

  const handleSave = () => {
    if (selectedRole) {
      updateRole.mutate({ id: selectedRole._id, payload: { permissions: localPermissions } });
    }
  };

  const groupedItems = useMemo(() => {
    const groups: Record<string, SidebarItem[]> = {};
    (sidebarItems || []).forEach((item) => {
      const sec = item.section || 'MAIN';
      groups[sec] = groups[sec] || [];
      groups[sec].push(item);
    });
    return groups;
  }, [sidebarItems]);

  const sections = Object.keys(groupedItems).sort();

  return (
    <div className="flex flex-col gap-2 animate-in fade-in duration-300 p-2 w-full font-sans text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">Role Rights Management</h1>
          <p className="text-[13px] text-zinc-500 mt-1">Configure page access permissions for user roles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 mt-2">
        {/* LEFT PANE - Configured Roles Table */}
        <div className="xl:col-span-4 flex flex-col gap-3">
          <Card className="border-zinc-200/80 shadow-sm flex flex-col overflow-hidden">
            <CardHeader className="py-3 border-b border-zinc-100">
              <CardTitle className="text-[13px] font-semibold text-zinc-900">Configured Role Rights</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              {loadingRoles ? (
                <div className="p-8 text-center text-sm text-zinc-500">Loading roles...</div>
              ) : (
                <table className="w-full text-[13px] text-left">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-3 py-2 font-semibold text-zinc-900 w-12 border-b border-zinc-100">S.No</th>
                      <th className="px-3 py-2 font-semibold text-zinc-900 border-b border-zinc-100">Role</th>
                      <th className="px-3 py-2 font-semibold text-zinc-900 border-b border-zinc-100 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100/80">
                    {roles.filter(r => r.isActive).map((role, index) => (
                      <tr key={role._id} className="hover:bg-zinc-50/50 transition-colors bg-white">
                        <td className="px-3 py-2 text-zinc-500">{index + 1}.</td>
                        <td className="px-3 py-2 font-medium text-zinc-800">
                          <div>{role.name}</div>
                          <div className="text-[11px] text-zinc-500 font-normal mt-0.5">
                            {role.permissions?.includes('*') || role.permissions?.includes('SUPER_ADMIN')
                              ? 'All Pages Accessible'
                              : `${Math.ceil((role.permissions?.length || 0) / 3)} Pages Accessible`}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button onClick={() => setSelectedRoleId(role._id)} className="text-zinc-900 hover:text-zinc-700 transition-colors" title="Edit Rights">
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to clear all permissions for the role "${role.name}"?`)) {
                                  updateRole.mutate({ id: role._id, payload: { permissions: [] } });
                                }
                              }}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Clear All Rights"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT PANE - Add Role Rights */}
        <div className="xl:col-span-8 flex flex-col gap-3">
          <Card className="border-zinc-200/80 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between py-3 border-b border-zinc-100">
              <CardTitle className="text-[13px] font-semibold text-zinc-900">Add Role Rights</CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-medium text-zinc-700">Select Role <span className="text-red-500">*</span></span>
                  <select
                    value={selectedRoleId || ''}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                    className="h-8 w-48 text-[12px] flex rounded-md border border-zinc-200 bg-white px-2 py-1 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="" disabled>-- Select Role --</option>
                    {roles.map((role) => (
                      <option key={role._id} value={role._id} className="text-[12px]">{role.name}</option>
                    ))}
                  </select>
                </div>
                {selectedRoleId && (
                  <div className="flex items-center gap-2 pl-2 border-l border-zinc-200">
                    <Button variant="outline" size="sm" className="h-8 text-[12px] px-4 rounded-md text-zinc-700 border-zinc-200" onClick={() => { setSelectedRoleId(null); setLocalPermissions([]); }}>Cancel</Button>
                    <Button
                      size="sm"
                      className="h-8 text-[12px] px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-md font-medium"
                      disabled={!selectedRoleId || updateRole.isPending}
                      onClick={handleSave}
                    >
                      {updateRole.isPending ? <Loader2 size={14} className="animate-spin" /> : 'Save Rights'}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              {loadingSidebar ? (
                <div className="p-8 text-center text-sm text-zinc-500">Loading modules...</div>
              ) : (
                <div className="min-w-[700px]">
                  <table className="w-full text-[13px] text-left">
                    <thead className="bg-white border-b border-zinc-100">
                      <tr>
                        <th className="px-3 py-2 font-semibold text-zinc-900 border-b border-zinc-100">Page / Module</th>
                        <th className="px-3 py-2 font-semibold text-zinc-900 border-b border-zinc-100 text-center w-20">Read</th>
                        <th className="px-3 py-2 font-semibold text-zinc-900 border-b border-zinc-100 text-center w-20">Write</th>
                        <th className="px-3 py-2 font-semibold text-zinc-900 border-b border-zinc-100 text-center w-20">Delete</th>
                        <th className="px-3 py-2 font-semibold text-zinc-900 border-b border-zinc-100 text-center w-20">
                          <div className="flex flex-col items-center gap-1">
                            <span>All</span>
                            <input
                              type="checkbox"
                              className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                              disabled={!selectedRoleId}
                              checked={isGlobalAllChecked()}
                              onChange={(e) => handleGlobalAllToggle(e.target.checked)}
                              title="Select All Permissions"
                            />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {sections.map((section) => (
                        <React.Fragment key={section}>
                          <tr className="bg-zinc-50/50">
                            <td colSpan={4} className="px-3 py-2 font-semibold text-zinc-900 uppercase text-[11px] tracking-wider">
                              {section}
                            </td>
                            <td className="px-3 py-2 text-center">
                              <input
                                type="checkbox"
                                className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                disabled={!selectedRoleId}
                                checked={isSectionAllChecked(section)}
                                onChange={(e) => handleSectionAllToggle(section, e.target.checked)}
                                title={`Select all in ${section}`}
                              />
                            </td>
                          </tr>
                          {groupedItems[section]
                            .sort((a, b) => a.order - b.order)
                            .map((item) => {
                              const basePerm = getBasePerm(item);
                              return (
                                <tr key={item._id} className="hover:bg-zinc-50/30 transition-colors bg-white">
                                  <td className="px-3 py-2 font-medium text-zinc-800 pl-8">{item.label}</td>
                                  <td className="px-3 py-2 text-center">
                                    <input
                                      type="checkbox"
                                      className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                      disabled={!selectedRoleId}
                                      checked={hasPerm(`${basePerm}_READ`)}
                                      onChange={() => togglePerm(`${basePerm}_READ`)}
                                    />
                                  </td>
                                  <td className="px-3 py-2 text-center">
                                    <input
                                      type="checkbox"
                                      className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                      disabled={!selectedRoleId}
                                      checked={hasPerm(`${basePerm}_WRITE`)}
                                      onChange={() => togglePerm(`${basePerm}_WRITE`)}
                                    />
                                  </td>
                                  <td className="px-3 py-2 text-center">
                                    <input
                                      type="checkbox"
                                      className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                      disabled={!selectedRoleId}
                                      checked={hasPerm(`${basePerm}_DELETE`)}
                                      onChange={() => togglePerm(`${basePerm}_DELETE`)}
                                    />
                                  </td>
                                  <td className="px-3 py-2 text-center">
                                    <input
                                      type="checkbox"
                                      className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                      disabled={!selectedRoleId}
                                      checked={isAllChecked(basePerm)}
                                      onChange={(e) => handleAllToggle(basePerm, e.target.checked)}
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="p-3 flex justify-end gap-3 border-t border-zinc-100 bg-white">
                <Button variant="outline" size="sm" className="h-8 text-[12px] px-4 rounded-md text-zinc-700 border-zinc-200" onClick={() => { setSelectedRoleId(null); setLocalPermissions([]); }}>Cancel</Button>
                <Button
                  size="sm"
                  className="h-8 text-[12px] px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-md font-medium"
                  disabled={!selectedRoleId || updateRole.isPending}
                  onClick={handleSave}
                >
                  {updateRole.isPending ? <Loader2 size={14} className="animate-spin" /> : 'Save Rights'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
