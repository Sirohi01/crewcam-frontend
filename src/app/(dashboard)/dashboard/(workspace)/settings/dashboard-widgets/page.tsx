'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { ROLE_SCOPES } from '@/lib/roleScopes';
import { RolePicker } from '@/components/settings/RolePicker';

interface WidgetItem {
  _id: string;
  widgetKey: string;
  order: number;
  minScope: string;
  roleIds: Array<{ _id: string; name: string } | string>;
  isActive: boolean;
}

const widgetLabel = (key: string) => key.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');

export default function DashboardWidgetsPage() {
  const queryClient = useQueryClient();
  const { data: widgets, isLoading } = useQuery<WidgetItem[]>({
    queryKey: ['admin', 'dashboard-widgets'],
    queryFn: async () => (await api.get('/permissions/dashboard-config')).data,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<WidgetItem> }) =>
      (await api.put(`/permissions/dashboard-config/${id}`, payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard-widgets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'config'] });
    },
  });

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300 pb-6 max-w-[1100px] mx-auto">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <LayoutDashboard size={18} /> Dashboard Widgets
          </h1>
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-md">Who sees which widget on their dashboard</p>
        </div>
      </div>

      <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800">
        <CardHeader className="py-2.5">
          <CardTitle className="text-[13px]">Widgets</CardTitle>
          <p className="text-[11px] text-zinc-500">
            A widget shows by default to any role whose Scope meets its minimum (Self &lt; Team &lt; Department &lt; Branch &lt; Company).
            Use the role picker to also grant it to specific roles regardless of their scope.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-sm text-zinc-500 py-8 text-center">Loading...</div>
          ) : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {(widgets || [])
                .sort((a, b) => a.order - b.order)
                .map((item) => (
                  <WidgetRow key={item._id} item={item} onSave={(payload) => updateMutation.mutate({ id: item._id, payload })} saving={updateMutation.isPending} />
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function WidgetRow({ item, onSave, saving }: { item: WidgetItem; onSave: (payload: Partial<WidgetItem>) => void; saving: boolean }) {
  const initialRoleIds = (item.roleIds || []).map((r) => (typeof r === 'string' ? r : r._id));
  const [order, setOrder] = useState(item.order);
  const [minScope, setMinScope] = useState(item.minScope);
  const [roleIds, setRoleIds] = useState<string[]>(initialRoleIds);
  const [isActive, setIsActive] = useState(item.isActive);
  const dirty = order !== item.order || minScope !== item.minScope || isActive !== item.isActive || roleIds.join(',') !== initialRoleIds.join(',');

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 text-[12px]">
      <span className="w-48 shrink-0 font-medium text-zinc-800 dark:text-zinc-200 truncate">{widgetLabel(item.widgetKey)}</span>
      <Input
        type="number"
        value={order}
        onChange={(e) => setOrder(Number(e.target.value))}
        className="h-7 w-16 text-[12px]"
      />
      <select
        value={minScope}
        onChange={(e) => setMinScope(e.target.value)}
        className="h-7 text-[11px] border border-zinc-200 dark:border-zinc-700 rounded px-1.5 bg-transparent shrink-0"
      >
        {ROLE_SCOPES.map((s) => <option key={s.value} value={s.value}>{s.label}+</option>)}
      </select>
      <div className="flex-1">
        <RolePicker value={roleIds} onChange={setRoleIds} />
      </div>
      <label className="flex items-center gap-1 text-[10px] text-zinc-500 shrink-0">
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} /> Active
      </label>
      <Button
        size="sm"
        disabled={!dirty || saving}
        onClick={() => onSave({ order, minScope, roleIds: roleIds as any, isActive })}
        className="h-7 px-2 text-[11px] shrink-0"
      >
        {saving ? <Loader2 size={12} className="animate-spin" /> : 'Save'}
      </Button>
    </div>
  );
}
