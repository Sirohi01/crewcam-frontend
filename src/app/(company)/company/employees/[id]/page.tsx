'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, Pencil, ChevronDown, User, MapPin, CreditCard,
  CalendarCheck, Wallet, ShieldCheck, Phone, Laptop, Package, Mail,
  Briefcase, History, ScrollText, Building2, X,
} from 'lucide-react';

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'personal', label: 'Personal Info' },
  { key: 'job', label: 'Job Details' },
  { key: 'documents', label: 'Documents' },
  { key: 'attendance', label: 'Attendance' },
  { key: 'leave', label: 'Leave' },
  { key: 'assets', label: 'Assets & Inventory' },
  { key: 'emergency', label: 'Emergency Contact' },
  { key: 'policies', label: 'Policies' },
] as const;

type TabKey = typeof TABS[number]['key'];

const refName = (ref: any) => (ref && typeof ref === 'object' ? ref.name : '') || '-';
const fullName = (ref: any) => (ref ? `${ref.firstName || ''} ${ref.lastName || ''}`.trim() : '') || '-';
const fmtDate = (date?: string) => (date ? moment(date).format('DD MMM YYYY') : '-');
const companyName = (company: any) => company?.tradeName || company?.legalName || '-';
const branchAddress = (branch: any) => {
  if (!branch || typeof branch !== 'object') return '-';
  const parts = [branch.address, branch.city, branch.state, branch.pincode].filter(Boolean);
  return parts.length ? parts.join(', ') : (branch.name || '-');
};
const branchLabel = (branch: any) => {
  if (!branch || typeof branch !== 'object') return '-';
  const locality = [branch.city, branch.state].filter(Boolean).join(', ');
  return locality ? `${branch.name} — ${locality}` : (branch.name || '-');
};
const companyAddress = (company: any) => {
  if (!company) return '-';
  const parts = [company.addressLine1, company.addressLine2, company.city, company.state, company.postalCode, company.country].filter(Boolean);
  return parts.length ? parts.join(', ') : '-';
};

export default function EmployeeProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>('overview');
  const [actionsOpen, setActionsOpen] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  const { data: emp, isLoading, isError, error } = useQuery({
    queryKey: ['employees', params.id],
    queryFn: async () => (await api.get(`/employees/${params.id}`)).data.data,
    retry: false,
  });

  const deactivate = async () => {
    if (!confirm('Deactivate this employee? They will be moved to the ex-employee list.')) return;
    setDeactivating(true);
    try {
      await api.delete(`/employees/${params.id}`);
      router.push('/company/employees');
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to deactivate employee');
    } finally {
      setDeactivating(false);
      setActionsOpen(false);
    }
  };

  if (isLoading) {
    return <div className="py-12 text-center text-sm text-zinc-500">Loading employee profile...</div>;
  }

  if (isError || !emp) {
    return (
      <div className="flex flex-col gap-3">
        <Button variant="ghost" className="w-fit text-xs h-7 px-2" onClick={() => router.push('/company/employees')}>
          <ArrowLeft size={14} className="mr-1" /> Back to Employees
        </Button>
        <div className="py-8 text-center text-sm text-rose-600 border border-dashed rounded-lg">
          {(error as any)?.response?.data?.message || 'Employee not found.'}
        </div>
      </div>
    );
  }

  const isActive = emp.employmentStatus !== 'ex' && emp.isActive !== false;

  return (
    <div className="flex flex-col gap-2 animate-in fade-in duration-300 pb-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="w-fit text-xs h-7 px-2" onClick={() => router.push('/company/employees')}>
          <ArrowLeft size={14} className="mr-1" /> Back to Employees
        </Button>
        <div className="flex items-center gap-2 relative">
          <Link href={`/company/employees?edit=${emp._id}`}>
            <Button variant="outline" className="h-8 text-xs">
              <Pencil size={13} className="mr-1.5" /> Edit Employee
            </Button>
          </Link>
          <Button className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setActionsOpen((o) => !o)}>
            More Actions <ChevronDown size={13} className="ml-1.5" />
          </Button>
          {actionsOpen && (
            <div className="absolute right-0 top-9 z-10 w-52 rounded-md border border-zinc-200 bg-white shadow-lg py-1 dark:bg-zinc-900 dark:border-zinc-800">
              <Link
                href={`/company/attendance/individual/${emp._id}`}
                className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                onClick={() => setActionsOpen(false)}
              >
                <History size={13} /> View Full Attendance
              </Link>
              <button
                type="button"
                disabled={deactivating}
                onClick={deactivate}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              >
                <ShieldCheck size={13} /> {deactivating ? 'Deactivating...' : 'Deactivate Employee'}
              </button>
            </div>
          )}
        </div>
      </div>

      <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Employee Profile</h1>

      <ProfileHeader emp={emp} isActive={isActive} />

      {/* Tabs hidden for now — re-enable once the non-Overview tabs are ready.
      <div className="flex rounded-md border border-zinc-200 bg-zinc-50 p-0.5 overflow-x-auto dark:border-zinc-800 dark:bg-zinc-900/40">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`h-7 shrink-0 rounded px-3 text-[11px] font-medium transition-colors whitespace-nowrap ${tab === t.key ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      */}

      {tab === 'overview' && <OverviewTab emp={emp} />}
      {/*
      {tab === 'personal' && <PersonalInfoTab emp={emp} />}
      {tab === 'job' && <JobDetailsTab emp={emp} />}
      {tab === 'documents' && <DocumentsTab />}
      {tab === 'attendance' && <AttendanceTab emp={emp} />}
      {tab === 'leave' && <LeaveTab emp={emp} />}
      {tab === 'assets' && <AssetsTab emp={emp} />}
      {tab === 'emergency' && <EmergencyTab emp={emp} />}
      {tab === 'policies' && <PoliciesTab emp={emp} />}
      */}
    </div>
  );
}

