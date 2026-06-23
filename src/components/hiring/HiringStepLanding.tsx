'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, CheckCircle2, ClipboardList, FileText, LockKeyhole, Search, UserRound } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getHiringStepById } from '@/lib/hiringSteps';
import api from '@/lib/axios';

const STEP_GUIDANCE: Record<string, { purpose: string; prerequisites: string[]; outcome: string }> = {
  evaluation: { purpose: 'Capture structured feedback after an interview is completed.', prerequisites: ['At least one interview marked Completed'], outcome: 'A recorded evaluation unlocks selection approval.' },
  'selection-approval': { purpose: 'Request the authorized selection decision and proposed compensation.', prerequisites: ['Interview evaluation submitted'], outcome: 'Approved selection unlocks the CTC breakup.' },
  'ctc-breakup': { purpose: 'Create the complete annual compensation calculation.', prerequisites: ['Selection approval is Approved'], outcome: 'CTC breakdown becomes the commercial basis for LOI.' },
  loi: { purpose: 'Prepare the Letter of Intent and generate its PDF.', prerequisites: ['CTC breakup completed'], outcome: 'Candidate receives an initial intent document.' },
  'joining-confirmation': { purpose: 'Record the candidate’s confirmed joining logistics.', prerequisites: ['LOI created'], outcome: 'Pre-joining document collection can begin.' },
  'doc-checklist': { purpose: 'Track every mandatory joining document and its verification status.', prerequisites: ['Joining confirmation recorded'], outcome: 'A complete document trail for the candidate.' },
  bgv: { purpose: 'Request and record background-verification checks.', prerequisites: ['Document checklist initiated'], outcome: 'A clear BGV result supports the offer decision.' },
  'offer-letter': { purpose: 'Prepare the final offer, generate PDF and record acceptance or decline.', prerequisites: ['Selection approval and offer prerequisites complete'], outcome: 'Accepted offer continues the onboarding path.' },
  nda: { purpose: 'Create and record the signed confidentiality agreement.', prerequisites: ['Offer process in progress'], outcome: 'Legal acceptance before appointment.' },
  'appointment-letter': { purpose: 'Generate the appointment letter and capture acknowledgement.', prerequisites: ['NDA, IT policy and conduct acceptance'], outcome: 'Formal appointment completed.' },
  'bank-payroll': { purpose: 'Collect payroll details securely. Sensitive identifiers stay masked in the UI.', prerequisites: ['Candidate is in onboarding'], outcome: 'Payroll-ready banking record.' },
  'probation-review': { purpose: 'Run the post-joining probation review against the linked employee.', prerequisites: ['Employee linked to the candidate workflow'], outcome: 'Confirm, extend or end probation.' },
  'perf-eval': { purpose: 'Record a structured employee performance evaluation.', prerequisites: ['Employee linked to the candidate workflow'], outcome: 'Documented performance outcome.' },
  'id-card': { purpose: 'Generate and issue the employee ID or visiting card.', prerequisites: ['Employee linked to the candidate workflow'], outcome: 'Issued ID/visiting-card record.' },
};

