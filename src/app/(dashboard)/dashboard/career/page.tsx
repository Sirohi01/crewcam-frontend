'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  Download, Plus, Search, ChevronDown, Check, Eye, Trash2,
  Building2, Users, MapPin, Briefcase, Globe, Copy, ExternalLink,
  FileText, ShieldCheck, Clock, RefreshCw, X, ChevronLeft, ChevronRight,
  Filter, CheckCircle2, FileCheck, Phone, Mail, Award, Calendar,
  Key, Code2, Server, EyeOff, Radio, Terminal, Activity, Zap, Lock, Database,
  Cpu, Layers, CheckCircle, ArrowRight, UserPlus
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

// Reusable Source Badge Renderer
const renderSourceBadge = (source?: string) => {
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
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
          <WebsiteIcon className="w-3 h-3 shrink-0 text-purple-600" />
          Career Website
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

// Initial realistic candidate submissions matching the approved UI mockup
const INITIAL_CANDIDATES = [
  {
    id: 'cand-001',
    name: 'Rohit Sharma',
    email: 'rohit.s@gmail.com',
    phone: '+91 9876543210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    position: 'Senior Full Stack Developer',
    department: 'Engineering / IT',
    branch: 'Delhi HQ',
    experience: '4.5 Yrs',
    noticePeriod: '15d Notice',
    cvName: 'Rohit_Sharma_CV.pdf',
    cvSize: '1.4MB',
    appliedDate: '15 Sep 2026, 10:45 AM',
    status: 'New',
    source: 'LinkedIn',
    summary: 'Experienced MERN stack developer with 4.5 years of experience in React, Node.js, Next.js and high-scale enterprise systems.',
    skills: ['React.js', 'Next.js', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'Docker'],
  },
  {
    id: 'cand-002',
    name: 'Pooja Verma',
    email: 'pooja.v@outlook.com',
    phone: '+91 9811234567',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    position: 'UI/UX Product Designer',
    department: 'Design & Product',
    branch: 'Noida Branch',
    experience: '3.2 Yrs',
    noticePeriod: 'Immediate',
    cvName: 'Pooja_Verma_Portfolio.pdf',
    cvSize: '2.1MB',
    appliedDate: '15 Sep 2026, 09:30 AM',
    status: 'Shortlisted',
    source: 'Naukri.com',
    summary: 'Product designer specialized in SaaS design systems, user journeys, Figma prototypes, and micro-interactions.',
    skills: ['Figma', 'Design Systems', 'UX Research', 'Prototyping', 'Design Tokens'],
  },
  {
    id: 'cand-003',
    name: 'Aman Gupta',
    email: 'aman.g@gmail.com',
    phone: '+91 9988776655',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    position: 'HR Operations Executive',
    department: 'Human Resources',
    branch: 'Delhi HQ',
    experience: '2.0 Yrs',
    noticePeriod: '30d Notice',
    cvName: 'Aman_Gupta_Resume.pdf',
    cvSize: '1.1MB',
    appliedDate: '14 Sep 2026, 04:15 PM',
    status: 'Shortlisted',
    source: 'Apna',
    summary: 'Human Resources specialist handling end-to-end recruitment lifecycle, employee onboarding, and HRMS records.',
    skills: ['HR Operations', 'Talent Acquisition', 'Payroll Assist', 'Onboarding', 'Compliance'],
  },
  {
    id: 'cand-004',
    name: 'Neha Singh',
    email: 'neha.s@yahoo.com',
    phone: '+91 9712345678',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    position: 'Accounts & Finance Manager',
    department: 'Accounts & Finance',
    branch: 'Gurugram Branch',
    experience: '6.0 Yrs',
    noticePeriod: '15d Notice',
    cvName: 'Neha_Singh_Finance_CV.pdf',
    cvSize: '1.6MB',
    appliedDate: '14 Sep 2026, 02:00 PM',
    status: 'Under Review',
    source: 'Indeed',
    summary: 'Chartered accountant with 6 years experience managing corporate audits, GST compliance, balance sheets and forecasting.',
    skills: ['Corporate Finance', 'GST / TDS', 'Tally Prime', 'Budgeting', 'Auditing'],
  },
  {
    id: 'cand-005',
    name: 'Vikram Malhotra',
    email: 'vikram.m@gmail.com',
    phone: '+91 9823456789',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    position: 'Branch Operations Lead',
    department: 'Operations',
    branch: 'Delhi HQ',
    experience: '5.5 Yrs',
    noticePeriod: 'Immediate',
    cvName: 'Vikram_Malhotra_CV.pdf',
    cvSize: '1.5MB',
    appliedDate: '14 Sep 2026, 11:20 AM',
    status: 'Shortlisted',
    source: 'LinkedIn',
    summary: 'Operations lead managing branch logistics, staff coordination, performance KPI tracking and resource allocation.',
    skills: ['Branch Management', 'Process Optimization', 'Team Leadership', 'Vendor Management'],
  },
  {
    id: 'cand-006',
    name: 'Sneha Sen',
    email: 'sneha.sen@gmail.com',
    phone: '+91 9123456789',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    position: 'Frontend React Developer',
    department: 'Engineering / IT',
    branch: 'Noida Branch',
    experience: '1.8 Yrs',
    noticePeriod: 'Immediate',
    cvName: 'Sneha_Sen_Resume.pdf',
    cvSize: '950KB',
    appliedDate: '13 Sep 2026, 03:10 PM',
    status: 'New',
    source: 'Naukri.com',
    summary: 'Junior frontend developer building responsive web applications using React, TailwindCSS and REST APIs.',
    skills: ['React.js', 'JavaScript ES6', 'TailwindCSS', 'Git', 'HTML5/CSS3'],
  },
  {
    id: 'cand-007',
    name: 'Karan Mehra',
    email: 'karan.m@gmail.com',
    phone: '+91 9898012345',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    position: 'Content & Social Media Strategist',
    department: 'Marketing',
    branch: 'Delhi HQ',
    experience: '3.0 Yrs',
    noticePeriod: '15d Notice',
    cvName: 'Karan_Mehra_CV.pdf',
    cvSize: '1.2MB',
    appliedDate: '13 Sep 2026, 11:05 AM',
    status: 'Under Review',
    source: 'Apna',
    summary: 'Content strategist managing SEO copy, LinkedIn campaigns, digital marketing, and employer branding.',
    skills: ['Content Writing', 'SEO', 'Brand Strategy', 'LinkedIn Ads', 'Copywriting'],
  },
  {
    id: 'cand-008',
    name: 'Tanya Khurana',
    email: 'tanya.k@gmail.com',
    phone: '+91 9871122334',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    position: 'Social Media & Community Manager',
    department: 'Marketing',
    branch: 'Noida Branch',
    experience: '2.5 Yrs',
    noticePeriod: '15d Notice',
    cvName: 'Tanya_Khurana_Portfolio.pdf',
    cvSize: '2.4MB',
    appliedDate: '15 Sep 2026, 01:15 PM',
    status: 'New',
    source: 'Instagram',
    summary: 'Creative social media lead driving influencer campaigns, viral Reels, community moderation, and employer storytelling.',
    skills: ['Instagram Growth', 'Short-form Video', 'Community Management', 'Canva Pro', 'Copywriting'],
  },
  {
    id: 'cand-009',
    name: 'Rajesh Kumar',
    email: 'rajesh.devops@outlook.com',
    phone: '+91 9845012345',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    position: 'DevOps & Cloud Engineer',
    department: 'Engineering / IT',
    branch: 'Delhi HQ',
    experience: '4.8 Yrs',
    noticePeriod: 'Immediate',
    cvName: 'Rajesh_Kumar_DevOps_CV.pdf',
    cvSize: '1.8MB',
    appliedDate: '14 Sep 2026, 06:40 PM',
    status: 'Shortlisted',
    source: 'Telegram',
    summary: 'Cloud infrastructure engineer specialized in Kubernetes, Docker, Terraform, CI/CD pipelines, and AWS production hosting.',
    skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'GitHub Actions', 'Linux'],
  },
  {
    id: 'cand-010',
    name: 'Priya Deshmukh',
    email: 'priya.deshmukh@gmail.com',
    phone: '+91 9920145678',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    position: 'Performance Marketing Specialist',
    department: 'Marketing',
    branch: 'Gurugram Branch',
    experience: '3.5 Yrs',
    noticePeriod: '30d Notice',
    cvName: 'Priya_Deshmukh_Resume.pdf',
    cvSize: '1.3MB',
    appliedDate: '14 Sep 2026, 03:25 PM',
    status: 'New',
    source: 'Facebook',
    summary: 'Performance marketing specialist experienced in Meta Ad Manager, audience segmentation, CPL optimization, and analytics.',
    skills: ['Meta Ads', 'Lead Generation', 'Google Analytics 4', 'A/B Testing', 'ROAS Optimization'],
  },
  {
    id: 'cand-011',
    name: 'Aditya Joshi',
    email: 'aditya.joshi@techcorp.io',
    phone: '+91 9765432109',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    position: 'Senior Backend Engineer (Node/Go)',
    department: 'Engineering / IT',
    branch: 'Delhi HQ',
    experience: '5.0 Yrs',
    noticePeriod: 'Immediate',
    cvName: 'Aditya_Joshi_Senior_Backend_CV.pdf',
    cvSize: '1.7MB',
    appliedDate: '15 Sep 2026, 11:50 AM',
    status: 'Shortlisted',
    source: 'Career Website',
    summary: 'High-concurrency backend developer with 5 years building microservices, Redis caching, Kafka message queues and PostgreSQL.',
    skills: ['Node.js', 'Go', 'PostgreSQL', 'Redis', 'Kafka', 'System Architecture'],
  }
];

