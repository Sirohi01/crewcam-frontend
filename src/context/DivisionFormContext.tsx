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

interface DivisionFormContextType {
  formData: DivisionFormData;
  setFormData: React.Dispatch<React.SetStateAction<DivisionFormData>>;
  updateFormData: (data: Partial<DivisionFormData>) => void;
  resetForm: () => void;
}

const DivisionFormContext = createContext<DivisionFormContextType | undefined>(undefined);

export function DivisionFormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<DivisionFormData>(defaultFormData);

  const updateFormData = (data: Partial<DivisionFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData(defaultFormData);
  };

  return (
    <DivisionFormContext.Provider value={{ formData, setFormData, updateFormData, resetForm }}>
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
