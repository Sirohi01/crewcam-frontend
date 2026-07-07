'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import {
  Settings as SettingsIcon, ChevronRight, User, ShieldCheck, Bell, SlidersHorizontal, CloudCog,
  UserCircle, Lock, Laptop, Smartphone, Code2,
  CalendarDays, Clock, IndianRupee, Wallet, FileText,
  Globe, Clock3, Palette, LayoutDashboard, Mail,
  LifeBuoy, Download, ScrollText,
  Monitor, ClipboardList, Network, UserCog, GitBranch, CheckCircle2,
} from 'lucide-react';

const highlightCards = [
  { title: 'My Account', desc: 'Profile & Personal Info', cta: 'Manage Profile', href: '/dashboard/my-profile', icon: User, bg: 'bg-blue-100', fg: 'text-blue-600' },
  { title: 'Security', desc: 'Password & 2FA', cta: 'Manage Security', href: '/dashboard/settings/security', icon: ShieldCheck, bg: 'bg-emerald-100', fg: 'text-emerald-600' },
  { title: 'Notifications', desc: 'Alerts & Reminders', cta: 'Manage Alerts', href: '/dashboard/notifications', icon: Bell, bg: 'bg-purple-100', fg: 'text-purple-600' },
  { title: 'Preferences', desc: 'Display & Language', cta: 'Manage Preferences', href: '/dashboard/coming-soon', icon: SlidersHorizontal, bg: 'bg-orange-100', fg: 'text-orange-600' },
  { title: 'Data & Privacy', desc: 'Backup & Data Control', cta: 'Manage Data', href: '/dashboard/coming-soon', icon: CloudCog, bg: 'bg-cyan-100', fg: 'text-cyan-600' },
];

const accountAccess = [
  { title: 'Personal Information', desc: 'Update your personal details', href: '/dashboard/my-profile', icon: UserCircle, bg: 'bg-blue-100', fg: 'text-blue-600' },
  { title: 'Change Password', desc: 'Update your login password', href: '/dashboard/settings/security', icon: Lock, bg: 'bg-emerald-100', fg: 'text-emerald-600' },
  { title: 'Two-Factor Authentication', desc: 'Add extra layer of account security', href: '/dashboard/settings/security', icon: ShieldCheck, bg: 'bg-purple-100', fg: 'text-purple-600' },
  { title: 'Login Sessions', desc: 'Manage active sessions', href: '/dashboard/settings/sessions', icon: Laptop, bg: 'bg-orange-100', fg: 'text-orange-600' },
  { title: 'Device Management', desc: 'Manage trusted devices', href: '/dashboard/coming-soon', icon: Smartphone, bg: 'bg-cyan-100', fg: 'text-cyan-600' },
  { title: 'API Access', desc: 'Manage API keys and integrations', href: '/dashboard/coming-soon', icon: Code2, bg: 'bg-rose-100', fg: 'text-rose-600' },
];

const hrmsConfig = [
  { title: 'Leave Settings', desc: 'Configure leave types and policies', href: '/dashboard/leaves', icon: CalendarDays, bg: 'bg-emerald-100', fg: 'text-emerald-600' },
  { title: 'Attendance Settings', desc: 'Work hours & attendance rules', href: '/dashboard/attendance', icon: Clock, bg: 'bg-blue-100', fg: 'text-blue-600' },
  { title: 'Holiday Calendar', desc: 'Manage company holidays', href: '/dashboard/coming-soon', icon: CalendarDays, bg: 'bg-orange-100', fg: 'text-orange-600' },
  { title: 'Payroll Settings', desc: 'Salary components & process', href: '/dashboard/finance/payroll', icon: IndianRupee, bg: 'bg-purple-100', fg: 'text-purple-600' },
  { title: 'Reimbursement Settings', desc: 'Approval limits & categories', href: '/dashboard/finance/expenses', icon: Wallet, bg: 'bg-cyan-100', fg: 'text-cyan-600' },
  { title: 'Tax & Compliance', desc: 'TDS, PF, ESI & other compliance', href: '/dashboard/coming-soon', icon: FileText, bg: 'bg-blue-100', fg: 'text-blue-600' },
];

