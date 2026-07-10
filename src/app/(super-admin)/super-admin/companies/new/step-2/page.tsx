'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight, Home, Check, Info, Send, Rocket, Wand2, SlidersHorizontal,
  ChevronDown, Headphones, ArrowRight, ArrowLeft,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// ─── Types ──────────────────────────────────────────────────────────────────
interface Step {
  id: number;
  title: string;
  subtitle: string;
}

interface Plan {
  id: string;
  name: string;
  tagline: string;
  price: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  nameColor: string;
  features: string[];
  cta: string;
  ctaStyle: 'outline' | 'solid' | 'outline-amber';
  highlighted?: boolean;
  badge?: string;
  customPricing?: boolean;
}

interface AddonModule {
  id: string;
  name: string;
  price: string;
}

// ─── Static data ────────────────────────────────────────────────────────────
const STEPS: Step[] = [
  { id: 1, title: 'Basic Information', subtitle: 'Completed' },
  { id: 2, title: 'Subscription & Plan', subtitle: 'Choose plan' },
  { id: 3, title: 'Admin & Contact', subtitle: 'Primary contact details' },
  { id: 4, title: 'Configuration', subtitle: 'System preferences' },
  { id: 5, title: 'Review & Confirm', subtitle: 'Verify and create' },
];

const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Perfect for small teams getting started',
    price: 89,
    icon: <Send size={20} />,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    nameColor: 'text-zinc-900',
    features: ['Up to 50 Employees', 'Core HR & Employee Profile', 'Leave Management', 'Attendance (Basic)', 'Mobile App Access', 'Email Support'],
    cta: 'Select Plan',
    ctaStyle: 'outline',
  },
  {
    id: 'professional',
    name: 'Professional',
    tagline: 'Ideal for growing organizations',
    price: 150,
    icon: <Rocket size={20} />,
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    nameColor: 'text-indigo-700',
    features: ['Up to 200 Employees', 'All Starter Features', 'Payroll Management', 'Advanced Attendance', 'Performance Management', 'Reports & Analytics', 'Priority Support'],
    cta: 'Select Plan',
    ctaStyle: 'solid',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Advanced features for large organizations',
    price: 250,
    icon: <Wand2 size={20} />,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    nameColor: 'text-zinc-900',
    features: ['Unlimited Employees', 'All Professional Features', 'Advanced HR Analytics', 'Recruitment & Onboarding', 'Asset Management', 'Workflow Automation', 'API Access', 'Dedicated Support'],
    cta: 'Select Plan',
    ctaStyle: 'outline',
  },
  {
    id: 'custom',
    name: 'Custom',
    tagline: 'Tailored solution for your unique requirements',
    price: 0,
    icon: <SlidersHorizontal size={20} />,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    nameColor: 'text-zinc-900',
    features: ['All Enterprise Features', 'Custom Modules', 'Custom Integrations', 'Dedicated Account Manager', 'SLA & Priority Support', 'On-premise / Private Cloud'],
    cta: 'Contact Sales',
    ctaStyle: 'outline-amber',
    customPricing: true,
  },
];

const ADDON_MODULES: AddonModule[] = [
  { id: 'ai-analytics', name: 'AI & Predictive Analytics', price: '₹ 20 / Employee / Month' },
  { id: 'advanced-recruitment', name: 'Advanced Recruitment', price: '₹ 15 / Employee / Month' },
  { id: 'learning-management', name: 'Learning Management', price: '₹ 15 / Employee / Month' },
  { id: 'expense-management', name: 'Expense Management', price: '₹ 10 / Employee / Month' },
  { id: 'helpdesk-tickets', name: 'Helpdesk & Tickets', price: '₹ 10 / Employee / Month' },
];

const WHATS_INCLUDED = [
  'All features in Starter Plan',
  'Payroll Management',
  'Advanced Attendance',
  'Performance Management',
  'Reports & Analytics',
  'Priority Support',
];

// ─── Small building blocks ─────────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-[12.5px] font-semibold text-zinc-700">{children}</label>;
}

function SelectField({ label, options }: { label: string; options: string[] }) {
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <FieldLabel>{label}</FieldLabel>
      <div className="relative">
        <select className="w-full h-9 appearance-none rounded-lg border border-zinc-200 bg-white px-3 pr-8 text-[12.5px] font-medium text-zinc-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors cursor-pointer">
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
      <p className="text-[13px] text-zinc-500 mt-0.5">Choose subscription plan and configure billing preferences</p>
    </section>
  );
}

