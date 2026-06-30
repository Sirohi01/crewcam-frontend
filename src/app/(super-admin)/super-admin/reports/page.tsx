'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import api from '@/lib/axios';

function formatMoney(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
}

interface ReportsSummary {
  revenueByMonth: { name: string; setupFee: number; subscription: number; aiCreditTopup: number; total: number }[];
  packageDistribution: { name: string; count: number }[];
  companyStatusBreakdown: { active: number; inactive: number };
  subscriptionStatusCounts: Record<string, number>;
  totalCompanies: number;
  totalPackages: number;
  totalTaxCollected: number;
  totalDiscountGiven: number;
  totalInvoiced: number;
  totalCollected: number;
  activeCouponCount: number;
  totalCouponRedemptions: number;
}

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function SuperAdminReportsPage() {
  const { data, isLoading } = useQuery<ReportsSummary>({
    queryKey: ['super-admin', 'reports-summary'],
    queryFn: async () => (await api.get('/super-admin/reports/summary')).data,
  });

  const totalRevenue12mo = (data?.revenueByMonth || []).reduce((s, m) => s + m.total, 0);

  const handleExportRevenue = () => {
    if (!data) return;
    const rows: (string | number)[][] = [['Month', 'Setup Fee (INR)', 'Subscription (INR)', 'AI Credit Top-up (INR)', 'Total (INR)']];
    data.revenueByMonth.forEach((m) => rows.push([m.name, Math.round(m.setupFee), Math.round(m.subscription), Math.round(m.aiCreditTopup), Math.round(m.total)]));
    downloadCsv('revenue-by-month.csv', rows);
  };

  const handleExportPackages = () => {
    if (!data) return;
    const rows: (string | number)[][] = [['Package', 'Companies']];
    data.packageDistribution.forEach((p) => rows.push([p.name, p.count]));
    downloadCsv('package-distribution.csv', rows);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Reports</h1>
        <p className="text-xs text-zinc-500">Exportable platform-wide reports across companies, billing, and packages.</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <Card className="border-zinc-200/80 shadow-sm rounded-lg"><CardContent className="p-3">
          <p className="text-[11px] font-md text-zinc-500 uppercase tracking-wider mb-2">Revenue (12 mo)</p>
          <h3 className="text-xl font-md text-zinc-900 leading-none">{isLoading ? '—' : formatMoney(totalRevenue12mo)}</h3>
        </CardContent></Card>
        <Card className="border-zinc-200/80 shadow-sm rounded-lg"><CardContent className="p-3">
          <p className="text-[11px] font-md text-zinc-500 uppercase tracking-wider mb-2">Total Companies</p>
          <h3 className="text-xl font-md text-zinc-900 leading-none">{isLoading ? '—' : data?.totalCompanies}</h3>
        </CardContent></Card>
        <Card className="border-zinc-200/80 shadow-sm rounded-lg"><CardContent className="p-3">
          <p className="text-[11px] font-md text-zinc-500 uppercase tracking-wider mb-2">Active / Inactive</p>
          <h3 className="text-xl font-md text-zinc-900 leading-none">{isLoading ? '—' : `${data?.companyStatusBreakdown.active} / ${data?.companyStatusBreakdown.inactive}`}</h3>
        </CardContent></Card>
        <Card className="border-zinc-200/80 shadow-sm rounded-lg"><CardContent className="p-3">
          <p className="text-[11px] font-md text-zinc-500 uppercase tracking-wider mb-2">Packages Defined</p>
          <h3 className="text-xl font-md text-zinc-900 leading-none">{isLoading ? '—' : data?.totalPackages}</h3>
        </CardContent></Card>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <Card className="border-zinc-200/80 shadow-sm rounded-lg"><CardContent className="p-3">
          <p className="text-[11px] font-md text-zinc-500 uppercase tracking-wider mb-2">GST Collected (all time)</p>
          <h3 className="text-xl font-md text-zinc-900 leading-none">{isLoading ? '—' : formatMoney(data?.totalTaxCollected || 0)}</h3>
        </CardContent></Card>
        <Card className="border-zinc-200/80 shadow-sm rounded-lg"><CardContent className="p-3">
          <p className="text-[11px] font-md text-zinc-500 uppercase tracking-wider mb-2">Discounts Given</p>
          <h3 className="text-xl font-md text-rose-600 leading-none">{isLoading ? '—' : formatMoney(data?.totalDiscountGiven || 0)}</h3>
        </CardContent></Card>
        <Card className="border-zinc-200/80 shadow-sm rounded-lg"><CardContent className="p-3">
          <p className="text-[11px] font-md text-zinc-500 uppercase tracking-wider mb-2">Invoiced vs Collected</p>
          <h3 className="text-xl font-md text-zinc-900 leading-none">{isLoading ? '—' : `${formatMoney(data?.totalCollected || 0)} / ${formatMoney(data?.totalInvoiced || 0)}`}</h3>
        </CardContent></Card>
        <Card className="border-zinc-200/80 shadow-sm rounded-lg"><CardContent className="p-3">
          <p className="text-[11px] font-md text-zinc-500 uppercase tracking-wider mb-2">Active Coupons / Redemptions</p>
          <h3 className="text-xl font-md text-zinc-900 leading-none">{isLoading ? '—' : `${data?.activeCouponCount} / ${data?.totalCouponRedemptions}`}</h3>
        </CardContent></Card>
      </div>

      <Card className="border-zinc-200/80 shadow-sm rounded-lg overflow-hidden">
        <CardHeader className="px-4 py-3 border-b border-zinc-100 bg-zinc-50/50 flex flex-row items-center justify-between">
          <CardTitle className="text-[13px] font-md">Revenue by Month (last 12 months)</CardTitle>
          <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={handleExportRevenue}><Download size={12} className="mr-1" /> Export CSV</Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-zinc-50/80 text-zinc-500 uppercase tracking-wider font-md border-b border-zinc-100">
                <tr><th className="px-4 py-2">Month</th><th className="px-4 py-2 text-right">Setup Fee</th><th className="px-4 py-2 text-right">Subscription</th><th className="px-4 py-2 text-right">AI Credit Top-up</th><th className="px-4 py-2 text-right">Total</th></tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {(data?.revenueByMonth || []).map((m) => (
                  <tr key={m.name}>
                    <td className="px-4 py-2 font-medium text-zinc-900">{m.name}</td>
                    <td className="px-4 py-2 text-right text-zinc-500">{formatMoney(m.setupFee)}</td>
                    <td className="px-4 py-2 text-right text-zinc-500">{formatMoney(m.subscription)}</td>
                    <td className="px-4 py-2 text-right text-zinc-500">{formatMoney(m.aiCreditTopup)}</td>
                    <td className="px-4 py-2 text-right font-medium">{formatMoney(m.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-zinc-200/80 shadow-sm rounded-lg overflow-hidden">
        <CardHeader className="px-4 py-3 border-b border-zinc-100 bg-zinc-50/50 flex flex-row items-center justify-between">
          <CardTitle className="text-[13px] font-md">Companies by Package</CardTitle>
          <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={handleExportPackages}><Download size={12} className="mr-1" /> Export CSV</Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-zinc-50/80 text-zinc-500 uppercase tracking-wider font-md border-b border-zinc-100">
                <tr><th className="px-4 py-2">Package</th><th className="px-4 py-2 text-right">Companies</th></tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {(data?.packageDistribution || []).map((p) => (
                  <tr key={p.name}>
                    <td className="px-4 py-2 font-medium text-zinc-900">{p.name}</td>
                    <td className="px-4 py-2 text-right text-zinc-500">{p.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
