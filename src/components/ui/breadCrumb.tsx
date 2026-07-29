import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex items-center text-[10px] text-zinc-500 mb-2 font-semibold">
      {items.map((crumb, index) => {
        const isLast = index === items.length - 1;

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
  );
}