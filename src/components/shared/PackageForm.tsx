'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';

// Each label's normalized form (lowercase, alphanumeric-only — see backend's
// requireFeature()/visibilityFilter.ts normalize()) must exactly match what a route or
// sidebar item actually checks for. "AI Hiring" -> "aihiring" matches requireFeature('ai-hiring').
const AVAILABLE_MODULES = [
  'Core HR', 'Attendance', 'Meetings', 'Communication', 'PMS',
  'Hiring (ATS)', 'Accounts', 'Assets', 'Helpdesk', 'LMS',
  'Integrations', 'Whitelabel', 'Live Tracking', 'AI Hiring', 'AI Employee Summary',
];

const PACKAGE_TIERS = ['BASIC', 'PROFESSIONAL', 'ENTERPRISE', 'CUSTOM'] as const;

const EMPTY_FORM = {
  name: '', tier: 'CUSTOM' as typeof PACKAGE_TIERS[number], description: '',
  maxCompanies: 1, maxBranches: 1, maxDepartments: 5, maxDesignations: 10, maxUsers: 10,
  features: [] as string[],
};

interface PackageFormProps {
  packageId?: string;
  initial?: any;
}

export function PackageForm({ packageId, initial }: PackageFormProps) {
  const router = useRouter();
  const known = new Set(AVAILABLE_MODULES);

  const [formData, setFormData] = useState(() => initial ? {
    name: initial.name || '',
    tier: initial.tier || 'CUSTOM',
    description: initial.description || '',
    maxCompanies: initial.maxCompanies || 1,
    maxBranches: initial.maxBranches || 1,
    maxDepartments: initial.maxDepartments || 5,
    maxDesignations: initial.maxDesignations || 10,
    maxUsers: initial.maxUsers || 10,
    features: (initial.features || []).filter((f: string) => known.has(f)),
  } : EMPTY_FORM);

  const [otherFeatures] = useState<string[]>(() => (initial?.features || []).filter((f: string) => !known.has(f)));
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [pricePerUserMonthly, setPricePerUserMonthly] = useState<number | ''>(initial?.pricePerUserMonthlyINR ?? '');
  const [pricePerUserYearly, setPricePerUserYearly] = useState<number | ''>(initial?.pricePerUserYearlyINR ?? '');
  const [setupFee, setSetupFee] = useState<number | ''>(initial?.setupFeeINR ?? '');
  const [freeAiCredits, setFreeAiCredits] = useState<number | ''>(initial?.freeAiCredits ?? 0);
  const [aiCreditTopUpPrice, setAiCreditTopUpPrice] = useState<number | ''>(initial?.aiCreditTopUpPriceINR ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const conversionRate = parseFloat(process.env.NEXT_PUBLIC_USD_TO_INR_RATE || '83.5');
  const toBoth = (amount: number) => currency === 'INR'
    ? { inr: Math.round(amount), usd: Number((amount / conversionRate).toFixed(2)) }
    : { inr: Math.round(amount * conversionRate), usd: Number(amount.toFixed(2)) };

  const handleFeatureToggle = (module: string) => {
    setFormData((prev: any) => {
      const isSelected = prev.features.includes(module);
      return { ...prev, features: isSelected ? prev.features.filter((f: string) => f !== module) : [...prev.features, module] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const monthly = toBoth(Number(pricePerUserMonthly) || 0);
      const yearly = toBoth(Number(pricePerUserYearly) || 0);
      const setup = toBoth(Number(setupFee) || 0);
      const topUp = toBoth(Number(aiCreditTopUpPrice) || 0);

      const payload = {
        ...formData,
        pricePerUserMonthlyINR: monthly.inr,
        pricePerUserMonthlyUSD: monthly.usd,
        pricePerUserYearlyINR: yearly.inr,
        pricePerUserYearlyUSD: yearly.usd,
        setupFeeINR: setup.inr,
        setupFeeUSD: setup.usd,
        freeAiCredits: Number(freeAiCredits) || 0,
        aiCreditTopUpPriceINR: topUp.inr,
        aiCreditTopUpPriceUSD: topUp.usd,
        features: [...formData.features, ...otherFeatures],
      };

      if (packageId) {
        await api.put(`/super-admin/packages/${packageId}`, payload);
      } else {
        await api.post('/super-admin/packages', payload);
      }
      router.push('/super-admin/packages');
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to save package');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}

      <section className="space-y-4">
        <h3 className="text-xs font-md uppercase tracking-wider text-zinc-500">Basics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-md text-zinc-700">Package Name *</label>
            <input required value={formData.name} onChange={(e: any) => setFormData({ ...formData, name: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="Basic, Professional, Enterprise..." />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-md text-zinc-700">Tier</label>
            <select value={formData.tier} onChange={(e: any) => setFormData({ ...formData, tier: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2">
              {PACKAGE_TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <p className="text-[10px] text-zinc-400">Used to determine Upgrade vs Downgrade when a company changes plans.</p>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-md text-zinc-700">Description</label>
          <textarea value={formData.description} onChange={(e: any) => setFormData({ ...formData, description: e.target.value })} rows={2} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2" />
        </div>
      </section>

      <section className="space-y-4 pt-4 border-t border-zinc-100">
        <h3 className="text-xs font-md uppercase tracking-wider text-zinc-500">Limits</h3>
        <div className="grid grid-cols-5 gap-4">
          {[
            ['maxCompanies', 'Max Companies'],
            ['maxBranches', 'Max Branches'],
            ['maxDepartments', 'Max Departments'],
            ['maxDesignations', 'Max Designations'],
            ['maxUsers', 'Total Max Users'],
          ].map(([key, label]) => (
            <div key={key} className="space-y-1.5">
              <label className="block text-xs font-md text-zinc-700">{label}</label>
              <input required type="number" min={1} value={(formData as any)[key] || ''} onChange={(e: any) => setFormData({ ...formData, [key]: e.target.value === '' ? '' : parseInt(e.target.value) })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2" />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 pt-4 border-t border-zinc-100">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-md uppercase tracking-wider text-zinc-500">Pricing</h3>
          <select value={currency} onChange={(e: any) => setCurrency(e.target.value)} className="border border-zinc-200 rounded-lg text-xs px-2.5 py-1.5">
            <option value="INR">Enter in INR (₹)</option>
            <option value="USD">Enter in USD ($)</option>
          </select>
        </div>
        <p className="text-[10px] text-zinc-400">Subscription is billed per user. The total a company pays each cycle = this price × the company's licensed user count, based on whichever billing cycle (monthly/yearly) is chosen for that company.</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-md text-zinc-700">Price per User / Month</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-zinc-500 text-sm">{currency === 'INR' ? '₹' : '$'}</span>
              <input type="number" min={0} step="any" value={pricePerUserMonthly} onChange={(e: any) => setPricePerUserMonthly(e.target.value)} className="w-full border border-zinc-200 rounded-lg text-sm pl-7 pr-3.5 py-2" placeholder="0.00" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-md text-zinc-700">Price per User / Year</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-zinc-500 text-sm">{currency === 'INR' ? '₹' : '$'}</span>
              <input type="number" min={0} step="any" value={pricePerUserYearly} onChange={(e: any) => setPricePerUserYearly(e.target.value)} className="w-full border border-zinc-200 rounded-lg text-sm pl-7 pr-3.5 py-2" placeholder="0.00" />
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-md text-zinc-700">One-Time Setup Fee</label>
          <div className="relative max-w-xs">
            <span className="absolute left-3 top-2 text-zinc-500 text-sm">{currency === 'INR' ? '₹' : '$'}</span>
            <input type="number" min={0} step="any" value={setupFee} onChange={(e: any) => setSetupFee(e.target.value)} className="w-full border border-zinc-200 rounded-lg text-sm pl-7 pr-3.5 py-2" placeholder="0.00" />
          </div>
          <p className="text-[10px] text-zinc-400">Auto-fills the Billing tab when this package is selected while creating a company.</p>
        </div>
      </section>

      <section className="space-y-4 pt-4 border-t border-zinc-100">
        <h3 className="text-xs font-md uppercase tracking-wider text-zinc-500">AI Credits</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-md text-zinc-700">Free AI Credits (included)</label>
            <input type="number" min={0} value={freeAiCredits} onChange={(e: any) => setFreeAiCredits(e.target.value === '' ? '' : Number(e.target.value))} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2" />
            <p className="text-[10px] text-zinc-400">Given free with every company on this package.</p>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-md text-zinc-700">Extra Credit Top-Up Price (per credit)</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-zinc-500 text-sm">{currency === 'INR' ? '₹' : '$'}</span>
              <input type="number" min={0} step="any" value={aiCreditTopUpPrice} onChange={(e: any) => setAiCreditTopUpPrice(e.target.value)} className="w-full border border-zinc-200 rounded-lg text-sm pl-7 pr-3.5 py-2" placeholder="0.00" />
            </div>
            <p className="text-[10px] text-zinc-400">Charged separately when a company buys credits beyond the free allowance — never deducted from the setup fee.</p>
          </div>
        </div>
      </section>

      <section className="space-y-3 pt-4 border-t border-zinc-100">
        <h3 className="text-xs font-md uppercase tracking-wider text-zinc-500">Included Modules</h3>
        <div className="grid grid-cols-3 gap-2">
          {AVAILABLE_MODULES.map(module => (
            <label key={module} className="flex items-center gap-2 text-xs text-zinc-600 cursor-pointer p-2 border border-zinc-100 rounded-md hover:bg-zinc-50 transition-colors">
              <input type="checkbox" checked={formData.features.includes(module)} onChange={() => handleFeatureToggle(module)} className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600" />
              {module}
            </label>
          ))}
        </div>
      </section>

      <div className="pt-4 border-t border-zinc-100 flex justify-end gap-3">
        <Button type="button" variant="outline" className="h-9 px-4 text-xs font-medium border-zinc-200" onClick={() => router.push('/super-admin/packages')}>Cancel</Button>
        <Button type="submit" disabled={submitting} className="h-9 px-4 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 disabled:opacity-60">
          {submitting ? 'Saving...' : packageId ? 'Save Changes' : 'Create Package'}
        </Button>
      </div>
    </form>
  );
}