function ProfileHeader({ emp, isActive }: { emp: any; isActive: boolean }) {
  const [photoOpen, setPhotoOpen] = useState(false);

  return (
    <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-4">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => emp.profilePictureUrl && setPhotoOpen(true)}
              className={emp.profilePictureUrl ? 'cursor-pointer' : 'cursor-default'}
              aria-label="View profile photo"
            >
              <Avatar emp={emp} size="xl" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-md text-zinc-900 dark:text-zinc-50 truncate">{emp.firstName} {emp.lastName}</h2>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-md ${isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-200 text-zinc-600'}`}>
                  {isActive ? 'Active' : 'Ex Employee'}
                </span>
              </div>
              <div className="text-xs text-zinc-500">{refName(emp.designationId)}</div>
              <div className="mt-2 space-y-1 text-[11px] text-zinc-500">
                <div className="flex items-center gap-1.5"><Mail size={12} /> {emp.email}{emp.mobileNumber ? ` • ${emp.mobileNumber}` : ''}</div>
                {emp.employeeCode && <div className="flex items-center gap-1.5"><CreditCard size={12} /> {emp.employeeCode}</div>}
                <div className="flex items-center gap-1.5"><CalendarCheck size={12} /> Joined on {fmtDate(emp.dateOfJoining)}</div>
                <div className="flex items-center gap-1.5"><Building2 size={12} /> {companyName(emp.company)}</div>
                {emp.branchId && <div className="flex items-center gap-1.5"><MapPin size={12} /> {branchAddress(emp.branchId)}</div>}
                <div className="flex items-center gap-1.5"><Briefcase size={12} /> {refName(emp.jobLevelId)}</div>
                <div className="flex items-center gap-1.5"><Mail size={12} /> {emp.email}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs border-t lg:border-t-0 lg:border-l border-zinc-100 dark:border-zinc-800 pt-3 lg:pt-0 lg:pl-6">
            <HeaderField label="Company" value={companyName(emp.company)} />
            <HeaderField label="Branch" value={branchLabel(emp.branchId)} />
            <HeaderField label="Department" value={refName(emp.departmentId)} />
            <HeaderField label="Date of Birth" value={fmtDate(emp.dateOfBirth)} />
            <HeaderField label="Designation" value={refName(emp.designationId)} />
            <HeaderField label="Gender" value={emp.gender ? emp.gender[0].toUpperCase() + emp.gender.slice(1) : '-'} />
            <HeaderField label="Reporting To" value={fullName(emp.reportingToId)} />
            <HeaderField label="Blood Group" value={emp.bloodGroup || '-'} />
            <HeaderField label="Employment Type" value={emp.employmentStatus === 'ex' ? 'Ex Employee' : 'Full Time'} />
            <HeaderField label="Marital Status" value={emp.maritalStatus ? emp.maritalStatus[0].toUpperCase() + emp.maritalStatus.slice(1) : '-'} />
          </div>
        </div>
      </CardContent>

      {photoOpen && emp.profilePictureUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4"
          onClick={() => setPhotoOpen(false)}
        >
          <button
            type="button"
            onClick={() => setPhotoOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
            aria-label="Close"
          >
            <X size={24} />
          </button>
          <img
            src={emp.profilePictureUrl}
            alt={`${emp.firstName} ${emp.lastName}`}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </Card>
  );
}

function HeaderField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] text-zinc-400 uppercase tracking-wider">{label}</div>
      <div className="text-zinc-800 dark:text-zinc-200 truncate">{value}</div>
    </div>
  );
}

