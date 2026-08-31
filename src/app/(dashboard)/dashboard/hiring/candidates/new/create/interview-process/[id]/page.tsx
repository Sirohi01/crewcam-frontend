'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail, Phone, MapPin, Link2, ArrowRight, ArrowLeft, Info, Sparkles, Volume2, Copy,
  ChevronDown, CheckCircle2, Circle, Clock3,
  Check,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';

// Dummy data / static mockup — matches the approved design 1:1. This is the
// Interview-stage overview (step 6) of the same 8-step "Job Application"
// pipeline; drilling into a specific round opens the Interview Round pages.

const steps = [
  { num: 1, label: 'Upload CV', status: 'completed' },
  { num: 2, label: 'Review & Edit', status: 'completed' },
  { num: 3, label: 'Submit Application', status: 'completed' },
  { num: 4, label: 'AI Screening', status: 'completed' },
  { num: 5, label: 'HOD Review', status: 'completed' },
  { num: 6, label: 'Interview', status: 'active' },
  { num: 7, label: 'Offer', status: 'pending' },
  { num: 8, label: 'Onboarding', status: 'pending' },
];

const tabs = ['Interview Rounds', 'Written Test', 'AI Questions', 'Performance', 'Feedback'];

const applicationSummary = [
  { label: 'Application ID', value: 'APP-2026-000124' },
  { label: 'Applied On', value: '15 June 2026, 11:32 AM' },
  { label: 'Current Stage', value: 'Interview' },
  { label: 'AI Screening Score', value: '87%' },
];

