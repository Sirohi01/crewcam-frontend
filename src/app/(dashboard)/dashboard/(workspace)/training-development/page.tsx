'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import {
  ChevronRight, ChevronLeft, ChevronDown, GraduationCap, CheckCircle2, PlayCircle, Clock,
  Award, BookOpen, Route, ShieldCheck, History, Sparkles, ListChecks, Filter, MoreVertical,
  Star, Calendar, Download,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const statCards = [
  { title: 'Total Courses Enrolled', value: '12', note: 'All time', cta: 'View all', icon: GraduationCap, bg: 'bg-blue-100', fg: 'text-blue-600' },
  { title: 'Completed Courses', value: '7', note: '58% of enrolled', cta: 'View all', icon: CheckCircle2, bg: 'bg-emerald-100', fg: 'text-emerald-600' },
  { title: 'In Progress', value: '4', note: '33% of enrolled', cta: 'View all', icon: PlayCircle, bg: 'bg-orange-100', fg: 'text-orange-600' },
  { title: 'Total Learning Hours', value: '28h 45m', note: 'This year', cta: 'View report', icon: Clock, bg: 'bg-purple-100', fg: 'text-purple-600' },
  { title: 'Certificates Earned', value: '6', note: 'All time', cta: 'View all', icon: Award, bg: 'bg-cyan-100', fg: 'text-cyan-600' },
];

const tabs = [
  { label: 'My Learning', icon: BookOpen, active: true },
  { label: 'My Courses', icon: GraduationCap },
  { label: 'Learning Paths', icon: Route },
  { label: 'Certifications', icon: ShieldCheck },
  { label: 'Learning History', icon: History },
  { label: 'Skill Development', icon: Sparkles },
  { label: 'Requests', icon: ListChecks },
];

const filterPills = [
  { label: 'All (12)', active: true },
  { label: 'In Progress (4)' },
  { label: 'Not Started (5)' },
  { label: 'Completed (3)' },
  { label: 'Overdue (0)' },
];

const courses = [
  {
    status: 'In Progress', statusTone: 'bg-orange-500', ringColor: '#2563eb', pct: 65, action: 'Continue', actionStyle: 'solid',
    title: 'Advanced Sales Strategies', featured: true, category: 'Sales & Business Development', level: 'Intermediate',
    desc: 'Learn advanced techniques to close more deals and build strong client relationships.',
    duration: '8h 30m', lessons: '12 Lessons', dateLabel: 'Enrolled on 10 May 2024',
  },
  {
    status: 'In Progress', statusTone: 'bg-orange-500', ringColor: '#2563eb', pct: 40, action: 'Continue', actionStyle: 'solid',
    title: 'Effective Communication Skills', featured: false, category: 'Soft Skills', level: 'Beginner',
    desc: 'Improve your verbal and written communication in professional environment.',
    duration: '4h 15m', lessons: '8 Lessons', dateLabel: 'Enrolled on 15 May 2024',
  },
  {
    status: 'Not Started', statusTone: 'bg-slate-500', ringColor: '#9ca3af', pct: 0, action: 'Start Now', actionStyle: 'solid',
    title: 'Excel for Business Professionals', featured: false, category: 'Technical Skills', level: 'Beginner',
    desc: 'Master Excel tools and functions for effective data analysis and reporting.',
    duration: '6h 00m', lessons: '10 Lessons', dateLabel: 'Enrolled on 20 May 2024',
  },
  {
    status: 'Completed', statusTone: 'bg-emerald-500', ringColor: '#16a34a', pct: 100, action: 'View Certificate', actionStyle: 'outline',
    title: 'Financial Awareness for Managers', featured: false, category: 'Finance', level: 'Intermediate',
    desc: 'Understand financial statements and key metrics to make better decisions.',
    duration: '5h 30m', lessons: '9 Lessons', dateLabel: 'Completed on 12 May 2024',
  },
];

const recommended = [
  { title: 'Customer Relationship Management (CRM)', category: 'Sales', duration: '3h 45m', rating: 4.6 },
  { title: 'Data Visualization with Power BI', category: 'Analytics', duration: '5h 20m', rating: 4.7 },
  { title: 'Presentation Skills That Win', category: 'Soft Skills', duration: '3h 15m', rating: 4.5 },
  { title: 'Project Management Fundamentals', category: 'Management', duration: '6h 10m', rating: 4.6 },
];

const progressOverview = [
  { name: 'Completed', value: 7, pct: '58%', color: '#16a34a' },
  { name: 'In Progress', value: 4, pct: '33%', color: '#f97316' },
  { name: 'Not Started', value: 5, pct: '42%', color: '#2563eb' },
  { name: 'Overdue', value: 0, pct: '0%', color: '#ef4444' },
];

