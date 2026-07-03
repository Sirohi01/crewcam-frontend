'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  UserRound, Users, Landmark, GraduationCap, Briefcase, FileText, Sparkles, Package,
  HeartPulse, MoreHorizontal, Camera, Mail, Phone, MapPin, CalendarDays, CheckCircle2,
  Eye, EyeOff, Pencil, Award, Building2, IndianRupee, TrendingUp, CalendarCheck, Star,
  Plus, Loader2, LucideIcon, Download, Laptop, ShieldCheck, Clock, AlertTriangle, Search,
  MoreVertical, UploadCloud, ChevronLeft, ChevronRight, Headset, Info, ChevronDown,
  Trash2, BarChart3, BadgeCheck, Target, Rocket,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import moment from 'moment';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { EducationTab } from './components/EducationTab';
import { ExperienceTab } from './components/ExperienceTab';

type TabKey = 'personal' | 'family' | 'bank' | 'education' | 'experience' | 'documents' | 'skills' | 'assets' | 'emergency' | 'more';

const TABS: { key: TabKey; label: string; icon: LucideIcon }[] = [
  { key: 'personal', label: 'Personal Info', icon: UserRound },
  { key: 'family', label: 'Family Details', icon: Users },
  { key: 'bank', label: 'Bank Details', icon: Landmark },
  { key: 'education', label: 'Education', icon: GraduationCap },
  { key: 'experience', label: 'Experience', icon: Briefcase },
  { key: 'documents', label: 'Documents', icon: FileText },
  { key: 'skills', label: 'Skills', icon: Sparkles },
  { key: 'assets', label: 'Assets', icon: Package },
  { key: 'emergency', label: 'Emergency', icon: HeartPulse },
  { key: 'more', label: 'More Info', icon: MoreHorizontal },
];

// Sample/demo values for sections the backend doesn't persist yet (family, bank,
// education, experience, skills, documents, assets) — display-only, not editable.
const DUMMY = {
  photo: 'https://randomuser.me/api/portraits/men/32.jpg',
  firstName: 'Rohan',
  lastName: 'Mehta',
  employeeCode: 'EMP10234',
  designation: 'Executive - Sales',
  email: 'rohan.mehta@crewcam.com',
  phone: '+91 98765 43210',
  dateOfJoining: '15 Mar 2023',
  branch: 'Noida Office',
  reportingManager: { name: 'Amit Kumar', designation: 'Sales Manager', photo: 'https://randomuser.me/api/portraits/men/45.jpg' },
  dateOfBirth: '12 Aug 1996 (27 Yrs)',
  panNumber: 'ABCDE1234F',
  aadhaarNumber: '123412341234',
  gender: 'Male',
  maritalStatus: 'Single',
  bloodGroup: 'B+',
  nationality: 'Indian',
  totalExperience: '5 Yrs 3 Mths',
  ctc: '8,50,000',
  nextIncrement: '01 Jan 2027',
  managerPhoto: '',
  family: [
    { name: 'Neha', relation: 'Sister', dob: '18 Feb 1993', occupation: 'Software Engineer' },
    { name: 'Rajesh', relation: 'Father', dob: '10 Jan 1965', occupation: 'Business' },
    { name: 'Sushma', relation: 'Mother', dob: '12 Mar 1968', occupation: 'Homemaker' },
  ],
  bank: { name: 'HDFC Bank', accountNumber: '5010 XXXX 5678 90', ifsc: 'HDFC0001234', type: 'Savings Account', branch: 'Sector 18 Branch', primary: 'Yes' },
  education: [
    { qualification: 'MBA (Marketing)', institute: 'Symbiosis Pune', year: '2021', pct: '78.60%' },
    { qualification: 'BBA', institute: 'Delhi University', year: '2018', pct: '72.30%' },
    { qualification: '12th (CBSE)', institute: 'Kendriya Vidyalaya', year: '2015', pct: '81.20%' },
    { qualification: '10th (CBSE)', institute: 'Kendriya Vidyalaya', year: '2013', pct: '85.60%' },
  ],
  experience: [
    { company: 'XYZ Solutions Pvt. Ltd.', designation: 'Sales Executive', duration: '1 Yr 6 Mths', ctc: '3,25,000', lastDrawn: '24,500' },
    { company: 'ABC Technologies', designation: 'Sales Associate', duration: '1 Yr 2 Mths', ctc: '2,40,000', lastDrawn: '18,000' },
    { company: 'Global Services', designation: 'Trainee - Sales', duration: '6 Mths', ctc: '1,80,000', lastDrawn: '15,000' },
  ],
  skills: [
    { name: 'Communication', pct: 90 },
    { name: 'Sales & Negotiation', pct: 85 },
    { name: 'CRM (Salesforce)', pct: 80 },
    { name: 'MS Office', pct: 75 },
    { name: 'Team Collaboration', pct: 70 },
  ],
  assets: [
    { name: 'Laptop - Dell Latitude', tag: 'AST-1042', allocatedOn: '15 Mar 2023' },
    { name: 'ID Card', tag: 'AST-1043', allocatedOn: '15 Mar 2023' },
  ],
  emergency: { name: 'Anjali Mehta', relation: 'Spouse', number: '+91 90000 11223' },
};

const DOC_CATEGORY_STYLE: Record<string, string> = {
  'Identity Proof': 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Education': 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'Experience': 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'Bank Details': 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  'Address Proof': 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  'Other Documents': 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
};

const DOC_STATS = { total: 24, verified: 18, pending: 3, expiring: 2 };

const DOC_CATEGORIES = [
  { name: 'Identity Proof', count: 6 },
  { name: 'Education', count: 5 },
  { name: 'Experience', count: 4 },
  { name: 'Bank Details', count: 2 },
  { name: 'Address Proof', count: 3 },
  { name: 'Other Documents', count: 4 },
];

const DOC_GUIDELINES = [
  'Upload clear and legible documents',
  'Accepted formats: PDF, JPG, PNG',
  'Maximum file size: 5 MB',
  'All documents are securely encrypted',
  'Contact HR if you need any help',
];

