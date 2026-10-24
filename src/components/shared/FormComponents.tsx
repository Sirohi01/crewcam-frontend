"use client";
import React from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  required?: boolean;
  /** Shown in place of any helpText below the field, in red, when the field fails validation. */
  error?: string;
  helpText?: string;
  children: React.ReactNode;
}

export function FormField({ label, required, error, helpText, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[12px] font-semibold text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-[11px] text-rose-500 font-medium">{error}</p>
      ) : helpText ? (
        <p className="text-[11px] text-slate-400">{helpText}</p>
      ) : null}
    </div>
  );
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Switches the field to its red/invalid border style — pass the same value given to the wrapping FormField's `error`. */
  error?: string;
}

export function FormInput({ className, error, ...props }: FormInputProps) {
  return (
    <input
      className={cn(
        "w-full h-8 px-2 text-[12px] border rounded-md focus:outline-none focus:ring-1 transition-all disabled:bg-slate-50 disabled:text-slate-500",
        error
          ? "border-rose-400 bg-rose-50/40 focus:ring-rose-500 focus:border-rose-500"
          : "border-slate-200 focus:ring-indigo-500 focus:border-indigo-500",
        className
      )}
      {...props}
    />
  );
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string | number }[];
  placeholder?: string;
  /** Switches the field to its red/invalid border style — pass the same value given to the wrapping FormField's `error`. */
  error?: string;
}

export function FormSelect({ options, placeholder, className, error, ...props }: FormSelectProps) {
  return (
    <select
      className={cn(
        "w-full h-8 px-2 text-[12px] border rounded-md focus:outline-none focus:ring-1 transition-all bg-white disabled:bg-slate-50 disabled:text-slate-500",
        error
          ? "border-rose-400 bg-rose-50/40 focus:ring-rose-500 focus:border-rose-500"
          : "border-slate-200 focus:ring-indigo-500 focus:border-indigo-500",
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
