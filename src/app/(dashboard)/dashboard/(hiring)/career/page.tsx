'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import {
  Download, Plus, Search, ChevronDown, Check, Eye, Trash2,
  Building2, Users, MapPin, Briefcase, Globe, Copy, ExternalLink,
  FileText, ShieldCheck, Clock, RefreshCw, X, ChevronLeft, ChevronRight,
  Filter, CheckCircle2, FileCheck, Phone, Mail, Award, Calendar,
  Key, Code2, Server, Terminal, Activity, Zap,
  Layers, ArrowRight, UserPlus
} from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadCrumb';

// Platform SVG Icons for Hiring Channels & Social Media
function LinkedInIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
    </svg>
  );
}

function NaukriIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2h11A2.5 2.5 0 0 1 20 4.5v15a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 19.5v-15zm3.5 13h2.4v-6.2l4.8 6.2h2.3V6.5h-2.4v6.2L9.8 6.5H7.5v11z" />
    </svg>
  );
}

function ApnaIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.5 3C3.67 3 3 3.67 3 4.5v15c0 .83.67 1.5 1.5 1.5h15c.83 0 1.5-.67 1.5-1.5v-15c0-.83-.67-1.5-1.5-1.5h-15zm7.5 4c2.76 0 5 2.24 5 5v5h-2.3v-5c0-1.49-1.21-2.7-2.7-2.7s-2.7 1.21-2.7 2.7 1.21 2.7 2.7 2.7c.68 0 1.31-.26 1.78-.68l1.45 1.59C14.45 17.5 13.28 18 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6z" />
    </svg>
  );
}

function IndeedIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.98 6.06c-1.3 0-2.28.98-2.28 2.3 0 1.33.98 2.32 2.28 2.32 1.32 0 2.3-.99 2.3-2.32 0-1.32-.98-2.3-2.3-2.3zm-1.65 5.56h3.3V19h-3.3v-7.38zM20 4.1C18.05 2.25 15.4 1.2 12.55 1.2 6.7 1.2 1.9 6 1.9 11.9c0 3.86 2.02 7.27 5.14 9.2l1.56-2.39C6.22 17.2 4.8 14.7 4.8 11.9c0-4.28 3.48-7.76 7.75-7.76 2.02 0 3.95.74 5.33 2.12l2.12-2.16z" />
    </svg>
  );
}

function FacebookIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function TelegramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.196 1.006.128.832.942z" />
    </svg>
  );
}

function WebsiteIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

// Reusable Source Badge Renderer. For a tenant's own career website(s), `siteName` is the
// Site Label configured in Settings → Integrations (e.g. "Main Site") so a tenant with more
// than one connected site can tell candidates apart at a glance; `siteUrl` (that site's base
// URL) shows on hover via the badge's title attribute instead of cluttering the row with a link.
const renderSourceBadge = (source?: string, siteName?: string, siteUrl?: string) => {
  switch (source) {
    case 'LinkedIn':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#0A66C2]/10 text-[#0A66C2] border border-[#0A66C2]/25">
          <LinkedInIcon className="w-3 h-3 shrink-0" />
          LinkedIn
        </span>
      );
    case 'Naukri.com':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#004c8f]/10 text-[#004c8f] border border-[#004c8f]/25">
          <NaukriIcon className="w-3 h-3 shrink-0" />
          Naukri.com
        </span>
      );
    case 'Apna':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#00A66E]/10 text-[#00A66E] border border-[#00A66E]/25">
          <ApnaIcon className="w-3 h-3 shrink-0" />
          Apna
        </span>
      );
    case 'Indeed':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#2164f4]/10 text-[#2164f4] border border-[#2164f4]/25">
          <IndeedIcon className="w-3 h-3 shrink-0" />
          Indeed
        </span>
      );
    case 'Facebook':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#1877F2]/10 text-[#1877F2] border border-[#1877F2]/25">
          <FacebookIcon className="w-3 h-3 shrink-0" />
          Facebook
        </span>
      );
    case 'Instagram':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#E1306C]/10 text-[#E1306C] border border-[#E1306C]/25">
          <InstagramIcon className="w-3 h-3 shrink-0" />
          Instagram
        </span>
      );
    case 'Telegram':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#0088cc]/10 text-[#0088cc] border border-[#0088cc]/25">
          <TelegramIcon className="w-3 h-3 shrink-0" />
          Telegram
        </span>
      );
    case 'Career Website':
    case 'Website':
      return (
        <span
          title={siteUrl || undefined}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 cursor-default"
        >
          <WebsiteIcon className="w-3 h-3 shrink-0 text-purple-600" />
          {siteName || 'Career Website'}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
          <Globe className="w-3 h-3 shrink-0 text-purple-600" />
          {source || 'Career Site'}
        </span>
      );
  }
};

const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/initials/svg?seed=';

// Older synced candidates may still carry a raw Mongo _id as sourceSite (from before this
// fell back to the site's own hostname instead — see shortSiteName in careerSiteSync.service.ts
// on the backend). Re-syncing fixes it going forward; this keeps already-synced rows readable
// in the meantime by deriving the same short hostname from sourceUrl instead of showing the id.
const isRawObjectId = (value: string) => /^[0-9a-f]{24}$/i.test(value);
const shortHostname = (url?: string): string => {
  if (!url) return '';
  try {
    return new URL(url).hostname.replace(/^www\./i, '');
  } catch {
    return url;
  }
};

// Real Candidate statuses (see models/Candidate.ts) and their display label — the same
// recruitment-process vocabulary already used elsewhere (Candidate Pipeline, HOD Evaluation),
// so the status shown/settable here lines up with the rest of the app instead of this page's
// own, narrower "New / Under Review / Shortlisted" set.
const STATUS_LABELS: Record<string, string> = {
  Applied: 'Applied',
  AI_SCREENING: 'AI Screening',
  Screening: 'Screening',
  HOD_APPROVAL: 'HOD Evaluation',
  INTERVIEW_SCHEDULED: 'Interview Scheduled',
  Interviewing: 'Interviewing',
  SHORTLISTED: 'Shortlisted',
  Offered: 'Offered',
  Hired: 'Hired',
  Rejected: 'Rejected',
  Hold: 'Hold',
};
// Same 4-color scheme this page already used (sky/amber/emerald/rose) — just bucketing every
// real status into one of the four instead of only recognizing three label strings.
const STATUS_BADGE_CLASS: Record<string, string> = {
  Applied: 'bg-sky-50 text-sky-600 border-sky-200',
  AI_SCREENING: 'bg-sky-50 text-sky-600 border-sky-200',
  Screening: 'bg-amber-50 text-amber-700 border-amber-200',
  HOD_APPROVAL: 'bg-amber-50 text-amber-700 border-amber-200',
  INTERVIEW_SCHEDULED: 'bg-amber-50 text-amber-700 border-amber-200',
  Interviewing: 'bg-amber-50 text-amber-700 border-amber-200',
  SHORTLISTED: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  Offered: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  Hired: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  Rejected: 'bg-rose-50 text-rose-600 border-rose-200',
  Hold: 'bg-rose-50 text-rose-600 border-rose-200',
};

/** Adapts a real Candidate document (from GET /hiring/candidates) onto the row shape this
 * page's (otherwise unchanged) table/modals already render, so pulling in real applicants —
 * including ones synced in from a tenant's career site, see applicationDetails — needed no
 * rework of the UI itself.
 *
 * `siteById` is this tenant's currently-connected "career-site" integrations (see
 * CareerSiteConnectionCard), keyed by their own _id — candidates synced before this page
 * resolved a real site name/URL have `sourceSite` stuck as that raw _id, so looking it up here
 * against the LIVE integration always resolves to the real label/URL, with no backend resync or
 * data migration needed. Falls back to the stored sourceSite/sourceUrl, then a short hostname,
 * only if the integration itself was since removed. */
function mapCandidateDoc(doc: any, siteById: Record<string, { siteKey?: string; baseUrl?: string }>) {
  const details = doc.applicationDetails || {};
  const name = `${doc.firstName || ''} ${doc.lastName || ''}`.trim() || 'Candidate';
  const linkedSite = doc.sourceSite ? siteById[doc.sourceSite] : undefined;
  const sourceUrl = linkedSite?.baseUrl || doc.sourceUrl || '';
  const sourceSite =
    linkedSite?.siteKey ||
    (doc.sourceSite && !isRawObjectId(doc.sourceSite) ? doc.sourceSite : '') ||
    shortHostname(sourceUrl) ||
    doc.sourceSite ||
    '';
  return {
    id: doc._id,
    _raw: doc,
    name,
    email: doc.email || '',
    phone: doc.phone || '',
    avatar: doc.profileImageUrl || `${DEFAULT_AVATAR}${encodeURIComponent(name)}`,
    position: doc.jobRole || '',
    department: doc.departmentId?.name || details.department || '',
    branch: details.currentLocation || details.location || '—',
    experience: details.totalExperience || '—',
    noticePeriod: details.noticePeriod || '—',
    cvName: doc.resumeUrl ? decodeURIComponent(String(doc.resumeUrl).split('/').pop() || 'resume.pdf').split('?')[0] : 'No resume attached',
    cvSize: '',
    resumeUrl: doc.resumeUrl || '',
    appliedDate: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
    status: doc.status || 'Applied',
    statusLabel: STATUS_LABELS[doc.status] || doc.status || 'Applied',
    source: doc.source || 'Career Website',
    sourceSite,
    sourceUrl,
    summary: details.summary || doc.comments || `${details.currentDesignation ? `${details.currentDesignation} at ${details.currentCompany || 'current company'}. ` : ''}${details.expectedCTC ? `Expected CTC: ${details.expectedCTC}.` : ''}`.trim(),
    skills: Array.isArray(details.skills) ? details.skills : [],
  };
}

