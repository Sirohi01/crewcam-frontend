'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail, Phone, MapPin, Link2, ArrowRight, ArrowLeft, Info, Sparkles, Volume2, Copy,
  ChevronDown, CheckCircle2, Circle, Clock3,
} from 'lucide-react';

// Dummy data / static mockup — matches the approved design 1:1. This is the
// Interview-stage overview (step 6) of the same 8-step "Job Application"
// pipeline; drilling into a specific round opens the Interview Round pages.

const pipelineSteps = ['Upload CV', 'Review & Edit', 'Submit Application', 'AI Screening', 'HOD Review', 'Interview', 'Offer', 'Onboarding'];
const currentStepIndex = 5;

const tabs = ['Interview Rounds', 'Written Test', 'AI Questions', 'Performance', 'Feedback'];

const applicationSummary = [
  { label: 'Application ID', value: 'APP-2026-000124' },
  { label: 'Applied On', value: '15 June 2026, 11:32 AM' },
  { label: 'Current Stage', value: 'Interview' },
  { label: 'AI Screening Score', value: '87%' },
];

const rounds = [
  { name: 'Round 1', title: 'AI Screening Interview', badge: 'Current Round', duration: '30 Mins', questionsLabel: 'AI Generated Questions', status: 'In Progress' },
  { name: 'Round 2', title: 'Technical Interview', badge: 'UPCOMING', duration: '40 Mins', questionsLabel: 'AI Generated Questions', status: 'Pending' },
  { name: 'Round 3', title: 'Managerial Interview', badge: 'UPCOMING', duration: '30 Mins', questionsLabel: 'AI Generated Questions', status: 'Pending' },
  { name: 'Round 4', title: 'Written Assessment', badge: 'UPCOMING', duration: '45 Mins', questionsLabel: 'AI Generated Test', status: 'Pending' },
  { name: 'Round 5', title: 'HR Interview', badge: 'UPCOMING', duration: '25 Mins', questionsLabel: 'AI Generated Questions', status: 'Pending' },
];

const questions = [
  { n: 1, tag: 'Behavioral', text: 'Tell me about a time when you had to handle a difficult client. What was the situation, your approach, and the outcome?', open: true },
  { n: 2, tag: 'Situational', text: 'If you are assigned a target that seems difficult to achieve, how will you plan and execute your strategy?', open: false },
  { n: 3, tag: 'Role Specific', text: 'What is your approach to building and maintaining long-term relationships with key accounts?', open: false },
];

const assistantPoints = [
  'Questions are generated in real-time based on the candidate’s profile.',
  'Difficulty level adapts based on responses.',
  'Answers are analyzed for relevance, clarity & confidence.',
  'Detailed feedback will be available after the round.',
];

const performanceScores = [
  { label: 'Confidence', value: 82, color: 'bg-emerald-500' },
  { label: 'Clarity', value: 75, color: 'bg-emerald-500' },
  { label: 'Relevance', value: 68, color: 'bg-amber-500' },
];

const timeline = [
  { title: 'Application Submitted', detail: '15 June 2026, 11:32 AM', state: 'done' },
  { title: 'AI Screening Completed', detail: '15 June 2026, 12:05 PM · Score: 87%', state: 'done' },
  { title: 'HOD Review Completed', detail: '16 June 2026, 10:15 AM · Recommended', state: 'done' },
  { title: 'Interview – Round 1', detail: '16 June 2026, 11:00 AM · In Progress', state: 'current' },
  { title: 'Interview – Round 2', detail: 'Pending', state: 'pending' },
  { title: 'Interview – Round 3', detail: 'Pending', state: 'pending' },
  { title: 'Written Assessment', detail: 'Pending', state: 'pending' },
  { title: 'Final HR Interview', detail: 'Pending', state: 'pending' },
  { title: 'Offer', detail: 'Pending', state: 'pending' },
];

const guidelines = [
  'Ensure a quiet environment.',
  'Use headphones for better experience.',
  'Do not refresh or close the browser.',
  'AI will evaluate your responses in real-time.',
];

