'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import {
  UserPlus,
  ClipboardCheck,
  Briefcase,
  Clock,
  CalendarDays,
  Wallet,
  TrendingUp,
  GraduationCap,
  LifeBuoy,
  Package,
} from 'lucide-react';
import { CompanyProfile } from '@/services/companyService';

interface ModuleItem {
  label: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

const MODULE_CONFIG: Record<string, ModuleItem> = {
  recruitment: { label: 'Recruitment', icon: <UserPlus className="h-4 w-4" />, iconBg: 'bg-indigo-50', iconColor: 'text-indigo-500' },
  onboarding: { label: 'Onboarding', icon: <ClipboardCheck className="h-4 w-4" />, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500' },
  hrOperations: { label: 'HR Operations', icon: <Briefcase className="h-4 w-4" />, iconBg: 'bg-orange-50', iconColor: 'text-orange-500' },
  attendance: { label: 'Attendance', icon: <Clock className="h-4 w-4" />, iconBg: 'bg-pink-50', iconColor: 'text-pink-500' },
  leaveManagement: { label: 'Leave Management', icon: <CalendarDays className="h-4 w-4" />, iconBg: 'bg-amber-50', iconColor: 'text-amber-500' },
  payroll: { label: 'Payroll', icon: <Wallet className="h-4 w-4" />, iconBg: 'bg-rose-50', iconColor: 'text-rose-500' },
  performance: { label: 'Performance', icon: <TrendingUp className="h-4 w-4" />, iconBg: 'bg-orange-50', iconColor: 'text-orange-500' },
  training: { label: 'Training & Dev.', icon: <GraduationCap className="h-4 w-4" />, iconBg: 'bg-violet-50', iconColor: 'text-violet-500' },
  helpdesk: { label: 'Helpdesk', icon: <LifeBuoy className="h-4 w-4" />, iconBg: 'bg-teal-50', iconColor: 'text-teal-500' },
  assets: { label: 'Assets Management', icon: <Package className="h-4 w-4" />, iconBg: 'bg-sky-50', iconColor: 'text-sky-500' },
};

interface CompanyProfileModulesProps {
  company: CompanyProfile;
}

export function CompanyProfileModules({ company }: CompanyProfileModulesProps) {
  const activeModules = company.modules || Object.keys(MODULE_CONFIG);

  return (
    <div className="grid grid-cols-3 gap-3">
      {activeModules.map((moduleKey) => {
        const config = MODULE_CONFIG[moduleKey];
        if (!config) return null;

        return (
          <div
            key={moduleKey}
            className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2.5"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${config.iconBg} ${config.iconColor}`}>
                {config.icon}
              </span>
              <span className="truncate text-xs font-medium text-slate-700">
                {config.label}
              </span>
            </div>
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
          </div>
        );
      })}
    </div>
  );
}