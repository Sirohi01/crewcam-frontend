'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import {
  ChevronRight, Flag, TrendingUp, Star, Trophy, Target, Rocket, CheckCircle2,
  Handshake, MessageCircle, Users, Award, BarChart3, LineChart,
  GraduationCap, ExternalLink, ArrowRight, UserCog, MessagesSquare,
} from 'lucide-react';

const statCards = [
  { title: 'Current Position', value: 'Executive - Sales', note: 'Since 15 Nov 2022', cta: 'View Role Details', icon: Flag, bg: 'bg-blue-100', fg: 'text-blue-600' },
  { title: 'Total Experience', value: '4 Yrs 7 Mos', note: 'In CrewCam', cta: 'View Experience', icon: TrendingUp, bg: 'bg-emerald-100', fg: 'text-emerald-600' },
  { title: 'Performance Rating', value: '4.4 / 5', note: 'Last Appraisal: Apr 2024', cta: 'View Performance', icon: Star, bg: 'bg-orange-100', fg: 'text-orange-600', stars: 4 },
  { title: 'Next Review', value: 'Apr 2025', note: 'Promotion Cycle: Annual', cta: 'View Timeline', icon: Trophy, bg: 'bg-purple-100', fg: 'text-purple-600' },
  { title: 'Career Goal', value: 'Sales Manager', note: 'Target Position', cta: 'Update Goal', icon: Target, bg: 'bg-cyan-100', fg: 'text-cyan-600' },
];

const roadmap = [
  { role: 'Executive - Sales', tag: 'Current Role', date: 'Since Nov 2022', status: 'done' as const },
  { role: 'Senior Executive', tag: 'Next Role', date: 'Expected: 2025', status: 'current' as const },
  { role: 'Assistant Manager', tag: 'Target Role', date: 'Expected: 2026', status: 'upcoming' as const },
  { role: 'Sales Manager', tag: 'Career Goal', date: 'Expected: 2027+', status: 'upcoming' as const },
];

const eligibility = [
  { label: 'Performance Score', status: 'Met', tone: 'text-emerald-600' },
  { label: 'Experience', status: 'Met', tone: 'text-emerald-600' },
  { label: 'Skill Requirements', status: 'In Progress', tone: 'text-orange-600' },
  { label: 'Leadership Competency', status: 'In Progress', tone: 'text-orange-600' },
  { label: 'Certification', status: 'Not Started', tone: 'text-red-500' },
];

const strengths = [
  { label: 'Client Relationship', pct: 90, icon: Handshake },
  { label: 'Communication', pct: 85, icon: MessageCircle },
  { label: 'Sales Strategy', pct: 80, icon: TrendingUp },
  { label: 'Negotiation', pct: 75, icon: Users },
];

const improvements = [
  { label: 'People Management', pct: 45, icon: UserCog },
  { label: 'Data Analysis', pct: 50, icon: BarChart3 },
  { label: 'Strategic Planning', pct: 55, icon: Target },
  { label: 'Advanced Analytics', pct: 40, icon: LineChart },
];

const evaluations = [
  { month: 'Apr', year: '2024', title: 'Annual Performance Review', rating: '4.4 / 5', note: 'Exceeds Expectations' },
  { month: 'Oct', year: '2023', title: 'Mid Year Review', rating: '4.2 / 5', note: 'Meets Expectations' },
  { month: 'Apr', year: '2023', title: 'Annual Performance Review', rating: '4.1 / 5', note: 'Meets Expectations' },
];

const nextRoles = [
  { title: 'Senior Executive - Sales', match: 95 },
  { title: 'Assistant Manager - Sales', match: 75 },
  { title: 'Key Account Executive', match: 70 },
];

const learning = [
  { title: 'Leadership Essentials', desc: 'Build core leadership skills', pct: 60 },
  { title: 'Advanced Sales Strategy', desc: 'Drive growth with strategy', pct: 30 },
  { title: 'People Management', desc: 'Manage and motivate teams', pct: 20 },
  { title: 'Data-Driven Decision Making', desc: 'Make better business decisions', pct: 0 },
];

function EligibilityRing({ value }: { value: number }) {
  const size = 100;
  const stroke = 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#e5e7eb" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={r} stroke="#16a34a" strokeWidth={stroke} fill="none"
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
      />
    </svg>
  );
}

