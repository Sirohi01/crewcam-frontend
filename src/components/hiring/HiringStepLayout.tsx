'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StepChecklist from './StepChecklist';
import { getHiringStepById } from '@/lib/hiringSteps';
import api from '@/lib/axios';
import { formatEmployeeId } from '@/lib/utils';


interface HiringStepLayoutProps {
  candidateId: string;
  stepId: string;
  children: React.ReactNode;
}

export function HiringStepLayout({ candidateId, stepId, children }: HiringStepLayoutProps) {
  const router = useRouter();
  const step = getHiringStepById(stepId);

  const { data: pipeline } = useQuery<any>({
    queryKey: ['candidate-pipeline', candidateId],
    queryFn: async () => {
      try {
        return (await api.get(`/hiring/candidates/${candidateId}/pipeline`)).data;
      } catch (err: any) {
        if (err.response?.status === 404) return null;
        throw err;
      }
    },
    enabled: !!candidateId,
  });

  const { data: candidate } = useQuery<any>({
    queryKey: ['candidate', candidateId],
    queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}`)).data,
    enabled: !!candidateId,
  });

  const entityId = step?.entityField === 'employeeId' ? pipeline?.employeeId : candidateId;
  const stepState = step ? pipeline?.steps.find((entry: any) => entry.key === step.stepKey) : undefined;
  const locked = step?.entityField === 'employeeId' ? !entityId : stepState?.gate.unlocked === false;

  if (!step) {
    return <div className="p-6 text-sm text-zinc-500">Unknown hiring step.</div>;
  }

  const rawEmpCode = candidate?.employeeCode || candidate?.uniqueId || candidate?.candidateCode || pipeline?.candidateCode || '';
  const empCode = formatEmployeeId(rawEmpCode);

  return (
    <div className="w-full max-w-[1500px] mx-auto space-y-3 mb-10 px-2 lg:px-4">
      <div className="border-b-2 border-[#0d3c68] px-1 pb-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-[#0d3c68] uppercase tracking-tight font-poppins px-1">
            {step.title}
          </h1>
          {candidate && (
            <div className="flex flex-wrap items-center gap-2 px-1 text-xs text-slate-600 font-medium mt-0.5">
              <span>Candidate: <strong className="text-slate-800">{candidate.firstName} {candidate.lastName || ''}</strong></span>
              {empCode && (
                <>
                  <span className="text-slate-300">•</span>
                  <span>Employee ID: <strong className="font-mono text-[#0d3c68] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-bold">{empCode}</strong></span>
                </>
              )}
            </div>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-3 text-xs font-bold text-[#0d3c68] border-[#0d3c68] hover:bg-[#0d3c68] hover:text-white rounded-[2px] uppercase transition-all"
          onClick={() => router.push(`/dashboard/hiring/${candidateId}`)}
        >
          <ArrowLeft size={13} className="mr-1" /> Back to Pipeline
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4 w-full overflow-hidden">
          {children}
        </div>

        <div className="space-y-4">
          <StepChecklist items={stepState?.checklist} />
          <div className="rounded-[2px] border border-slate-200 shadow-sm bg-white overflow-hidden">
            <div className="pb-2 pt-3 px-3.5 border-b border-slate-100">
              <h4 className="text-xs font-bold text-[#0d3c68] uppercase tracking-tight">Pipeline State</h4>
            </div>
            <div className="space-y-2 text-xs pt-3 px-3.5 pb-3">
              <div className="flex justify-between">
                <span className="text-slate-500 uppercase font-medium">Status</span>
                <span className="font-semibold text-slate-800 uppercase">{stepState?.status || 'pending'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 uppercase font-medium">Current Step</span>
                <span className="font-semibold text-[#0d3c68]">{pipeline?.currentStep || 1}</span>
              </div>
              {empCode && (
                <div className="flex justify-between items-center border-t border-slate-100 pt-2">
                  <span className="text-slate-500 uppercase font-medium">Employee ID</span>
                  <span className="font-mono font-bold text-[#0d3c68] bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">{empCode}</span>
                </div>
              )}
              {step.entityField === 'employeeId' && !entityId && (
                <div className="rounded-[2px] bg-amber-50 p-2 text-xs text-amber-700 border border-amber-200">
                  Link an employee through Step 9 before this post-joining step can be used.
                </div>
              )}
              <Link
                href={`/dashboard/hiring/${candidateId}`}
                className="block pt-2 text-xs font-bold text-[#0d3c68] hover:underline uppercase tracking-wide"
              >
                View all hiring steps →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
