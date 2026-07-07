'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Smartphone, Monitor, Globe, Trash2, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';

export default function SessionsPage() {
  const token = useAuthStore(state => state.token);
  const queryClient = useQueryClient();

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const res = await fetch('http://localhost:8000/api/v1/settings/sessions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch sessions');
      return res.json();
    },
    enabled: !!token
  });

  const revokeMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const res = await fetch(`http://localhost:8000/api/v1/settings/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to revoke session');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    }
  });
  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300 pb-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Active Sessions</h1>
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-md">Device Management</p>
        </div>
      </div>

      <Card className="max-w-2xl border-zinc-200/80 shadow-sm dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={18} className="text-indigo-600" />
            Your Devices
          </CardTitle>
          <CardDescription>You are currently logged in to these devices. If you don't recognize a device, log out of it immediately.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {isLoading ? (
              <div className="py-4 text-sm text-zinc-500">Loading sessions...</div>
            ) : sessions?.length === 0 ? (
              <div className="py-4 text-sm text-zinc-500">No active sessions found.</div>
            ) : (
              sessions?.map((session: any, index: number) => (
                <SessionItem
                  key={session._id}
                  device={session.deviceType || 'Unknown Device'}
                  browser={session.browser || 'Unknown Browser'}
                  location={session.ipAddress || 'Unknown Location'}
                  time={new Date(session.lastActive).toLocaleString()}
                  isCurrent={index === 0} // For now, mock first as current
                  icon={session.deviceType?.toLowerCase().includes('mobile') ? <Smartphone size={20} className="text-zinc-500" /> : <Monitor size={20} className="text-zinc-500" />}
                  onRevoke={() => revokeMutation.mutate(session._id)}
                  isRevoking={revokeMutation.isPending && revokeMutation.variables === session._id}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SessionItem({ device, browser, location, time, isCurrent, icon, onRevoke, isRevoking }: any) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-md">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-md text-sm text-zinc-900 dark:text-zinc-100">{device}</p>
            {isCurrent && <span className="bg-emerald-100 text-emerald-700 text-[10px] font-md px-1.5 py-0.5 rounded uppercase tracking-wider">Current Device</span>}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-0.5">
            <span>{browser}</span>
            <span>•</span>
            <span className="flex items-center gap-0.5"><Globe size={10} /> {location}</span>
            <span>•</span>
            <span>{time}</span>
          </div>
        </div>
      </div>
      {!isCurrent && (
        <button
          onClick={onRevoke}
          disabled={isRevoking}
          className="flex items-center gap-1.5 text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
        >
          {isRevoking ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
          Revoke
        </button>
      )}
    </div>
  );
}
