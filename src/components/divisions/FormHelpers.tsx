import React from 'react';
import { ChevronDown } from 'lucide-react';

export const inputCls = 'mt-1 h-8 w-full rounded-md border border-zinc-200 bg-white px-2.5 text-[12px] text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500';
export const selectCls = `${inputCls} appearance-none`;
export const labelCls = 'text-[11px] font-semibold text-zinc-700';
export const helpTextCls = 'text-[10px] text-zinc-400 mt-1 leading-tight';
export const textareaCls = 'mt-1 w-full rounded-md border border-zinc-200 bg-white p-2.5 text-[12px] text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 min-h-[80px] resize-none';

export function Field({
    title, required, children, helpText
}: { title: string; required?: boolean; children: React.ReactNode; helpText?: string }) {
    return (
        <label className="block">
            <span className={labelCls}>{title}{required && <b className="text-rose-500"> *</b>}</span>
            {children}
            {helpText && <p className={helpTextCls}>{helpText}</p>}
        </label>
    );
}

export function SelectField({ title, required, options, helpText, value, onChange }: { title: string; required?: boolean; options: string[]; helpText?: string; value?: string; onChange?: (e: any) => void }) {
    return (
        <Field title={title} required={required} helpText={helpText}>
            <div className="relative">
                <select className={selectCls} value={value} onChange={onChange}>
                    <option value="" disabled>Select {title.split(' (')[0]}</option>
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
            <div className="px-3 pb-3 pt-1">
                {children}
            </div>
        </div>
    );
}
