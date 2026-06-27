'use client';

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Building2, Users, Package, Flag, ArrowUpRight, ShieldAlert,
  IndianRupee, AlertTriangle, CheckCircle2, Loader2,
} from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '@/lib/axios';

type RangeKey = 'today' | 'week' | 'month' | 'custom';

interface PaymentAlert {
  tenantId: string;
  companyName: string;
  type: 'SETUP_FEE_PENDING' | 'SUBSCRIPTION_PAST_DUE' | 'RENEWAL_OVERDUE';
  amount: number;
  currency: 'INR' | 'USD';
  nextRenewalDate?: string;
}

interface DashboardStats {
  range: string;
  totalTenants: number;
  activeTenants: number;
  totalPackages: number;
  totalFeatures: number;
  totalUsers: number;
  growth: { name: string; value: number }[];
  recentTenants: any[];
  recentAuditEvents: any[];
  revenueINR: number;
  setupFeeRevenueINR: number;
  subscriptionRevenueINR: number;
  aiCreditRevenueINR: number;
  newCompaniesInRange: number;
  activityCountInRange: number;
  paymentAlerts: PaymentAlert[];
}

const RANGE_LABELS: Record<RangeKey, string> = {
  today: 'Today',
  week: 'This Week',
  month: 'This Month',
  custom: 'Custom Range',
};

const ALERT_LABELS: Record<PaymentAlert['type'], string> = {
  SETUP_FEE_PENDING: 'Setup fee pending',
  SUBSCRIPTION_PAST_DUE: 'Subscription past due',
  RENEWAL_OVERDUE: 'Renewal overdue',
};

