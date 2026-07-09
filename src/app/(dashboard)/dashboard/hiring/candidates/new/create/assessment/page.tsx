'use client';

import React from 'react';
import Link from 'next/link';
import {
  Mail, Phone, MapPin, Link2, ArrowRight, ArrowLeft, Flag, CheckCircle2,
  Lightbulb, Save, Send, ClipboardCheck, Wifi, AlertTriangle,
} from 'lucide-react';

// Dummy data / static mockup — matches the approved design 1:1. Round 4 of the
// same 8-step "Job Application" pipeline as the Interview Round 3 page.

const pipelineSteps = ['Upload CV', 'Review & Edit', 'Submit Application', 'AI Screening', 'HOD Review', 'Interview', 'Offer', 'Onboarding'];
const currentStepIndex = 5;

const tabs = ['Written Assessment', 'Instructions', 'Questions', 'Submit Test', 'Result'];

const applicationSummary = [
  { label: 'Application ID', value: 'APP-2026-000124' },
  { label: 'Applied On', value: '15 June 2026, 11:32 AM' },
  { label: 'Current Stage', value: 'Interview – Round 4' },
  { label: 'AI Screening Score', value: '87%' },
];

const assessmentOverview = [
  { label: 'Assessment Type', value: 'Role Based Written Test' },
  { label: 'Total Questions', value: '40' },
  { label: 'Total Marks', value: '100' },
  { label: 'Duration', value: '60 Minutes' },
  { label: 'Passing Marks', value: '60%' },
  { label: 'Negative Marking', value: 'No' },
];

const options = [
  { key: 'A', text: 'Focus only on acquiring new customers through aggressive discounting.' },
  { key: 'B', text: 'Increase prices to improve margins without changing the existing strategy.' },
  { key: 'C', text: 'Strengthen key accounts, cross-sell existing customers, and identify new market segments.' },
  { key: 'D', text: 'Reduce marketing budget and focus only on high-margin products.' },
];

const assistantChecklist = ['Concept understanding', 'Role fitment', 'Clarity of thinking', 'Decision making', 'Problem solving ability', 'Communication in writing'];

const testTips = [
  'Read each question carefully.',
  'Manage your time effectively.',
  'Choose the best and most practical answer.',
  'Review marked questions before submitting.',
];

const instructions = [
  { icon: ClipboardCheck, text: 'The test contains 40 multiple choice questions.' },
  { icon: ClipboardCheck, text: 'Each question carries equal marks.' },
  { icon: Flag, text: 'You can mark questions for review and revisit later.' },
  { icon: Wifi, text: 'Ensure stable internet connection during the test.' },
  { icon: AlertTriangle, text: 'Plagiarism or malpractice will lead to disqualification.' },
];

const questionState: Record<number, 'answered' | 'visited' | 'current' | 'not-visited'> = { 1: 'answered', 2: 'answered', 3: 'current' };

