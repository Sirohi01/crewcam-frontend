"use client";
import React from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({ label, required, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function FormInput({ className, ...props }: FormInputProps) {
  return (
    <input
      className={cn(
        "w-full h-8 px-2 text-[12px] border border-slate-200 rounded-[2px] focus:outline-none focus:ring-1 focus:ring-[#0d3c68] focus:border-[#0d3c68] transition-all disabled:bg-slate-50 disabled:text-slate-500",
        className
      )}
      {...props}
    />
  );
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string | number }[];
  placeholder?: string;
}

export function FormSelect({ options, placeholder, className, ...props }: FormSelectProps) {
  return (
    <select
      className={cn(
        "w-full h-8 px-2 text-[12px] border border-slate-200 rounded-[2px] focus:outline-none focus:ring-1 focus:ring-[#0d3c68] focus:border-[#0d3c68] transition-all bg-white disabled:bg-slate-50 disabled:text-slate-500",
        className
      )}
      {...props}
    >
      {placeholder && <option value="" disabled>{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