export default function CareerProgressionPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-4 pt-1 space-y-2">

        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center text-[12px] text-gray-500 mb-0.5">
              <Link href="/company" className="hover:text-blue-600 transition-colors">Dashboard</Link>
              <ChevronRight size={14} className="mx-1" />
              <span className="font-medium text-gray-900">Career Progression &amp; Promotion</span>
            </div>
            <h1 className="text-[20px] font-bold text-gray-900 leading-tight">Career Progression &amp; Promotion</h1>
            <p className="text-[11.5px] text-gray-500 mt-0.5">Plan your career path, build skills, and achieve your next milestone.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm shrink-0">
            <UserCog size={14} />
            View My Profile
          </button>
        </div>

        {/* Stat cards row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5">
          {statCards.map(({ title, value, note, cta, icon: Icon, bg, fg, stars }) => (
            <Card key={title} className="border-gray-200 shadow-sm rounded-xl bg-white">
              <CardContent className="p-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className={`w-7 h-7 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                    <Icon size={14} className={fg} />
                  </div>
                  <p className="text-[10.5px] text-gray-500 leading-tight">{title}</p>
                </div>
                <p className="text-[14px] font-bold text-gray-900 leading-tight">{value}</p>
                {stars && (
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={10} className={i < stars ? 'text-orange-400 fill-orange-400' : 'text-gray-200 fill-gray-200'} />
                    ))}
                  </div>
                )}
                <p className="text-[10px] text-gray-400 leading-tight mt-0.5">{note}</p>
                <Link href="#" className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${fg} hover:underline mt-1`}>
                  {cta} <ChevronRight size={11} />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Career Roadmap + Promotion Eligibility */}
        <div className="flex flex-col xl:flex-row gap-2">
          <div className="flex-1 min-w-0">
            <Card className="border-gray-200 shadow-sm rounded-xl bg-white h-full">
              <CardContent className="p-3">
                <h3 className="text-[14px] font-bold text-gray-900 mb-2">My Career Roadmap</h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {roadmap.map(({ role, tag, date, status }) => (
                    <div
                      key={role}
                      className={`rounded-xl border p-2.5 ${
                        status === 'done' ? 'bg-emerald-50/60 border-emerald-200'
                        : status === 'current' ? 'bg-blue-50/60 border-blue-300'
                        : 'bg-gray-50/60 border-gray-200'
                      }`}
                    >
                      <p className="text-[12px] font-bold text-gray-900 leading-tight">{role}</p>
                      <p className="text-[10px] text-gray-500 mt-1">{tag}</p>
                      <p className="text-[10px] text-gray-400">{date}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center px-1">
                  {roadmap.map((step, i) => (
                    <React.Fragment key={step.role}>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        step.status === 'done' ? 'bg-emerald-500 border-emerald-500'
                        : step.status === 'current' ? 'bg-white border-blue-600'
                        : 'bg-white border-gray-300'
                      }`}>
                        {step.status === 'done' && <CheckCircle2 size={10} className="text-white" fill="currentColor" />}
                        {step.status === 'current' && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                      </div>
                      {i < roadmap.length - 1 && (
                        <div className={`flex-1 h-[2px] ${step.status === 'done' ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <Link
                  href="#"
                  className="mt-2.5 flex items-center justify-between gap-3 rounded-xl bg-indigo-50/70 border border-indigo-100 p-2.5 hover:bg-indigo-50 transition-colors"
                >
                  <div className="flex items-start gap-2.5">
                    <Rocket size={17} className="text-indigo-500 shrink-0 mt-0.5" />
                    <p className="text-[12px] font-semibold text-gray-900">
                      Great Progress! You are on track for your next role: <span className="text-indigo-600">Senior Executive</span>
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-blue-600 shrink-0">
                    View Full Career Path <ChevronRight size={13} />
                  </span>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="w-full xl:w-[380px] shrink-0">
            <Card className="border-gray-200 shadow-sm rounded-xl bg-white h-full">
              <CardContent className="p-3">
                <h3 className="text-[14px] font-bold text-gray-900 mb-2">Promotion Eligibility</h3>
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <EligibilityRing value={72} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[18px] font-bold text-gray-900 leading-none">72%</span>
                      <span className="text-[9.5px] text-gray-500 mt-0.5">Eligible</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-1.5 min-w-0">
                    {eligibility.map(({ label, status, tone }) => (
                      <div key={label} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <CheckCircle2 size={13} className={`${tone} shrink-0`} />
                          <p className="text-[11px] font-medium text-gray-700 truncate">{label}</p>
                        </div>
                        <p className={`text-[10.5px] font-semibold shrink-0 ${tone}`}>{status}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <Link href="#" className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-blue-600 hover:underline mt-2.5">
                  View Eligibility Details <ChevronRight size={13} />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Skills & Competencies + Recent Performance Evaluations + Potential Next Roles */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_0.85fr] gap-2">
          <Card className="border-gray-200 shadow-sm rounded-xl bg-white">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[14px] font-bold text-gray-900">Skills &amp; Competencies</h3>
                <Link href="#" className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-blue-600 hover:underline">
                  View All Skills <ChevronRight size={12} />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="rounded-xl bg-emerald-50/60 border border-emerald-100 p-2.5">
                  <p className="text-[11px] font-semibold text-gray-700 mb-1.5">Top Strengths</p>
                  <div className="space-y-1.5">
                    {strengths.map(({ label, pct, icon: Icon }) => (
                      <div key={label} className="flex items-center gap-1.5">
                        <Icon size={13} className="text-emerald-600 shrink-0" />
                        <span className="text-[10.5px] text-gray-700 w-[92px] shrink-0 truncate">{label}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-emerald-100 overflow-hidden">
                          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] font-semibold text-gray-500 w-6 text-right shrink-0">{pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl bg-orange-50/60 border border-orange-100 p-2.5">
                  <p className="text-[11px] font-semibold text-gray-700 mb-1.5">Skills to Improve</p>
                  <div className="space-y-1.5">
                    {improvements.map(({ label, pct, icon: Icon }) => (
                      <div key={label} className="flex items-center gap-1.5">
                        <Icon size={13} className="text-orange-600 shrink-0" />
                        <span className="text-[10.5px] text-gray-700 w-[92px] shrink-0 truncate">{label}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-orange-100 overflow-hidden">
                          <div className="h-full rounded-full bg-orange-500" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] font-semibold text-gray-500 w-6 text-right shrink-0">{pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <Link href="#" className="mt-2 flex items-center justify-center gap-1.5 rounded-full border border-gray-200 py-1.5 text-[11.5px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                <GraduationCap size={14} />
                Explore Learning Programs Recommended for You
                <ChevronRight size={12} />
              </Link>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm rounded-xl bg-white flex flex-col">
            <CardContent className="p-3 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[14px] font-bold text-gray-900">Recent Performance Evaluations</h3>
                <Link href="#" className="text-[11.5px] font-semibold text-blue-600 hover:underline">View All</Link>
              </div>
              <div className="space-y-2 flex-1">
                {evaluations.map(({ month, year, title, rating, note }, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[9.5px] font-semibold text-gray-500 leading-none">{month}</span>
                      <span className="text-[10px] font-bold text-gray-800 leading-none mt-0.5">{year}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-gray-900 truncate">{title}</p>
                      <p className="text-[10.5px] text-gray-500 truncate">
                        Rating: <span className="font-semibold text-orange-500">{rating}</span> • {note}
                      </p>
                    </div>
                    <Link href="#" className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-blue-600 hover:underline shrink-0">
                      View Report <ExternalLink size={11} />
                    </Link>
                  </div>
                ))}
              </div>
              <Link href="#" className="inline-flex items-center justify-center gap-1 text-[11.5px] font-semibold text-blue-600 hover:underline mt-2">
                View Performance History <ChevronRight size={13} />
              </Link>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm rounded-xl bg-white flex flex-col">
            <CardContent className="p-3 flex-1 flex flex-col">
              <h3 className="text-[14px] font-bold text-gray-900 mb-2">Potential Next Roles for You</h3>
              <div className="space-y-1.5 flex-1">
                {nextRoles.map(({ title, match }) => (
                  <Link key={title} href="#" className="flex items-center justify-between gap-2 rounded-xl border border-gray-100 p-2 hover:border-gray-200 hover:bg-gray-50/60 transition-colors">
                    <p className="text-[11.5px] font-semibold text-gray-900 truncate">{title}</p>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className={`text-[10.5px] font-semibold ${match >= 90 ? 'text-emerald-600' : 'text-orange-500'}`}>{match}% Match</span>
                      <ChevronRight size={13} className="text-gray-400" />
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="#" className="inline-flex items-center justify-center gap-1.5 rounded-full border border-gray-200 py-1.5 text-[11.5px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors mt-2">
                <ArrowRight size={13} />
                Explore All Roles
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Learning & Development Recommendations + Need Guidance */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-2">
          <Card className="border-gray-200 shadow-sm rounded-xl bg-white">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[14px] font-bold text-gray-900">Learning &amp; Development Recommendations</h3>
                <Link href="#" className="text-[11.5px] font-semibold text-blue-600 hover:underline">View All</Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {learning.map(({ title, desc, pct }) => (
                  <div key={title} className="rounded-xl border border-gray-100 p-2">
                    <div className="w-full h-14 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 mb-1.5" />
                    <p className="text-[11.5px] font-semibold text-gray-900 leading-tight truncate">{title}</p>
                    <p className="text-[10px] text-gray-500 leading-tight truncate mb-1">{desc}</p>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[10px] font-semibold text-gray-500 shrink-0">{pct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm rounded-xl bg-white">
            <CardContent className="p-3 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                  <MessagesSquare size={15} className="text-blue-600" />
                </div>
                <h3 className="text-[14px] font-bold text-gray-900">Need Guidance?</h3>
              </div>
              <p className="text-[11px] text-gray-500 mb-2">Book a 1:1 session with your manager or career coach.</p>
              <div className="flex-1 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center min-h-[60px] mb-2">
                <Award size={32} className="text-blue-300" />
              </div>
              <button className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 py-2 text-[12.5px] font-semibold text-white hover:bg-blue-700 transition-colors">
                <MessageCircle size={14} />
                Request Career Discussion
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
