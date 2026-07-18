'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

interface RoleOption { _id: string; name: string; }

/**
 * Multi-select chip picker for targeting specific tenant Roles (e.g. "only HR Recruiter and
 * HOD see this"). Shared by the Sidebar and Dashboard Widgets settings pages — both need the
 * same "pick specific roles" interaction on top of their respective coarse gates.
 */
export function RolePicker({ value, onChange }: { value: string[]; onChange: (roleIds: string[]) => void }) {
  const { data: rolesRes } = useQuery({
    queryKey: ['companies', 'roles'],
    queryFn: async () => (await api.get('/companies/roles')).data,
    staleTime: 60 * 1000,
  });
  const roles: RoleOption[] = rolesRes?.data || [];

  const toggle = (roleId: string) => {
    onChange(value.includes(roleId) ? value.filter((id) => id !== roleId) : [...value, roleId]);
  };

  if (roles.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {roles.map((role) => (
        <button
          key={role._id}
          type="button"
          onClick={() => toggle(role._id)}
          className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${value.includes(role._id)
            ? 'bg-indigo-600 text-white border-indigo-600'
            : 'bg-transparent text-zinc-500 border-zinc-200 dark:border-zinc-700'
            }`}
        >
          {role.name}
        </button>
      ))}
    </div>
  );
}
