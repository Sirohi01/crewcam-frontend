'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ChevronLeft, ChevronRight, Loader2, AlertTriangle } from 'lucide-react';
import api from '@/lib/axios';

const STEPS = [
  'Company Details', 'Primary Contact', 'Address', 'Subscription',
  'Module Selection', 'Organization Setup', 'Branding', 'Review',
];

const MODULES = [
  'ATS', 'Payroll', 'Attendance', 'Leave', 'PMS', 'Expense', 'Assets',
  'Helpdesk', 'Visitor', 'Travel', 'Training', 'Field Force', 'AI', 'Workflow',
];

const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'UAE', 'Singapore'];
const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP'];
const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];

const EMPTY_FORM = {
  name: '', legalName: '', gstin: '', panNumber: '', cin: '', industry: '', website: '',
  companySize: '', logoUrl: '', description: '',
  ownerName: '', hrName: '', pendingAdminFirstName: '', pendingAdminLastName: '', pendingAdminEmail: '', pendingAdminPhone: '', alternatePhone: '',
  country: 'India', state: '', city: '', addressLine1: '', postalCode: '', timezone: 'Asia/Kolkata', baseCurrency: 'INR',
  packageId: '', billingCycle: 'MONTHLY' as 'MONTHLY' | 'YEARLY', userLimit: '' as number | '', storageLimitGB: 5, dbType: 'SHARED' as 'SHARED' | 'DEDICATED',
  selectedModules: [] as string[],
  organizationSetupPlan: {
    branchesPlanned: 1, departmentsPlanned: 0, designationsPlanned: 0, shiftsPlanned: 0,
    needsHolidayCalendar: false, needsLeavePolicy: false, needsApprovalMatrix: false, needsCustomRoles: false,
  },
  primaryColor: '#4f46e5', secondaryColor: '', customSubdomain: '',
  emailFromName: '', emailFromAddress: '', smtpHost: '', smtpPort: '' as number | '', smtpUsername: '',
  whatsappEnabled: false, whatsappNumber: '',
};

function Field({ label, required, children, hint }: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-md text-zinc-700">{label} {required && <span className="text-rose-500">*</span>}</label>
      {children}
      {hint && <p className="text-[10px] text-zinc-400">{hint}</p>}
    </div>
  );
}

const inputClass = 'w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500';

