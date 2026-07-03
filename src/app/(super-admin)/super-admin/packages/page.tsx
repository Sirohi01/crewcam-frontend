'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil } from 'lucide-react';
import api from '@/lib/axios';

export default function SuperAdminPackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Package Management</h1>
          <p className="text-xs text-zinc-500">Manage subscription packages, per-user pricing, setup fees, and AI credits.</p>
        </div>
        <Button asChild className="h-8 text-xs bg-indigo-600 text-white hover:bg-indigo-700">
          <Link href="/super-admin/packages/new"><Plus size={14} className="mr-1" /> Add Package</Link>
        </Button>
      </div>

      <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
        <CardContent className="p-0">
          <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2 bg-zinc-50 dark:bg-zinc-900 flex gap-4 text-xs font-md text-zinc-500">
            <div className="w-1/6">PACKAGE NAME</div>
            <div className="w-[10%]">TIER</div>
            <div className="w-[10%]">MAX USERS</div>
            <div className="w-[17%]">PER USER / MONTH</div>
            <div className="w-[17%]">PER USER / YEAR</div>
            <div className="w-[13%]">SETUP FEE</div>
            <div className="w-[13%]">FREE AI CREDITS</div>
            <div className="flex-1 text-right">STATUS</div>
            <div className="w-12"></div>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {packages.map((p: any) => (
              <div key={p._id} className="px-4 py-2.5 flex items-center gap-4 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                <div className="w-1/6 font-medium">{p.name}</div>
                <div className="w-[10%]">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-700">{p.tier || 'CUSTOM'}</span>
                </div>
                <div className="w-[10%] text-zinc-500">{p.maxUsers}</div>
                <div className="w-[17%] text-zinc-500">₹{p.pricePerUserMonthlyINR || 0} / ${p.pricePerUserMonthlyUSD || 0}</div>
                <div className="w-[17%] text-zinc-500">₹{p.pricePerUserYearlyINR || 0} / ${p.pricePerUserYearlyUSD || 0}</div>
                <div className="w-[13%] text-zinc-500">₹{p.setupFeeINR || 0}</div>
                <div className="w-[13%] text-zinc-500">{p.freeAiCredits || 0}</div>
                <div className="flex-1 text-right">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${p.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {p.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="w-12 text-right">
                  <Link href={`/super-admin/packages/${p._id}/edit`} className="inline-flex text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-md transition-colors" title="Edit package">
                    <Pencil size={14} />
                  </Link>
                </div>
              </div>
            ))}
            {packages.length === 0 && (
              <div className="p-8 text-center text-zinc-500 text-sm">No packages found. Create one.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