function formatMoney(amount: number, currency: 'INR' | 'USD' = 'INR') {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

export default function SuperAdminOverviewPage() {
  const queryClient = useQueryClient();
  const [range, setRange] = useState<RangeKey>('today');
  const [customFrom, setCustomFrom] = useState(() => new Date().toISOString().slice(0, 10));
  const [customTo, setCustomTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [actingOnId, setActingOnId] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');

  const { data, isLoading } = useQuery<DashboardStats>({
    queryKey: ['super-admin', 'dashboard-stats', range, range === 'custom' ? customFrom : null, range === 'custom' ? customTo : null],
    queryFn: async () => (await api.get('/super-admin/dashboard-stats', {
      params: {
        range,
        ...(range === 'custom' ? { from: customFrom, to: customTo } : {}),
      },
    })).data,
  });

  const refetchStats = () => queryClient.invalidateQueries({ queryKey: ['super-admin', 'dashboard-stats'] });

  const handleResolveAlert = async (paymentAlert: PaymentAlert) => {
    setActingOnId(paymentAlert.tenantId);
    setActionError('');
    try {
      if (paymentAlert.type === 'SETUP_FEE_PENDING') {
        await api.post(`/super-admin/tenants/${paymentAlert.tenantId}/mark-setup-fee-paid`);
      } else {
        await api.post(`/super-admin/tenants/${paymentAlert.tenantId}/record-subscription-payment`);
      }
      refetchStats();
    } catch (e: any) {
      console.error(e);
      setActionError(e?.response?.data?.message || 'Failed to update payment status.');
    } finally {
      setActingOnId(null);
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300 pb-6 max-w-[1400px] mx-auto">

      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Super Admin Work Space</h1>
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-md">{RANGE_LABELS[range]} Overview</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-md border border-zinc-200 bg-white p-0.5">
            {(['today', 'week', 'month', 'custom'] as RangeKey[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 text-xs font-medium rounded ${range === r ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:text-zinc-900'}`}
              >
                {RANGE_LABELS[r]}
              </button>
            ))}
          </div>
          {range === 'custom' && (
            <div className="flex items-center gap-1.5">
              <input type="date" value={customFrom} max={customTo} onChange={(e) => setCustomFrom(e.target.value)} className="h-8 border border-zinc-200 rounded-md text-xs px-2" />
              <span className="text-zinc-400 text-xs">to</span>
              <input type="date" value={customTo} min={customFrom} onChange={(e) => setCustomTo(e.target.value)} className="h-8 border border-zinc-200 rounded-md text-xs px-2" />
            </div>
          )}
        </div>
      </div>

      {/* Critical "right now" metrics */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg">
          <CardContent className="p-3">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[11px] font-md text-zinc-500 uppercase tracking-wider">{RANGE_LABELS[range]} Revenue</p>
              <IndianRupee size={14} className="text-emerald-500" />
            </div>
            <h3 className="text-xl font-md tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
              {isLoading ? '—' : formatMoney(data?.revenueINR || 0)}
            </h3>
            {!isLoading && (
              <p className="text-[10px] text-zinc-400 mt-1.5">
                Setup fees {formatMoney(data?.setupFeeRevenueINR || 0)} · Subscriptions {formatMoney(data?.subscriptionRevenueINR || 0)} · AI Credits {formatMoney(data?.aiCreditRevenueINR || 0)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className={`border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg ${(data?.paymentAlerts?.length ?? 0) > 0 ? 'ring-1 ring-amber-200' : ''}`}>
          <CardContent className="p-3">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[11px] font-md text-zinc-500 uppercase tracking-wider">Payment Alerts</p>
              <AlertTriangle size={14} className={(data?.paymentAlerts?.length ?? 0) > 0 ? 'text-amber-500' : 'text-zinc-400'} />
            </div>
            <h3 className="text-xl font-md tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
              {isLoading ? '—' : data?.paymentAlerts?.length ?? 0}
            </h3>
            <p className="text-[10px] text-zinc-400 mt-1.5">Pending setup fees, past-due or overdue subscriptions</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg">
          <CardContent className="p-3">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[11px] font-md text-zinc-500 uppercase tracking-wider">New Companies</p>
              <Building2 size={14} className="text-indigo-500" />
            </div>
            <h3 className="text-xl font-md tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
              {isLoading ? '—' : data?.newCompaniesInRange ?? 0}
            </h3>
            <p className="text-[10px] text-zinc-400 mt-1.5">{isLoading ? '' : `${data?.activityCountInRange ?? 0} activity events in this range`}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-3">
        {/* Payment Alerts */}
        <Card className="col-span-6 border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg flex flex-col">
          <CardHeader className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/30">
            <CardTitle className="text-[12px] font-md flex items-center gap-1.5">
              <AlertTriangle size={12} className="text-amber-500" />
              Payment Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto max-h-[340px]">
            {actionError && (
              <div className="px-3 py-2 text-[11px] text-rose-700 bg-rose-50 border-b border-rose-100">{actionError}</div>
            )}
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {(data?.paymentAlerts || []).map((paymentAlert) => (
                <div key={`${paymentAlert.tenantId}-${paymentAlert.type}`} className="flex items-center justify-between gap-3 p-3">
                  <div className="min-w-0">
                    <p className="text-[12px] font-md text-zinc-900 dark:text-zinc-100 truncate">{paymentAlert.companyName}</p>
                    <p className="text-[10px] text-amber-600">{ALERT_LABELS[paymentAlert.type]} · {formatMoney(paymentAlert.amount, paymentAlert.currency)}</p>
                  </div>
                  <Button
                    size="sm"
                    disabled={actingOnId === paymentAlert.tenantId}
                    onClick={() => handleResolveAlert(paymentAlert)}
                    className="h-7 text-[11px] bg-zinc-900 hover:bg-zinc-800 text-white shrink-0"
                  >
                    {actingOnId === paymentAlert.tenantId ? <Loader2 size={12} className="animate-spin" /> : paymentAlert.type === 'SETUP_FEE_PENDING' ? 'Mark Paid' : 'Record Payment'}
                  </Button>
                </div>
              ))}
              {!isLoading && (data?.paymentAlerts || []).length === 0 && (
                <div className="flex flex-col items-center gap-2 p-8 text-center text-zinc-400">
                  <CheckCircle2 size={20} className="text-emerald-400" />
                  <p className="text-[11px]">No payment issues right now.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Activity Log */}
        <Card className="col-span-6 border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg flex flex-col">
          <CardHeader className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-row items-center justify-between">
            <CardTitle className="text-[12px] font-md">Activity Log — {RANGE_LABELS[range]}</CardTitle>
            <Link href="/super-admin/audit-logs" className="text-[10px] text-zinc-500 hover:text-zinc-900 font-medium">All logs</Link>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto max-h-[340px]">
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {(data?.recentAuditEvents || []).map((evt: any) => (
                <ActivityItem
                  key={evt._id}
                  user={evt.userId ? `${evt.userId.firstName || ''} ${evt.userId.lastName || ''}`.trim() || evt.userId.email : 'System'}
                  action={`${evt.action} · ${evt.module}`}
                  time={new Date(evt.createdAt).toLocaleString()}
                  dotColor={evt.status === 'SUCCESS' ? 'bg-emerald-500' : 'bg-rose-500'}
                />
              ))}
              {!isLoading && (data?.recentAuditEvents || []).length === 0 && (
                <div className="p-8 text-center text-[11px] text-zinc-400">No activity in this range.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-3">
        <Card className="col-span-8 border-zinc-200/80 shadow-sm dark:border-zinc-800 overflow-hidden rounded-lg">
          <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/30 px-4 py-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-[13px] font-md">Company Growth</CardTitle>
                <span className="text-[10px] text-zinc-500">Last 6 months</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-1">
            <div className="h-[220px] w-full min-h-[220px] min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <AreaChart data={data?.growth || []} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#18181b" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#18181b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '6px', border: '1px solid #e4e4e7', padding: '4px 8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                    itemStyle={{ color: '#18181b', fontSize: '12px', fontWeight: 600 }}
                    labelStyle={{ fontSize: '10px', color: '#71717a' }}
                  />
                  <Area type="monotone" dataKey="value" name="New companies" stroke="#18181b" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="col-span-4 flex flex-col gap-3">
          <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg">
            <CardHeader className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/30">
              <CardTitle className="text-[12px] font-md flex items-center gap-1.5">
                <Package size={12} className="text-zinc-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 grid grid-cols-2 gap-1.5">
              <QuickAction href="/super-admin/companies" icon={<Building2 size={14} />} label="Companies" />
              <QuickAction href="/super-admin/settings" icon={<Package size={14} />} label="Packages" />
              <QuickAction href="/super-admin/features" icon={<Flag size={14} />} label="Feature Flags" />
              <QuickAction href="/super-admin/audit-logs" icon={<ShieldAlert size={14} />} label="Audit Logs" />
            </CardContent>
          </Card>

          <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg">
            <CardHeader className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/30">
              <CardTitle className="text-[12px] font-md">Platform Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="p-3 grid grid-cols-2 gap-3">
              <SnapshotStat icon={<Building2 size={13} />} label="Companies" value={data?.totalTenants} />
              <SnapshotStat icon={<Building2 size={13} />} label="Active" value={data?.activeTenants} />
              <SnapshotStat icon={<Users size={13} />} label="Users" value={data?.totalUsers} />
              <SnapshotStat icon={<Flag size={13} />} label="Features" value={data?.totalFeatures} />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg overflow-hidden mt-2">
        <CardHeader className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-row items-center justify-between">
          <CardTitle className="text-[13px] font-md">Recently Onboarded Companies</CardTitle>
          <Link href="/super-admin/companies" className="flex items-center gap-0.5 text-[10px] font-medium text-indigo-600 hover:text-indigo-700">
            View all <ArrowUpRight size={12} />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-zinc-50/80 dark:bg-zinc-900/50 text-zinc-500 uppercase tracking-wider font-md border-b border-zinc-100 dark:border-zinc-800/50">
                <tr>
                  <th className="px-4 py-2">Company Name</th>
                  <th className="px-4 py-2">Package</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2 text-right">Onboarded</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                {(data?.recentTenants || []).map((t: any) => (
                  <tr key={t._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                    <td className="px-4 py-2.5 font-medium text-zinc-900 dark:text-zinc-100">{t.name}</td>
                    <td className="px-4 py-2.5 text-zinc-500">{t.packageId?.name || 'Custom'}</td>
                    <td className="px-4 py-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-md ${t.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {t.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right text-zinc-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {!isLoading && (data?.recentTenants || []).length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-zinc-400">No companies onboarded yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function QuickAction({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 p-2 rounded-md bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 transition-colors border border-zinc-100 dark:border-zinc-800/80 text-left">
      <div className="text-zinc-600 dark:text-zinc-300">{icon}</div>
      <span className="text-[11px] font-md text-zinc-700 dark:text-zinc-200 flex-1 truncate">{label}</span>
    </Link>
  );
}

function SnapshotStat({ icon, label, value }: { icon: React.ReactNode; label: string; value?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-7 w-7 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">{icon}</div>
      <div>
        <p className="text-[13px] font-md text-zinc-900 dark:text-zinc-50 leading-none">{value ?? '—'}</p>
        <p className="text-[9px] text-zinc-400 uppercase tracking-wide">{label}</p>
      </div>
    </div>
  );
}

function ActivityItem({ user, action, time, dotColor }: { user: string; action: string; time: string; dotColor: string }) {
  return (
    <div className="flex items-center gap-2.5 p-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`}></div>
      <div className="flex-1 min-w-0 flex items-center justify-between">
        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 truncate">
          <span className="font-md text-zinc-900 dark:text-zinc-100">{user}</span> {action}
        </p>
        <p className="text-[10px] text-zinc-400 font-medium shrink-0 ml-2">{time}</p>
      </div>
    </div>
  );
}