const DOC_LIST = [
  { name: 'Aadhaar Card.pdf', category: 'Identity Proof', uploadedOn: '20 May 2025', expiry: '-', status: 'Verified' },
  { name: 'PAN Card.pdf', category: 'Identity Proof', uploadedOn: '20 May 2025', expiry: '-', status: 'Verified' },
  { name: 'Driving License.pdf', category: 'Identity Proof', uploadedOn: '18 May 2025', expiry: '17 May 2035', status: 'Verified' },
  { name: 'Passport.pdf', category: 'Identity Proof', uploadedOn: '18 May 2025', expiry: '02 Aug 2031', status: 'Pending' },
  { name: '10th Marksheet.pdf', category: 'Education', uploadedOn: '15 May 2025', expiry: '-', status: 'Verified' },
  { name: '12th Marksheet.pdf', category: 'Education', uploadedOn: '15 May 2025', expiry: '-', status: 'Verified' },
  { name: 'Graduation Certificate.pdf', category: 'Education', uploadedOn: '16 May 2025', expiry: '-', status: 'Verified' },
  { name: 'Experience Letter - ABC Pvt Ltd.pdf', category: 'Experience', uploadedOn: '10 May 2025', expiry: '-', status: 'Verified' },
  { name: 'Experience Letter - XYZ Corp.pdf', category: 'Experience', uploadedOn: '10 May 2025', expiry: '-', status: 'Verified' },
  { name: 'Bank Statement (Apr 2025).pdf', category: 'Bank Details', uploadedOn: '12 May 2025', expiry: '-', status: 'Verified' },
];

