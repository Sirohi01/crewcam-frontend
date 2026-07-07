'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PieChart, Activity, AlertCircle, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

export default function LeaveStatisticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['leaves', 'statistics'],
    queryFn: async () => (await api.get('/leaves/statistics')).data,
  });

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 pb-8 w-full">
      {/* Header */}
      <header className="pb-2.5 border-b border-zinc-200/70 dark:border-zinc-800">
        <h1 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Employee Leave Statistics</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Track your leave balances, history, and pending requests</p>
      </header>

      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center text-zinc-400 gap-2">
          <Loader2 size={22} className="animate-spin text-indigo-600" />
          <p className="text-xs font-medium">Loading statistics…</p>
        </div>
      ) : data?.stats?.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center text-zinc-400 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800">
          <PieChart size={32} className="mb-2 text-zinc-300 dark:text-zinc-600" />
          <p className="text-[13px] font-medium text-zinc-600 dark:text-zinc-300">No leave data available</p>
          <p className="text-xs text-zinc-500 mt-0.5">Your company has not configured leave types yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {data?.stats?.map((s: any) => {
            const totalAvailable = (s.defaultDays || 0) + (s.creditedDays || 0);
            const taken = s.takenThisYear || 0;
            const percentage = totalAvailable > 0 ? Math.min(100, (taken / totalAvailable) * 100) : 0;
            const isLowBalance = s.balance <= 2 && s.balance > 0;
            const isNegative = s.balance < 0;

            return (
              <Card key={s.leaveTypeId} className="border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-hidden hover:shadow-md transition-shadow">
                <div className={`h-1 w-full ${isNegative ? 'bg-rose-500' : isLowBalance ? 'bg-amber-500' : 'bg-indigo-600'}`} />
                <CardContent className="p-3">
                  {/* Balance */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">{s.leaveTypeName}</p>
                      <div className="mt-0.5 flex items-baseline gap-1.5">
                        <span className={`text-[28px] leading-none font-bold tracking-tight tabular-nums ${isNegative ? 'text-rose-600' : 'text-zinc-900 dark:text-zinc-50'}`}>
                          {s.balance}
                        </span>
                        <span className="text-xs font-medium text-zinc-500">days left</span>
                      </div>
                    </div>
                    <div className={`p-1.5 rounded-md ${isNegative ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/20' : isLowBalance ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/20' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20'}`}>
                      <Activity size={16} />
                    </div>
                  </div>

                  {/* Utilization */}
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-medium">
                      <span className="text-zinc-500">Utilization</span>
                      <span className="text-zinc-700 dark:text-zinc-300 tabular-nums">{Math.round(percentage)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${isNegative ? 'bg-rose-500' : percentage > 80 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Allotted</span>
                      <span className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">{s.defaultDays}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Credited</span>
                      <span className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">{s.creditedDays}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Taken</span>
                      <span className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">{s.takenThisYear}</span>
                    </div>
                  </div>

                  {s.pendingDays > 0 && (
                    <div className="mt-2.5 flex items-start gap-1.5 bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 p-2 rounded-md text-[11px] font-medium">
                      <AlertCircle size={13} className="mt-0.5 shrink-0" />
                      <p>{s.pendingDays} day(s) currently pending HR/Manager approval.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}