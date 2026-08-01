'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';

interface TabItem {
  label: string;
  count?: number;
}

interface CompanyProfileTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function CompanyProfileTabs({
  tabs,
  activeTab,
  onTabChange,
}: CompanyProfileTabsProps) {
  return (
    <div className="mb-6 border-b border-slate-200">
      <div className="flex flex-wrap gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => onTabChange(tab.label)}
            className={`relative pb-3 text-sm font-medium transition-colors ${
              activeTab === tab.label
                ? 'text-indigo-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && ` (${tab.count})`}
            {activeTab === tab.label && (
              <span className="absolute -bottom-px left-0 h-0.5 w-full rounded-full bg-indigo-600" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}