function Avatar({ emp, size = 'default' }: { emp: any; size?: 'default' | 'xl' }) {
  const cls = size === 'xl' ? 'w-16 h-16 text-lg' : 'w-8 h-8 text-xs';
  if (emp?.profilePictureUrl) {
    return <img src={emp.profilePictureUrl} alt="" className={`${cls} rounded-full object-cover shrink-0`} />;
  }
  const initials = emp?.firstName ? emp.firstName[0].toUpperCase() : '?';
  return (
    <div className={`${cls} shrink-0 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-medium border border-indigo-200/50`}>
      {initials}
    </div>
  );
}

function SectionCard({ icon, title, action, children, bodyClassName, cardClassName }: { icon: React.ReactNode; title: string; action?: React.ReactNode; children: React.ReactNode; bodyClassName?: string; cardClassName?: string }) {
  return (
    <Card className={`border-zinc-200/80 shadow-sm dark:border-zinc-800 flex flex-col ${cardClassName || ''}`}>
      <CardHeader className="py-2.5 px-3 flex flex-row items-center justify-between space-y-0 shrink-0">
        <CardTitle className="text-xs flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
          {icon} {title}
        </CardTitle>
        {action}
      </CardHeader>
      <CardContent className={`px-3 pb-3 pt-0 overflow-y-auto custom-scrollbar ${bodyClassName || ''}`}>{children}</CardContent>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] text-zinc-400 uppercase tracking-wider">{label}</div>
      <div className="text-xs text-zinc-800 dark:text-zinc-200 truncate">{value || '-'}</div>
    </div>
  );
}

function OverviewTab({ emp }: { emp: any }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-2 items-stretch">
      <div className="xl:col-span-4 flex flex-col gap-2">
        <PersonalInfoCard emp={emp} bodyClassName="h-44" />
        <AddressCard emp={emp} bodyClassName="h-28" />
        <div className="flex-1 min-h-[80px]">
          <CompanyBranchAddressCard emp={emp} cardClassName="h-full" bodyClassName="flex-1" />
        </div>
        <IdentificationCard emp={emp} bodyClassName="h-16" />
      </div>
      <div className="xl:col-span-4 flex flex-col gap-2">
        <div className="flex-1 min-h-[200px]">
          <AttendanceSummaryCard emp={emp} cardClassName="h-full" />
        </div>
      </div>
      <div className="xl:col-span-4 flex flex-col gap-2">
        <LeaveBalanceCard emp={emp} />
        <EmploymentStatusCard emp={emp} bodyClassName="h-36" />
        <div className="flex-1 min-h-[64px]">
          <EmergencyContactCard emp={emp} cardClassName="h-full" bodyClassName="flex-1" />
        </div>
      </div>
      <div className="xl:col-span-6">
        <AssetsAllocatedCard emp={emp} bodyClassName="h-32" />
      </div>
      <div className="xl:col-span-6">
        <InventoryAllocatedCard emp={emp} bodyClassName="h-32" />
      </div>
    </div>
  );
}