const systemPreferences = [
  { title: 'Language & Region', href: '/dashboard/coming-soon', icon: Globe },
  { title: 'Date & Time Format', href: '/dashboard/coming-soon', icon: Clock3 },
  { title: 'Theme & Display', href: '/dashboard/coming-soon', icon: Palette },
  { title: 'Dashboard Customization', href: '/dashboard/coming-soon', icon: LayoutDashboard },
  { title: 'Email Preferences', href: '/dashboard/coming-soon', icon: Mail },
];

const supportOthers = [
  { title: 'Helpdesk Settings', desc: 'Manage ticket categories & SLAs', href: '/dashboard/support/helpdesk', icon: LifeBuoy, bg: 'bg-rose-100', fg: 'text-rose-600', shape: 'circle' as const },
  { title: 'Notification Templates', desc: 'Customize email & SMS templates', href: '/dashboard/coming-soon', icon: Bell, bg: 'bg-blue-100', fg: 'text-blue-600', shape: 'circle' as const },
  { title: 'Import / Export Data', desc: 'Import or export system data', href: '/dashboard/coming-soon', icon: Download, bg: 'bg-emerald-100', fg: 'text-emerald-600', shape: 'circle' as const },
  { title: 'Audit Logs', desc: 'View system activity logs', href: '/dashboard/coming-soon', icon: ScrollText, bg: 'bg-gray-100', fg: 'text-gray-600', shape: 'circle' as const },
];

const quickShortcuts = [
  { title: 'Company Profile', href: '/dashboard/settings/company', icon: ClipboardList, bg: 'bg-blue-100', fg: 'text-blue-600' },
  { title: 'Organization Structure', href: '/dashboard/branches', icon: Network, bg: 'bg-purple-100', fg: 'text-purple-600' },
  { title: 'Roles & Permissions', href: '/dashboard/settings/roles', icon: UserCog, bg: 'bg-orange-100', fg: 'text-orange-600' },
  { title: 'Employee Onboarding', href: '/dashboard/employees', icon: FileText, bg: 'bg-blue-100', fg: 'text-blue-600' },
  { title: 'Workflows & Approvals', href: '/dashboard/coming-soon', icon: GitBranch, bg: 'bg-emerald-100', fg: 'text-emerald-600' },
];

const systemInfo = [
  { label: 'HRMS Version', value: 'v2.6.1' },
  { label: 'Last Updated', value: '24 May 2024' },
  { label: 'Database Status', value: 'Healthy' },
  { label: 'Storage Used', value: '62%' },
  { label: 'Support Email', value: 'support@crewcam.com', isLink: true },
];

