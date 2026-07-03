'use client';
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Country, State, City } from 'country-state-city';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import api from '@/lib/axios';
import { LEAD_STAGE_GROUPS, stageGroupQuery } from '@/lib/leadStages';

const TITLES = ['Mr', 'Mrs', 'Ms', 'Dr'] as const;
const fieldClass = 'w-full border border-zinc-200 text-sm px-3 py-1.5';

const EMPTY_CONTACT = {
  title: 'Mr' as typeof TITLES[number], firstName: '', surname: '', designation: '', email: '', phone: '', alternatePhone: '',
};

const EMPTY_FORM = {
  leadType: 'DOMESTIC' as 'DOMESTIC' | 'INTERNATIONAL',
  companyName: '',
  typeOfBusiness: '',
  industry: '',
  companyWebsite: '',
  companyEmail: '',
  landlineNo: '',
  fullAddress: '',
  country: 'India',
  pinCode: '',
  state: '',
  city: '',
  contactTitle: 'Mr' as typeof TITLES[number],
  contactName: '',
  contactSurname: '',
  contactDesignation: '',
  contactEmail: '',
  contactPhone: '',
  alternateContactPhone: '',
  source: '',
  leadDate: new Date().toISOString().slice(0, 16),
  assignedTo: '',
  followUpDate: '',
};

const allCountries = Country.getAllCountries().slice().sort((a, b) => a.name.localeCompare(b.name));

