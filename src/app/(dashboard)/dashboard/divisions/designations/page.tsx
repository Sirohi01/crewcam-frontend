'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Download, Plus, UploadCloud } from 'lucide-react';
import SummaryCards from '@/components/designations/SummaryCards';
import DesignationsTable from '@/components/designations/DesignationsTable';
import AnalyticsSidebar from '@/components/designations/AnalyticsSidebar';
import InfoCardsFooter from '@/components/designations/InfoCardsFooter';

export default function DesignationsPage() {
  return (
    <div className="w-full bg-[#f8f9fc] flex flex-col font-sans min-h-[calc(100vh-64px)]">
      <div className="w-full mx-auto p-2 sm:p-2 md:p-2 lg:p-2">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[12px] font-medium text-zinc-500 mb-2">
          <span>Organization Setup</span>
          <span className="text-zinc-400">›</span>
          <span>Business Units</span>
          <span className="text-zinc-400">›</span>
          <span>Divisions</span>
          <span className="text-zinc-400">›</span>
          <span className="text-blue-600 font-semibold">Designations</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Designations</h1>
            <p className="text-[12px] text-zinc-500 mt-0.5">Manage job roles and designations across the organization.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors">
              <UploadCloud size={14} /> Import Designations
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors">
              <Download size={14} /> Export <ChevronDown size={14} className="ml-1" />
            </button>
            <button className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-[12px] font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
              <Plus size={14} /> Add New Designation
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-2">
          <SummaryCards />
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-2 items-start">
          
          {/* Left Column */}
          <div className="min-w-0 flex flex-col gap-2">
            <DesignationsTable />
            <InfoCardsFooter />
          </div>

          {/* Right Column */}
          <div className="min-w-0">
            <AnalyticsSidebar />
          </div>

        </div>

      </div>
    </div>
  );
}

function ChevronDown({ size, className }: { size: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}
