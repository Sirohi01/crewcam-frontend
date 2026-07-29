'use client';

import React from 'react';
import { CheckCircle2, Info } from 'lucide-react';
import { Card } from './FormHelpers';

export function InfoCards() {
    return (
        <div className="space-y-6">
            {/* Why Add Division? Card */}
            <Card>
                <h3 className="text-[14px] font-bold text-zinc-900 mb-4">Why Add Division?</h3>
                <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-[11px] text-zinc-700 font-medium">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-[2px]" />
                        <span>Helps break down business units into functional areas.</span>
                    </li>
                    <li className="flex items-start gap-2 text-[11px] text-zinc-700 font-medium">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-[2px]" />
                        <span>Improves organization structure and accountability.</span>
                    </li>
                    <li className="flex items-start gap-2 text-[11px] text-zinc-700 font-medium">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-[2px]" />
                        <span>Enables better resource allocation and cost control.</span>
                    </li>
                    <li className="flex items-start gap-2 text-[11px] text-zinc-700 font-medium">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-[2px]" />
                        <span>Provides clarity in reporting and performance tracking.</span>
                    </li>
                    <li className="flex items-start gap-2 text-[11px] text-zinc-700 font-medium">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-[2px]" />
                        <span>Supports department mapping and delegation.</span>
                    </li>
                </ul>
            </Card>

            {/* Note Card */}
            <Card>
                <div className="flex items-center gap-2 mb-3">
                    <Info size={16} className="text-indigo-600" />
                    <h3 className="text-[14px] font-bold text-zinc-900">Note</h3>
                </div>
                <ul className="space-y-2.5 list-disc pl-4">
                    <li className="text-[11px] text-zinc-700 font-medium pl-1">
                        All fields marked with <span className="text-rose-500 font-bold">*</span> are mandatory.
                    </li>
                    <li className="text-[11px] text-zinc-700 font-medium pl-1">
                        You can edit division details anytime from the divisions list.
                    </li>
                    <li className="text-[11px] text-zinc-700 font-medium pl-1">
                        Make sure to map correct departments for accurate reporting.
                    </li>
                </ul>
            </Card>
        </div>
    );
}
