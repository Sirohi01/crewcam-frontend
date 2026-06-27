'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, ArrowUpRight } from 'lucide-react';
import api from '@/lib/axios';

const STAGE_META: Record<string, { label: string; color: string }> = {
  LEAD: { label: 'Lead', color: 'bg-blue-500' },
  DEMO_SCHEDULED: { label: 'Demo Scheduled', color: 'bg-indigo-500' },
  PROPOSAL_SENT: { label: 'Proposal Sent', color: 'bg-violet-500' },
  QUOTATION_APPROVED: { label: 'Quotation Approved', color: 'bg-amber-500' },
  WON: { label: 'Won', color: 'bg-emerald-500' },
  LOST: { label: 'Lost', color: 'bg-zinc-400' },
};

function formatMoney(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
}

export default function SuperAdminCrmPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['super-admin', 'leads', 'pipeline-summary'],
    queryFn: async () => (await api.get('/super-admin/leads/pipeline-summary')).data,
  });

  const summary: { stage: string; count: number; value: number }[] = data?.summary || [];
  const openStages = summary.filter((s) => s.stage !== 'WON' && s.stage !== 'LOST');
  const openPipelineValue = openStages.reduce((sum, s) => sum + s.value, 0);
  const totalOpenLeads = openStages.reduce((sum, s) => sum + s.count, 0);
  const wonCount = summary.find((s) => s.stage === 'WON')?.count || 0;
  const lostCount = summary.find((s) => s.stage === 'LOST')?.count || 0;
  const winRate = (wonCount + lostCount) > 0 ? Math.round((wonCount / (wonCount + lostCount)) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">CRM</h1>
          <p className="text-xs text-zinc-500">Sales pipeline overview for prospective customer accounts.</p>
        </div>
        <Link href="/super-admin/leads" className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700">
          Manage Leads <ArrowUpRight size={13} />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="border-zinc-200/80 shadow-sm rounded-lg">
          <CardContent className="p-3">
            <p className="text-[11px] font-md text-zinc-500 uppercase tracking-wider mb-2">Open Pipeline Value</p>
            <h3 className="text-xl font-md text-zinc-900 leading-none">{isLoading ? '—' : formatMoney(openPipelineValue)}</h3>
            <p className="text-[10px] text-zinc-400 mt-1.5">{totalOpenLeads} active leads</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-200/80 shadow-sm rounded-lg">
          <CardContent className="p-3">
            <p className="text-[11px] font-md text-zinc-500 uppercase tracking-wider mb-2">Won</p>
            <h3 className="text-xl font-md text-emerald-600 leading-none">{isLoading ? '—' : wonCount}</h3>
            <p className="text-[10px] text-zinc-400 mt-1.5">Converted to a customer</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-200/80 shadow-sm rounded-lg">
          <CardContent className="p-3">
            <p className="text-[11px] font-md text-zinc-500 uppercase tracking-wider mb-2">Win Rate</p>
            <h3 className="text-xl font-md text-zinc-900 leading-none">{isLoading ? '—' : `${winRate}%`}</h3>
            <p className="text-[10px] text-zinc-400 mt-1.5">Of closed leads ({wonCount + lostCount})</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-zinc-200/80 shadow-sm rounded-lg overflow-hidden">
        <CardHeader className="px-4 py-3 border-b border-zinc-100 bg-zinc-50/50">
          <CardTitle className="text-[13px] font-md flex items-center gap-1.5">
            <Briefcase size={13} className="text-zinc-500" /> Pipeline by Stage
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-6 gap-3">
            {summary.map((s) => (
              <Link
                key={s.stage}
                href={`/super-admin/leads?stage=${s.stage}`}
                className="rounded-lg border border-zinc-100 p-3 hover:border-zinc-300 transition-colors"
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <span className={`h-2 w-2 rounded-full ${STAGE_META[s.stage]?.color}`} />
                  <span className="text-[10px] font-md uppercase tracking-wide text-zinc-500">{STAGE_META[s.stage]?.label}</span>
                </div>
                <p className="text-lg font-md text-zinc-900 leading-none">{s.count}</p>
                <p className="text-[10px] text-zinc-400 mt-1">{formatMoney(s.value)}</p>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
