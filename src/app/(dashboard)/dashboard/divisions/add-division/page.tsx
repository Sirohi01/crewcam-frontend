'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { DivisionFormProvider, useDivisionForm } from '@/context/DivisionFormContext';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
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
  const { formData, updateFormData } = useDivisionForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('editId');
  const [isSaving, setIsSaving] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(!!editId);

  React.useEffect(() => {
    if (editId) {
      const fetchDivision = async () => {
        try {
          const res = await api.get(`/divisions/${editId}`);
          const division = res.data.data;
          updateFormData({
            _id: division._id,
            name: division.name || '',
            code: division.code || '',
            businessUnit: division.businessUnit?._id || division.businessUnit || '',
            headEmployeeId: division.headEmployeeId?._id || division.headEmployeeId || '',
            parentDivisionId: division.parentDivisionId?._id || division.parentDivisionId || '',
            isActive: division.isActive ?? true,
            description: division.description || '',
            totalEmployees: division.totalEmployees || '',
            totalDepartments: division.totalDepartments || '',
            budget: division.budget || '',
            keyResponsibilities: division.keyResponsibilities || '',
            reportToId: division.reportToId?._id || division.reportToId || '',
            linkedDepartments: division.linkedDepartments?.map((d: any) => d._id || d) || [],
          });
        } catch (error) {
          toast.error('Failed to fetch division details');
        } finally {
          setIsLoading(false);
        }
      };
      fetchDivision();
    }
  }, [editId]);

  const handleSave = async () => {
    if (!formData.name || !formData.code) {
      toast.error('Name and Code are required');
      return;
    }
    
    try {
      setIsSaving(true);
      
      const payload: any = { ...formData };
      if (!payload.businessUnit) delete payload.businessUnit;
      if (!payload.parentDivisionId) delete payload.parentDivisionId;
      if (!payload.headEmployeeId) delete payload.headEmployeeId;
      if (!payload.reportToId) delete payload.reportToId;

      if (payload._id) {
        await api.put(`/divisions/${payload._id}`, payload);
        toast.success('Division updated successfully');
      } else {
        await api.post('/divisions', payload);
        toast.success('Division created successfully');
      }
      router.push('/dashboard/divisions');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save division');
    } finally {
      setIsSaving(false);
    }
  }

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
          <span className="text-indigo-600 font-semibold">{editId ? 'Edit Division' : 'Add New Division'}</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">{editId ? 'Edit Division' : 'Add New Division'}</h1>
            <p className="text-[12px] text-zinc-500 mt-0.5">{editId ? 'Update the details for this division.' : 'Create a new division and define its details.'}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/divisions" className="flex items-center justify-center gap-1.5 h-8 px-4 rounded-lg text-[12px] font-bold text-zinc-700 border border-zinc-200 bg-white hover:bg-zinc-50 shadow-sm transition-colors">
              <ArrowLeft size={14} /> Back to Divisions
            </Link>
            <button 
              type="button" 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center justify-center gap-1.5 h-8 px-5 rounded-lg text-[12px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_2px_10px_rgba(79,70,229,0.2)] transition-colors disabled:opacity-70"
            >
              <Save size={14} /> {isSaving ? 'Saving...' : 'Save Division'}
            </button>
          </div>
        </div>

        {/* Main 2-Column Layout */}
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