const COMPANIES = [
  'Namo Gange Wellness Pvt Ltd',
  'Encodency Pvt Ltd',
  'Arogya Peeth Foundation'
];

const BRANCHES = [
  'Head Office - New Delhi',
  'Noida Branch - Sector 62',
  'Gurugram Branch - Cyber City',
  'Mumbai Branch - Andheri'
];

export default function CareerPage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [branchFilter, setBranchFilter] = useState('All Branches');
  const [positionFilter, setPositionFilter] = useState('All Positions');
  const [sourceFilter, setSourceFilter] = useState('All Sources');

  const [selectedCompany, setSelectedCompany] = useState(COMPANIES[0]);
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0]);

  // Dropdown toggles
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const [isBranchOpen, setIsBranchOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isBranchFilterOpen, setIsBranchFilterOpen] = useState(false);
  const [isPosFilterOpen, setIsPosFilterOpen] = useState(false);
  const [isSourceFilterOpen, setIsSourceFilterOpen] = useState(false);

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
  const [codeTab, setCodeTab] = useState<'js' | 'react' | 'curl' | 'html' | 'php'>('js');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<{ status: number; latency: number; timestamp: string } | null>({
    status: 200,
    latency: 38,
    timestamp: 'Just now',
  });
  const [selectedLogPayload, setSelectedLogPayload] = useState<any | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live incoming API submission logs
  const [apiLogs, setApiLogs] = useState([
    {
      id: 'LOG-8921',
      timestamp: '15 Sep 2026, 15:38:12',
      candidate: 'Rohit Sharma',
      position: 'Senior Full Stack Developer',
      endpoint: '/v1/career/namo-gange/submit-application',
      method: 'POST',
      status: 201,
      latency: '142ms',
      ip: '103.25.14.88',
      origin: 'namogangewellness.com',
      payload: {
        name: 'Rohit Sharma',
        email: 'rohit.s@gmail.com',
        phone: '+91 9876543210',
        position: 'Senior Full Stack Developer',
        branch: 'Head Office - New Delhi',
        experience: '4.5 Yrs',
        noticePeriod: '15 Days',
        resumeFileName: 'Rohit_Sharma_CV.pdf',
        resumeFileSize: '1.4MB'
      }
    },
    {
      id: 'LOG-8920',
      timestamp: '15 Sep 2026, 14:15:04',
      candidate: 'Pooja Verma',
      position: 'UI/UX Product Designer',
      endpoint: '/v1/career/namo-gange/submit-application',
      method: 'POST',
      status: 201,
      latency: '118ms',
      ip: '182.72.65.12',
      origin: 'namogangewellness.com',
      payload: {
        name: 'Pooja Verma',
        email: 'pooja.v@outlook.com',
        phone: '+91 9811234567',
        position: 'UI/UX Product Designer',
        branch: 'Noida Branch - Sector 62',
        experience: '3.2 Yrs',
        noticePeriod: 'Immediate',
        resumeFileName: 'Pooja_Verma_Portfolio.pdf',
        resumeFileSize: '2.1MB'
      }
    },
    {
      id: 'LOG-8919',
      timestamp: '15 Sep 2026, 11:22:45',
      candidate: 'Aman Gupta',
      position: 'HR Operations Executive',
      endpoint: '/v1/career/namo-gange/submit-application',
      method: 'POST',
      status: 201,
      latency: '165ms',
      ip: '122.161.45.90',
      origin: 'namogangewellness.com',
      payload: {
        name: 'Aman Gupta',
        email: 'aman.g@gmail.com',
        phone: '+91 9988776655',
        position: 'HR Operations Executive',
        branch: 'Head Office - New Delhi',
        experience: '2.0 Yrs',
        noticePeriod: '30 Days',
        resumeFileName: 'Aman_Gupta_Resume.pdf',
        resumeFileSize: '980KB'
      }
    },
    {
      id: 'LOG-8918',
      timestamp: '15 Sep 2026, 09:40:19',
      candidate: 'Neha Singh',
      position: 'Client Wellness Consultant',
      endpoint: '/v1/career/namo-gange/submit-application',
      method: 'POST',
      status: 201,
      latency: '130ms',
      ip: '157.34.198.54',
      origin: 'namogangewellness.com',
      payload: {
        name: 'Neha Singh',
        email: 'neha.singh@gmail.com',
        phone: '+91 9711882233',
        position: 'Client Wellness Consultant',
        branch: 'Gurugram Branch - Cyber City',
        experience: '5.0 Yrs',
        noticePeriod: 'Immediate',
        resumeFileName: 'Neha_Singh_CV.pdf',
        resumeFileSize: '1.8MB'
      }
    },
    {
      id: 'LOG-8917',
      timestamp: '14 Sep 2026, 18:50:33',
      candidate: 'Vikram Malhotra',
      position: 'Accounts & Audit Officer',
      endpoint: '/v1/career/namo-gange/submit-application',
      method: 'POST',
      status: 201,
      latency: '155ms',
      ip: '49.36.120.10',
      origin: 'namogangewellness.com',
      payload: {
        name: 'Vikram Malhotra',
        email: 'vikram.m@rediffmail.com',
        phone: '+91 9899112244',
        position: 'Accounts & Audit Officer',
        branch: 'Mumbai Branch - Andheri',
        experience: '6.0 Yrs',
        noticePeriod: '60 Days',
        resumeFileName: 'Vikram_Malhotra_Resume.pdf',
        resumeFileSize: '2.4MB'
      }
    },
  ]);

  const filterRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
    toast.success(`${label} copied to clipboard!`);
  };

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
  const statusOptions = ['All Status', 'New', 'Shortlisted', 'Under Review'];
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
    if (appliedFilters.status !== 'All Status' && c.status !== appliedFilters.status) return false;
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
    setCandidates((prev) => prev.filter((c) => c.id !== id));
    toast.success(`Application for ${name} removed`);
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
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    if (viewingCandidate && viewingCandidate.id === id) {
      setViewingCandidate({ ...viewingCandidate, status: newStatus });
    }
    toast.success(`Candidate status updated to "${newStatus}"`);
  };

  const copyPortalLink = () => {
    navigator.clipboard.writeText('https://namogangewellness.com/careers');
    toast.success('Career Portal URL copied to clipboard!');
  };

  const handleSyncAPI = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const newCand = {
        id: `cand-${Date.now().toString().slice(-4)}`,
        name: 'Arjun Singhal',
        email: 'arjun.s@gmail.com',
        phone: '+91 9810987654',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        position: 'Backend Node.js Developer',
        department: 'Engineering / IT',
        branch: 'Head Office - New Delhi',
        experience: '3.8 Yrs',
        noticePeriod: '30d Notice',
        cvName: 'Arjun_Singhal_CV.pdf',
        cvSize: '1.2MB',
        appliedDate: 'Just now',
        status: 'New',
        source: 'LinkedIn',
        summary: 'Specialized in microservices architecture, RESTful API design, database indexing, and Redis caching.',
        skills: ['Node.js', 'Express', 'MongoDB', 'Redis', 'Docker', 'REST APIs'],
      };
      setCandidates((prev) => [newCand, ...prev]);
      toast.success('Successfully synchronized! 1 new inbound candidate fetched from LinkedIn Job Apply.');
    }, 1000);
  };

  const handlePingAPI = () => {
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
      const latency = Math.floor(Math.random() * 20) + 32;
      setPingResult({
        status: 200,
        latency,
        timestamp: new Date().toLocaleTimeString(),
      });
      toast.success(`Gateway Healthy! Responded in ${latency}ms (200 OK)`);
    }, 650);
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
    toast.success(`Downloading ${c.cvName} (${c.cvSize})...`);
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredCandidates.length / rowsPerPage));
  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Derived KPI Stats & Multi-Platform Hiring Channels Distribution
  const totalApplications = 1248; // Total tracked across portal
  const newSubmissionsCount = 42;
  const resumesReceivedCount = 1190;

  // Channel Distribution Counts
  const websiteCount = 512;
  const linkedinCount = 482;
  const naukriCount = 395;
  const apnaCount = 214;
  const indeedCount = 157;
  const facebookCount = 126;
  const instagramCount = 98;
  const telegramCount = 64;

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
                    <span className="truncate">{selectedCompany}</span>
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                </button>
                {isCompanyOpen && (
                  <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-zinc-200 shadow-lg rounded-md py-1 z-50">
                    {COMPANIES.map((comp) => (
                      <button
                        key={comp}
                        onClick={() => {
                          setSelectedCompany(comp);
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
                    <span className="truncate">{selectedBranch}</span>
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                </button>
                {isBranchOpen && (
                  <div className="absolute left-0 top-full mt-1 w-72 bg-white border border-zinc-200 shadow-lg rounded-md py-1 z-50">
                    {BRANCHES.map((br) => (
                      <button
                        key={br}
                        onClick={() => {
                          setSelectedBranch(br);
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
            <span className="text-zinc-600 font-mono text-[11px] flex items-center gap-1">
              <Globe className="w-3 h-3 text-indigo-600 shrink-0" />
              https://namogangewellness.com/careers
            </span>
            <button
              onClick={copyPortalLink}
              className="h-6 px-2 bg-white border border-zinc-200 rounded text-[10px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors flex items-center gap-1 shadow-2xs"
            >
              <Copy className="w-3 h-3" /> Copy Link
            </button>
            <a
              href="https://namogangewellness.com/careers"
              target="_blank"
              rel="noopener noreferrer"
              className="h-6 px-2 bg-white border border-zinc-200 rounded text-[10px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors flex items-center gap-1 shadow-2xs"
            >
              <ExternalLink className="w-3 h-3" /> Open Site
            </a>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Connected API
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
              {paginatedCandidates.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-zinc-500 font-medium">
                    No candidate applications match the selected criteria.
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
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="relative shrink-0">
                          <img
                            src={c.avatar}
                            alt={c.name}
                            className="w-7 h-7 rounded-full object-cover border border-zinc-200 shadow-2xs"
                          />
                          <span className="w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white absolute -bottom-0.5 -right-0.5"></span>
                        </div>
                        <div className="flex flex-col leading-tight">
                          <span className="font-bold text-zinc-800 text-[11px] hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => setViewingCandidate(c)}>
                            {c.name}
                          </span>
                          <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                            {c.email} • {c.phone}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Applied Position */}
                    <td className="py-2.5 px-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-zinc-800 text-[11px] whitespace-nowrap">{c.position}</span>
                        <span className="text-[10px] text-zinc-500">{c.department}</span>
                      </div>
                    </td>

                    {/* Source */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {renderSourceBadge(c.source)}
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
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${c.status === 'New'
                          ? 'bg-sky-50 text-sky-600 border-sky-200'
                          : c.status === 'Shortlisted'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                            : c.status === 'Under Review'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-rose-50 text-rose-600 border-rose-200'
                          }`}
                      >
                        {c.status}
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
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs ${viewingCandidate.status === 'New'
                        ? 'bg-sky-50 text-sky-700 border-sky-200'
                        : viewingCandidate.status === 'Shortlisted'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : viewingCandidate.status === 'Under Review'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                    >
                      ● {viewingCandidate.status}
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
                    {renderSourceBadge(viewingCandidate.source || 'Career Website')}
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
                <button
                  onClick={() => handleUpdateStatus(viewingCandidate.id, 'Shortlisted')}
                  className="h-8 px-3 bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700/50 rounded-md text-[11px] font-semibold transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Shortlist
                </button>
                <button
                  onClick={() => handleUpdateStatus(viewingCandidate.id, 'Under Review')}
                  className="h-8 px-3 bg-amber-500 hover:bg-amber-600 text-white border border-amber-600/50 rounded-md text-[11px] font-semibold transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5" />
                  Under Review
                </button>
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
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      API v1.2 Live Connected
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Connect public website career form, manage security tokens, verify field mappings & monitor inbound submissions.
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
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 animate-pulse shrink-0"></div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block">API Gateway</span>
                  <span className="font-bold text-zinc-800 text-xs">200 OK (Active)</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block">Linked Website</span>
                  <a href="https://namogangewellness.com/careers" target="_blank" rel="noreferrer" className="font-bold text-indigo-600 hover:underline text-xs flex items-center gap-1 truncate max-w-[140px]">
                    namogangewellness.com <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block">Total Inbound</span>
                  <span className="font-bold text-zinc-800 text-xs">1,248 Candidates</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className={`w-4 h-4 text-emerald-600 shrink-0 ${isSyncing ? 'animate-spin' : ''}`} />
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block">Auto-Sync Mode</span>
                  <span className="font-bold text-emerald-700 text-xs">Every 5m (Listening)</span>
                </div>
              </div>
            </div>

            {/* Clean Tab Navigation Bar */}
            <div className="flex items-center border-b border-zinc-200 bg-white px-5 gap-1 pt-1 overflow-x-auto text-[11px] font-semibold text-zinc-600">
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
                  {apiLogs.length}
                </span>
              </button>
            </div>

            {/* Modal Body Container */}
            <div className="p-5 overflow-y-auto max-h-[calc(94vh-190px)] bg-[#fafafa] space-y-3.5">

              {/* TAB 1: CREDENTIALS & ENDPOINT */}
              {activeModalTab === 'credentials' && (
                <div className="space-y-3 animate-in fade-in duration-150">

                  {/* Card 1: REST API Endpoint */}
                  <div className="bg-white border border-zinc-200 rounded-lg p-3.5 shadow-2xs">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100">
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-indigo-600" />
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">REST API Submission Endpoint</h4>
                      </div>
                      <span className="text-[10px] font-bold uppercase text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                        POST (multipart/form-data)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="flex-1 flex items-center bg-zinc-50 border border-zinc-200 rounded-md overflow-hidden text-xs font-mono">
                        <span className="px-2.5 py-1.5 bg-zinc-100 border-r border-zinc-200 text-zinc-600 text-[10px] font-bold">
                          POST
                        </span>
                        <input
                          type="text"
                          readOnly
                          value="https://api.crewcam.com/v1/career/namo-gange/submit-application"
                          className="w-full bg-transparent px-2.5 py-1 text-zinc-800 text-[11px] outline-none font-mono selection:bg-indigo-100"
                        />
                      </div>
                      <button
                        onClick={() => copyToClipboard('https://api.crewcam.com/v1/career/namo-gange/submit-application', 'API Endpoint')}
                        className="h-8 px-3 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-md text-[11px] font-semibold text-zinc-700 flex items-center gap-1.5 shadow-2xs shrink-0 transition-colors"
                      >
                        {copiedKey === 'API Endpoint' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-zinc-500" />}
                        <span>{copiedKey === 'API Endpoint' ? 'Copied!' : 'Copy Endpoint'}</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-1.5">
                      Point your public website career page form action directly to this URL. Submissions are parsed and indexed immediately in real-time.
                    </p>
                  </div>

                  {/* Card 2: Bearer Secret Token */}
                  <div className="bg-white border border-zinc-200 rounded-lg p-3.5 shadow-2xs">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100">
                      <div className="flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-indigo-600" />
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Portal Secret Key (Bearer Authorization Token)</h4>
                      </div>
                      <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> AES-256 Encrypted
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="flex-1 flex items-center bg-zinc-50 border border-zinc-200 rounded-md overflow-hidden text-xs font-mono px-2.5 py-1 text-zinc-800">
                        <span className="truncate text-[11px]">
                          {showApiKey ? 'cc_live_9f83a8b27c6e11409d784a9e22b01c59' : '••••••••••••••••••••••••••••••••••••••••••••'}
                        </span>
                      </div>
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="h-8 px-2.5 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-md text-[11px] font-semibold text-zinc-700 flex items-center gap-1 shadow-2xs shrink-0 transition-colors"
                        title={showApiKey ? 'Hide Secret Key' : 'Show Secret Key'}
                      >
                        {showApiKey ? <EyeOff className="w-3.5 h-3.5 text-zinc-500" /> : <Eye className="w-3.5 h-3.5 text-zinc-500" />}
                        <span>{showApiKey ? 'Hide' : 'Show'}</span>
                      </button>
                      <button
                        onClick={() => copyToClipboard('cc_live_9f83a8b27c6e11409d784a9e22b01c59', 'Secret API Key')}
                        className="h-8 px-3 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-md text-[11px] font-semibold text-zinc-700 flex items-center gap-1.5 shadow-2xs shrink-0 transition-colors"
                      >
                        {copiedKey === 'Secret API Key' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-zinc-500" />}
                        <span>{copiedKey === 'Secret API Key' ? 'Copied!' : 'Copy Key'}</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-1.5">
                      Include header: <code className="bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded border border-zinc-200 font-mono text-[10px]">Authorization: Bearer cc_live_...</code> on every POST submission.
                    </p>
                  </div>

                  {/* Card 3: Webhook HMAC Signature Secret */}
                  <div className="bg-white border border-zinc-200 rounded-lg p-3.5 shadow-2xs">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100">
                      <div className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-indigo-600" />
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Webhook HMAC Signature Secret</h4>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono">HMAC-SHA256</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="flex-1 flex items-center bg-zinc-50 border border-zinc-200 rounded-md overflow-hidden text-xs font-mono px-2.5 py-1 text-zinc-800">
                        <span className="truncate text-[11px]">
                          {showWebhookSecret ? 'whsec_8849bca74e2d398f01a742e917d4' : '••••••••••••••••••••••••••••••••'}
                        </span>
                      </div>
                      <button
                        onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                        className="h-8 px-2.5 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-md text-[11px] font-semibold text-zinc-700 flex items-center gap-1 shadow-2xs shrink-0 transition-colors"
                      >
                        {showWebhookSecret ? <EyeOff className="w-3.5 h-3.5 text-zinc-500" /> : <Eye className="w-3.5 h-3.5 text-zinc-500" />}
                        <span>{showWebhookSecret ? 'Hide' : 'Show'}</span>
                      </button>
                      <button
                        onClick={() => copyToClipboard('whsec_8849bca74e2d398f01a742e917d4', 'Webhook Secret')}
                        className="h-8 px-3 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-md text-[11px] font-semibold text-zinc-700 flex items-center gap-1.5 shadow-2xs shrink-0 transition-colors"
                      >
                        {copiedKey === 'Webhook Secret' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-zinc-500" />}
                        <span>{copiedKey === 'Webhook Secret' ? 'Copied!' : 'Copy Secret'}</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-1.5">
                      Verify inbound payloads from your website backend using the header <code className="bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded border border-zinc-200 font-mono text-[10px]">X-CrewCam-Signature</code>.
                    </p>
                  </div>

                  {/* Card 4: Allowed Origins & Security Guardrails */}
                  <div className="bg-white border border-zinc-200 rounded-lg p-3.5 shadow-2xs">
                    <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-zinc-100">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                      <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">CORS Whitelist & Safeguards</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                      <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-md">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase block">Allowed Origin Domains</span>
                        <span className="font-mono text-[11px] text-indigo-700 font-semibold block mt-0.5 truncate">
                          *.namogangewellness.com
                        </span>
                      </div>
                      <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-md">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase block">Rate Limiting</span>
                        <span className="font-semibold text-zinc-800 block mt-0.5">
                          60 submissions / min / IP
                        </span>
                      </div>
                      <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-md">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase block">CV File Restrictions</span>
                        <span className="font-semibold text-zinc-800 block mt-0.5">
                          PDF, DOCX (Max 10 MB)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card 5: Interactive Gateway Ping */}
                  <div className="bg-white border border-zinc-200 rounded-lg p-3.5 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-900 text-xs">Live API Gateway Health Diagnostic</h4>
                        <p className="text-[10px] text-zinc-500">
                          {pingResult ? (
                            <span className="text-emerald-700 font-semibold">
                              ● Connected • Status {pingResult.status} OK • Latency: {pingResult.latency}ms • Tested at {pingResult.timestamp}
                            </span>
                          ) : (
                            'Test direct latency and reachability from your browser to the ATS inbound router.'
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
                        <span>Pinging Gateway...</span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-400" />
                          Test Connection Ping
                        </span>
                      )}
                    </button>
                  </div>

                </div>
              )}

              {/* TAB 2: INBOUND FORM SCHEMA & FIELD MAPPING */}
              {activeModalTab === 'fields' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="bg-white border border-zinc-200 rounded-lg p-3.5 shadow-2xs">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100">
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-indigo-600" />
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Expected Form Keys & Data Types</h4>
                      </div>
                      <span className="text-[10px] text-zinc-400">Content-Type: multipart/form-data</span>
                    </div>

                    <div className="border border-zinc-200 rounded-md overflow-hidden text-[11px]">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] text-zinc-500 uppercase font-bold">
                          <tr>
                            <th className="py-2 px-3">Field Key</th>
                            <th className="py-2 px-3">Type</th>
                            <th className="py-2 px-3">Requirement</th>
                            <th className="py-2 px-3">Allowed Formats</th>
                            <th className="py-2 px-3">Description</th>
                            <th className="py-2 px-3">Sample Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 text-zinc-700">
                          <tr className="hover:bg-zinc-50/60">
                            <td className="py-2 px-3 font-mono font-bold text-indigo-600">name</td>
                            <td className="py-2 px-3">String</td>
                            <td className="py-2 px-3"><span className="text-rose-600 font-bold text-[10px]">Required</span></td>
                            <td className="py-2 px-3">Text (2 - 80 chars)</td>
                            <td className="py-2 px-3">Full legal name of candidate</td>
                            <td className="py-2 px-3 font-mono text-[10px] text-zinc-500">"Rohit Sharma"</td>
                          </tr>
                          <tr className="hover:bg-zinc-50/60">
                            <td className="py-2 px-3 font-mono font-bold text-indigo-600">email</td>
                            <td className="py-2 px-3">Email</td>
                            <td className="py-2 px-3"><span className="text-rose-600 font-bold text-[10px]">Required</span></td>
                            <td className="py-2 px-3">Valid RFC 5322 Email</td>
                            <td className="py-2 px-3">Primary candidate contact email</td>
                            <td className="py-2 px-3 font-mono text-[10px] text-zinc-500">"rohit.s@gmail.com"</td>
                          </tr>
                          <tr className="hover:bg-zinc-50/60">
                            <td className="py-2 px-3 font-mono font-bold text-indigo-600">phone</td>
                            <td className="py-2 px-3">String</td>
                            <td className="py-2 px-3"><span className="text-rose-600 font-bold text-[10px]">Required</span></td>
                            <td className="py-2 px-3">10-15 Digits (+Country)</td>
                            <td className="py-2 px-3">Contact mobile phone number</td>
                            <td className="py-2 px-3 font-mono text-[10px] text-zinc-500">"+91 9876543210"</td>
                          </tr>
                          <tr className="hover:bg-zinc-50/60">
                            <td className="py-2 px-3 font-mono font-bold text-indigo-600">position</td>
                            <td className="py-2 px-3">String</td>
                            <td className="py-2 px-3"><span className="text-rose-600 font-bold text-[10px]">Required</span></td>
                            <td className="py-2 px-3">Role Title</td>
                            <td className="py-2 px-3">Applied position title</td>
                            <td className="py-2 px-3 font-mono text-[10px] text-zinc-500">"Senior Full Stack Developer"</td>
                          </tr>
                          <tr className="hover:bg-zinc-50/60">
                            <td className="py-2 px-3 font-mono font-bold text-indigo-600">branch</td>
                            <td className="py-2 px-3">String</td>
                            <td className="py-2 px-3"><span className="text-zinc-400 font-semibold text-[10px]">Optional</span></td>
                            <td className="py-2 px-3">Branch Name or ID</td>
                            <td className="py-2 px-3">Preferred company work branch</td>
                            <td className="py-2 px-3 font-mono text-[10px] text-zinc-500">"Head Office - New Delhi"</td>
                          </tr>
                          <tr className="hover:bg-zinc-50/60">
                            <td className="py-2 px-3 font-mono font-bold text-indigo-600">experience</td>
                            <td className="py-2 px-3">String</td>
                            <td className="py-2 px-3"><span className="text-zinc-400 font-semibold text-[10px]">Optional</span></td>
                            <td className="py-2 px-3">Years/Months string</td>
                            <td className="py-2 px-3">Total work experience</td>
                            <td className="py-2 px-3 font-mono text-[10px] text-zinc-500">"4.5 Yrs"</td>
                          </tr>
                          <tr className="hover:bg-zinc-50/60">
                            <td className="py-2 px-3 font-mono font-bold text-indigo-600">noticePeriod</td>
                            <td className="py-2 px-3">String</td>
                            <td className="py-2 px-3"><span className="text-zinc-400 font-semibold text-[10px]">Optional</span></td>
                            <td className="py-2 px-3">Duration string</td>
                            <td className="py-2 px-3">Notice period required to join</td>
                            <td className="py-2 px-3 font-mono text-[10px] text-zinc-500">"15 Days"</td>
                          </tr>
                          <tr className="hover:bg-zinc-50/60">
                            <td className="py-2 px-3 font-mono font-bold text-indigo-600">resume</td>
                            <td className="py-2 px-3">Binary File</td>
                            <td className="py-2 px-3"><span className="text-rose-600 font-bold text-[10px]">Required</span></td>
                            <td className="py-2 px-3">.pdf, .doc, .docx (≤10MB)</td>
                            <td className="py-2 px-3">Candidate Resume / CV file</td>
                            <td className="py-2 px-3 font-mono text-[10px] text-zinc-500">"Rohit_Sharma_CV.pdf"</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Schema Preview / Copy Card */}
                  <div className="bg-white border border-zinc-200 rounded-lg p-3.5 shadow-2xs">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100">
                      <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Sample JSON Representation</h4>
                      <button
                        onClick={() => {
                          const jsonSample = JSON.stringify({
                            name: "Rohit Sharma",
                            email: "rohit.s@gmail.com",
                            phone: "+91 9876543210",
                            position: "Senior Full Stack Developer",
                            branch: "Head Office - New Delhi",
                            experience: "4.5 Yrs",
                            noticePeriod: "15 Days",
                            resume: "<binary multipart data>"
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
  "name": "Rohit Sharma",
  "email": "rohit.s@gmail.com",
  "phone": "+91 9876543210",
  "position": "Senior Full Stack Developer",
  "branch": "Head Office - New Delhi",
  "experience": "4.5 Yrs",
  "noticePeriod": "15 Days",
  "resume": "(binary file: application/pdf)"
}`}
                    </pre>
                  </div>
                </div>
              )}

              {/* TAB 3: DEVELOPER CODE SNIPPETS */}
              {activeModalTab === 'snippets' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="bg-white border border-zinc-200 rounded-lg p-3.5 shadow-2xs">

                    {/* Language Switcher Bar */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100">
                      <div className="flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-indigo-600" />
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Select Implementation Language</h4>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setCodeTab('js')}
                          className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors ${codeTab === 'js' ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                            }`}
                        >
                          JavaScript (Fetch)
                        </button>
                        <button
                          onClick={() => setCodeTab('react')}
                          className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors ${codeTab === 'react' ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                            }`}
                        >
                          React / Next.js
                        </button>
                        <button
                          onClick={() => setCodeTab('curl')}
                          className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors ${codeTab === 'curl' ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                            }`}
                        >
                          cURL
                        </button>
                        <button
                          onClick={() => setCodeTab('html')}
                          className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors ${codeTab === 'html' ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                            }`}
                        >
                          HTML Form
                        </button>
                        <button
                          onClick={() => setCodeTab('php')}
                          className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors ${codeTab === 'php' ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                            }`}
                        >
                          PHP / WordPress
                        </button>
                      </div>
                    </div>

                    {/* Code Container */}
                    <div className="relative">
                      <pre className="p-3.5 bg-zinc-900 text-zinc-100 rounded-lg font-mono text-[10.5px] overflow-x-auto leading-relaxed border border-zinc-800">
                        {codeTab === 'js' && `// Client-side or Node.js JavaScript Submission
const formElement = document.querySelector('#career-portal-form');
const resumeFileInput = document.querySelector('#resume-file-input');

const formData = new FormData();
formData.append('name', formElement.name.value);
formData.append('email', formElement.email.value);
formData.append('phone', formElement.phone.value);
formData.append('position', formElement.position.value);
formData.append('branch', 'Head Office - New Delhi');
formData.append('experience', '4.5 Yrs');
formData.append('noticePeriod', '15 Days');
formData.append('resume', resumeFileInput.files[0]);

const response = await fetch('https://api.crewcam.com/v1/career/namo-gange/submit-application', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer cc_live_9f83a8b27c6e11409d784a9e22b01c59'
  },
  body: formData
});

const result = await response.json();
console.log('Application Submitted Successfully:', result);`}

                        {codeTab === 'react' && `// Next.js / React Handler with Axios
import axios from 'axios';

export async function submitCareerApplication(candidateData: any, file: File) {
  const data = new FormData();
  data.append('name', candidateData.name);
  data.append('email', candidateData.email);
  data.append('phone', candidateData.phone);
  data.append('position', candidateData.position);
  data.append('branch', candidateData.branch || 'Head Office - New Delhi');
  data.append('resume', file);

  const res = await axios.post(
    'https://api.crewcam.com/v1/career/namo-gange/submit-application',
    data,
    {
      headers: {
        'Authorization': 'Bearer cc_live_9f83a8b27c6e11409d784a9e22b01c59',
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return res.data;
}`}

                        {codeTab === 'curl' && `# cURL CLI Test Command
curl -X POST https://api.crewcam.com/v1/career/namo-gange/submit-application \\
  -H "Authorization: Bearer cc_live_9f83a8b27c6e11409d784a9e22b01c59" \\
  -F "name=Rohit Sharma" \\
  -F "email=rohit.s@gmail.com" \\
  -F "phone=+919876543210" \\
  -F "position=Senior Full Stack Developer" \\
  -F "branch=Head Office - New Delhi" \\
  -F "experience=4.5 Yrs" \\
  -F "noticePeriod=15 Days" \\
  -F "resume=@/path/to/Rohit_Sharma_CV.pdf"`}

                        {codeTab === 'html' && `<!-- Plain HTML5 Career Submission Form -->
<form action="https://api.crewcam.com/v1/career/namo-gange/submit-application" method="POST" enctype="multipart/form-data">
  <!-- Note: When submitting via HTML form action directly, authorize via API reverse proxy or CORS server -->
  <input type="text" name="name" placeholder="Full Name" required />
  <input type="email" name="email" placeholder="Email Address" required />
  <input type="tel" name="phone" placeholder="Phone Number" required />
  <input type="text" name="position" value="Senior Full Stack Developer" required />
  <input type="text" name="branch" value="Head Office - New Delhi" />
  <input type="file" name="resume" accept=".pdf,.docx" required />
  
  <button type="submit">Submit Career Application</button>
</form>`}

                        {codeTab === 'php' && `<?php
// WordPress Functions.php or Custom PHP Endpoint
$apiUrl = 'https://api.crewcam.com/v1/career/namo-gange/submit-application';
$apiToken = 'cc_live_9f83a8b27c6e11409d784a9e22b01c59';

$cFile = new CURLFile($_FILES['resume']['tmp_name'], $_FILES['resume']['type'], $_FILES['resume']['name']);

$postData = [
  'name'         => sanitize_text_field($_POST['name']),
  'email'        => sanitize_email($_POST['email']),
  'phone'        => sanitize_text_field($_POST['phone']),
  'position'     => sanitize_text_field($_POST['position']),
  'branch'       => sanitize_text_field($_POST['branch']),
  'resume'       => $cFile
];

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  'Authorization: Bearer ' . $apiToken
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
?>`}
                      </pre>
                      <button
                        onClick={() => {
                          const snippets: Record<string, string> = {
                            js: `const formElement = document.querySelector('#career-portal-form');\nconst resumeFileInput = document.querySelector('#resume-file-input');\n\nconst formData = new FormData();\nformData.append('name', formElement.name.value);\nformData.append('email', formElement.email.value);\nformData.append('phone', formElement.phone.value);\nformData.append('position', formElement.position.value);\nformData.append('branch', 'Head Office - New Delhi');\nformData.append('experience', '4.5 Yrs');\nformData.append('noticePeriod', '15 Days');\nformData.append('resume', resumeFileInput.files[0]);\n\nconst response = await fetch('https://api.crewcam.com/v1/career/namo-gange/submit-application', {\n  method: 'POST',\n  headers: { 'Authorization': 'Bearer cc_live_9f83a8b27c6e11409d784a9e22b01c59' },\n  body: formData\n});\nconst result = await response.json();`,
                            react: `import axios from 'axios';\n\nexport async function submitCareerApplication(candidateData: any, file: File) {\n  const data = new FormData();\n  data.append('name', candidateData.name);\n  data.append('email', candidateData.email);\n  data.append('phone', candidateData.phone);\n  data.append('position', candidateData.position);\n  data.append('branch', candidateData.branch || 'Head Office - New Delhi');\n  data.append('resume', file);\n\n  const res = await axios.post(\n    'https://api.crewcam.com/v1/career/namo-gange/submit-application',\n    data,\n    { headers: { 'Authorization': 'Bearer cc_live_9f83a8b27c6e11409d784a9e22b01c59', 'Content-Type': 'multipart/form-data' } }\n  );\n  return res.data;\n}`,
                            curl: `curl -X POST https://api.crewcam.com/v1/career/namo-gange/submit-application \\\n  -H "Authorization: Bearer cc_live_9f83a8b27c6e11409d784a9e22b01c59" \\\n  -F "name=Rohit Sharma" \\\n  -F "email=rohit.s@gmail.com" \\\n  -F "phone=+919876543210" \\\n  -F "position=Senior Full Stack Developer" \\\n  -F "branch=Head Office - New Delhi" \\\n  -F "experience=4.5 Yrs" \\\n  -F "noticePeriod=15 Days" \\\n  -F "resume=@/path/to/Rohit_Sharma_CV.pdf"`,
                            html: `<form action="https://api.crewcam.com/v1/career/namo-gange/submit-application" method="POST" enctype="multipart/form-data">\n  <input type="text" name="name" placeholder="Full Name" required />\n  <input type="email" name="email" placeholder="Email Address" required />\n  <input type="tel" name="phone" placeholder="Phone Number" required />\n  <input type="text" name="position" value="Senior Full Stack Developer" required />\n  <input type="text" name="branch" value="Head Office - New Delhi" />\n  <input type="file" name="resume" accept=".pdf,.docx" required />\n  <button type="submit">Submit Career Application</button>\n</form>`,
                            php: `<?php\n$apiUrl = 'https://api.crewcam.com/v1/career/namo-gange/submit-application';\n$apiToken = 'cc_live_9f83a8b27c6e11409d784a9e22b01c59';\n\n$cFile = new CURLFile($_FILES['resume']['tmp_name'], $_FILES['resume']['type'], $_FILES['resume']['name']);\n\n$postData = [\n  'name'         => sanitize_text_field($_POST['name']),\n  'email'        => sanitize_email($_POST['email']),\n  'phone'        => sanitize_text_field($_POST['phone']),\n  'position'     => sanitize_text_field($_POST['position']),\n  'branch'       => sanitize_text_field($_POST['branch']),\n  'resume'       => $cFile\n];\n\n$ch = curl_init($apiUrl);\ncurl_setopt($ch, CURLOPT_POST, 1);\ncurl_setopt($ch, CURLOPT_POSTFIELDS, $postData);\ncurl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . $apiToken]);\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\n$response = curl_exec($ch);\ncurl_close($ch);\n?>`
                          };
                          copyToClipboard(snippets[codeTab], `${codeTab.toUpperCase()} Code Snippet`);
                        }}
                        className="absolute top-2.5 right-2.5 px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-[10px] font-semibold border border-zinc-700 transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <Copy className="w-3 h-3" /> Copy Snippet
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: LIVE WEBHOOK & SUBMISSION AUDIT LOGS */}
              {activeModalTab === 'logs' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="bg-white border border-zinc-200 rounded-lg p-3.5 shadow-2xs">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100">
                      <div className="flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-indigo-600" />
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Recent Inbound API Calls</h4>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-medium">Real-time HTTP 201 Logs</span>
                    </div>

                    <div className="border border-zinc-200 rounded-md overflow-hidden text-[11px]">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] text-zinc-500 uppercase font-bold">
                          <tr>
                            <th className="py-2 px-2.5">Log ID</th>
                            <th className="py-2 px-2.5">Timestamp</th>
                            <th className="py-2 px-2.5">Candidate Name</th>
                            <th className="py-2 px-2.5">Position</th>
                            <th className="py-2 px-2.5 text-center">Status</th>
                            <th className="py-2 px-2.5">Latency</th>
                            <th className="py-2 px-2.5">Client IP</th>
                            <th className="py-2 px-2.5 text-center">Payload</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 text-zinc-700">
                          {apiLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-zinc-50/70 transition-colors">
                              <td className="py-2 px-2.5 font-mono text-[10px] text-zinc-500 font-semibold">{log.id}</td>
                              <td className="py-2 px-2.5 text-[10px] text-zinc-500 whitespace-nowrap">{log.timestamp}</td>
                              <td className="py-2 px-2.5 font-bold text-zinc-800 text-[11px] whitespace-nowrap">{log.candidate}</td>
                              <td className="py-2 px-2.5 text-zinc-600 text-[11px] truncate max-w-[150px]">{log.position}</td>
                              <td className="py-2 px-2.5 text-center whitespace-nowrap">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  201 Created
                                </span>
                              </td>
                              <td className="py-2 px-2.5 font-mono text-[10px] text-zinc-500">{log.latency}</td>
                              <td className="py-2 px-2.5 font-mono text-[10px] text-zinc-500">{log.ip}</td>
                              <td className="py-2 px-2.5 text-center whitespace-nowrap">
                                <button
                                  onClick={() => setSelectedLogPayload(log)}
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

                  {/* Selected Log Payload Modal / Inspector */}
                  {selectedLogPayload && (
                    <div className="bg-white border border-zinc-200 rounded-lg p-3.5 shadow-2xs border-l-4 border-l-indigo-600 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100">
                        <div className="flex items-center gap-2">
                          <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                          <h4 className="text-[11px] font-bold text-zinc-800">
                            Payload Inspector: {selectedLogPayload.id} ({selectedLogPayload.candidate})
                          </h4>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => copyToClipboard(JSON.stringify(selectedLogPayload.payload, null, 2), 'Log Payload')}
                            className="h-6 px-2 bg-zinc-100 hover:bg-zinc-200 rounded text-[10px] font-semibold text-zinc-700 flex items-center gap-1 transition-colors"
                          >
                            <Copy className="w-3 h-3" /> Copy JSON
                          </button>
                          <button
                            onClick={() => setSelectedLogPayload(null)}
                            className="p-1 text-zinc-400 hover:text-zinc-700 rounded transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <pre className="p-3 bg-zinc-900 text-emerald-400 rounded-md font-mono text-[10.5px] overflow-x-auto leading-relaxed">
                        {JSON.stringify(selectedLogPayload.payload, null, 2)}
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
