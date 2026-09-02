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
    queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}/pipeline`)).data,
    enabled: !!candidateId,
  });

  const entityId = step?.entityField === 'employeeId' ? pipeline?.employeeId : candidateId;
  const stepState = step ? pipeline?.steps.find((entry: any) => entry.key === step.stepKey) : undefined;
  const locked = step?.entityField === 'employeeId' ? !entityId : stepState?.gate.unlocked === false;

  if (!step) {
    return <div className="p-6 text-sm text-zinc-500">Unknown hiring step.</div>;
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-2 mb-2 px-2 lg:px-2">
      {/* <div className="flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <Button variant="ghost" className="h-8 gap-2 px-2 text-xs" onClick={() => router.push(`/dashboard/hiring/${candidateId}`)}>
          <ArrowLeft size={14} /> Candidate Workflow
        </Button>
      </div> */}
      {children}
      {/* <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4 w-full overflow-hidden">
          {children}
        </div>

        <div className="space-y-4">
          <StepChecklist items={stepState?.checklist} />
          <Card className="rounded-md border-zinc-200/80 shadow-sm dark:border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Pipeline State</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-zinc-500">Status</span><span className="font-medium">{stepState?.status || 'pending'}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Current Step</span><span className="font-medium">{pipeline?.currentStep || 1}</span></div>
              {step.entityField === 'employeeId' && !entityId && (
                <div className="rounded-md bg-amber-50 p-2 text-xs text-amber-700">Link an employee through Step 9 before this post-joining step can be used.</div>
              )}
              <Link href={`/dashboard/hiring/${candidateId}`} className="block pt-2 text-xs font-medium text-zinc-700 underline dark:text-zinc-200">
                View all hiring steps
              </Link>
            </CardContent>
          </Card>
        </div>
      </div> */}
    </div>
  );
}
