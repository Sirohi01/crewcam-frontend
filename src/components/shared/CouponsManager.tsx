'use client';
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, X, Tag } from 'lucide-react';
import api from '@/lib/axios';

const EMPTY_FORM = {
  code: '', type: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED', value: '' as number | '',
  appliesTo: 'BOTH' as 'SETUP_FEE' | 'SUBSCRIPTION' | 'BOTH',
  maxRedemptions: '' as number | '', validFrom: '', validUntil: '',
};

export function CouponsManager() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const { data: coupons, isLoading } = useQuery({
    queryKey: ['super-admin', 'coupons'],
    queryFn: async () => (await api.get('/super-admin/coupons')).data,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['super-admin', 'coupons'] });

  const openCreate = () => { setFormData(EMPTY_FORM); setError(''); setIsModalOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/super-admin/coupons', {
        ...formData,
        value: Number(formData.value) || 0,
        maxRedemptions: formData.maxRedemptions === '' ? undefined : Number(formData.maxRedemptions),
        validFrom: formData.validFrom || undefined,
        validUntil: formData.validUntil || undefined,
      });
      setIsModalOpen(false);
      invalidate();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleToggleActive = async (coupon: any) => {
    await api.put(`/super-admin/coupons/${coupon._id}`, { isActive: !coupon.isActive });
    invalidate();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    await api.delete(`/super-admin/coupons/${id}`);
    invalidate();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-md text-zinc-900">Coupons</h2>
          <p className="text-xs text-zinc-500">Discount codes applicable to setup fee and/or subscription invoices.</p>
        </div>
        <Button onClick={openCreate} className="h-8 text-xs bg-zinc-900 text-white hover:bg-zinc-800">
          <Plus size={14} className="mr-1" /> Add Coupon
        </Button>
      </div>

      <Card className="border-zinc-200 shadow-sm">
        <CardContent className="p-0">
          <div className="border-b border-zinc-200 px-4 py-2 bg-zinc-50 flex gap-4 text-xs font-md text-zinc-500">
            <div className="w-1/6">CODE</div>
            <div className="w-1/6">DISCOUNT</div>
            <div className="w-1/6">APPLIES TO</div>
            <div className="w-1/6">REDEMPTIONS</div>
            <div className="w-1/6">VALID UNTIL</div>
            <div className="flex-1 text-right">STATUS</div>
            <div className="w-12"></div>
          </div>
          <div className="divide-y divide-zinc-100">
            {(coupons || []).map((c: any) => (
              <div key={c._id} className="px-4 py-2.5 flex items-center gap-4 text-sm hover:bg-zinc-50">
                <div className="w-1/6 font-medium flex items-center gap-1.5"><Tag size={12} className="text-indigo-500" /> {c.code}</div>
                <div className="w-1/6 text-zinc-500">{c.type === 'PERCENTAGE' ? `${c.value}%` : `₹${c.value}`}</div>
                <div className="w-1/6 text-zinc-500 text-xs">{c.appliesTo}</div>
                <div className="w-1/6 text-zinc-500">{c.redeemedCount}{c.maxRedemptions ? ` / ${c.maxRedemptions}` : ''}</div>
                <div className="w-1/6 text-zinc-500">{c.validUntil ? new Date(c.validUntil).toLocaleDateString() : '—'}</div>
                <div className="flex-1 text-right">
                  <button onClick={() => handleToggleActive(c)} className={`px-2 py-0.5 rounded text-[10px] font-medium ${c.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-600'}`}>
                    {c.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
                <div className="w-12 text-right">
                  <button onClick={() => handleDelete(c._id)} className="text-zinc-400 hover:text-rose-600 text-xs">Delete</button>
                </div>
              </div>
            ))}
            {!isLoading && (coupons || []).length === 0 && (
              <div className="p-8 text-center text-zinc-500 text-sm">No coupons created yet.</div>
            )}
          </div>
        </CardContent>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-zinc-200/50">
            <div className="px-5 py-4 border-b border-zinc-100 flex justify-between items-center">
              <h2 className="text-sm font-md text-zinc-900">Create Coupon</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-1 rounded-md"><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}
              <div className="space-y-1.5">
                <label className="block text-xs font-md text-zinc-700">Coupon Code *</label>
                <input required value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2 uppercase" placeholder="WELCOME20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-md text-zinc-700">Discount Type</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as any })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2">
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-md text-zinc-700">Value *</label>
                  <input required type="number" min={1} value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value === '' ? '' : Number(e.target.value) })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2" placeholder={formData.type === 'PERCENTAGE' ? 'e.g. 20' : 'e.g. 500'} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-md text-zinc-700">Applies To</label>
                <select value={formData.appliesTo} onChange={(e) => setFormData({ ...formData, appliesTo: e.target.value as any })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2">
                  <option value="BOTH">Both Setup Fee &amp; Subscription</option>
                  <option value="SETUP_FEE">Setup Fee Only</option>
                  <option value="SUBSCRIPTION">Subscription Only</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-md text-zinc-700">Max Redemptions</label>
                  <input type="number" min={1} value={formData.maxRedemptions} onChange={(e) => setFormData({ ...formData, maxRedemptions: e.target.value === '' ? '' : Number(e.target.value) })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2" placeholder="Unlimited" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-md text-zinc-700">Valid From</label>
                  <input type="date" value={formData.validFrom} onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-md text-zinc-700">Valid Until</label>
                  <input type="date" value={formData.validUntil} onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2" />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">Create Coupon</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