export default function NewLeadPage() {
  const router = useRouter();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [additionalContacts, setAdditionalContacts] = useState<(typeof EMPTY_CONTACT)[]>([]);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [pinLookupStatus, setPinLookupStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [countryIso, setCountryIso] = useState('');
  const [stateIso, setStateIso] = useState('');

  const { data: sources } = useQuery({
    queryKey: ['super-admin', 'leads', 'master-data', 'SOURCE'],
    queryFn: async () => (await api.get('/super-admin/leads/master-data', { params: { type: 'SOURCE' } })).data,
  });

  const { data: assignableUsers } = useQuery({
    queryKey: ['super-admin', 'leads', 'assignable-users'],
    queryFn: async () => (await api.get('/super-admin/leads/assignable-users')).data,
  });

  const states = useMemo(
    () => (countryIso ? State.getStatesOfCountry(countryIso).slice().sort((a, b) => a.name.localeCompare(b.name)) : []),
    [countryIso],
  );
  const cities = useMemo(
    () => (countryIso && stateIso ? City.getCitiesOfState(countryIso, stateIso).slice().sort((a, b) => a.name.localeCompare(b.name)) : []),
    [countryIso, stateIso],
  );

  const update = (patch: Partial<typeof EMPTY_FORM>) => setFormData((f) => ({ ...f, ...patch }));

  const handleLeadTypeChange = (leadType: 'DOMESTIC' | 'INTERNATIONAL') => {
    setCountryIso('');
    setStateIso('');
    setPinLookupStatus('idle');
    update({
      leadType,
      pinCode: '',
      state: '',
      city: '',
      country: leadType === 'DOMESTIC' ? 'India' : '',
    });
  };

  const handleCountrySelect = (isoCode: string) => {
    const country = allCountries.find((c) => c.isoCode === isoCode);
    setCountryIso(isoCode);
    setStateIso('');
    update({ country: country?.name || '', state: '', city: '' });
  };

  const handleStateSelect = (isoCode: string) => {
    const state = states.find((s) => s.isoCode === isoCode);
    setStateIso(isoCode);
    update({ state: state?.name || '', city: '' });
  };

  const addContact = () => setAdditionalContacts((c) => [...c, { ...EMPTY_CONTACT }]);
  const removeContact = (index: number) => setAdditionalContacts((c) => c.filter((_, i) => i !== index));
  const updateContact = (index: number, patch: Partial<typeof EMPTY_CONTACT>) => {
    setAdditionalContacts((c) => c.map((contact, i) => (i === index ? { ...contact, ...patch } : contact)));
  };

  const handlePinCodeBlur = async () => {
    const pin = formData.pinCode.trim();
    if (formData.leadType !== 'DOMESTIC' || !/^\d{6}$/.test(pin)) return;
    setPinLookupStatus('loading');
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      const postOffice = data?.[0]?.PostOffice?.[0];
      if (data?.[0]?.Status === 'Success' && postOffice) {
        update({ state: postOffice.State, city: postOffice.District });
        setPinLookupStatus('idle');
      } else {
        setPinLookupStatus('error');
      }
    } catch {
      setPinLookupStatus('error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      await api.post('/super-admin/leads', {
        ...formData,
        leadDate: formData.leadDate ? new Date(formData.leadDate).toISOString() : undefined,
        followUpDate: formData.followUpDate ? new Date(formData.followUpDate).toISOString() : undefined,
        assignedTo: formData.assignedTo || undefined,
        additionalContacts: additionalContacts.filter((c) => c.firstName.trim() || c.email.trim() || c.phone.trim()),
      });
      router.push('/super-admin/leads');
    } catch (err: any) {
      setFormError(err?.response?.data?.message || 'Failed to save lead');
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <Link href="/super-admin/leads" className="text-zinc-400 hover:text-zinc-600">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Add New Lead</h1>
            <p className="text-xs text-zinc-500">Create a new prospect in the pipeline.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {LEAD_STAGE_GROUPS.filter((g) => g.key === 'NEW').map((g) => (
            <Link
              key={g.key}
              href={`/super-admin/leads?stage=${stageGroupQuery(g)}`}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
            >
              {g.navLabel}
            </Link>
          ))}
          <Link href="/super-admin/leads/follow-ups" className="px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50">
            Follow Ups
          </Link>
          {LEAD_STAGE_GROUPS.filter((g) => g.key !== 'NEW').map((g) => (
            <Link
              key={g.key}
              href={`/super-admin/leads?stage=${stageGroupQuery(g)}`}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
            >
              {g.navLabel}
            </Link>
          ))}
          <Link href="/super-admin/leads" className="px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50">
            Master Data
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {formError && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{formError}</div>}

        <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-md text-zinc-900">Company Information</h2>
              <div className="flex items-center gap-4 text-xs font-medium text-zinc-700">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" checked={formData.leadType === 'DOMESTIC'} onChange={() => handleLeadTypeChange('DOMESTIC')} />
                  Domestic
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" checked={formData.leadType === 'INTERNATIONAL'} onChange={() => handleLeadTypeChange('INTERNATIONAL')} />
                  International
                </label>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-3">
              <Field label="Company Name" required>
                <input required value={formData.companyName} onChange={(e) => update({ companyName: e.target.value })} className={fieldClass} />
              </Field>
              <Field label="Type Of Business">
                <input value={formData.typeOfBusiness} onChange={(e) => update({ typeOfBusiness: e.target.value })} className={fieldClass} />
              </Field>
              <Field label="Industry / Sector">
                <input value={formData.industry} onChange={(e) => update({ industry: e.target.value })} className={fieldClass} />
              </Field>
              <Field label="Company Website" optional>
                <input value={formData.companyWebsite} onChange={(e) => update({ companyWebsite: e.target.value })} className={fieldClass} />
              </Field>
              <Field label="Official Email" required>
                <input required type="email" value={formData.companyEmail} onChange={(e) => update({ companyEmail: e.target.value })} className={fieldClass} />
              </Field>
              <Field label="Landline No." optional>
                <input value={formData.landlineNo} onChange={(e) => update({ landlineNo: e.target.value })} className={fieldClass} />
              </Field>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg">
          <CardContent className="p-4 space-y-3">
            <h2 className="text-sm font-md text-zinc-900">Location &amp; Address</h2>
            <div className="grid grid-cols-6 gap-3">
              <Field label="Full Address" required className="col-span-2">
                <input required value={formData.fullAddress} onChange={(e) => update({ fullAddress: e.target.value })} className={fieldClass} />
              </Field>

              {formData.leadType === 'DOMESTIC' ? (
                <>
                  <Field label="Country" required>
                    <input required value={formData.country} onChange={(e) => update({ country: e.target.value })} className={fieldClass} />
                  </Field>
                  <Field label="Pin Code" required>
                    <input
                      required
                      value={formData.pinCode}
                      onChange={(e) => update({ pinCode: e.target.value })}
                      onBlur={handlePinCodeBlur}
                      className={fieldClass}
                    />
                    {pinLookupStatus === 'loading' && <p className="text-[10px] text-zinc-400 mt-1">Looking up...</p>}
                    {pinLookupStatus === 'error' && <p className="text-[10px] text-rose-500 mt-1">Couldn't auto-fill — enter manually.</p>}
                  </Field>
                  <Field label="State" required>
                    <input required value={formData.state} onChange={(e) => update({ state: e.target.value })} className={fieldClass} placeholder="Auto-filled from Pin Code" />
                  </Field>
                  <Field label="City / Town" required>
                    <input required value={formData.city} onChange={(e) => update({ city: e.target.value })} className={fieldClass} placeholder="Auto-filled from Pin Code" />
                  </Field>
                </>
              ) : (
                <>
                  <Field label="Country" required>
                    <select required value={countryIso} onChange={(e) => handleCountrySelect(e.target.value)} className={fieldClass}>
                      <option value="">Select Country</option>
                      {allCountries.map((c) => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
                    </select>
                  </Field>
                  <Field label="State" required>
                    <select required value={stateIso} onChange={(e) => handleStateSelect(e.target.value)} disabled={!countryIso} className={fieldClass}>
                      <option value="">{countryIso ? 'Select State' : 'Select Country first'}</option>
                      {states.map((s) => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
                    </select>
                  </Field>
                  <Field label="City / Town" required>
                    <select required value={formData.city} onChange={(e) => update({ city: e.target.value })} disabled={!stateIso} className={fieldClass}>
                      <option value="">{stateIso ? 'Select City' : 'Select State first'}</option>
                      {cities.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                  </Field>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-md text-zinc-900">Contact Details</h2>
              <button
                type="button"
                onClick={addContact}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <Plus size={12} /> Add More
              </button>
            </div>
            <div className="grid grid-cols-7 gap-3">
              <Field label="Title" required>
                <select value={formData.contactTitle} onChange={(e) => update({ contactTitle: e.target.value as any })} className={fieldClass}>
                  {TITLES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="First Name" required>
                <input required value={formData.contactName} onChange={(e) => update({ contactName: e.target.value })} className={fieldClass} />
              </Field>
              <Field label="Surname" optional>
                <input value={formData.contactSurname} onChange={(e) => update({ contactSurname: e.target.value })} className={fieldClass} />
              </Field>
              <Field label="Designation" optional>
                <input value={formData.contactDesignation} onChange={(e) => update({ contactDesignation: e.target.value })} className={fieldClass} />
              </Field>
              <Field label="Email" required>
                <input required type="email" value={formData.contactEmail} onChange={(e) => update({ contactEmail: e.target.value })} className={fieldClass} />
              </Field>
              <Field label="Mobile No." required>
                <input required value={formData.contactPhone} onChange={(e) => update({ contactPhone: e.target.value })} className={fieldClass} />
              </Field>
              <Field label="Alternate No." optional>
                <input value={formData.alternateContactPhone} onChange={(e) => update({ alternateContactPhone: e.target.value })} className={fieldClass} />
              </Field>
            </div>

            {additionalContacts.map((contact, i) => (
              <div key={i} className="grid grid-cols-7 gap-3 pt-2 border-t border-zinc-100">
                <Field label="Title">
                  <select value={contact.title} onChange={(e) => updateContact(i, { title: e.target.value as any })} className={fieldClass}>
                    {TITLES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="First Name">
                  <input value={contact.firstName} onChange={(e) => updateContact(i, { firstName: e.target.value })} className={fieldClass} />
                </Field>
                <Field label="Surname">
                  <input value={contact.surname} onChange={(e) => updateContact(i, { surname: e.target.value })} className={fieldClass} />
                </Field>
                <Field label="Designation">
                  <input value={contact.designation} onChange={(e) => updateContact(i, { designation: e.target.value })} className={fieldClass} />
                </Field>
                <Field label="Email">
                  <input type="email" value={contact.email} onChange={(e) => updateContact(i, { email: e.target.value })} className={fieldClass} />
                </Field>
                <Field label="Mobile No.">
                  <input value={contact.phone} onChange={(e) => updateContact(i, { phone: e.target.value })} className={fieldClass} />
                </Field>
                <div className="flex items-end gap-2">
                  <Field label="Alternate No." className="flex-1">
                    <input value={contact.alternatePhone} onChange={(e) => updateContact(i, { alternatePhone: e.target.value })} className={fieldClass} />
                  </Field>
                  <button type="button" onClick={() => removeContact(i)} className="mb-0.5 text-zinc-400 hover:text-rose-600 p-2">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg">
          <CardContent className="p-4 space-y-3">
            <h2 className="text-sm font-md text-zinc-900">CRM &amp; Tracking</h2>
            <div className="grid grid-cols-4 gap-3">
              <Field label="Data Source" required>
                <select required value={formData.source} onChange={(e) => update({ source: e.target.value })} className={fieldClass}>
                  <option value="">Select Source</option>
                  {(sources || []).filter((s: any) => s.isActive !== false).map((s: any) => (
                    <option key={s._id} value={s.value}>{s.value}</option>
                  ))}
                </select>
              </Field>
              <Field label="Lead Date" required>
                <input required type="datetime-local" value={formData.leadDate} onChange={(e) => update({ leadDate: e.target.value })} className={fieldClass} />
              </Field>
              <Field label="Assigned To" required>
                <select required value={formData.assignedTo} onChange={(e) => update({ assignedTo: e.target.value })} className={fieldClass}>
                  <option value="">Select User</option>
                  {(assignableUsers || []).map((u: any) => (
                    <option key={u._id} value={u._id}>{u.firstName} {u.lastName}</option>
                  ))}
                </select>
              </Field>
              <Field label="Follow Up Date" required>
                <input required type="datetime-local" value={formData.followUpDate} onChange={(e) => update({ followUpDate: e.target.value })} className={fieldClass} />
              </Field>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <p className="text-xs text-rose-500">* Required fields</p>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => { setFormData(EMPTY_FORM); setAdditionalContacts([]); setCountryIso(''); setStateIso(''); }}
            >
              Reset Form
            </Button>
            <Button type="submit" disabled={submitting} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {submitting ? 'Saving...' : 'Save Registration'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({
  label, required, optional, className = '', children,
}: { label: string; required?: boolean; optional?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-xs font-md text-zinc-700">
        {label} {required && <span className="text-rose-500">*</span>}
        {optional && <span className="text-zinc-400 font-normal">(Optional)</span>}
      </label>
      {children}
    </div>
  );
}
