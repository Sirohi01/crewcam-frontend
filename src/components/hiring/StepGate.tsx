'use client';

import { LockKeyhole, Unlock } from 'lucide-react';

interface StepGateProps {
  unlocked?: boolean;
  blockedBy?: string[];
  compact?: boolean;
}

const formatBlocker = (blocker: string) =>
  blocker
    .replace(':rejected', ' rejected')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase());

export default function StepGate({ unlocked = false, blockedBy = [], compact = false }: StepGateProps) {
  if (unlocked) {
    return (
      <div className={`flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 ${compact ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm'}`}>
        <Unlock size={compact ? 14 : 16} />
        <span className="font-md">Unlocked</span>
      </div>
    );
  }

  return (
    <div className={`rounded-md border border-amber-200 bg-amber-50 text-amber-800 ${compact ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm'}`}>
      <div className="flex items-center gap-2 font-md">
        <LockKeyhole size={compact ? 14 : 16} />
        <span>Locked</span>
      </div>
      {!compact && blockedBy.length > 0 && (
        <div className="mt-2 text-xs text-amber-700">
          Complete first: {blockedBy.map(formatBlocker).join(', ')}
        </div>
      )}
    </div>
  );
}
