'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PackageForm } from '@/components/shared/PackageForm';
import api from '@/lib/axios';

export default function EditPackagePage() {
  const params = useParams();
  const id = params.id as string;
  const [pkg, setPkg] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/super-admin/packages/${id}`)
      .then((res) => setPkg(res.data))
      .catch((e) => setError(e?.response?.data?.message || 'Failed to load package'));
  }, [id]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Edit Package</h1>
        <p className="text-xs text-zinc-500">Update limits, pricing, AI credits, and modules for this subscription package.</p>
      </div>
      {error && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}
      {pkg && <PackageForm packageId={id} initial={pkg} />}
    </div>
  );
}