const SKILL_CATEGORY_STYLE: Record<string, { badge: string; color: string }> = {
  'Core Skill': { badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', color: '#22c55e' },
  'Soft Skill': { badge: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', color: '#a855f7' },
  'Technical Skill': { badge: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', color: '#3b82f6' },
};

const SKILL_STATS = { total: 12, core: 7, avgProficiency: 78, certifications: 4 };

const SKILL_LIST = [
  { name: 'Sales Strategy', category: 'Core Skill', pct: 90, updated: '20 May 2025' },
  { name: 'Client Relationship Management', category: 'Core Skill', pct: 85, updated: '18 May 2025' },
  { name: 'Business Development', category: 'Core Skill', pct: 80, updated: '18 May 2025' },
  { name: 'Negotiation', category: 'Core Skill', pct: 75, updated: '15 May 2025' },
  { name: 'Communication', category: 'Soft Skill', pct: 85, updated: '15 May 2025' },
  { name: 'Presentation', category: 'Soft Skill', pct: 80, updated: '12 May 2025' },
  { name: 'Team Leadership', category: 'Soft Skill', pct: 70, updated: '12 May 2025' },
  { name: 'CRM Software (Salesforce)', category: 'Technical Skill', pct: 75, updated: '10 May 2025' },
  { name: 'Microsoft Excel', category: 'Technical Skill', pct: 80, updated: '10 May 2025' },
  { name: 'Data Analysis', category: 'Technical Skill', pct: 65, updated: '08 May 2025' },
];

const SKILL_CATEGORY_BREAKDOWN = [
  { name: 'Core Skills', count: 7, pct: 58, color: '#22c55e' },
  { name: 'Soft Skills', count: 3, pct: 25, color: '#a855f7' },
  { name: 'Technical Skills', count: 2, pct: 17, color: '#3b82f6' },
];

const TOP_SKILLS = [
  { name: 'Sales Strategy', pct: 90 },
  { name: 'Client Relationship Management', pct: 85 },
  { name: 'Communication', pct: 85 },
  { name: 'Microsoft Excel', pct: 80 },
  { name: 'Business Development', pct: 80 },
];

const SKILL_CERTIFICATIONS = [
  { name: 'Salesforce Administrator', issued: '15 Feb 2024' },
  { name: 'Advanced Excel Certification', issued: '10 Dec 2023' },
  { name: 'Effective Communication Specialist', issued: '05 Aug 2023' },
  { name: 'Negotiation Skills Professional', issued: '12 Jun 2023' },
];

function InfoField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-[10.5px] text-zinc-400">{label}</p>
      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mt-0.5 truncate">{value ?? '—'}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="text-xs text-zinc-500 dark:text-zinc-400 shrink-0">{label}</span>
      <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 text-right truncate">{value ?? '—'}</span>
    </div>
  );
}

function StatTile({ icon: Icon, bg, color, label, value, sub }: {
  icon: LucideIcon; bg: string; color: string; label: string; value: string; sub?: string;
}) {
  return (
    <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800">
      <CardContent className="p-2.5 flex items-center gap-2.5">
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
          <Icon size={15} className={color} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wide">{label}</p>
          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate">{value}</p>
          {sub && <p className="text-[10px] text-zinc-400 truncate">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function RatingStars({ value }: { value: number | null }) {
  if (value === null) return <span className="text-base font-bold text-zinc-400">—</span>;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={14} className={i <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-zinc-200 dark:text-zinc-700'} />
      ))}
      <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 ml-1.5">{value.toFixed(1)}/5</span>
    </div>
  );
}

function SimpleTable({ columns, rows, addLabel, onAdd }: {
  columns: string[]; rows: React.ReactNode[][]; addLabel: string; onAdd: () => void;
}) {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800">
              {columns.map(c => (
                <th key={c} className="h-7 px-2 text-left align-middle text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-zinc-50 dark:border-zinc-800/50 last:border-0">
                {row.map((cell, j) => (
                  <td key={j} className="px-2 py-1.5 align-middle text-xs font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={onAdd} className="mt-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1">
        <Plus size={12} /> {addLabel}
      </button>
    </>
  );
}

function SkillBars({ skills, columns = 1 }: { skills: { name: string; pct: number }[]; columns?: 1 | 2 }) {
  return (
    <div className={columns === 2 ? 'grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3' : 'flex flex-col gap-2.5'}>
      {skills.map(s => (
        <div key={s.name}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{s.name}</span>
            <span className="text-[10.5px] text-zinc-400">{s.pct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div className="h-full rounded-full bg-indigo-500" style={{ width: `${s.pct}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfileSummaryCard({ employee, tenure, comingSoon, className }: {
  employee: any; tenure: { years: number; months: number } | null; comingSoon: (what: string) => () => void; className?: string;
}) {
  return (
    <Card className={`border-zinc-200/70 shadow-sm dark:border-zinc-800 ${className || ''}`}>
      <CardContent className="p-5 flex flex-col items-center text-center">
        <div className="relative">
          <img src={employee?.profilePictureUrl || DUMMY.photo} alt="" className="h-24 w-24 rounded-full object-cover border-4 border-zinc-100 dark:border-zinc-800" />
          <button onClick={comingSoon('Photo upload')} className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800">
            <Camera size={12} className="text-zinc-600 dark:text-zinc-300" />
          </button>
        </div>
        <div className="flex items-center gap-1.5 mt-3">
          <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{employee?.firstName || DUMMY.firstName} {employee?.lastName || DUMMY.lastName}</p>
          <CheckCircle2 size={14} className="text-emerald-500" />
        </div>
        <p className="text-xs text-zinc-500 mt-0.5">{employee?.employeeCode || DUMMY.employeeCode}</p>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">{employee?.designationId?.name || DUMMY.designation}</p>
        <span className={`mt-2 inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${employee?.isActive ?? true ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${employee?.isActive ?? true ? 'bg-emerald-500' : 'bg-zinc-400'}`} /> {(employee?.isActive ?? true) ? 'Active' : 'Inactive'}
        </span>

        <div className="w-full flex flex-col gap-2.5 mt-4 text-left">
          <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
            <Mail size={13} className="text-zinc-400 shrink-0" /> <span className="truncate">{employee?.email || DUMMY.email}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
            <Phone size={13} className="text-zinc-400 shrink-0" /> {employee?.mobileNumber || DUMMY.phone}
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
            <CalendarDays size={13} className="text-zinc-400 shrink-0" />
            <span>{employee?.dateOfJoining ? moment(employee.dateOfJoining).format('DD MMM YYYY') : DUMMY.dateOfJoining}{tenure && ` · ${tenure.years} Yrs ${tenure.months} Mths`}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
            <MapPin size={13} className="text-zinc-400 shrink-0" /> {employee?.branchId?.name || DUMMY.branch}
          </div>
        </div>

        <div className="w-full flex items-center gap-2 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-left">
          {employee?.reportingToId ? (
            <>
              {employee.reportingToId.profilePictureUrl ? (
                <img src={employee.reportingToId.profilePictureUrl} alt="" className="h-8 w-8 rounded-full object-cover shrink-0" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-semibold text-zinc-500 shrink-0">
                  {employee.reportingToId.firstName?.[0]}{employee.reportingToId.lastName?.[0]}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-[10px] text-zinc-400">Reporting To</p>
                <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">{employee.reportingToId.firstName} {employee.reportingToId.lastName}</p>
              </div>
            </>
          ) : (
            <>
              <img src={DUMMY.reportingManager.photo} alt="" className="h-8 w-8 rounded-full object-cover shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-zinc-400">Reporting To</p>
                <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">{DUMMY.reportingManager.name}</p>
                <p className="text-[10px] text-zinc-400 truncate">{DUMMY.reportingManager.designation}</p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function MyProfilePage() {
  const [tab, setTab] = useState<TabKey>('personal');
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [docSubTab, setDocSubTab] = useState<'all' | 'mine' | 'shared'>('all');

  const { data: employeeRes, isLoading } = useQuery({
    queryKey: ['current-employee'],
    queryFn: async () => (await api.get('/employees/current')).data,
  });
  const employee = employeeRes?.data;

  const { data: leaveStats } = useQuery({
    queryKey: ['my-leave-statistics'],
    queryFn: async () => (await api.get('/leaves/statistics')).data,
  });

  const { data: appraisals } = useQuery({
    queryKey: ['my-appraisals'],
    queryFn: async () => (await api.get('/appraisals/my')).data,
  });

  const leaveBalance = useMemo(() => {
    const stats = leaveStats?.stats || [];
    if (stats.length === 0) return null;
    return Math.round(stats.reduce((sum: number, s: any) => sum + (s.balance || 0), 0) * 10) / 10;
  }, [leaveStats]);

  const rating = useMemo(() => {
    if (!appraisals || appraisals.length === 0) return null;
    const sorted = [...appraisals].sort((a: any, b: any) => moment(b.createdAt).diff(moment(a.createdAt)));
    const latest = sorted[0];
    const value = latest.hrRating ?? latest.hodRating ?? latest.selfRating;
    return typeof value === 'number' ? value : null;
  }, [appraisals]);

  const tenure = useMemo(() => {
    if (!employee?.dateOfJoining) return null;
    const d = moment.duration(moment().diff(moment(employee.dateOfJoining)));
    return { years: Math.floor(d.asYears()), months: d.months() };
  }, [employee?.dateOfJoining]);

  const age = employee?.dateOfBirth ? moment().diff(moment(employee.dateOfBirth), 'years') : null;

  const comingSoon = (what: string) => () => alert(`${what} is coming soon.`);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-zinc-400 gap-2">
        <Loader2 className="animate-spin" size={18} /> Loading profile…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300 px-2 sm:px-4 pt-4 pb-6 w-full">
      <div className="flex items-center text-[13px] text-zinc-500 mb-1">
        <span className="hover:text-indigo-600 cursor-pointer transition-colors">Dashboard</span>
        <ChevronRight size={14} className="mx-1" />
        <span className="hover:text-indigo-600 cursor-pointer transition-colors">My Profile</span>
        {tab === 'experience' && (
          <>
            <ChevronRight size={14} className="mx-1" />
            <span className="font-medium text-zinc-900 dark:text-zinc-50">Experience</span>
          </>
        )}
      </div>

      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200/70 dark:border-zinc-800">
        {tab === 'experience' ? (
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">Experience</h1>
            <p className="text-[13px] text-zinc-500 mt-1">Add and manage your work experience details.</p>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm shrink-0">
              <UserRound size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">My Profile</h1>
              <p className="text-[13px] text-zinc-500 mt-0.5">View and manage your personal and professional information.</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          {tab === 'experience' ? (
            <button
              onClick={comingSoon('Add Experience')}
              className="text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 transition-colors"
            >
              <Plus size={16} /> Add Experience
            </button>
          ) : (
            <>
              <button
                onClick={comingSoon('Public profile view')}
                className="text-xs font-medium bg-white hover:bg-zinc-50 text-zinc-700 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 border border-zinc-200 shadow-sm dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-800 transition-colors"
              >
                <Eye size={13} /> View Public Profile
              </button>
              <button
                onClick={comingSoon('Profile editing')}
                className="text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 transition-colors"
              >
                <Pencil size={13} /> Edit Profile
              </button>
            </>
          )}
        </div>
      </header>

      {/* Tab bar */}
      <div className="flex items-center gap-1 overflow-x-auto bg-zinc-100 dark:bg-zinc-800/60 rounded-xl p-1">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${tab === t.key ? 'bg-white dark:bg-zinc-900 text-indigo-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'personal' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <ProfileSummaryCard employee={employee} tenure={tenure} comingSoon={comingSoon} className="lg:col-span-3 lg:row-span-2" />

            {/* Personal Information */}
            <Card className="lg:col-span-5 border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-hidden">
              <CardHeader className="flex-row items-center justify-between px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 space-y-0">
                <CardTitle className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Personal Information</CardTitle>
                <button onClick={comingSoon('Editing personal information')} className="text-xs font-medium text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"><Pencil size={12} /> Edit</button>
              </CardHeader>
              <CardContent className="p-3 grid grid-cols-2 gap-3">
                <InfoField label="Full Name" value={`${employee?.firstName || DUMMY.firstName} ${employee?.lastName || DUMMY.lastName}`.trim()} />
                <InfoField label="Aadhaar Number" value={(
                  <span className="inline-flex items-center gap-1.5">
                    {showAadhaar ? (employee?.aadhaarNumber || DUMMY.aadhaarNumber) : `XXXX XXXX ${(employee?.aadhaarNumber || DUMMY.aadhaarNumber).slice(-4)}`}
                    <button onClick={() => setShowAadhaar(s => !s)} className="text-zinc-400 hover:text-zinc-600">{showAadhaar ? <EyeOff size={12} /> : <Eye size={12} />}</button>
                  </span>
                )} />
                <InfoField label="Date of Birth" value={employee?.dateOfBirth ? `${moment(employee.dateOfBirth).format('DD MMM YYYY')}${age !== null ? ` (${age} Yrs)` : ''}` : DUMMY.dateOfBirth} />
                <InfoField label="PAN Number" value={employee?.panNumber || DUMMY.panNumber} />
                <InfoField label="Gender" value={employee?.gender ? employee.gender[0].toUpperCase() + employee.gender.slice(1) : DUMMY.gender} />
                <InfoField label="Phone Number" value={employee?.mobileNumber || DUMMY.phone} />
                <InfoField label="Marital Status" value={employee?.maritalStatus ? employee.maritalStatus[0].toUpperCase() + employee.maritalStatus.slice(1) : DUMMY.maritalStatus} />
                <InfoField label="Personal Email" value={`${(employee?.firstName || DUMMY.firstName).toLowerCase()}@gmail.com`} />
                <InfoField label="Nationality" value={DUMMY.nationality} />
                <InfoField label="Alternate Email" value={`${(employee?.firstName || DUMMY.firstName).toLowerCase()}.personal@gmail.com`} />
                <InfoField label="Blood Group" value={employee?.bloodGroup || DUMMY.bloodGroup} />
              </CardContent>
            </Card>

            {/* Summary tiles */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-3">
              <StatTile icon={Award} bg="bg-violet-50 dark:bg-violet-900/20" color="text-violet-600" label="Total Experience" value={DUMMY.totalExperience} sub="Overall Experience" />
              <StatTile icon={Building2} bg="bg-blue-50 dark:bg-blue-900/20" color="text-blue-600" label="Company Experience" value={tenure ? `${tenure.years} Yrs ${tenure.months} Mths` : '—'} sub={employee?.dateOfJoining ? `Since ${moment(employee.dateOfJoining).format('DD MMM YYYY')}` : undefined} />
              <StatTile icon={IndianRupee} bg="bg-emerald-50 dark:bg-emerald-900/20" color="text-emerald-600" label="Current CTC (Annual)" value={`₹ ${DUMMY.ctc}`} sub="Cost to Company" />
              <StatTile icon={TrendingUp} bg="bg-blue-50 dark:bg-blue-900/20" color="text-blue-600" label="Next Increment" value={DUMMY.nextIncrement} sub="Upcoming" />
              <StatTile icon={CalendarCheck} bg="bg-indigo-50 dark:bg-indigo-900/20" color="text-indigo-600" label="Leave Balance" value={leaveBalance !== null ? `${leaveBalance} Days` : '—'} sub="Available" />
              <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800">
                <CardContent className="p-2.5">
                  <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wide mb-1">Performance Rating</p>
                  <RatingStars value={rating} />
                  <p className="text-[10px] text-zinc-400 mt-1">Current Rating</p>
                </CardContent>
              </Card>
            </div>

            <Card className="lg:col-span-3 border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-hidden">
              <CardHeader className="flex-row items-center justify-between px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 space-y-0">
                <CardTitle className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Family Details</CardTitle>
                <button onClick={() => setTab('family')} className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700">View All</button>
              </CardHeader>
              <CardContent className="p-3">
                <SimpleTable
                  columns={['Name', 'Relation', 'Date of Birth', 'Occupation']}
                  rows={DUMMY.family.map(f => [`${f.name} ${employee?.lastName || ''}`.trim(), f.relation, f.dob, f.occupation])}
                  addLabel="Add Family Member"
                  onAdd={comingSoon('Adding family members')}
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-3 border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-hidden">
              <CardHeader className="flex-row items-center justify-between px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 space-y-0">
                <CardTitle className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Bank Details</CardTitle>
                <button onClick={() => setTab('bank')} className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700">View All</button>
              </CardHeader>
              <CardContent className="p-3">
                <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
                  <InfoRow label="Bank Name" value={DUMMY.bank.name} />
                  <InfoRow label="Account Number" value={DUMMY.bank.accountNumber} />
                  <InfoRow label="IFSC Code" value={DUMMY.bank.ifsc} />
                  <InfoRow label="Account Type" value={DUMMY.bank.type} />
                  <InfoRow label="Branch" value={DUMMY.bank.branch} />
                  <InfoRow label="Primary Account" value={DUMMY.bank.primary} />
                </div>
                <button onClick={comingSoon('Adding bank details')} className="mt-2 text-xs font-medium text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"><Plus size={12} /> Add Bank Account</button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3 border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-hidden">
              <CardHeader className="flex-row items-center justify-between px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 space-y-0">
                <CardTitle className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Education Details</CardTitle>
                <button onClick={() => setTab('education')} className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700">View All</button>
              </CardHeader>
              <CardContent className="p-3">
                <SimpleTable
                  columns={['Qualification', 'Institute / University', 'Year', 'Percentage']}
                  rows={DUMMY.education.map(e => [e.qualification, e.institute, e.year, e.pct])}
                  addLabel="Add Education"
                  onAdd={comingSoon('Adding education records')}
                />
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-hidden">
              <CardHeader className="flex-row items-center justify-between px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 space-y-0">
                <CardTitle className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Previous Experience</CardTitle>
                <button onClick={() => setTab('experience')} className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700">View All</button>
              </CardHeader>
              <CardContent className="p-3">
                <SimpleTable
                  columns={['Company Name', 'Designation', 'Duration', 'CTC (Annual)', 'Last Drawn']}
                  rows={DUMMY.experience.map(e => [e.company, e.designation, e.duration, `₹ ${e.ctc}`, `₹ ${e.lastDrawn}`])}
                  addLabel="Add Experience"
                  onAdd={comingSoon('Adding experience records')}
                />
              </CardContent>
            </Card>

            <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-hidden">
              <CardHeader className="flex-row items-center justify-between px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 space-y-0">
                <CardTitle className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Skills</CardTitle>
                <button onClick={() => setTab('skills')} className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700">View All</button>
              </CardHeader>
              <CardContent className="p-3">
                <SkillBars skills={DUMMY.skills} />
                <button onClick={comingSoon('Adding skills')} className="mt-2.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"><Plus size={12} /> Add Skill</button>
              </CardContent>
            </Card>

            <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-hidden">
              <CardHeader className="flex-row items-center justify-between px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 space-y-0">
                <CardTitle className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Other Information</CardTitle>
                <button onClick={comingSoon('Editing other information')} className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"><Pencil size={11} /> Edit</button>
              </CardHeader>
              <CardContent className="p-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-2">
                  <InfoField label="Employee ID" value={employee?.employeeCode || '—'} />
                  <InfoField label="Department" value={employee?.departmentId?.name || '—'} />
                  <InfoField label="Designation" value={employee?.designationId?.name || '—'} />
                  <InfoField label="Employment Type" value="Full Time" />
                </div>
                <div className="flex flex-col gap-2">
                  <InfoField label="Probation Period" value="Completed" />
                  <InfoField label="Shift" value="General Shift" />
                  <InfoField label="Work Location" value={employee?.branchId?.name || '—'} />
                  <InfoField label="Date of Confirmation" value="15 Sep 2023" />
                </div>
                <div className="flex flex-col gap-2">
                  <InfoField label="Grade" value="E2" />
                  <InfoField label="UAN Number" value="101234567890" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {tab === 'family' && (
        <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-hidden">
          <CardHeader className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-zinc-800 dark:text-zinc-100"><Users size={15} className="text-indigo-600" /> Family Details</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <SimpleTable
              columns={['Name', 'Relation', 'Date of Birth', 'Occupation']}
              rows={DUMMY.family.map(f => [`${f.name} ${employee?.lastName || ''}`.trim(), f.relation, f.dob, f.occupation])}
              addLabel="Add Family Member"
              onAdd={comingSoon('Adding family members')}
            />
          </CardContent>
        </Card>
      )}

      {tab === 'bank' && (
        <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-hidden">
          <CardHeader className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-zinc-800 dark:text-zinc-100"><Landmark size={15} className="text-indigo-600" /> Bank Details</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-indigo-50/60 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/40 max-w-md">
              <div className="h-10 w-10 rounded-lg bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-center shrink-0">
                <Landmark size={18} className="text-indigo-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 truncate">{DUMMY.bank.name}</p>
                <p className="text-[11px] text-zinc-500 truncate">{DUMMY.bank.accountNumber} · {DUMMY.bank.type}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl">
              <InfoField label="Bank Name" value={DUMMY.bank.name} />
              <InfoField label="Account Number" value={DUMMY.bank.accountNumber} />
              <InfoField label="IFSC Code" value={DUMMY.bank.ifsc} />
              <InfoField label="Account Type" value={DUMMY.bank.type} />
              <InfoField label="Branch" value={DUMMY.bank.branch} />
              <InfoField label="Primary Account" value={DUMMY.bank.primary} />
            </div>
            <button onClick={comingSoon('Adding bank details')} className="mt-4 text-xs font-medium text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"><Plus size={12} /> Add Bank Account</button>
          </CardContent>
        </Card>
      )}

      {tab === 'education' && (
        <EducationTab
          comingSoon={comingSoon}
          profileCard={
            <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800 h-full flex flex-col">
              <CardContent className="p-4 flex flex-col items-center text-center flex-1">
                <div className="relative">
                  <img src={employee?.profilePictureUrl || DUMMY.photo} alt="" className="h-24 w-24 rounded-full object-cover border-4 border-zinc-100 dark:border-zinc-800" />
                  <button onClick={comingSoon('Photo upload')} className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800">
                    <Camera size={12} className="text-zinc-600 dark:text-zinc-300" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5 mt-3">
                  <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{employee?.firstName || DUMMY.firstName} {employee?.lastName || DUMMY.lastName}</p>
                  <CheckCircle2 size={14} className="text-emerald-500" />
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">{employee?.employeeCode || DUMMY.employeeCode}</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">{employee?.designationId?.name || DUMMY.designation}</p>
                <span className={`mt-2 inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded ${employee?.isActive ?? true ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                  {(employee?.isActive ?? true) ? 'Active' : 'Inactive'}
                </span>

                <div className="w-full flex flex-col gap-3 mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-left">
                  <div className="flex items-center gap-3 text-[13px] text-zinc-700 dark:text-zinc-300 font-medium">
                    <Mail size={15} className="text-zinc-400 shrink-0" /> <span className="truncate">{employee?.email || DUMMY.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[13px] text-zinc-700 dark:text-zinc-300 font-medium">
                    <Phone size={15} className="text-zinc-400 shrink-0" /> {employee?.mobileNumber || DUMMY.phone}
                  </div>

                  <div className="flex items-start gap-3 text-[13px]">
                    <CalendarDays size={15} className="text-zinc-400 shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-[11px] text-zinc-500 mb-0.5">Date of Joining</span>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">{employee?.dateOfJoining ? moment(employee.dateOfJoining).format('DD MMM YYYY') : DUMMY.dateOfJoining}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-[13px]">
                    <MapPin size={15} className="text-zinc-400 shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-[11px] text-zinc-500 mb-0.5">Work Location</span>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">{employee?.branchId?.name || DUMMY.branch}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-[13px] mt-1">
                    <img src={DUMMY.managerPhoto || "https://i.pravatar.cc/150?u=44"} alt="Manager" className="h-8 w-8 rounded-full object-cover border border-zinc-200 mt-1" />
                    <div className="flex flex-col">
                      <span className="text-[11px] text-zinc-500 mb-0.5">Reporting To</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">Amit Kumar</span>
                      <span className="text-[11px] text-zinc-500 font-medium">Sales Manager</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          }
        />
      )}

      {tab === 'experience' && (
        <ExperienceTab comingSoon={comingSoon} />
      )}

      {tab === 'documents' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">My Documents</h2>
              <p className="text-[13px] text-zinc-500 mt-0.5">Upload, manage and access all your official documents in one place.</p>
            </div>
            <button onClick={comingSoon('Document upload')} className="text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-lg inline-flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 transition-colors shrink-0">
              <UploadCloud size={14} /> Upload Document
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatTile icon={FileText} bg="bg-blue-50 dark:bg-blue-900/20" color="text-blue-600" label="Total Documents" value={String(DOC_STATS.total)} sub="Across all categories" />
            <StatTile icon={ShieldCheck} bg="bg-emerald-50 dark:bg-emerald-900/20" color="text-emerald-600" label="Verified Documents" value={String(DOC_STATS.verified)} sub="Verified & Approved" />
            <StatTile icon={Clock} bg="bg-amber-50 dark:bg-amber-900/20" color="text-amber-600" label="Pending Verification" value={String(DOC_STATS.pending)} sub="Awaiting Approval" />
            <StatTile icon={AlertTriangle} bg="bg-rose-50 dark:bg-rose-900/20" color="text-rose-600" label="Expiring Soon" value={String(DOC_STATS.expiring)} sub="Within next 60 days" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <Card className="lg:col-span-9 border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col gap-3 p-3 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-4 text-xs font-medium">
                    {(['all', 'mine', 'shared'] as const).map(k => (
                      <button
                        key={k}
                        onClick={() => setDocSubTab(k)}
                        className={`pb-2 border-b-2 -mb-px transition-colors ${docSubTab === k ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                      >
                        {k === 'all' ? 'All Documents' : k === 'mine' ? 'Uploaded By Me' : 'Shared With Me'}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button onClick={comingSoon('Category filter')} className="flex items-center justify-between gap-2 text-xs px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                      All Categories <ChevronDown size={13} className="text-zinc-400" />
                    </button>
                    <button onClick={comingSoon('Status filter')} className="flex items-center justify-between gap-2 text-xs px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                      All Status <ChevronDown size={13} className="text-zinc-400" />
                    </button>
                    <div className="relative flex-1 sm:max-w-[220px]">
                      <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input
                        readOnly
                        onFocus={comingSoon('Document search')}
                        placeholder="Search documents..."
                        className="w-full text-xs pl-8 pr-2 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-transparent text-zinc-600 dark:text-zinc-300 placeholder:text-zinc-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40">
                        <th className="h-7 px-3 text-left text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">Document Name</th>
                        <th className="h-7 px-3 text-left text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">Category</th>
                        <th className="h-7 px-3 text-left text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">Uploaded On</th>
                        <th className="h-7 px-3 text-left text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">Uploaded By</th>
                        <th className="h-7 px-3 text-left text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">Expiry Date</th>
                        <th className="h-7 px-3 text-left text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">Status</th>
                        <th className="h-7 px-3 text-left text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DOC_LIST.map(d => (
                        <tr key={d.name} className="border-b border-zinc-50 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30">
                          <td className="px-3 py-1.5">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center shrink-0">
                                <FileText size={13} className="text-rose-500" />
                              </div>
                              <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200 whitespace-nowrap">{d.name}</span>
                            </div>
                          </td>
                          <td className="px-3 py-1.5">
                            <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${DOC_CATEGORY_STYLE[d.category]}`}>{d.category}</span>
                          </td>
                          <td className="px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 whitespace-nowrap">{d.uploadedOn}</td>
                          <td className="px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 whitespace-nowrap">{employee?.firstName || DUMMY.firstName} {employee?.lastName || DUMMY.lastName}</td>
                          <td className="px-3 py-1.5 text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">{d.expiry}</td>
                          <td className="px-3 py-1.5">
                            <span className={`inline-flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${d.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                              {d.status === 'Verified' ? <ShieldCheck size={11} /> : <Clock size={11} />} {d.status}
                            </span>
                          </td>
                          <td className="px-3 py-1.5">
                            <div className="flex items-center gap-1">
                              <button onClick={comingSoon('Document preview')} className="h-6 w-6 rounded text-zinc-400 hover:text-indigo-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center"><Eye size={13} /></button>
                              <button onClick={comingSoon('Document download')} className="h-6 w-6 rounded text-zinc-400 hover:text-indigo-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center"><Download size={13} /></button>
                              <button onClick={comingSoon('More actions')} className="h-6 w-6 rounded text-zinc-400 hover:text-indigo-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center"><MoreVertical size={13} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between px-3 py-3 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="text-xs text-zinc-500">Showing 1 to {DOC_LIST.length} of {DOC_STATS.total} documents</span>
                  <div className="flex items-center gap-1">
                    <button onClick={comingSoon('Previous page')} className="h-7 w-7 rounded-md border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"><ChevronLeft size={13} /></button>
                    <button className="h-7 w-7 rounded-md bg-indigo-600 text-white text-xs font-medium flex items-center justify-center">1</button>
                    <button onClick={comingSoon('Page 2')} className="h-7 w-7 rounded-md border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-300 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-800">2</button>
                    <button onClick={comingSoon('Page 3')} className="h-7 w-7 rounded-md border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-300 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-800">3</button>
                    <button onClick={comingSoon('Next page')} className="h-7 w-7 rounded-md border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"><ChevronRight size={13} /></button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-3 flex flex-col gap-4">
              <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800">
                <CardContent className="p-4">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-3">Document Categories</p>
                  <div className="flex flex-col gap-2">
                    {DOC_CATEGORIES.map(c => (
                      <div key={c.name} className="flex items-center justify-between gap-2 text-xs">
                        <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400"><FileText size={12} className="text-zinc-400" /> {c.name}</span>
                        <span className={`text-[10.5px] font-semibold px-1.5 py-0.5 rounded ${DOC_CATEGORY_STYLE[c.name]}`}>{c.count}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={comingSoon('View all categories')} className="mt-3 text-xs font-medium text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1">View All Categories <ChevronRight size={12} /></button>
                </CardContent>
              </Card>

              <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800">
                <CardContent className="p-4">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-2.5">Document Guidelines</p>
                  <ul className="flex flex-col gap-2">
                    {DOC_GUIDELINES.map(g => (
                      <li key={g} className="flex items-start gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                        <Info size={12} className="text-indigo-400 shrink-0 mt-0.5" /> {g}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800 bg-indigo-50/40 dark:bg-indigo-900/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Headset size={16} className="text-indigo-600" />
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Need Help?</p>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-3">For any document related queries, please contact HR Department.</p>
                  <button onClick={comingSoon('Contact HR')} className="w-full text-xs font-medium bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 py-1.5 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800">Contact HR</button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {tab === 'skills' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <ProfileSummaryCard employee={employee} tenure={tenure} comingSoon={comingSoon} className="lg:col-span-3" />

          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatTile icon={GraduationCap} bg="bg-blue-50 dark:bg-blue-900/20" color="text-blue-600" label="Total Skills" value={String(SKILL_STATS.total)} sub="All Skills Added" />
              <StatTile icon={Star} bg="bg-emerald-50 dark:bg-emerald-900/20" color="text-emerald-600" label="Core Skills" value={String(SKILL_STATS.core)} sub="Key Expertise Areas" />
              <StatTile icon={BarChart3} bg="bg-amber-50 dark:bg-amber-900/20" color="text-amber-600" label="Average Proficiency" value={`${SKILL_STATS.avgProficiency}%`} sub="Across All Skills" />
              <StatTile icon={Award} bg="bg-violet-50 dark:bg-violet-900/20" color="text-violet-600" label="Certifications" value={String(SKILL_STATS.certifications)} sub="Related to Skills" />
            </div>

            <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-hidden">
              <CardHeader className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800">
                <CardTitle className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">My Skills</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40">
                        <th className="h-8 px-3 text-left text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">Skill Name</th>
                        <th className="h-8 px-3 text-left text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">Category</th>
                        <th className="h-8 px-3 text-left text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">Proficiency</th>
                        <th className="h-8 px-3 text-left text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">Last Updated</th>
                        <th className="h-8 px-3 text-left text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SKILL_LIST.map(s => {
                        const style = SKILL_CATEGORY_STYLE[s.category];
                        return (
                          <tr key={s.name} className="border-b border-zinc-50 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30">
                            <td className="px-3 py-1.5">
                              <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full flex items-center justify-center shrink-0" style={{ background: `${style.color}1A` }}>
                                  <Sparkles size={11} style={{ color: style.color }} />
                                </div>
                                <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200 whitespace-nowrap">{s.name}</span>
                              </div>
                            </td>
                            <td className="px-3 py-1.5">
                              <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${style.badge}`}>{s.category}</span>
                            </td>
                            <td className="px-3 py-1.5">
                              <div className="flex items-center gap-2 min-w-[130px]">
                                <div className="h-1.5 flex-1 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                                  <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: style.color }} />
                                </div>
                                <span className="text-[10.5px] text-zinc-500 dark:text-zinc-400 w-8 text-right">{s.pct}%</span>
                              </div>
                            </td>
                            <td className="px-3 py-1.5 text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">{s.updated}</td>
                            <td className="px-3 py-1.5">
                              <div className="flex items-center gap-1">
                                <button onClick={comingSoon('Editing skill')} className="h-6 w-6 rounded text-zinc-400 hover:text-indigo-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center"><Pencil size={12} /></button>
                                <button onClick={comingSoon('Deleting skill')} className="h-6 w-6 rounded text-zinc-400 hover:text-rose-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center"><Trash2 size={12} /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-col items-center gap-2 px-3 py-3 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="text-xs text-zinc-500">Showing 1 to {SKILL_LIST.length} of {SKILL_STATS.total} skills</span>
                  <button onClick={comingSoon('Viewing all skills')} className="text-xs font-medium text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1">View All Skills <ChevronDown size={12} /></button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-900/10 shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Rocket size={16} className="text-indigo-600 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Add &amp; Improve Your Skills</p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Keep your skills up to date to help us understand your strengths better and recommend relevant opportunities.</p>
                    </div>
                  </div>
                  <button onClick={comingSoon('Adding a new skill')} className="text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg inline-flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 transition-colors shrink-0">
                    <Plus size={13} /> Add New Skill
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-indigo-100 dark:border-indigo-900/40">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-center shrink-0"><Plus size={14} className="text-indigo-600" /></div>
                    <div>
                      <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200">Add new skills</p>
                      <p className="text-[10.5px] text-zinc-400">Keep your profile complete</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-center shrink-0"><BarChart3 size={14} className="text-indigo-600" /></div>
                    <div>
                      <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200">Track proficiency</p>
                      <p className="text-[10.5px] text-zinc-400">Update your skill levels</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-center shrink-0"><Target size={14} className="text-indigo-600" /></div>
                    <div>
                      <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200">Get best opportunities</p>
                      <p className="text-[10.5px] text-zinc-400">Based on your expertise</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 flex flex-col gap-4">
            <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800">
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-3">Skill Categories</p>
                <div className="flex items-center gap-4">
                  <div className="h-[100px] w-[100px] relative shrink-0">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={SKILL_CATEGORY_BREAKDOWN} dataKey="count" nameKey="name" innerRadius={32} outerRadius={48} paddingAngle={2} stroke="none">
                          {SKILL_CATEGORY_BREAKDOWN.map(c => <Cell key={c.name} fill={c.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-base font-bold text-zinc-900 dark:text-zinc-50">{SKILL_STATS.total}</span>
                      <span className="text-[9px] text-zinc-500">Total Skills</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 text-xs flex-1">
                    {SKILL_CATEGORY_BREAKDOWN.map(c => (
                      <div key={c.name} className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400"><span className="h-2 w-2 rounded-full shrink-0" style={{ background: c.color }} />{c.name}</span>
                        <span className="font-medium text-zinc-800 dark:text-zinc-200 whitespace-nowrap">{c.count} ({c.pct}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800">
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-3 flex items-center gap-1.5"><Target size={14} className="text-indigo-600" /> Top Skills</p>
                <div className="flex flex-col gap-2">
                  {TOP_SKILLS.map(s => (
                    <div key={s.name} className="flex items-center justify-between gap-2 text-xs">
                      <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 min-w-0"><Star size={11} className="text-amber-400 shrink-0" /> <span className="truncate">{s.name}</span></span>
                      <span className="text-[10.5px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 shrink-0">{s.pct}%</span>
                    </div>
                  ))}
                </div>
                <button onClick={comingSoon('Viewing all skills')} className="mt-3 text-xs font-medium text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1">View All Skills <ChevronRight size={12} /></button>
              </CardContent>
            </Card>

            <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800">
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-3 flex items-center gap-1.5"><BadgeCheck size={14} className="text-indigo-600" /> Certifications Related to Skills</p>
                <div className="flex flex-col gap-3">
                  {SKILL_CERTIFICATIONS.map(c => (
                    <div key={c.name} className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 min-w-0">
                        <div className="h-7 w-7 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center shrink-0 mt-0.5"><Award size={13} className="text-indigo-600" /></div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200">{c.name}</p>
                          <p className="text-[10.5px] text-zinc-400">Issued on {c.issued}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 shrink-0">Verified</span>
                    </div>
                  ))}
                </div>
                <button onClick={comingSoon('Viewing all certifications')} className="mt-3 text-xs font-medium text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1">View All Certifications <ChevronRight size={12} /></button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {tab === 'assets' && (
        <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-hidden">
          <CardHeader className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-zinc-800 dark:text-zinc-100"><Package size={15} className="text-indigo-600" /> Assets Allocated</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {DUMMY.assets.map(a => (
                <div key={a.tag} className="flex items-center gap-2.5 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-sm transition-all">
                  <div className="h-9 w-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
                    <Laptop size={15} className="text-emerald-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">{a.name}</p>
                    <p className="text-[10.5px] text-zinc-400 truncate">Tag: {a.tag}</p>
                    <p className="text-[10.5px] text-zinc-400 truncate">Allocated {a.allocatedOn}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {tab === 'emergency' && (
        <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-hidden">
          <CardHeader className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-zinc-800 dark:text-zinc-100"><HeartPulse size={15} className="text-rose-600" /> Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg">
              <InfoField label="Name" value={employee?.emergencyContactName || DUMMY.emergency.name} />
              <InfoField label="Relation" value={employee?.emergencyContactRelation || DUMMY.emergency.relation} />
              <InfoField label="Phone Number" value={employee?.emergencyContactNumber || DUMMY.emergency.number} />
            </div>
          </CardContent>
        </Card>
      )}

      {tab === 'more' && (
        <Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800 overflow-hidden">
          <CardHeader className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800">
            <CardTitle className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">More Information</CardTitle>
          </CardHeader>
          <CardContent className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <InfoField label="Employee Code" value={employee?.employeeCode || '—'} />
            <InfoField label="Role" value={employee?.roleId?.name || '—'} />
            <InfoField label="Employment Status" value={employee?.isActive ? 'Active' : 'Inactive'} />
            <InfoField label="Branch Address" value={employee?.branchId?.address || '—'} />
            <InfoField label="Grade" value="E2" />
            <InfoField label="UAN Number" value="101234567890" />
            <InfoField label="PF Number" value="DL/12345/67890" />
            <InfoField label="ESIC Number" value="3412345678" />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
