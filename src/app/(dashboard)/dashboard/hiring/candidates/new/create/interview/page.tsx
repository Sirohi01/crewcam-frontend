'use client';

import React from 'react';
import Link from 'next/link';
import {
  Mail, Phone, MapPin, Link2, ChevronRight, ArrowRight, ArrowLeft, Flag, Sparkles,
  Bold, Italic, Underline, List, ListOrdered, Code, CheckCircle2, Search, StickyNote,
  MessageSquare, CalendarPlus, Info, LifeBuoy, ExternalLink,
} from 'lucide-react';

// Dummy data / static mockup — matches the approved design 1:1. This continues
// the same 8-step "Job Application" pipeline as the Add New Candidate wizard;
// no backend wiring yet.

const pipelineSteps = ['Upload CV', 'Review & Edit', 'Submit Application', 'AI Screening', 'HOD Review', 'Interview', 'Offer', 'Onboarding'];
const currentStepIndex = 5;

const tabs = ['Interview', 'AI Questions', 'Notes', 'Attachments', 'Evaluation'];

const applicationSummary = [
  { label: 'Application ID', value: 'APP-2026-000124' },
  { label: 'Applied On', value: '15 June 2026, 11:32 AM' },
  { label: 'Current Stage', value: 'Interview – Round 3' },
  { label: 'AI Screening Score', value: '87%' },
];

const interviewRounds = [
  { round: 'Round 1', name: 'AI Screening Interview', status: 'Completed', duration: '30 Min' },
  { round: 'Round 2', name: 'Technical Interview', status: 'Completed', duration: '40 Min' },
  { round: 'Round 3', name: 'Managerial Interview', status: 'In Progress', duration: '40 Min' },
  { round: 'Round 4', name: 'Written Assessment', status: 'Pending', duration: '45 Min' },
  { round: 'Round 5', name: 'HR Interview', status: 'Pending', duration: '25 Min' },
];

const aiAssistantPoints = [
  'Questions are generated in real-time based on your experience, skills & role.',
  'Answers are analyzed for leadership qualities, decision making, and strategic thinking.',
  'Responses are compared with successful candidate benchmarks.',
  'Stay confident, structured and result-oriented.',
];

const quickActions = [
  { label: 'Request Clarification', detail: 'Ask for more details about the question', icon: Search },
  { label: 'Add Interview Note', detail: "Make a note about candidate's response", icon: StickyNote },
  { label: 'Share Feedback', detail: 'Share feedback with the interview panel', icon: MessageSquare },
  { label: 'Schedule Next Round', detail: 'Plan written test or next interview round', icon: CalendarPlus },
];

const guidelines = [
  'Ensure a quiet environment.',
  'Use headphones for better experience.',
  'Do not refresh or close the browser.',
  'AI will evaluate your responses in real-time.',
  'You can use notepad for rough work.',
];

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

const roundStatusStyle: Record<string, string> = {
  Completed: 'bg-emerald-50 text-emerald-600',
  'In Progress': 'bg-indigo-50 text-indigo-600',
  Pending: 'bg-zinc-100 text-zinc-500',
};

