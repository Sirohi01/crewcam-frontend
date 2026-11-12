'use client';

import React from 'react';
import toast from 'react-hot-toast';
import { Copy } from 'lucide-react';

// Changing the salary account is the classic payroll-fraud vector, so employees can't
// edit bank details directly: they send a change request that HR verifies and approves
// (Phase 1E, ChangeRequestDialog).
export const HR_MANAGED_BANK = 'To add or change your salary account, send a change request; HR verifies and approves it.';

const copyToClipboard = async (label: string, value?: string) => {
  if (!value) return;
  try {
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copied`);
  } catch {
    toast.error('Could not copy');
  }
};

/** One "label / value" row of the bank account grid, optionally with a copy button. */
export function BankField({ label, value, copyable }: { label: string; value?: string; copyable?: boolean }) {
  return (
    <div className={`grid grid-cols-5 ${copyable ? 'items-center' : ''}`}>
      <span className="col-span-2 text-zinc-500">{label}</span>
      {copyable ? (
        <div className="col-span-3 flex items-center gap-1.5">
          <span className="font-medium text-zinc-900">{value || '—'}</span>
          {value && (
            <button aria-label={`Copy ${label}`} onClick={() => copyToClipboard(label, value)} className="rounded bg-blue-50/50 border border-blue-100 p-0.5 text-[#1d4ed8] hover:bg-blue-100">
              <Copy size={10} />
            </button>
          )}
        </div>
      ) : (
        <span className="col-span-3 font-medium text-zinc-900 whitespace-pre-line leading-tight">{value || '—'}</span>
      )}
    </div>
  );
}

export function BankBadge({ children, tone = 'green' }: { children: React.ReactNode; tone?: 'green' | 'amber' | 'grey' }) {
  const tones = {
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    grey: 'bg-zinc-100 text-zinc-500 border-zinc-200',
  };
  return <span className={`col-span-3 inline-block w-max rounded px-2 py-0.5 text-[10px] font-semibold border ${tones[tone]}`}>{children}</span>;
}
