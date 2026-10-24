'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface DivisionFormData {
  _id?: string;
  name: string;
  code: string;
  businessUnit: string;
  headEmployeeId: string;
  parentDivisionId: string;
  isActive: boolean;
  description: string;
  totalEmployees: string;
  totalDepartments: string;
  budget: string;
  keyResponsibilities: string;
  reportToId: string;
  linkedDepartments: string[];
}

const defaultFormData: DivisionFormData = {
  name: '',
  code: '',
  businessUnit: '',
  headEmployeeId: '',
  parentDivisionId: '',
  isActive: true,
  description: '',
  totalEmployees: '',
  totalDepartments: '',
  budget: '',
  keyResponsibilities: '',
  reportToId: '',
  linkedDepartments: [],
};

export type DivisionFormErrors = Partial<Record<keyof DivisionFormData, string>>;

interface DivisionFormContextType {
  formData: DivisionFormData;
  setFormData: React.Dispatch<React.SetStateAction<DivisionFormData>>;
  updateFormData: (data: Partial<DivisionFormData>) => void;
  resetForm: () => void;
  fieldErrors: DivisionFormErrors;
  setFieldErrors: React.Dispatch<React.SetStateAction<DivisionFormErrors>>;
}

const DivisionFormContext = createContext<DivisionFormContextType | undefined>(undefined);

export function DivisionFormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<DivisionFormData>(defaultFormData);
  const [fieldErrors, setFieldErrors] = useState<DivisionFormErrors>({});

  const updateFormData = (data: Partial<DivisionFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    // Clear errors for whichever fields just changed, so a fixed field stops showing red immediately.
    setFieldErrors((prev) => {
      const keys = Object.keys(data) as (keyof DivisionFormData)[];
      if (!keys.some((k) => prev[k])) return prev;
      const next = { ...prev };
      keys.forEach((k) => { next[k] = undefined; });
      return next;
    });
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setFieldErrors({});
  };

  return (
    <DivisionFormContext.Provider value={{ formData, setFormData, updateFormData, resetForm, fieldErrors, setFieldErrors }}>
      {children}
    </DivisionFormContext.Provider>
  );
}

export function useDivisionForm() {
  const context = useContext(DivisionFormContext);
  if (context === undefined) {
    throw new Error('useDivisionForm must be used within a DivisionFormProvider');
  }
  return context;
}
