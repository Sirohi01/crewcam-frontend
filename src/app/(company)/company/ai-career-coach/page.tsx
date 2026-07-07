'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sparkles, ChevronRight, ChevronsRight, Rocket, Trophy, TrendingUp, Users2,
  UsersRound, MessageCircle, Target, BarChart3, MessageSquare, Send, CheckCircle2,
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
} from 'recharts';

const statCards = [
  { key: 'fit', title: 'Career Fit Score', accent: '#2563eb' },
  { title: 'Skills Strength', value: '16', valueClass: 'text-emerald-600', note: 'Strong Skills', noteClass: 'text-emerald-600', desc: 'Keep leveraging them!', icon: Users2, bg: 'bg-emerald-100', fg: 'text-emerald-600' },
  { title: 'Skills to Improve', value: '5', valueClass: 'text-orange-600', note: 'Focus Areas', noteClass: 'text-orange-600', desc: 'Improve to unlock growth.', icon: UsersRound, bg: 'bg-orange-100', fg: 'text-orange-600' },
  { title: 'Growth Potential', value: 'High', valueClass: 'text-blue-600', valueSuffix: '↗', note: '', desc: 'You have strong potential for greater responsibilities.', icon: Users2, bg: 'bg-blue-100', fg: 'text-blue-600' },
  { title: 'Next Milestone', value: 'Senior Executive', valueClass: 'text-purple-600 text-[15px]', note: 'Target: Apr 2025', noteClass: 'text-blue-600', desc: 'On track for promotion.', icon: Trophy, bg: 'bg-purple-100', fg: 'text-purple-600' },
];

const journey = [
  { role: 'Executive - Sales', tag: 'Current Role', date: 'Since Nov 2022', status: 'done' as const },
  { role: 'Senior Executive', tag: 'Target Role', date: 'Apr 2025', status: 'current' as const },
  { role: 'Assistant Manager', tag: 'Target Role', date: 'Apr 2026', status: 'upcoming' as const },
  { role: 'Sales Manager', tag: 'Career Goal', date: 'Apr 2027+', status: 'upcoming' as const },
];

const recommendations = [
  { title: 'Improve Leadership Skills', desc: 'Build leadership to prepare for senior roles', icon: UsersRound, bg: 'bg-emerald-100', fg: 'text-emerald-600' },
  { title: 'Advanced Communication', desc: 'Strengthen stakeholder communication', icon: MessageCircle, bg: 'bg-purple-100', fg: 'text-purple-600' },
  { title: 'Strategic Thinking', desc: 'Enhance strategic & analytical abilities', icon: Target, bg: 'bg-orange-100', fg: 'text-orange-600' },
  { title: 'Data-Driven Decision Making', desc: 'Make better business decisions', icon: BarChart3, bg: 'bg-blue-100', fg: 'text-blue-600' },
];

const skillsRadarData = [
  { skill: 'Leadership', value: 75 },
  { skill: 'Communication', value: 85 },
  { skill: 'Problem Solving', value: 70 },
  { skill: 'Sales Expertise', value: 90 },
  { skill: 'Strategic Thinking', value: 60 },
];

const skillLegend = [
  { label: 'Excellent (80-100%)', color: 'bg-emerald-500' },
  { label: 'Good (60-79%)', color: 'bg-blue-500' },
  { label: 'Average (40-59%)', color: 'bg-orange-500' },
  { label: 'Needs Improvement (0-39%)', color: 'bg-red-500' },
];

const insights = [
  { text: 'You have strong sales expertise which is helping you exceed expectations.', icon: TrendingUp, bg: 'bg-emerald-100', fg: 'text-emerald-600' },
  { text: 'Develop leadership and people management skills to reach the next level.', icon: UsersRound, bg: 'bg-purple-100', fg: 'text-purple-600' },
  { text: 'Consider taking projects that involve cross-functional collaboration.', icon: Target, bg: 'bg-orange-100', fg: 'text-orange-600' },
  { text: 'Consistent improvement in communication can boost your impact.', icon: MessageSquare, bg: 'bg-blue-100', fg: 'text-blue-600' },
];

const learning = [
  { title: 'Leadership Essentials', status: 'In Progress', pct: 60 },
  { title: 'Advanced Sales Strategy', status: 'In Progress', pct: 40 },
  { title: 'Strategic Management', status: 'Not Started', pct: 0 },
];

const nextActions = [
  { label: 'Complete course: Leadership Essentials', due: 'Due: 25 May 2024' },
  { label: 'Work on: Cross-functional project', due: 'Due: 10 Jun 2024' },
  { label: 'Improve: Conflict Resolution skills', due: 'Due: 30 Jun 2024' },
];