function PersonalInfoCard({ emp, bodyClassName }: { emp: any; bodyClassName?: string }) {
  return (
    <SectionCard icon={<User size={13} className="text-indigo-600" />} title="Personal Information" bodyClassName={bodyClassName}>
      <div className="grid grid-cols-2 gap-2">
        <InfoRow label="Date of Birth" value={fmtDate(emp.dateOfBirth)} />
        <InfoRow label="Mobile Number" value={emp.mobileNumber} />
        <InfoRow label="Gender" value={emp.gender} />
        <InfoRow label="Email" value={emp.email} />
        <InfoRow label="Blood Group" value={emp.bloodGroup} />
        <InfoRow label="Aadhaar Number" value={emp.aadhaarNumber} />
        <InfoRow label="Marital Status" value={emp.maritalStatus} />
        <InfoRow label="PAN Number" value={emp.panNumber} />
      </div>
    </SectionCard>
  );
}

function AddressCard({ emp, bodyClassName }: { emp: any; bodyClassName?: string }) {
  return (
    <SectionCard icon={<MapPin size={13} className="text-indigo-600" />} title="Address Information" bodyClassName={bodyClassName}>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Current Address</div>
          <div className="text-xs text-zinc-700 dark:text-zinc-300">{emp.currentAddress || '-'}</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">{[emp.currentCity, emp.currentState, emp.currentPincode].filter(Boolean).join(', ')}</div>
        </div>
        <div>
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Permanent Address</div>
          <div className="text-xs text-zinc-700 dark:text-zinc-300">{emp.permanentAddress || '-'}</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">{[emp.permanentCity, emp.permanentState, emp.permanentPincode].filter(Boolean).join(', ')}</div>
        </div>
      </div>
    </SectionCard>
  );
}

function CompanyBranchAddressCard({ emp, bodyClassName, cardClassName }: { emp: any; bodyClassName?: string; cardClassName?: string }) {
  return (
    <SectionCard icon={<Building2 size={13} className="text-indigo-600" />} title="Company & Branch Address" bodyClassName={bodyClassName} cardClassName={cardClassName}>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Company Headquarters</div>
          <div className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">{companyName(emp.company)}</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">{companyAddress(emp.company)}</div>
        </div>
        <div>
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Branch</div>
          <div className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">{refName(emp.branchId)}</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">{branchAddress(emp.branchId)}</div>
        </div>
      </div>
    </SectionCard>
  );
}

function IdentificationCard({ emp, bodyClassName, cardClassName }: { emp: any; bodyClassName?: string; cardClassName?: string }) {
  return (
    <SectionCard icon={<CreditCard size={13} className="text-indigo-600" />} title="Identification Numbers" bodyClassName={bodyClassName} cardClassName={cardClassName}>
      <div className="grid grid-cols-3 gap-2">
        <InfoRow label="PAN Number" value={emp.panNumber} />
        <InfoRow label="Aadhaar Number" value={emp.aadhaarNumber} />
        <InfoRow label="UAN Number" value={emp.uanNumber} />
      </div>
    </SectionCard>
  );
}

