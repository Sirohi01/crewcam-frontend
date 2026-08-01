'use client';

import React from 'react';
import { Target, Globe, Eye } from 'lucide-react';
import { CompanyProfile } from '@/services/companyService';

interface CompanyProfileAboutProps {
  company: CompanyProfile;
}

export function CompanyProfileAbout({ company }: CompanyProfileAboutProps) {
  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-slate-600">
        {company.description || 'Building inspiring spaces with creativity, innovation and impeccable execution.'}
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-900">
            <Target className="h-3.5 w-3.5 text-blue-700" />
            Our Mission
          </div>
          <p className="text-xs leading-relaxed text-slate-500">
            {company.mission || 'To create innovative and sustainable spaces that enhance lives.'}
          </p>
        </div>
        <div>
          <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-900">
            <Eye className="h-3.5 w-3.5 text-blue-700" />
            Our Vision
          </div>
          <p className="text-xs leading-relaxed text-slate-500">
            {company.vision || 'To be the most trusted design and fit-out partner globally.'}
          </p>
        </div>
      </div>
    </div>
  );
}