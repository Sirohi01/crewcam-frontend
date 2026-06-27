'use client';
import { PackageForm } from '@/components/shared/PackageForm';

export default function NewPackagePage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Create New Package</h1>
        <p className="text-xs text-zinc-500">Define limits, pricing, AI credits, and modules for this subscription package.</p>
      </div>
      <PackageForm />
    </div>
  );
}
