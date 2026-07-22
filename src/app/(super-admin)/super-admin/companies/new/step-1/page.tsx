'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard, Building2, Users, TrendingUp, Receipt, CreditCard,
  BarChart3, Sparkles, LifeBuoy, Rocket, Target, Plug, FileBarChart,
  Settings, Search, Bell, Headphones, ChevronDown, ChevronRight, Home,
  Check, Crown, UploadCloud, Info, MapPin, Building, Menu,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// ─── Types ──────────────────────────────────────────────────────────────────
interface Step {
  id: number;
  title: string;
  subtitle: string;
}

interface NavItem {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

// ─── Static data ────────────────────────────────────────────────────────────
const STEPS: Step[] = [
  { id: 1, title: 'Basic Information', subtitle: 'Company details' },
  { id: 2, title: 'Subscription & Plan', subtitle: 'Choose plan' },
  { id: 3, title: 'Admin & Contact', subtitle: 'Primary contact details' },
  { id: 4, title: 'Configuration', subtitle: 'System preferences' },
  { id: 5, title: 'Review & Confirm', subtitle: 'Verify and create' },
];

const NAV_ITEMS: NavItem[] = [
  { label: 'Control Center', icon: <LayoutDashboard size={17} /> },
  { label: 'Companies', icon: <Building2 size={17} />, active: true },
  { label: 'Workforce', icon: <Users size={17} /> },
  { label: 'Revenue & Finance', icon: <TrendingUp size={17} /> },
  { label: 'Billing & Invoices', icon: <Receipt size={17} /> },
  { label: 'Subscriptions', icon: <CreditCard size={17} /> },
  { label: 'Analytics', icon: <BarChart3 size={17} /> },
  { label: 'AI Insights', icon: <Sparkles size={17} /> },
  { label: 'Support Center', icon: <LifeBuoy size={17} /> },
  { label: 'Implementations', icon: <Rocket size={17} /> },
  { label: 'Sales CRM', icon: <Target size={17} /> },
  { label: 'Integrations', icon: <Plug size={17} /> },
  { label: 'Reports', icon: <FileBarChart size={17} /> },
  { label: 'Settings', icon: <Settings size={17} /> },
];

const PLATFORM_STATUS = [
  { label: 'System', ok: true },
  { label: 'API Services', ok: true },
  { label: 'Database', ok: true },
  { label: 'Email Service', ok: true },
  { label: 'SMS Gateway', ok: true },
  { label: 'WhatsApp', ok: true },
];

const PLAN_FEATURES = [
  'Unlimited Employees',
  'All HRMS Modules',
  'Advanced Analytics & Reports',
  'AI Insights & Predictions',
  'API Access & Integrations',
  'Multi-Location Support',
  'Priority Support',
  'Custom Workflows',
];

const INDUSTRIES = ['Select Industry', 'Information Technology', 'Manufacturing', 'Retail', 'Healthcare', 'Finance & Banking', 'Education'];
const COMPANY_SIZES = ['Select Company Size', '1 - 50 Employees', '51 - 200 Employees', '201 - 500 Employees', '500+ Employees'];
const CURRENCIES = ['INR (₹) - Indian Rupee', 'USD ($) - US Dollar', 'EUR (€) - Euro', 'GBP (£) - British Pound'];
const COUNTRIES = ['India', 'United States', 'United Kingdom', 'United Arab Emirates'];

// ─── Small building blocks ─────────────────────────────────────────────────
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-[11px] font-medium text-zinc-500">
      {children} {required && <span className="text-rose-500">*</span>}
    </label>
  );
}

// Inputs use a fixed h-8 height (per spec) instead of py-based padding,
// so the whole form stays compact and placeholders get full-width room to render.
function TextField({ label, placeholder, required, icon }: { label: string; placeholder: string; required?: boolean; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <FieldLabel required={required}>{label}</FieldLabel>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">{icon}</span>}
        <input
          placeholder={placeholder}
          title={placeholder}
          className={`w-full h-8 rounded-lg border border-zinc-200 bg-white text-[12.5px] text-zinc-700 placeholder:text-zinc-400 placeholder:truncate shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${icon ? 'pl-9 pr-3' : 'px-3'}`}
        />
      </div>
    </div>
  );
}

function SelectField({ label, options, required }: { label: string; options: string[]; required?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <FieldLabel required={required}>{label}</FieldLabel>
      <div className="relative">
        <select className="w-full h-8 appearance-none rounded-lg border border-zinc-200 bg-white px-3 pr-8 text-[12.5px] font-medium text-zinc-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors cursor-pointer">
          {options.map((opt) => <option key={opt}>{opt}</option>)}
        </select>
        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" />
      </div>
    </div>
  );
}

