'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Download, Plus, UploadCloud } from 'lucide-react';
import SummaryCards from '@/components/designations/SummaryCards';
import DesignationsTable from '@/components/designations/DesignationsTable';
import AnalyticsSidebar from '@/components/designations/AnalyticsSidebar';
import InfoCardsFooter from '@/components/designations/InfoCardsFooter';
import { Breadcrumb } from '@/components/ui/breadCrumb';
import BulkUploadModal from '@/components/upload/bulkUploadModal';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DesignationRow, designationColumns } from '@/components/designations/designationColumns';

export default function DesignationsPage() {
  const [showImportModal, setShowImportModal] = useState(false);
  const qc = useQueryClient();

  const { data: existingDesignations = [] } = useQueryExistingDesignations();

  const handleImportDesignations = async (rows: DesignationRow[]) => {
    for (const row of rows) {
      await api.post('/designations', {
        name: row.name,
        code: row.code,
        jobGrade: row.jobGrade,
        jobFamily: row.jobFamily,
        businessUnit: row.businessUnit,
        division: row.division,
        department: row.department,
        reportsToDesignationId: row.reportsToDesignationId,
        employmentType: row.employmentType,
        flsaType: row.flsaType,
        isActive: row.isActive?.toLowerCase() === 'active',
        effectiveFrom: row.effectiveFrom,
        summary: row.summary,
        keyResponsibilities: row.keyResponsibilities,
        keySkills: row.keySkills,
        qualification: row.qualification,
        experienceRequired: row.experienceRequired,
        ctcRange: row.ctcRange,
        designationLevel: row.designationLevel,
        location: row.location,
        remarks: row.remarks,
      });
    }
    toast.success(`${rows.length} designation(s) imported successfully!`);
    qc.invalidateQueries({ queryKey: ['designations'] });
    qc.invalidateQueries({ queryKey: ['designationStats'] });
  };

  return (
    <div className="w-full bg-[#f8f9fc] flex flex-col font-sans min-h-[calc(100vh-64px)]">
      <div className="w-full mx-auto p-2 sm:p-2 md:p-2 lg:p-2">

        {/* Breadcrumbs */}
      <Breadcrumb
    items={[
      { label: "Organization Setup", href: "/dashboard" },
      { label: "Business Units", href: "/dashboard/bussiness-unit/bussinessunit-bu" },
      { label: "Divisions", href: "" },
      { label: "Designations", href: "" },
    ]}
  />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Designations</h1>
            <p className="text-[12px] text-zinc-500 mt-0.5">Manage job roles and designations across the organization.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors"
            >
              <UploadCloud size={14} /> Import Designations
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors">
              <Download size={14} /> Export <ChevronDown size={14} className="ml-1" />
            </button>
            <Link href={"/dashboard/divisions/designations/add-designation"} className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-[12px] font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
              <Plus size={14} /> Add New Designation
            </Link>
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

        <BulkUploadModal<DesignationRow>
          open={showImportModal}
          onClose={() => setShowImportModal(false)}
          title="Upload Designation Data"
          description="Upload an Excel file to import designations in bulk."
          sampleFileName="Designation_Example.xlsx"
          columns={designationColumns}
          existingData={existingDesignations}
          onImport={handleImportDesignations}
        />

      </div>
    </div>
  );
}

function useQueryExistingDesignations() {
  return useQuery({
    queryKey: ['designations'],
    queryFn: async () => {
      const res = await api.get('/designations');
      return res.data;
    },
  });
}

function ChevronDown({ size, className }: { size: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