function Card({
  title, action, children, className = '',
}: { title?: React.ReactNode; action?: React.ReactNode; children?: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-zinc-200 bg-white shadow-sm ${className}`}>
      {title && (
        <div className="flex items-center justify-between gap-2 border-b border-zinc-100 px-2.5 py-1.5">
          <h3 className="text-[12.5px] font-bold text-zinc-800">{title}</h3>
          {action}
        </div>
      )}
      <div className="px-2.5 pb-2 pt-1">{children}</div>
    </div>
  );
}

export default function InterviewProcessPage() {
  const [roundTab, setRoundTab] = useState<'questions' | 'transcript'>('questions');
  const [openQ, setOpenQ] = useState<number>(1);

  return (
    <div className="bg-[#fafbfc] font-sans">
      <div className="mx-auto max-w-[1600px] space-y-2 p-1">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-zinc-900">Interview Process – AI Powered</h1>
            <p className="mt-0.5 text-[10.5px] text-zinc-500">All interview rounds will be AI-driven with AI-generated questions.</p>
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
              Next: Offer <ArrowRight size={13} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-2 lg:grid-cols-[7fr_3fr]">
          <div className="min-w-0 space-y-2">
            {/* Candidate banner */}
            <Card>
              <div className="grid grid-cols-1 gap-2 lg:grid-cols-[auto_1fr_1fr]">
                <div className="flex items-start gap-3">
                  <span className="h-16 w-16 shrink-0 rounded-full bg-zinc-200" />
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-1.5 text-[14px] font-bold text-zinc-900">
                      Amit Kumar Verma
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-600">Interview In Progress</span>
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
                  <div><p className="text-zinc-400">Expected CTC</p><p className="font-bold text-zinc-800">₹ 12.00 LPA</p></div>
                  <div><p className="text-zinc-400">Notice Period</p><p className="font-bold text-zinc-800">30 Days</p></div>
                  <div><p className="text-zinc-400">Current Stage</p><p className="font-bold text-zinc-800">Interview - Round 1</p></div>
                </div>
              </div>
            </Card>

            {/* Tabs */}
            <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white px-3 py-1.5">
              {tabs.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`whitespace-nowrap border-b-2 py-1 text-[11px] font-semibold ${t === 'Interview Rounds' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Rounds overview */}
            <Card>
              <p className="text-[12.5px] font-bold text-zinc-800">AI-Powered Interview Rounds</p>
              <p className="mt-0.5 text-[10.5px] text-zinc-500">All rounds are AI-driven. Questions are generated based on job role, candidate profile &amp; skills.</p>

              <div className="mt-1.5 flex items-stretch gap-1">
                {rounds.map((r, i) => (
                  <React.Fragment key={r.name}>
                    <div className={`min-w-0 flex-1 rounded-lg border p-1.5 ${i === 0 ? 'border-indigo-300 bg-indigo-50/40' : 'border-zinc-200'}`}>
                      <p className="truncate text-[11px] font-bold text-zinc-800">{r.name}</p>
                      <p className="truncate text-[10px] text-zinc-500">{r.title}</p>
                      <span className={`mt-1 inline-block truncate rounded-full px-1.5 py-0.5 text-[8.5px] font-semibold ${i === 0 ? 'bg-indigo-600 text-white' : 'bg-zinc-100 text-zinc-500'}`}>{r.badge}</span>
                      <p className="mt-1 flex items-center gap-1 truncate text-[9px] text-zinc-500"><Clock3 size={10} className="shrink-0 text-zinc-400" /> <span className="truncate">{r.duration}</span></p>
                      <p className="mt-0.5 flex items-center gap-1 truncate text-[9px] text-zinc-500"><Sparkles size={10} className="shrink-0 text-zinc-400" /> <span className="truncate">{r.questionsLabel}</span></p>
                      <p className={`mt-0.5 flex items-center gap-1 truncate text-[9px] font-medium ${i === 0 ? 'text-indigo-600' : 'text-zinc-400'}`}><Info size={10} className="shrink-0" /> <span className="truncate">{r.status}</span></p>
                    </div>
                    {i < rounds.length - 1 && <span className="flex shrink-0 items-center text-zinc-300"><ArrowRight size={14} /></span>}
                  </React.Fragment>
                ))}
              </div>

              <div className="mt-1.5 flex items-start gap-2 rounded-lg bg-indigo-50/60 px-2.5 py-2">
                <Info size={13} className="mt-0.5 shrink-0 text-indigo-600" />
                <p className="text-[10px] leading-snug text-indigo-700/80">Each round includes AI-generated questions tailored to evaluate the candidate&apos;s skills, experience, behavior and role fitment.</p>
              </div>
            </Card>

            {/* Current round detail + AI assistant */}
            <div className="grid grid-cols-1 items-start gap-2 lg:grid-cols-[1.6fr_1fr]">
              <Card title="Current Round – AI Screening Interview">
                <div className="flex items-center gap-4 border-b border-zinc-100 pb-1.5 text-[11px] font-semibold text-zinc-400">
                  <span>Time Remaining</span>
                  <button type="button" onClick={() => setRoundTab('questions')} className={`border-b-2 pb-1 ${roundTab === 'questions' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-zinc-700'}`}>AI Generated Questions</button>
                  <button type="button" onClick={() => setRoundTab('transcript')} className={`border-b-2 pb-1 ${roundTab === 'transcript' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-zinc-700'}`}>Live Transcript</button>
                </div>

                <div className="grid grid-cols-1 gap-2 pt-1.5 sm:grid-cols-[auto_1fr]">
                  <div className="shrink-0 text-center">
                    <div className="relative mx-auto grid h-20 w-20 place-items-center rounded-full" style={{ background: 'conic-gradient(#22c55e 82%, #e5e7eb 0)' }}>
                      <div className="grid h-16 w-16 place-items-center rounded-full bg-white text-center">
                        <p className="text-[14px] font-bold text-zinc-900">24:35</p>
                        <p className="text-[8px] text-zinc-400">of 30:00</p>
                      </div>
                    </div>
                    <button type="button" className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-zinc-700 hover:bg-zinc-50">
                      End Interview
                    </button>
                  </div>

                  <div className="min-w-0 space-y-2">
                    {roundTab === 'questions' && questions.map((q) => (
                      <div key={q.n} className="rounded-lg border border-zinc-100 px-2.5 py-1.5">
                        <button type="button" onClick={() => setOpenQ(openQ === q.n ? -1 : q.n)} className="flex w-full items-center justify-between gap-2 text-left">
                          <span className="flex items-center gap-1.5 text-[10.5px] font-semibold text-zinc-800">
                            Question {q.n} of {questions.length}
                            <span className="rounded-full bg-indigo-50 px-1.5 py-0.5 text-[9px] font-semibold text-indigo-600">{q.tag}</span>
                          </span>
                          {q.n === 1 ? (
                            <span className="flex items-center gap-1.5 text-zinc-400">
                              <Volume2 size={13} /> <Copy size={13} />
                            </span>
                          ) : (
                            <ChevronDown size={14} className={`text-zinc-400 transition-transform ${openQ === q.n ? 'rotate-180' : ''}`} />
                          )}
                        </button>
                        {openQ === q.n && <p className="mt-1 text-[10.5px] leading-snug text-zinc-600">{q.text}</p>}
                      </div>
                    ))}
                    {roundTab === 'transcript' && (
                      <p className="text-[10.5px] text-zinc-400">Live transcript will appear here once the candidate starts responding.</p>
                    )}
                  </div>
                </div>
              </Card>

              <Card title={<span className="flex items-center gap-1.5"><Sparkles size={13} className="text-indigo-600" /> AI Interview Assistant</span>}>
                <div className="space-y-1.5">
                  {assistantPoints.map((p) => (
                    <p key={p} className="flex items-start gap-1.5 text-[10px] leading-snug text-zinc-600">
                      <Info size={12} className="mt-0.5 shrink-0 text-indigo-500" /> {p}
                    </p>
                  ))}
                </div>

                <div className="mt-1.5 border-t border-zinc-100 pt-2">
                  <p className="text-[10.5px] font-bold text-zinc-700">Candidate Performance</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-600">Good</span>
                    <span className="text-[11px] font-bold text-zinc-800">78%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: '78%' }} />
                  </div>
                </div>

                <div className="mt-1.5 grid grid-cols-3 gap-2">
                  {performanceScores.map((p) => (
                    <div key={p.label}>
                      <p className="text-[9.5px] text-zinc-400">{p.label}</p>
                      <div className="mt-1 h-1 overflow-hidden rounded-full bg-zinc-100">
                        <div className={`h-full rounded-full ${p.color}`} style={{ width: `${p.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
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

            <Card title="Interview Timeline">
              <div className="space-y-0">
                {timeline.map((t, i) => (
                  <div key={t.title} className="relative flex gap-2 pb-2 last:pb-0">
                    {i < timeline.length - 1 && <span className="absolute left-[7px] top-4 h-full w-px bg-zinc-200" />}
                    <span className={`relative z-10 mt-0.5 grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full ${
                      t.state === 'done' ? 'bg-emerald-500 text-white'
                        : t.state === 'current' ? 'border-2 border-indigo-600 bg-white'
                          : 'border border-zinc-200 bg-white'
                    }`}
                    >
                      {t.state === 'done' && <CheckCircle2 size={11} />}
                      {t.state === 'current' && <Circle size={7} className="fill-indigo-600 text-indigo-600" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-[10.5px] font-semibold ${t.state === 'pending' ? 'text-zinc-400' : 'text-zinc-800'}`}>{t.title}</p>
                      <p className="truncate text-[9.5px] text-zinc-400">{t.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Interview Guidelines">
              <div className="space-y-1.5">
                {guidelines.map((g) => (
                  <p key={g} className="flex items-start gap-1.5 text-[10.5px] leading-snug text-zinc-600">
                    <Info size={12} className="mt-0.5 shrink-0 text-indigo-500" /> {g}
                  </p>
                ))}
              </div>
              <Link href="#" className="mt-2 flex items-center gap-1 border-t border-zinc-100 pt-2 text-[10.5px] font-semibold text-indigo-600 hover:text-indigo-700">
                Need Help? View Guidelines <ArrowRight size={11} />
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
