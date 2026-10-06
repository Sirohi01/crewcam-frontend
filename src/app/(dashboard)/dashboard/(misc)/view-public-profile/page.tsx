'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import moment from 'moment';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';
import {
  ChevronRight, Download, Printer, Phone, Mail, CalendarDays, IdCard, MapPin,
  Briefcase, User, Sparkles, GraduationCap, Award, Globe2, Heart, Users,
  BookOpen, Plane, Music, Dumbbell, Send, Pencil, CheckCircle2, ArrowRight, Info,
  LucideIcon,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface ReportingManager {
  firstName: string;
  lastName: string;
  designation: string;
  profilePictureUrl?: string;
}

interface WorkExperienceEntry {
  designation: string;
  company: string;
  startDate: string;
  endDate: string | 'Present';
  description: string;
}

interface EducationEntry {
  qualification: string;
  institute: string;
  year: string;
}

interface CertificationEntry {
  name: string;
  issuer: string;
  issued: string;
}

interface LanguageEntry {
  name: string;
  proficiency: string;
}

interface InterestEntry {
  label: string;
  icon: LucideIcon;
}

/** Shape returned by /employees/current, extended with the display-only
 *  fields this page needs (aboutMe, skills, experience, etc). The backend
 *  doesn't persist those yet, so they fall back to DEFAULTS below — same
 *  convention used on the My Profile page. */
interface Employee {
  firstName?: string;
  lastName?: string;
  employeeCode?: string;
  email?: string;
  personalEmail?: string;
  mobileNumber?: string;
  dateOfJoining?: string;
  isActive?: boolean;
  profilePictureUrl?: string;
  designationId?: { name: string };
  branchId?: { name: string };
  departmentId?: { name: string };
  employmentType?: string;
  reportingToId?: ReportingManager;
  aboutMe?: string;
  skills?: string[];
  workExperience?: WorkExperienceEntry[];
  education?: EducationEntry[];
  certifications?: CertificationEntry[];
  languages?: LanguageEntry[];
  interests?: InterestEntry[];
}

/* ------------------------------------------------------------------ */
/* Defaults (display-only, mirrors My Profile page fallback pattern)   */
/* ------------------------------------------------------------------ */

const DEFAULTS = {
  photo: 'https://randomuser.me/api/portraits/men/32.jpg',
  firstName: 'Rohan',
  lastName: 'Mehta',
  employeeCode: 'EMP10234',
  designation: 'Executive - Sales',
  department: 'Sales & Marketing',
  email: 'rohan.mehta@crewcam.com',
  phone: '+91 98765 43210',
  dateOfJoining: '15 Mar 2023',
  branch: 'Noida Office',
  employmentType: 'Permanent',
  reportingManager: { firstName: 'Amit', lastName: 'Kumar', designation: 'Sales Manager', profilePictureUrl: 'https://i.pravatar.cc/150?u=40' },
  aboutMe: 'Results-driven sales professional with a passion for building strong client relationships and delivering business growth. Focused on customer satisfaction and achieving organizational goals.',
  skills: ['Sales Management', 'Client Relationship', 'Negotiation', 'Business Development', 'Communication', 'Team Collaboration'],
  workExperience: [
    { designation: 'Executive - Sales', company: 'CrewCam Technologies Pvt. Ltd.', startDate: 'Mar 2023', endDate: 'Present', description: 'Responsible for driving sales, managing key accounts and achieving revenue targets.' },
    { designation: 'Sales Associate', company: 'ABC Solutions Pvt. Ltd.', startDate: 'Jan 2021', endDate: 'Feb 2023', description: 'Handled customer inquiries, generated leads and supported the sales team.' },
    { designation: 'Business Development Trainee', company: 'XYZ Corp. Services', startDate: 'Jul 2019', endDate: 'Dec 2020', description: 'Assisted in market research and identifying new business opportunities.' },
  ] as WorkExperienceEntry[],
  education: [
    { qualification: 'MBA - Marketing', institute: 'Amity University, Noida', year: '2019' },
    { qualification: 'BBA - Management', institute: 'Delhi University', year: '2017' },
  ] as EducationEntry[],
  certifications: [
    { name: 'Advanced Sales Strategies', issuer: 'Coursera', issued: 'Feb 2024' },
    { name: 'Customer Relationship Management', issuer: 'HubSpot Academy', issued: 'Aug 2023' },
  ] as CertificationEntry[],
  languages: [
    { name: 'English', proficiency: 'Professional' },
    { name: 'Hindi', proficiency: 'Native' },
    { name: 'Punjabi', proficiency: 'Conversational' },
  ] as LanguageEntry[],
  interests: [
    { label: 'Reading', icon: BookOpen },
    { label: 'Travelling', icon: Plane },
    { label: 'Music', icon: Music },
    { label: 'Fitness', icon: Dumbbell },
  ] as InterestEntry[],
};

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function HeaderStat({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-1.5 text-[11px] whitespace-nowrap">
        <Icon size={13} className="text-indigo-600 shrink-0" /> {label}
      </span>
      <span className="text-[11.5px] font-semibold text-slate-900 text-right truncate">{value}</span>
    </div>
  );
}

function SectionCard({ icon: Icon, title, action, className, children }: { icon: LucideIcon; title: string; action?: React.ReactNode; className?: string; children: React.ReactNode }) {
  return (
    <Card className={`border-slate-300 shadow-sm rounded-xl bg-white h-full flex flex-col ${className || ''}`}>
      <CardContent className="p-2 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between gap-2 mb-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="h-5 w-5 rounded-md bg-indigo-50 flex items-center justify-center shrink-0">
              <Icon size={11} className="text-indigo-600" />
            </div>
            <h3 className="text-[13px] font-semibold text-slate-900">{title}</h3>
          </div>
          {action}
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export default function PublicProfile() {
  const router = useRouter();
  const captureRef = useRef<HTMLDivElement>(null);
  const [showAllCerts, setShowAllCerts] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const { data: employeeRes } = useQuery({
    queryKey: ['current-employee'],
    queryFn: async () => (await api.get('/employees/current')).data,
  });
  const employee: Employee | undefined = employeeRes?.data;

  const fullName = `${employee?.firstName || DEFAULTS.firstName} ${employee?.lastName || DEFAULTS.lastName}`;
  const designation = employee?.designationId?.name || DEFAULTS.designation;
  const department = employee?.departmentId?.name || DEFAULTS.department;
  const branch = employee?.branchId?.name || DEFAULTS.branch;
  const email = employee?.email || DEFAULTS.email;
  const phone = employee?.mobileNumber || DEFAULTS.phone;
  const dateOfJoining = employee?.dateOfJoining ? moment(employee.dateOfJoining).format('DD MMM YYYY') : DEFAULTS.dateOfJoining;
  const employmentType = employee?.employmentType || DEFAULTS.employmentType;
  const reportingManager = employee?.reportingToId || DEFAULTS.reportingManager;
  const aboutMe = employee?.aboutMe || DEFAULTS.aboutMe;
  const skills = employee?.skills?.length ? employee.skills : DEFAULTS.skills;
  const workExperience = employee?.workExperience?.length ? employee.workExperience : DEFAULTS.workExperience;
  const education = employee?.education?.length ? employee.education : DEFAULTS.education;
  const certifications = employee?.certifications?.length ? employee.certifications : DEFAULTS.certifications;
  const languages = employee?.languages?.length ? employee.languages : DEFAULTS.languages;
  const interests = employee?.interests?.length ? employee.interests : DEFAULTS.interests;
  const visibleCerts = showAllCerts ? certifications : certifications.slice(0, 2);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!captureRef.current) return;
    try {
      setDownloading(true);
      const canvas = await html2canvas(captureRef.current, { scale: 2, backgroundColor: '#f8fafc' });
      const link = document.createElement('a');
      link.download = `${fullName.replace(/\s+/g, '-').toLowerCase()}-profile.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Profile downloaded');
    } catch {
      toast.error('Could not download profile, please try again');
    } finally {
      setDownloading(false);
    }
  };

  const handleEditProfile = () => router.push('/dashboard/my-profile');
  const handleSendMessage = () => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="flex h-[calc(100vh-48px)] min-h-[650px] flex-col gap-2 overflow-hidden bg-slate-50 text-slate-900">
      <style jsx global>{`
        @media print {
          /* Sab kuch hide karo by default */
          body * {
            visibility: hidden;
          }
          /* Sirf profile section aur uske andar ka content dikhao */
          #printable-profile, #printable-profile * {
            visibility: visible;
          }
          /* Profile section ko page ke top-left me position karo */
          #printable-profile {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            display: block !important;
          }
          /* Grid/flex containers ke andar overflow/height restrictions hata do */
          #printable-profile * {
            overflow: visible !important;
            max-height: none !important;
          }
          /* In-page UI elements chhupao jo print me nahi chahiye */
          .no-print {
            display: none !important;
          }
          /* Page margins control karo */
          @page {
            margin: 12mm;
          }
        }
      `}</style>
      {/* Breadcrumb */}
      <div className="no-print flex items-center text-[11px] font-medium shrink-0">
        <button onClick={() => router.push('/dashboard')} className="hover:text-indigo-600 transition-colors">Dashboard</button>
        <ChevronRight size={12} className="mx-1" />
        <button onClick={() => router.push('/dashboard/my-profile')} className="hover:text-indigo-600 transition-colors">My Profile</button>
        <ChevronRight size={12} className="mx-1" />
        <span className="text-slate-900 font-semibold">View Public Profile</span>
      </div>

      {/* Page header */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">View Public Profile</h1>
          <p className="text-[12px] mt-0.5">This is how your profile appears to other employees in the organization.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="text-xs font-medium bg-white hover:bg-slate-50 px-2.5 py-2 rounded-lg inline-flex items-center gap-1.5 border border-slate-300 shadow-sm transition-colors disabled:opacity-60"
          >
            <Download size={13} /> {downloading ? 'Preparing…' : 'Download Profile'}
          </button>
          <button
            onClick={handlePrint}
            className="text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-2 rounded-lg inline-flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 transition-colors"
          >
            <Printer size={13} /> Print Profile
          </button>
        </div>
      </div>


      {/* Content area — stacks on mobile, fills full height as a grid on desktop */}
      <div
        ref={captureRef}
        id="printable-profile"
        className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden flex flex-col lg:grid lg:grid-rows-[auto_1fr_auto_auto] lg:h-full gap-2 pr-1"
      >
        {/* Hero card */}
        <Card className="border-slate-300 shadow-sm rounded-xl bg-gradient-to-r from-indigo-50/70 to-white shrink-0">
          <CardContent className="p-2">
            <div className="flex flex-col lg:flex-row lg:items-center gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={employee?.profilePictureUrl || DEFAULTS.photo}
                    alt={fullName}
                    className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-sm shrink-0"
                  />
                  <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-[17px] font-bold text-slate-900 flex items-center gap-1.5 truncate">
                    {fullName} <CheckCircle2 size={13} className="text-indigo-600 fill-indigo-50 shrink-0" />
                  </h2>
                  <p className="text-[12px] font-semibold text-slate-800 mt-0.5">{designation}</p>
                  <p className="text-[11px] mt-0.5">{department} &bull; {branch}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                    <a href={`tel:${phone}`} className="flex items-center gap-1 text-[11px] hover:text-indigo-600 transition-colors">
                      <Phone size={12} className="text-blue-700" /> {phone}
                    </a>
                    <a href={`mailto:${email}`} className="flex items-center gap-1 text-[11px] hover:text-indigo-600 transition-colors">
                      <Mail size={12} className="text-blue-700" /> {email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 lg:w-[260px] shrink-0 lg:pl-4">
                <HeaderStat icon={CalendarDays} label="Date of Joining" value={dateOfJoining} />
                <HeaderStat icon={IdCard} label="Employee ID" value={employee?.employeeCode || DEFAULTS.employeeCode} />
                <HeaderStat icon={MapPin} label="Work Location" value={branch} />
                <HeaderStat icon={Briefcase} label="Employment Type" value={employmentType} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main 3-column grid — fills the remaining height on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:min-h-0">
          {/* Column 1 */}
          <div className="flex flex-col gap-2 lg:h-full">
            <SectionCard icon={User} title="About Me" className="lg:flex-1">
              <p className="text-[11.5px] leading-relaxed">{aboutMe}</p>
            </SectionCard>

            <SectionCard icon={Sparkles} title="Skills" className="lg:flex-1">
              <div className="flex flex-wrap gap-1.5">
                {skills.map(skill => (
                  <span key={skill} className="text-[10.5px] font-medium px-2.5 py-1.5 rounded-md bg-indigo-50 text-indigo-700 whitespace-nowrap">
                    {skill}
                  </span>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-2 lg:h-full">
            <SectionCard icon={Briefcase} title="Work Experience" className="lg:flex-1">
              <div className="flex flex-col">
                {workExperience.map((exp, i) => (
                  <div key={`${exp.company}-${i}`} className="flex gap-2">
                    <div className="flex flex-col items-center w-2 shrink-0">
                      <span className="h-2 w-2 rounded-full bg-indigo-600 shrink-0 mt-1" />
                      {i !== workExperience.length - 1 && (
                        <span className="w-px flex-1 bg-indigo-100 my-0.5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pb-2">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <p className="text-[12px] font-semibold text-slate-900">{exp.designation}</p>
                        <span className="text-[10px] font-medium text-indigo-600 whitespace-nowrap">{exp.startDate} - {exp.endDate}</span>
                      </div>
                      <p className="text-[11px]">{exp.company}</p>
                      <p className="text-[10.5px] mt-0.5 leading-snug max-w-[420px]">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-2 lg:h-full">
            <SectionCard icon={GraduationCap} title="Education" className="lg:flex-1">
              <div className="flex flex-col gap-1.5">
                {education.map((ed, i) => (
                  <div key={`${ed.qualification}-${i}`} className="flex items-center justify-between gap-1">
                    <div className="min-w-0">
                      <p className="text-[11.5px] font-semibold text-slate-900 truncate">{ed.qualification}</p>
                      <p className="text-[10.5px] truncate">{ed.institute}</p>
                    </div>
                    <span className="text-[10.5px] font-medium shrink-0">{ed.year}</span>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              icon={Award}
              title="Certifications"
              className="lg:flex-1"
              action={
                certifications.length > 2 && (
                  <button
                    onClick={() => setShowAllCerts(v => !v)}
                    className="text-[10.5px] font-medium text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-0.5 shrink-0"
                  >
                    {showAllCerts ? 'Show Less' : 'View All Certifications'} <ArrowRight size={11} />
                  </button>
                )
              }
            >
              <div className="flex flex-col gap-1.5">
                {visibleCerts.map((c, i) => (
                  <div key={`${c.name}-${i}`} className="flex items-center justify-between gap-1">
                    <div className="min-w-0">
                      <p className="text-[11.5px] font-semibold text-slate-900 truncate">{c.name}</p>
                      <p className="text-[10.5px] truncate">{c.issuer}</p>
                    </div>
                    <span className="text-[10.5px] font-medium shrink-0">{c.issued}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          <SectionCard icon={Globe2} title="Languages Known">
            <div className="flex items-stretch divide-x divide-slate-300">
              {languages.map(l => (
                <div key={l.name} className="flex-1 px-3 first:pl-0 last:pr-0">
                  <p className="text-[11.5px] font-semibold text-slate-900">{l.name}</p>
                  <p className="text-[10.5px]">{l.proficiency}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard icon={Heart} title="Interests">
            <div className="flex flex-wrap gap-4">
              {interests.map(({ label, icon: Icon }) => (
                <div key={label} className="flex flex-col items-center gap-1  py-2">
                  <div className="h-7 w-7 aspect-square shrink-0 rounded-lg border border-slate-200 flex items-center justify-center">
                    <Icon size={13} className="text-indigo-600" />
                  </div>
                  <span className="text-[9.5px] font-medium">{label}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard icon={Users} title="Connect">
            <div className="flex flex-col h-full gap-2">
              <div>
                <p className="text-[10px]">Department</p>
                <p className="text-[11.5px] font-semibold text-slate-900">{department}</p>
              </div>
              <div className="flex items-center justify-between gap-2 mt-auto">
                <div className="min-w-0">
                  <p className="text-[10px]">Reporting Manager</p>
                  <p className="text-[11.5px] font-semibold text-slate-900 truncate">{reportingManager.firstName} {reportingManager.lastName}</p>
                  <p className="text-[10px] truncate">{reportingManager.designation}</p>
                </div>
                <button
                  onClick={handleSendMessage}
                  className="text-[11px] font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md inline-flex items-center gap-1.5 shrink-0"
                >
                  <Send size={12} /> Send Message
                </button>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Footer note */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-indigo-200 bg-indigo-50/50 px-3 py-2 shrink-0 no-print">
          <div className="flex items-center gap-1.5">
            <Info size={14} className="text-blue-600 shrink-0" />
            <div className="no-print">
              <p className="text-[11px] text-blue-600">
                This is your public profie visible to all employees in the organization.
              </p>
              <p className="text-[11px] text-blue-600">
                For Privacy concerns or to update your information, please update your profile.
              </p>
            </div>
          </div>
          <button
            onClick={handleEditProfile}
            className="no-print text-xs font-medium bg-white hover:bg-slate-50 px-2.5 py-2 rounded-lg inline-flex items-center gap-1.5 border border-slate-300 shadow-sm transition-colors shrink-0"
          >
            <Pencil size={12} /> Edit My Profile
          </button>
        </div>
      </div>
    </div>
  );
}