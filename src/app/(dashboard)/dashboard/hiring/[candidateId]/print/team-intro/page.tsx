'use client';

import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/axios';

interface PrintTeamIntroPageProps {
  params: { candidateId: string };
}

export default function PrintTeamIntroPage({ params }: PrintTeamIntroPageProps) {
  const searchParams = useSearchParams();
  const recordId = searchParams.get('recordId');

  useEffect(() => {
    // Add print styling to body for A4 format
    document.body.classList.add('print-mode');

    // Auto trigger print when data is loaded
    const timer = setTimeout(() => {
      window.print();
    }, 1000);

    return () => {
      document.body.classList.remove('print-mode');
      clearTimeout(timer);
    };
  }, []);

  const { data: recordsData, isLoading } = useQuery({
    queryKey: ['team-intro', params.candidateId],
    queryFn: () => api.get(`/hiring/team-intro?candidateId=${params.candidateId}`).then((res: any) => res.data)
  });

  if (isLoading) {
    return <div className="p-8 text-center no-print">Preparing document...</div>;
  }

  const records = recordsData?.data || [];
  const record = recordId ? records.find((r: any) => r._id === recordId) : records[0];

  if (!record) {
    return <div className="p-8 text-center no-print">No record found. Please ensure it is saved first.</div>;
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="print-page bg-white min-h-screen text-black">
      <div className="print-content mx-0 p-8 max-w-[210mm] min-h-[297mm]">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold uppercase tracking-wider text-slate-800">
              TEAM INTRODUCTION NOTE
            </h1>
            <p className="text-sm text-slate-600 mt-1">CONFIDENTIAL</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Date: {new Date().toLocaleDateString('en-GB')}</p>
            <p className="text-sm text-slate-500">Candidate ID: {params.candidateId}</p>
          </div>
        </div>

        <div className="w-full h-[2px] bg-slate-800 mb-8"></div>

        {/* Introduction Section */}
        <div className="mb-10 text-justify">
          <p className="text-base leading-relaxed mb-4">
            We are pleased to introduce <strong>{record.candidateName}</strong> to the team.
            They will be joining us in the capacity of <strong>{record.position}</strong> within the <strong>{record.department}</strong> department.
          </p>

          <p className="text-base leading-relaxed mb-4">
            Their reporting manager will be <strong>{record.reportingTo || '______________'}</strong>.
          </p>

          <p className="text-base leading-relaxed">
            The official Date of Joining is scheduled for <strong>{formatDate(record.joiningDate)}</strong>.
            {record.effectiveDate && (
              <span> The effective date of this transition is <strong>{formatDate(record.effectiveDate)}</strong>.</span>
            )}
          </p>
        </div>

        {/* Signatures */}
        <div className="mt-20 pt-10 grid grid-cols-2 gap-12">
          <div className="text-center border-t border-slate-400 pt-2 w-48">
            <p className="text-sm font-semibold">Human Resources</p>
            <p className="text-xs text-slate-500 mt-1">Signature & Date</p>
          </div>

          <div className="text-center border-t border-slate-400 pt-2 w-48 ml-auto">
            <p className="text-sm font-semibold">Reporting Manager</p>
            <p className="text-xs text-slate-500 mt-1">Signature & Date</p>
          </div>
        </div>
      </div>
    </div>
  );
}
