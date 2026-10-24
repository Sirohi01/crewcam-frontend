'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface DepartmentDocumentFile {
  name: string;
  url: string;
  size?: number;
}

export interface DepartmentFormData {
  _id?: string;
  name: string;
  code: string;
  branchId: string;
  hodEmployeeId: string;
  reportingToId: string;
  assistantCoHeadId: string;
  description: string;
  isActive: boolean;
  departmentType: string;
  businessUnit: string;
  budgetOwnerId?: string;
  effectiveDate: string;
  keyResponsibilities: string;
  employeeCapacity: string;
  workingDays: string;
  defaultShift: string;
  costCenter: string;
  probationPeriodMonths: string;
  departmentEmail: string;
  // Comma-separated, same pattern as keyResponsibilities — split into an array only when
  // submitting to the API (see review-department-details).
  departmentKeywords: string;
  documents: DepartmentDocumentFile[];
  _meta?: {
    branchName?: string;
    hodName?: string;
    reportingToName?: string;
    assistantCoHeadName?: string;
    budgetOwnerName?: string;
    businessUnitName?: string;
  };
}

// A fresh "today" each time a new Add Department form is opened, not a constant baked in
// at module-load time (which would go stale the moment the server/bundle was built).
const buildDefaultFormData = (): DepartmentFormData => ({
  name: '',
  code: '',
  branchId: '',
  hodEmployeeId: '',
  reportingToId: '',
  assistantCoHeadId: '',
  description: '',
  isActive: true,
  departmentType: '',
  businessUnit: '',
  budgetOwnerId: '',
  effectiveDate: new Date().toISOString().slice(0, 10),
  keyResponsibilities: '',
  employeeCapacity: '',
  workingDays: 'Monday - Saturday',
  defaultShift: 'General Shift (09:30 AM - 06:30 PM)',
  costCenter: '',
  probationPeriodMonths: '',
  departmentEmail: '',
  departmentKeywords: '',
  documents: [],
  _meta: {},
});

interface DepartmentFormContextType {
  formData: DepartmentFormData;
  setFormData: React.Dispatch<React.SetStateAction<DepartmentFormData>>;
  updateFormData: (data: Partial<DepartmentFormData>) => void;
  updateMeta: (metaData: Partial<NonNullable<DepartmentFormData['_meta']>>) => void;
  resetForm: () => void;
}

const DepartmentFormContext = createContext<DepartmentFormContextType | undefined>(undefined);

export function DepartmentFormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<DepartmentFormData>(buildDefaultFormData);

  const updateFormData = (data: Partial<DepartmentFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const updateMeta = (metaData: Partial<NonNullable<DepartmentFormData['_meta']>>) => {
    setFormData((prev) => ({
      ...prev,
      _meta: {
        ...(prev._meta || {}),
        ...metaData
      }
    }));
  };

  const resetForm = () => {
    setFormData(buildDefaultFormData());
  };

  return (
    <DepartmentFormContext.Provider value={{ formData, setFormData, updateFormData, updateMeta, resetForm }}>
      {children}
    </DepartmentFormContext.Provider>
  );
}

export function useDepartmentForm() {
  const context = useContext(DepartmentFormContext);
  if (context === undefined) {
    throw new Error('useDepartmentForm must be used within a DepartmentFormProvider');
  }
  return context;
}
