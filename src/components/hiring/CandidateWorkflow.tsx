'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, CheckCircle2, Circle, ExternalLink, ClipboardList, Mail, Phone, UserRound, Sparkles } from 'lucide-react';
import { HIRING_STEPS } from '@/lib/hiringSteps';
import api from '@/lib/axios';
import StepGate from './StepGate';
import StepChecklist from './StepChecklist';
import ResumeScreeningPanel from './ResumeScreeningPanel';
import InterviewStepPanel from './InterviewStepPanel';

const PHASES = ['Offer & Legal', 'Pre-Joining', 'Onboarding', 'Post-Joining'] as const;

interface Candidate {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobRole: string;
  status: string;
  source?: string;
  resumeUrl?: string;
}

interface PipelineState {
  employeeId?: string;
  currentStep: number;
  steps: {
    key: string;
    status: string;
    checklist: { item: string; done: boolean; doneAt?: string }[];
    gate: { unlocked: boolean; blockedBy: string[] };
    refId?: string;
  }[];
}

export default function CandidateWorkflow({ candidateId }: { candidateId: string }) {
  const queryClient = useQueryClient();
  const { data: candidate } = useQuery<Candidate>({
    queryKey: ['candidate', candidateId],
    queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}`)).data,
    enabled: !!candidateId
  });

  const { data: pipeline } = useQuery<PipelineState>({
    queryKey: ['candidate-pipeline', candidateId],
    queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}/pipeline`)).data,
    enabled: !!candidateId
  });

  const { data: employees } = useQuery<any[]>({
    queryKey: ['employees-picker'],
    queryFn: async () => {
      const res = await api.get('/employees');
      return res.data.data || [];
    }
  });

  const { data: manpowerRequests } = useQuery<any[]>({
    queryKey: ['manpower-request'],
    queryFn: async () => (await api.get('/hiring/manpower-request')).data,
  });

  const stepRecordQueries = HIRING_STEPS.map(step => {
    const resolvedEmployeeId = pipeline?.employeeId || '';
    const entityId = step.entityField === 'employeeId' ? resolvedEmployeeId : candidateId;
    return useQuery({
      queryKey: [step.id, entityId],
      queryFn: async () => (await api.get(`${step.apiPath}?${step.entityField}=${entityId}`)).data,
      enabled: !!entityId
    });
  });

  const pdfMutation = useMutation({
    mutationFn: async ({ apiPath, recordId }: { apiPath: string; recordId: string }) => {
      return (await api.post(`${apiPath}/${recordId}/generate-pdf`)).data;
    },
    onSuccess: (data, vars) => {
      queryClient.invalidateQueries();
      if (data.pdfUrl) {
        window.open(`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1').replace('/api/v1', '')}${data.pdfUrl}`, '_blank');
      }
    }
  });

  const pipelineStepByKey = new Map((pipeline?.steps || []).map((step) => [step.key, step]));
  const resolvedEmployeeId = pipeline?.employeeId || '';

  if (!candidate) {
    return <div className="py-10 text-center text-zinc-500 text-sm">Loading candidate...</div>;
  }

  const manpowerStep = pipelineStepByKey.get('manpowerRequest');
  const linkedManpowerRequest = (manpowerRequests || []).find((mr: any) => mr._id === manpowerStep?.refId);
  const interviewStep = pipelineStepByKey.get('interview');
  const completedSteps = (pipeline?.steps || []).filter((step) => ['completed', 'approved'].includes(step.status)).length;

  return (
    <div className="flex w-full max-w-[1600px] flex-col gap-4 mx-auto pb-10">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-indigo-950 p-6 text-white shadow-lg">
        <div className="absolute -right-12 -top-16 h-52 w-52 rounded-full bg-indigo-400/15" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-4"><div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/10"><UserRound size={26} /></div><div className="min-w-0"><p className="text-[11px] font-md uppercase tracking-[0.16em] text-indigo-200">Candidate Profile</p><h1 className="mt-1 truncate text-2xl font-md">{candidate.firstName} {candidate.lastName}</h1><p className="mt-1 text-sm text-indigo-100">{candidate.jobRole} {candidate.source ? `· ${candidate.source}` : ''}</p></div></div>
          <div className="flex flex-wrap gap-2"><span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-md">{candidate.status}</span><span className="rounded-full bg-emerald-400/15 px-3 py-1.5 text-xs font-md text-emerald-200">{completedSteps}/24 steps complete</span></div>
        </div>
        <div className="relative mt-5 grid gap-2 border-t border-white/10 pt-4 text-xs text-indigo-100 sm:grid-cols-3"><span className="flex items-center gap-2"><Mail size={14} />{candidate.email}</span>{candidate.phone && <span className="flex items-center gap-2"><Phone size={14} />{candidate.phone}</span>}<span className="flex items-center gap-2"><FileText size={14} />{candidate.resumeUrl ? 'Resume attached' : 'Resume not attached'}</span></div>
      </div>
      <Card className="border-zinc-200/80 dark:border-zinc-800">
        <CardContent className="pt-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-md text-zinc-900 dark:text-zinc-50">{candidate.firstName} {candidate.lastName}</h1>
            <p className="text-xs text-zinc-500">{candidate.jobRole} · {candidate.email}</p>
          </div>
          <span className="text-xs font-md px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            {candidate.status}
          </span>
        </CardContent>
      </Card>

      <Card className="border-zinc-200/80 dark:border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <ClipboardList size={15} className="text-indigo-600" /> Step 1 — Manpower Request
          </CardTitle>
          <StepGate unlocked={manpowerStep?.gate.unlocked ?? true} blockedBy={manpowerStep?.gate.blockedBy || []} compact />
        </CardHeader>
        <CardContent>
          {linkedManpowerRequest ? (
            <div className="text-sm text-zinc-700 dark:text-zinc-300">
              Linked to <span className="font-md">{linkedManpowerRequest.jobTitle}</span> ({linkedManpowerRequest.numberOfPositions} position(s), {linkedManpowerRequest.status})
              <div className="mt-3 grid gap-2 rounded-md bg-slate-50 p-3 text-xs text-slate-700 md:grid-cols-3 dark:bg-zinc-900 dark:text-zinc-300">
                <span><b>Designation:</b> {linkedManpowerRequest.designation || linkedManpowerRequest.jobTitle}</span>
                <span><b>Employment:</b> {(linkedManpowerRequest.employmentTypes || [linkedManpowerRequest.employmentType]).join(', ')}</span>
                <span><b>Reason:</b> {(linkedManpowerRequest.hiringReasons || [linkedManpowerRequest.reasonForHiring]).join(', ')}</span>
                {linkedManpowerRequest.requiredJoiningDate && <span><b>Required joining:</b> {new Date(linkedManpowerRequest.requiredJoiningDate).toLocaleDateString()}</span>}
                {linkedManpowerRequest.jobDescriptionSummary && <span className="md:col-span-2"><b>JD Summary:</b> {linkedManpowerRequest.jobDescriptionSummary}</span>}
              </div>
            </div>
          ) : (
            <p className="text-xs text-zinc-400">No manpower request was linked when this candidate was added — step 1 was auto-completed without one. Link can be set from the candidate intake form.</p>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 mt-2">
        <span className="text-[10px] font-md uppercase tracking-wider text-zinc-400">Interview Process</span>
        <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <ResumeScreeningPanel candidateId={candidateId} resumeUrl={candidate.resumeUrl} />

      <InterviewStepPanel candidateId={candidateId} employees={employees || []} gate={interviewStep?.gate || { unlocked: true, blockedBy: [] }} />

      {!resolvedEmployeeId && <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20"><CardContent className="flex gap-3 p-4 text-xs text-amber-800 dark:text-amber-200"><Sparkles size={16} className="mt-0.5 shrink-0" /><span><strong>Post-joining setup:</strong> in Step 9 — Employee Joining Form, select the employee record and save the form. That permanently links this candidate to Steps 22–24.</span></CardContent></Card>}

      {PHASES.map(phase => (
        <Card key={phase} className="border-zinc-200/80 dark:border-zinc-800">
          <CardHeader className="border-b border-zinc-100 py-4 dark:border-zinc-800">
            <CardTitle className="text-sm">{phase}</CardTitle>
            <p className="mt-1 text-xs text-zinc-500">Open each form to add details. Locked steps show what needs completion first.</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {HIRING_STEPS.filter(s => s.phase === phase).map(step => {
              const idx = HIRING_STEPS.indexOf(step);
              const records = stepRecordQueries[idx].data || [];
              const hasRecord = Array.isArray(records) && records.length > 0;
              const latest = hasRecord ? records[0] : null;
              const entityId = step.entityField === 'employeeId' ? resolvedEmployeeId : candidateId;
              const disabled = step.entityField === 'employeeId' && !resolvedEmployeeId;
              const pipelineStep = pipelineStepByKey.get(step.stepKey);
              const locked = step.entityField === 'employeeId' ? !entityId : pipelineStep?.gate.unlocked === false;

              return (
                <div key={step.id} className="grid gap-3 py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0 md:grid-cols-[1fr_auto]">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="pt-0.5">
                      {hasRecord ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Circle size={16} className="text-zinc-300" />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-md text-zinc-800 dark:text-zinc-100">Step {step.step}. {step.title}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <StepGate unlocked={!locked} blockedBy={step.entityField === 'employeeId' && !entityId ? ['employeeId'] : pipelineStep?.gate.blockedBy || []} compact />
                        <span className="text-xs text-zinc-500">{pipelineStep?.status || 'pending'}</span>
                      </div>
                      {pipelineStep && <div className="mt-2 max-w-md"><StepChecklist items={pipelineStep.checklist} /></div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {step.hasPdf && latest && (
                      <Button
                        variant="ghost"
                        className="text-xs h-7 px-2"
                        onClick={() => pdfMutation.mutate({ apiPath: step.apiPath, recordId: latest._id })}
                      >
                        {latest.pdfUrl ? <Download size={14} /> : <FileText size={14} />}
                        {latest.pdfUrl ? 'Re-generate' : 'Generate PDF'}
                      </Button>
                    )}
                    {!disabled && (
                      <Button asChild variant="outline" className="text-xs h-7 px-2.5 gap-1">
                        <Link href={`/dashboard/hiring/${candidateId}/steps/${step.id}`}>
                          <ExternalLink size={14} /> Open form
                        </Link>
                      </Button>
                    )}
                    {disabled && <span className="text-[11px] text-zinc-400">Link employee first</span>}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
