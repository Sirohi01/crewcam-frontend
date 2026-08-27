'use client';
import { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    rightElement?: ReactNode;
    icon?: ReactNode;
    breadcrumbs?: any[];
    prefix?: string;
}

export function PageHeader({ title, prefix, rightElement }: PageHeaderProps) {
    return (
        <div className="mt-6 mb-1.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-[#0d3c68] pb-1 no-print">
        {/* <div className="mb-1.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-[#0d3c68] pb-1 no-print"> */}
            <h1 className="text-lg font-bold text-[#0d3c68] uppercase tracking-tight">
                {title}
            </h1>
            {rightElement && (
                <div className="flex items-center gap-3">
                    {rightElement}
                </div>
            )}
        </div>
    );
}
