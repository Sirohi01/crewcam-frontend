"use client";
import React from 'react';

interface PageHeaderProps {
  prefix?: string;
  title: string;
  rightElement?: React.ReactNode;
}

export function PageHeader({ prefix, title, rightElement }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4 border-b border-[#0d3c68] pb-2">
      <h1 className="text-xl font-bold uppercase text-[#0d3c68]">
        {prefix && <span className="text-slate-400 mr-2">{prefix}</span>}
        {title}
      </h1>
      {rightElement && <div>{rightElement}</div>}
    </div>
  );
}