export default function CareerPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: candidatesData, isLoading: candidatesLoading } = useQuery({
    queryKey: ['career-candidates'],
    queryFn: async () => (await api.get('/hiring/candidates')).data,
  });
  // Same query CareerSiteConnectionCard (Settings → Integrations) uses — shared cache, no extra
  // request if that's already loaded this session. Used only to resolve the real name/URL behind
  // a candidate's sourceSite (see mapCandidateDoc), so this page never has to show a raw _id.
  const { data: integrationsData } = useQuery({
    queryKey: ['integrations'],
    queryFn: async () => (await api.get('/settings/integrations')).data,
  });
  const siteById = useMemo(() => {
    const map: Record<string, { siteKey?: string; baseUrl?: string }> = {};
    (Array.isArray(integrationsData) ? integrationsData : []).forEach((i: any) => {
      if (i.provider === 'career-site') {
        map[i._id] = { siteKey: i.credentials?.siteKey, baseUrl: i.credentials?.baseUrl };
      }
    });
    return map;
  }, [integrationsData]);
  // Every currently connected career-site integration for this tenant (used by the API &
  // Webhook Integration modal below — a tenant may have more than one connected site).
  const careerSiteIntegrations = useMemo(
    () => (Array.isArray(integrationsData) ? integrationsData : []).filter((i: any) => i.provider === 'career-site' && i.isActive),
    [integrationsData]
  );
  const primaryCareerSite = careerSiteIntegrations[0] as any | undefined;
  const careerSiteBaseUrl: string | undefined = primaryCareerSite?.credentials?.baseUrl;
  const isCareerSiteConnected = Boolean(careerSiteBaseUrl);
  const candidates = useMemo(
    () => ((Array.isArray(candidatesData) ? candidatesData : candidatesData?.data || []) as any[]).map((doc) => mapCandidateDoc(doc, siteById)),
    [candidatesData, siteById]
  );
  // "Live Submission Logs" tab — real synced candidates (newest first) in place of a
  // fictional request log that was never actually populated by anything.
  const recentSyncedCandidates = useMemo(
    () => candidates
      .filter((c: any) => c.sourceSite || c.source === 'Career Website')
      .sort((a: any, b: any) => new Date(b._raw?.createdAt || 0).getTime() - new Date(a._raw?.createdAt || 0).getTime())
      .slice(0, 25),
    [candidates]
  );

  // Company Dropdown / Dynamic Branch Dropdown — this tenant's own companies and branches
  // only (previously a hardcoded list that mixed in other tenants' company names).
  const { data: companiesData } = useQuery({
    queryKey: ['career-page-companies'],
    queryFn: async () => (await api.get('/companies')).data,
  });
  const { data: branchesData } = useQuery({
    queryKey: ['career-page-branches'],
    queryFn: async () => (await api.get('/companies/branches?limit=200')).data,
  });
  const companyNames = useMemo(
    () => Array.from(new Set((Array.isArray(companiesData) ? companiesData : []).map((c: any) => c.name).filter(Boolean))),
    [companiesData]
  );
  const branchNames = useMemo(
    () => Array.from(new Set(((branchesData?.data || []) as any[]).map((b: any) => b.name).filter(Boolean))),
    [branchesData]
  );

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => (await api.delete(`/hiring/candidates/${id}`)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['career-candidates'] }),
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to delete application'),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) =>
      (await api.put(`/hiring/candidates/${id}/status`, { status })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['career-candidates'] }),
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to update status'),
  });

  const syncMutation = useMutation({
    mutationFn: async () => {
      const [jobs, applicants] = await Promise.all([
        api.post('/hiring/manpower-request/sync-career-site').then((r) => r.data).catch((e) => ({ error: e })),
        api.post('/hiring/candidates/sync-career-site').then((r) => r.data).catch((e) => ({ error: e })),
      ]);
      return { jobs, applicants };
    },
    onSuccess: ({ applicants, jobs }) => {
      queryClient.invalidateQueries({ queryKey: ['career-candidates'] });
      if (applicants?.error) {
        toast.error(applicants.error?.response?.data?.message || 'Failed to sync candidates from your career site(s).');
      } else {
        toast.success(`Synced ${applicants.created || 0} new, ${applicants.updated || 0} updated candidate(s)${jobs?.created != null ? ` and ${jobs.created} new job(s)` : ''}.`);
      }
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Sync failed — is a career site connected under Settings → Integrations?'),
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [branchFilter, setBranchFilter] = useState('All Branches');
  const [positionFilter, setPositionFilter] = useState('All Positions');
  const [sourceFilter, setSourceFilter] = useState('All Sources');

  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');

  // Default to this tenant's first company/branch once loaded, instead of leaving the
  // dropdown blank or pointing at a name from the old hardcoded cross-tenant list.
  useEffect(() => {
    if (!selectedCompany && companyNames.length > 0) setSelectedCompany(companyNames[0] as string);
  }, [companyNames, selectedCompany]);
  useEffect(() => {
    if (!selectedBranch && branchNames.length > 0) setSelectedBranch(branchNames[0] as string);
  }, [branchNames, selectedBranch]);

  // Dropdown toggles
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const [isBranchOpen, setIsBranchOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isBranchFilterOpen, setIsBranchFilterOpen] = useState(false);
  const [isPosFilterOpen, setIsPosFilterOpen] = useState(false);
  const [isSourceFilterOpen, setIsSourceFilterOpen] = useState(false);
  const [isModalStatusOpen, setIsModalStatusOpen] = useState(false);

  // Active filters applied
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    status: 'All Status',
    branch: 'All Branches',
    position: 'All Positions',
    source: 'All Sources',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Modals state
  const [viewingCandidate, setViewingCandidate] = useState<any | null>(null);
  const [cvPreviewCandidate, setCvPreviewCandidate] = useState<any | null>(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'credentials' | 'fields' | 'snippets' | 'logs'>('credentials');
  const [codeTab, setCodeTab] = useState<'pull' | 'push-status' | 'push-job'>('pull');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<{ status: number; latency: number; timestamp: string } | null>(null);
  const [inspectCandidate, setInspectCandidate] = useState<any | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const filterRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
    toast.success(`${label} copied to clipboard!`);
  };

  // Always re-closed when a different (or no) candidate is opened, so it never carries over open.
  useEffect(() => {
    setIsModalStatusOpen(false);
  }, [viewingCandidate?.id]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsCompanyOpen(false);
        setIsBranchOpen(false);
        setIsStatusOpen(false);
        setIsBranchFilterOpen(false);
        setIsPosFilterOpen(false);
        setIsSourceFilterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options
  const statusOptions = ['All Status', ...Object.values(STATUS_LABELS)];
  const branchOptions = ['All Branches', ...Array.from(new Set(candidates.map((c) => c.branch)))];
  const positionOptions = ['All Positions', ...Array.from(new Set(candidates.map((c) => c.position)))];
  const sourceOptions = [
    'All Sources',
    'Career Website',
    'LinkedIn',
    'Naukri.com',
    'Apna',
    'Indeed',
    'Facebook',
    'Instagram',
    'Telegram',
  ];

  // Filter application
  const filteredCandidates = candidates.filter((c: any) => {
    if (appliedFilters.search.trim()) {
      const q = appliedFilters.search.toLowerCase();
      const match =
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.position.toLowerCase().includes(q) ||
        c.branch.toLowerCase().includes(q) ||
        (c.source && c.source.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (appliedFilters.status !== 'All Status' && c.statusLabel !== appliedFilters.status) return false;
    if (appliedFilters.branch !== 'All Branches' && c.branch !== appliedFilters.branch) return false;
    if (appliedFilters.position !== 'All Positions' && c.position !== appliedFilters.position) return false;
    if (appliedFilters.source !== 'All Sources') {
      if (appliedFilters.source === 'Career Website' || appliedFilters.source === 'Website') {
        if (c.source !== 'Career Website' && c.source !== 'Website') return false;
      } else if (c.source !== appliedFilters.source) {
        return false;
      }
    }
    return true;
  });

  const handleApply = () => {
    setAppliedFilters({
      search: searchQuery,
      status: statusFilter,
      branch: branchFilter,
      position: positionFilter,
      source: sourceFilter,
    });
    setCurrentPage(1);
    toast.success('Filters applied');
  };

  const handleClear = () => {
    setSearchQuery('');
    setStatusFilter('All Status');
    setBranchFilter('All Branches');
    setPositionFilter('All Positions');
    setSourceFilter('All Sources');
    setAppliedFilters({
      search: '',
      status: 'All Status',
      branch: 'All Branches',
      position: 'All Positions',
      source: 'All Sources',
    });
    setCurrentPage(1);
    toast.success('Filters reset');
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete application for ${name}?`)) return;
    deleteMutation.mutate(id, { onSuccess: () => toast.success(`Application for ${name} removed`) });
  };

  const handleForwardToAddCandidate = (c: any) => {
    try {
      const candidatePayload = {
        id: c.id,
        name: c.name,
        fullName: c.name,
        email: c.email,
        phone: c.phone,
        mobile: c.phone,
        avatar: c.avatar,
        position: c.position,
        appliedFor: c.position,
        department: c.department,
        branch: c.branch,
        currentLocation: c.branch,
        experience: c.experience,
        totalExperience: c.experience,
        noticePeriod: c.noticePeriod,
        cvName: c.cvName,
        cvSize: c.cvSize,
        skills: c.skills || [],
        summary: c.summary,
        source: c.source || 'Website',
        appliedDate: c.appliedDate,
        status: c.status,
      };

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('prefillCandidateData', JSON.stringify(candidatePayload));
      }

      toast.success(`Redirecting to Add Candidate with details for ${c.name}...`);
      router.push(`/dashboard/hiring/candidates/new/create?source=career`);
    } catch (e) {
      console.error('Failed to forward candidate', e);
      toast.error('Failed to initiate candidate transfer');
    }
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    updateStatusMutation.mutate({ id, status: newStatus }, {
      onSuccess: () => {
        if (viewingCandidate && viewingCandidate.id === id) {
          setViewingCandidate({ ...viewingCandidate, status: newStatus, statusLabel: STATUS_LABELS[newStatus] || newStatus });
        }
        toast.success(`Candidate status updated to "${STATUS_LABELS[newStatus] || newStatus}"`);
        setIsModalStatusOpen(false);
      },
    });
  };

  const copyPortalLink = () => {
    if (!careerSiteBaseUrl) return;
    navigator.clipboard.writeText(careerSiteBaseUrl);
    toast.success('Career Portal URL copied to clipboard!');
  };

  const handleSyncAPI = () => {
    setIsSyncing(true);
    syncMutation.mutate(undefined, { onSettled: () => setIsSyncing(false) });
  };

  const handlePingAPI = async () => {
    if (!primaryCareerSite?._id) {
      toast.error('No career site is connected yet — add one under Settings → Integrations.');
      return;
    }
    setIsPinging(true);
    try {
      const { data } = await api.get(`/settings/integrations/${primaryCareerSite._id}/ping`);
      setPingResult({ status: data.status, latency: data.latency, timestamp: new Date().toLocaleTimeString() });
      if (data.status === 200) {
        toast.success(`Gateway reachable! Responded in ${data.latency}ms (200 OK)`);
      } else {
        toast.error(data.error ? `Gateway unreachable: ${data.error}` : `Gateway responded with HTTP ${data.status}`);
      }
    } catch (err: any) {
      setPingResult({ status: 0, latency: 0, timestamp: new Date().toLocaleTimeString() });
      toast.error(err?.response?.data?.message || 'Failed to ping the connected career site.');
    } finally {
      setIsPinging(false);
    }
  };

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Name,Email,Phone,Position,Source,Branch,Experience,Status,AppliedDate']
        .concat(
          candidates.map(
            (c: any) =>
              `"${c.name}","${c.email}","${c.phone}","${c.position}","${c.source || 'Website'}","${c.branch}","${c.experience}","${c.status}","${c.appliedDate}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `career_applications_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported candidate data to CSV');
  };

  const handleDownloadCV = (c: any) => {
    if (!c.resumeUrl) {
      toast.error('No resume on file for this candidate');
      return;
    }
    window.open(c.resumeUrl, '_blank', 'noopener,noreferrer');
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredCandidates.length / rowsPerPage));
  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Derived KPI Stats & Multi-Platform Hiring Channels Distribution — computed from the real
  // candidates pulled in (mix of career-site syncs and any other source already in Candidate).
  const todayStr = new Date().toDateString();
  const totalApplications = candidates.length;
  const newSubmissionsCount = candidates.filter((c: any) => new Date(c._raw?.createdAt || 0).toDateString() === todayStr).length;
  const resumesReceivedCount = candidates.filter((c: any) => !!c.resumeUrl).length;

  const countBySource = (...sources: string[]) =>
    candidates.filter((c: any) => sources.includes(c.source)).length;

  // Channel Distribution Counts
  const websiteCount = countBySource('Career Website', 'Website', 'Career Portal');
  const linkedinCount = countBySource('LinkedIn');
  const naukriCount = countBySource('Naukri.com');
  const apnaCount = countBySource('Apna');
  const indeedCount = countBySource('Indeed');
  const facebookCount = countBySource('Facebook');
  const instagramCount = countBySource('Instagram');
  const telegramCount = countBySource('Telegram');

  const coreCards = [
    {
      id: 'total',
      title: 'TOTAL APPLICATIONS',
      value: totalApplications.toLocaleString(),
      subtitle: 'All Inbound Submissions',
      icon: Users,
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      badge: '+14% This Month',
      badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200/60',
    },
    {
      id: 'new',
      title: 'NEW SUBMISSIONS',
      value: newSubmissionsCount.toString(),
      subtitle: 'Received Today',
      icon: Briefcase,
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      badge: 'Action Required',
      badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    },
    {
      id: 'resumes',
      title: 'RESUMES RECEIVED',
      value: resumesReceivedCount.toLocaleString(),
      subtitle: 'Verified Attached CVs',
      icon: FileText,
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      badge: '95.3% Verified',
      badgeClass: 'bg-purple-50 text-purple-700 border border-purple-200/60',
    },
  ];

  const channelCards = [
    {
      id: 'website',
      title: 'WEBSITE',
      value: websiteCount.toLocaleString(),
      subtitle: 'Career Portal Direct',
      icon: WebsiteIcon,
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      sourceKey: 'Career Website',
    },
    {
      id: 'linkedin',
      title: 'LINKEDIN',
      value: linkedinCount.toLocaleString(),
      subtitle: 'Easy Apply Feed',
      icon: LinkedInIcon,
      bg: 'bg-sky-50',
      text: 'text-[#0A66C2]',
      sourceKey: 'LinkedIn',
    },
    {
      id: 'naukri',
      title: 'NAUKRI.COM',
      value: naukriCount.toLocaleString(),
      subtitle: 'RMS & FastForward',
      icon: NaukriIcon,
      bg: 'bg-blue-50',
      text: 'text-[#004c8f]',
      sourceKey: 'Naukri.com',
    },
    {
      id: 'apna',
      title: 'APNA',
      value: apnaCount.toLocaleString(),
      subtitle: 'Direct Job Leads',
      icon: ApnaIcon,
      bg: 'bg-emerald-50',
      text: 'text-[#00A66E]',
      sourceKey: 'Apna',
    },
    {
      id: 'indeed',
      title: 'INDEED',
      value: indeedCount.toLocaleString(),
      subtitle: 'Indeed Apply Feed',
      icon: IndeedIcon,
      bg: 'bg-indigo-50',
      text: 'text-[#2164f4]',
      sourceKey: 'Indeed',
    },
    {
      id: 'facebook',
      title: 'FACEBOOK',
      value: facebookCount.toLocaleString(),
      subtitle: 'Meta Ads & Page',
      icon: FacebookIcon,
      bg: 'bg-blue-50',
      text: 'text-[#1877F2]',
      sourceKey: 'Facebook',
    },
    {
      id: 'instagram',
      title: 'INSTAGRAM',
      value: instagramCount.toLocaleString(),
      subtitle: 'Bio Link & Stories',
      icon: InstagramIcon,
      bg: 'bg-pink-50',
      text: 'text-[#E1306C]',
      sourceKey: 'Instagram',
    },
    {
      id: 'telegram',
      title: 'TELEGRAM',
      value: telegramCount.toLocaleString(),
      subtitle: 'Bot & Channels',
      icon: TelegramIcon,
      bg: 'bg-sky-50',
      text: 'text-[#0088cc]',
      sourceKey: 'Telegram',
    },
  ];

  return (
    <div className="flex flex-col gap-2 animate-in fade-in duration-300 p-2 w-full font-sans text-zinc-800 bg-[#f8f9fc] min-h-screen">

      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
        <div>
          <Breadcrumb
            items={[
              { label: 'Hiring Process', href: '/dashboard' },
              { label: 'Career Applications' },
            ]}
          />
          <h1 className="text-lg font-bold text-zinc-900 mb-0.5">Career Applications</h1>
          <p className="text-[11px] text-zinc-500">
            View, add, edit and manage all incoming career website candidate applications.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 h-8 px-2.5 bg-white border border-zinc-200 rounded-md text-[11px] font-semibold hover:bg-zinc-50 transition-colors shadow-sm text-zinc-700"
          >
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <button
            onClick={() => setIsSyncModalOpen(true)}
            className="flex items-center gap-1.5 h-8 px-2.5 bg-indigo-600 text-white rounded-md text-[11px] font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            + Sync Website API
          </button>
        </div>
      </div>

      {/* CONFIGURATION & FILTER BAR */}
      <div ref={filterRef} className="bg-white border border-zinc-200 shadow-sm rounded-md p-2.5 flex flex-col gap-2.5">

        {/* Row 1: Company Select, Dynamic Branch Select, and Live Career URL Chip */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Company Dropdown */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Company Dropdown</span>
              <div className="relative">
                <button
                  onClick={() => {
                    setIsCompanyOpen(!isCompanyOpen);
                    setIsBranchOpen(false);
                    setIsStatusOpen(false);
                    setIsBranchFilterOpen(false);
                    setIsPosFilterOpen(false);
                  }}
                  className="flex items-center justify-between gap-1.5 h-8 px-2.5 border border-zinc-200 rounded-md text-[11px] font-semibold text-zinc-700 bg-white hover:bg-zinc-50 transition-colors min-w-[220px]"
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <Building2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="truncate">{selectedCompany || 'No company found'}</span>
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                </button>
                {isCompanyOpen && (
                  <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-zinc-200 shadow-lg rounded-md py-1 z-50">
                    {companyNames.length === 0 && (
                      <p className="px-3 py-1.5 text-[11px] text-zinc-400">No companies set up for this tenant yet.</p>
                    )}
                    {companyNames.map((comp) => (
                      <button
                        key={comp as string}
                        onClick={() => {
                          setSelectedCompany(comp as string);
                          setIsCompanyOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50 text-left"
                      >
                        <span className="truncate">{comp}</span>
                        {selectedCompany === comp && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Branch Dropdown */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Dynamic Branch Dropdown</span>
              <div className="relative">
                <button
                  onClick={() => {
                    setIsBranchOpen(!isBranchOpen);
                    setIsCompanyOpen(false);
                    setIsStatusOpen(false);
                    setIsBranchFilterOpen(false);
                    setIsPosFilterOpen(false);
                  }}
                  className="flex items-center justify-between gap-1.5 h-8 px-2.5 border border-zinc-200 rounded-md text-[11px] font-semibold text-zinc-700 bg-white hover:bg-zinc-50 transition-colors min-w-[235px]"
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="truncate">{selectedBranch || 'No branch found'}</span>
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                </button>
                {isBranchOpen && (
                  <div className="absolute left-0 top-full mt-1 w-72 bg-white border border-zinc-200 shadow-lg rounded-md py-1 z-50">
                    {branchNames.length === 0 && (
                      <p className="px-3 py-1.5 text-[11px] text-zinc-400">No branches set up for this tenant yet.</p>
                    )}
                    {branchNames.map((br) => (
                      <button
                        key={br as string}
                        onClick={() => {
                          setSelectedBranch(br as string);
                          setIsBranchOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50 text-left"
                      >
                        <span className="truncate">{br}</span>
                        {selectedBranch === br && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Live Career Portal Link Badge */}
          <div className="flex items-center gap-2 bg-zinc-50/80 border border-zinc-200 rounded-md px-2.5 py-1 text-[11px] shrink-0 self-start lg:self-end">
            <span className="text-zinc-600 font-mono text-[11px] flex items-center gap-1 truncate max-w-[220px]">
              <Globe className="w-3 h-3 text-indigo-600 shrink-0" />
              {careerSiteBaseUrl || 'No career site connected'}
            </span>
            {careerSiteBaseUrl && (
              <>
                <button
                  onClick={copyPortalLink}
                  className="h-6 px-2 bg-white border border-zinc-200 rounded text-[10px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <Copy className="w-3 h-3" /> Copy Link
                </button>
                <a
                  href={careerSiteBaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-6 px-2 bg-white border border-zinc-200 rounded text-[10px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <ExternalLink className="w-3 h-3" /> Open Site
                </a>
              </>
            )}
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${isCareerSiteConnected ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isCareerSiteConnected ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`}></span>
              {isCareerSiteConnected ? 'Connected' : 'Not Connected'}
            </span>
          </div>
        </div>

        {/* Row 2: Search, Status, Branch, Position Filters, Clear & Apply */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 pt-2 border-t border-zinc-100">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search candidate name, role, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleApply();
              }}
              className="pl-2.5 pr-7 h-8 w-full bg-white border border-zinc-200 rounded-md text-[11px] focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-zinc-400"
            />
            <Search className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsStatusOpen(!isStatusOpen);
                setIsSourceFilterOpen(false);
                setIsBranchFilterOpen(false);
                setIsPosFilterOpen(false);
                setIsCompanyOpen(false);
                setIsBranchOpen(false);
              }}
              className="flex items-center justify-between gap-1.5 h-8 px-2.5 w-full md:w-36 border border-zinc-200 rounded-md text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              <span className="truncate">{statusFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            </button>
            {isStatusOpen && (
              <div className="absolute left-0 top-full mt-1 w-40 bg-white border border-zinc-200 shadow-lg rounded-md py-1 z-50">
                {statusOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setStatusFilter(opt);
                      setIsStatusOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    <span>{opt}</span>
                    {statusFilter === opt && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Source Dropdown Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setIsSourceFilterOpen(!isSourceFilterOpen);
                setIsStatusOpen(false);
                setIsBranchFilterOpen(false);
                setIsPosFilterOpen(false);
                setIsCompanyOpen(false);
                setIsBranchOpen(false);
              }}
              className="flex items-center justify-between gap-1.5 h-8 px-2.5 w-full md:w-40 border border-zinc-200 rounded-md text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              <span className="truncate">{sourceFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            </button>
            {isSourceFilterOpen && (
              <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-zinc-200 shadow-lg rounded-md py-1 z-50">
                {sourceOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSourceFilter(opt);
                      setIsSourceFilterOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50 text-left"
                  >
                    <span className="truncate">{opt}</span>
                    {sourceFilter === opt && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Branch Dropdown Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setIsBranchFilterOpen(!isBranchFilterOpen);
                setIsStatusOpen(false);
                setIsSourceFilterOpen(false);
                setIsPosFilterOpen(false);
                setIsCompanyOpen(false);
                setIsBranchOpen(false);
              }}
              className="flex items-center justify-between gap-1.5 h-8 px-2.5 w-full md:w-40 border border-zinc-200 rounded-md text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              <span className="truncate">{branchFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            </button>
            {isBranchFilterOpen && (
              <div className="absolute left-0 top-full mt-1 w-44 bg-white border border-zinc-200 shadow-lg rounded-md py-1 z-50">
                {branchOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setBranchFilter(opt);
                      setIsBranchFilterOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    <span className="truncate">{opt}</span>
                    {branchFilter === opt && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Position Dropdown Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setIsPosFilterOpen(!isPosFilterOpen);
                setIsStatusOpen(false);
                setIsSourceFilterOpen(false);
                setIsBranchFilterOpen(false);
                setIsCompanyOpen(false);
                setIsBranchOpen(false);
              }}
              className="flex items-center justify-between gap-1.5 h-8 px-2.5 w-full md:w-44 border border-zinc-200 rounded-md text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              <span className="truncate">{positionFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            </button>
            {isPosFilterOpen && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-zinc-200 shadow-lg rounded-md py-1 z-50 max-h-56 overflow-y-auto">
                {positionOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setPositionFilter(opt);
                      setIsPosFilterOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50 text-left"
                  >
                    <span className="truncate">{opt}</span>
                    {positionFilter === opt && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              className="h-8 px-3 border border-zinc-200 rounded-md text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleApply}
              className="h-8 px-3 bg-indigo-600 text-white rounded-md text-[11px] font-semibold hover:bg-indigo-700 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: PRIMARY HIRING FUNNEL KPIS (3 LARGE STAT CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-1">
        {coreCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-3 flex items-center justify-between bg-white border border-zinc-200 shadow-sm rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${card.bg} ${card.text} shadow-sm`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <h3 className="text-[10.5px] font-bold text-zinc-500 uppercase tracking-wide truncate">{card.title}</h3>
                  <span className="text-lg sm:text-xl font-extrabold text-zinc-900 leading-tight">{card.value}</span>
                  <p className="text-[10px] text-zinc-400 truncate">{card.subtitle}</p>
                </div>
              </div>
              {card.badge && (
                <span className={`text-[9.5px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${card.badgeClass}`}>
                  {card.badge}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* SECTION 2: SOURCING CHANNELS & SOCIAL MEDIA INFLOW (8 CHANNELS) */}
      <div className="bg-white border border-zinc-200 shadow-sm rounded-xl p-2.5 flex flex-col gap-2 mb-1">
        <div className="flex items-center justify-between flex-wrap gap-2 px-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-[11px] font-bold text-zinc-800 uppercase tracking-wider">
              Sourcing Channels & Social Media Inflow
            </h2>
            <span className="text-[10px] text-zinc-400 font-medium hidden sm:inline">
              (8 Active Job Portals & Inbound Social Feeds)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {channelCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="p-2 sm:p-2.5 flex flex-col gap-1.5 rounded-lg border bg-zinc-50/60 border-zinc-200/80 hover:bg-white hover:border-zinc-300 hover:shadow-xs transition-all duration-150"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${card.bg} ${card.text}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-zinc-900">{card.value}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold text-zinc-700 truncate tracking-tight">{card.title}</span>
                  <span className="text-[9px] text-zinc-400 truncate">{card.subtitle}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CANDIDATE SUBMISSIONS TABLE */}
      <div className="bg-white border border-zinc-200 shadow-sm rounded-md overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">#</th>
                <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">Candidate Name & Contact</th>
                <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">Applied Position</th>
                <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">Source</th>
                <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">Branch</th>
                <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">Experience</th>
                <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">Resume / CV</th>
                <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide whitespace-nowrap">Applied Date</th>
                <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide text-center whitespace-nowrap">Status</th>
                <th className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[11px]">
              {candidatesLoading ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-zinc-500 font-medium">
                    Loading candidate applications...
                  </td>
                </tr>
              ) : paginatedCandidates.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-zinc-500 font-medium">
                    No candidate applications yet — click "Sync Website API" to pull applied candidates from your connected career site(s).
                  </td>
                </tr>
              ) : (
                paginatedCandidates.map((c, idx) => (
                  <tr key={c.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                    {/* Index */}
                    <td className="py-2.5 px-3 text-zinc-500 font-semibold">
                      {(currentPage - 1) * rowsPerPage + idx + 1}
                    </td>

                    {/* Candidate Name & Contact */}
                    <td className="py-2.5 px-3 max-w-[210px]">
                      <div className="flex items-center gap-2.5">
                        <div className="relative shrink-0">
                          <img
                            src={c.avatar}
                            alt={c.name}
                            className="w-7 h-7 rounded-full object-cover border border-zinc-200 shadow-2xs"
                          />
                          <span className="w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white absolute -bottom-0.5 -right-0.5"></span>
                        </div>
                        <div className="flex flex-col leading-tight min-w-0">
                          <span className="font-bold text-zinc-800 text-[11px] hover:text-indigo-600 transition-colors cursor-pointer truncate" onClick={() => setViewingCandidate(c)}>
                            {c.name}
                          </span>
                          <span className="text-[10px] text-zinc-500 whitespace-nowrap truncate">
                            {c.email} • {c.phone}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Applied Position */}
                    <td className="py-2.5 px-3 max-w-[180px]">
                      <div className="flex flex-col">
                        <span className="font-semibold text-zinc-800 text-[11px] break-words">{c.position}</span>
                        <span className="text-[10px] text-zinc-500 truncate">{c.department}</span>
                      </div>
                    </td>

                    {/* Source */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {renderSourceBadge(c.source, c.sourceSite, c.sourceUrl)}
                    </td>

                    {/* Branch */}
                    <td className="py-2.5 px-3 text-zinc-700 font-medium whitespace-nowrap">
                      {c.branch}
                    </td>

                    {/* Experience */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="font-semibold text-zinc-800 text-[11px]">{c.experience}</span>
                      <span className="text-[10px] text-zinc-400 ml-1">({c.noticePeriod})</span>
                    </td>

                    {/* Resume / CV Download & Preview */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleDownloadCV(c)}
                          className="flex items-center gap-1.5 h-7 px-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded text-[10px] font-semibold text-zinc-700 transition-colors"
                          title="Download CV"
                        >
                          <Download className="w-3 h-3 text-zinc-500" />
                          <span>Download CV {c.cvSize}</span>
                        </button>
                        <button
                          onClick={() => setCvPreviewCandidate(c)}
                          className="p-1.5 bg-zinc-50 text-zinc-500 hover:bg-blue-50 hover:text-blue-600 border border-zinc-200 hover:border-blue-200 rounded transition-colors"
                          title="Preview CV"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Applied Date */}
                    <td className="py-2.5 px-3 text-zinc-600 text-[10px] whitespace-nowrap">
                      {c.appliedDate}
                    </td>

                    {/* Status Badge */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${STATUS_BADGE_CLASS[c.status] || 'bg-rose-50 text-rose-600 border-rose-200'
                          }`}
                      >
                        {c.statusLabel}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setViewingCandidate(c)}
                          className="p-1.5 bg-zinc-50 text-zinc-500 hover:bg-blue-50 hover:text-blue-600 border border-zinc-200 hover:border-blue-200 rounded-md transition-colors"
                          title="View Application Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.name)}
                          className="p-1.5 bg-zinc-50 text-zinc-500 hover:bg-rose-50 hover:text-rose-600 border border-zinc-200 hover:border-rose-200 rounded-md transition-colors"
                          title="Delete Application"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleForwardToAddCandidate(c)}
                          className="p-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white border border-indigo-200 hover:border-indigo-600 rounded-md transition-all duration-150 shadow-2xs group flex items-center justify-center"
                          title="Add to Candidates (Transfer Details Directly)"
                        >
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* TABLE FOOTER / PAGINATION */}
        <div className="p-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
          <div className="pl-2">
            Showing {filteredCandidates.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to{' '}
            {Math.min(currentPage * rowsPerPage, filteredCandidates.length)} of {filteredCandidates.length} entries
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 border border-zinc-200 rounded-md bg-white hover:bg-zinc-50 text-zinc-400 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-6 h-6 flex items-center justify-center border rounded-md font-semibold text-[11px] ${currentPage === page
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 border border-zinc-200 rounded-md bg-white hover:bg-zinc-50 text-zinc-400 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* CANDIDATE DETAILS MODAL */}
      {viewingCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-zinc-200 rounded-xl shadow-2xl max-w-xl w-full flex flex-col relative max-h-[92vh] overflow-hidden">

            {/* Modal Top Header Bar */}
            <div className="bg-gradient-to-r from-slate-50 via-indigo-50/20 to-white border-b border-zinc-200 px-5 py-4 flex items-start justify-between">
              <div className="flex items-start gap-3.5">
                <div className="relative shrink-0">
                  <img
                    src={viewingCandidate.avatar}
                    alt={viewingCandidate.name}
                    className="w-[70px] h-[70px] rounded-md object-cover border-2 border-white shadow-md ring-2 ring-indigo-100"
                  />
                  <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white absolute -bottom-0.5 -right-0.5 shadow-2xs"></span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-zinc-900">{viewingCandidate.name}</h2>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs ${STATUS_BADGE_CLASS[viewingCandidate.status] || 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                    >
                      ● {viewingCandidate.statusLabel}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-indigo-600 mt-0.5 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    {viewingCandidate.position} • {viewingCandidate.department}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-500 mt-1.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-zinc-200 rounded text-zinc-600 shadow-2xs">
                      <Mail className="w-3 h-3 text-zinc-400" /> {viewingCandidate.email}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-zinc-200 rounded text-zinc-600 shadow-2xs">
                      <Phone className="w-3 h-3 text-zinc-400" /> {viewingCandidate.phone}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-zinc-200 rounded text-zinc-600 shadow-2xs">
                      <MapPin className="w-3 h-3 text-zinc-400" /> {viewingCandidate.branch}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setViewingCandidate(null)}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-md hover:bg-zinc-100 border border-transparent hover:border-zinc-200 transition-colors"
                title="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body with Structured Bordered Sections */}
            <div className="p-5 space-y-3 overflow-y-auto max-h-[calc(92vh-150px)] bg-[#fafafa]">

              {/* Card 1: 4 Key Metrics Overview in a Clean Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 bg-white rounded-lg border border-zinc-200 shadow-2xs">
                  <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-bold uppercase tracking-wide">
                    <Clock className="w-3 h-3 text-indigo-500" /> Experience
                  </div>
                  <span className="font-bold text-zinc-900 text-xs mt-1 block">{viewingCandidate.experience}</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-zinc-200 shadow-2xs">
                  <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-bold uppercase tracking-wide">
                    <Calendar className="w-3 h-3 text-amber-500" /> Notice Period
                  </div>
                  <span className="font-bold text-zinc-900 text-xs mt-1 block">{viewingCandidate.noticePeriod}</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-zinc-200 shadow-2xs">
                  <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-bold uppercase tracking-wide">
                    <MapPin className="w-3 h-3 text-rose-500" /> Location
                  </div>
                  <span className="font-bold text-zinc-900 text-xs mt-1 block truncate">{viewingCandidate.branch}</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-zinc-200 shadow-2xs">
                  <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-bold uppercase tracking-wide">
                    <Globe className="w-3 h-3 text-emerald-500" /> Source
                  </div>
                  <div className="mt-1">
                    {renderSourceBadge(viewingCandidate.source || 'Career Website', viewingCandidate.sourceSite, viewingCandidate.sourceUrl)}
                  </div>
                </div>
              </div>

              {/* Card 2: Professional Summary */}
              <div className="bg-white border border-zinc-200 rounded-lg p-3 shadow-2xs">
                <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-zinc-100">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Professional Summary</h4>
                </div>
                <p className="bg-zinc-50 p-3 rounded-md border border-zinc-200/80 text-zinc-700 leading-relaxed text-[11.5px]">
                  {viewingCandidate.summary}
                </p>
              </div>

              {/* Card 3: Core Technical Skills */}
              <div className="bg-white border border-zinc-200 rounded-lg p-3 shadow-2xs">
                <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-zinc-100">
                  <Award className="w-3.5 h-3.5 text-indigo-600" />
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Core Technical Skills</h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {viewingCandidate.skills?.map((sk: string) => (
                    <span
                      key={sk}
                      className="px-2.5 py-1 bg-zinc-50 hover:bg-indigo-50 text-zinc-700 hover:text-indigo-700 rounded-md text-[11px] font-medium border border-zinc-200 hover:border-indigo-200 transition-colors shadow-2xs flex items-center gap-1"
                    >
                      <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card 4: Attached Resume & Documents */}
              <div className="bg-white border border-zinc-200 rounded-lg p-3 shadow-2xs">
                <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-zinc-100">
                  <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Attached Resume / Portfolio</h4>
                </div>
                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-md flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-md bg-rose-50 border border-rose-200 text-rose-600 font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                      PDF
                    </div>
                    <div>
                      <span className="font-bold text-zinc-800 text-xs block">{viewingCandidate.cvName}</span>
                      <span className="text-[10px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                        <span>{viewingCandidate.cvSize}</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-medium">Verified PDF</span>
                        <span>•</span>
                        <span>{viewingCandidate.appliedDate}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setCvPreviewCandidate(viewingCandidate);
                        setViewingCandidate(null);
                      }}
                      className="h-8 px-3 bg-white border border-zinc-200  hover:bg-zinc-100 hover:border-zinc-300 text-zinc-700 rounded-md text-[11px] font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-zinc-500" /> Preview CV
                    </button>
                    <button
                      onClick={() => handleDownloadCV(viewingCandidate)}
                      className="h-8 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-[11px] font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Action Bar with Clean Borders */}
            <div className="border-t border-zinc-200 bg-white px-5 py-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shadow-md">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    handleForwardToAddCandidate(viewingCandidate);
                    setViewingCandidate(null);
                  }}
                  className="h-8 px-3 bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-700/50 rounded-md text-[11px] font-semibold transition-colors shadow-2xs flex items-center gap-1.5"
                  title="Forward directly to Add Candidate form"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Add to Candidates
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                {/* Status dropdown — every real recruitment stage (see STATUS_LABELS), the same
                    vocabulary Candidate Pipeline / HOD Evaluation already use, not just the two
                    quick actions this used to offer. */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsModalStatusOpen((open) => !open)}
                    className="h-8 px-3 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 rounded-md text-[11px] font-semibold transition-colors shadow-2xs flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-indigo-600" />
                    Update Status
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                  </button>
                  {isModalStatusOpen && (
                    <div className="absolute left-0 bottom-full mb-1 w-48 bg-white border border-zinc-200 shadow-lg rounded-md py-1 z-50 max-h-64 overflow-y-auto">
                      {Object.entries(STATUS_LABELS).map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => handleUpdateStatus(viewingCandidate.id, value)}
                          className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50 text-left"
                        >
                          <span className="truncate">{label}</span>
                          {viewingCandidate.status === value && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setViewingCandidate(null)}
                className="h-8 px-4 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 rounded-md text-[11px] font-semibold transition-colors shadow-2xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CV DOCUMENT PREVIEW MODAL */}
      {cvPreviewCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-zinc-200 rounded-xl shadow-2xl max-w-2xl w-full relative max-h-[92vh] flex flex-col overflow-hidden">

            {/* CV Modal Header */}
            <div className="bg-gradient-to-r from-slate-50 to-white border-b border-zinc-200 px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-rose-50 border border-rose-200 text-rose-600 font-bold text-xs flex items-center justify-center">
                  PDF
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 text-sm">{cvPreviewCandidate.name} – CV Preview</h3>
                  <span className="text-[10px] text-zinc-400">{cvPreviewCandidate.cvName} ({cvPreviewCandidate.cvSize})</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadCV(cvPreviewCandidate)}
                  className="h-7 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[11px] font-semibold flex items-center gap-1 shadow-2xs transition-colors"
                >
                  <Download className="w-3 h-3" /> Download
                </button>
                <button
                  onClick={() => setCvPreviewCandidate(null)}
                  className="p-1 text-zinc-400 hover:text-zinc-700 rounded hover:bg-zinc-100 border border-transparent hover:border-zinc-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Simulated Document Body with Crisp Clean Borders */}
            <div className="flex-1 overflow-y-auto bg-zinc-100/70 p-5">
              <div className="bg-white border border-zinc-200 rounded-lg p-6 space-y-4 font-sans text-zinc-800 text-xs shadow-sm">

                {/* Candidate CV Top Strip */}
                <div className="border-b border-zinc-200 pb-3.5 flex items-start justify-between">
                  <div>
                    <h1 className="text-base font-bold text-zinc-900">{cvPreviewCandidate.name}</h1>
                    <p className="text-xs font-semibold text-indigo-600 mt-0.5">{cvPreviewCandidate.position}</p>
                    <p className="text-[10px] text-zinc-500 mt-1 flex items-center gap-2">
                      <span>{cvPreviewCandidate.email}</span>
                      <span>•</span>
                      <span>{cvPreviewCandidate.phone}</span>
                      <span>•</span>
                      <span>{cvPreviewCandidate.branch}</span>
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold rounded">
                    Verified Applicant
                  </span>
                </div>

                {/* Profile Summary Card */}
                <div className="border border-zinc-200 rounded-md p-3 bg-zinc-50/50">
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-indigo-600" /> Executive Profile
                  </h4>
                  <p className="text-[11px] leading-relaxed text-zinc-700">{cvPreviewCandidate.summary}</p>
                </div>

                {/* Core Competencies */}
                <div className="border border-zinc-200 rounded-md p-3 bg-zinc-50/50">
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <Award className="w-3 h-3 text-indigo-600" /> Core Competencies
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {cvPreviewCandidate.skills?.map((sk: string) => (
                      <span key={sk} className="px-2 py-0.5 bg-white border border-zinc-200 text-zinc-700 rounded text-[10px] font-semibold">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Application Metadata */}
                <div className="border border-zinc-200 rounded-md p-3 bg-zinc-50/50">
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-2">
                    Application Metadata
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <p className="p-1.5 bg-white border border-zinc-200 rounded"><span className="text-zinc-400">Application Date:</span> <strong className="text-zinc-700 ml-1">{cvPreviewCandidate.appliedDate}</strong></p>
                    <p className="p-1.5 bg-white border border-zinc-200 rounded"><span className="text-zinc-400">Notice Period:</span> <strong className="text-zinc-700 ml-1">{cvPreviewCandidate.noticePeriod}</strong></p>
                    <p className="p-1.5 bg-white border border-zinc-200 rounded"><span className="text-zinc-400">Branch Location:</span> <strong className="text-zinc-700 ml-1">{cvPreviewCandidate.branch}</strong></p>
                    <p className="p-1.5 bg-white border border-zinc-200 rounded"><span className="text-zinc-400">Inbound Source:</span> <strong className="text-indigo-600 ml-1">{cvPreviewCandidate.source ? `${cvPreviewCandidate.source} Direct Feed` : 'Website Career API'}</strong></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-zinc-200 bg-white flex justify-end">
              <button
                onClick={() => setCvPreviewCandidate(null)}
                className="h-8 px-4 border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 rounded-md text-[11px] font-semibold transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OPTION 1: CAREER WEBSITE API & WEBHOOK INTEGRATION MODAL */}
      {isSyncModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-zinc-200 rounded-xl shadow-2xl max-w-3xl w-full flex flex-col relative max-h-[94vh] overflow-hidden">

            {/* Modal Top Header with Brand Accent & Live Badge */}
            <div className="bg-gradient-to-r from-slate-50 via-indigo-50/30 to-white border-b border-zinc-200 px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-zinc-900 text-base">Career Website API & Webhook Integration</h3>
                    {isCareerSiteConnected ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Connected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-500 border border-zinc-200 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                        Not Connected
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    View your connected career site, pull candidate applications, and push job postings &amp; status updates.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSyncModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-md hover:bg-zinc-100 border border-transparent hover:border-zinc-200 transition-colors"
                title="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Top 4-Metric Live Health Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-5 py-2.5 bg-zinc-50/70 border-b border-zinc-200 text-[11px]">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${isCareerSiteConnected ? 'bg-emerald-500 ring-4 ring-emerald-100 animate-pulse' : 'bg-zinc-300'}`}></div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block">API Gateway</span>
                  <span className="font-bold text-zinc-800 text-xs">
                    {pingResult ? `${pingResult.status === 200 ? '200 OK' : pingResult.status > 0 ? `HTTP ${pingResult.status}` : 'Unreachable'}` : isCareerSiteConnected ? 'Not yet tested' : 'Not Connected'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block">Linked Website</span>
                  {careerSiteBaseUrl ? (
                    <a href={careerSiteBaseUrl} target="_blank" rel="noreferrer" className="font-bold text-indigo-600 hover:underline text-xs flex items-center gap-1 truncate max-w-[140px]">
                      {shortHostname(careerSiteBaseUrl)} <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  ) : (
                    <Link href="/dashboard/settings/integrations" className="font-bold text-zinc-500 hover:underline text-xs">
                      Connect a site &rarr;
                    </Link>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block">Total Inbound</span>
                  <span className="font-bold text-zinc-800 text-xs">{candidates.length.toLocaleString('en-IN')} Candidates</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className={`w-4 h-4 text-indigo-600 shrink-0 ${isSyncing ? 'animate-spin' : ''}`} />
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block">Sync Mode</span>
                  <span className="font-bold text-zinc-800 text-xs">Manual (Sync Website API)</span>
                </div>
              </div>
            </div>

            {/* Clean Tab Navigation Bar */}
            <div className="flex flex-wrap items-center border-b border-zinc-200 bg-white px-5 gap-1 pt-1 text-[11px] font-semibold text-zinc-600">
              <button
                onClick={() => setActiveModalTab('credentials')}
                className={`flex items-center gap-1.5 py-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${activeModalTab === 'credentials'
                  ? 'border-indigo-600 text-indigo-600 font-bold bg-indigo-50/40'
                  : 'border-transparent hover:text-zinc-900 hover:border-zinc-300'
                  }`}
              >
                <Key className="w-3.5 h-3.5" />
                API Endpoint & Keys
              </button>
              <button
                onClick={() => setActiveModalTab('fields')}
                className={`flex items-center gap-1.5 py-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${activeModalTab === 'fields'
                  ? 'border-indigo-600 text-indigo-600 font-bold bg-indigo-50/40'
                  : 'border-transparent hover:text-zinc-900 hover:border-zinc-300'
                  }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Inbound Form Schema
              </button>
              <button
                onClick={() => setActiveModalTab('snippets')}
                className={`flex items-center gap-1.5 py-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${activeModalTab === 'snippets'
                  ? 'border-indigo-600 text-indigo-600 font-bold bg-indigo-50/40'
                  : 'border-transparent hover:text-zinc-900 hover:border-zinc-300'
                  }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                Developer Code Snippets
              </button>
              <button
                onClick={() => setActiveModalTab('logs')}
                className={`flex items-center gap-1.5 py-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${activeModalTab === 'logs'
                  ? 'border-indigo-600 text-indigo-600 font-bold bg-indigo-50/40'
                  : 'border-transparent hover:text-zinc-900 hover:border-zinc-300'
                  }`}
              >
                <Activity className="w-3.5 h-3.5" />
                Live Submission Logs
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-600 border border-zinc-200">
                  {recentSyncedCandidates.length}
                </span>
              </button>
            </div>

            {/* Modal Body Container */}
            <div className="p-5 overflow-y-auto max-h-[calc(94vh-190px)] bg-[#fafafa] space-y-3.5">

              {/* TAB 1: CREDENTIALS & ENDPOINT */}
              {activeModalTab === 'credentials' && (
                <div className="space-y-3 animate-in fade-in duration-150">

                  {!primaryCareerSite ? (
                    <div className="bg-white border border-dashed border-zinc-300 rounded-lg p-5 text-center">
                      <Globe className="w-6 h-6 text-zinc-300 mx-auto mb-1.5" />
                      <h4 className="font-bold text-zinc-800 text-xs">No career site connected yet</h4>
                      <p className="text-[11px] text-zinc-500 mt-1">
                        Connect your public career website under Settings → Integrations to pull candidate applications here.
                      </p>
                      <Link
                        href="/dashboard/settings/integrations"
                        className="inline-flex items-center gap-1.5 h-8 px-3 mt-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-[11px] font-semibold transition-colors"
                      >
                        Go to Settings → Integrations <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  ) : (
                    <>
                      {/* Card 1: Connected Site */}
                      <div className="bg-white border border-zinc-200 rounded-lg p-3.5 shadow-2xs">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100">
                          <div className="flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5 text-indigo-600" />
                            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Connected Career Site</h4>
                          </div>
                          <span className="text-[10px] font-bold uppercase text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                            {primaryCareerSite.credentials?.siteKey || shortHostname(careerSiteBaseUrl)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="flex-1 flex items-center bg-zinc-50 border border-zinc-200 rounded-md overflow-hidden text-xs font-mono">
                            <span className="px-2.5 py-1.5 bg-zinc-100 border-r border-zinc-200 text-zinc-600 text-[10px] font-bold">
                              GET
                            </span>
                            <input
                              type="text"
                              readOnly
                              value={`${careerSiteBaseUrl}${primaryCareerSite.credentials?.applicationsPath || '/api/careers/integrations/applications'}`}
                              className="w-full bg-transparent px-2.5 py-1 text-zinc-800 text-[11px] outline-none font-mono selection:bg-indigo-100"
                            />
                          </div>
                          <button
                            onClick={() => copyToClipboard(`${careerSiteBaseUrl}${primaryCareerSite.credentials?.applicationsPath || '/api/careers/integrations/applications'}`, 'Applications Endpoint')}
                            className="h-8 px-3 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-md text-[11px] font-semibold text-zinc-700 flex items-center gap-1.5 shadow-2xs shrink-0 transition-colors"
                          >
                            {copiedKey === 'Applications Endpoint' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-zinc-500" />}
                            <span>{copiedKey === 'Applications Endpoint' ? 'Copied!' : 'Copy'}</span>
                          </button>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-1.5">
                          CrewCam pulls applied candidates from this website by calling this URL — there is no inbound submission endpoint on CrewCam's side. Edit the connection under Settings → Integrations.
                        </p>
                      </div>

                      {/* Card 2: API Key status */}
                      <div className="bg-white border border-zinc-200 rounded-lg p-3.5 shadow-2xs">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100">
                          <div className="flex items-center gap-1.5">
                            <Key className="w-3.5 h-3.5 text-indigo-600" />
                            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Website API Key (x-api-key header)</h4>
                          </div>
                          <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" /> Encrypted at rest
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="flex-1 flex items-center bg-zinc-50 border border-zinc-200 rounded-md overflow-hidden text-xs font-mono px-2.5 py-1 text-zinc-800">
                            <span className="truncate text-[11px]">
                              {primaryCareerSite.credentials?.apiKey ? '•••••••••••••••••••••••••••••••• (configured)' : 'Not configured'}
                            </span>
                          </div>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-1.5">
                          Issued by your website, not by CrewCam — sent as the <code className="bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded border border-zinc-200 font-mono text-[10px]">x-api-key</code> header on every pull/push call. The real value is never sent back to this screen once saved; update it under Settings → Integrations.
                        </p>
                      </div>

                      {/* Card 3: Interactive Gateway Ping */}
                      <div className="bg-white border border-zinc-200 rounded-lg p-3.5 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0">
                            <Zap className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-zinc-900 text-xs">Live Reachability Check</h4>
                            <p className="text-[10px] text-zinc-500">
                              {pingResult ? (
                                pingResult.status === 200 ? (
                                  <span className="text-emerald-700 font-semibold">
                                    ● Reachable • HTTP {pingResult.status} • Latency: {pingResult.latency}ms • Tested at {pingResult.timestamp}
                                  </span>
                                ) : (
                                  <span className="text-rose-600 font-semibold">
                                    ● {pingResult.status > 0 ? `HTTP ${pingResult.status}` : 'Unreachable'} • Tested at {pingResult.timestamp}
                                  </span>
                                )
                              ) : (
                                "Sends a real GET request from CrewCam's server to this site's jobs endpoint and times the response."
                              )}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handlePingAPI}
                          disabled={isPinging}
                          className="h-8 px-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-md text-[11px] font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors shrink-0 disabled:opacity-60"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
                          {isPinging ? (
                            <span>Pinging...</span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Zap className="w-3 h-3 text-amber-400" />
                              Test Connection Ping
                            </span>
                          )}
                        </button>
                      </div>
                    </>
                  )}

                </div>
              )}

              {/* TAB 2: APPLICATIONS RESPONSE SCHEMA */}
              {activeModalTab === 'fields' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="bg-white border border-zinc-200 rounded-lg p-3.5 shadow-2xs">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100">
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-indigo-600" />
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Fields CrewCam Reads Per Application</h4>
                      </div>
                      <span className="text-[10px] text-zinc-400">GET {primaryCareerSite?.credentials?.applicationsPath || '/api/careers/integrations/applications'}</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 mb-2">
                      Your website isn't sent anything — CrewCam calls this URL (with the <code className="bg-zinc-100 text-zinc-700 px-1 py-0.5 rounded border border-zinc-200 font-mono text-[10px]">x-api-key</code> header) and expects a JSON array shaped like this for each candidate who applied.
                    </p>

                    <div className="border border-zinc-200 rounded-md overflow-hidden text-[11px]">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] text-zinc-500 uppercase font-bold">
                          <tr>
                            <th className="py-2 px-3">Field Key</th>
                            <th className="py-2 px-3">Type</th>
                            <th className="py-2 px-3">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 text-zinc-700">
                          {[
                            ['_id', 'String', 'Application record id on the website'],
                            ['applicationId', 'String', 'Human-readable application reference'],
                            ['jobId / jobTitle', 'String', 'The job this application was submitted against'],
                            ['status', 'String', "Candidate's own progress on the public apply form"],
                            ['submittedAt', 'ISO Date', 'When the application was submitted'],
                            ['matchScore', 'Number', 'AI screening match score (0-100), if scored'],
                            ['candidate.name / email / phone', 'String', 'Primary contact details'],
                            ['candidate.location', 'String', 'Current location'],
                            ['candidate.resumeUrl / resumeFileName', 'String', 'CV file hosted on the website'],
                            ['candidate.skills / education / experience', 'Array', 'Structured resume data'],
                            ['candidate.currentCompany / currentDesignation', 'String', 'Current employment'],
                            ['candidate.totalExperience / noticePeriod', 'String', 'Experience & notice period'],
                            ['candidate.currentCTC / expectedCTC', 'String', 'Compensation details'],
                          ].map(([key, type, desc]) => (
                            <tr key={key} className="hover:bg-zinc-50/60">
                              <td className="py-2 px-3 font-mono font-bold text-indigo-600">{key}</td>
                              <td className="py-2 px-3">{type}</td>
                              <td className="py-2 px-3">{desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Schema Preview / Copy Card */}
                  <div className="bg-white border border-zinc-200 rounded-lg p-3.5 shadow-2xs">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100">
                      <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Sample Response Shape</h4>
                      <button
                        onClick={() => {
                          const jsonSample = JSON.stringify({
                            success: true,
                            count: 1,
                            data: [{
                              _id: '...', applicationId: 'APP-1024', jobId: '...', jobTitle: 'Senior Full Stack Developer',
                              status: 'SUBMITTED', submittedAt: '2026-10-20T10:15:00.000Z', matchScore: 82,
                              candidate: {
                                name: 'Rohit Sharma', email: 'rohit.s@gmail.com', phone: '+91 9876543210',
                                location: 'New Delhi', resumeUrl: 'https://.../Rohit_Sharma_CV.pdf',
                                resumeFileName: 'Rohit_Sharma_CV.pdf', skills: ['Node.js', 'React'],
                                totalExperience: '4.5 Yrs', noticePeriod: '15 Days',
                              },
                            }],
                          }, null, 2);
                          copyToClipboard(jsonSample, 'JSON Schema');
                        }}
                        className="h-6 px-2 bg-zinc-100 hover:bg-zinc-200 rounded text-[10px] font-semibold text-zinc-700 flex items-center gap-1 transition-colors"
                      >
                        <Copy className="w-3 h-3" /> Copy JSON
                      </button>
                    </div>
                    <pre className="p-3 bg-zinc-900 text-zinc-200 rounded-md font-mono text-[10.5px] overflow-x-auto leading-relaxed">
                      {`{
  "success": true,
  "count": 1,
  "data": [{
    "applicationId": "APP-1024",
    "jobTitle": "Senior Full Stack Developer",
    "status": "SUBMITTED",
    "submittedAt": "2026-10-20T10:15:00.000Z",
    "matchScore": 82,
    "candidate": {
      "name": "Rohit Sharma",
      "email": "rohit.s@gmail.com",
      "phone": "+91 9876543210",
      "location": "New Delhi",
      "resumeUrl": "https://.../Rohit_Sharma_CV.pdf",
      "skills": ["Node.js", "React"],
      "totalExperience": "4.5 Yrs",
      "noticePeriod": "15 Days"
    }
  }]
}`}
                    </pre>
                  </div>
                </div>
              )}

              {/* TAB 3: DEVELOPER CODE SNIPPETS */}
              {activeModalTab === 'snippets' && (() => {
                const base = careerSiteBaseUrl || 'https://your-career-site.example.com';
                const applicationsPath = primaryCareerSite?.credentials?.applicationsPath || '/api/careers/integrations/applications';
                const jobsPath = primaryCareerSite?.credentials?.jobsPath || '/api/careers/jobs';
                const postPath = primaryCareerSite?.credentials?.postPath || '/api/careers/integrations/jobs';
                const snippets: Record<typeof codeTab, string> = {
                  pull: `# What CrewCam's backend runs to pull applied candidates from your site\ncurl -X GET "${base}${applicationsPath}" \\\n  -H "x-api-key: YOUR_WEBSITE_API_KEY"\n\n# Supports ?since=<ISO date> to fetch only what changed since the last sync.\n# Your website must implement this route and return the shape shown in the\n# "Inbound Form Schema" tab. Triggered by "Sync Website API" / "Trigger Instant Sync Now".`,
                  'push-status': `# What CrewCam's backend runs when a candidate's HR status changes here\ncurl -X PATCH "${base}${applicationsPath}/:applicationId/status" \\\n  -H "x-api-key: YOUR_WEBSITE_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{ "hrStatus": "SHORTLISTED" }'\n\n# Keeps the candidate's recruitment-stage status in sync on your website\n# whenever it changes in CrewCam. Fired automatically — no manual step needed.`,
                  'push-job': `# What CrewCam's backend runs when you post a job to this site\ncurl -X POST "${base}${postPath}" \\\n  -H "x-api-key: YOUR_WEBSITE_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "title": "Senior Full Stack Developer",\n    "department": "Engineering",\n    "location": "Head Office - New Delhi",\n    "status": "OPEN"\n  }'\n\n# Your website should upsert on CrewCam's job id (sent as "_id" on updates)\n# so re-sending the same job updates it instead of duplicating it.\n# CrewCam reads jobs back the same way it reads applications: GET ${base}${jobsPath}`,
                };
                return (
                  <div className="space-y-3 animate-in fade-in duration-150">
                    <div className="bg-white border border-zinc-200 rounded-lg p-3.5 shadow-2xs">

                      {/* Call Switcher Bar */}
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100 flex-wrap gap-2">
                        <div className="flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5 text-indigo-600" />
                          <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Real Server-to-Server Calls</h4>
                        </div>
                        <div className="flex items-center gap-1 flex-wrap">
                          <button
                            onClick={() => setCodeTab('pull')}
                            className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors ${codeTab === 'pull' ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                              }`}
                          >
                            Pull Applications
                          </button>
                          <button
                            onClick={() => setCodeTab('push-status')}
                            className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors ${codeTab === 'push-status' ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                              }`}
                          >
                            Push Status Update
                          </button>
                          <button
                            onClick={() => setCodeTab('push-job')}
                            className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors ${codeTab === 'push-job' ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                              }`}
                          >
                            Post Job
                          </button>
                        </div>
                      </div>
                      <p className="text-[10px] text-zinc-500 mb-2">
                        These three calls are the entire integration — all made by CrewCam's own backend, not by code running on your website. There is no front-end form, submission endpoint, or client-side SDK to install.
                      </p>

                      {/* Code Container */}
                      <div className="relative">
                        <pre className="p-3.5 bg-zinc-900 text-zinc-100 rounded-lg font-mono text-[10.5px] overflow-x-auto leading-relaxed border border-zinc-800">
                          {snippets[codeTab]}
                        </pre>
                        <button
                          onClick={() => copyToClipboard(snippets[codeTab], `${codeTab} snippet`)}
                          className="absolute top-2.5 right-2.5 px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-[10px] font-semibold border border-zinc-700 transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <Copy className="w-3 h-3" /> Copy Snippet
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* TAB 4: RECENT SYNCED CANDIDATES */}
              {activeModalTab === 'logs' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="bg-white border border-zinc-200 rounded-lg p-3.5 shadow-2xs">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100">
                      <div className="flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-indigo-600" />
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Recently Synced Candidates</h4>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-medium">From your connected career site(s)</span>
                    </div>

                    <div className="border border-zinc-200 rounded-md overflow-hidden text-[11px]">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] text-zinc-500 uppercase font-bold">
                          <tr>
                            <th className="py-2 px-2.5">Candidate Name</th>
                            <th className="py-2 px-2.5">Position</th>
                            <th className="py-2 px-2.5">Applied</th>
                            <th className="py-2 px-2.5 text-center">Status</th>
                            <th className="py-2 px-2.5 text-center">Record</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 text-zinc-700">
                          {recentSyncedCandidates.length === 0 && (
                            <tr>
                              <td colSpan={5} className="py-6 text-center text-zinc-400">
                                No candidates synced from a career site yet.
                              </td>
                            </tr>
                          )}
                          {recentSyncedCandidates.map((c: any) => (
                            <tr key={c.id} className="hover:bg-zinc-50/70 transition-colors">
                              <td className="py-2 px-2.5 font-bold text-zinc-800 text-[11px] whitespace-nowrap">{c.name}</td>
                              <td className="py-2 px-2.5 text-zinc-600 text-[11px] truncate max-w-[150px]">{c.position}</td>
                              <td className="py-2 px-2.5 text-[10px] text-zinc-500 whitespace-nowrap">{c.appliedDate}</td>
                              <td className="py-2 px-2.5 text-center whitespace-nowrap">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  {c.statusLabel}
                                </span>
                              </td>
                              <td className="py-2 px-2.5 text-center whitespace-nowrap">
                                <button
                                  onClick={() => setInspectCandidate(c)}
                                  className="h-6 px-2 bg-white hover:bg-zinc-50 border border-zinc-200 rounded text-[10px] font-semibold text-indigo-600 shadow-2xs transition-colors"
                                >
                                  Inspect JSON
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Inspect real candidate record */}
                  {inspectCandidate && (
                    <div className="bg-white border border-zinc-200 rounded-lg p-3.5 shadow-2xs border-l-4 border-l-indigo-600 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100">
                        <div className="flex items-center gap-2">
                          <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                          <h4 className="text-[11px] font-bold text-zinc-800">
                            Candidate Record: {inspectCandidate.name}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => copyToClipboard(JSON.stringify(inspectCandidate._raw || inspectCandidate, null, 2), 'Candidate Record')}
                            className="h-6 px-2 bg-zinc-100 hover:bg-zinc-200 rounded text-[10px] font-semibold text-zinc-700 flex items-center gap-1 transition-colors"
                          >
                            <Copy className="w-3 h-3" /> Copy JSON
                          </button>
                          <button
                            onClick={() => setInspectCandidate(null)}
                            className="p-1 text-zinc-400 hover:text-zinc-700 rounded transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <pre className="p-3 bg-zinc-900 text-emerald-400 rounded-md font-mono text-[10.5px] overflow-x-auto leading-relaxed">
                        {JSON.stringify(inspectCandidate._raw || inspectCandidate, null, 2)}
                      </pre>
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* Modal Bottom Action Bar with Clean Borders */}
            <div className="border-t border-zinc-200 bg-white px-5 py-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shadow-md">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSyncAPI}
                  disabled={isSyncing}
                  className="h-8 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-[11px] font-semibold flex items-center gap-1.5 shadow-2xs transition-colors disabled:opacity-75"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Synchronizing API...' : 'Trigger Instant Sync Now'}</span>
                </button>
                <button
                  onClick={handlePingAPI}
                  disabled={isPinging}
                  className="h-8 px-3 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 rounded-md text-[11px] font-semibold flex items-center gap-1.5 shadow-2xs transition-colors disabled:opacity-75"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isPinging ? 'Pinging...' : 'Ping Gateway'}</span>
                </button>
              </div>
              <button
                onClick={() => setIsSyncModalOpen(false)}
                className="h-8 px-4 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 rounded-md text-[11px] font-semibold transition-colors shadow-2xs"
              >
                Close & Return
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
