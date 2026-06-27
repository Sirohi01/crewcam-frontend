'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import api from '@/lib/axios';

const PIE_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#06b6d4', '#a855f7', '#84cc16'];

interface ReportsSummary {
  revenueByMonth: { name: string; total: number }[];
  packageDistribution: { name: string; count: number }[];
  moduleAdoption: { name: string; count: number }[];
  leadFunnel: { stage: string; count: number; value: number }[];
}

export default function SuperAdminAnalyticsPage() {
  const { data, isLoading } = useQuery<ReportsSummary>({
    queryKey: ['super-admin', 'reports-summary'],
    queryFn: async () => (await api.get('/super-admin/reports/summary')).data,
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Analytics</h1>
        <p className="text-xs text-zinc-500">Platform adoption trends, package distribution, and sales funnel — all derived from live data.</p>
      </div>

      <div className="grid grid-cols-12 gap-3">
        <Card className="col-span-8 border-zinc-200/80 shadow-sm rounded-lg overflow-hidden">
          <CardHeader className="px-4 py-2.5 border-b border-zinc-100 bg-zinc-50/50">
            <CardTitle className="text-[13px] font-md">Revenue Trend (12 months)</CardTitle>
          </CardHeader>
          <CardContent className="p-1">
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.revenueByMonth || []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa' }} />
                  <Tooltip contentStyle={{ borderRadius: 6, fontSize: 12 }} formatter={(v: any) => `₹${Math.round(Number(v) || 0).toLocaleString('en-IN')}`} />
                  <Area type="monotone" dataKey="total" name="Revenue" stroke="#6366f1" strokeWidth={2} fill="url(#rev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-4 border-zinc-200/80 shadow-sm rounded-lg overflow-hidden">
          <CardHeader className="px-4 py-2.5 border-b border-zinc-100 bg-zinc-50/50">
            <CardTitle className="text-[13px] font-md">Package Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-1">
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data?.packageDistribution || []} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, count }: any) => `${name} (${count})`} labelLine={false} fontSize={10}>
                    {(data?.packageDistribution || []).map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 6, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-3">
        <Card className="col-span-6 border-zinc-200/80 shadow-sm rounded-lg overflow-hidden">
          <CardHeader className="px-4 py-2.5 border-b border-zinc-100 bg-zinc-50/50">
            <CardTitle className="text-[13px] font-md">Module Adoption</CardTitle>
          </CardHeader>
          <CardContent className="p-1">
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.moduleAdoption || []} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa' }} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#52525b' }} width={110} />
                  <Tooltip contentStyle={{ borderRadius: 6, fontSize: 12 }} />
                  <Bar dataKey="count" name="Companies" fill="#22c55e" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-6 border-zinc-200/80 shadow-sm rounded-lg overflow-hidden">
          <CardHeader className="px-4 py-2.5 border-b border-zinc-100 bg-zinc-50/50">
            <CardTitle className="text-[13px] font-md">Sales Funnel (Leads)</CardTitle>
          </CardHeader>
          <CardContent className="p-1">
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.leadFunnel || []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="stage" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#a1a1aa' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa' }} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: 6, fontSize: 12 }} />
                  <Bar dataKey="count" name="Leads" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {!isLoading && (data?.packageDistribution || []).length === 0 && (
        <p className="text-xs text-zinc-400 text-center py-4">Not enough data yet — analytics will populate as companies, payments, and leads are added.</p>
      )}
    </div>
  );
}