// ─── Breadcrumb + heading ───────────────────────────────────────────────────
function PageHeading() {
  return (
    <section className="py-1">
      <div className="flex items-center gap-1.5 text-[12px] text-zinc-500">
        <Link href="/dashboard" className="flex items-center gap-1 hover:text-indigo-700">
          <Home size={12} /> Home
        </Link>
        <ChevronRight size={12} />
        <Link href="/dashboard/companies" className="hover:text-indigo-700">Companies</Link>
        <ChevronRight size={12} />
        <span className="text-zinc-700 font-medium">Add New Company</span>
      </div>
      <h1 className="mt-1 text-xl font-bold text-zinc-900 leading-tight">Add New Company</h1>
      <p className="text-[13px] text-zinc-500 mt-0.5">Create a new company account and configure initial settings</p>
    </section>
  );
}

// ─── Step indicator ─────────────────────────────────────────────────────────
const STEP_ROUTES: Record<number, string> = {
  1: '/super-admin/companies/new/step-1',
  2: '/super-admin/companies/new/step-2',
  3: '/super-admin/companies/new/step-3',
  4: '/super-admin/companies/new/step-4',
  5: '/super-admin/companies/new/step-5',
};

function StepIndicator({ current }: { current: number }) {
  return (
    <Card className="rounded-sm border-zinc-200/80 shadow-sm">
      <CardContent className="flex items-center justify-between gap-2 overflow-x-auto p-1.5">
        {STEPS.map((step, i) => (
          <React.Fragment key={step.id}>
            <Link
              href={STEP_ROUTES[step.id] ?? '#'}
              className="flex items-center gap-2 shrink-0 group cursor-pointer"
            >
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold transition-colors ${
                  step.id === current
                    ? 'bg-indigo-700 text-white'
                    : step.id < current
                    ? 'bg-emerald-500 text-white'
                    : 'border-2 border-zinc-200 text-zinc-400 group-hover:border-indigo-400 group-hover:text-indigo-500'
                }`}
              >
                {step.id < current ? <Check size={14} /> : step.id}
              </span>
              <div className="hidden sm:block leading-tight">
                <p className={`text-[12px] font-semibold transition-colors ${
                  step.id === current ? 'text-zinc-900' : 'text-zinc-400 group-hover:text-indigo-600'
                }`}>{step.title}</p>
                <p className="text-[10.5px] text-zinc-400">{step.subtitle}</p>
              </div>
            </Link>
            {i < STEPS.length - 1 && <span className="h-px flex-1 min-w-[16px] bg-zinc-200" />}
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
}

// ─── Basic Information form ─────────────────────────────────────────────────
function BasicInformationForm() {
  return (
    <Card className="rounded-sm border-zinc-200/80 shadow-sm">
      <CardContent className="p-2 space-y-2">
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-sm bg-indigo-50 text-indigo-700">
            <Building2 size={16} />
          </span>
          <div>
            <h3 className="text-[13.5px] font-semibold text-zinc-900">Basic Information</h3>
            <p className="text-[11px] text-zinc-400">Enter company details and official information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_120px] gap-x-1.5 gap-y-1.5">
          {/* Row 1 */}
          <div className="xl:col-start-1 xl:row-start-1">
            <TextField label="Company Name" placeholder="Enter legal company name" required />
          </div>
          <div className="xl:col-start-2 xl:row-start-1">
            <TextField label="Corporate ID" placeholder="Enter unique corporate ID" required />
          </div>
          <div className="xl:col-start-3 xl:row-start-1">
            <TextField label="Display Name" placeholder="Enter display name (short name)" required />
          </div>

          {/* Logo — spans rows 1-3 in column 4, fixed width (column track) & height (row span) */}
          <div className="xl:col-start-4 xl:row-start-1 xl:row-span-3 flex flex-col gap-0.5 min-w-0">
            <FieldLabel>Company Logo</FieldLabel>
            <div className="flex h-full min-h-[150px] flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50/60 px-3 py-3 text-center">
              <UploadCloud size={18} className="text-zinc-400" />
              <p className="text-[11px] text-zinc-500 leading-snug">Drag &amp; drop your logo here or</p>
              <button className="rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50">
                Browse File
              </button>
              <p className="text-[9.5px] text-zinc-400 leading-snug">JPG, PNG or SVG (Max. 2MB)</p>
            </div>
          </div>

          {/* Row 2 */}
          <div className="xl:col-start-1 xl:row-start-2">
            <SelectField label="Industry" options={INDUSTRIES} required />
          </div>
          <div className="xl:col-start-2 xl:row-start-2">
            <SelectField label="Company Size" options={COMPANY_SIZES} required />
          </div>

          {/* Row 3 */}
          <div className="xl:col-start-1 xl:row-start-3">
            <TextField label="GSTIN / Tax ID" placeholder="Enter GSTIN or Tax ID (Optional)" />
          </div>
          <div className="xl:col-start-2 xl:row-start-3">
            <TextField label="PAN" placeholder="Enter PAN Number (Optional)" />
          </div>
          <div className="xl:col-start-3 xl:row-start-3">
            <TextField label="Registration Number" placeholder="Enter Registration Number (Optional)" />
          </div>

          {/* Row 4 — no logo column here, just 3 boxes aligned to the same columns above */}
          <div className="xl:col-start-1 xl:row-start-4">
            <TextField label="Website" placeholder="https://example.com" />
          </div>
          <div className="xl:col-start-2 xl:row-start-4">
            <TextField label="Email" placeholder="Enter official email" />
          </div>
          <div className="xl:col-start-3 xl:col-span-2 xl:row-start-4 flex flex-col gap-0.5 min-w-0">
            <FieldLabel>Phone</FieldLabel>
            <div className="flex gap-2">
              <div className="flex h-8 items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 text-[13px] text-zinc-600 shrink-0">
                🇮🇳 +91 <ChevronDown size={12} className="text-zinc-400" />
              </div>
              <input placeholder="Enter phone number" className="w-full h-8 rounded-lg border border-zinc-200 bg-white px-3 text-[12.5px] text-zinc-700 placeholder:text-zinc-400 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors" />
            </div>
          </div>

          {/* Row 5 — no logo column here either, 3 boxes aligned the same way */}
          <div className="xl:col-start-1 xl:row-start-5">
            <TextField label="Year of Establishment" placeholder="Select year" />
          </div>
          <div className="xl:col-start-2 xl:row-start-5">
            <SelectField label="Currency" options={CURRENCIES} />
          </div>
          <div className="xl:col-start-3 xl:col-span-2 xl:row-start-5">
            <SelectField label="Time Zone" options={['(GMT+05:30) Asia/Kolkata', '(GMT+00:00) UTC', '(GMT-05:00) America/New_York']} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Registered Address form ────────────────────────────────────────────────
function RegisteredAddressForm() {
  return (
    <Card className="rounded-sm border-zinc-200/80 shadow-sm">
      <CardContent className="p-2 space-y-2">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-50 text-indigo-700">
            <MapPin size={16} />
          </span>
          <div>
            <h3 className="text-[13px] font-semibold text-zinc-900">Registered Address</h3>
            <p className="text-[11px] text-zinc-400">Enter the official registered address of the company</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-1.5 gap-y-1.5">
          <TextField label="Address Line 1" placeholder="Enter address line 1" required />
          <TextField label="Address Line 2" placeholder="Enter address line 2" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-1.5 gap-y-1.5">
          <SelectField label="Country" options={COUNTRIES} required />
          <SelectField label="State" options={['Select State']} required />
          <SelectField label="City" options={['Select City']} required />
          <TextField label="PIN Code" placeholder="Enter PIN code" required />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Right rail ─────────────────────────────────────────────────────────────
function SubscriptionPreview() {
  return (
    <div className="rounded-sm bg-[#0B1324] p-2 text-white">
      <div className="flex items-center gap-2 text-[12px] font-semibold text-zinc-300">
        <CreditCard size={14} />
        Subscription Plan Preview
      </div>

      <div className="mt-1 rounded-lg bg-white/5 p-1">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-400">
            <Crown size={14} /> Enterprise Plan
          </span>
          <span className="rounded-full bg-amber-400 px-1.5 text-[8px] font-bold text-[#0B1324]">Most Popular</span>
        </div>
        <p className="mt-1 text-sm font-bold text-yellow-500">₹ 150</p>
        <p className="text-[9px] text-zinc-400">Per Employee / Month</p>
        <p className="text-[9px] text-white mt-0.5">Billed Annually <span className='text-yellow-500'>(Save 20%)</span></p>

        <ul className="mt-1 space-y-0.5">
          {PLAN_FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-1.5 text-[9px] text-zinc-300">
              <Check size={12} className="text-emerald-400 shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        <button className="mt-1 flex w-full items-center justify-center gap-1 rounded-md border border-white/10 bg-white/5 py-1.5 text-[11px] font-semibold text-white hover:bg-white/10 transition-colors">
          Change Plan <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}

function NoteCard() {
  return (
    <div className="flex gap-2 rounded-xl border border-amber-100 bg-amber-50 p-1">
      <Info size={14} className="mt-0.5 shrink-0 text-amber-500" />
      <div>
        <p className="text-[10px] font-semibold text-amber-700">Note</p>
        <p className="text-[9px] text-amber-600 leading-snug mt-0.5">
          You can change the plan or add additional modules anytime from the subscription settings.
        </p>
      </div>
    </div>
  );
}

function SetupProgressCard({ percent, current }: { percent: number; current: Step }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <Card className="border-zinc-200/80 shadow-sm">
      <CardContent className="p-1">
        <p className="text-[10px] font-semibold text-zinc-800 mb-2">Setup Progress</p>
        <div className="flex items-center gap-3">
          <svg width="56" height="56" viewBox="0 0 56 56" className="shrink-0 -rotate-90">
            <circle cx="28" cy="28" r={r} fill="none" stroke="#E4E4E7" strokeWidth="6" />
            <circle
              cx="28" cy="28" r={r} fill="none" stroke="#10b981" strokeWidth="6"
              strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
            />
            <text x="28" y="28" transform="rotate(90 28 28)" textAnchor="middle" dominantBaseline="middle" className="fill-zinc-800 text-[11px] font-bold">
              {percent}%
            </text>
          </svg>
          <div>
            <p className="text-[9px] text-zinc-400">Step {current.id} of {STEPS.length}</p>
            <p className="text-[9px] font-semibold text-zinc-800">{current.title}</p>
            <p className="text-[9px] text-zinc-400 mt-0.5 leading-snug">Let&apos;s start by adding the basic details of the company.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Recolored to the same warm red accent used by the site-wide support/help
// widget (the floating circular button), instead of the previous indigo tint.
function NeedHelpCard() {
  return (
    <Card className="border-zinc-200/80 shadow-sm">
      <CardContent className="p-2">
        <div className="flex items-start gap-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-red-50 text-red-600">
            <Headphones size={14} />
          </span>
          <div>
            <p className="text-[11px] font-semibold text-zinc-800">Need Help?</p>
            <p className="text-[10px] text-zinc-400 leading-snug mt-0.5">
              Our customer success team is here to help you set up your company.
            </p>
          </div>
        </div>
        <button className="mt-1 w-full rounded-md bg-red-600 py-1.5 text-[10px] font-semibold text-white hover:bg-red-700 shadow-sm transition-colors">
          Contact Support
        </button>
      </CardContent>
    </Card>
  );
}

// ─── Footer actions ─────────────────────────────────────────────────────────
function FormFooter() {
  return (
    <div className="flex items-center justify-between gap-2 pt-1">
      <button className="rounded-md border border-zinc-200 bg-white px-4 py-2 text-[12.5px] font-semibold text-zinc-600 shadow-sm hover:bg-zinc-50 transition-colors">
        Cancel
      </button>
      <button className="flex items-center gap-1.5 rounded-md bg-indigo-700 px-5 py-2 text-[12.5px] font-semibold text-white shadow-sm hover:bg-indigo-800 transition-colors">
        Save &amp; Next <ChevronRight size={14} />
      </button>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function AddNewCompanyPage() {
  const [currentStep] = useState(1);
  const activeStep = STEPS.find((s) => s.id === currentStep)!;
  const progress = Math.round((currentStep / STEPS.length) * 100);

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans text-zinc-900">

      <div className="flex-1 min-w-0">

        <main className="mx-auto max-w-[1200px] px-2 py-2 space-y-2">
          <PageHeading />
          <StepIndicator current={currentStep} />

          {/* Left form column and right rail ratio adjusted to reduce form width */}
          <div className="grid grid-cols-1 xl:grid-cols-[3fr_1fr] gap-4 items-start">
            <div className="space-y-2 min-w-0">
              <BasicInformationForm />
              <RegisteredAddressForm />
              <FormFooter />
            </div>

            <div className="space-y-3 min-w-0 xl:sticky xl:top-4">
              <SubscriptionPreview />
              <NoteCard />
              <SetupProgressCard percent={progress} current={activeStep} />
              <NeedHelpCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}