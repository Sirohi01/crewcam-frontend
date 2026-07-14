'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ListTree, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { RolePicker } from '@/components/settings/RolePicker';

interface SidebarItem {
  _id: string;
  section: string;
  label: string;
  href: string;
  order: number;
  requiredPermission?: string;
  requiredFeature?: string;
  roleIds: Array<{ _id: string; name: string } | string>;
  isActive: boolean;
}

export default function SidebarConfigPage() {
  const queryClient = useQueryClient();
  const { data: items, isLoading } = useQuery<SidebarItem[]>({
    queryKey: ['admin', 'sidebar-config'],
    queryFn: async () => (await api.get('/permissions/sidebar-config')).data,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<SidebarItem> }) =>
      (await api.put(`/permissions/sidebar-config/${id}`, payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'sidebar-config'] });
      queryClient.invalidateQueries({ queryKey: ['sidebar', 'mine'] });
    },
  });

  const sections: { section: string; items: SidebarItem[] }[] = [];
  (items || []).forEach((item) => {
    let group = sections.find((s) => s.section === item.section);
    if (!group) {
      group = { section: item.section, items: [] };
      sections.push(group);
    }
    group.items.push(item);
  });

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300 pb-6 max-w-[1100px] mx-auto">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <ListTree size={18} /> Side Bar List
          </h1>
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-md">Who sees what in the sidebar</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-sm text-zinc-500 py-8 text-center">Loading...</div>
      ) : (
        sections.map((group) => (
          <Card key={group.section} className="border-zinc-200/80 shadow-sm dark:border-zinc-800">
            <CardHeader className="py-2.5">
              <CardTitle className="text-[13px]">{group.section}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {group.items
                  .sort((a, b) => a.order - b.order)
                  .map((item) => (
                    <SidebarRow key={item._id} item={item} onSave={(payload) => updateMutation.mutate({ id: item._id, payload })} saving={updateMutation.isPending} />
                  ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

function SidebarRow({ item, onSave, saving }: { item: SidebarItem; onSave: (payload: Partial<SidebarItem>) => void; saving: boolean }) {
  const initialRoleIds = (item.roleIds || []).map((r) => (typeof r === 'string' ? r : r._id));
  const [label, setLabel] = useState(item.label);
  const [order, setOrder] = useState(item.order);
  const [roleIds, setRoleIds] = useState<string[]>(initialRoleIds);
  const [isActive, setIsActive] = useState(item.isActive);
  const dirty = label !== item.label || order !== item.order || isActive !== item.isActive || roleIds.join(',') !== initialRoleIds.join(',');

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 text-[12px]">
      <Input value={label} onChange={(e) => setLabel(e.target.value)} className="h-7 w-40 text-[12px]" />
      <span className="text-zinc-400 font-mono text-[10px] w-44 truncate">{item.href}</span>
      <Input
        type="number"
        value={order}
        onChange={(e) => setOrder(Number(e.target.value))}
        className="h-7 w-16 text-[12px]"
      />
      {item.requiredPermission && (
        <span className="text-[10px] text-zinc-400 font-mono shrink-0">{item.requiredPermission}</span>
      )}
      <div className="flex-1">
        <RolePicker value={roleIds} onChange={setRoleIds} />
      </div>
      <label className="flex items-center gap-1 text-[10px] text-zinc-500">
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} /> Active
      </label>
      <Button
        size="sm"
        disabled={!dirty || saving}
        onClick={() => onSave({ label, order, roleIds: roleIds as any, isActive })}
        className="h-7 px-2 text-[11px]"
      >
        {saving ? <Loader2 size={12} className="animate-spin" /> : 'Save'}
      </Button>
    </div>
  );
}