function CareerFitRing({ value }: { value: number }) {
  const size = 56;
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#e5e7eb" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={r} stroke="#2563eb" strokeWidth={stroke} fill="none"
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
      />
    </svg>
  );
}

export default function AiCareerCoachPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-4 pt-1 space-y-2">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-[20px] font-bold text-gray-900 leading-tight flex items-center gap-1.5">
              AI Career Coach <Sparkles size={16} className="text-purple-500" />
            </h1>
            <p className="text-[11.5px] text-gray-500 mt-0.5">Your personal career growth partner</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-3.5 py-1.5 text-[12.5px] font-semibold text-white hover:bg-purple-700 transition-colors shadow-sm shrink-0">
            <MessageCircle size={14} />
            Ask AI Coach
          </button>
        </div>

        {/* Stat cards row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5">
          <Card className="border-gray-200 shadow-sm rounded-xl bg-white">
            <CardContent className="p-2.5 flex items-center gap-2.5">
              <CareerFitRing value={78} />
              <div className="min-w-0">
                <p className="text-[11px] text-gray-500 leading-tight">Career Fit Score</p>
                <p className="text-[18px] font-bold text-blue-600 leading-tight">78%</p>
                <p className="text-[10.5px] text-emerald-600 font-medium leading-tight mt-0.5">Great Progress! 🎉</p>
                <p className="text-[10px] text-gray-400 leading-tight">You are in the right track.</p>
              </div>
            </CardContent>
          </Card>

          {statCards.slice(1).map(({ title, value, valueClass, note, noteClass, desc, icon: Icon, bg, fg }) => (
            <Card key={title} className="border-gray-200 shadow-sm rounded-xl bg-white">
              <CardContent className="p-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className={`w-7 h-7 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                    {Icon && <Icon size={14} className={fg} />}
                  </div>
                  <p className="text-[11px] text-gray-500 leading-tight">{title}</p>
                </div>
                <p className={`text-[16px] font-bold leading-tight ${valueClass}`}>{value}</p>
                {note && <p className={`text-[10.5px] font-medium leading-tight mt-0.5 ${noteClass}`}>{note}</p>}
                <p className="text-[10px] text-gray-400 leading-tight mt-0.5">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Career Journey + Smart Recommendations */}
        <div className="flex flex-col xl:flex-row gap-2">
          <div className="flex-1 min-w-0">
            <Card className="border-gray-200 shadow-sm rounded-xl bg-white h-full">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[14px] font-bold text-gray-900">Your Career Journey</h3>
                  <Link href="#" className="text-[12px] font-semibold text-blue-600 hover:underline">View Full Path</Link>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-2">
                  {journey.map(({ role, tag, date }) => (
                    <div key={role} className="text-center">
                      <p className="text-[12px] font-bold text-gray-900 leading-tight">{role}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{tag}</p>
                      <p className="text-[10px] text-gray-400">{date}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center px-1">
                  {journey.map((step, i) => (
                    <React.Fragment key={step.role}>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        step.status === 'done' ? 'bg-emerald-500 border-emerald-500'
                        : step.status === 'current' ? 'bg-white border-blue-600'
                        : 'bg-white border-gray-300'
                      }`}>
                        {step.status === 'done' && <CheckCircle2 size={10} className="text-white" fill="currentColor" />}
                        {step.status === 'current' && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                      </div>
                      {i < journey.length - 1 && (
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
                    <div>
                      <p className="text-[12px] font-semibold text-gray-900">
                        Great Progress! You are 72% closer to your next role: <span className="text-indigo-600">Senior Executive</span>
                      </p>
                      <p className="text-[10.5px] text-gray-500 mt-0.5">Keep building the recommended skills and complete your action plan.</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 shrink-0" />
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="w-full xl:w-[380px] shrink-0">
            <Card className="border-gray-200 shadow-sm rounded-xl bg-white h-full">
              <CardContent className="p-2.5">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                    <Sparkles size={13} className="text-purple-600" />
                  </div>
                  <h3 className="text-[13.5px] font-bold text-gray-900">Smart Recommendations</h3>
                </div>
                <p className="text-[10px] text-gray-500 mb-1.5 ml-7">Based on your profile, performance and goals</p>
                <div className="space-y-1">
                  {recommendations.map(({ title, desc, icon: Icon, bg, fg }) => (
                    <Link key={title} href="#" className="flex items-center justify-between gap-1.5 rounded-xl border border-gray-100 p-1.5 hover:border-gray-200 hover:bg-gray-50/60 transition-colors">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className={`w-7 h-7 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                          <Icon size={14} className={fg} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11.5px] font-semibold text-gray-900 leading-tight truncate">{title}</p>
                          <p className="text-[10px] text-gray-500 leading-tight truncate">{desc}</p>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-gray-400 shrink-0" />
                    </Link>
                  ))}
                </div>
                <Link href="#" className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-blue-600 hover:underline mt-1.5">
                  View All Recommendations <ChevronRight size={13} />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Skills Radar + AI Insights + Recommended Learning */}
        <div className="flex flex-col xl:flex-row gap-2">
          <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 gap-2">
            <Card className="border-gray-200 shadow-sm rounded-xl bg-white">
              <CardContent className="p-3">
                <h3 className="text-[14px] font-bold text-gray-900 mb-1.5">Skills Radar</h3>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-[170px] min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={skillsRadarData} cx="50%" cy="50%" outerRadius="70%">
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis dataKey="skill" tick={{ fontSize: 9.5, fill: '#71717a' }} />
                        <Radar dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.35} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-[100px] shrink-0 space-y-1">
                    {skillLegend.map(({ label, color }) => (
                      <div key={label} className="flex items-center gap-1.5 text-[9.5px] text-gray-500 leading-tight">
                        <span className={`w-2 h-2 rounded-full ${color} shrink-0`} />
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
                <button className="w-full mt-2 inline-flex items-center justify-center gap-1.5 rounded-full border border-gray-200 py-1.5 text-[11.5px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  <BarChart3 size={13} />
                  View Skills Gap Analysis
                </button>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm rounded-xl bg-white flex flex-col">
              <CardContent className="p-3 flex-1 flex flex-col">
                <h3 className="text-[14px] font-bold text-gray-900 mb-2">AI Career Insights</h3>
                <div className="space-y-2 flex-1">
                  {insights.map(({ text, icon: Icon, bg, fg }, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className={`w-7 h-7 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                        <Icon size={14} className={fg} />
                      </div>
                      <p className="text-[11.5px] text-gray-700 leading-snug">{text}</p>
                    </div>
                  ))}
                </div>
                <Link href="#" className="flex items-center justify-center gap-1 text-[12px] font-semibold text-blue-600 hover:underline mt-2">
                  View Detailed Insights <ChevronRight size={13} />
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="w-full xl:w-[380px] shrink-0">
            <Card className="border-gray-200 shadow-sm rounded-xl bg-white h-full">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[14px] font-bold text-gray-900">Recommended Learning</h3>
                  <Link href="#" className="text-[12px] font-semibold text-blue-600 hover:underline">View All</Link>
                </div>
                <div className="space-y-2">
                  {learning.map(({ title, status, pct }) => (
                    <div key={title} className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[12px] font-semibold text-gray-900 truncate">{title}</p>
                          <p className="text-[10.5px] font-semibold text-gray-500 shrink-0">{pct}%</p>
                        </div>
                        <p className="text-[10px] text-gray-400 mb-0.5">{status}</p>
                        <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="#" className="flex items-center justify-center gap-1 text-[12px] font-semibold text-blue-600 hover:underline mt-2">
                  Go to Learning Dashboard <ChevronRight size={13} />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Next Best Actions + Chat + Quote */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr_1fr] gap-2">
          <Card className="border-gray-200 shadow-sm rounded-xl bg-white">
            <CardContent className="p-3">
              <h3 className="text-[14px] font-bold text-gray-900 mb-2">Next Best Actions</h3>
              <div className="space-y-1.5">
                {nextActions.map(({ label, due }) => (
                  <div key={label} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <p className="text-[12px] font-semibold text-gray-900 truncate">{label}</p>
                    </div>
                    <p className="text-[10px] text-gray-400 shrink-0">{due}</p>
                  </div>
                ))}
              </div>
              <Link href="#" className="inline-flex items-center gap-1 text-[12px] font-semibold text-blue-600 hover:underline mt-2">
                View All Action Items <ChevronRight size={13} />
              </Link>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm rounded-xl bg-white">
            <CardContent className="p-3 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center">
                  <MessageCircle size={15} className="text-purple-600" />
                </div>
                <h3 className="text-[14px] font-bold text-gray-900">Chat with AI Career Coach</h3>
              </div>
              <p className="text-[11px] text-gray-500 mb-2">Get personalized advice, clarity on your career path, and answers to your questions.</p>
              <form className="mt-auto flex items-center gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="Ask anything about your career..."
                  className="flex-1 rounded-full border border-gray-200 px-3.5 py-1.5 text-[12px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
                <button type="submit" className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white hover:bg-purple-700 transition-colors shrink-0">
                  <Send size={14} />
                </button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white overflow-hidden">
            <CardContent className="p-3 flex flex-col h-full justify-between">
              <div>
                <ChevronsRight size={20} className="text-white/40 -scale-x-100 mb-1" />
                <p className="text-[13px] font-semibold leading-snug">
                  The future depends on what you do today. Keep learning, keep growing!
                </p>
                <p className="text-[10.5px] text-white/70 mt-1.5">— Your AI Career Coach</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
