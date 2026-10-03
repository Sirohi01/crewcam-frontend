'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface DepartmentFormData {
  _id?: string;
  name: string;
  code: string;
  branchId: string;
  hodEmployeeId: string;
  reportingToId: string; // Not strictly in Department model, maybe handled separately or ignored if not in model
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
  documents?: File[];
  _meta?: {
    branchName?: string;
    hodName?: string;
    reportingToName?: string;
    budgetOwnerName?: string;
  };
}

const defaultFormData: DepartmentFormData = {
  name: '',
  code: '',
  branchId: '',
  hodEmployeeId: '',
  reportingToId: '',
  description: '',
  isActive: true,
  departmentType: '',
  businessUnit: '',
  budgetOwnerId: '',
  effectiveDate: '',
  keyResponsibilities: '',
  employeeCapacity: '',
  workingDays: 'Monday - Saturday',
  defaultShift: 'General Shift (09:30 AM - 06:30 PM)',
  documents: [],
  _meta: {},
};

interface DepartmentFormContextType {
  formData: DepartmentFormData;
  setFormData: React.Dispatch<React.SetStateAction<DepartmentFormData>>;
  updateFormData: (data: Partial<DepartmentFormData>) => void;
  updateMeta: (metaData: Partial<NonNullable<DepartmentFormData['_meta']>>) => void;
  resetForm: () => void;
}

const DepartmentFormContext = createContext<DepartmentFormContextType | undefined>(undefined);

export function DepartmentFormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<DepartmentFormData>(defaultFormData);

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
    setFormData(defaultFormData);
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
