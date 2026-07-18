'use client';

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Loader2, Search } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { ROLE_SCOPES } from '@/lib/roleScopes';

interface PermissionCatalogEntry { name: string; module: string; }
interface Role { _id: string; name: string; scope: string; permissions: string[]; isActive: boolean; }

export default function UserRolePage() {
  const [tab, setTab] = useState<'matrix' | 'overrides'>('matrix');

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300 pb-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <ShieldCheck size={18} /> User Role
          </h1>
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-md">Permission matrix &amp; per-employee overrides</p>
        </div>
        <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/50 rounded p-0.5">
          <button onClick={() => setTab('matrix')} className={`px-2.5 py-1 text-[11px] font-medium rounded ${tab === 'matrix' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100' : 'text-zinc-500'}`}>Permission Matrix</button>
          <button onClick={() => setTab('overrides')} className={`px-2.5 py-1 text-[11px] font-medium rounded ${tab === 'overrides' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100' : 'text-zinc-500'}`}>Employee Overrides</button>
        </div>
      </div>

      {tab === 'matrix' ? <PermissionMatrix /> : <EmployeeOverrides />}
    </div>
  );
}

function PermissionMatrix() {
  const queryClient = useQueryClient();
  const { data: catalog } = useQuery<PermissionCatalogEntry[]>({
    queryKey: ['permissions', 'catalog'],
    queryFn: async () => (await api.get('/permissions/catalog')).data,
  });
  const { data: rolesRes, isLoading } = useQuery({
    queryKey: ['companies', 'roles'],
    queryFn: async () => (await api.get('/companies/roles')).data,
  });
  const roles: Role[] = rolesRes?.data || [];

  const updateRole = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<Role> }) =>
      (await api.put(`/companies/roles/${id}`, payload)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['companies', 'roles'] }),
  });

  const grouped = useMemo(() => {
    const byModule: Record<string, PermissionCatalogEntry[]> = {};
    (catalog || []).forEach((p) => {
      byModule[p.module] = byModule[p.module] || [];
      byModule[p.module].push(p);
    });
    return byModule;
  }, [catalog]);

  const togglePermission = (role: Role, permission: string) => {
    const has = role.permissions.includes(permission);
    const next = has ? role.permissions.filter((p) => p !== permission) : [...role.permissions, permission];
    updateRole.mutate({ id: role._id, payload: { permissions: next } });
  };

  const changeScope = (role: Role, scope: string) => {
    updateRole.mutate({ id: role._id, payload: { scope } as any });
  };

  if (isLoading) return <div className="text-sm text-zinc-500 py-8 text-center">Loading roles...</div>;

  return (
    <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 overflow-x-auto">
      <CardContent className="p-0">
        <table className="text-[11px] w-full">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800">
              <th className="text-left px-3 py-2 sticky left-0 bg-white dark:bg-zinc-900">Permission</th>
              {roles.map((role) => (
                <th key={role._id} className="px-3 py-2 text-left min-w-[140px]">
                  <div className="font-md text-zinc-900 dark:text-zinc-100">{role.name}</div>
                  <select
                    value={role.scope}
                    onChange={(e) => changeScope(role, e.target.value)}
                    className="mt-1 text-[10px] border border-zinc-200 dark:border-zinc-700 rounded px-1 py-0.5 bg-transparent"
                  >
                    {ROLE_SCOPES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(grouped).map(([moduleName, perms]) => (
              <React.Fragment key={moduleName}>
                <tr className="bg-zinc-50/80 dark:bg-zinc-900/50">
                  <td colSpan={roles.length + 1} className="px-3 py-1 font-md text-zinc-500 uppercase tracking-wider text-[10px]">{moduleName}</td>
                </tr>
                {perms.map((perm) => (
                  <tr key={perm.name} className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                    <td className="px-3 py-1.5 sticky left-0 bg-white dark:bg-zinc-900 font-mono text-[10px]">{perm.name}</td>
                    {roles.map((role) => (
                      <td key={role._id} className="px-3 py-1.5 text-center">
                        <input
                          type="checkbox"
                          checked={role.permissions.includes(perm.name)}
                          onChange={() => togglePermission(role, perm.name)}
                          disabled={updateRole.isPending}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function EmployeeOverrides() {
  const [employeeId, setEmployeeId] = useState('');
  const [lookupId, setLookupId] = useState('');
  const [grants, setGrants] = useState('');
  const [revokes, setRevokes] = useState('');
  const [reason, setReason] = useState('');

  const { data: effective, isLoading, refetch } = useQuery({
    queryKey: ['permissions', 'effective', lookupId],
    queryFn: async () => (await api.get(`/permissions/effective/${lookupId}`)).data,
    enabled: !!lookupId,
  });

  const saveOverride = useMutation({
    mutationFn: async () =>
      (await api.put(`/permissions/overrides/${lookupId}`, {
        grants: grants.split(',').map((s) => s.trim()).filter(Boolean),
        revokes: revokes.split(',').map((s) => s.trim()).filter(Boolean),
        reason,
      })).data,
    onSuccess: () => refetch(),
  });

  return (
    <div className="flex flex-col gap-3">
      <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800">
        <CardHeader className="py-3">
          <CardTitle className="text-[13px]">Look up an employee</CardTitle>
          <CardDescription className="text-[11px]">Paste their User ID to view and edit their permission overrides.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} placeholder="Employee (User) ID" className="h-8 text-[12px]" />
          <Button size="sm" className="h-8" onClick={() => setLookupId(employeeId)}>
            <Search size={12} className="mr-1" /> Look up
          </Button>
        </CardContent>
      </Card>

      {isLoading && <div className="text-sm text-zinc-500">Loading...</div>}

      {effective && (
        <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800">
          <CardHeader className="py-3">
            <CardTitle className="text-[13px]">
              Role: {effective.roleName || 'Unassigned'} ({effective.roleScope})
            </CardTitle>
            <CardDescription className="text-[11px]">
              Effective permissions: {effective.effectivePermissions.join(', ') || 'none'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <label className="text-[11px] font-medium">Grant extra permissions (comma-separated)</label>
            <Input value={grants} onChange={(e) => setGrants(e.target.value)} placeholder="e.g. FINANCE_READ, ATS_WRITE" className="h-8 text-[12px]" />

            <label className="text-[11px] font-medium mt-2">Revoke permissions from their role (comma-separated)</label>
            <Input value={revokes} onChange={(e) => setRevokes(e.target.value)} placeholder="e.g. EMPLOYEE_WRITE" className="h-8 text-[12px]" />

            <label className="text-[11px] font-medium mt-2">Reason (required, kept on the audit trail)</label>
            <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Why is this override being made?" className="h-8 text-[12px]" />

            <Button
              size="sm"
              className="h-8 w-fit mt-2"
              disabled={!reason || saveOverride.isPending}
              onClick={() => saveOverride.mutate()}
            >
              {saveOverride.isPending ? <Loader2 size={12} className="animate-spin mr-1" /> : null}
              Save Override
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
