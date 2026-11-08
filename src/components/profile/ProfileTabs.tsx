'use client';

import React from 'react';
import Link from 'next/link';
import { User, Users, Landmark, GraduationCap, Briefcase, FileText, Activity, Box, ShieldAlert, PlusCircle } from 'lucide-react';

export type ProfileTabName =
  | 'Personal Info' | 'Family Details' | 'Bank Details' | 'Education' | 'Experience'
  | 'Documents' | 'Skills' | 'Assets' | 'Emergency' | 'More Info';

// Tabs without a page yet (href undefined) render as plain, non-clickable labels.
const TABS: Array<{ name: ProfileTabName; icon: React.ElementType; href?: string }> = [
  { name: 'Personal Info', icon: User, href: '/dashboard/my-profile' },
  { name: 'Family Details', icon: Users, href: '/dashboard/employee/family' },
  { name: 'Bank Details', icon: Landmark, href: '/dashboard/employee/bank-details' },
  { name: 'Education', icon: GraduationCap, href: '/dashboard/my-profile/education-details' },
  { name: 'Experience', icon: Briefcase, href: '/dashboard/my-profile-extension' },
  { name: 'Documents', icon: FileText },
  { name: 'Skills', icon: Activity },
  { name: 'Assets', icon: Box, href: '/dashboard/employee/assets' },
  { name: 'Emergency', icon: ShieldAlert, href: '/dashboard/employee/emergency' },
  { name: 'More Info', icon: PlusCircle },
];

/** The My Profile tab strip. Markup unchanged from the static pages; tabs now navigate. */
export function ProfileTabs({ active }: { active: ProfileTabName }) {
  return (
    <div className="mb-2 flex items-center gap-3 border-b border-zinc-200 overflow-x-auto no-scrollbar">
      {TABS.map((tab) => {
        const isActive = tab.name === active;
        const className = `flex items-center gap-2 px-2 pb-3 text-[10px] font-medium whitespace-nowrap transition-colors ${
          isActive ? 'text-[#1d4ed8]' : 'text-zinc-500 hover:text-zinc-800'
        }`;
        const content = (
          <>
            <tab.icon size={12} />
            {tab.name}
          </>
        );
        return (
          <div key={tab.name} className="relative flex flex-col items-center cursor-pointer">
            {tab.href && !isActive ? (
              <Link href={tab.href} className={className}>{content}</Link>
            ) : (
              <span className={className} title={tab.href ? undefined : 'Coming soon'}>{content}</span>
            )}
            {isActive && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1d4ed8]" />}
          </div>
        );
      })}
    </div>
  );
}