function Card({
  title, action, children, className = '',
}: { title?: React.ReactNode; action?: React.ReactNode; children?: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-zinc-200 bg-white shadow-sm ${className}`}>
      {title && (
        <div className="flex items-center justify-between gap-2 border-b border-zinc-100 px-3 py-2">
          <h3 className="text-[12.5px] font-bold text-zinc-800">{title}</h3>
          {action}
        </div>
      )}
      <div className="px-3 pb-2.5 pt-2">{children}</div>
    </div>
  );
}

export default function AssessmentRoundPage() {
  return (
    <div className="w-full max-w-[1600px] px-2 py-1 mx-auto space-y-2 font-sans text-zinc-900 min-h-screen">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-zinc-900">Interview – Round 4</h1>
            <p className="mt-0.5 text-[10.5px] text-zinc-500">Written Assessment – AI Powered</p>
          </div>

          <div className="flex items-center gap-1.5">
            {pipelineSteps.map((s, i) => (
              <React.Fragment key={s}>
                {i > 0 && <span className="h-px w-5 bg-zinc-200" />}
                <div className="flex flex-col items-center gap-1">
                  <span className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold ${i === currentStepIndex ? 'bg-indigo-600 text-white' : 'border border-zinc-200 bg-white text-zinc-400'}`}>
                    {i + 1}
                  </span>
                  <span className={`whitespace-nowrap text-[8.5px] font-semibold ${i === currentStepIndex ? 'text-zinc-800' : 'text-zinc-400'}`}>{s}</span>
                </div>
              </React.Fragment>
            ))}
          </div>

          <div className="flex gap-2">
            <Link href="/dashboard/hiring/candidates" className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50">
              <ArrowLeft size={13} /> Back to Applications
            </Link>
            <button type="button" className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-indigo-700">
              End Interview
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 lg:grid-cols-[7fr_3fr]">
          <div className="space-y-2">
            {/* Candidate banner */}
            <Card>
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-[auto_1fr_1fr_1fr]">
                <div className="flex items-start gap-3">
                  <span className="h-16 w-16 shrink-0 rounded-full bg-zinc-200" />
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-1.5 text-[14px] font-bold text-zinc-900">
                      Amit Kumar Verma
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-600">Round 4 In Progress</span>
                    </p>
                    <p className="text-[10.5px] text-zinc-500">Sales Manager</p>
                    <div className="mt-1 space-y-0.5 text-[10px] text-zinc-500">
                      <p className="flex items-center gap-1"><Phone size={11} className="text-zinc-400" /> +91 98765 43210 <Mail size={11} className="ml-2 text-zinc-400" /> amit.verma@email.com</p>
                      <p className="flex items-center gap-1"><MapPin size={11} className="text-zinc-400" /> Noida, Uttar Pradesh</p>
                      <p className="flex items-center gap-1"><MapPin size={11} className="text-zinc-400" /> Noida, Uttar Pradesh</p>
                      <p className="flex items-center gap-1"><Link2 size={11} className="text-zinc-400" /> linkedin.com/in/amitverma</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-[10.5px]">
                  <div><p className="text-zinc-400">Applied For</p><p className="font-bold text-zinc-800">Sales Manager</p></div>
                  <div><p className="text-zinc-400">Department</p><p className="font-bold text-zinc-800">Sales &amp; Marketing</p></div>
                  <div><p className="text-zinc-400">Experience</p><p className="font-bold text-zinc-800">7 Years</p></div>
                </div>

                <div className="space-y-1.5 text-[10.5px]">
                  <div><p className="text-zinc-400">Current Round</p><p className="font-bold text-zinc-800">Round 4 – Written Assessment</p></div>
                </div>

                <div className="space-y-1.5 text-[10.5px]">
                  <div><p className="text-zinc-400">Assessment Type</p><p className="font-bold text-zinc-800">Role Based Written Test</p></div>
                  <div><p className="text-zinc-400">Duration</p><p className="font-bold text-zinc-800">60 Minutes</p></div>
                  <button type="button" className="flex items-center gap-1 text-[10px] font-semibold text-indigo-600 hover:text-indigo-700">
                    View Candidate Profile <ArrowRight size={11} />
                  </button>
                </div>
              </div>
            </Card>

            {/* Tabs */}
            <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white px-3 py-1.5">
              {tabs.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`whitespace-nowrap border-b-2 py-1 text-[11px] font-semibold ${t === 'Written Assessment' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Main assessment content */}
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-[1fr_2.4fr]">
              <Card title="Written Assessment in Progress">
                <p className="text-[10px] leading-snug text-zinc-500">This is a role-based written assessment with AI-generated questions.</p>

                <div className="relative mx-auto my-3 grid h-24 w-24 place-items-center rounded-full" style={{ background: 'conic-gradient(#4f46e5 80%, #e5e7eb 0)' }}>
                  <div className="grid h-[76px] w-[76px] place-items-center rounded-full bg-white text-center">
                    <p className="text-[9px] text-zinc-400">Time Remaining</p>
                    <p className="text-[15px] font-bold text-zinc-900">48:25</p>
                    <p className="text-[8.5px] text-zinc-400">of 60:00</p>
                  </div>
                </div>

                <div className="space-y-1 border-t border-zinc-100 pt-2 text-[10.5px]">
                  <div className="flex items-center justify-between"><span className="text-zinc-500">Total Questions</span><span className="font-semibold text-zinc-800">40</span></div>
                  <div className="flex items-center justify-between"><span className="text-zinc-500">Attempted</span><span className="font-semibold text-zinc-800">2</span></div>
                  <div className="flex items-center justify-between"><span className="text-zinc-500">Remaining</span><span className="font-semibold text-zinc-800">38</span></div>
                </div>

                <div className="mt-2 rounded-lg bg-indigo-50/60 px-2 py-1.5 text-[9.5px] leading-snug text-indigo-700/80">
                  Auto-submit when time ends. Do not refresh or close the browser.
                </div>
              </Card>

              <div className="space-y-2">
                <Card
                  title={<>Question 3 of 40 <span className="ml-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[9.5px] font-semibold text-indigo-600">Sales &amp; Business Strategy</span></>}
                  action={<button type="button" className="flex items-center gap-1 rounded-lg border border-zinc-200 px-2 py-1 text-[10px] font-semibold text-zinc-600 hover:bg-zinc-50"><Flag size={11} /> Mark for Review</button>}
                >
                  <p className="text-[11.5px] font-semibold leading-snug text-zinc-800">
                    You are assigned a target to increase revenue by 25% in the next quarter in a highly competitive market.
                  </p>
                  <p className="mt-1 text-[11px] text-zinc-700">What strategy would you implement to achieve this target?</p>
                  <p className="text-[11px] text-zinc-700">Select the most effective approach.</p>

                  <div className="mt-2.5 space-y-1.5">
                    {options.map((o) => (
                      <label
                        key={o.key}
                        className={`flex cursor-pointer items-start gap-2.5 rounded-lg border px-2.5 py-2 text-[10.5px] ${o.key === 'C' ? 'border-indigo-300 bg-indigo-50/50' : 'border-zinc-200 hover:bg-zinc-50'}`}
                      >
                        <input type="radio" name="q3" defaultChecked={o.key === 'C'} className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-indigo-600" />
                        <span className="text-zinc-700"><b>{o.key}.</b> {o.text}</span>
                      </label>
                    ))}
                  </div>

                  <div className="mt-2.5 flex items-center justify-between">
                    <button type="button" className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[10.5px] font-semibold text-zinc-700 hover:bg-zinc-50">
                      <ArrowLeft size={12} /> Previous Question
                    </button>
                    <button type="button" className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-[10.5px] font-semibold text-white hover:bg-indigo-700">
                      Next Question <ArrowRight size={12} />
                    </button>
                  </div>
                </Card>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Card title="AI Assessment Assistant" action={<span className="rounded-full bg-indigo-50 px-1.5 py-0.5 text-[9px] font-bold text-indigo-600">BETA</span>}>
                    <p className="mb-1.5 text-[10px] leading-snug text-zinc-500">Our AI analyzes your responses in real-time to evaluate:</p>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                      {assistantChecklist.map((c) => (
                        <p key={c} className="flex items-center gap-1.5 text-[10px] text-zinc-600">
                          <CheckCircle2 size={12} className="shrink-0 text-emerald-500" /> {c}
                        </p>
                      ))}
                    </div>
                  </Card>

                  <Card title={<span className="flex items-center gap-1.5"><Lightbulb size={13} className="text-amber-500" /> Test Tips</span>}>
                    <ul className="space-y-1 text-[10.5px] text-zinc-600">
                      {testTips.map((t) => <li key={t} className="list-disc pl-3">{t}</li>)}
                    </ul>
                  </Card>
                </div>

                <div className="flex justify-end gap-2">
                  <button type="button" className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50">
                    <Save size={13} /> Save &amp; Exit
                  </button>
                  <button type="button" className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-indigo-700">
                    Submit Test <Send size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-2">
            <Card title="Application Summary">
              <div className="space-y-1.5">
                {applicationSummary.map((s) => (
                  <div key={s.label} className="flex items-center justify-between gap-2 text-[10.5px]">
                    <span className="text-zinc-500">{s.label}</span>
                    <span className="text-right font-semibold text-zinc-800">{s.value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between gap-2 text-[10.5px]">
                  <span className="text-zinc-500">HOD Review</span>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9.5px] font-semibold text-emerald-600">Recommended</span>
                </div>
              </div>
            </Card>

            <Card title="Assessment Overview">
              <div className="space-y-1.5">
                {assessmentOverview.map((s) => (
                  <div key={s.label} className="flex items-center justify-between gap-2 text-[10.5px]">
                    <span className="text-zinc-500">{s.label}</span>
                    <span className="text-right font-semibold text-zinc-800">{s.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Question Palette">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] text-zinc-500">
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded border border-zinc-300 bg-white" /> Not Visited</span>
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded border border-blue-300 bg-blue-50" /> Visited</span>
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-emerald-500" /> Answered</span>
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-amber-500" /> Marked for Review</span>
              </div>
              <div className="mt-2 grid grid-cols-10 gap-1">
                {Array.from({ length: 40 }).map((_, i) => {
                  const n = i + 1;
                  const state = questionState[n] || 'not-visited';
                  const cls = state === 'answered' ? 'bg-emerald-500 text-white'
                    : state === 'current' ? 'bg-indigo-600 text-white'
                      : 'border border-zinc-200 bg-white text-zinc-500';
                  return (
                    <button key={n} type="button" className={`grid h-6 w-6 place-items-center rounded text-[9.5px] font-semibold ${cls}`}>
                      {n}
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card title="Instructions">
              <div className="space-y-1.5">
                {instructions.map((it) => (
                  <p key={it.text} className="flex items-start gap-1.5 text-[10.5px] leading-snug text-zinc-600">
                    <it.icon size={13} className="mt-0.5 shrink-0 text-indigo-500" /> {it.text}
                  </p>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
  );
}
