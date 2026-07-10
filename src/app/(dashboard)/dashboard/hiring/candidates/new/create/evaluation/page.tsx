'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, CheckCircle2, MapPin, Phone, Mail, Link as LinkIcon,
  ThumbsUp, ThumbsDown, MinusSquare, X, Plus, Star, Check, AlertCircle, Circle, User, ClipboardList, Clock,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { FaWindowRestore } from 'react-icons/fa';

function CircularProgress({ percentage, colorClass, textClass }: { percentage: number, colorClass: string, textClass: string }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg className="w-20 h-20 transform -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          className="text-zinc-100"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`${colorClass} transition-all duration-1000 ease-in-out`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`text-[20px] font-bold ${textClass}`}>{percentage}%</span>
      </div>
    </div>
  );
}

export default function HODEvaluationPage() {
  const [recommendation, setRecommendation] = useState<string | null>('Strongly Recommend');
  const [rating, setRating] = useState(4);

  const steps = [
    { num: 1, label: 'Upload CV', status: 'completed' },
    { num: 2, label: 'Review & Edit', status: 'completed' },
    { num: 3, label: 'Submit Application', status: 'completed' },
    { num: 4, label: 'AI Screening', status: 'completed' },
    { num: 5, label: 'HOD Review', status: 'active' },
    { num: 6, label: 'Interview', status: 'pending' },
    { num: 7, label: 'Offer', status: 'pending' },
    { num: 8, label: 'Onboarding', status: 'pending' },
  ];

  const strengths = ['Relevant Experience', 'Sales Strategy', 'Client Relationship', 'Leadership Skills'];
  const concerns = ['Advanced Data Analytics', 'PPC / Google Ads'];

  return (
    <div className="w-full max-w-[1600px] px-2 py-1 mx-auto space-y-2 font-sans text-zinc-900 min-h-screen">

      {/* HEADER & HORIZONTAL STEP INDICATOR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-4 mb-3">

        {/* Title */}
        <div className="shrink-0">
          <h1 className="text-[17px] font-bold text-zinc-900 tracking-tight leading-tight">HOD Review &ndash; Manager Evaluation</h1>
          <p className="text-[11px] font-medium text-zinc-500 mt-0.5">Application ID: APP-2026-000124</p>
        </div>

        {/* Steps */}
        <div className="flex-1 max-w-[600px] w-full flex items-start justify-between relative px-1 lg:px-2 mx-auto">
          <div className="absolute left-[20px] lg:left-[24px] right-[20px] lg:right-[24px] top-[11px] h-[2px] bg-zinc-200 -z-0"></div>
          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center gap-1 px-1">
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

        {/* Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" className="h-8 px-3 text-[11px] font-semibold text-indigo-700 border-indigo-200 hover:bg-indigo-50 shadow-sm">
            <ArrowLeft className="w-3 h-3 mr-1" /> Back to Applications
          </Button>
          <Button onClick={() => window.open('/dashboard/hiring/candidates/new/create/interview-process', '_blank')} className="h-8 px-4 text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
            Next: Interview &rarr;
          </Button>
        </div>
      </div>

      <div className="h-[1px] bg-zinc-200 w-full mb-4"></div>

      {/* PAGE LAYOUT - 2 MAIN COLUMNS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-3">
          {/* Candidate Summary Card (Spans Left & Center Columns) */}
          <Card className="border-zinc-200/80 shadow-sm overflow-hidden rounded-xl">
            <CardContent className="p-4 flex flex-col justify-center">
              <div className="flex flex-col xl:flex-row gap-4">

                {/* Left: Photo & Contact */}
                <div className="flex-1 flex gap-3 border-r border-transparent xl:border-zinc-100 xl:pr-4">
                  <div className="w-[80px] h-[80px] rounded-xl bg-zinc-200 overflow-hidden shrink-0 relative">
                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Candidate" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h2 className="text-[16px] font-bold text-zinc-900 truncate">Amit Kumar Verma</h2>
                      <span className="bg-emerald-50 text-emerald-600 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-100 whitespace-nowrap">AI Screened</span>
                    </div>
                    <p className="text-[12px] text-zinc-600 mb-1.5 font-medium">Sales Manager</p>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-y-2 gap-x-4">
                      <div className="flex items-center gap-1.5 text-[12px] text-zinc-600 truncate font-medium">
                        <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> +91 98765 43210
                      </div>
                      <div className="flex items-center gap-1.5 text-[12px] text-zinc-600 truncate font-medium">
                        <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> amit.verma@email.com
                      </div>
                      <div className="flex items-center gap-1.5 text-[12px] text-zinc-600 truncate font-medium">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> Noida, Uttar Pradesh
                      </div>
                      <div className="flex items-center gap-1.5 text-[12px] text-indigo-600 truncate font-medium hover:underline cursor-pointer">
                        <LinkIcon className="w-3.5 h-3.5 shrink-0" /> linkedin.com/in/amitverma
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Job Details */}
                <div className="flex-1 grid grid-cols-2 gap-y-2 gap-x-4 content-center xl:pl-2">
                  <div>
                    <p className="text-[11px] font-semibold text-zinc-400 mb-0.5 uppercase tracking-wide">Applied For</p>
                    <p className="text-[13px] font-bold text-zinc-900">Sales Manager</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-zinc-400 mb-0.5 uppercase tracking-wide">Experience</p>
                    <p className="text-[13px] font-bold text-zinc-900">7 Years</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-zinc-400 mb-0.5 uppercase tracking-wide">Department</p>
                    <p className="text-[13px] font-bold text-zinc-900">Sales &amp; Marketing</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-zinc-400 mb-0.5 uppercase tracking-wide">Expected CTC</p>
                    <p className="text-[13px] font-bold text-zinc-900">₹ 12.00 LPA</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-zinc-400 mb-0.5 uppercase tracking-wide">Employment Type</p>
                    <p className="text-[13px] font-bold text-zinc-900">Full Time</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-zinc-400 mb-0.5 uppercase tracking-wide">Notice Period</p>
                    <p className="text-[13px] font-bold text-zinc-900">30 Days</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ROW 2: TABS (Full Width) */}
          <div className="border-b border-zinc-200 mt-1 mb-1">
            <nav className="flex gap-4">
              {['HOD Review', 'Application Details', 'AI Screening Report', 'Resume & Documents', 'Comments & History'].map((tab, i) => (
                <button key={tab}
                  className={`pb-3 text-[13px] font-bold whitespace-nowrap transition-colors relative
                  ${i === 0 ? 'text-indigo-600' : 'text-zinc-500 hover:text-zinc-800'}`}>
                  {tab}
                  {i === 0 && <span className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-indigo-600 rounded-t-full z-10"></span>}
                </button>
              ))}
            </nav>
          </div>

          {/* Details Row */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-3">
            {/* COLUMN 1: HOD EVALUATION */}
            <div className="xl:col-span-8 flex flex-col gap-3 h-full">
              <Card className="border-zinc-200/80 shadow-sm rounded-xl h-full flex flex-col justify-between">
                <CardContent className="p-4 flex flex-col h-full">
                  <h3 className="text-[15px] font-bold text-zinc-900 mb-1">HOD Evaluation</h3>
                  <p className="text-[12px] font-medium text-zinc-500 mb-3">Please evaluate the candidate based on the role requirements and AI screening report.</p>

                  {/* Recommendation */}
                  <div className="mb-3">
                    <label className="text-[12px] font-bold text-zinc-900 flex items-center gap-1 mb-2">
                      Overall Recommendation <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                      {[
                        { id: 'Strongly Recommend', icon: <ThumbsUp className="w-5 h-5 mb-2" />, desc: 'Excellent fit for the role', color: 'emerald' },
                        { id: 'Recommend', icon: <ThumbsUp className="w-5 h-5 mb-2" />, desc: 'Good fit for the role', color: 'blue' },
                        { id: 'Hold / Consider', icon: <MinusSquare className="w-5 h-5 mb-2" />, desc: 'May fit, need more evaluation', color: 'amber' },
                        { id: 'Not Recommended', icon: <ThumbsDown className="w-5 h-5 mb-2" />, desc: 'Not a good fit', color: 'rose' },
                      ].map((rec) => {
                        const isSel = recommendation === rec.id;
                        return (
                          <button key={rec.id} onClick={() => setRecommendation(rec.id)}
                            className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all h-[105px]
                            ${isSel
                                ? `border-${rec.color}-200 bg-${rec.color}-50/50 shadow-sm ring-1 ring-${rec.color}-500/20`
                                : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 bg-white shadow-sm'}`}>
                            <div className={`${isSel ? `text-${rec.color}-600` : 'text-zinc-400'}`}>
                              {rec.icon}
                            </div>
                            <span className={`text-[12px] font-bold mb-1 leading-tight whitespace-nowrap ${isSel ? `text-${rec.color}-700` : 'text-zinc-700'}`}>{rec.id}</span>
                            <span className={`text-[10px] font-medium leading-tight px-1 ${isSel ? `text-${rec.color}-600/80` : 'text-zinc-500'}`}>{rec.desc}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Strengths */}
                  <div className="mb-3">
                    <label className="text-[12px] font-bold text-zinc-900 mb-2 block">Strengths <span className="font-medium text-zinc-500">(What did you like?)</span></label>
                    <div className="flex flex-wrap items-center gap-2">
                      {strengths.map(s => (
                        <div key={s} className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-md">
                          {s}
                          <X className="w-3 h-3 cursor-pointer hover:text-emerald-900 opacity-70" />
                        </div>
                      ))}
                      <button className="flex items-center gap-1 bg-white border border-dashed border-zinc-300 text-zinc-600 hover:text-indigo-600 hover:border-indigo-300 text-[11px] font-bold px-3 py-1 rounded-md transition-colors shadow-sm">
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    </div>
                  </div>

                  {/* Areas of Concern */}
                  <div className="mb-3">
                    <label className="text-[12px] font-bold text-zinc-900 mb-2 block">Areas of Concern</label>
                    <div className="flex flex-wrap items-center gap-2">
                      {concerns.map(c => (
                        <div key={c} className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/60 text-amber-700 text-[11px] font-bold px-2.5 py-1 rounded-md">
                          {c}
                          <X className="w-3 h-3 cursor-pointer hover:text-amber-900 opacity-70" />
                        </div>
                      ))}
                      <button className="flex items-center gap-1 bg-white border border-dashed border-zinc-300 text-zinc-600 hover:text-indigo-600 hover:border-indigo-300 text-[11px] font-bold px-3 py-1 rounded-md transition-colors shadow-sm">
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    </div>
                  </div>

                  {/* Comments */}
                  <div className="mb-3">
                    <label className="text-[12px] font-bold text-zinc-900 flex items-center gap-1 mb-2">
                      Comments <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        className="w-full h-[120px] rounded-xl border border-zinc-200 p-3.5 text-[13px] font-medium text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all resize-none shadow-sm"
                        defaultValue={`Amit has strong B2B sales experience and good domain knowledge. He has a proven track record in achieving targets and managing key accounts.\n\nHe will be a good addition to the team with some improvement in data analytics skills.`}
                      />
                      <div className="absolute bottom-3 right-3 text-[10px] font-bold text-zinc-400">187/1000</div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="mb-4 flex items-center gap-3">
                    <label className="text-[12px] font-bold text-zinc-900">Rating <span className="font-medium text-zinc-500">(Optional)</span></label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          className={`w-4 h-4 cursor-pointer transition-colors ${star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-zinc-100 text-zinc-200 hover:fill-amber-200 hover:text-amber-200'}`}
                          onClick={() => setRating(star)}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-zinc-500">{rating}/5</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-4 pt-5 mt-auto border-t border-zinc-100">
                    <Button className="h-8 px-4 text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm whitespace-nowrap">
                      Approve & Move to Interview
                    </Button>
                    <Button variant="outline" className="h-8 px-4 text-[11px] font-semibold text-indigo-700 border-indigo-200 hover:bg-indigo-50 rounded-md shadow-sm whitespace-nowrap">
                      Send Back for Re-evaluation
                    </Button>
                    <Button variant="outline" className="h-8 px-4 text-[11px] font-semibold text-rose-600 border-rose-200 hover:bg-rose-50 rounded-md shadow-sm whitespace-nowrap">
                      Reject Application
                    </Button>
                  </div>

                </CardContent>
              </Card>
            </div>
            {/* COLUMN 2: AI SCREENING INSIGHTS */}
            <div className="xl:col-span-4 flex flex-col gap-3">
              {/* AI Screening Summary (Combined Card) */}
              <Card className="border-zinc-200/80 shadow-sm rounded-xl">
                <CardHeader className="px-5 py-3.5 border-b border-zinc-100 bg-zinc-50/50 rounded-t-xl">
                  <CardTitle className="text-[13px] font-bold text-zinc-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500" /> AI Screening Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">

                  {/* Top Section: Circle (Left) & Stats (Right) */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-4 mb-3">
                    {/* Left: Circle */}
                    <div className="flex flex-col items-center justify-center shrink-0">
                      <CircularProgress percentage={87} colorClass="text-emerald-500" textClass="text-emerald-600" />
                      <p className="text-center text-[11px] font-bold text-emerald-600 mt-2">Good Match</p>
                    </div>

                    {/* Right: Stats List */}
                    <div className="flex-1 space-y-2.5 flex flex-col justify-center">
                      {[
                        { label: 'Skills Match', val: 90 },
                        { label: 'Experience Match', val: 85 },
                        { label: 'Education Match', val: 80 },
                        { label: 'CTC Compatibility', val: 75 },
                      ].map(m => (
                        <div key={m.label} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="text-[10px] font-bold text-zinc-600">{m.label}</span>
                          </div>
                          <span className="text-[10px] font-bold text-zinc-700">{m.val}%</span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between pt-2 border-t border-zinc-100 mt-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="text-[11px] font-bold text-zinc-900">Overall Profile Match</span>
                        </div>
                        <span className="text-[11px] font-bold text-zinc-900">87%</span>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-[1px] bg-zinc-100 w-full mb-5"></div>

                  {/* Key Matched Skills Section */}
                  <div>
                    <h4 className="text-[12px] font-bold text-zinc-900 mb-3">Key Matched Skills</h4>
                    <div className="flex flex-col gap-3">
                      {[
                        'Sales Strategy', 'Team Leadership', 'Client Relationship Management',
                        'Business Development', 'CRM'
                      ].map(s => (
                        <div key={s} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-[1px]" />
                          <span className="text-[11px] font-bold text-zinc-700 leading-tight">{s}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Link href="#" className="text-[11px] font-bold text-indigo-600 hover:underline">View All Skills (12)</Link>
                    </div>
                  </div>

                </CardContent>
              </Card>

              {/* Missing / To Improve */}
              <Card className="border-zinc-200/80 shadow-sm rounded-xl">
                <CardHeader className="px-4 py-3 border-b border-zinc-100 bg-zinc-50/50 rounded-t-xl">
                  <CardTitle className="text-[13px] font-bold text-zinc-900">Missing / To Improve</CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex flex-col gap-3.5">
                  {[
                    'Advanced Data Analytics', 'PPC / Google Ads', 'Digital Marketing', 'Salesforce Automation'
                  ].map(s => (
                    <div key={s} className="flex items-start gap-2.5">
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-rose-500 flex items-center justify-center shrink-0 mt-[1px]">
                        <div className="w-1 h-1 bg-rose-500 rounded-full"></div>
                      </div>
                      <span className="text-[11px] font-bold text-zinc-700 leading-tight">{s}</span>
                    </div>
                  ))}
                  <div className="mt-2">
                    <Link href="#" className="text-[11px] font-bold text-indigo-600 hover:underline">View Improvement Tips</Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-3">
          {/* Application Summary (Right Sidebar Column) */}
          <Card className="border-zinc-200/80 shadow-sm rounded-xl flex flex-col">
            <CardHeader className="px-4 py-3.5 border-b border-zinc-100 bg-zinc-50/50 rounded-t-xl shrink-0">
              <CardTitle className="text-[13px] font-bold text-zinc-900">Application Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col justify-center">
              <div className="space-y-2">
                {[
                  { label: 'Application ID', val: 'APP-2026-000124', icon: <ClipboardList className="w-3.5 h-3.5" /> },
                  { label: 'Applied On', val: '15 June 2026, 11:32 AM', icon: <Clock className="w-3.5 h-3.5" /> },
                  { label: 'Current Stage', val: 'HOD Review', icon: <Circle className="w-3 h-3" /> },
                  { label: 'Source', val: 'Company Website', icon: <MapPin className="w-3.5 h-3.5" /> },
                  { label: 'AI Screening Score', val: '87%', icon: <AlertCircle className="w-3.5 h-3.5" /> },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-0.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-zinc-500">
                        <span className="text-indigo-400">{item.icon}</span> {item.label}
                      </div>
                      <div className="text-[11px] font-bold text-zinc-900">{item.val}</div>
                    </div>
                  </div>
                ))}

                <div className="pt-3 flex flex-col gap-2 border-t border-zinc-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-zinc-500">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Current Status
                    </div>
                    <span className="bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-100">
                      Under HOD Review
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* COLUMN 3: TIMELINE (Right Sidebar below tabs) */}
          {/* Selection Timeline */}
          <Card className="border-zinc-200/80 shadow-sm rounded-xl">
            <CardHeader className="px-4 py-3.5 border-b border-zinc-100 bg-zinc-50/50 rounded-t-xl">
              <CardTitle className="text-[13px] font-bold text-zinc-900">Selection Timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-4 relative">
              <div className="absolute left-[26px] top-[26px] bottom-[26px] w-[2px] bg-zinc-100 z-0"></div>

              <div className="flex flex-col gap-4 relative z-10">
                {[
                  { title: 'Application Submitted', date: '15 June 2026, 11:32 AM', status: 'completed' },
                  { title: 'AI Screening Completed', date: '15 June 2026, 12:05 PM', sub: 'Score: 87%', status: 'completed' },
                  { title: 'HOD Review', date: '16 June 2026, 10:15 AM', sub: 'Currently in progress', status: 'active' },
                  { title: 'Interview', sub: 'Pending', status: 'pending' },
                  { title: 'Offer', sub: 'Pending', status: 'pending' },
                  { title: 'Onboarding', sub: 'Pending', status: 'pending' },
                ].map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 bg-white mt-0.5
                        ${step.status === 'completed' ? 'border-emerald-500 text-emerald-500' :
                        step.status === 'active' ? 'border-indigo-600 text-indigo-600 shadow-[0_0_0_2px_rgba(79,70,229,0.1)]' :
                          'border-zinc-200 text-zinc-200'}`}>
                      {step.status === 'completed' ? <Check className="w-3 h-3" /> : <Circle className={`w-2 h-2 fill-current ${step.status === 'active' ? 'text-indigo-600' : 'text-zinc-200'}`} />}
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-[11px] font-bold ${step.status === 'active' ? 'text-indigo-700' : step.status === 'completed' ? 'text-zinc-900' : 'text-zinc-500'}`}>{step.title}</span>
                      {step.date && <span className="text-[10px] font-medium text-zinc-500">{step.date}</span>}
                      {step.sub && <span className="text-[10px] font-bold text-indigo-500 mt-0.5">{step.sub}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Review History */}
          <Card className="border-zinc-200/80 shadow-sm rounded-xl">
            <CardHeader className="px-4 py-3.5 border-b border-zinc-100 bg-zinc-50/50 rounded-t-xl">
              <CardTitle className="text-[13px] font-bold text-zinc-900">Review History</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-[11px] font-bold text-zinc-900 leading-tight">HOD Review Started</h4>
                    <span className="bg-indigo-50 text-indigo-600 text-[9px] font-bold px-1.5 py-0.5 rounded border border-indigo-100 leading-none shrink-0">In Progress</span>
                  </div>
                  <p className="text-[10px] font-medium text-zinc-500 leading-tight mb-1 truncate">by Rajeev Sharma (Sales Head)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
