import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export function PageHeader({ title, description, icon, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="mb-5">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="flex items-center text-[10px] text-zinc-500 mb-2 font-semibold">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            
            return (
              <React.Fragment key={index}>
                {crumb.href && !isLast ? (
                  <Link href={crumb.href} className="hover:text-zinc-800 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={isLast ? "text-indigo-600" : ""}>
                    {crumb.label}
                  </span>
                )}
                
                {!isLast && <ChevronRight size={12} className="mx-1" />}
              </React.Fragment>
            );
          })}
        </div>
      )}
      
      <div className="flex items-center gap-3">
        {icon && (
          <div className="p-2 bg-indigo-50/80 border border-indigo-100 text-indigo-600 rounded-lg">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-lg font-bold text-zinc-900 tracking-tight leading-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-0.5 text-[11px] font-medium text-zinc-500">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
