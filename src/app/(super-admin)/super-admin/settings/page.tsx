'use client';

import React, { useState } from 'react';
import { Package, Image as ImageIcon, Tag } from 'lucide-react';
import SuperAdminPackagesPage from '../packages/page';
import BannersPage from '../banners/page';
import { CouponsManager } from '@/components/shared/CouponsManager';

type Tab = 'packages' | 'banners' | 'coupons';

export default function SuperAdminSettingsPage() {
  const [tab, setTab] = useState<Tab>('packages');

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Platform Settings</h1>
        <p className="text-xs text-zinc-500">Global configuration that applies across every company workspace.</p>
      </div>

      <div className="inline-flex rounded-md border border-zinc-200 bg-white p-0.5">
        <button
          onClick={() => setTab('packages')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded ${tab === 'packages' ? 'bg-indigo-600 text-white' : 'text-zinc-600'}`}
        >
          <Package size={13} /> Packages & Limits
        </button>
        <button
          onClick={() => setTab('banners')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded ${tab === 'banners' ? 'bg-indigo-600 text-white' : 'text-zinc-600'}`}
        >
          <ImageIcon size={13} /> Dashboard Banners
        </button>
        <button
          onClick={() => setTab('coupons')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded ${tab === 'coupons' ? 'bg-indigo-600 text-white' : 'text-zinc-600'}`}
        >
          <Tag size={13} /> Coupons
        </button>
      </div>

      <div>
        {tab === 'packages' && <SuperAdminPackagesPage />}
        {tab === 'banners' && <BannersPage />}
        {tab === 'coupons' && <CouponsManager />}
      </div>
    </div>
  );
}
