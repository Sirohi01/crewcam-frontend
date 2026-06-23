'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, AlertTriangle, Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import moment from 'moment';

interface EmployeeAiSummary {
  _id: string;
  windowDays: number;
  summaryText: string;
  status: 'completed' | 'failed';
  failureReason?: string;
  createdAt: string;
}

const inputClass = 'w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:bg-zinc-900 dark:border-zinc-700';

export default function EmployeeAiSummaryPanel({ employees, selectedEmployeeId }: { employees: any[], selectedEmployeeId?: string }) {
  const queryClient = useQueryClient();
  const [employeeId, setEmployeeId] = useState('');

  // Sync with global selectedEmployeeId
  React.useEffect(() => {
    if (selectedEmployeeId && selectedEmployeeId !== 'all') {
      setEmployeeId(selectedEmployeeId);
    } else {
      setEmployeeId('');
    }
  }, [selectedEmployeeId]);

  const { data: summaries } = useQuery<EmployeeAiSummary[]>({
    queryKey: ['employee-ai-summaries', employeeId],
    queryFn: async () => (await api.get(`/ai/employees/${employeeId}/summary`)).data,
    enabled: !!employeeId,
  });

  const generateMutation = useMutation({
    mutationFn: async () => (await api.post(`/ai/employees/${employeeId}/summary`)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employee-ai-summaries', employeeId] }),
  });

  const latest = summaries && summaries.length > 0 ? summaries[0] : null;
  const errorMessage = (generateMutation.error as any)?.response?.data?.message;

  return (
    <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800">
      <CardHeader className="flex flex-row items-center justify-between pb-1">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Sparkles size={16} className="text-indigo-600" /> AI Employee Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-[11px] text-zinc-500">
          On-demand only — generated when you click below, never run automatically in the background.
          Advisory only: it narrates the record, it never recommends or triggers any action.
        </p>

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className={inputClass}>
              <option value="">Select employee...</option>
              {employees.map((emp: any) => (
                <option key={emp._id} value={emp._id}>{emp.firstName} {emp.lastName}</option>
              ))}
            </select>
          </div>
          <Button
            variant="outline"
            className="text-xs h-9 px-3"
            disabled={!employeeId || generateMutation.isPending}
            onClick={() => generateMutation.mutate()}
          >
            {generateMutation.isPending ? <Loader2 size={14} className="animate-spin mr-1" /> : <Sparkles size={14} className="mr-1" />}
            Generate Summary
          </Button>
        </div>

        {errorMessage && (
          <div className="flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950/30">
            <AlertTriangle size={14} className="mt-0.5 shrink-0" /> {errorMessage}
          </div>
        )}

        {employeeId && latest && latest.status === 'failed' && (
          <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-700 dark:border-amber-900 dark:bg-amber-950/30">
            <AlertTriangle size={14} className="mt-0.5 shrink-0" /> Summary failed: {latest.failureReason}
          </div>
        )}

        {employeeId && latest && latest.status === 'completed' && (
          <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300">
            <p>{latest.summaryText}</p>
            <p className="text-[10px] text-zinc-400 mt-2">
              Covers last {latest.windowDays} days · generated {moment(latest.createdAt).fromNow()}
              {summaries && summaries.length > 1 && ` · ${summaries.length - 1} earlier summary(ies) on record`}
            </p>
          </div>
        )}

        {employeeId && !latest && (
          <div className="py-6 text-center text-xs text-zinc-400 border border-dashed rounded-lg">
            No summary yet for this employee — click &quot;Generate Summary&quot;.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
