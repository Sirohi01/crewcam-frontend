'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Link2, Mail, Phone, MapPin, ChevronDown, Download, Star, CheckCircle2,
  GraduationCap, File, CalendarPlus, ArrowRightLeft, Send, StickyNote, ClipboardList,
  Sparkles, Circle,
} from 'lucide-react';

// Dummy data / static mockup — matches the approved design 1:1. Every candidate
// row on the Selected Candidates page links here; the id param isn't wired to a
// real record yet, so the same sample profile renders regardless of who you click.

const candidate = {
  name: 'Amit Kumar Verma',
  title: 'Sales Manager',
  stage: 'Final Interview',
  status: 'Active',
  phone: '+91 98765 43210',
  email: 'amit.verma@email.com',
  location: 'Noida, Uttar Pradesh',
  candidateId: 'CAN-2026-0158',
  company: 'ABC Pvt. Ltd.',
  designation: 'Senior Sales Executive',
  experience: '7 Years',
  currentCtc: '₹ 8.50 LPA',
  expectedCtc: '₹ 12.00 LPA',
  noticePeriod: '30 Days',
  availability: 'Immediate',
  source: 'LinkedIn',
  profileCompletion: 85,
  lastUpdated: '21 May 2026',
};

const tabs = ['Overview', 'Personal Details', 'Experience', 'Education', 'Skills', 'Documents', 'Interview', 'Offers', 'Communication', 'History', 'AI Insights'];

const stageSteps = [
  { label: 'Applied', date: '10 May 2026', state: 'done' },
  { label: 'Screening', date: '12 May 2026', state: 'done' },
  { label: 'HR Interview', date: '15 May 2026', state: 'done' },
  { label: 'Technical Interview', date: '18 May 2026', state: 'done' },
  { label: 'Final Interview', date: '21 May 2026', state: 'current' },
  { label: 'Offer', date: '', state: 'pending' },
];

const skills = ['Sales Strategy', 'CRM', 'Client Relationship', 'Team Leadership', 'Business Development', 'Negotiation', 'Market Analysis', 'Presentation'];

const experienceHistory = [
  { role: 'Senior Sales Executive', company: 'ABC Pvt. Ltd.', period: 'Jun 2021 - Present (2 Yrs 11 Mos)', points: ['Managing key enterprise clients and driving revenue growth', 'Leading a team of 5 sales executives', 'Achieved 125% of annual sales target for 2 consecutive years'] },
  { role: 'Sales Executive', company: 'XYZ Solutions Pvt. Ltd.', period: 'May 2019 - May 2021 (2 Yrs)', points: ['Handled client acquisition and retention', 'Consistently met quarterly sales targets'] },
];

const education = [
  { degree: 'MBA - Marketing', school: 'Amity University, Noida', period: '2017 - 2019' },
  { degree: 'BBA', school: 'Delhi University, Delhi', period: '2014 - 2017' },
];

const documents = [
  { name: 'Resume / CV', date: '10 May 2026' },
  { name: 'Aadhar Card', date: '10 May 2026' },
  { name: 'PAN Card', date: '10 May 2026' },
  { name: 'Experience Letter - ABC Pvt. Ltd.', date: '10 May 2026' },
];

const quickActions = [
  { label: 'Schedule Interview', icon: CalendarPlus },
  { label: 'Move Stage', icon: ArrowRightLeft },
  { label: 'Send Email', icon: Send },
  { label: 'Add Note', icon: StickyNote },
  { label: 'Add Rating', icon: Star },
  { label: 'View Application', icon: ClipboardList },
];

const communicationHistory = [
  { date: '21 May 2026', type: 'Email', subject: 'Final Interview Update', by: 'Reetika Singh', status: 'Sent' },
  { date: '18 May 2026', type: 'Email', subject: 'Technical Interview Invite', by: 'HR Team', status: 'Sent' },
  { date: '12 May 2026', type: 'Email', subject: 'Application Acknowledgement', by: 'HR Team', status: 'Sent' },
];

