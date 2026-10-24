'use client';
import React from 'react';
import { ChevronDown, CheckCircle2 } from 'lucide-react';

// Shared across all four Add/Edit Department wizard steps (basic-info, department-head,
// description-settings, review-department-details) — previously each page redefined these
// identically, which meant a style or behavior fix had to be copied four times by hand.

export const inputCls = 'mt-1 h-8 w-full rounded-md border border-zinc-200 bg-white px-2.5 text-[12px] text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500';
export const inputErrorCls = 'mt-1 h-8 w-full rounded-md border border-rose-400 bg-rose-50/40 px-2.5 text-[12px] text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500';
export const selectCls = `${inputCls} appearance-none`;
export const selectErrorCls = `${inputErrorCls} appearance-none`;
export const labelCls = 'text-[11px] font-semibold text-zinc-700';
export const helpTextCls = 'text-[10px] text-zinc-400 mt-1 leading-tight';

/** Picks the right input/select className for a field, given whether it currently has an error. */
export const fieldCls = (hasError: boolean, variant: 'input' | 'select' = 'input') => {
    if (variant === 'select') return hasError ? selectErrorCls : selectCls;
    return hasError ? inputErrorCls : inputCls;
};

export function Field({
    title, required, children, helpText, error,
}: { title: string; required?: boolean; children: React.ReactNode; helpText?: string; error?: string }) {
    return (
        <label className="block">
            <span className={labelCls}>{title}{required && <b className="text-rose-500"> *</b>}</span>
            {children}
            {error ? (
                <p className="text-[10px] text-rose-500 mt-1 leading-tight font-medium">{error}</p>
            ) : helpText ? (
                <p className={helpTextCls}>{helpText}</p>
            ) : null}
        </label>
    );
}

export function SelectField({
    title, required, options, helpText, value, onChange, error,
}: { title: string; required?: boolean; options: string[]; helpText?: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void; error?: string }) {
    return (
        <Field title={title} required={required} helpText={helpText} error={error}>
            <div className="relative">
                <select className={fieldCls(Boolean(error), 'select')} value={value} onChange={onChange || (() => { })}>
                    <option value="" disabled>Select {title}</option>
                    {options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            </div>
        </Field>
    );
}

export function Card({
    title, action, children, className = '',
}: { title?: React.ReactNode; action?: React.ReactNode; children?: React.ReactNode; className?: string }) {
    return (
        <div className={`rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden ${className}`}>
            {title && (
                <div className="flex items-center justify-between gap-2 px-3 pt-2.5">
                    <h3 className="text-[13px] font-bold text-zinc-800 flex items-center gap-2">{title}</h3>
                    {action}
                </div>
            )}
            <div className="px-3 pb-3 pt-1">{children}</div>
        </div>
    );
}

export type WizardStepKey = 'basic-info' | 'department-head' | 'description-settings' | 'review-department-details';

const STEP_DEFS: { key: WizardStepKey; num: number; label: string; path: string }[] = [
    { key: 'basic-info', num: 1, label: 'Basic Information', path: '/dashboard/departments/add-department/basic-info' },
    { key: 'department-head', num: 2, label: 'Department Head', path: '/dashboard/departments/add-department/department-head' },
    { key: 'description-settings', num: 3, label: 'Description & Settings', path: '/dashboard/departments/add-department/description-settings' },
    { key: 'review-department-details', num: 4, label: 'Review & Create', path: '/dashboard/departments/add-department/review-department-details' },
];

/** One source of truth for the stepper's status + links, so step order and routes can't drift between pages again. */
export const buildWizardSteps = (activeKey: WizardStepKey) => {
    const activeIndex = STEP_DEFS.findIndex((s) => s.key === activeKey);
    return STEP_DEFS.map((s, idx) => ({
        ...s,
        status: idx < activeIndex ? 'completed' : idx === activeIndex ? 'active' : 'pending',
    }));
};

type WizardStep = ReturnType<typeof buildWizardSteps>[number];

/** The stepper card at the top of every wizard page. Completed steps are clickable (go back
 * and edit); the active step is highlighted; pending steps are inert until reached. */
export function WizardStepper({ steps, onNavigate }: { steps: WizardStep[]; onNavigate: (path: string) => void }) {
    return (
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm py-4 px-2">
            <div className="flex items-center justify-between relative w-full mx-auto">
                <div className="absolute left-[8%] right-[8%] top-[14px] h-[2px] bg-zinc-200 -z-0"></div>
                <div className="flex w-full justify-between z-10">
                    {steps.map((step) => {
                        const clickable = step.status === 'completed';
                        return (
                            <div
                                key={step.key}
                                onClick={() => clickable && onNavigate(step.path)}
                                className={`flex flex-col items-center gap-2 bg-white px-2 ${clickable ? 'cursor-pointer hover:opacity-80' : ''}`}
                            >
                                <div className={`w-[28px] h-[28px] rounded-full flex items-center justify-center text-[11px] font-bold border-2 transition-colors z-10
                                    ${step.status === 'completed' ? 'border-emerald-100 text-emerald-600 bg-emerald-50' :
                                        step.status === 'active' ? 'border-blue-600 bg-blue-600 text-white shadow-[0_0_0_3px_rgba(37,99,235,0.15)]' :
                                            'border-zinc-100 text-zinc-400 bg-zinc-50'}`}>
                                    {step.status === 'completed' ? <CheckCircle2 className="w-4 h-4" strokeWidth={3} /> : step.num}
                                </div>
                                <span className={`text-[10px] font-bold ${step.status === 'active' ? 'text-blue-600' : step.status === 'completed' ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