// ─── Step indicator ─────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: number }) {
  return (
    <Card className="rounded-sm border-zinc-200/80 shadow-sm">
      <CardContent className="flex items-center justify-between gap-2 overflow-x-auto p-4">
        {STEPS.map((step, i) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-2.5 shrink-0">
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[12.5px] font-bold ${
                  step.id === current
                    ? 'bg-indigo-700 text-white'
                    : step.id < current
                    ? 'bg-emerald-500 text-white'
                    : 'border-2 border-zinc-200 text-zinc-400'
                }`}
              >
                {step.id < current ? <Check size={14} /> : step.id}
              </span>
              <div className="hidden sm:block leading-tight">
                <p className={`text-[12.5px] font-semibold ${step.id === current ? 'text-zinc-900' : 'text-zinc-400'}`}>{step.title}</p>
                <p className="text-[10.5px] text-zinc-400">{step.subtitle}</p>
              </div>
            </div>
            {i < STEPS.length - 1 && <span className="h-px flex-1 min-w-[16px] bg-zinc-200" />}
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
}

// ─── Billing toggle ─────────────────────────────────────────────────────────
function BillingToggle({ value, onChange }: { value: 'monthly' | 'yearly'; onChange: (v: 'monthly' | 'yearly') => void }) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-zinc-100 p-1">
      <button
        onClick={() => onChange('monthly')}
        className={`rounded-md px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
          value === 'monthly' ? 'bg-indigo-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
        }`}
      >
        Monthly
      </button>
      <button
        onClick={() => onChange('yearly')}
        className={`rounded-md px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
          value === 'yearly' ? 'bg-indigo-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
        }`}
      >
        Yearly <span className="text-emerald-500">(Save up to 20%)</span>
      </button>
    </div>
  );
}

// ─── Plan card ──────────────────────────────────────────────────────────────
function PlanCard({ plan, selected, onSelect }: { plan: Plan; selected: boolean; onSelect: () => void }) {
  const ctaClasses =
    plan.ctaStyle === 'solid'
      ? 'bg-indigo-700 text-white hover:bg-indigo-800 border border-indigo-700'
      : plan.ctaStyle === 'outline-amber'
      ? 'bg-white text-amber-600 border border-amber-300 hover:bg-amber-50'
      : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50';

  return (
    <div
      className={`relative flex flex-col rounded-xl border p-4 ${
        plan.highlighted ? 'border-indigo-300 ring-1 ring-indigo-200 bg-indigo-50/20' : 'border-zinc-200 bg-white'
      }`}
    >
      {plan.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-zinc-900 px-3 py-1 text-[10px] font-bold text-white">
          {plan.badge}
        </span>
      )}

      <span className={`grid h-11 w-11 place-items-center rounded-xl ${plan.iconBg} ${plan.iconColor}`}>
        {plan.icon}
      </span>

      <h3 className={`mt-3 text-[15px] font-bold ${plan.nameColor}`}>{plan.name}</h3>
      <p className="mt-1 text-[11.5px] text-zinc-500 leading-snug min-h-[32px]">{plan.tagline}</p>

      {plan.customPricing ? (
        <p className="mt-2 text-lg font-extrabold text-zinc-900">Custom Pricing</p>
      ) : (
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-[15px] font-bold text-zinc-900">₹</span>
          <span className="text-2xl font-extrabold text-zinc-900">{plan.price}</span>
        </div>
      )}
      <p className="text-[11px] text-zinc-400">{plan.customPricing ? "Let's build for you" : 'Per Employee / Month'}</p>

      <ul className="mt-3 space-y-1.5 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-1.5 text-[11.5px] text-zinc-600">
            <Check size={13} className={`mt-0.5 shrink-0 ${plan.highlighted ? 'text-indigo-500' : 'text-emerald-500'}`} />
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        className={`mt-4 w-full rounded-lg py-2 text-[12.5px] font-semibold transition-colors ${ctaClasses}`}
      >
        {plan.cta}
      </button>
    </div>
  );
}

// ─── Add-on module checkbox card ───────────────────────────────────────────
function AddonCard({ addon, checked, onToggle }: { addon: AddonModule; checked: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`flex flex-col gap-1.5 rounded-lg border p-3 text-left transition-colors ${
        checked ? 'border-indigo-400 bg-indigo-50/40' : 'border-zinc-200 bg-white hover:bg-zinc-50'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border ${
            checked ? 'bg-indigo-700 border-indigo-700' : 'border-zinc-300 bg-white'
          }`}
        >
          {checked && <Check size={11} className="text-white" />}
        </span>
        <Info size={13} className="text-zinc-300 shrink-0" />
      </div>
      <p className="text-[12px] font-semibold text-zinc-800 leading-snug">{addon.name}</p>
      <p className="text-[11px] text-zinc-400">{addon.price}</p>
    </button>
  );
}

// ─── Select Subscription Plan section ──────────────────────────────────────
function SubscriptionPlanSection({
  selectedPlan,
  setSelectedPlan,
  billing,
  setBilling,
}: {
  selectedPlan: string;
  setSelectedPlan: (id: string) => void;
  billing: 'monthly' | 'yearly';
  setBilling: (v: 'monthly' | 'yearly') => void;
}) {
  return (
    <Card className="rounded-sm border-zinc-200/80 shadow-sm">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h3 className="text-[14.5px] font-bold text-zinc-900">Select Subscription Plan</h3>
            <p className="text-[11.5px] text-zinc-400">Choose the most suitable plan for your organization</p>
          </div>
          <BillingToggle value={billing} onChange={setBilling} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} selected={selectedPlan === plan.id} onSelect={() => setSelectedPlan(plan.id)} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Add-on Modules section ────────────────────────────────────────────────
function AddonModulesSection({ selected, toggle }: { selected: string[]; toggle: (id: string) => void }) {
  return (
    <Card className="rounded-sm border-zinc-200/80 shadow-sm">
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="text-[13.5px] font-bold text-zinc-900">Add-on Modules (Optional)</h3>
          <p className="text-[11.5px] text-zinc-400">Extend your plan with powerful add-ons</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-2.5">
          {ADDON_MODULES.map((addon) => (
            <AddonCard key={addon.id} addon={addon} checked={selected.includes(addon.id)} onToggle={() => toggle(addon.id)} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Billing Preferences section ───────────────────────────────────────────
function BillingPreferencesSection() {
  return (
    <Card className="rounded-sm border-zinc-200/80 shadow-sm">
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="text-[13.5px] font-bold text-zinc-900">Billing Preferences</h3>
          <p className="text-[11.5px] text-zinc-400">Configure billing cycle and payment terms</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <SelectField label="Billing Cycle" options={['Monthly', 'Quarterly', 'Annually']} />
          <SelectField label="Advance Payment" options={['1 Month', '2 Months', '3 Months', 'None']} />
          <SelectField label="Invoice Currency" options={['INR (₹) - Indian Rupee', 'USD ($) - US Dollar', 'EUR (€) - Euro', 'GBP (£) - British Pound']} />
          <SelectField label="GST Treatment" options={['Exclusive of GST', 'Inclusive of GST', 'Not Applicable']} />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Right rail ─────────────────────────────────────────────────────────────
function SubscriptionSummary({ plan, addons }: { plan: Plan; addons: AddonModule[] }) {
  const planAmount = plan.customPricing ? 0 : plan.price * 100;
  const addonAmount = addons.length * 15 * 100;
  const total = planAmount + addonAmount;

  return (
    <div className="rounded-xl bg-[#0B1324] p-4 text-white">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold text-zinc-200">Subscription Summary</p>
        {plan.badge && (
          <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-bold text-[#0B1324]">{plan.badge}</span>
        )}
      </div>

      <p className="mt-3 text-[11px] text-zinc-400">Selected Plan</p>
      <p className="text-lg font-extrabold text-indigo-300">{plan.name}</p>
      {!plan.customPricing && (
        <>
          <p className="text-xl font-extrabold text-yellow-500">₹ {plan.price}</p>
          <p className="text-[10.5px] text-zinc-400">Per Employee / Month</p>
        </>
      )}

      <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
        <div className="flex items-center justify-between text-[11.5px]">
          <span className="text-zinc-400">Employees (Estimated)</span>
          <span className="font-semibold text-white">100</span>
        </div>
        <div className="flex items-center justify-between text-[11.5px]">
          <span className="text-zinc-400">Plan Amount</span>
          <span className="font-semibold text-white">₹ {planAmount.toLocaleString('en-IN')} / Month</span>
        </div>
        <div className="flex items-center justify-between text-[11.5px]">
          <span className="text-zinc-400">Add-on Modules</span>
          <span className="font-semibold text-white">₹ {addonAmount.toLocaleString('en-IN')} / Month</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
        <span className="text-[12px] font-semibold text-zinc-200">Total (Estimated)</span>
        <span className="text-base font-extrabold text-indigo-300">₹ {total.toLocaleString('en-IN')} / Month</span>
      </div>

      <div className="mt-3 flex gap-1.5 rounded-lg bg-white/5 p-2">
        <Info size={12} className="mt-0.5 shrink-0 text-zinc-400" />
        <p className="text-[10px] text-zinc-400 leading-snug">Final amount may vary based on actual employee count.</p>
      </div>
    </div>
  );
}

function WhatsIncludedCard() {
  return (
    <Card className="rounded-sm border-zinc-200/80 shadow-sm">
      <CardContent className="p-4">
        <p className="text-[12.5px] font-semibold text-zinc-800 mb-2">What&apos;s Included</p>
        <ul className="space-y-1.5">
          {WHATS_INCLUDED.map((item) => (
            <li key={item} className="flex items-center gap-1.5 text-[11.5px] text-zinc-600">
              <Check size={13} className="text-emerald-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function NeedHelpChoosingCard() {
  return (
    <div className="rounded-xl bg-[#0B1324] p-4 text-white">
      <div className="flex items-start gap-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-white">
          <Headphones size={16} />
        </span>
        <div>
          <p className="text-[12.5px] font-semibold text-white">Need Help Choosing?</p>
          <p className="text-[10.5px] text-zinc-400 leading-snug mt-0.5">
            Our experts are here to help you choose the perfect plan.
          </p>
        </div>
      </div>
      <button className="mt-3 flex items-center gap-1.5 text-[11.5px] font-semibold text-amber-400 hover:text-amber-300 transition-colors">
        Schedule a Demo <ArrowRight size={13} />
      </button>
    </div>
  );
}

// ─── Footer actions ─────────────────────────────────────────────────────────
function FormFooter() {
  return (
    <div className="flex items-center justify-between gap-2 pt-1">
      <button className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-4 py-2 text-[12.5px] font-semibold text-zinc-600 shadow-sm hover:bg-zinc-50 transition-colors">
        <ArrowLeft size={14} /> Back
      </button>
      <button className="flex items-center gap-1.5 rounded-md bg-indigo-700 px-5 py-2 text-[12.5px] font-semibold text-white shadow-sm hover:bg-indigo-800 transition-colors">
        Save &amp; Next <ChevronRight size={14} />
      </button>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function SubscriptionPlanStep() {
  const [currentStep] = useState(2);
  const [selectedPlanId, setSelectedPlanId] = useState('professional');
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['advanced-recruitment']);

  const selectedPlan = PLANS.find((p) => p.id === selectedPlanId)!;
  const selectedAddonObjs = ADDON_MODULES.filter((a) => selectedAddons.includes(a.id));

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <main className="mx-auto max-w-[1600px] px-4 py-4 space-y-3">
        <PageHeading />
        <StepIndicator current={currentStep} />

        <div className="grid grid-cols-1 xl:grid-cols-[3fr_1fr] gap-4 items-start">
          <div className="space-y-3 min-w-0">
            <SubscriptionPlanSection
              selectedPlan={selectedPlanId}
              setSelectedPlan={setSelectedPlanId}
              billing={billing}
              setBilling={setBilling}
            />
            <AddonModulesSection selected={selectedAddons} toggle={toggleAddon} />
            <BillingPreferencesSection />
            <FormFooter />
          </div>

          <div className="space-y-3 min-w-0 xl:sticky xl:top-4">
            <SubscriptionSummary plan={selectedPlan} addons={selectedAddonObjs} />
            <WhatsIncludedCard />
            <NeedHelpChoosingCard />
          </div>
        </div>
      </main>
    </div>
  );
}