function AttendanceSummaryCard({ emp, cardClassName }: { emp: any; cardClassName?: string }) {
  const summary = emp.attendanceSummary || {};
  return (
    <SectionCard
      icon={<CalendarCheck size={13} className="text-indigo-600" />}
      title="Attendance Summary"
      action={<span className="text-[10px] text-zinc-400">This Month</span>}
      cardClassName={cardClassName}
      bodyClassName="flex flex-col flex-1"
    >
      <div className="grid grid-cols-4 gap-1.5 mb-3 shrink-0">
        <Stat label="Total Working Days" value={summary.totalWorkingDays ?? 0} tone="zinc" />
        <Stat label="Days Present" value={summary.daysPresent ?? 0} tone="emerald" />
        <Stat label="Day Absent" value={summary.daysAbsent ?? 0} tone="rose" />
        <Stat label="Day Leave" value={summary.daysLeave ?? 0} tone="amber" />
      </div>
      <div className="rounded-md bg-indigo-50 text-indigo-700 text-center text-xs font-md py-1.5 mb-3 shrink-0 dark:bg-indigo-950/30 dark:text-indigo-300">
        {summary.attendancePercentage ?? 0}% Attendance
      </div>
      <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1.5 shrink-0">Recent Attendance</div>
      <div className={`flex-1 min-h-0 overflow-y-auto custom-scrollbar ${(summary.recentAttendance || []).length === 0 ? 'flex items-center justify-center' : 'space-y-1'}`}>
        {(summary.recentAttendance || []).length === 0 && (
          <div className="text-xs text-zinc-400 text-center">No attendance records yet.</div>
        )}
        {(summary.recentAttendance || []).map((rec: any) => (
          <div key={rec._id} className="flex items-center justify-between text-xs py-1 border-b border-zinc-50 last:border-0 dark:border-zinc-800/50">
            <span className="text-zinc-700 dark:text-zinc-300">{moment(rec.date).format('DD MMM, ddd')}</span>
            <StatusPill status={rec.status} />
            <span className="text-zinc-500">{rec.totalHours ? `${rec.totalHours.toFixed(2)}h` : '-'}</span>
          </div>
        ))}
      </div>
      <Link href={`/company/attendance/individual/${emp._id}`} className="block text-center text-[11px] text-indigo-600 hover:underline mt-2 shrink-0">
        View All Attendance
      </Link>
    </SectionCard>
  );
}

function Stat({ label, value, tone }: { label: string; value: number | string; tone: 'zinc' | 'emerald' | 'rose' | 'amber' }) {
  const tones: Record<string, string> = {
    zinc: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
    emerald: 'bg-emerald-100 text-emerald-700',
    rose: 'bg-rose-100 text-rose-700',
    amber: 'bg-amber-100 text-amber-700',
  };
  return (
    <div className={`rounded-md ${tones[tone]} px-1 py-1.5 text-center`}>
      <div className="text-sm font-md leading-tight">{value}</div>
      <div className="text-[9px] leading-tight mt-0.5">{label}</div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Present: 'bg-emerald-100 text-emerald-800',
    Absent: 'bg-rose-100 text-rose-800',
    'Half-Day': 'bg-amber-100 text-amber-800',
    'On Leave': 'bg-indigo-100 text-indigo-800',
  };
  return <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-md ${map[status] || 'bg-zinc-100 text-zinc-700'}`}>{status}</span>;
}

function LeaveBalanceCard({ emp, bodyClassName }: { emp: any; bodyClassName?: string }) {
  const leaveBalance = emp.leaveBalance || [];
  if (leaveBalance.length === 0) {
    return (
      <SectionCard icon={<Wallet size={13} className="text-indigo-600" />} title="Leave Balance" bodyClassName={bodyClassName}>
        <div className="h-full flex items-center justify-center text-xs text-zinc-400 text-center">No leave types configured yet.</div>
      </SectionCard>
    );
  }
  return (
    <SectionCard icon={<Wallet size={13} className="text-indigo-600" />} title="Leave Balance" bodyClassName={bodyClassName}>
      <div className="space-y-2">
        {leaveBalance.map((lb: any) => {
          const pct = lb.totalDays > 0 ? Math.min(100, (lb.balanceDays / lb.totalDays) * 100) : 0;
          return (
            <div key={lb.leaveTypeId}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-zinc-700 dark:text-zinc-300">{lb.leaveType}</span>
                <span className="text-zinc-500">{lb.balanceDays} of {lb.totalDays} available{lb.usedDays > 0 ? ` · ${lb.usedDays} used` : ''}</span>
              </div>
              <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

function EmploymentStatusCard({ emp, bodyClassName }: { emp: any; bodyClassName?: string }) {
  const isActive = emp.employmentStatus !== 'ex' && emp.isActive !== false;
  return (
    <SectionCard icon={<ShieldCheck size={13} className="text-indigo-600" />} title="Employment Status" bodyClassName={bodyClassName}>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Status</div>
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-md mt-0.5 ${isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-200 text-zinc-600'}`}>
            {isActive ? 'Active' : 'Ex Employee'}
          </span>
        </div>
        <InfoRow label="Date of Joining" value={fmtDate(emp.dateOfJoining)} />
        <InfoRow label="Company" value={companyName(emp.company)} />
        <InfoRow label="Branch" value={branchLabel(emp.branchId)} />
        <InfoRow label="Work Address" value={branchAddress(emp.branchId)} />
        <InfoRow label="Attendance Rule" value={refName(emp.attendanceRuleId)} />
      </div>
    </SectionCard>
  );
}

