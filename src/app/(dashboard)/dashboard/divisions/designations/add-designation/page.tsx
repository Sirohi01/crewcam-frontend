'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Upload } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import api from '@/lib/axios';
import DesignationFormCards from '@/components/designations/DesignationFormCards';
import DesignationSidebarCards from '@/components/designations/DesignationSidebarCards';
import BulkUploadModal, { ColumnConfig } from '@/components/upload/bulkUploadModal';

interface DesignationRow {
  name: string;
  code: string;
  jobGrade: string;
  jobFamily: string;
  businessUnit: string;
  division: string;
  department: string;
  reportsToDesignationId: string;
  employmentType: string;
  flsaType: string;
  isActive: string;
  effectiveFrom: string;
  summary: string;
  keyResponsibilities: string;
  keySkills: string;
  qualification: string;
  experienceRequired: string;
  ctcRange: string;
  designationLevel: string;
  location: string;
  remarks: string;
}

const designationColumns: ColumnConfig<DesignationRow>[] = [
  { key: 'name', label: 'Designation Name', required: true, sampleValue: 'Senior Manager' },
  { key: 'code', label: 'Short Code', required: true, sampleValue: 'SR. MGR' },
  { key: 'jobGrade', label: 'Job Grade', required: true, sampleValue: 'JG-10' },
  { key: 'jobFamily', label: 'Job Family', required: true, sampleValue: 'Leadership' },
  { key: 'businessUnit', label: 'Business Unit', required: true, sampleValue: 'Retail Interiors' },
  { key: 'division', label: 'Division', required: true, sampleValue: 'Design Studio' },
  { key: 'department', label: 'Department', required: true, sampleValue: 'Space Planning' },
  { key: 'reportsToDesignationId', label: 'Reports To (Designation / Role)', sampleValue: 'Managing Director' },
  { key: 'employmentType', label: 'Employment Type', sampleValue: 'Full Time' },
  { key: 'flsaType', label: 'FLSA / Overtime Type', sampleValue: 'Exempt' },
  { key: 'isActive', label: 'Status', required: true, sampleValue: 'Active', validate: (v) => (['active', 'inactive'].includes(String(v).toLowerCase()) ? null : 'Status must be Active or Inactive') },
  { key: 'effectiveFrom', label: 'Effective From', required: true, sampleValue: '2026-01-01' },
  { key: 'summary', label: 'Designation Summary', sampleValue: 'Brief summary of the designation' },
  { key: 'keyResponsibilities', label: 'Key Responsibilities', sampleValue: 'Lead team, manage projects' },
  { key: 'keySkills', label: 'Key Skills / Competencies', sampleValue: 'Leadership, Communication' },
  { key: 'qualification', label: 'Qualification', sampleValue: 'MBA, B.Tech' },
  { key: 'experienceRequired', label: 'Experience Required', sampleValue: '5+ years' },
  { key: 'ctcRange', label: 'CTC Range (₹)', sampleValue: '10-20 LPA' },
  { key: 'designationLevel', label: 'Designation Level', sampleValue: 'Managerial' },
  { key: 'location', label: 'Location', sampleValue: 'Delhi (HQ)' },
  { key: 'remarks', label: 'Remarks', sampleValue: 'Any additional remarks' },
];

function DesignationFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('editId');
  const [showImportModal, setShowImportModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    jobGrade: '',
    jobFamily: '',
    businessUnit: '',
    division: '',
    department: '',
    reportsToDesignationId: '',
    employmentType: '',
    flsaType: '',
    isActive: true,
    effectiveFrom: '',
    summary: '',
    keyResponsibilities: '',
    keySkills: '',
    qualification: '',
    experienceRequired: '',
    ctcRange: '',
    designationLevel: '',
    location: '',
    remarks: '',
    icon: ''
  });

  const { data: designation } = useQuery({
    queryKey: ['designation', editId],
    queryFn: async () => {
      const res = await api.get(`/designations/${editId}`);
      return res.data;
    },
    enabled: !!editId
  });

  useEffect(() => {
    if (designation) {
      setFormData({
        name: designation.name || '',
        code: designation.code || '',
        jobGrade: designation.jobGrade || '',
        jobFamily: designation.jobFamily || '',
        businessUnit: designation.businessUnit || '',
        division: designation.division || '',
        department: designation.departmentId?._id || designation.department || '',
        reportsToDesignationId: designation.reportsToDesignationId?._id || designation.reportsToDesignationId || '',
        employmentType: designation.employmentType || '',
        flsaType: designation.flsaType || '',
        isActive: designation.isActive !== undefined ? designation.isActive : true,
        effectiveFrom: designation.effectiveFrom ? new Date(designation.effectiveFrom).toISOString().split('T')[0] : '',
        summary: designation.summary || '',
        keyResponsibilities: designation.keyResponsibilities || '',
        keySkills: designation.keySkills || '',
        qualification: designation.qualification || '',
        experienceRequired: designation.experienceRequired || '',
        ctcRange: designation.ctcRange || '',
        designationLevel: designation.designationLevel || '',
        location: designation.location || '',
        remarks: designation.remarks || '',
        icon: designation.icon || ''
      });
    }
  }, [designation]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editId) {
        const res = await api.put(`/designations/${editId}`, data);
        return res.data;
      } else {
        const res = await api.post('/designations', data);
        return res.data;
      }
    },
    onSuccess: () => {
      toast.success(editId ? 'Designation updated successfully!' : 'Designation created successfully!');
      router.push('/dashboard/divisions/designations');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || `Failed to ${editId ? 'update' : 'create'} designation`);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Designation name is required');
      return;
    }
    saveMutation.mutate(formData);
  };

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
          <span className="text-blue-600 font-semibold">{editId ? 'Edit Designation' : 'Add New Designation'}</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">{editId ? 'Edit Designation' : 'Add New Designation'}</h1>
            <p className="text-[12px] text-zinc-500 mt-0.5">{editId ? 'Update designation details and requirements.' : 'Create a new job role / designation and define its details.'}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/divisions/designations"
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Designations
            </Link>
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors"
            >
              <Upload size={14} /> Bulk Import
            </button>
            <button 
              onClick={handleSubmit}
              disabled={saveMutation.isPending}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-[12px] font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saveMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} 
              {saveMutation.isPending ? 'Saving...' : 'Save Designation'}
            </button>
          </div>
        </div>

        {/* Main 2-Column Layout */}
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-2">
          {/* Left Column (Main Form Area) */}
          <div className="flex-1 min-w-0">
            <DesignationFormCards formData={formData} setFormData={setFormData} />
          </div>

          {/* Right Column (Sidebar Area) */}
          <div className="w-full lg:w-[320px] shrink-0">
            <div>
              <DesignationSidebarCards 
                icon={formData.icon} 
                onIconChange={(icon: string) => setFormData({ ...formData, icon })} 
              />
            </div>
          </div>
        </form>

      </div>

      <BulkUploadModal<DesignationRow>
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Upload Designation Data"
        description="Upload an Excel file to import designations in bulk."
        sampleFileName="Designation_Example.xlsx"
        columns={designationColumns}
        onImport={async (rows) => {
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
        }}
      />
    </div>
  );
}

export default function AddDesignationPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-8"><Loader2 className="animate-spin text-blue-600" size={32} /></div>}>
      <DesignationFormContent />
    </Suspense>
  );
}
