'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, MapPin, Phone, Mail, Link as LinkIcon, ThumbsUp, ThumbsDown, MinusSquare, X, Plus, Star, Check, AlertCircle, Circle, User, ClipboardList, Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { FaWindowRestore } from 'react-icons/fa';
import { useParams, useRouter, usePathname } from 'next/navigation';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';


export const CandidateContext = React.createContext<any>(null);
export function useCandidate() {
  return React.useContext(CandidateContext);
}

export default function HODEvaluationLayout({ children }: { children: React.ReactNode }) {
  const [candidate, setCandidate] = useState<any>(null);

  const params = useParams() as { id: string };
  const candidateId = params?.id;
  const router = useRouter();
  const pathname = usePathname();

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
            _id: data._id,
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

  return (
    <div className="w-full max-w-[1600px] px-2 py-1 mx-auto space-y-2 font-sans text-zinc-900 min-h-screen">

      {/* HEADER & HORIZONTAL STEP INDICATOR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-start gap-3 lg:gap-8 mb-3">

        {/* Title */}
        <div className="shrink-0">
          <h1 className="text-[17px] font-bold text-zinc-900 tracking-tight leading-tight">HOD Review &ndash; Manager Evaluation</h1>
          <p className="text-[11px] font-medium text-zinc-500 mt-0.5">Application ID: APP-{candidateId?.slice(-6).toUpperCase() || '100124'}</p>
        </div>

        {/* Steps */}
        <div className="flex-1 max-w-[480px] w-full flex items-start justify-between relative px-1">
          <div className="absolute left-[16px] right-[16px] top-[9px] h-[2px] bg-zinc-200 -z-0"></div>
          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center gap-1 px-0.5">
              <div className={`w-[20px] h-[20px] rounded-full flex items-center justify-center text-[9px] font-bold border-2 transition-colors
                ${step.status === 'completed' ? 'border-indigo-100 text-indigo-600 bg-indigo-50' :
                  step.status === 'active' ? 'border-indigo-600 bg-indigo-600 text-white shadow-[0_0_0_3px_rgba(79,70,229,0.15)]' :
                    'border-zinc-200 text-zinc-400 bg-white'}`}>
                {step.status === 'completed' ? <Check className="w-2.5 h-2.5" strokeWidth={3} /> : step.num}
              </div>
              <span className={`text-[8px] lg:text-[8.5px] whitespace-nowrap font-bold ${step.status === 'active' ? 'text-indigo-900' : step.status === 'completed' ? 'text-indigo-600' : 'text-zinc-400'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap sm:flex-nowrap mt-1 lg:mt-0">
          <Button variant="outline" onClick={() => router.push(`/dashboard/hiring/candidates/new/create/ai-screening-application-evaluation/${candidateId}`)} className="h-7 lg:h-8 px-1 lg:px-1 text-[10px] font-semibold text-indigo-700 border-indigo-200 hover:bg-indigo-50 shadow-sm">
            Back <span className="hidden sm:inline">&nbsp;to AI Screening</span>
          </Button>
          <Button onClick={() => window.open(`/dashboard/hiring/candidates/new/create/interview-process/${candidateId}`, '_blank')} className="h-7 lg:h-8 px-1 lg:px-1 text-[10px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
            Next: Interview
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
                      <h2 className="text-[16px] font-bold text-zinc-900 truncate">{candidate.fullName}</h2>
                      <span className="bg-emerald-50 text-emerald-600 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-100 whitespace-nowrap">AI Screened</span>
                    </div>
                    <p className="text-[12px] text-zinc-600 mb-1.5 font-medium">{candidate.appliedFor}</p>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-y-2 gap-x-4">
                      <div className="flex items-center gap-1.5 text-[12px] text-zinc-600 truncate font-medium">
                        <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> {candidate.mobile}
                      </div>
                      <div className="flex items-center gap-1.5 text-[12px] text-zinc-600 truncate font-medium">
                        <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> {candidate.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-[12px] text-zinc-600 truncate font-medium">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> {candidate.currentLocation}
                      </div>
                      <div className="flex items-center gap-1.5 text-[12px] text-indigo-600 truncate font-medium hover:underline cursor-pointer" onClick={() => window.open(candidate.linkedin, '_blank')}>
                        <LinkIcon className="w-3.5 h-3.5 shrink-0" /> {candidate.linkedin}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Job Details */}
                <div className="flex-1 grid grid-cols-2 gap-y-2 gap-x-4 content-center xl:pl-2">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-zinc-400 mb-0.5 uppercase tracking-wide truncate">Applied For</p>
                    <p className="text-[12px] font-semibold text-zinc-900 truncate" title={candidate.appliedFor}>{candidate.appliedFor}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-zinc-400 mb-0.5 uppercase tracking-wide truncate">Experience</p>
                    <p className="text-[12px] font-semibold text-zinc-900 truncate">{candidate.totalExperience} Years</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-zinc-400 mb-0.5 uppercase tracking-wide truncate">Department</p>
                    <p className="text-[12px] font-semibold text-zinc-900 truncate" title={candidate.department}>{candidate.department}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-zinc-400 mb-0.5 uppercase tracking-wide truncate">Expected CTC</p>
                    <p className="text-[12px] font-semibold text-zinc-900 truncate">₹ {candidate.expectedCTC}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-zinc-400 mb-0.5 uppercase tracking-wide truncate">Employment Type</p>
                    <p className="text-[12px] font-semibold text-zinc-900 truncate">{candidate.employmentType}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-zinc-400 mb-0.5 uppercase tracking-wide truncate">Notice Period</p>
                    <p className="text-[12px] font-semibold text-zinc-900 truncate">{candidate.noticePeriod}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ROW 2: TABS (Full Width) */}
          <div className="border-b border-zinc-200 mt-1 mb-1">
            <nav className="flex gap-4">
              {[
                { name: 'HOD Review', path: `/dashboard/hiring/candidates/new/create/evaluation/${candidateId}` },
                { name: 'Application Details', path: `/dashboard/hiring/candidates/new/create/evaluation/${candidateId}/application-details` },
                { name: 'AI Screening Report', path: `/dashboard/hiring/candidates/new/create/evaluation/${candidateId}/ai-screening-report` },
                { name: 'Resume & Documents', path: `/dashboard/hiring/candidates/new/create/evaluation/${candidateId}/resume-documents` },
                { name: 'Comments & History', path: `/dashboard/hiring/candidates/new/create/evaluation/${candidateId}/comments-history` }
              ].map((tab) => {
                const isActive = pathname === tab.path;
                return (
                  <Link key={tab.name}
                    href={tab.path}
                    className={`pb-3 text-[13px] font-bold whitespace-nowrap transition-colors relative
                    ${isActive ? 'text-indigo-600' : 'text-zinc-500 hover:text-zinc-800'}`}>
                    {tab.name}
                    {isActive && <span className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-indigo-600 rounded-t-full z-10"></span>}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Details Row */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-3">
            <CandidateContext.Provider value={{ candidate }}>
              {children}
            </CandidateContext.Provider>
          </div>
        </div>


        {/* RIGHT SIDEBAR */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-3">
          {/* Application Summary (Right Sidebar Column) */}
          <Card className="border-zinc-200/80 shadow-sm rounded-xl flex flex-col">
            <CardHeader className="px-4 py-3.5 border-b border-zinc-100 bg-zinc-50/50 rounded-t-xl shrink-0">
              <CardTitle className="text-[13px] font-bold text-zinc-900">Application Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-3 flex-1 flex flex-col justify-center">
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