const rounds = (candidateId: string) => [
  { name: 'Round 1', title: 'AI Screening Interview', badge: 'Current Round', duration: '30 Mins', questionsLabel: 'AI Generated Questions', status: 'In Progress', href: `/dashboard/hiring/candidates/new/create/interview-process/${candidateId}` },
  { name: 'Round 2', title: 'Technical Interview', badge: 'UPCOMING', duration: '40 Mins', questionsLabel: 'AI Generated Questions', status: 'Pending', href: `/dashboard/hiring/candidates/new/create/round-2/${candidateId}` },
  { name: 'Round 3', title: 'Managerial Interview', badge: 'UPCOMING', duration: '30 Mins', questionsLabel: 'AI Generated Questions', status: 'Pending', href: `/dashboard/hiring/candidates/new/create/round-3/${candidateId}` },
  { name: 'Round 4', title: 'Written Assessment', badge: 'UPCOMING', duration: '45 Mins', questionsLabel: 'AI Generated Test', status: 'Pending', href: `/dashboard/hiring/candidates/new/create/round-4/${candidateId}` },
  { name: 'Round 5', title: 'HR Interview', badge: 'UPCOMING', duration: '25 Mins', questionsLabel: 'AI Generated Questions', status: 'Pending', href: `/dashboard/hiring/candidates/new/create/round-5/${candidateId}` },
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
  const router = useRouter();
  const params = useParams();
  const candidateId = params.id as string;
  const [activeTab, setActiveTab] = useState('Interview Rounds');
  const [roundTab, setRoundTab] = useState<'questions' | 'transcript'>('questions');
  const [openQ, setOpenQ] = useState<number>(1);
  const [candidate, setCandidate] = useState<any>(null);
  const [completedRounds, setCompletedRounds] = useState<number[]>([]);

  React.useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('ai_completed_rounds') || '[]');
      setCompletedRounds(stored);
    } catch (e) { }
  }, []);

  const dynamicRounds = rounds(candidateId).map((r, idx) => {
    const isCompleted = completedRounds.includes(idx + 1);
    const isCurrent = !isCompleted && (idx === 0 || completedRounds.includes(idx));
    return {
      ...r,
      status: isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Pending',
      badge: isCompleted ? 'COMPLETED' : isCurrent ? 'Current Round' : 'UPCOMING'
    };
  });

  const dynamicTimeline = timeline.map((item, idx) => {
    if (idx >= 3 && idx <= 7) {
      const roundNum = idx - 2;
      const isCompleted = completedRounds.includes(roundNum);
      const isCurrent = !isCompleted && (roundNum === 1 || completedRounds.includes(roundNum - 1));
      return {
        ...item,
        state: isCompleted ? 'done' : isCurrent ? 'current' : 'pending',
        detail: isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'
      };
    }
    return item;
  });

  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [isInterviewEnded, setIsInterviewEnded] = useState(false);


  React.useEffect(() => {
    if (timeLeft > 0 && !isInterviewEnded) {
      const timerId = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearInterval(timerId);
    } else if (timeLeft === 0 && !isInterviewEnded) {
      handleEndInterview();
    }
  }, [timeLeft, isInterviewEnded]);

  const handleEndInterview = () => {
    if (isInterviewEnded) return;
    setIsInterviewEnded(true);
    toast.success('Interview ended automatically.');
    router.push(`/dashboard/hiring/candidates/new/create/evaluation/${candidateId}`);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const timerPercentage = (timeLeft / (30 * 60)) * 100;

  React.useEffect(() => {
    if (candidateId) {
      const fetchCandidate = async () => {
        try {
          let cId = candidateId;
          if (!/^[0-9a-fA-F]{24}$/.test(candidateId)) {
            const res = await api.get(`/hiring/candidates?limit=1000`);
            const candidates = res.data?.data || res.data || [];
            const match = candidates.find((c: any) => {
              const nameSlug = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
              return nameSlug === candidateId;
            });
            if (match) cId = match._id;
            else throw new Error("Candidate not found");
          }

          const res = await api.get(`/hiring/candidates/${cId}`);
          const data = res.data;
          const appDetails = data.applicationDetails || {};

          setCandidate({
            fullName: data.firstName + (data.lastName ? ' ' + data.lastName : ''),
            email: data.email || '',
            mobile: data.phone || '',
            currentLocation: appDetails.currentLocation || '',
            linkedin: appDetails.linkedin || '',
            appliedFor: data.jobRole || '',
            department: data.departmentId?.name || data.departmentId || '',
            employmentType: appDetails.employmentType || 'Full Time',
            totalExperience: appDetails.totalExperience || '',
            expectedCTC: appDetails.expectedCTC || '',
            noticePeriod: appDetails.noticePeriod || '',
            resumeUrl: data.resumeUrl
          });
        } catch (err) {
          console.error(err);
          toast.error('Failed to load candidate details');
        }
      };
      fetchCandidate();
    }
  }, [candidateId]);

  if (!candidate) return <div className="p-8 text-center text-zinc-500 font-medium">Loading candidate details...</div>;

  return (
    <div className="w-full max-w-[1600px] px-2 py-1 mx-auto space-y-2 font-sans text-zinc-900 min-h-screen">
      <div className="mx-auto max-w-[1600px] space-y-2 p-1">
        {/* HEADER & HORIZONTAL STEP INDICATOR */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-4 mb-3">
          {/* Title */}
          <div className="shrink-0 w-full lg:w-[280px] xl:w-[340px]">
            <h1 className="text-[17px] font-bold text-zinc-900 tracking-tight leading-tight">Interview Process &ndash; AI Powered</h1>
            <p className="text-[11px] font-medium text-zinc-500 mt-0.5">All interview rounds will be AI-driven with AI-generated questions.</p>
          </div>

          {/* Steps */}
          <div className="flex-1 max-w-[550px] xl:max-w-[600px] w-full flex items-center justify-center relative mx-auto">
            <div className="absolute left-[30px] right-[30px] top-[11px] h-[2px] bg-zinc-200 -z-0"></div>
            <div className="flex w-full justify-between z-10">
              {steps.map((step, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center gap-1 px-1 bg-slate-50 lg:bg-transparent">
                  <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors
                    ${step.status === 'completed' ? 'border-indigo-100 text-indigo-600 bg-indigo-50' :
                      step.status === 'active' ? 'border-indigo-600 bg-indigo-600 text-white shadow-[0_0_0_3px_rgba(79,70,229,0.15)]' :
                        'border-zinc-200 text-zinc-400 bg-white'}`}>
                    {step.status === 'completed' ? <Check className="w-3 h-3" strokeWidth={3} /> : step.num}
                  </div>
                  <span className={`text-[8.5px] lg:text-[9px] whitespace-nowrap font-bold ${step.status === 'active' ? 'text-indigo-900' : step.status === 'completed' ? 'text-indigo-600' : 'text-zinc-400'}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 shrink-0 w-full lg:w-[280px] xl:w-[340px]">
            <button className="flex items-center justify-center h-8 px-3 rounded-md text-[11px] font-semibold text-zinc-700 border border-zinc-200 bg-white hover:bg-zinc-50 shadow-sm transition-colors">
              Save as Draft
            </button>
            <button type="button" onClick={() => window.open('/dashboard/offers', "_blank")} className="flex items-center justify-center h-8 px-4 rounded-md text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors">
              Start Interview &rarr;
            </button>
          </div>
        </div>

        <div className="h-[1px] bg-zinc-200 w-full mb-2 shrink-0"></div>

        <div className="grid grid-cols-1 items-start gap-2 lg:grid-cols-[7fr_3fr]">
          <div className="min-w-0 space-y-2">
            {/* Candidate banner */}
            <Card className="bg-white">
              <div className="grid grid-cols-1 gap-2 lg:grid-cols-[auto_1fr_1fr]">
                <div className="flex items-start gap-3">
                  <span className="h-16 w-16 shrink-0 rounded-full bg-zinc-200 overflow-hidden"><img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Candidate" className="w-full h-full object-cover" /></span>
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-1.5 text-[14px] font-bold text-zinc-900">
                      {candidate.fullName}
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-600">Interview In Progress</span>
                    </p>
                    <p className="text-[10.5px] text-zinc-500">{candidate.appliedFor}</p>
                    <div className="mt-1 space-y-0.5 text-[10px] text-zinc-500">
                      <p className="flex items-center gap-1"><Phone size={11} className="text-zinc-400" /> {candidate.mobile} <Mail size={11} className="ml-2 text-zinc-400" /> {candidate.email}</p>
                      <p className="flex items-center gap-1"><MapPin size={11} className="text-zinc-400" /> {candidate.currentLocation}</p>
                      <p className="flex items-center gap-1 hover:underline cursor-pointer" onClick={() => window.open(candidate.linkedin, '_blank')}><Link2 size={11} className="text-zinc-400" /> {candidate.linkedin}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-[10.5px]">
                  <div><p className="text-zinc-400">Applied For</p><p className="font-bold text-zinc-800">{candidate.appliedFor}</p></div>
                  <div><p className="text-zinc-400">Department</p><p className="font-bold text-zinc-800">{candidate.department}</p></div>
                  <div><p className="text-zinc-400">Experience</p><p className="font-bold text-zinc-800">{candidate.totalExperience} Years</p></div>
                </div>

                <div className="space-y-1.5 text-[10.5px]">
                  <div><p className="text-zinc-400">Expected CTC</p><p className="font-bold text-zinc-800">₹ {candidate.expectedCTC}</p></div>
                  <div><p className="text-zinc-400">Notice Period</p><p className="font-bold text-zinc-800">{candidate.noticePeriod}</p></div>
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
                {rounds(candidateId).map((r, i) => (
                  <React.Fragment key={r.name}>
                    <div
                      onClick={() => r.href && window.open(r.href, '_blank')}
                      className={`min-w-0 flex-1 rounded-lg border p-1.5 cursor-pointer hover:border-indigo-400 transition-colors ${i === 0 ? 'border-indigo-300 bg-indigo-50/40' : 'border-zinc-200'}`}
                    >
                      <p className="truncate text-[11px] font-bold text-zinc-800">{r.name}</p>
                      <p className="truncate text-[10px] text-zinc-500">{r.title}</p>
                      <span className={`mt-1 inline-block truncate rounded-full px-1.5 py-0.5 text-[8.5px] font-semibold ${i === 0 ? 'bg-indigo-600 text-white' : 'bg-zinc-100 text-zinc-500'}`}>{r.badge}</span>
                      <p className="mt-1 flex items-center gap-1 truncate text-[9px] text-zinc-500"><Clock3 size={10} className="shrink-0 text-zinc-400" /> <span className="truncate">{r.duration}</span></p>
                      <p className="mt-0.5 flex items-center gap-1 truncate text-[9px] text-zinc-500"><Sparkles size={10} className="shrink-0 text-zinc-400" /> <span className="truncate">{r.questionsLabel}</span></p>
                      <p className={`mt-0.5 flex items-center gap-1 truncate text-[9px] font-medium ${i === 0 ? 'text-indigo-600' : 'text-zinc-400'}`}><Info size={10} className="shrink-0" /> <span className="truncate">{r.status}</span></p>
                    </div>
                    {i < rounds(candidateId).length - 1 && <span className="flex shrink-0 items-center text-zinc-300"><ArrowRight size={14} /></span>}
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
                    <div className="relative mx-auto grid h-20 w-20 place-items-center rounded-full" style={{ background: `conic-gradient(#22c55e ${timerPercentage}%, #e5e7eb 0)` }}>
                      <div className="flex flex-col items-center justify-center h-16 w-16 rounded-full bg-white text-center">
                        <p className={`text-[14px] leading-none font-bold ${timeLeft < 60 ? 'text-rose-600' : 'text-zinc-900'}`}>{formatTime(timeLeft)}</p>
                        <p className="text-[8px] leading-none mt-1 text-zinc-400">of 30:00</p>
                      </div>
                    </div>
                    <button type="button" onClick={handleEndInterview} className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors hover:text-rose-600 hover:border-rose-200">
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
            <Card title="Application Summary" className="bg-white">
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
                {dynamicTimeline.map((t, i) => (
                  <div key={t.title} className="relative flex gap-2 pb-2 last:pb-0">
                    {i < dynamicTimeline.length - 1 && <span className="absolute left-[7px] top-4 h-full w-px bg-zinc-200" />}
                    <span className={`relative z-10 mt-0.5 grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full ${t.state === 'done' ? 'bg-emerald-500 text-white'
                      : t.state === 'current' ? 'border-2 border-indigo-600 bg-white'
                        : 'border border-zinc-200 bg-white'
                      }`}>
                      {t.state === 'done' && <Check size={8} strokeWidth={4} />}
                    </span>
                    <div className="flex-1">
                      <p className={`text-[11px] font-bold ${t.state === 'done' || t.state === 'current' ? 'text-zinc-800' : 'text-zinc-400'}`}>{t.title}</p>
                      <p className="text-[9.5px] text-zinc-500">{t.detail}</p>
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
