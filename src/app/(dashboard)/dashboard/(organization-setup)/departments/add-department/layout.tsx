'use client';

import React from 'react';
import { DepartmentFormProvider } from '@/context/DepartmentFormContext';

export default function AddDepartmentLayout({ children }: { children: React.ReactNode }) {
  return (
    <DepartmentFormProvider>
      {children}
    </DepartmentFormProvider>
  );
}
