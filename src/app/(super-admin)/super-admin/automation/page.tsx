'use client';
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable, Column } from '@/components/shared/DataTable';
import { Loader2, Receipt, Target, Workflow, BatteryWarning, Play } from 'lucide-react';
import api from '@/lib/axios';

const RULE_META: Record<string, { label: string; description: string; icon: React.ElementType; showThreshold?: boolean; showInterval?: boolean }> = {
  PAYMENT_REMINDER: {
    label: 'Payment Reminders',
    description: 'Email a company when its setup fee is pending, subscription is past due, or renewal is overdue.',
    icon: Receipt,
    showInterval: true,
  },
  LEAD_FOLLOWUP: {
    label: 'Lead Follow-up',
    description: 'Flag leads that have been stuck in the same stage for too long.',
    icon: Target,
    showInterval: true,
  },
  LIFECYCLE_AUTO_ADVANCE: {
    label: 'Lifecycle Auto-Advance',
    description: 'Automatically move a company to Workspace Provisioning once setup fee + subscription are both paid.',
    icon: Workflow,
  },
  AI_CREDITS_LOW: {
    label: 'AI Credits Low Alert',
    description: 'Flag companies whose AI credit balance drops below the threshold.',
    icon: BatteryWarning,
    showThreshold: true,
  },
};

const LOG_TYPE_LABEL: Record<string, string> = {
  PAYMENT_REMINDER: 'Payment Reminder',
  LEAD_FOLLOWUP: 'Lead Follow-up',
  LIFECYCLE_AUTO_ADVANCE: 'Lifecycle Auto-Advance',
  AI_CREDITS_LOW: 'AI Credits Low',
};

export default function AutomationPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [savingType, setSavingType] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState<any>(null);
  const [error, setError] = useState('');

  const { data: rules, isLoading: rulesLoading } = useQuery({
    queryKey: ['super-admin', 'automation', 'rules'],
    queryFn: async () => (await api.get('/super-admin/automation/rules')).data,
  });

  const { data: logsData, isLoading: logsLoading } = useQuery({
    queryKey: ['super-admin', 'automation', 'logs', page, pageSize],
    queryFn: async () => (await api.get('/super-admin/automation/logs', { params: { page, limit: pageSize } })).data,
  });

  const invalidateRules = () => queryClient.invalidateQueries({ queryKey: ['super-admin', 'automation', 'rules'] });
  const invalidateLogs = () => queryClient.invalidateQueries({ queryKey: ['super-admin', 'automation', 'logs'] });

  const handleToggle = async (type: string, isEnabled: boolean) => {
    setSavingType(type);
    setError('');
    try {
      await api.put(`/super-admin/automation/rules/${type}`, { isEnabled });
      invalidateRules();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to update rule');
    } finally {
      setSavingType(null);
    }
  };

  const handleFieldSave = async (type: string, field: 'intervalDays' | 'threshold', value: number) => {
    setSavingType(type);
    setError('');
    try {
      await api.put(`/super-admin/automation/rules/${type}`, { [field]: value });
      invalidateRules();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to update rule');
    } finally {
      setSavingType(null);
    }
  };

  const handleRunNow = async () => {
    setRunning(true);
    setError('');
    setRunResult(null);
    try {
      const res = await api.post('/super-admin/automation/run');
      setRunResult(res.data);
      invalidateRules();
      invalidateLogs();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to run automation checks');
    } finally {
      setRunning(false);
    }
  };

  const rows = logsData?.data || [];
  const total = logsData?.pagination?.total ?? 0;

  const columns: Column<any>[] = [
    { key: 'createdAt', label: 'TIME', width: '160px', render: (v) => new Date(v).toLocaleString() },
    { key: 'type', label: 'RULE', width: '170px', render: (v) => LOG_TYPE_LABEL[v] || v },
    {
      key: 'tenantId', label: 'COMPANY', width: '160px',
      render: (v, row) => (v?.name) || (row.leadId?.companyName) || '—',
    },
    { key: 'message', label: 'MESSAGE' },
    {
      key: 'status', label: 'STATUS', width: '100px',
      render: (v) => <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${v === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{v}</span>,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Automation</h1>
          <p className="text-xs text-zinc-500">Background rules that run hourly across every company — payments, leads, lifecycle, and AI credits.</p>
        </div>
        <Button onClick={handleRunNow} disabled={running} className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white">
          {running ? <Loader2 size={13} className="animate-spin mr-1" /> : <Play size={13} className="mr-1" />}
          Run Now
        </Button>
      </div>

      {error && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}
      {runResult && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          Run complete — check the activity log below for details.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {rulesLoading && <div className="col-span-2 text-center text-zinc-400 text-xs py-6">Loading rules...</div>}
        {(rules || []).map((rule: any) => {
          const meta = RULE_META[rule.type];
          if (!meta) return null;
          const Icon = meta.icon;
          return (
            <Card key={rule.type} className="border-zinc-200/80 shadow-sm rounded-lg">
              <CardHeader className="px-4 py-3 border-b border-zinc-100 bg-zinc-50/50 flex flex-row items-center justify-between">
                <CardTitle className="text-[13px] font-md flex items-center gap-2">
                  <Icon size={14} className="text-indigo-500" />
                  {meta.label}
                </CardTitle>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rule.isEnabled}
                    disabled={savingType === rule.type}
                    onChange={(e) => handleToggle(rule.type, e.target.checked)}
                    className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <span className="text-[11px] text-zinc-500">{rule.isEnabled ? 'Enabled' : 'Disabled'}</span>
                </label>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <p className="text-[11px] text-zinc-500">{meta.description}</p>
                {meta.showInterval && (
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] text-zinc-600">Remind every</label>
                    <input
                      type="number"
                      min={1}
                      defaultValue={rule.intervalDays}
                      onBlur={(e) => handleFieldSave(rule.type, 'intervalDays', Number(e.target.value) || 1)}
                      className="w-16 border border-zinc-200 rounded-lg text-xs px-2 py-1"
                    />
                    <span className="text-[11px] text-zinc-600">days</span>
                  </div>
                )}
                {meta.showThreshold && (
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] text-zinc-600">Alert below</label>
                    <input
                      type="number"
                      min={0}
                      defaultValue={rule.threshold}
                      onBlur={(e) => handleFieldSave(rule.type, 'threshold', Number(e.target.value) || 0)}
                      className="w-16 border border-zinc-200 rounded-lg text-xs px-2 py-1"
                    />
                    <span className="text-[11px] text-zinc-600">credits</span>
                  </div>
                )}
                <p className="text-[10px] text-zinc-400">
                  Last run: {rule.lastRunAt ? new Date(rule.lastRunAt).toLocaleString() : 'never'}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-zinc-200/80 shadow-sm rounded-lg overflow-hidden">
        <CardHeader className="px-4 py-3 border-b border-zinc-100 bg-zinc-50/50">
          <CardTitle className="text-[13px] font-md">Activity Log</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={rows}
            rowKey="_id"
            loading={logsLoading}
            showActions={false}
            enableColumnFilters={false}
            showSearch={false}
            currentPage={page}
            pageSize={pageSize}
            totalItems={total}
            onPageChange={setPage}
            onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
            emptyMessage="No automation activity yet — click 'Run Now' to trigger a check."
          />
        </CardContent>
      </Card>
    </div>
  );
}
