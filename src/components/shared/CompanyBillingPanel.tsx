'use client';
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Receipt, Send, Loader2, Rocket, CreditCard, ArrowUpCircle, RefreshCcw } from 'lucide-react';
import api from '@/lib/axios';

declare global {
  interface Window { Razorpay?: any; }
}

const INVOICE_STATUSES = ['PENDING', 'PARTIAL', 'PAID', 'REFUNDED', 'CANCELLED'] as const;

const STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  PARTIAL: 'bg-blue-100 text-blue-700',
  PAID: 'bg-emerald-100 text-emerald-700',
  REFUNDED: 'bg-zinc-100 text-zinc-600',
  CANCELLED: 'bg-rose-100 text-rose-700',
};

function formatMoney(amount: number, currency: 'INR' | 'USD' = 'INR') {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount || 0);
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

interface CompanyBillingPanelProps {
  tenantId: string;
  companyName: string;
  currentPackageId?: string;
  currentBillingCycle?: 'MONTHLY' | 'YEARLY';
}

export function CompanyBillingPanel({ tenantId, companyName, currentPackageId, currentBillingCycle }: CompanyBillingPanelProps) {
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [provisionResult, setProvisionResult] = useState<{ message: string; ok: boolean } | null>(null);
  const [statusOverride, setStatusOverride] = useState<Record<string, string>>({});
  const [couponCode, setCouponCode] = useState('');
  const [planChoice, setPlanChoice] = useState('');
  const [planCycle, setPlanCycle] = useState<'MONTHLY' | 'YEARLY'>(currentBillingCycle || 'MONTHLY');
  const [planResult, setPlanResult] = useState<{ message: string; ok: boolean } | null>(null);

  const { data: quotations } = useQuery({
    queryKey: ['super-admin', 'quotations', tenantId],
    queryFn: async () => (await api.get(`/super-admin/tenants/${tenantId}/quotations`)).data,
  });

  const { data: invoices } = useQuery({
    queryKey: ['super-admin', 'invoices', tenantId],
    queryFn: async () => (await api.get(`/super-admin/tenants/${tenantId}/invoices`)).data,
  });

  const { data: packages } = useQuery({
    queryKey: ['super-admin', 'packages'],
    queryFn: async () => (await api.get('/super-admin/packages')).data,
  });

  const invalidateInvoices = () => queryClient.invalidateQueries({ queryKey: ['super-admin', 'invoices', tenantId] });
  const invalidateQuotations = () => queryClient.invalidateQueries({ queryKey: ['super-admin', 'quotations', tenantId] });
  const invalidateLifecycle = () => queryClient.invalidateQueries({ queryKey: ['super-admin', 'lifecycle', tenantId] });

  const run = async (key: string, fn: () => Promise<void>) => {
    setError('');
    setBusy(key);
    try {
      await fn();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Action failed');
    } finally {
      setBusy(null);
    }
  };

  const handleGenerateQuotation = () => run('quotation', async () => {
    await api.post(`/super-admin/tenants/${tenantId}/quotations`);
    invalidateQuotations();
  });

  const handleSendQuotation = (id: string) => run(`send-qtn-${id}`, async () => {
    await api.post(`/super-admin/quotations/${id}/send`);
    invalidateQuotations();
  });

  const handleGenerateInvoice = (type: 'SETUP_FEE' | 'SUBSCRIPTION') => run(`invoice-${type}`, async () => {
    await api.post(`/super-admin/tenants/${tenantId}/invoices`, { type, couponCode: couponCode || undefined });
    setCouponCode('');
    invalidateInvoices();
  });

  const handleSendInvoice = (id: string) => run(`send-inv-${id}`, async () => {
    await api.post(`/super-admin/invoices/${id}/send`);
  });

  const handleCheckout = (invoiceId: string, gateway: 'RAZORPAY' | 'STRIPE') => run(`checkout-${invoiceId}`, async () => {
    const res = await api.post(`/super-admin/invoices/${invoiceId}/checkout`, { gateway });
    if (gateway === 'STRIPE') {
      window.open(res.data.url, '_blank');
      return;
    }
    const loaded = await loadRazorpayScript();
    if (!loaded || !window.Razorpay) throw new Error('Failed to load Razorpay checkout');
    const rzp = new window.Razorpay({
      key: res.data.keyId,
      order_id: res.data.orderId,
      amount: res.data.amount,
      currency: res.data.currency,
      name: 'CrewCam HR Cloud',
      description: `Payment for ${companyName}`,
      handler: () => invalidateInvoices(),
    });
    rzp.open();
  });

  const handleStatusOverride = (invoiceId: string) => {
    const status = statusOverride[invoiceId];
    if (!status) return;
    run(`status-${invoiceId}`, async () => {
      await api.post(`/super-admin/invoices/${invoiceId}/status`, { status });
      invalidateInvoices();
      setStatusOverride((prev) => ({ ...prev, [invoiceId]: '' }));
    });
  };

  const handleProvision = () => run('provision', async () => {
    try {
      const res = await api.post(`/super-admin/tenants/${tenantId}/provision-workspace`);
      setProvisionResult({ ok: true, message: res.data.alreadyProvisioned ? 'Already provisioned.' : 'Workspace provisioning started.' });
      invalidateLifecycle();
    } catch (e: any) {
      setProvisionResult({ ok: false, message: e?.response?.data?.message || 'Failed to provision workspace' });
      throw e;
    }
  });

  const handleChangePlan = () => run('change-plan', async () => {
    try {
      const res = await api.post(`/super-admin/tenants/${tenantId}/change-plan`, { packageId: planChoice, billingCycle: planCycle });
      setPlanResult({ ok: true, message: `${res.data.direction === 'UPGRADE' ? 'Upgraded' : res.data.direction === 'DOWNGRADE' ? 'Downgraded' : 'Changed'} — new subscription amount ₹${res.data.newSubscriptionAmount}/${planCycle === 'YEARLY' ? 'yr' : 'mo'}.` });
      invalidateLifecycle();
    } catch (e: any) {
      setPlanResult({ ok: false, message: e?.response?.data?.message || 'Failed to change plan' });
      throw e;
    }
  });

  const latestInvoiceByType = (type: 'SETUP_FEE' | 'SUBSCRIPTION') =>
    (invoices || []).find((i: any) => i.type === type);
  const setupPaid = latestInvoiceByType('SETUP_FEE')?.status === 'PAID';
  const subscriptionPaid = latestInvoiceByType('SUBSCRIPTION')?.status === 'PAID';
  const canProvision = setupPaid && subscriptionPaid;

  const selectedNewPackage = (packages || []).find((p: any) => p._id === planChoice);
  const newPerUserPrice = selectedNewPackage ? (planCycle === 'YEARLY' ? selectedNewPackage.pricePerUserYearlyINR : selectedNewPackage.pricePerUserMonthlyINR) : 0;

  return (
    <div className="space-y-4">
      {error && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}

      <Card className="border-zinc-200/80 shadow-sm rounded-lg overflow-hidden">
        <CardHeader className="px-4 py-3 border-b border-zinc-100 bg-zinc-50/50 flex flex-row items-center justify-between">
          <CardTitle className="text-[13px] font-md flex items-center gap-1.5"><RefreshCcw size={13} className="text-zinc-500" /> Change Plan</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1">
              <label className="block text-[10px] font-md text-zinc-500 uppercase">New Plan</label>
              <select value={planChoice} onChange={(e) => setPlanChoice(e.target.value)} className="h-8 border border-zinc-200 rounded-lg text-xs px-2.5 bg-white min-w-[160px]">
                <option value="">Select a plan</option>
                {(packages || []).map((p: any) => (
                  <option key={p._id} value={p._id} disabled={p._id === currentPackageId}>{p.name} ({p.tier}){p._id === currentPackageId ? ' — current' : ''}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-md text-zinc-500 uppercase">Billing Cycle</label>
              <select value={planCycle} onChange={(e) => setPlanCycle(e.target.value as any)} className="h-8 border border-zinc-200 rounded-lg text-xs px-2.5 bg-white">
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>
            {selectedNewPackage && (
              <p className="text-[11px] text-zinc-500">New amount: <strong>{formatMoney(newPerUserPrice)}</strong>/user/{planCycle === 'YEARLY' ? 'yr' : 'mo'}</p>
            )}
            <Button size="sm" disabled={!planChoice || busy === 'change-plan'} onClick={handleChangePlan} className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white">
              {busy === 'change-plan' ? <Loader2 size={12} className="animate-spin mr-1" /> : <ArrowUpCircle size={12} className="mr-1" />} Change Plan
            </Button>
          </div>
          {planResult && <p className={`text-[11px] ${planResult.ok ? 'text-emerald-600' : 'text-rose-600'}`}>{planResult.message}</p>}
          <p className="text-[10px] text-zinc-400">Takes effect from the next billing cycle — no mid-cycle proration is calculated automatically.</p>
        </CardContent>
      </Card>

      <Card className="border-zinc-200/80 shadow-sm rounded-lg overflow-hidden">
        <CardHeader className="px-4 py-3 border-b border-zinc-100 bg-zinc-50/50 flex flex-row items-center justify-between">
          <CardTitle className="text-[13px] font-md flex items-center gap-1.5"><FileText size={13} className="text-zinc-500" /> Quotations</CardTitle>
          <Button size="sm" onClick={handleGenerateQuotation} disabled={busy === 'quotation'} className="h-7 text-[11px] bg-zinc-900 hover:bg-zinc-800 text-white">
            {busy === 'quotation' ? <Loader2 size={12} className="animate-spin mr-1" /> : null} Generate Quotation
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-zinc-100">
            {(quotations || []).map((q: any) => (
              <div key={q._id} className="px-4 py-2.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-medium text-zinc-900">{q.quotationNumber} · {formatMoney(q.totalAmount, q.currency)}</p>
                  <p className="text-[10px] text-zinc-400">{q.status} · valid until {q.validUntil ? new Date(q.validUntil).toLocaleDateString() : '—'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <a href={q.pdfUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-700">PDF</a>
                  <Button size="sm" variant="outline" disabled={busy === `send-qtn-${q._id}`} onClick={() => handleSendQuotation(q._id)} className="h-6 text-[10px] px-2">
                    <Send size={10} className="mr-1" /> Send
                  </Button>
                </div>
              </div>
            ))}
            {(quotations || []).length === 0 && <div className="p-6 text-center text-zinc-400 text-[11px]">No quotations generated yet.</div>}
          </div>
        </CardContent>
      </Card>

      <Card className="border-zinc-200/80 shadow-sm rounded-lg overflow-hidden">
        <CardHeader className="px-4 py-3 border-b border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[13px] font-md flex items-center gap-1.5"><Receipt size={13} className="text-zinc-500" /> Invoices</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleGenerateInvoice('SETUP_FEE')} disabled={busy === 'invoice-SETUP_FEE'} className="h-7 text-[11px]">Generate Setup Fee Invoice</Button>
              <Button size="sm" variant="outline" onClick={() => handleGenerateInvoice('SUBSCRIPTION')} disabled={busy === 'invoice-SUBSCRIPTION'} className="h-7 text-[11px]">Generate Subscription Invoice</Button>
            </div>
          </div>
          <input
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="Coupon code (optional) — applies to the next invoice generated"
            className="mt-2 h-7 w-full border border-zinc-200 rounded-lg text-[11px] px-2.5"
          />
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-zinc-100">
            {(invoices || []).map((inv: any) => (
              <div key={inv._id} className="px-4 py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-medium text-zinc-900">
                    {inv.invoiceNumber} · {inv.type === 'SETUP_FEE' ? 'Setup Fee' : 'Subscription'}
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    Subtotal {formatMoney(inv.amount, inv.currency)}
                    {inv.discountAmount > 0 && <> · Discount -{formatMoney(inv.discountAmount, inv.currency)}{inv.couponCode ? ` (${inv.couponCode})` : ''}</>}
                    {inv.taxAmount > 0 && <> · GST ({inv.taxRate}%) {formatMoney(inv.taxAmount, inv.currency)}</>}
                    {' · '}<strong>Total {formatMoney(inv.totalAmount, inv.currency)}</strong>
                  </p>
                  <p className="text-[10px] mt-0.5">
                    <span className={`px-1.5 py-0.5 rounded font-medium ${STATUS_COLOR[inv.status]}`}>{inv.status}</span>
                    <span className="text-zinc-400 ml-1.5">Paid {formatMoney(inv.amountPaid, inv.currency)} of {formatMoney(inv.totalAmount, inv.currency)}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a href={inv.pdfUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-700">PDF</a>
                  <Button size="sm" variant="outline" disabled={busy === `send-inv-${inv._id}`} onClick={() => handleSendInvoice(inv._id)} className="h-6 text-[10px] px-2">
                    <Send size={10} className="mr-1" /> Send
                  </Button>
                  {inv.status !== 'PAID' && (
                    <>
                      <Button size="sm" disabled={busy === `checkout-${inv._id}`} onClick={() => handleCheckout(inv._id, 'RAZORPAY')} className="h-6 text-[10px] px-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                        <CreditCard size={10} className="mr-1" /> Razorpay
                      </Button>
                      <Button size="sm" disabled={busy === `checkout-${inv._id}`} onClick={() => handleCheckout(inv._id, 'STRIPE')} className="h-6 text-[10px] px-2 bg-violet-600 hover:bg-violet-700 text-white">
                        <CreditCard size={10} className="mr-1" /> Stripe
                      </Button>
                    </>
                  )}
                  <select
                    value={statusOverride[inv._id] || ''}
                    onChange={(e) => setStatusOverride((prev) => ({ ...prev, [inv._id]: e.target.value }))}
                    className="h-6 border border-zinc-200 rounded text-[10px] px-1"
                  >
                    <option value="">Set status...</option>
                    {INVOICE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <Button size="sm" variant="outline" disabled={!statusOverride[inv._id] || busy === `status-${inv._id}`} onClick={() => handleStatusOverride(inv._id)} className="h-6 text-[10px] px-2">Apply</Button>
                </div>
              </div>
            ))}
            {(invoices || []).length === 0 && <div className="p-6 text-center text-zinc-400 text-[11px]">No invoices generated yet.</div>}
          </div>
        </CardContent>
      </Card>

      <Card className={`border-zinc-200/80 shadow-sm rounded-lg ${canProvision ? 'ring-1 ring-emerald-200' : ''}`}>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-md text-zinc-700 flex items-center gap-1.5"><Rocket size={13} className="text-emerald-500" /> Provision Workspace</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              {canProvision ? 'Setup fee and subscription are paid — ready to provision.' : `Waiting on: ${[!setupPaid && 'Setup Fee', !subscriptionPaid && 'Subscription'].filter(Boolean).join(' and ')}`}
            </p>
            {provisionResult && (
              <p className={`text-[11px] mt-1 ${provisionResult.ok ? 'text-emerald-600' : 'text-rose-600'}`}>{provisionResult.message}</p>
            )}
          </div>
          <Button onClick={handleProvision} disabled={!canProvision || busy === 'provision'} className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40">
            {busy === 'provision' ? <Loader2 size={13} className="animate-spin mr-1" /> : null} Provision Workspace
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