export default function HiringStepLanding({ stepId }: { stepId: string }) {
  const step = getHiringStepById(stepId);
  const [search, setSearch] = useState('');
  const { data: candidates, isLoading } = useQuery<any[]>({ queryKey: ['candidates'], queryFn: async () => (await api.get('/hiring/candidates')).data });
  const guidance = STEP_GUIDANCE[stepId] || { purpose: `Complete the ${step?.title || 'hiring'} record for the selected candidate.`, prerequisites: ['Previous sequential steps must be complete'], outcome: 'The next eligible hiring step is unlocked.' };
  const visibleCandidates = useMemo(() => (candidates || []).filter((candidate) => `${candidate.firstName} ${candidate.lastName} ${candidate.jobRole} ${candidate.email}`.toLowerCase().includes(search.toLowerCase())), [candidates, search]);
  if (!step) return <div className="py-16 text-center text-sm text-zinc-500">This hiring step does not exist.</div>;
  const fieldLabels = [...step.fields.map((field) => field.label), ...(step.arrayFields || []).map((field) => field.label)];
  return <div className="mx-auto max-w-6xl pb-10">
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 px-6 py-7 text-white shadow-lg md:px-8">
      <div className="absolute -right-8 -top-10 h-44 w-44 rounded-full bg-white/10" /><div className="absolute -bottom-16 right-24 h-36 w-36 rounded-full bg-white/10" />
      <div className="relative"><p className="text-[11px] font-md uppercase tracking-[0.18em] text-indigo-100">Hiring workflow · Step {step.step} of 24</p><h1 className="mt-2 text-2xl font-md md:text-3xl">{step.title}</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-indigo-100">{guidance.purpose}</p></div>
    </div>
    <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_1.9fr]">
      <div className="space-y-4"><Card className="border-indigo-100 shadow-sm dark:border-indigo-900"><CardContent className="p-5"><div className="flex items-center gap-2 text-sm font-md"><ClipboardList size={16} className="text-indigo-600" /> What you need</div><ul className="mt-3 space-y-2">{guidance.prerequisites.map((item) => <li key={item} className="flex gap-2 text-xs leading-5 text-zinc-600 dark:text-zinc-400"><LockKeyhole size={13} className="mt-1 shrink-0 text-amber-600" />{item}</li>)}</ul></CardContent></Card><Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800"><CardContent className="p-5"><div className="flex items-center gap-2 text-sm font-md"><FileText size={16} className="text-indigo-600" /> Fields in this step</div><div className="mt-3 flex flex-wrap gap-1.5">{fieldLabels.length ? fieldLabels.map((label) => <span key={label} className="rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">{label}</span>) : <span className="text-xs text-zinc-500">This step uses its dedicated action workflow.</span>}</div></CardContent></Card><Card className="border-emerald-100 bg-emerald-50/50 shadow-sm dark:border-emerald-900 dark:bg-emerald-950/20"><CardContent className="p-5"><div className="flex items-center gap-2 text-sm font-md text-emerald-800 dark:text-emerald-300"><CheckCircle2 size={16} /> Result</div><p className="mt-2 text-xs leading-5 text-emerald-800/80 dark:text-emerald-300/80">{guidance.outcome}</p></CardContent></Card></div>
      <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800"><CardContent className="p-0"><div className="border-b border-zinc-100 p-5 dark:border-zinc-800"><div className="flex flex-wrap items-center justify-between gap-2"><div><h2 className="text-base font-md">Select a candidate</h2><p className="mt-1 text-xs text-zinc-500">Every record stays connected to one candidate and their sequential workflow.</p></div><span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-md text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">{visibleCandidates.length} candidates</span></div><label className="relative mt-4 block"><Search size={15} className="absolute left-3 top-2.5 text-zinc-400" /><input className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-zinc-700 dark:bg-zinc-900" placeholder="Search candidate, email or role…" value={search} onChange={(event) => setSearch(event.target.value)} /></label></div><div className="divide-y divide-zinc-100 dark:divide-zinc-800">{isLoading && <p className="p-6 text-sm text-zinc-500">Loading candidates…</p>}{visibleCandidates.map((candidate) => <Link key={candidate._id} href={`/dashboard/hiring/${candidate._id}/steps/${step.id}`} className="group flex items-center justify-between gap-3 p-5 transition hover:bg-indigo-50/60 dark:hover:bg-indigo-950/20"><div className="flex min-w-0 items-center gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800"><UserRound size={16} /></div><div className="min-w-0"><p className="truncate text-sm font-md">{candidate.firstName} {candidate.lastName}</p><p className="mt-0.5 truncate text-xs text-zinc-500">{candidate.jobRole} · {candidate.email}</p></div></div><span className="flex shrink-0 items-center gap-1 text-xs font-md text-indigo-600">Open <ArrowRight size={14} className="transition group-hover:translate-x-0.5" /></span></Link>)}{!isLoading && !visibleCandidates.length && <p className="p-8 text-center text-sm text-zinc-500">No candidate found. Add a candidate first.</p>}</div></CardContent></Card>
    </div>
  </div>;
}
