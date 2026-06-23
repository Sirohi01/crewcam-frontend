'use client';

import { CheckCircle2, Circle } from 'lucide-react';

export interface PipelineChecklistItem {
  item: string;
  done: boolean;
  doneAt?: string;
}

interface StepChecklistProps {
  items?: PipelineChecklistItem[];
}

export default function StepChecklist({ items = [] }: StepChecklistProps) {
  const visibleItems = items.length > 0
    ? items
    : [
      { item: 'Required fields submitted', done: false },
      { item: 'Required attachments uploaded', done: false },
      { item: 'Required approval obtained', done: false },
      { item: 'Audit entry recorded', done: false },
    ];

  return (
    <div className="rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-2 text-xs font-md uppercase text-zinc-500">Step Checklist</div>
      <div className="space-y-2">
        {visibleItems.map((item) => (
          <div key={item.item} className="flex items-center justify-between gap-3 text-sm">
            <div className="flex min-w-0 items-center gap-2">
              {item.done ? (
                <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
              ) : (
                <Circle size={16} className="shrink-0 text-zinc-300" />
              )}
              <span className={item.done ? 'text-zinc-800 dark:text-zinc-100' : 'text-zinc-500'}>
                {item.item}
              </span>
            </div>
            {item.doneAt && <span className="shrink-0 text-[11px] text-zinc-400">{new Date(item.doneAt).toLocaleDateString()}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
