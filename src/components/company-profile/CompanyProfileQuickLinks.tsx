'use client';

import React from 'react';
import { ChevronRight, Users, ShieldCheck, BadgeCheck } from 'lucide-react';

interface QuickLinkItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

interface CompanyProfileQuickLinksProps {
  links?: QuickLinkItem[];
}

const DEFAULT_LINKS: QuickLinkItem[] = [
  { label: 'View Organizational Chart', icon: <Users className="h-4 w-4" /> },
  { label: 'Manage Company Users', icon: <Users className="h-4 w-4" /> },
  { label: 'Manage Roles & Permissions', icon: <ShieldCheck className="h-4 w-4" /> },
  { label: 'Subscription & License', icon: <BadgeCheck className="h-4 w-4" /> },
];

export function CompanyProfileQuickLinks({ links = DEFAULT_LINKS }: CompanyProfileQuickLinksProps) {
  return (
    <div className="space-y-1">
      {links.map((link) => (
        <button
          key={link.label}
          onClick={link.onClick}
          className="flex w-full items-center justify-between rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-50"
        >
          <span className="flex items-center gap-2">
            <span className="text-indigo-500">{link.icon}</span>
            {link.label}
          </span>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </button>
      ))}
    </div>
  );
}