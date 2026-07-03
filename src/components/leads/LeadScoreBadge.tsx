'use client';
import React from 'react';
import { Star } from 'lucide-react';

export default function LeadScoreBadge({ score }: { score: number }) {
  const filled = Math.round(score / 20);
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={11} className={i < filled ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'} />
        ))}
      </div>
      <span className="text-[10px] text-zinc-500">{score}</span>
    </div>
  );
}
