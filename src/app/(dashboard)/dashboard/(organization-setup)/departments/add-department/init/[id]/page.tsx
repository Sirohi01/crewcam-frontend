'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDepartmentForm } from '@/context/DepartmentFormContext';
import { getDepartmentById } from '@/services/departmentService';

export default function InitEditDepartment() {
  const router = useRouter();
  const params = useParams();
  const { setFormData } = useDepartmentForm();

  useEffect(() => {
    const fetchDept = async () => {
      try {
        const data = await getDepartmentById(params.id as string);
        setFormData({
          name: data.name || '',
          code: data.code || '',
          branchId: data.branchId?._id || data.branchId || '',
          hodEmployeeId: data.hodEmployeeId?._id || data.hodEmployeeId || '',
          reportingToId: data.reportingToId?._id || data.reportingToId || '',
          assistantCoHeadId: data.assistantCoHeadId?._id || data.assistantCoHeadId || '',
          description: data.description || '',
          isActive: data.isActive ?? true,
          departmentType: data.departmentType || 'Core Department',
          businessUnit: data.businessUnit?._id || data.businessUnit || '',
          budgetOwnerId: data.budgetOwnerId?._id || data.budgetOwnerId || '',
          // <input type="date"> needs exactly YYYY-MM-DD — a full ISO datetime string
          // (what the API returns) renders as a blank, invalid-looking field otherwise.
          effectiveDate: data.effectiveDate ? String(data.effectiveDate).slice(0, 10) : '',
          keyResponsibilities: data.keyResponsibilities || '',
          employeeCapacity: data.employeeCapacity != null ? String(data.employeeCapacity) : '',
          workingDays: data.workingDays || 'Monday - Saturday',
          defaultShift: data.defaultShift || 'General Shift (09:30 AM - 06:30 PM)',
          costCenter: data.costCenter || '',
          probationPeriodMonths: data.probationPeriodMonths != null ? String(data.probationPeriodMonths) : '',
          departmentEmail: data.departmentEmail || '',
          departmentKeywords: Array.isArray(data.departmentKeywords) ? data.departmentKeywords.join(', ') : '',
          documents: Array.isArray(data.documents) ? data.documents.map((d: any) => ({ name: d.name, url: d.url, size: d.size })) : [],
          _id: data._id
        });
        router.push('/dashboard/departments/add-department/basic-info');
      } catch (err) {
        console.error('Failed to load department for edit:', err);
        router.push('/dashboard/departments');
      }
    };
    if (params.id) {
      fetchDept();
    }
  }, [params.id, router, setFormData]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#f8f9fc]">
      <div className="text-slate-500 font-medium text-sm flex items-center gap-2">
        <svg className="animate-spin h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        Loading department details...
      </div>
    </div>
  );
}