export default function CompanyCreationWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [stepErrors, setStepErrors] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [result, setResult] = useState<{ tenantId: string; companyId: string } | null>(null);

  const { data: packages } = useQuery({
    queryKey: ['super-admin', 'packages'],
    queryFn: async () => (await api.get('/super-admin/packages')).data,
  });

  const selectedPackage = (packages || []).find((p: any) => p._id === formData.packageId);

  useEffect(() => {
    if (selectedPackage) {
      setFormData((prev) => ({
        ...prev,
        userLimit: prev.userLimit === '' ? selectedPackage.maxUsers : prev.userLimit,
        selectedModules: prev.selectedModules.length ? prev.selectedModules : (selectedPackage.features || []).filter((f: string) => MODULES.some((m) => f.toLowerCase().includes(m.toLowerCase()))),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.packageId]);

  const set = (patch: Partial<typeof EMPTY_FORM>) => setFormData((prev) => ({ ...prev, ...patch }));
  const setPlan = (patch: Partial<typeof EMPTY_FORM.organizationSetupPlan>) =>
    setFormData((prev) => ({ ...prev, organizationSetupPlan: { ...prev.organizationSetupPlan, ...patch } }));

  const toggleModule = (mod: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedModules: prev.selectedModules.includes(mod)
        ? prev.selectedModules.filter((m) => m !== mod)
        : [...prev.selectedModules, mod],
    }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = new FormData();
    data.append('file', file);
    setUploadingLogo(true);
    try {
      const res = await api.post('/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      set({ logoUrl: res.data.url });
    } catch (err) {
      console.error('Logo upload failed:', err);
      alert('Failed to upload logo. Max size 5MB.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const validateStep = (n: number): string[] => {
    const errors: string[] = [];
    if (n === 0) {
      if (!formData.name.trim()) errors.push('Company Name is required.');
      if (!formData.legalName.trim()) errors.push('Legal Name is required.');
    }
    if (n === 1) {
      if (!formData.pendingAdminFirstName.trim()) errors.push('Admin First Name is required.');
      if (!formData.pendingAdminLastName.trim()) errors.push('Admin Last Name is required.');
      if (!/^\S+@\S+\.\S+$/.test(formData.pendingAdminEmail)) errors.push('A valid Admin Email is required.');
    }
    if (n === 2) {
      if (!formData.country) errors.push('Country is required.');
    }
    if (n === 3) {
      if (!formData.packageId) errors.push('A subscription plan must be selected.');
    }
    return errors;
  };

  const goNext = () => {
    const errors = validateStep(step);
    setStepErrors(errors);
    if (errors.length > 0) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setStepErrors([]);
    setStep((s) => Math.max(s - 1, 0));
  };

  const goToStep = (n: number) => {
    if (n < step) { setStep(n); setStepErrors([]); return; }
    for (let i = 0; i < n; i++) {
      if (validateStep(i).length > 0) { setStep(i); setStepErrors(validateStep(i)); return; }
    }
    setStep(n);
    setStepErrors([]);
  };

  const handleConfirm = async () => {
    setSubmitError('');
    setSubmitting(true);
    try {
      const payload = { ...formData, userLimit: formData.userLimit === '' ? undefined : formData.userLimit, smtpPort: formData.smtpPort === '' ? undefined : formData.smtpPort };
      const res = await api.post('/super-admin/companies/wizard', payload);
      setResult({ tenantId: res.data.tenant._id, companyId: res.data.companyId });
    } catch (e: any) {
      setSubmitError(e?.response?.data?.message || 'Failed to create company draft.');
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="h-14 w-14 mx-auto rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
          <Check size={26} />
        </div>
        <h1 className="text-lg font-md text-zinc-900">Company Draft Created</h1>
        <p className="text-sm text-zinc-500 max-w-md mx-auto">
          <strong>{formData.name}</strong> has been saved at the <strong>Subscription Pending</strong> stage.
          The workspace has <strong>not</strong> been provisioned yet — no login account exists until you advance it through
          Implementation, Workspace Provisioning, and Admin Credentials Generated on its Lifecycle page.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Button variant="outline" onClick={() => router.push('/super-admin/companies')}>Back to Companies</Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => router.push(`/super-admin/companies/${result.tenantId}/lifecycle`)}>
            Open Lifecycle Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Company Creation Wizard</h1>
        <p className="text-xs text-zinc-500">Captures full onboarding details. Workspace provisioning happens later, from the company's Lifecycle page.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {STEPS.map((label, i) => (
          <button
            key={label}
            onClick={() => goToStep(i)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium whitespace-nowrap shrink-0 transition-colors ${
              i === step ? 'bg-indigo-600 text-white'
                : i < step ? 'bg-emerald-50 text-emerald-700'
                : 'bg-zinc-50 text-zinc-400'
            }`}
          >
            {i < step ? <Check size={11} /> : <span className="tabular-nums">{i + 1}</span>}
            {label}
          </button>
        ))}
      </div>

      {stepErrors.length > 0 && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 space-y-0.5">
          {stepErrors.map((e) => <p key={e}>{e}</p>)}
        </div>
      )}

      <Card className="border-zinc-200 shadow-sm">
        <CardContent className="p-6 space-y-5">

          {step === 0 && (
            <div className="grid grid-cols-2 gap-5">
              <Field label="Company Name" required><input className={inputClass} value={formData.name} onChange={(e) => set({ name: e.target.value })} placeholder="Acme Corp" /></Field>
              <Field label="Legal Name" required><input className={inputClass} value={formData.legalName} onChange={(e) => set({ legalName: e.target.value })} placeholder="Acme Corporation Pvt. Ltd." /></Field>
              <Field label="GST"><input className={inputClass} value={formData.gstin} onChange={(e) => set({ gstin: e.target.value.toUpperCase() })} /></Field>
              <Field label="PAN"><input className={inputClass} value={formData.panNumber} onChange={(e) => set({ panNumber: e.target.value.toUpperCase() })} /></Field>
              <Field label="CIN"><input className={inputClass} value={formData.cin} onChange={(e) => set({ cin: e.target.value.toUpperCase() })} /></Field>
              <Field label="Industry"><input className={inputClass} value={formData.industry} onChange={(e) => set({ industry: e.target.value })} /></Field>
              <Field label="Website"><input className={inputClass} value={formData.website} onChange={(e) => set({ website: e.target.value })} placeholder="https://" /></Field>
              <Field label="Company Size">
                <select className={inputClass} value={formData.companySize} onChange={(e) => set({ companySize: e.target.value })}>
                  <option value="">Select size</option>
                  {COMPANY_SIZES.map((s) => <option key={s} value={s}>{s} employees</option>)}
                </select>
              </Field>
              <Field label="Logo">
                <input type="file" accept="image/*" onChange={handleLogoUpload} className={inputClass} disabled={uploadingLogo} />
                {uploadingLogo && <p className="text-[10px] text-zinc-400">Uploading...</p>}
                {formData.logoUrl && <p className="text-[10px] text-emerald-600">Uploaded.</p>}
              </Field>
              <div className="col-span-2">
                <Field label="Description"><textarea className={inputClass} rows={3} maxLength={1000} value={formData.description} onChange={(e) => set({ description: e.target.value })} /></Field>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-2 gap-5">
              <Field label="Owner Name"><input className={inputClass} value={formData.ownerName} onChange={(e) => set({ ownerName: e.target.value })} /></Field>
              <Field label="HR Name"><input className={inputClass} value={formData.hrName} onChange={(e) => set({ hrName: e.target.value })} /></Field>
              <Field label="Admin First Name" required><input className={inputClass} value={formData.pendingAdminFirstName} onChange={(e) => set({ pendingAdminFirstName: e.target.value })} /></Field>
              <Field label="Admin Last Name" required><input className={inputClass} value={formData.pendingAdminLastName} onChange={(e) => set({ pendingAdminLastName: e.target.value })} /></Field>
              <Field label="Email" required hint="No login is created yet — this is used when credentials are generated later.">
                <input type="email" className={inputClass} value={formData.pendingAdminEmail} onChange={(e) => set({ pendingAdminEmail: e.target.value })} />
              </Field>
              <Field label="Phone"><input className={inputClass} value={formData.pendingAdminPhone} onChange={(e) => set({ pendingAdminPhone: e.target.value })} /></Field>
              <Field label="Alternate Phone"><input className={inputClass} value={formData.alternatePhone} onChange={(e) => set({ alternatePhone: e.target.value })} /></Field>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-2 gap-5">
              <Field label="Country" required>
                <select className={inputClass} value={formData.country} onChange={(e) => set({ country: e.target.value })}>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="State"><input className={inputClass} value={formData.state} onChange={(e) => set({ state: e.target.value })} /></Field>
              <Field label="City"><input className={inputClass} value={formData.city} onChange={(e) => set({ city: e.target.value })} /></Field>
              <Field label="PIN Code"><input className={inputClass} value={formData.postalCode} onChange={(e) => set({ postalCode: e.target.value })} /></Field>
              <div className="col-span-2">
                <Field label="Address"><input className={inputClass} value={formData.addressLine1} onChange={(e) => set({ addressLine1: e.target.value })} /></Field>
              </div>
              <Field label="Timezone"><input className={inputClass} value={formData.timezone} onChange={(e) => set({ timezone: e.target.value })} placeholder="Asia/Kolkata" /></Field>
              <Field label="Currency">
                <select className={inputClass} value={formData.baseCurrency} onChange={(e) => set({ baseCurrency: e.target.value })}>
                  {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-2 gap-5">
              <Field label="Plan" required>
                <select className={inputClass} value={formData.packageId} onChange={(e) => set({ packageId: e.target.value })}>
                  <option value="">Select a plan</option>
                  {(packages || []).map((p: any) => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </Field>
              <Field label="Billing Cycle">
                <select className={inputClass} value={formData.billingCycle} onChange={(e) => set({ billingCycle: e.target.value as any })}>
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </Field>
              <Field label="User Limit" hint={selectedPackage ? `Plan ceiling: ${selectedPackage.maxUsers} users` : undefined}>
                <input type="number" min={1} className={inputClass} value={formData.userLimit} onChange={(e) => set({ userLimit: e.target.value === '' ? '' : Number(e.target.value) })} />
              </Field>
              <Field label="Storage (GB)">
                <input type="number" min={1} className={inputClass} value={formData.storageLimitGB} onChange={(e) => set({ storageLimitGB: Number(e.target.value) || 1 })} />
              </Field>
              <Field label="Database Type" hint={formData.dbType === 'DEDICATED' ? 'Captured as intent only — dedicated-DB provisioning is still a manual platform-team process.' : undefined}>
                <div className="flex gap-3 pt-1">
                  {(['SHARED', 'DEDICATED'] as const).map((t) => (
                    <label key={t} className="flex items-center gap-1.5 text-xs text-zinc-600 cursor-pointer">
                      <input type="radio" checked={formData.dbType === t} onChange={() => set({ dbType: t })} />
                      {t === 'SHARED' ? 'Shared' : 'Dedicated'}
                    </label>
                  ))}
                </div>
              </Field>
              {selectedPackage && (
                <div className="col-span-2 rounded-lg bg-zinc-50 border border-zinc-100 px-3 py-2 text-[11px] text-zinc-500">
                  Setup fee ₹{selectedPackage.setupFeeINR || 0} · Price per user ₹{formData.billingCycle === 'YEARLY' ? selectedPackage.pricePerUserYearlyINR || 0 : selectedPackage.pricePerUserMonthlyINR || 0}/{formData.billingCycle === 'YEARLY' ? 'yr' : 'mo'} · Free AI credits {selectedPackage.freeAiCredits || 0}
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <p className="text-xs text-zinc-500">Select the modules this company plans to use. Pre-checked from the selected plan's included modules where applicable.</p>
              <div className="grid grid-cols-4 gap-2">
                {MODULES.map((mod) => (
                  <label key={mod} className="flex items-center gap-2 text-xs text-zinc-600 cursor-pointer p-2 border border-zinc-100 rounded-md hover:bg-zinc-50">
                    <input type="checkbox" checked={formData.selectedModules.includes(mod)} onChange={() => toggleModule(mod)} className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600" />
                    {mod}
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-5">
              <p className="text-xs text-zinc-500">Planning only — nothing is created yet. This informs the Implementation team once workspace provisioning begins.</p>
              <div className="grid grid-cols-4 gap-4">
                <Field label="Branches"><input type="number" min={0} className={inputClass} value={formData.organizationSetupPlan.branchesPlanned} onChange={(e) => setPlan({ branchesPlanned: Number(e.target.value) || 0 })} /></Field>
                <Field label="Departments"><input type="number" min={0} className={inputClass} value={formData.organizationSetupPlan.departmentsPlanned} onChange={(e) => setPlan({ departmentsPlanned: Number(e.target.value) || 0 })} /></Field>
                <Field label="Designations"><input type="number" min={0} className={inputClass} value={formData.organizationSetupPlan.designationsPlanned} onChange={(e) => setPlan({ designationsPlanned: Number(e.target.value) || 0 })} /></Field>
                <Field label="Shifts"><input type="number" min={0} className={inputClass} value={formData.organizationSetupPlan.shiftsPlanned} onChange={(e) => setPlan({ shiftsPlanned: Number(e.target.value) || 0 })} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {([
                  ['needsHolidayCalendar', 'Holiday Calendar'],
                  ['needsLeavePolicy', 'Leave Policy'],
                  ['needsApprovalMatrix', 'Approval Matrix'],
                  ['needsCustomRoles', 'Custom Roles'],
                ] as const).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 text-xs text-zinc-600 cursor-pointer p-2 border border-zinc-100 rounded-md hover:bg-zinc-50">
                    <input type="checkbox" checked={formData.organizationSetupPlan[key]} onChange={(e) => setPlan({ [key]: e.target.checked } as any)} className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600" />
                    Needs {label} set up
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="grid grid-cols-2 gap-5">
              <Field label="Primary Color"><input type="color" className="w-full h-9 border border-zinc-200 rounded-lg" value={formData.primaryColor} onChange={(e) => set({ primaryColor: e.target.value })} /></Field>
              <Field label="Secondary Color"><input type="color" className="w-full h-9 border border-zinc-200 rounded-lg" value={formData.secondaryColor || '#64748b'} onChange={(e) => set({ secondaryColor: e.target.value })} /></Field>
              <Field label="Subdomain" hint="company.crewcam.app">
                <div className="flex items-center">
                  <input className={inputClass + ' rounded-r-none'} value={formData.customSubdomain} onChange={(e) => set({ customSubdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })} />
                  <span className="border border-l-0 border-zinc-200 rounded-r-lg px-3 py-2 text-xs text-zinc-400 bg-zinc-50">.crewcam.app</span>
                </div>
              </Field>
              <div />
              <Field label="Email Branding — From Name"><input className={inputClass} value={formData.emailFromName} onChange={(e) => set({ emailFromName: e.target.value })} /></Field>
              <Field label="Email Branding — From Address"><input type="email" className={inputClass} value={formData.emailFromAddress} onChange={(e) => set({ emailFromAddress: e.target.value })} /></Field>
              <Field label="SMTP Host" hint="SMTP password is configured securely by the platform team, not captured here."><input className={inputClass} value={formData.smtpHost} onChange={(e) => set({ smtpHost: e.target.value })} /></Field>
              <Field label="SMTP Port"><input type="number" className={inputClass} value={formData.smtpPort} onChange={(e) => set({ smtpPort: e.target.value === '' ? '' : Number(e.target.value) })} /></Field>
              <Field label="SMTP Username"><input className={inputClass} value={formData.smtpUsername} onChange={(e) => set({ smtpUsername: e.target.value })} /></Field>
              <Field label="WhatsApp Number">
                <div className="flex items-center gap-2">
                  <input className={inputClass} value={formData.whatsappNumber} onChange={(e) => set({ whatsappNumber: e.target.value })} disabled={!formData.whatsappEnabled} />
                </div>
                <label className="flex items-center gap-1.5 text-[11px] text-zinc-500 mt-1 cursor-pointer">
                  <input type="checkbox" checked={formData.whatsappEnabled} onChange={(e) => set({ whatsappEnabled: e.target.checked })} />
                  Enable WhatsApp notifications
                </label>
              </Field>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-5">
              <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700 flex items-start gap-2">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                Confirming saves this company at the <strong>Subscription Pending</strong> stage. The workspace is <strong>not</strong> provisioned — no Company Admin role, no login user, no email — until you advance it through the Lifecycle page later.
              </div>

              <ReviewSection title="Company Details" onEdit={() => goToStep(0)}>
                <ReviewRow label="Company Name" value={formData.name} />
                <ReviewRow label="Legal Name" value={formData.legalName} />
                <ReviewRow label="GST / PAN / CIN" value={[formData.gstin, formData.panNumber, formData.cin].filter(Boolean).join(' · ') || '—'} />
                <ReviewRow label="Industry" value={formData.industry || '—'} />
                <ReviewRow label="Company Size" value={formData.companySize || '—'} />
              </ReviewSection>

              <ReviewSection title="Primary Contact" onEdit={() => goToStep(1)}>
                <ReviewRow label="Admin" value={`${formData.pendingAdminFirstName} ${formData.pendingAdminLastName} (${formData.pendingAdminEmail})`} />
                <ReviewRow label="Owner / HR" value={[formData.ownerName, formData.hrName].filter(Boolean).join(' · ') || '—'} />
              </ReviewSection>

              <ReviewSection title="Address" onEdit={() => goToStep(2)}>
                <ReviewRow label="Location" value={[formData.addressLine1, formData.city, formData.state, formData.country].filter(Boolean).join(', ')} />
                <ReviewRow label="Timezone / Currency" value={`${formData.timezone} · ${formData.baseCurrency}`} />
              </ReviewSection>

              <ReviewSection title="Subscription" onEdit={() => goToStep(3)}>
                <ReviewRow label="Plan" value={selectedPackage?.name || '—'} />
                <ReviewRow label="Billing" value={`${formData.billingCycle} · ${formData.userLimit || '—'} users · ${formData.storageLimitGB}GB · ${formData.dbType}`} />
              </ReviewSection>

              <ReviewSection title="Modules" onEdit={() => goToStep(4)}>
                <ReviewRow label="Selected" value={formData.selectedModules.join(', ') || 'None selected'} />
              </ReviewSection>

              <ReviewSection title="Branding" onEdit={() => goToStep(6)}>
                <ReviewRow label="Subdomain" value={formData.customSubdomain ? `${formData.customSubdomain}.crewcam.app` : '—'} />
              </ReviewSection>

              {submitError && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{submitError}</div>}
            </div>
          )}

        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={goBack} disabled={step === 0} className="h-9 text-xs">
          <ChevronLeft size={14} className="mr-1" /> Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={goNext} className="h-9 text-xs bg-zinc-900 hover:bg-zinc-800 text-white">
            Next <ChevronRight size={14} className="ml-1" />
          </Button>
        ) : (
          <Button onClick={handleConfirm} disabled={submitting} className="h-9 text-xs bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-60">
            {submitting ? <Loader2 size={14} className="animate-spin mr-1" /> : <Check size={14} className="mr-1" />}
            Confirm & Save Draft
          </Button>
        )}
      </div>
    </div>
  );
}

function ReviewSection({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div className="border border-zinc-100 rounded-lg p-3">
      <div className="flex items-center justify-between mb-1.5">
        <h3 className="text-xs font-md text-zinc-700">{title}</h3>
        <button onClick={onEdit} className="text-[11px] text-indigo-600 hover:text-indigo-700">Edit</button>
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[11px]">
      <span className="text-zinc-400">{label}</span>
      <span className="text-zinc-700 text-right">{value}</span>
    </div>
  );
}
