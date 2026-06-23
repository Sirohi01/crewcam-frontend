'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Construction } from 'lucide-react';

/**
 * Placeholder destination for sidebar items whose page/API isn't built yet.
 * The full menu is seeded now (docs/03_ROLES_DASHBOARDS_PERMISSIONS.md) so scope
 * stays visible; each item lands on a real page as its owning module phase ships.
 */
export default function ComingSoon() {
  const params = useSearchParams();
  const feature = params.get('feature') || 'This feature';
  const module = params.get('module');

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300 pb-6 max-w-[700px] mx-auto pt-12">
      <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800">
        <CardHeader className="items-center text-center py-8">
          <Construction size={28} className="text-zinc-400 mb-2" />
          <CardTitle className="text-base">{feature}</CardTitle>
          <CardDescription>
            {module ? `Part of ${module}. ` : ''}This page is on the build roadmap — it appears in the menu now so the
            full scope stays visible, and it will be wired up to a real page and API as its phase ships.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
