'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ArrowLeft, MapPin, Briefcase, Users, Building2, CheckCircle2, UploadCloud, FileText, X } from 'lucide-react';
import { useTenantBranding } from '@/hooks/useTenantBranding';
import { getClientSubdomain } from '@/lib/subdomain';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface PublicJob {
    _id: string;
    jobTitle: string;
    departmentId?: { name?: string };
    locationBranchId?: { name?: string; city?: string; state?: string };
    workLocation?: string;
    employmentType?: string;
    numberOfPositions?: number;
    experienceReq?: string;
    qualificationReq?: string;
    jobDescriptionSummary?: string;
    keyResponsibilities?: string[];
    technicalSkills?: string[];
    softSkills?: string[];
}

const inputCls = 'mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500';
const labelCls = 'text-sm font-semibold text-slate-700';

export default function CareersJobDetailPage() {
    const params = useParams();
    const jobId = params.id as string;
    const { branding } = useTenantBranding();
    const subdomain = getClientSubdomain();

    const [job, setJob] = useState<PublicJob | null>(null);
    const [notFound, setNotFound] = useState(false);

    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', currentLocation: '', totalExperience: '', expectedCTC: '', linkedin: '' });
    const [resume, setResume] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!subdomain || !jobId) return; // no-subdomain case is rendered directly via `invalidRoute` below
        axios
            .get(`${API_URL}/careers/jobs/${jobId}`, { params: { subdomain } })
            .then((res) => setJob(res.data.data))
            .catch(() => setNotFound(true));
    }, [subdomain, jobId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.firstName || !form.lastName || !form.email || !form.phone) {
            toast.error('Please fill in your name, email and phone.');
            return;
        }
        if (!resume) {
            toast.error('Please attach your resume (PDF or Word).');
            return;
        }

        setSubmitting(true);
        try {
            const body = new FormData();
            Object.entries(form).forEach(([key, value]) => body.append(key, value));
            body.append('resume', resume);

            await axios.post(`${API_URL}/careers/jobs/${jobId}/apply`, body, {
                params: { subdomain },
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setSubmitted(true);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Could not submit your application. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const companyName = branding?.companyNameOverride || 'Careers';
    const invalidRoute = !subdomain || !jobId;

    if (notFound || invalidRoute) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 text-center">
                <h1 className="text-lg font-bold text-slate-900">Job not found</h1>
                <p className="text-sm text-slate-500 mt-1">This position may have closed or the link is incorrect.</p>
                <Link href="/careers" className="mt-4 text-sm font-semibold text-blue-600 hover:underline">View all open positions</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-3xl mx-auto px-4 py-6 flex items-center gap-3">
                    {branding?.logoUrl ? (
                        <img src={branding.logoUrl} alt={companyName} className="h-10 max-w-[160px] object-contain" />
                    ) : (
                        <Building2 className="h-8 w-8 text-slate-400" />
                    )}
                    <h1 className="text-lg font-bold text-slate-900">{companyName} Careers</h1>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8">
                <Link href="/careers" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 mb-4">
                    <ArrowLeft className="h-4 w-4" /> All positions
                </Link>

                {!job ? (
                    <div className="text-center py-16 text-slate-500 text-sm">Loading…</div>
                ) : (
                    <>
                        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">{job.jobTitle}</h2>
                                    <p className="text-sm text-slate-500 mt-1">{job.departmentId?.name || 'General'}</p>
                                </div>
                                {job.employmentType && (
                                    <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold shrink-0">{job.employmentType}</span>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs font-medium text-slate-500">
                                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {job.workLocation || job.locationBranchId?.name || job.locationBranchId?.city || 'Not specified'}</span>
                                {job.experienceReq && <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> {job.experienceReq}</span>}
                                {job.numberOfPositions ? <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {job.numberOfPositions} opening{job.numberOfPositions > 1 ? 's' : ''}</span> : null}
                            </div>

                            {job.jobDescriptionSummary && (
                                <p className="text-sm text-slate-700 mt-5 leading-relaxed whitespace-pre-line">{job.jobDescriptionSummary}</p>
                            )}

                            {job.keyResponsibilities && job.keyResponsibilities.length > 0 && (
                                <div className="mt-5">
                                    <h3 className="text-sm font-bold text-slate-900 mb-2">Key Responsibilities</h3>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                                        {job.keyResponsibilities.map((r, i) => <li key={i}>{r}</li>)}
                                    </ul>
                                </div>
                            )}

                            {job.qualificationReq && (
                                <div className="mt-5">
                                    <h3 className="text-sm font-bold text-slate-900 mb-1">Qualification</h3>
                                    <p className="text-sm text-slate-700">{job.qualificationReq}</p>
                                </div>
                            )}

                            {(job.technicalSkills?.length || job.softSkills?.length) ? (
                                <div className="mt-5 flex flex-wrap gap-2">
                                    {[...(job.technicalSkills || []), ...(job.softSkills || [])].map((skill, i) => (
                                        <span key={i} className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">{skill}</span>
                                    ))}
                                </div>
                            ) : null}
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-6">
                            {submitted ? (
                                <div className="text-center py-8">
                                    <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
                                    <h3 className="text-base font-bold text-slate-900">Application submitted!</h3>
                                    <p className="text-sm text-slate-500 mt-1">Thanks for applying — the hiring team will be in touch if you're shortlisted.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <h3 className="text-base font-bold text-slate-900">Apply for this role</h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <label className="block">
                                            <span className={labelCls}>First Name <b className="text-rose-500">*</b></span>
                                            <input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className={inputCls} />
                                        </label>
                                        <label className="block">
                                            <span className={labelCls}>Last Name <b className="text-rose-500">*</b></span>
                                            <input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className={inputCls} />
                                        </label>
                                        <label className="block">
                                            <span className={labelCls}>Email <b className="text-rose-500">*</b></span>
                                            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
                                        </label>
                                        <label className="block">
                                            <span className={labelCls}>Phone <b className="text-rose-500">*</b></span>
                                            <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} />
                                        </label>
                                        <label className="block">
                                            <span className={labelCls}>Current Location</span>
                                            <input value={form.currentLocation} onChange={(e) => setForm({ ...form, currentLocation: e.target.value })} className={inputCls} />
                                        </label>
                                        <label className="block">
                                            <span className={labelCls}>Total Experience</span>
                                            <input value={form.totalExperience} onChange={(e) => setForm({ ...form, totalExperience: e.target.value })} className={inputCls} placeholder="e.g. 3 Years" />
                                        </label>
                                        <label className="block">
                                            <span className={labelCls}>Expected CTC</span>
                                            <input value={form.expectedCTC} onChange={(e) => setForm({ ...form, expectedCTC: e.target.value })} className={inputCls} />
                                        </label>
                                        <label className="block">
                                            <span className={labelCls}>LinkedIn Profile</span>
                                            <input value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} className={inputCls} placeholder="https://linkedin.com/in/…" />
                                        </label>
                                    </div>

                                    <label className="block">
                                        <span className={labelCls}>Resume <b className="text-rose-500">*</b></span>
                                        <input type="file" ref={fileInputRef} onChange={(e) => setResume(e.target.files?.[0] || null)} accept=".pdf,.doc,.docx" className="hidden" />
                                        {resume ? (
                                            <div className="mt-1 flex items-center justify-between p-2.5 border border-slate-200 bg-slate-50 rounded-lg text-sm">
                                                <span className="flex items-center gap-2 text-slate-700 truncate"><FileText className="h-4 w-4 text-blue-500 shrink-0" /> {resume.name}</span>
                                                <button type="button" onClick={() => setResume(null)} className="text-slate-400 hover:text-rose-500 shrink-0"><X className="h-4 w-4" /></button>
                                            </div>
                                        ) : (
                                            <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-1 w-full flex items-center justify-center gap-2 h-10 rounded-lg border border-dashed border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                                                <UploadCloud className="h-4 w-4" /> Upload resume (PDF or Word, max 5MB)
                                            </button>
                                        )}
                                    </label>

                                    <button type="submit" disabled={submitting} className="w-full h-10 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-bold transition-colors">
                                        {submitting ? 'Submitting…' : 'Submit Application'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
