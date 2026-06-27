'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  note?: string;
}

export function EmptyState({ icon, title, description, note }: EmptyStateProps) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">{title}</h1>
        <p className="text-xs text-zinc-500">{description}</p>
      </div>

      <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
        <CardContent className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10">
            {icon}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-md text-zinc-700 dark:text-zinc-200">Module not yet provisioned</p>
            <p className="max-w-md text-xs text-zinc-500">
              {note || 'This section is reserved for an upcoming build phase. It will go live once its backend (data model, API, and workflows) is implemented — no preview or placeholder data is shown here.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
