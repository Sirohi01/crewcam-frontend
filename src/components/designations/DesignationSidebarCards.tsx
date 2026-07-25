'use client';

import React from 'react';
import { UploadCloud, CheckCircle2, Info, User, Briefcase, Users, LayoutDashboard, Crown, Target } from 'lucide-react';
import { Card } from '@/components/divisions/FormHelpers';
import { DivisionIconCard } from '@/components/divisions/DivisionIconCard';

export default function DesignationSidebarCards() {
  return (
    <div className="space-y-3">
      
      {/* Designation Icon Card */}
      <DivisionIconCard title="Designation Icon" entityName="designation" />

      {/* Why Add Designation? */}
      <Card title="Why Add Designation?">
        <ul className="space-y-3 mt-3">
          <li className="flex items-start gap-2">
            <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
            <span className="text-[11px] text-zinc-600 leading-relaxed">Defines clear roles and responsibilities.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
            <span className="text-[11px] text-zinc-600 leading-relaxed">Helps in org structure and reporting mapping.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
            <span className="text-[11px] text-zinc-600 leading-relaxed">Improves performance management.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
            <span className="text-[11px] text-zinc-600 leading-relaxed">Ensures clarity in roles and career paths.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
            <span className="text-[11px] text-zinc-600 leading-relaxed">Supports payroll and compensation planning.</span>
          </li>
        </ul>
      </Card>

      {/* Note */}
      <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-4 shadow-sm">
        <h3 className="text-[13px] font-bold text-blue-900 flex items-center gap-2 mb-3">
          <Info size={16} className="text-blue-600" /> Note
        </h3>
        <ul className="space-y-2.5 list-disc pl-4 marker:text-blue-400">
          <li className="text-[11px] text-blue-800/80 leading-relaxed pl-1">
            Fields marked with <b className="text-rose-500">*</b> are mandatory.
          </li>
          <li className="text-[11px] text-blue-800/80 leading-relaxed pl-1">
            You can edit designation details anytime.
          </li>
          <li className="text-[11px] text-blue-800/80 leading-relaxed pl-1">
            Map this designation to the right job grade and job family for better reporting.
          </li>
        </ul>
      </div>

    </div>
  );
}