function EmergencyContactCard({ emp, bodyClassName, cardClassName }: { emp: any; bodyClassName?: string; cardClassName?: string }) {
  return (
    <SectionCard icon={<Phone size={13} className="text-indigo-600" />} title="Emergency Contact" bodyClassName={bodyClassName} cardClassName={cardClassName}>
      <div className="grid grid-cols-3 gap-2">
        <InfoRow label="Name" value={emp.emergencyContactName} />
        <InfoRow label="Relation" value={emp.emergencyContactRelation} />
        <InfoRow label="Contact Number" value={emp.emergencyContactNumber} />
      </div>
    </SectionCard>
  );
}

function AssetsAllocatedCard({ emp, bodyClassName }: { emp: any; bodyClassName?: string }) {
  const assets = emp.assetsAllocated || [];
  return (
    <SectionCard icon={<Laptop size={13} className="text-indigo-600" />} title="Assets Allocated" bodyClassName={bodyClassName}>
      {assets.length === 0 ? (
        <div className="h-full flex items-center justify-center text-xs text-zinc-400 text-center">No assets allocated.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {assets.map((asset: any) => (
            <div key={asset._id} className="rounded-md border border-zinc-200 dark:border-zinc-800 px-2.5 py-2 flex items-center gap-2">
              <Laptop size={14} className="text-zinc-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-md text-zinc-800 dark:text-zinc-200 truncate">{asset.name}</div>
                <div className="text-[10px] text-zinc-500 truncate">{asset.type}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

function InventoryAllocatedCard({ emp, bodyClassName }: { emp: any; bodyClassName?: string }) {
  const inventory = emp.inventoryAllocated || [];
  return (
    <SectionCard icon={<Package size={13} className="text-indigo-600" />} title="Inventory Allocated" bodyClassName={bodyClassName}>
      {inventory.length === 0 ? (
        <div className="h-full flex items-center justify-center text-xs text-zinc-400 text-center">No inventory allocated.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {inventory.map((item: any) => (
            <div key={item._id} className="rounded-md border border-zinc-200 dark:border-zinc-800 px-2.5 py-2 flex items-center gap-2">
              <Package size={14} className="text-zinc-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-md text-zinc-800 dark:text-zinc-200 truncate">{item.name}</div>
                <div className="text-[10px] text-zinc-500 truncate">{item.category}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

function PersonalInfoTab({ emp }: { emp: any }) {
  return (
    <div className="flex flex-col gap-2 max-w-3xl">
      <PersonalInfoCard emp={emp} />
      <AddressCard emp={emp} />
      <IdentificationCard emp={emp} />
    </div>
  );
}

function JobDetailsTab({ emp }: { emp: any }) {
  return (
    <SectionCard icon={<Briefcase size={13} className="text-indigo-600" />} title="Job Details">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <InfoRow label="Employee Code" value={emp.employeeCode} />
        <InfoRow label="Date of Joining" value={fmtDate(emp.dateOfJoining)} />
        <InfoRow label="Employment Status" value={emp.employmentStatus === 'ex' ? 'Ex Employee' : 'Active'} />
        <InfoRow label="Company" value={companyName(emp.company)} />
        <InfoRow label="Branch" value={branchLabel(emp.branchId)} />
        <InfoRow label="Work Address" value={branchAddress(emp.branchId)} />
        <InfoRow label="Department" value={refName(emp.departmentId)} />
        <InfoRow label="Designation" value={refName(emp.designationId)} />
        <InfoRow label="Job Level" value={refName(emp.jobLevelId)} />
        <InfoRow label="Reporting To" value={fullName(emp.reportingToId)} />
        <InfoRow label="System Role" value={refName(emp.roleId)} />
      </div>
    </SectionCard>
  );
}

function DocumentsTab() {
  return (
    <SectionCard icon={<ScrollText size={13} className="text-indigo-600" />} title="Documents">
      <div className="text-xs text-zinc-400 py-6 text-center">No documents uploaded for this employee yet.</div>
    </SectionCard>
  );
}

function AttendanceTab({ emp }: { emp: any }) {
  const summary = emp.attendanceSummary || {};
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
        <Stat label="Total Working Days" value={summary.totalWorkingDays ?? 0} tone="zinc" />
        <Stat label="Days Present" value={summary.daysPresent ?? 0} tone="emerald" />
        <Stat label="Day Absent" value={summary.daysAbsent ?? 0} tone="rose" />
        <Stat label="Day Leave" value={summary.daysLeave ?? 0} tone="amber" />
        <Stat label="Attendance %" value={`${summary.attendancePercentage ?? 0}%`} tone="zinc" />
      </div>
      <SectionCard
        icon={<History size={13} className="text-indigo-600" />}
        title="Recent Attendance"
        action={<Link href={`/company/attendance/individual/${emp._id}`} className="text-[11px] text-indigo-600 hover:underline">View All</Link>}
      >
        <div className="space-y-1">
          {(summary.recentAttendance || []).length === 0 && (
            <div className="text-xs text-zinc-400 py-3 text-center">No attendance records yet.</div>
          )}
          {(summary.recentAttendance || []).map((rec: any) => (
            <div key={rec._id} className="flex items-center justify-between text-xs py-1.5 border-b border-zinc-50 last:border-0 dark:border-zinc-800/50">
              <span className="text-zinc-700 dark:text-zinc-300">{moment(rec.date).format('DD MMM YYYY, ddd')}</span>
              <StatusPill status={rec.status} />
              <span className="text-zinc-500">{rec.totalHours ? `${rec.totalHours.toFixed(2)}h` : '-'}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function LeaveTab({ emp }: { emp: any }) {
  return (
    <SectionCard icon={<Wallet size={13} className="text-indigo-600" />} title="Leave Balance">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(emp.leaveBalance || []).length === 0 && <div className="text-xs text-zinc-400 py-3 text-center col-span-2">No leave credits recorded.</div>}
        {(emp.leaveBalance || []).map((lb: any) => (
          <div key={lb.leaveTypeId} className="rounded-md border border-zinc-200 dark:border-zinc-800 p-3">
            <div className="text-xs font-md text-zinc-800 dark:text-zinc-200 mb-1">{lb.leaveType}</div>
            <div className="flex items-center justify-between text-[11px] text-zinc-500">
              <span>Total: {lb.totalDays}</span>
              <span>Used: {lb.usedDays}</span>
              <span>Available: {lb.balanceDays}</span>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function AssetsTab({ emp }: { emp: any }) {
  return (
    <div className="flex flex-col gap-2">
      <AssetsAllocatedCard emp={emp} />
      <InventoryAllocatedCard emp={emp} />
    </div>
  );
}

function EmergencyTab({ emp }: { emp: any }) {
  return (
    <div className="max-w-xl">
      <EmergencyContactCard emp={emp} />
    </div>
  );
}

function PoliciesTab({ emp }: { emp: any }) {
  const policies = Array.isArray(emp.policyIds) ? emp.policyIds : (emp.policyId ? [emp.policyId] : []);
  return (
    <SectionCard icon={<ScrollText size={13} className="text-indigo-600" />} title="Policies & Compliance">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <InfoRow label="Attendance Rule" value={refName(emp.attendanceRuleId)} />
        <InfoRow label="Holiday Group" value={refName(emp.holidayGroupId)} />
      </div>
      <div className="mt-3">
        <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1.5">Assigned Policies</div>
        {policies.length === 0 ? (
          <div className="text-xs text-zinc-400 py-2">No policies assigned.</div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {policies.map((p: any) => (
              <span key={p._id} className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                {p.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </SectionCard>
  );
}
