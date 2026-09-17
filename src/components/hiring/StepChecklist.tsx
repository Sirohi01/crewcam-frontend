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
    <div className="rounded-[2px] border border-slate-200 shadow-sm bg-white overflow-hidden">
      <div className="pb-2 pt-3 px-3.5 border-b border-slate-100">
        <h4 className="text-xs font-bold text-[#0d3c68] uppercase tracking-tight">Step Checklist</h4>
      </div>
      <div className="p-3 space-y-2.5">
        {visibleItems.map((item) => (
          <div key={item.item} className="flex items-center justify-between gap-2.5 text-xs">
            <div className="flex min-w-0 items-center gap-2">
              {item.done ? (
                <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
              ) : (
                <Circle size={15} className="shrink-0 text-slate-300" />
              )}
              <span className={`text-[11px] font-medium leading-tight ${item.done ? 'text-slate-800' : 'text-slate-400'}`}>
                {item.item}
              </span>
            </div>
            {item.doneAt && <span className="shrink-0 text-[10px] text-slate-400 font-mono">{new Date(item.doneAt).toLocaleDateString('en-GB')}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
