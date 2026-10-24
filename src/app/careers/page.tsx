'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Search, MapPin, Briefcase, Users, Building2 } from 'lucide-react';
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
    jobDescriptionSummary?: string;
    createdAt: string;
}

export default function CareersPage() {
    const { branding } = useTenantBranding();
    const [jobs, setJobs] = useState<PublicJob[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [location, setLocation] = useState('');
    const subdomain = getClientSubdomain();

    useEffect(() => {
        if (!subdomain) return; // rendered directly below, not via state — see noSubdomainMessage

        let cancelled = false;
        const timer = setTimeout(() => {
            axios
                .get(`${API_URL}/careers/jobs`, { params: { subdomain, search: search || undefined, location: location || undefined } })
                .then((res) => { if (!cancelled) { setJobs(res.data.data || []); setError(null); } })
                .catch(() => { if (!cancelled) { setError('Could not load open positions right now.'); setJobs([]); } });
        }, 250); // debounce search/location typing

        return () => { cancelled = true; clearTimeout(timer); };
    }, [subdomain, search, location]);

    const companyName = branding?.companyNameOverride || 'Careers';
    const noSubdomainMessage = !subdomain ? 'This page is only available on a company’s own crewcam subdomain.' : null;
    const displayedError = noSubdomainMessage || error;
    const displayedJobs = noSubdomainMessage ? [] : jobs;

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-5xl mx-auto px-4 py-6 flex items-center gap-3">
                    {branding?.logoUrl ? (
                        <img src={branding.logoUrl} alt={companyName} className="h-10 max-w-[160px] object-contain" />
                    ) : (
                        <Building2 className="h-8 w-8 text-slate-400" />
                    )}
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">{companyName} Careers</h1>
                        <p className="text-sm text-slate-500">Open positions — apply directly below.</p>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by job title…"
                            className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div className="relative sm:w-64">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Location"
                            className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {displayedError && displayedJobs?.length === 0 && (
                    <div className="text-center py-16 text-slate-500 text-sm">{displayedError}</div>
                )}

                {!displayedError && displayedJobs === null && (
                    <div className="text-center py-16 text-slate-500 text-sm">Loading open positions…</div>
                )}

                {!displayedError && displayedJobs && displayedJobs.length === 0 && (
                    <div className="text-center py-16 text-slate-500 text-sm">No open positions match your search right now. Check back soon.</div>
                )}

                <div className="space-y-3">
                    {displayedJobs?.map((job) => (
                        <Link
                            key={job._id}
                            href={`/careers/${job._id}`}
                            className="block bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">{job.jobTitle}</h2>
                                    <p className="text-sm text-slate-500 mt-0.5">{job.departmentId?.name || 'General'}</p>
                                </div>
                                {job.employmentType && (
                                    <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold shrink-0">{job.employmentType}</span>
                                )}
                            </div>
                            {job.jobDescriptionSummary && (
                                <p className="text-sm text-slate-600 mt-3 line-clamp-2">{job.jobDescriptionSummary}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs font-medium text-slate-500">
                                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {job.workLocation || job.locationBranchId?.name || job.locationBranchId?.city || 'Not specified'}</span>
                                {job.experienceReq && <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> {job.experienceReq}</span>}
                                {job.numberOfPositions ? <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {job.numberOfPositions} opening{job.numberOfPositions > 1 ? 's' : ''}</span> : null}
                            </div>
                        </Link>
                    ))}
                </div>
            </main>

            <footer className="max-w-5xl mx-auto px-4 py-8 text-center text-xs text-slate-400">
                {branding?.poweredByLabel || 'Powered by CrewCam HRMS'}
            </footer>
        </div>
    );
}