export default function InterviewRoundPage() {
  return (
    <div className="w-full max-w-[1600px] px-2 py-1 mx-auto space-y-2 font-sans text-zinc-900 min-h-screen">
      <div className="mx-auto max-w-[1600px] space-y-2 p-1">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-zinc-900">Interview – Round 3</h1>
            <p className="mt-0.5 text-[10.5px] text-zinc-500">Managerial Interview – AI Powered</p>
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
              End Interview <ExternalLink size={12} />
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
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-600">Round 3 In Progress</span>
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
                  <div><p className="text-zinc-400">Current Round</p><p className="font-bold text-zinc-800">Round 3 – Managerial Interview</p></div>
                </div>

                <div className="space-y-1.5 text-[10.5px]">
                  <p className="text-zinc-400">Interviewer</p>
                  <div className="flex items-center gap-2">
                    <span className="h-8 w-8 shrink-0 rounded-full bg-zinc-200" />
                    <div>
                      <p className="font-bold text-zinc-800">Vikram Sinha</p>
                      <p className="text-[9.5px] text-zinc-400">Regional Sales Director</p>
                    </div>
                  </div>
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
                  className={`whitespace-nowrap border-b-2 py-1 text-[11px] font-semibold ${t === 'Interview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Main interview content */}
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-[1fr_2.1fr_1.3fr]">
              <Card title="Round Progress">
                <p className="text-[11px] font-semibold text-zinc-800">Round 3 of 5</p>
                <p className="text-[10px] text-zinc-400">Managerial Interview</p>

                <div className="relative mx-auto my-3 grid h-24 w-24 place-items-center rounded-full" style={{ background: 'conic-gradient(#4f46e5 86%, #e5e7eb 0)' }}>
                  <div className="grid h-[76px] w-[76px] place-items-center rounded-full bg-white text-center">
                    <p className="text-[9px] text-zinc-400">Time Remaining</p>
                    <p className="text-[15px] font-bold text-zinc-900">34:20</p>
                    <p className="text-[8.5px] text-zinc-400">of 40:00</p>
                  </div>
                </div>

                <div className="space-y-1 border-t border-zinc-100 pt-2 text-[10.5px]">
                  <div className="flex items-center justify-between"><span className="text-zinc-500">Total Questions</span><span className="font-semibold text-zinc-800">8</span></div>
                  <div className="flex items-center justify-between"><span className="text-zinc-500">Answered</span><span className="font-semibold text-zinc-800">1</span></div>
                  <div className="flex items-center justify-between"><span className="text-zinc-500">Remaining</span><span className="font-semibold text-zinc-800">7</span></div>
                </div>

                <div className="mt-2 rounded-lg bg-indigo-50/60 px-2 py-1.5 text-[9.5px] leading-snug text-indigo-700/80">
                  All questions are AI-generated based on the role, your profile, and previous rounds.
                </div>
              </Card>

              <div className="space-y-2">
                <Card
                  title={<>Question 2 of 8 <span className="ml-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[9.5px] font-semibold text-indigo-600">Leadership &amp; People Management</span></>}
                  action={<button type="button" className="flex items-center gap-1 rounded-lg border border-zinc-200 px-2 py-1 text-[10px] font-semibold text-zinc-600 hover:bg-zinc-50"><Flag size={11} /> Flag Question</button>}
                >
                  <p className="text-[11.5px] font-semibold leading-snug text-zinc-800">
                    Describe a situation where you had to manage a low-performing team.
                    What steps did you take to improve their performance and what was the outcome?
                  </p>

                  <div className="mt-2 flex items-start gap-2 rounded-lg bg-indigo-50/60 px-2.5 py-2">
                    <Sparkles size={13} className="mt-0.5 shrink-0 text-indigo-600" />
                    <p className="text-[10px] leading-snug text-indigo-700/80">
                      <span className="font-bold">AI Insight:</span> This question evaluates your leadership style, ability to motivate teams, problem-solving skills, and focus on results.
                    </p>
                  </div>

                  <div className="mt-2 rounded-lg border border-zinc-200">
                    <div className="flex items-center gap-2 border-b border-zinc-100 px-2 py-1 text-zinc-400">
                      <Bold size={12} /><Italic size={12} /><Underline size={12} /><List size={12} /><ListOrdered size={12} /><Link2 size={12} /><Code size={12} />
                    </div>
                    <textarea className="h-20 w-full resize-none px-2.5 py-2 text-[11.5px] text-zinc-800 outline-none placeholder:text-zinc-400" placeholder="Type your answer here..." />
                    <div className="flex items-center justify-between border-t border-zinc-100 px-2.5 py-1 text-[9px] text-zinc-400">
                      <span>Minimum 50 words</span>
                      <span>0 / 2500</span>
                    </div>
                  </div>
                  <p className="mt-1.5 flex items-center gap-1 text-[10px] font-medium text-emerald-600"><CheckCircle2 size={12} /> Your answer is auto-saved</p>

                  <div className="mt-2 flex items-center justify-between">
                    <button type="button" className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[10.5px] font-semibold text-zinc-700 hover:bg-zinc-50">
                      <ArrowLeft size={12} /> Previous Question
                    </button>
                    <button type="button" className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-[10.5px] font-semibold text-white hover:bg-indigo-700">
                      Next Question <ArrowRight size={12} />
                    </button>
                  </div>
                </Card>

                <Card title="Your Previous Answer (Q1)">
                  <p className="text-[10.5px] font-semibold text-zinc-800">Q.1 How do you prioritize multiple tasks when working under tight deadlines?</p>
                  <div className="mt-1.5 rounded-lg bg-emerald-50/60 px-2.5 py-2">
                    <p className="text-[10px] leading-snug text-zinc-600">
                      I prioritize tasks based on impact and urgency using the Eisenhower Matrix. I break down tasks, set clear milestones, and communicate progress with the team to ensure timely delivery without compromising quality.
                    </p>
                  </div>
                  <Link href="#" className="mt-1.5 flex justify-end text-[10px] font-semibold text-indigo-600 hover:text-indigo-700">View Full Answer</Link>
                </Card>
              </div>

              <div className="space-y-2">
                <Card title="AI Interview Assistant" action={<span className="rounded-full bg-indigo-50 px-1.5 py-0.5 text-[9px] font-bold text-indigo-600">BETA</span>}>
                  <div className="space-y-1.5">
                    {aiAssistantPoints.map((p) => (
                      <p key={p} className="flex items-start gap-1.5 text-[10px] leading-snug text-zinc-600">
                        <Info size={12} className="mt-0.5 shrink-0 text-indigo-500" /> {p}
                      </p>
                    ))}
                  </div>
                </Card>

                <Card title="Quick Actions">
                  <div className="space-y-1.5">
                    {quickActions.map((a) => (
                      <button key={a.label} type="button" className="flex w-full items-start gap-2 rounded-lg border border-zinc-100 px-2 py-1.5 text-left hover:bg-indigo-50/40">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600"><a.icon size={13} /></span>
                        <span className="min-w-0">
                          <span className="block text-[10.5px] font-semibold text-zinc-800">{a.label}</span>
                          <span className="block text-[9.5px] leading-tight text-zinc-400">{a.detail}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </Card>
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

            <Card title="Interview Rounds Overview">
              <div className="space-y-0">
                {interviewRounds.map((r, i) => (
                  <div key={r.round} className={`relative flex gap-2.5 rounded-lg px-1.5 py-2 last:pb-0 ${r.status === 'In Progress' ? 'bg-indigo-50/50' : ''}`}>
                    {i < interviewRounds.length - 1 && <span className="absolute left-[15px] top-8 h-full w-px bg-zinc-200" />}
                    <span className={`relative z-10 mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${
                      r.status === 'Completed' ? 'bg-emerald-500 text-white'
                        : r.status === 'In Progress' ? 'border-2 border-indigo-600 bg-white text-indigo-600'
                          : 'border border-zinc-200 bg-white text-zinc-300'
                    }`}
                    >
                      {r.status === 'Completed' ? <CheckCircle2 size={13} /> : <span className="text-[9px] font-bold">{r.round.split(' ')[1]}</span>}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10.5px] font-semibold text-zinc-800">{r.round}</p>
                      <p className="truncate text-[9.5px] text-zinc-400">{r.name}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className={`inline-block whitespace-nowrap rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${roundStatusStyle[r.status]}`}>{r.status}</span>
                      <p className="mt-0.5 text-[9px] text-zinc-400">{r.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Interview Guidelines">
              <div className="space-y-1.5">
                {guidelines.map((g) => (
                  <p key={g} className="flex items-start gap-1.5 text-[10.5px] leading-snug text-zinc-600">
                    <ChevronRight size={12} className="mt-0.5 shrink-0 text-indigo-500" /> {g}
                  </p>
                ))}
              </div>
              <Link href="#" className="mt-2 flex items-center gap-1.5 border-t border-zinc-100 pt-2 text-[10.5px] font-semibold text-indigo-600 hover:text-indigo-700">
                <LifeBuoy size={12} /> Need Help? View Guidelines <ExternalLink size={11} />
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
