'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, X, Pencil } from 'lucide-react';
import api from '@/lib/axios';

const EMPTY_FORM = {
  name: '', description: '',
  maxCompanies: 1, maxBranches: 1, maxDepartments: 5, maxDesignations: 10, maxUsers: 10,
  features: [] as string[],
};

// Each label's normalized form (lowercase, alphanumeric-only — see backend's
// requireFeature()/visibilityFilter.ts normalize()) must exactly match what a route or
// sidebar item actually checks for. "AI Hiring" -> "aihiring" matches requireFeature('ai-hiring').
const AVAILABLE_MODULES = [
  'Core HR', 'Attendance', 'Meetings', 'Communication', 'PMS',
  'Hiring (ATS)', 'Accounts', 'Assets', 'Helpdesk', 'LMS',
  'Integrations', 'Whitelabel', 'Live Tracking', 'AI Hiring', 'AI Employee Summary',
];

export default function SuperAdminPackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  // Features a package already has that aren't represented by any checkbox above (e.g. set
  // directly via API/DB) — preserved on save instead of being silently dropped.
  const [otherFeatures, setOtherFeatures] = useState<string[]>([]);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [basePrice, setBasePrice] = useState<number | ''>('');
  const [formData, setFormData] = useState(EMPTY_FORM);

  const handleFeatureToggle = (module: string) => {
    setFormData(prev => {
      const isSelected = prev.features.includes(module);
      return {
        ...prev,
        features: isSelected
          ? prev.features.filter(f => f !== module)
          : [...prev.features, module]
      };
    });
  };

  const openCreateModal = () => {
    setEditingId(null);
    setOtherFeatures([]);
    setFormData(EMPTY_FORM);
    setCurrency('INR');
    setBasePrice('');
    setIsModalOpen(true);
  };

  const openEditModal = (pkg: any) => {
    setEditingId(pkg._id);
    const known = new Set(AVAILABLE_MODULES);
    setOtherFeatures((pkg.features || []).filter((f: string) => !known.has(f)));
    setFormData({
      name: pkg.name || '',
      description: pkg.description || '',
      maxCompanies: pkg.maxCompanies || 1,
      maxBranches: pkg.maxBranches || 1,
      maxDepartments: pkg.maxDepartments || 5,
      maxDesignations: pkg.maxDesignations || 10,
      maxUsers: pkg.maxUsers || 10,
      features: (pkg.features || []).filter((f: string) => known.has(f)),
    });
    setCurrency('INR');
    setBasePrice(pkg.priceINR ?? '');
    setIsModalOpen(true);
  };

  const conversionRate = parseFloat(process.env.NEXT_PUBLIC_USD_TO_INR_RATE || '83.5');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await api.get('/super-admin/packages');
      setPackages(res.data || res.data?.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const priceINR = currency === 'INR' ? Number(basePrice) : Math.round(Number(basePrice) * conversionRate);
      const priceUSD = currency === 'USD' ? Number(basePrice) : Number((Number(basePrice) / conversionRate).toFixed(2));

      const payload = {
        ...formData,
        priceINR,
        priceUSD,
        features: [...formData.features, ...otherFeatures],
      };

      if (editingId) {
        await api.put(`/super-admin/packages/${editingId}`, payload);
      } else {
        await api.post('/super-admin/packages', payload);
      }

      setIsModalOpen(false);
      setEditingId(null);
      setOtherFeatures([]);
      setFormData(EMPTY_FORM);
      setBasePrice('');
      fetchPackages();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Package Management</h1>
          <p className="text-xs text-zinc-500">Manage subscription packages and their features.</p>
        </div>
        <Button onClick={openCreateModal} className="h-8 text-xs bg-zinc-900 text-white hover:bg-zinc-800">
          <Plus size={14} className="mr-1" /> Add Package
        </Button>
      </div>

      <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
        <CardContent className="p-0">
          <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2 bg-zinc-50 dark:bg-zinc-900 flex gap-4 text-xs font-md text-zinc-500">
            <div className="w-1/3">PACKAGE NAME</div>
            <div className="w-1/4">MAX USERS</div>
            <div className="w-1/4">PRICE (INR/USD)</div>
            <div className="flex-1 text-right">STATUS</div>
            <div className="w-12"></div>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {packages.map((p: any) => (
              <div key={p._id} className="px-4 py-2.5 flex items-center gap-4 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                <div className="w-1/3 font-medium">{p.name}</div>
                <div className="w-1/4 text-zinc-500">{p.maxUsers}</div>
                <div className="w-1/4 text-zinc-500">₹{p.priceINR} / ${p.priceUSD}</div>
                <div className="flex-1 text-right">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${p.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {p.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="w-12 text-right">
                  <button onClick={() => openEditModal(p)} className="text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-md transition-colors" title="Edit package">
                    <Pencil size={14} />
                  </button>
                </div>
              </div>
            ))}
            {packages.length === 0 && (
              <div className="p-8 text-center text-zinc-500 text-sm">No packages found. Create one.</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Premium Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm transition-all duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-zinc-200/50 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-zinc-100 flex justify-between items-center bg-white">
              <h2 className="text-sm font-md text-zinc-900">{editingId ? 'Edit Package' : 'Create New Package'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-1 rounded-md transition-colors">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-md text-zinc-700">Package Name</label>
                <input required value={formData.name} onChange={(e: any) => setFormData({ ...formData, name: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-zinc-300" placeholder="Basic, Pro, Enterprise..." />
              </div>
              <div className="flex gap-4">
                <div className="space-y-1.5 w-1/3">
                  <label className="block text-xs font-md text-zinc-700">Max Companies</label>
                  <input required type="number" min={1} value={formData.maxCompanies || ''} onChange={(e: any) => setFormData({ ...formData, maxCompanies: e.target.value === '' ? '' as any : parseInt(e.target.value) })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-zinc-300" />
                </div>
                <div className="space-y-1.5 w-1/3">
                  <label className="block text-xs font-md text-zinc-700">Max Branches</label>
                  <input required type="number" min={1} value={formData.maxBranches || ''} onChange={(e: any) => setFormData({ ...formData, maxBranches: e.target.value === '' ? '' as any : parseInt(e.target.value) })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-zinc-300" />
                </div>
                <div className="space-y-1.5 w-1/3">
                  <label className="block text-xs font-md text-zinc-700">Max Departments</label>
                  <input required type="number" min={1} value={formData.maxDepartments || ''} onChange={(e: any) => setFormData({ ...formData, maxDepartments: e.target.value === '' ? '' as any : parseInt(e.target.value) })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-zinc-300" />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="space-y-1.5 w-1/3">
                  <label className="block text-xs font-md text-zinc-700">Max Designations</label>
                  <input required type="number" min={1} value={formData.maxDesignations || ''} onChange={(e: any) => setFormData({ ...formData, maxDesignations: e.target.value === '' ? '' as any : parseInt(e.target.value) })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-zinc-300" />
                </div>
                <div className="space-y-1.5 w-1/3">
                  <label className="block text-xs font-md text-zinc-700">Total Max Users</label>
                  <input required type="number" min={1} value={formData.maxUsers || ''} onChange={(e: any) => setFormData({ ...formData, maxUsers: e.target.value === '' ? '' as any : parseInt(e.target.value) })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-zinc-300" />
                </div>
                <div className="space-y-1.5 w-1/3">
                  <label className="block text-xs font-md text-zinc-700">Currency</label>
                  <select value={currency} onChange={(e: any) => setCurrency(e.target.value)} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-zinc-300 bg-transparent">
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-md text-zinc-700">Price ({currency})</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-zinc-500 text-sm">{currency === 'INR' ? '₹' : '$'}</span>
                  <input required type="number" min={0} step="any" value={basePrice} onChange={(e: any) => setBasePrice(e.target.value)} className="w-full border border-zinc-200 rounded-lg text-sm pl-7 pr-3.5 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-zinc-300" placeholder="0.00" />
                </div>
                {basePrice !== '' && (
                  <p className="text-[10px] text-zinc-500 px-1">
                    Auto-converted: {currency === 'INR' ? `$${(Number(basePrice) / conversionRate).toFixed(2)}` : `₹${Math.round(Number(basePrice) * conversionRate)}`} (Rate: {conversionRate})
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-md text-zinc-700">Included Modules</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {AVAILABLE_MODULES.map(module => (
                    <label key={module} className="flex items-center gap-2 text-xs text-zinc-600 cursor-pointer p-2 border border-zinc-100 rounded-md hover:bg-zinc-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.features.includes(module)}
                        onChange={() => handleFeatureToggle(module)}
                        className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      {module}
                    </label>
                  ))}
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-3">
                <Button type="button" variant="outline" className="h-9 px-4 text-xs font-medium border-zinc-200" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="h-9 px-4 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20">{editingId ? 'Save Changes' : 'Create Package'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
