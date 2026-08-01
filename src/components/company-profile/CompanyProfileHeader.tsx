'use client';

import React from 'react';
import { Calendar, Users, MapPin } from 'lucide-react';
import { CompanyProfile } from '@/services/companyService';

interface CompanyProfileHeaderProps {
  company: CompanyProfile;
  onEditProfile: () => void;
  onCompanySettings: () => void;
}

export function CompanyProfileHeader({
  company,
  onEditProfile,
  onCompanySettings,
}: CompanyProfileHeaderProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'live':
        return 'bg-emerald-700';
      case 'suspended':
        return 'bg-amber-700';
      case 'expired':
      case 'closed':
        return 'bg-rose-700';
      default:
        return 'bg-slate-700';
    }
  };

  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl">
      <div className="absolute inset-0">
        <img
          src={company.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80'}
          alt="Company office building"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-slate-900/40" />
      </div>

      <div className="relative flex flex-col gap-6 p-8 sm:flex-row sm:items-center">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border-4 border-white/90 bg-white shadow-lg">
          <img
            src={company.logo || 'https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?auto=format&fit=crop&w=200&q=80'}
            alt={`${company.name} logo`}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              {company.legalName || company.name}
            </h2>
            <span className={`flex items-center gap-1 rounded-md px-3 py-0.5 text-xs font-semibold text-white ${getStatusColor(company.lifecycleStatus)}`}>
              {company.lifecycleStatus || 'Active'}
            </span>
          </div>
          <p className="mt-1 max-w-xl text-sm text-slate-200">
            {company.description || 'Building inspiring spaces with creativity, innovation and impeccable execution.'}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-slate-200">
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-slate-300" />
              <div>
                <div className="text-xs text-slate-400">Established</div>
                <div className="font-medium text-white">
                  {company.establishedDate ? formatDate(company.establishedDate) : 'N/A'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-slate-300" />
              <div>
                <div className="text-xs text-slate-400">Company Size</div>
                <div className="font-medium text-white">
                  {company.companySize || 'N/A'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-slate-300" />
              <div>
                <div className="text-xs text-slate-400">Head Office</div>
                <div className="font-medium text-white">
                  {company.address?.city}, {company.address?.state}, {company.address?.country}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}