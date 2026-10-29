'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import {
  Briefcase, Building2, MapPin, Calendar, Clock, IndianRupee, Users,
  Award, FileText, CheckCircle2, Globe, Tag, ArrowLeft, Download,
  Layers, AlertTriangle, ShieldCheck, UserMinus, Sparkles, ExternalLink,
  Paperclip, Target, BarChart3, CheckCircle, ChevronRight, Share2, Printer,
  Eye, RefreshCw, Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

function formatVal(text: any, fallback = '-') {
  if (text === undefined || text === null || text === '') return fallback;
  if (typeof text === 'string' || typeof text === 'number') return String(text);
  if (typeof text === 'boolean') return text ? 'Yes' : 'No';
  return text.name || `${text.firstName || ''} ${text.lastName || ''}`.trim() || fallback;
}

function formatDate(date: any) {
  if (!date) return '-';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return String(date);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return String(date);
  }
}

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams() as { id: string };
  const jobId = params?.id;
  const [activeTab, setActiveTab] = useState<'overview' | 'jd' | 'requirements' | 'replacement' | 'channels' | 'attachments'>('overview');

  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job-details', jobId],
    queryFn: async () => {
      const res = await api.get(`/hiring/manpower-request/${jobId}`);
      return res.data;
    },
    enabled: !!jobId,
  });

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center p-8 text-center text-zinc-500 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
        <p className="text-xs font-semibold text-zinc-700">Loading Job Details...</p>
        <p className="text-[11px] text-zinc-400 mt-0.5">Fetching job parameters and creation details</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center p-8 text-center font-sans">
        <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-3">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-sm font-bold text-zinc-900">Job Not Found</h2>
        <p className="text-xs text-zinc-500 mt-1 max-w-sm">
          The requested job record could not be loaded or may have been removed.
        </p>
        <Link
          href="/dashboard/hiring/jobs"
          className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          <ArrowLeft size={13} /> Back to New Jobs
        </Link>
      </div>
    );
  }

  // Extracted values
  const jobTitle = job.jobTitle || 'Job Title';
  const jobCode = job.jobCode || (job._id ? String(job._id).substring(0, 8).toUpperCase() : 'JOB-CODE');
  const departmentName = formatVal(job.departmentId);
  const designationName = formatVal(job.designationId) !== '-' ? formatVal(job.designationId) : (job.designation || '-');
  const locationName = formatVal(job.locationBranchId) !== '-' ? formatVal(job.locationBranchId) : (job.workLocation || '-');
  const openings = job.numberOfPositions || 1;
  const employmentType = job.employmentType || (Array.isArray(job.employmentTypes) && job.employmentTypes[0]) || 'Full Time';
  const jobCategory = job.jobCategory || 'Full Time';
  const workMode = job.workMode || 'On-site';
  const priority = job.priority || 'Medium';
  const status = job.recruitmentStatus === 'Posted' ? 'Posted' : (job.status || 'Active');
  const expectedJoiningDate = formatDate(job.requiredJoiningDate || job.expectedJoiningDate || job.requestDate);
  const noticePeriod = job.noticePeriod || '30 Days';

  const salaryRange = (job.salaryCtcMin || job.salaryCtcMax)
    ? `₹ ${job.salaryCtcMin ? job.salaryCtcMin.toLocaleString() : '-'} to ₹ ${job.salaryCtcMax ? job.salaryCtcMax.toLocaleString() : '-'}`
    : (job.budgetCTC ? `₹ ${job.budgetCTC.toLocaleString()}` : 'Not Specified');
  const currency = job.currency || 'Per Annum';

  // Responsibilities
  const responsibilities: string[] = Array.isArray(job.keyResponsibilities) && job.keyResponsibilities.length > 0
    ? job.keyResponsibilities
    : (job.kraReport ? [job.kraReport] : []);

  // Technical Skills
  const technicalSkills: string[] = Array.isArray(job.technicalSkills) && job.technicalSkills.length > 0
    ? job.technicalSkills
    : (Array.isArray(job.skills) ? job.skills : []);

  // Soft skills / qualifications
  const preferredQualifications: string[] = Array.isArray(job.preferredQualifications) && job.preferredQualifications.length > 0
    ? job.preferredQualifications
    : (job.qualificationReq ? [job.qualificationReq] : []);

  const certifications: string[] = Array.isArray(job.certifications) ? job.certifications : [];
  const languages: string[] = Array.isArray(job.languages) ? job.languages : [];

  // Publish channels
  const publishChannels: string[] = Array.isArray(job.publishChannels) && job.publishChannels.length > 0
    ? job.publishChannels
    : ['Career Portal', 'Website', 'LinkedIn', 'Naukri.com'];

  // Attachments
  const attachments: string[] = Array.isArray(job.attachments) ? job.attachments : [];

  // Replacement details
  const isReplacement = job.isReplacement === true || !!job.replacedEmployeeId || !!job.replacementName;
  const replacedEmployee = job.replacedEmployeeId ? formatVal(job.replacedEmployeeId) : (job.replacementName || '-');
  const replacementReason = job.replacementReason || '-';
  const lastWorkingDate = formatDate(job.lastWorkingDate);
  const vacancyImpact = job.impact || 'Medium';

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Job link copied to clipboard!');
    }
  };

  return (
    <div className="w-full mx-auto px-2 py-1 space-y-2.5 font-sans text-zinc-900 min-h-screen">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/hiring/jobs"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-500 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft size={13} /> Back to New Jobs
            </Link>
            <span className="text-zinc-300">•</span>
            <span className="text-[11px] font-mono font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-200">
              {jobCode}
            </span>
          </div>
          <h1 className="text-xl font-bold text-zinc-900 mt-1 flex items-center gap-2">
            {jobTitle}
          </h1>
          <p className="text-[11px] text-zinc-500 mt-0.5 flex items-center gap-2">
            <span>Posted on {formatDate(job.createdAt || job.requestDate)}</span>
            <span>•</span>
            <span className="font-semibold text-zinc-700">{departmentName}</span>
            <span>•</span>
            <span>{locationName}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 shadow-sm transition-colors"
          >
            <Share2 size={13} /> Share Link
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 shadow-sm transition-colors"
          >
            <Printer size={13} /> Print
          </button>
          <Link
            href={`/dashboard/hiring/jobs/new?requisitionId=${jobId}`}
            className="flex items-center gap-1.5 rounded-md bg-indigo-700 px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-indigo-800 shadow-sm transition-colors"
          >
            Edit Job
          </Link>
        </div>
      </div>

      {/* Top Banner Card: Key Metrics & At-a-glance status */}
      <div className="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold ${
              status === 'Posted' || status === 'Approved'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              <CheckCircle size={12} /> {status}
            </span>
            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
              priority === 'High' || priority === 'Urgent'
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : priority === 'Low'
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                : 'bg-amber-50 text-amber-600 border border-amber-200'
            }`}>
              Priority: {priority}
            </span>
            <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              {employmentType}
            </span>
            <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 text-zinc-700">
              Work Mode: {workMode}
            </span>
          </div>

          <div className="text-[11px] text-zinc-500 flex items-center gap-2">
            <span>Openings: <strong className="text-zinc-900 font-bold">{openings} Position{openings > 1 ? 's' : ''}</strong></span>
          </div>
        </div>

        {/* 4-column Highlight Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <Building2 size={15} />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-tight">Department & Role</p>
              <p className="text-xs font-bold text-zinc-900 leading-tight mt-0.5">{departmentName}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">{designationName}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <MapPin size={15} />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-tight">Job Location</p>
              <p className="text-xs font-bold text-zinc-900 leading-tight mt-0.5">{locationName}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">{workMode}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <IndianRupee size={15} />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-tight">Salary Budget</p>
              <p className="text-xs font-bold text-zinc-900 leading-tight mt-0.5">{salaryRange}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">{currency}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <Calendar size={15} />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-tight">Joining Date</p>
              <p className="text-xs font-bold text-zinc-900 leading-tight mt-0.5">{expectedJoiningDate}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Notice: {noticePeriod}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="border-b border-zinc-200">
        <nav className="flex space-x-4">
          {[
            { key: 'overview', label: 'Job Overview' },
            { key: 'jd', label: 'Job Description & Responsibilities' },
            { key: 'requirements', label: 'Requirements & Skills' },
            { key: 'replacement', label: `Replacement Info ${isReplacement ? '(Yes)' : ''}` },
            { key: 'channels', label: `Publish Channels (${publishChannels.length})` },
            { key: 'attachments', label: `Attachments (${attachments.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`pb-2.5 pt-1 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Contents */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-3">
        {/* Main Content Area */}
        <div className="space-y-3">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-3">
              {/* Section 1: Core Job Parameters */}
              <div className="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-sm space-y-2.5">
                <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
                  <span className="grid h-5 w-5 place-items-center rounded bg-indigo-600 text-[10px] font-bold text-white">1</span>
                  <h3 className="text-xs font-bold text-zinc-900">Job Details & Configuration</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5 text-[11px]">
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Job Title</span>
                    <span className="font-semibold text-zinc-900">{jobTitle}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Job Code</span>
                    <span className="font-mono font-bold text-violet-700">{jobCode}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Department</span>
                    <span className="font-semibold text-zinc-900">{departmentName}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Designation</span>
                    <span className="font-semibold text-zinc-900">{designationName}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Job Category</span>
                    <span className="font-semibold text-zinc-900">{jobCategory}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Employment Type</span>
                    <span className="font-semibold text-zinc-900">{employmentType}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Job Location / Branch</span>
                    <span className="font-semibold text-zinc-900">{locationName}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Work Mode</span>
                    <span className="font-semibold text-zinc-900">{workMode}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">No. of Openings</span>
                    <span className="font-semibold text-zinc-900">{openings}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Priority</span>
                    <span className="font-semibold text-zinc-900">{priority}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Expected Joining Date</span>
                    <span className="font-semibold text-zinc-900">{expectedJoiningDate}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Notice Period</span>
                    <span className="font-semibold text-zinc-900">{noticePeriod}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Salary Range</span>
                    <span className="font-semibold text-zinc-900">{salaryRange}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Currency / Frequency</span>
                    <span className="font-semibold text-zinc-900">{currency}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Status</span>
                    <span className="font-semibold text-emerald-700">{status}</span>
                  </div>
                </div>
              </div>

              {/* JD Summary Preview */}
              <div className="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-sm space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    <span className="grid h-5 w-5 place-items-center rounded bg-indigo-600 text-[10px] font-bold text-white">2</span>
                    <h3 className="text-xs font-bold text-zinc-900">Job Description Summary</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('jd')}
                    className="text-[10.5px] font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    View Full JD &rarr;
                  </button>
                </div>

                <p className="text-[11.5px] leading-relaxed text-zinc-700 whitespace-pre-line">
                  {job.jobDescription || job.jobDescriptionSummary || 'No detailed job description provided during creation.'}
                </p>
              </div>

              {/* Key Responsibilities Preview */}
              {responsibilities.length > 0 && (
                <div className="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-sm space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                    <h3 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-600" />
                      Key Responsibilities ({responsibilities.length})
                    </h3>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-zinc-700">
                    {responsibilities.slice(0, 4).map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                        <span>{r}</span>
                      </li>
                    ))}
                    {responsibilities.length > 4 && (
                      <li className="pt-1">
                        <button
                          onClick={() => setActiveTab('jd')}
                          className="text-[10.5px] font-semibold text-indigo-600 hover:underline"
                        >
                          + {responsibilities.length - 4} more responsibilities
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: JOB DESCRIPTION & RESPONSIBILITIES */}
          {activeTab === 'jd' && (
            <div className="space-y-3">
              <div className="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-sm space-y-2.5">
                <h3 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                  <FileText size={14} className="text-indigo-600" />
                  Full Job Description (JD)
                </h3>
                <div className="rounded-lg bg-zinc-50/70 p-3 border border-zinc-100 text-[11.5px] leading-relaxed text-zinc-800 whitespace-pre-line">
                  {job.jobDescription || job.jobDescriptionSummary || 'No detailed job description entered.'}
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-sm space-y-2.5">
                <h3 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                  <Target size={14} className="text-emerald-600" />
                  Key Responsibilities
                </h3>
                {responsibilities.length > 0 ? (
                  <ul className="space-y-2 text-[11.5px] text-zinc-800">
                    {responsibilities.map((r, i) => (
                      <li key={i} className="flex items-start gap-2.5 p-2 rounded-md bg-zinc-50/50 border border-zinc-100">
                        <span className="grid h-4 w-4 place-items-center rounded-full bg-indigo-100 text-indigo-700 text-[9px] font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-snug">{r}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-zinc-400">No responsibilities listed.</p>
                )}
              </div>

              {(job.justification || job.detailedJustification) && (
                <div className="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-sm space-y-2">
                  <h3 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-500" />
                    Business Justification for Hiring
                  </h3>
                  <div className="rounded-lg bg-amber-50/40 p-3 border border-amber-100 text-[11.5px] leading-relaxed text-zinc-800 whitespace-pre-line">
                    {job.justification || job.detailedJustification}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: REQUIREMENTS & SKILLS */}
          {activeTab === 'requirements' && (
            <div className="space-y-3">
              <div className="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5 pb-2 border-b border-zinc-100">
                  <Award size={14} className="text-indigo-600" />
                  Candidate Qualifications & Requirements
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
                    <span className="text-[10px] text-zinc-400 block font-semibold uppercase">Minimum Education</span>
                    <span className="font-bold text-zinc-900 text-xs mt-0.5 block">
                      {job.education || job.qualificationReq || 'Graduate / Relevant Degree'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
                    <span className="text-[10px] text-zinc-400 block font-semibold uppercase">Experience Required</span>
                    <span className="font-bold text-zinc-900 text-xs mt-0.5 block">
                      {job.experienceReq || 'Relevant Industry Experience'}
                    </span>
                  </div>
                </div>

                {/* Skills tags */}
                <div>
                  <h4 className="text-[11px] font-bold text-zinc-800 mb-2">Technical & Required Skills</h4>
                  {technicalSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {technicalSkills.map((s, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10.5px] font-semibold">
                          <Tag size={10} /> {s}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-zinc-400">No specific skills tagged.</p>
                  )}
                </div>

                {/* Preferred Qualifications */}
                {preferredQualifications.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-bold text-zinc-800 mb-1.5">Preferred Qualifications</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {preferredQualifications.map((pq, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 text-[10.5px] font-medium">
                          {pq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {certifications.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-bold text-zinc-800 mb-1.5">Certifications</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {certifications.map((c, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[10.5px] font-medium">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: REPLACEMENT DETAILS */}
          {activeTab === 'replacement' && (
            <div className="space-y-3">
              <div className="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                  <h3 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                    <UserMinus size={14} className="text-rose-600" />
                    Replacement Information
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isReplacement ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-zinc-100 text-zinc-500'
                  }`}>
                    {isReplacement ? 'Position is a Replacement' : 'New Additional Position'}
                  </span>
                </div>

                {isReplacement ? (
                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
                      <span className="text-zinc-400 block text-[10px]">Employee Replaced</span>
                      <span className="font-bold text-zinc-900 mt-0.5 block">{replacedEmployee}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
                      <span className="text-zinc-400 block text-[10px]">Replacement Reason</span>
                      <span className="font-bold text-zinc-900 mt-0.5 block">{replacementReason}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
                      <span className="text-zinc-400 block text-[10px]">Last Working Date</span>
                      <span className="font-bold text-zinc-900 mt-0.5 block">{lastWorkingDate}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
                      <span className="text-zinc-400 block text-[10px]">Impact of Vacancy</span>
                      <span className="font-bold text-zinc-900 mt-0.5 block">{vacancyImpact}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-zinc-500 text-xs">
                    <p className="font-semibold text-zinc-700">This job is for a new headcount/position.</p>
                    <p className="text-[11px] text-zinc-400 mt-1">No prior employee is being replaced for this requirement.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: PUBLISH CHANNELS */}
          {activeTab === 'channels' && (
            <div className="space-y-3">
              <div className="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                  <h3 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                    <Globe size={14} className="text-indigo-600" />
                    Publishing & Distribution Channels
                  </h3>
                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {publishChannels.length} Active Channels
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {publishChannels.map((channel, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-200 bg-zinc-50/50">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
                          {channel.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[11.5px] font-bold text-zinc-900">{channel}</p>
                          <p className="text-[9.5px] text-zinc-400">Status: Active Distribution</p>
                        </div>
                      </div>
                      <span className="h-2 w-2 rounded-full bg-emerald-500" title="Published" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ATTACHMENTS */}
          {activeTab === 'attachments' && (
            <div className="space-y-3">
              <div className="rounded-xl border border-zinc-200 bg-white p-3.5 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                  <h3 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                    <Paperclip size={14} className="text-indigo-600" />
                    Attachments & Documents ({attachments.length})
                  </h3>
                </div>

                {attachments.length > 0 ? (
                  <div className="space-y-2">
                    {attachments.map((att, i) => {
                      const fileName = att.split('/').pop() || `Attachment-${i + 1}`;
                      return (
                        <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-200 bg-zinc-50">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText size={15} className="text-indigo-600 shrink-0" />
                            <span className="text-[11.5px] font-semibold text-zinc-800 truncate">{fileName}</span>
                          </div>
                          <a
                            href={att}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10.5px] font-bold text-indigo-600 hover:text-indigo-800 ml-2 shrink-0"
                          >
                            <Download size={12} /> Download
                          </a>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center text-zinc-400 text-xs">
                    No files or documents attached to this job posting.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Quick Summary & Actions */}
        <div className="space-y-3">
          {/* Action Card */}
          <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm space-y-2">
            <h4 className="text-[11.5px] font-bold text-zinc-900 pb-1.5 border-b border-zinc-100">
              Quick Actions
            </h4>
            <div className="space-y-1.5">
              <Link
                href={`/dashboard/hiring/jobs/new`}
                className="w-full flex items-center justify-center gap-1.5 rounded-md bg-indigo-700 py-1.5 text-[11px] font-semibold text-white hover:bg-indigo-800 shadow-sm transition-colors"
              >
                Post Another Job
              </Link>
              <Link
                href={`/dashboard/hiring/candidates/new/create`}
                className="w-full flex items-center justify-center gap-1.5 rounded-md border border-zinc-200 bg-white py-1.5 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 shadow-sm transition-colors"
              >
                Add Candidate to this Job
              </Link>
              <Link
                href="/dashboard/hiring/jobs"
                className="w-full flex items-center justify-center gap-1.5 rounded-md border border-zinc-200 bg-white py-1.5 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 shadow-sm transition-colors"
              >
                Back to Jobs List
              </Link>
            </div>
          </div>

          {/* Audit / Metadata card */}
          <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm space-y-2">
            <h4 className="text-[11.5px] font-bold text-zinc-900 pb-1.5 border-b border-zinc-100">
              Job Audit & History
            </h4>
            <div className="space-y-2 text-[10.5px]">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Created On</span>
                <span className="font-semibold text-zinc-800">{formatDate(job.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Last Updated</span>
                <span className="font-semibold text-zinc-800">{formatDate(job.updatedAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Requested By</span>
                <span className="font-semibold text-zinc-800">{formatVal(job.requestedBy)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Approved By</span>
                <span className="font-semibold text-zinc-800">{formatVal(job.approvedBy)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Job Code</span>
                <span className="font-mono font-bold text-violet-700">{jobCode}</span>
              </div>
            </div>
          </div>

          {/* Distribution card */}
          <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm space-y-2">
            <h4 className="text-[11.5px] font-bold text-zinc-900 pb-1.5 border-b border-zinc-100 flex items-center justify-between">
              <span>Published Channels</span>
              <span className="text-[9.5px] font-semibold text-indigo-600">{publishChannels.length}</span>
            </h4>
            <div className="flex flex-wrap gap-1">
              {publishChannels.map((c, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 text-[9.5px] font-medium">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
