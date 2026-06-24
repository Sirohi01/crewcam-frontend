'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, ClipboardList, Download, ExternalLink, FileText, Mail, Phone, Sparkles, UserRound } from 'lucide-react';
import { HIRING_STEPS } from '@/lib/hiringSteps';
import api from '@/lib/axios';
import { openFileUrl, toAssetUrl } from '@/lib/fileUrls';
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
  profileImageUrl?: string;
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

const statusClass = (status?: string) => {
  if (['completed', 'approved', 'Hired'].includes(status || '')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (['rejected', 'Rejected'].includes(status || '')) return 'bg-rose-50 text-rose-700 border-rose-200';
  if (['in_progress', 'Interviewing', 'Offered'].includes(status || '')) return 'bg-blue-50 text-blue-700 border-blue-200';
  return 'bg-slate-50 text-slate-700 border-slate-200';
};

const compactList = (items: string[] = []) => items.filter(Boolean).join(', ') || '—';

const isValidObjectId = (value: string) => /^[0-9a-fA-F]{24}$/.test(value);

export default function CandidateWorkflow({ candidateId }: { candidateId: string }) {
  const queryClient = useQueryClient();
  const validId = isValidObjectId(candidateId);

  const { data: candidate, isError: candidateError } = useQuery<Candidate>({
    queryKey: ['candidate', candidateId],
    queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}`)).data,
    enabled: validId,
    retry: false
  });

  const { data: pipeline } = useQuery<PipelineState>({
    queryKey: ['candidate-pipeline', candidateId],
    queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}/pipeline`)).data,
    enabled: validId
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
      queryFn: async () => {
        const response = await api.get(`${step.apiPath}?${step.entityField}=${entityId}`);
        return Array.isArray(response.data) ? response.data : (response.data.data || []);
      },
      enabled: validId && !!entityId
    });
  });

  const pdfMutation = useMutation({
    mutationFn: async ({ apiPath, recordId }: { apiPath: string; recordId: string }) => (await api.post(`${apiPath}/${recordId}/generate-pdf`)).data,
    onSuccess: (data) => {
      queryClient.invalidateQueries();
      openFileUrl(data.pdfUrl);
    }
  });

  const pipelineStepByKey = new Map((pipeline?.steps || []).map((step) => [step.key, step]));
  const resolvedEmployeeId = pipeline?.employeeId || '';

  if (!validId || candidateError) {
    return (
      <div className="py-10 text-center text-sm text-zinc-500">
        Candidate not found. Open this page from the{' '}
        <Link href="/dashboard/hiring/pipeline" className="text-[#0e4778] underline">Candidate Pipeline</Link>{' '}
        instead of typing the URL directly.
      </div>
    );
  }

  if (!candidate) {
    return <div className="py-10 text-center text-sm text-zinc-500">Loading candidate...</div>;
  }

  const manpowerStep = pipelineStepByKey.get('manpowerRequest');
  const linkedManpowerRequest = (manpowerRequests || []).find((mr: any) => mr._id === manpowerStep?.refId);
  const interviewStep = pipelineStepByKey.get('interview');
  const completedSteps = (pipeline?.steps || []).filter((step) => ['completed', 'approved'].includes(step.status)).length;
  const percent = Math.round((completedSteps / 24) * 100);
  const candidatePhotoUrl = toAssetUrl(candidate.profileImageUrl);

  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-4 pb-8">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-white px-5 py-5 text-slate-900">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                {candidatePhotoUrl ? <img src={candidatePhotoUrl} alt={`${candidate.firstName} ${candidate.lastName}`} className="h-full w-full object-cover" /> : <UserRound size={26} />}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0e4778]">Hiring workflow</p>
                <h1 className="mt-1 truncate text-2xl font-semibold">{candidate.firstName} {candidate.lastName}</h1>
                <p className="mt-1 text-sm text-slate-500">{candidate.jobRole}{candidate.source ? ` • ${candidate.source}` : ''}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${statusClass(candidate.status)}`}>{candidate.status}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">{completedSteps}/24 complete</span>
            </div>
          </div>
        </div>

        <div className="grid gap-0 divide-y divide-slate-100 p-0 lg:grid-cols-[1fr_320px] lg:divide-x lg:divide-y-0">
          <div className="grid gap-3 p-4 sm:grid-cols-3">
            <InfoTile icon={<Mail size={15} />} label="Email" value={candidate.email} />
            <InfoTile icon={<Phone size={15} />} label="Phone" value={candidate.phone || '—'} />
            <InfoTile icon={<FileText size={15} />} label="Resume" value={candidate.resumeUrl ? 'Attached' : 'Not attached'} />
          </div>
          <div className="p-4">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">Overall progress</span>
              <span className="font-semibold text-[#073a69]">{percent}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div className="h-2 rounded-full bg-[#0e4778]" style={{ width: `${percent}%` }} />
            </div>
            <p className="mt-2 text-xs text-slate-500">Current step: {pipeline?.currentStep || 1}</p>
          </div>
        </div>
      </section>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 px-4 py-3">
          <CardTitle className="flex items-center gap-2 text-sm text-slate-900">
            <ClipboardList size={15} className="text-[#0e4778]" /> Step 1 - Manpower Request
          </CardTitle>
          <StepGate unlocked={manpowerStep?.gate.unlocked ?? true} blockedBy={manpowerStep?.gate.blockedBy || []} compact />
        </CardHeader>
        <CardContent className="p-4">
          {linkedManpowerRequest ? (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{linkedManpowerRequest.jobTitle}</p>
                  <p className="text-xs text-slate-500">{linkedManpowerRequest.numberOfPositions} position(s) • {linkedManpowerRequest.status}</p>
                </div>
                <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusClass(linkedManpowerRequest.status)}`}>{linkedManpowerRequest.status}</span>
              </div>
              <div className="grid gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-700 md:grid-cols-4">
                <Detail label="Designation" value={linkedManpowerRequest.designation || linkedManpowerRequest.jobTitle} />
                <Detail label="Employment" value={compactList(linkedManpowerRequest.employmentTypes || [linkedManpowerRequest.employmentType])} />
                <Detail label="Reason" value={compactList(linkedManpowerRequest.hiringReasons || [linkedManpowerRequest.reasonForHiring])} />
                <Detail label="Joining" value={linkedManpowerRequest.requiredJoiningDate ? new Date(linkedManpowerRequest.requiredJoiningDate).toLocaleDateString() : '—'} />
                {linkedManpowerRequest.jobDescriptionSummary && <div className="md:col-span-4"><Detail label="JD Summary" value={linkedManpowerRequest.jobDescriptionSummary} /></div>}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No manpower request linked. Add candidate from an approved manpower request to keep Step 1 fully traceable.</p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <ResumeScreeningPanel candidateId={candidateId} resumeUrl={candidate.resumeUrl} />
        <InterviewStepPanel candidateId={candidateId} employees={employees || []} gate={interviewStep?.gate || { unlocked: true, blockedBy: [] }} />
      </div>

      {!resolvedEmployeeId && (
        <Card className="border-amber-200 bg-amber-50 shadow-sm">
          <CardContent className="flex gap-3 p-4 text-xs text-amber-800">
            <Sparkles size={16} className="mt-0.5 shrink-0" />
            <span><strong>Post-joining setup:</strong> In Step 9 - Employee Joining Form, select and save the employee record. That links this candidate to Steps 22-24.</span>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 xl:grid-cols-2">
        {PHASES.map(phase => (
          <Card key={phase} className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 px-4 py-3">
              <CardTitle className="text-sm text-slate-900">{phase}</CardTitle>
              <p className="text-xs text-slate-500">Open forms, generate PDFs, and track gated progress.</p>
            </CardHeader>
            <CardContent className="p-0">
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
                  <div key={step.id} className="border-b border-slate-100 px-4 py-3 last:border-0">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 gap-3">
                        <div className="mt-0.5">
                          {hasRecord ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Circle size={16} className="text-slate-300" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900">Step {step.step}. {step.title}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <StepGate unlocked={!locked} blockedBy={step.entityField === 'employeeId' && !entityId ? ['employeeId'] : pipelineStep?.gate.blockedBy || []} compact />
                            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${statusClass(pipelineStep?.status)}`}>{pipelineStep?.status || 'pending'}</span>
                          </div>
                          {pipelineStep && <div className="mt-2 max-w-lg"><StepChecklist items={pipelineStep.checklist} /></div>}
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                        {step.hasPdf && latest && (
                          <Button variant="ghost" className="h-8 gap-1 px-2 text-xs" onClick={() => pdfMutation.mutate({ apiPath: step.apiPath, recordId: latest._id })}>
                            {latest.pdfUrl ? <Download size={14} /> : <FileText size={14} />}
                            {latest.pdfUrl ? 'Re-generate' : 'Generate PDF'}
                          </Button>
                        )}
                        {!disabled ? (
                          <Button asChild variant="outline" className="h-8 gap-1 px-2.5 text-xs">
                            <Link href={`/dashboard/hiring/${candidateId}/steps/${step.id}`}>
                              <ExternalLink size={14} /> Open
                            </Link>
                          </Button>
                        ) : (
                          <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] text-slate-500">Link employee first</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{icon}{label}</div>
      <p className="mt-1 truncate text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 text-xs font-medium text-slate-800">{value || '—'}</p>
    </div>
  );
}
