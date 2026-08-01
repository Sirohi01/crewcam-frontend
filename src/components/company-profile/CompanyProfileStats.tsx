'use client';

import React from 'react';
import { Users, Building2, MapPin, Target } from 'lucide-react';
import { CompanyProfile } from '@/services/companyService';

interface StatItem {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

interface CompanyProfileStatsProps {
  company: CompanyProfile;
}

export function CompanyProfileStats({ company }: CompanyProfileStatsProps) {
  const stats: StatItem[] = [
    { label: 'Total Employees', value: company.stats?.totalEmployees?.toString() || '0', icon: <Users className="h-5 w-5" />, iconBg: 'bg-indigo-50', iconColor: 'text-indigo-500' },
    { label: 'Departments', value: company.stats?.departments?.toString() || '0', icon: <Building2 className="h-5 w-5" />, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500' },
    { label: 'Locations', value: company.stats?.locations?.toString() || '0', icon: <MapPin className="h-5 w-5" />, iconBg: 'bg-orange-50', iconColor: 'text-orange-500' },
    { label: 'Active Positions', value: company.stats?.activePositions?.toString() || '0', icon: <Target className="h-5 w-5" />, iconBg: 'bg-sky-50', iconColor: 'text-sky-500' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg border border-slate-200 p-3 flex">
          <span className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${stat.iconBg} ${stat.iconColor}`}>
            {stat.icon}
          </span>
          <div className="ml-3">
          <div className="text-xl font-bold text-slate-900">{stat.value}</div>
          <div className="text-xs text-slate-500">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}