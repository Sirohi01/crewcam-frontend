'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { DivisionFormProvider } from '@/context/DivisionFormContext';
import { DivisionInformationCard } from '@/components/divisions/DivisionInformationCard';
import { AdditionalDetailsCard } from '@/components/divisions/AdditionalDetailsCard';
import { ReportingAndMappingCard } from '@/components/divisions/ReportingAndMappingCard';
import { DivisionIconCard } from '@/components/divisions/DivisionIconCard';
import { InfoCards } from '@/components/divisions/InfoCards';

export default function AddDivisionPageWrapper() {
  return (
    <DivisionFormProvider>
      <AddDivisionPage />
    </DivisionFormProvider>
  );
}

function AddDivisionPage() {
  return (
    <div className="w-full bg-[#f8f9fc] flex flex-col font-sans min-h-[calc(100vh-64px)]">
      <div className="w-full mx-auto p-2 sm:p-2 md:p-2 lg:p-2">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[12px] font-medium text-zinc-500 mb-3">
          <span>Organization Setup</span>
          <span className="text-zinc-400">›</span>
          <span>Business Units</span>
          <span className="text-zinc-400">›</span>
          <span>Divisions</span>
          <span className="text-zinc-400">›</span>
          <span className="text-indigo-600 font-semibold">Add New Division</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Add New Division</h1>
            <p className="text-[12px] text-zinc-500 mt-0.5">Create a new division and define its details.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/divisions" className="flex items-center justify-center gap-1.5 h-8 px-4 rounded-lg text-[12px] font-bold text-zinc-700 border border-zinc-200 bg-white hover:bg-zinc-50 shadow-sm transition-colors">
              <ArrowLeft size={14} /> Back to Divisions
            </Link>
            <button type="button" className="flex items-center justify-center gap-1.5 h-8 px-5 rounded-lg text-[12px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_2px_10px_rgba(79,70,229,0.2)] transition-colors">
              <Save size={14} /> Save Division
            </button>
          </div>
        </div>

        {/* Main 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-3">
          
          {/* Left Column (Main Form Area) */}
          <div className="flex-1 space-y-3">
            <DivisionInformationCard />
            <AdditionalDetailsCard />
            <ReportingAndMappingCard />
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-[320px] xl:w-[360px] shrink-0 space-y-3">
            <DivisionIconCard />
            <InfoCards />
          </div>

        </div>
      </div>
    </div>
  );
}
