'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import DesignationFormCards from '@/components/designations/DesignationFormCards';
import DesignationSidebarCards from '@/components/designations/DesignationSidebarCards';

export default function AddDesignationPage() {
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
          <Link href="/dashboard/divisions/designations" className="hover:text-zinc-700 transition-colors">Designations</Link>
          <span className="text-zinc-400">›</span>
          <span className="text-blue-600 font-semibold">Add New Designation</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Add New Designation</h1>
            <p className="text-[12px] text-zinc-500 mt-0.5">Create a new job role / designation and define its details.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link 
              href="/dashboard/divisions/designations"
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Designations
            </Link>
            <button className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-[12px] font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
              <Save size={14} /> Save Designation
            </button>
          </div>
        </div>

        {/* Main 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-2">
          
          {/* Left Column (Main Form Area) */}
          <div className="flex-1 min-w-0">
            <DesignationFormCards />
          </div>

          {/* Right Column (Sidebar Area) */}
          <div className="w-full lg:w-[320px] shrink-0">
            <div className="sticky top-2">
              <DesignationSidebarCards />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