function ListRow({ title, desc, href, icon: Icon, bg, fg, shape = 'square' }: { title: string; desc?: string; href: string; icon: any; bg?: string; fg?: string; shape?: 'square' | 'circle' }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-2 rounded-xl border border-gray-100 bg-white p-2 hover:border-gray-200 hover:bg-gray-50/60 transition-colors"
    >
      <div className="flex items-center gap-2 min-w-0">
        <div className={`w-8 h-8 ${shape === 'circle' ? 'rounded-full' : 'rounded-xl'} ${bg || 'bg-gray-100'} flex items-center justify-center shrink-0`}>
          <Icon size={16} className={fg || 'text-gray-600'} />
        </div>
        <div className="min-w-0">
          <p className="text-[12.5px] font-semibold text-gray-900 truncate leading-tight">{title}</p>
          {desc && <p className="text-[11px] text-gray-500 truncate leading-tight">{desc}</p>}
        </div>
      </div>
      <ChevronRight size={15} className="text-gray-400 shrink-0" />
    </Link>
  );
}

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto w-full max-w-[1280px] px-2 pb-2 pt-1 space-y-1.5">

        {/* Breadcrumb & Header */}
        <div>
          <div className="flex items-center text-[12px] text-gray-500 mb-0.5">
            <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
            <ChevronRight size={14} className="mx-1" />
            <span className="font-medium text-gray-900">Settings</span>
          </div>
          <h1 className="text-[24px] font-bold text-gray-900 leading-tight flex items-center gap-2">
            Settings
            <span className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
              <SettingsIcon size={15} className="text-blue-600" />
            </span>
          </h1>
          <p className="text-[12px] text-gray-500 mt-1">Manage your account, preferences and system configurations.</p>
        </div>

        {/* Highlight cards row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5">
          {highlightCards.map(({ title, desc, cta, href, icon: Icon, bg, fg }) => (
            <Card key={title} className="border-gray-200 shadow-sm rounded-xl bg-white hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-2 flex items-start gap-1.5">
                <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                  <Icon size={15} className={fg} />
                </div>
                <div className="min-w-0">
                  <p className="text-[12.5px] font-bold text-gray-900 leading-tight">{title}</p>
                  <p className="text-[10.5px] text-gray-500 leading-tight mt-0.5 mb-1">{desc}</p>
                  <Link href={href} className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${fg} hover:underline`}>
                    {cta} <ChevronRight size={11} />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main grid: left (2/3) + right (1/3) */}
        <div className="flex flex-col xl:flex-row gap-1.5">
          {/* Left column */}
          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
            <Card className="border-gray-200 shadow-sm rounded-xl bg-white">
              <CardContent className="p-2">
                <h3 className="text-[14px] font-bold text-gray-900 mb-1.5">Account & Access</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                  {accountAccess.map((item) => <ListRow key={item.title} {...item} />)}
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm rounded-xl bg-white flex-1 flex flex-col">
              <CardContent className="p-2 flex-1 flex flex-col justify-center">
                <h3 className="text-[14px] font-bold text-gray-900 mb-1.5">HRMS Configuration</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                  {hrmsConfig.map((item) => <ListRow key={item.title} {...item} />)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="w-full xl:w-[420px] shrink-0 flex flex-col gap-1.5">
            <Card className="border-gray-200 shadow-sm rounded-xl bg-white">
              <CardContent className="p-2">
                <h3 className="text-[14px] font-bold text-gray-900 mb-1.5">System Preferences</h3>
                <div className="flex items-stretch gap-1.5">
                  <div className="w-1/2 shrink-0 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                    <Monitor size={44} className="text-blue-300" />
                  </div>
                  <div className="w-1/2 min-w-0">
                    {systemPreferences.map(({ title, href, icon: Icon }) => (
                      <Link key={title} href={href} className="flex items-center justify-between gap-2 py-0.5 px-1 rounded-lg hover:bg-gray-50 transition-colors">
                        <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-blue-600 truncate">
                          <Icon size={14} className="shrink-0" />
                          <span className="truncate">{title}</span>
                        </span>
                        <ChevronRight size={13} className="text-gray-400 shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm rounded-xl bg-white flex-1 flex flex-col">
              <CardContent className="p-2 flex-1 flex flex-col justify-center">
                <h3 className="text-[14px] font-bold text-gray-900 mb-1.5">Support & Others</h3>
                <div className="space-y-1">
                  {supportOthers.map((item) => <ListRow key={item.title} {...item} />)}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col lg:flex-row gap-1.5">
          <Card className="flex-1 border-gray-200 shadow-sm rounded-xl bg-white">
            <CardContent className="p-2">
              <h3 className="text-[14px] font-bold text-gray-900 mb-2">System Information</h3>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="w-full sm:w-40 h-28 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center shrink-0">
                  <Monitor size={36} className="text-blue-300" />
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 w-full">
                  {systemInfo.map(({ label, value, isLink }) => (
                    <div key={label} className="flex items-center gap-2 text-[13px]">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span className="text-gray-500">{label}</span>
                      <span className={`ml-auto font-semibold ${isLink ? 'text-blue-600' : 'text-gray-900'}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1 border-gray-200 shadow-sm rounded-xl bg-white">
            <CardContent className="p-2">
              <h3 className="text-[14px] font-bold text-gray-900 mb-2">Quick Shortcuts</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5">
                {quickShortcuts.map(({ title, href, icon: Icon, bg, fg }) => (
                  <Link
                    key={title}
                    href={href}
                    className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-gray-50/80 p-2 text-center hover:bg-gray-100 transition-colors"
                  >
                    <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}>
                      <Icon size={20} className={fg} />
                    </div>
                    <p className="text-[11.5px] font-semibold text-gray-900 leading-tight">{title}</p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
