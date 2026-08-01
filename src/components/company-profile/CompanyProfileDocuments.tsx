'use client';

import React from 'react';
import { FileText, Download } from 'lucide-react';
import { CompanyProfile } from '@/services/companyService';

interface CompanyProfileDocumentsProps {
  company: CompanyProfile;
}

export function CompanyProfileDocuments({ company }: CompanyProfileDocumentsProps) {
  const documents = company.documents || [];

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <FileText className="mx-auto h-12 w-12 text-slate-300" />
        <p className="mt-2 text-sm">No documents uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div key={doc.name} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <FileText className="h-4 w-4 shrink-0 text-rose-400" />
            <div className="min-w-0">
              <div className="truncate text-xs font-medium text-slate-800">
                {doc.name}
              </div>
              <div className="text-[11px] text-slate-400">
                {doc.date ? new Date(doc.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
              </div>
            </div>
          </div>
          {doc.url && (
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-slate-400 hover:text-indigo-600"
            >
              <Download className="h-4 w-4 text-blue-700" />
            </a>
          )}
        </div>
      ))}
    </div>
  );
}