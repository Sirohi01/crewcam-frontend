'use client';

import React from 'react';

interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  icon,
  action,
  children,
  className = '',
}: SectionCardProps) {
  return (
    <div
      className={`flex h-full flex-col rounded-xl border border-slate-200 bg-white p-3 ${className}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">{icon}</span>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        </div>
        {action}
      </div>

      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}