const sessions = [
  { month: 'MAY', day: '24', title: 'Negotiation Skills Workshop', trainer: 'Rahul Verma', time: '11:00 AM - 01:00 PM', status: 'Registered' },
  { month: 'MAY', day: '27', title: 'Leadership Essentials', trainer: 'Priya Sharma', time: '03:00 PM - 05:00 PM', status: 'Register' },
  { month: 'MAY', day: '30', title: 'Time Management Mastery', trainer: 'Ankit Kapoor', time: '11:00 AM - 01:00 PM', status: 'Register' },
];

function CourseRing({ value, color, label }: { value: number; color: string; label: string }) {
  const size = 62;
  const stroke = 5.5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative shrink-0">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#e5e7eb" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[12.5px] font-bold text-gray-900 leading-none">{value}%</span>
        <span className="text-[8px] text-gray-500 mt-0.5">{label}</span>
      </div>
    </div>
  );
}

export default function TrainingDevelopmentPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-4 pt-1 space-y-2">

        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center text-[12px] text-gray-500 mb-0.5">
              <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
              <ChevronRight size={14} className="mx-1" />
              <span className="font-medium text-gray-900">Training &amp; Development</span>
            </div>
            <h1 className="text-[20px] font-bold text-gray-900 leading-tight">Training &amp; Development</h1>
            <p className="text-[11.5px] text-gray-500 mt-0.5">Enhance your skills, learn continuously and grow with CrewCam.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-3.5 py-1.5 text-[12.5px] font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm shrink-0">
            <BookOpen size={14} />
            Explore Catalog
          </button>
        </div>

        {/* Stat cards row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5">
          {statCards.map(({ title, value, note, cta, icon: Icon, bg, fg }) => (
            <Card key={title} className="border-gray-200 shadow-sm rounded-xl bg-white">
              <CardContent className="p-2.5 flex items-start gap-2">
                <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                  <Icon size={15} className={fg} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10.5px] text-gray-500 leading-tight">{title}</p>
                  <p className="text-[16px] font-bold text-gray-900 leading-tight">{value}</p>
                  <p className="text-[10px] text-gray-400 leading-tight mt-0.5">{note}</p>
                  <Link href="#" className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${fg} hover:underline mt-1`}>
                    {cta} <ChevronRight size={11} />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Card className="border-gray-200 shadow-sm rounded-xl bg-white">
          <CardContent className="p-1.5 px-2">
            <div className="flex items-center gap-1 overflow-x-auto">
              {tabs.map(({ label, icon: Icon, active }) => (
                <Link
                  key={label}
                  href="#"
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-semibold whitespace-nowrap transition-colors ${
                    active ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main grid */}
        <div className="flex flex-col xl:flex-row gap-2">
          <div className="flex-1 min-w-0 space-y-2">

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-1.5">
              {filterPills.map(({ label, active }) => (
                <button
                  key={label}
                  className={`px-3 py-1.5 rounded-full text-[11.5px] font-semibold transition-colors ${
                    active ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </button>
              ))}
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-[11.5px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                <Filter size={13} />
                Filter
              </button>
              <button className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-[11.5px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                Sort by: Recently Added
                <ChevronDown size={13} />
              </button>
            </div>

            {/* Course list */}
            <Card className="border-gray-200 shadow-sm rounded-xl bg-white">
              <CardContent className="p-2.5">
                <h3 className="text-[14px] font-bold text-gray-900 mb-1.5">My Learning Courses</h3>
                <div className="space-y-1.5">
                  {courses.map((c) => (
                    <div key={c.title} className="flex items-center gap-2.5 rounded-xl border border-gray-100 p-2">
                      <div className="relative w-20 h-14 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 shrink-0 overflow-hidden">
                        <span className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8.5px] font-semibold text-white ${c.statusTone}`}>
                          {c.status}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[12.5px] font-bold text-gray-900 truncate">{c.title}</p>
                          {c.featured && <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-600 text-[9.5px] font-semibold shrink-0">Featured</span>}
                        </div>
                        <p className="text-[10px] text-gray-500 leading-tight">{c.category} • {c.level}</p>
                        <p className="text-[10px] text-gray-500 leading-tight mt-0.5 truncate">{c.desc}</p>
                        <div className="flex items-center gap-2.5 mt-0.5 text-[9.5px] text-gray-400">
                          <span className="inline-flex items-center gap-1"><Clock size={10} />{c.duration}</span>
                          <span className="inline-flex items-center gap-1"><BookOpen size={10} />{c.lessons}</span>
                          <span className="inline-flex items-center gap-1"><Calendar size={10} />{c.dateLabel}</span>
                        </div>
                      </div>
                      <CourseRing value={c.pct} color={c.ringColor} label={c.status === 'Completed' ? 'Completed' : 'Progress'} />
                      <div className="flex items-center justify-end gap-1 shrink-0 w-[132px]">
                        {c.actionStyle === 'solid' ? (
                          <button className="rounded-full bg-blue-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-blue-700 transition-colors whitespace-nowrap">
                            {c.action}
                          </button>
                        ) : (
                          <button className="rounded-full border border-blue-200 px-3 py-1.5 text-[11px] font-semibold text-blue-600 hover:bg-blue-50 transition-colors whitespace-nowrap">
                            {c.action}
                          </button>
                        )}
                        <button className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors shrink-0">
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="#" className="flex items-center justify-center gap-1 text-[12px] font-semibold text-blue-600 hover:underline mt-2">
                  View All My Courses <ChevronRight size={13} />
                </Link>
              </CardContent>
            </Card>

            {/* Recommended for you */}
            <Card className="border-amber-100 shadow-sm rounded-xl bg-amber-50/40">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Star size={15} className="text-amber-500 fill-amber-500" />
                    <div>
                      <h3 className="text-[13.5px] font-bold text-gray-900 leading-tight">Recommended for You</h3>
                      <p className="text-[10.5px] text-gray-500 leading-tight">Courses recommended based on your role and learning history</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                      <ChevronLeft size={14} />
                    </button>
                    <button className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {recommended.map(({ title, category, duration, rating }) => (
                    <div key={title} className="flex items-center gap-1.5 rounded-xl bg-white border border-gray-100 p-1.5">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10.5px] font-semibold text-gray-900 leading-tight line-clamp-2">{title}</p>
                        <p className="text-[9.5px] text-gray-500 mt-0.5 truncate">{category}</p>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[9px] text-gray-400">
                          <span className="inline-flex items-center gap-0.5"><Clock size={9} />{duration}</span>
                          <span className="inline-flex items-center gap-0.5 text-amber-500 font-semibold"><Star size={9} className="fill-amber-400 text-amber-400" />{rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="w-full xl:w-[380px] shrink-0 space-y-2">
            <Card className="border-gray-200 shadow-sm rounded-xl bg-white">
              <CardContent className="p-3">
                <h3 className="text-[14px] font-bold text-gray-900 mb-2">Learning Progress Overview</h3>
                <div className="flex items-center gap-3">
                  <div className="relative w-[90px] h-[90px] shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={progressOverview} innerRadius={28} outerRadius={45} paddingAngle={3} dataKey="value" stroke="none">
                          {progressOverview.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[18px] font-bold text-gray-900 leading-none">12</span>
                      <span className="text-[9px] text-gray-500 mt-0.5">Total</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-1 min-w-0">
                    {progressOverview.map(({ name, value, pct, color }) => (
                      <div key={name} className="flex items-center justify-between gap-2 text-[11px]">
                        <span className="flex items-center gap-1.5 text-gray-600">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                          {name}
                        </span>
                        <span className="font-semibold text-gray-800 shrink-0">{value} ({pct})</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Link href="#" className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-blue-600 hover:underline mt-2">
                  View Detailed Report <ChevronRight size={13} />
                </Link>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm rounded-xl bg-white">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[14px] font-bold text-gray-900">Upcoming Live Sessions</h3>
                  <Link href="#" className="text-[11.5px] font-semibold text-blue-600 hover:underline">View Calendar</Link>
                </div>
                <div className="space-y-2">
                  {sessions.map(({ month, day, title, trainer, time, status }) => (
                    <div key={title} className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[8.5px] font-semibold text-blue-500 leading-none">{month}</span>
                        <span className="text-[12px] font-bold text-blue-700 leading-none mt-0.5">{day}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-gray-900 truncate">{title}</p>
                        <p className="text-[10px] text-gray-500 truncate">Trainer: {trainer}</p>
                        <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                          <Clock size={10} />{time}
                        </p>
                      </div>
                      {status === 'Registered' ? (
                        <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-semibold shrink-0">Registered</span>
                      ) : (
                        <button className="px-2.5 py-1 rounded-full border border-blue-200 text-blue-600 text-[10px] font-semibold hover:bg-blue-50 transition-colors shrink-0">Register</button>
                      )}
                    </div>
                  ))}
                </div>
                <Link href="#" className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-blue-600 hover:underline mt-2">
                  View All Sessions <ChevronRight size={13} />
                </Link>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm rounded-xl bg-white">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[14px] font-bold text-gray-900">Certifications Earned</h3>
                  <Link href="#" className="text-[11.5px] font-semibold text-blue-600 hover:underline">View All</Link>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <Award size={20} className="text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-bold text-gray-900">Sales Excellence</p>
                    <p className="text-[10.5px] text-gray-500">Issued on 12 May 2024</p>
                    <p className="text-[10px] text-gray-400">Credential ID: CC-TRN-2024-0187</p>
                    <button className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-blue-200 px-2.5 py-1 text-[10.5px] font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
                      <Download size={11} />
                      Download Certificate
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