const aiInsights = [
  { label: 'Strong match for this role', value: '92%' },
  { label: 'Sales & CRM experience aligns well', value: 'High' },
  { label: 'Leadership potential', value: 'Good' },
  { label: 'Communication Skills', value: 'Excellent' },
  { label: 'Decision Making', value: 'Good' },
];

const ratings = [
  { label: 'Technical Skills', value: 4 },
  { label: 'Communication', value: 5 },
  { label: 'Experience', value: 4 },
  { label: 'Leadership', value: 4 },
  { label: 'Cultural Fit', value: 4 },
];

const activityTimeline = [
  { title: 'Final Interview Completed', by: 'Reetika Singh', date: '21 May 2026' },
  { title: 'Technical Interview Completed', by: 'Vikram Mehta', date: '18 May 2026' },
  { title: 'HR Interview Completed', by: 'Swati Verma', date: '15 May 2026' },
  { title: 'Application Received', by: 'via LinkedIn', date: '10 May 2026' },
];

function Card({
  title, action, children, className = '',
}: { title?: string; action?: React.ReactNode; children?: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[2px] border border-zinc-200 bg-white shadow-sm ${className}`}>
      {title && (
        <div className="flex items-center justify-between gap-2 border-b border-zinc-100 px-2.5 py-1.5">
          <h3 className="text-[12px] font-bold text-zinc-800">{title}</h3>
          {action}
        </div>
      )}
      <div className="px-2.5 pb-2 pt-1">{children}</div>
    </div>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} className={i < Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'} />
      ))}
    </div>
  );
}

export default function CandidateDetailsPage() {
  const [tab, setTab] = useState('Overview');

  return (
    <div className="font-sans">
      <div className="mx-auto max-w-[1500px] space-y-2 p-1">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-zinc-900">Candidate Details</h1>
            <p className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-zinc-500">
              <span>Recruitment</span> <span>›</span> <span>Candidates</span> <span>›</span>
              <span className="font-semibold text-zinc-700">Candidate Details</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/hiring/candidates/selected" className="flex items-center gap-1.5 rounded-[2px] border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50">
              Back
            </Link>
            <button type="button" className="flex items-center gap-1.5 rounded-[2px] border border-indigo-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50">
              <Download size={13} /> Download CV
            </button>
            <button type="button" className="flex items-center gap-1.5 rounded-[2px] bg-indigo-600 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-indigo-700">
              Actions <ChevronDown size={13} />
            </button>
          </div>
        </div>

        {/* Profile banner */}
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-[3fr_1fr]">
          <div className="grid grid-cols-[auto_1fr] gap-x-4 rounded-[2px] border border-zinc-200 bg-white p-2.5 shadow-sm">
            <div className="row-span-2 shrink-0 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-[2px] bg-zinc-100 text-[14px] font-bold text-zinc-500">AV</span>
              <span className="mt-1.5 inline-block rounded-[2px] bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-600">{candidate.status}</span>
            </div>

            <div className="flex flex-wrap items-start gap-4">
              <div className="min-w-[220px] flex-1">
                <p className="flex items-center gap-1.5 text-[15px] font-bold text-zinc-900">
                  {candidate.name}
                  <Link2 size={13} className="text-blue-500" />
                  <Mail size={13} className="text-zinc-400" />
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-zinc-600">
                  {candidate.title}
                  <span className="rounded-[2px] bg-blue-50 px-2 py-0.5 text-[9.5px] font-semibold text-blue-600">{candidate.stage}</span>
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10.5px] text-zinc-500">
                  <span className="flex items-center gap-1"><Phone size={11} className="text-zinc-400" /> {candidate.phone}</span>
                  <span className="flex items-center gap-1"><Mail size={11} className="text-zinc-400" /> {candidate.email}</span>
                  <span className="flex items-center gap-1"><MapPin size={11} className="text-zinc-400" /> {candidate.location}</span>
                </div>
              </div>

              <div className="shrink-0 space-y-1 text-[10.5px]">
                <div className="flex items-center gap-6"><span className="text-zinc-400">Candidate ID</span><span className="ml-auto font-semibold text-zinc-800">{candidate.candidateId}</span></div>
                <div className="flex items-center gap-6"><span className="text-zinc-400">Current Company</span><span className="ml-auto font-semibold text-zinc-800">{candidate.company}</span></div>
                <div className="flex items-center gap-6"><span className="text-zinc-400">Current Designation</span><span className="ml-auto font-semibold text-zinc-800">{candidate.designation}</span></div>
              </div>
            </div>

            <div className="mt-1.5 grid grid-cols-2 gap-2 border-t border-zinc-100 pt-1.5 text-[10.5px] leading-tight sm:grid-cols-3 lg:grid-cols-6">
              <div><p className="text-zinc-400 leading-tight">Total Experience</p><p className="font-semibold leading-tight text-zinc-800">{candidate.experience}</p></div>
              <div><p className="text-zinc-400 leading-tight">Current CTC</p><p className="font-semibold leading-tight text-zinc-800">{candidate.currentCtc}</p></div>
              <div><p className="text-zinc-400 leading-tight">Expected CTC</p><p className="font-semibold leading-tight text-zinc-800">{candidate.expectedCtc}</p></div>
              <div><p className="text-zinc-400 leading-tight">Notice Period</p><p className="font-semibold leading-tight text-zinc-800">{candidate.noticePeriod}</p></div>
              <div><p className="text-zinc-400 leading-tight">Availability</p><p className="font-semibold leading-tight text-zinc-800">{candidate.availability}</p></div>
              <div><p className="text-zinc-400 leading-tight">Source</p><p className="font-semibold leading-tight text-zinc-800">{candidate.source}</p></div>
            </div>
          </div>

          <div className="rounded-[2px] border border-zinc-200 bg-white p-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-indigo-600">Profile Completion</span>
              <span className="text-[14px] font-bold text-zinc-900">{candidate.profileCompletion}%</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-[2px] bg-zinc-100">
              <div className="h-full rounded-[2px] bg-emerald-500" style={{ width: `${candidate.profileCompletion}%` }} />
            </div>
            <p className="mt-2 text-[10px] text-zinc-400">Last Updated</p>
            <p className="text-[11px] font-semibold text-zinc-700">{candidate.lastUpdated}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 overflow-x-auto rounded-[2px] border border-zinc-200 bg-white px-3 py-1.5">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`whitespace-nowrap border-b-2 py-1 text-[11px] font-semibold ${tab === t ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-[3fr_1fr]">
          <div className="space-y-2">
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
              <Card title="Application Summary">
                <div className="grid grid-cols-2 gap-y-1 text-[10.5px]">
                  <div><p className="text-zinc-400">Applied For</p><p className="font-semibold text-zinc-800">{candidate.title}</p></div>
                  <div><p className="text-zinc-400">Department</p><p className="font-semibold text-zinc-800">Sales &amp; Marketing</p></div>
                  <div><p className="text-zinc-400">Job Opening</p><p className="font-semibold text-zinc-800">Sales Manager - North Region</p></div>
                  <div><p className="text-zinc-400">Applied On</p><p className="font-semibold text-zinc-800">10 May 2026</p></div>
                  <div><p className="text-zinc-400">Current Stage</p><p className="font-semibold text-zinc-800">{candidate.stage}</p></div>
                  <div><p className="text-zinc-400">Application Source</p><p className="font-semibold text-zinc-800">{candidate.source}</p></div>
                  <div><p className="text-zinc-400">Referred By</p><p className="font-semibold text-zinc-800">Vikram Singh</p></div>
                  <div><p className="text-zinc-400">Candidate Type</p><p className="font-semibold text-zinc-800">External</p></div>
                </div>
              </Card>

              <Card title="Current Stage &amp; Progress">
                <div className="flex items-start justify-between">
                  {stageSteps.map((s) => (
                    <div key={s.label} className="flex flex-1 flex-col items-center text-center">
                      <span
                        className={`grid h-7 w-7 place-items-center rounded-[2px] ${s.state === 'done' ? 'bg-emerald-500 text-white'
                            : s.state === 'current' ? 'bg-indigo-600 text-white'
                              : 'border border-zinc-200 bg-white text-zinc-300'
                          }`}
                      >
                        {s.state === 'done' ? <CheckCircle2 size={13} /> : s.state === 'current' ? <Circle size={11} className="fill-current" /> : <Circle size={10} />}
                      </span>
                      <p className="mt-1 text-[9.5px] font-semibold text-zinc-700">{s.label}</p>
                      <p className="text-[8.5px] text-zinc-400">{s.date}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 rounded-[2px] bg-zinc-50 px-2.5 py-2 text-[10.5px]">
                  <div><p className="text-zinc-400">Next Step</p><p className="font-semibold text-zinc-800">Awaiting Final Interview Feedback</p></div>
                  <div><p className="text-zinc-400">Estimated Joining</p><p className="font-semibold text-zinc-800">01 Jun 2026 (Tentative)</p></div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
              <Card title="Key Skills">
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s) => (
                    <span key={s} className="rounded-[2px] bg-zinc-100 px-2 py-1 text-[10.5px] font-medium text-zinc-700">{s}</span>
                  ))}
                  <span className="rounded-[2px] bg-indigo-50 px-2 py-1 text-[10.5px] font-semibold text-indigo-600">+5 More</span>
                </div>
              </Card>

              <Card title="Experience Summary">
                <div className="space-y-1.5">
                  {experienceHistory.map((e) => (
                    <div key={e.role} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-[2px] bg-indigo-500" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <p className="text-[11px] font-semibold text-zinc-800">{e.role}</p>
                          <p className="text-[9.5px] text-zinc-400">{e.period}</p>
                        </div>
                        <p className="text-[10px] text-zinc-500">{e.company}</p>
                        <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[10px] text-zinc-500">
                          {e.points.map((p) => <li key={p}>{p}</li>)}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
              <Card title="Education" action={<Link href="#" className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-700">View All Education</Link>}>
                <div className="space-y-2">
                  {education.map((e) => (
                    <div key={e.degree} className="flex items-start gap-2">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[2px] bg-indigo-50 text-indigo-600"><GraduationCap size={13} /></span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[10.5px] font-semibold text-zinc-800">{e.degree}</p>
                        <p className="truncate text-[9.5px] text-zinc-400">{e.school}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-[9px] text-zinc-400">{e.period}</p>
                        <span className="text-[9px] font-semibold text-emerald-600">Verified</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Documents" action={<Link href="#" className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-700">View All Documents</Link>}>
                <div className="space-y-1">
                  {documents.map((d) => (
                    <div key={d.name} className="flex items-center gap-2">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[2px] bg-zinc-100 text-zinc-500"><File size={13} /></span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[10.5px] font-semibold text-zinc-800">{d.name}</p>
                        <p className="text-[9px] text-zinc-400">{d.date}</p>
                      </div>
                      <span className="shrink-0 rounded-[2px] bg-emerald-50 px-1.5 py-0.5 text-[8.5px] font-semibold text-emerald-600">Verified</span>
                      <Download size={13} className="shrink-0 text-zinc-400" />
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Quick Actions">
                <div className="grid grid-cols-3 gap-1.5">
                  {quickActions.map((a) => (
                    <button key={a.label} type="button" className="flex flex-col items-center gap-1 rounded-[2px] border border-zinc-100 px-1.5 py-2 text-center hover:bg-indigo-50/40">
                      <span className="grid h-7 w-7 place-items-center rounded-[2px] bg-indigo-50 text-indigo-600"><a.icon size={13} /></span>
                      <span className="text-[9px] font-medium leading-tight text-zinc-700">{a.label}</span>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
              <Card title="Notes" action={<Link href="#" className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-700">View All Notes</Link>}>
                <p className="text-[10.5px] leading-snug text-zinc-600">
                  Candidate has excellent communication skills and strong sales experience in the IT industry.
                  <br />Good leadership qualities observed during interviews.
                  <br />Recommended for offer discussion.
                </p>
                <p className="mt-1.5 text-[9.5px] text-zinc-400">- Reetika Singh (21 May 2026)</p>
              </Card>

              <Card title="Communication History" action={<Link href="#" className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-700">View All Communication</Link>}>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-left text-[9px] font-semibold uppercase tracking-wide text-zinc-400">
                      <th className="pb-1">Date</th><th className="pb-1">Type</th><th className="pb-1">Subject</th><th className="pb-1">By</th><th className="pb-1 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {communicationHistory.map((c) => (
                      <tr key={c.subject}>
                        <td className="py-1 text-[10px] text-zinc-500">{c.date}</td>
                        <td className="py-1 text-[10px] text-zinc-500">{c.type}</td>
                        <td className="py-1 text-[10px] font-medium text-zinc-700">{c.subject}</td>
                        <td className="py-1 text-[10px] text-zinc-500">{c.by}</td>
                        <td className="py-1 text-right"><span className="rounded-[2px] bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-600">{c.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-2">
            <Card title="AI Candidate Insights" action={<span className="rounded-[2px] bg-indigo-50 px-1.5 py-0.5 text-[9px] font-bold text-indigo-600">Beta</span>}>
              <div className="space-y-1">
                {aiInsights.map((i) => (
                  <div key={i.label} className="flex items-center gap-2">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-[2px] bg-indigo-50 text-indigo-600"><Sparkles size={12} /></span>
                    <span className="min-w-0 flex-1 truncate text-[10.5px] text-zinc-700">{i.label}</span>
                    <span className="shrink-0 text-[10.5px] font-bold text-zinc-800">{i.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 rounded-[2px] bg-indigo-50/60 px-2.5 py-2">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-700">AI Recommendation</span>
                  <span className="rounded-[2px] bg-indigo-600 px-1.5 py-0.5 text-[8.5px] font-semibold text-white">Shortlist</span>
                </div>
                <p className="text-[10px] leading-snug text-indigo-700/80">This candidate is a strong fit. Recommend moving to Offer Stage.</p>
              </div>
              <button type="button" className="mt-2 w-full rounded-[2px] border border-indigo-100 bg-white py-1.5 text-[10.5px] font-semibold text-indigo-600 hover:bg-indigo-50">
                View Full AI Report
              </button>
            </Card>

            <Card title="Candidate Rating">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                <span className="text-[10.5px] font-semibold text-zinc-600">Overall Rating</span>
                <div className="flex items-center gap-1.5">
                  <Stars value={4} />
                  <span className="text-[10.5px] font-bold text-zinc-800">4.0 / 5</span>
                </div>
              </div>
              <div className="mt-2 space-y-1">
                {ratings.map((r) => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span className="text-[10.5px] text-zinc-600">{r.label}</span>
                    <div className="flex items-center gap-1.5">
                      <Stars value={r.value} />
                      <span className="w-6 text-right text-[9.5px] font-semibold text-zinc-500">{r.value}/5</span>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className="mt-2 w-full rounded-[2px] bg-indigo-600 py-1.5 text-[10.5px] font-semibold text-white hover:bg-indigo-700">
                Add / Update Rating
              </button>
            </Card>

            <Card title="Activity Timeline" action={<Link href="#" className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-700">View All</Link>}>
              <div className="space-y-0">
                {activityTimeline.map((a, i) => (
                  <div key={a.title} className="relative flex gap-2.5 pb-2.5 last:pb-0">
                    {i < activityTimeline.length - 1 && <span className="absolute left-[3.5px] top-3 h-full w-px bg-zinc-200" />}
                    <span className="relative z-10 mt-1 h-2 w-2 shrink-0 rounded-[2px] bg-indigo-600" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10.5px] font-semibold text-zinc-800">{a.title}</p>
                      <p className="truncate text-[9.5px] text-zinc-400">by {a.by}</p>
                    </div>
                    <span className="shrink-0 text-[9px] text-zinc-400">{a.date}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
