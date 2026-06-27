'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { AlertTriangle, CheckCircle2, FileUp, ImagePlus, LockKeyhole, Plus, ShieldAlert, ShieldCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';
import api from '@/lib/axios';

const input = 'mt-1 h-8 w-full rounded-md border border-slate-300 bg-white px-2.5 py-1 text-sm focus:border-[#0e4778] focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-900';

const blankEducation = () => ({ qualification: '', university: '', institute: '', monthYear: '', result: '' });
const blankEmployment = () => ({ employer: '', periodFrom: '', periodTo: '', designation: '', ctc: '' });

const base = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  jobRole: '',
  source: '',
  manpowerRequestId: '',
  resumeUrl: '',
  profileImageUrl: '',
  applicationDetails: {
    title: '',
    gender: '',
    dateOfBirth: '',
    alternatePhone: '',
    postalCode: '',
    address: '',
    country: 'India',
    state: '',
    city: '',
    candidateType: 'Experienced',
    reasonForLeaving: '',
    cvScreenedBy: '',
    education: [blankEducation()],
    technicalSkills: [blankEducation()],
    employmentHistory: [blankEmployment()],
  },
};

type Application = typeof base.applicationDetails;

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-slate-200 px-4 py-3 last:border-0">
      <h2 className="mb-2.5 text-sm font-bold text-[#073a69]">{number}. {title}</h2>
      {children}
    </section>
  );
}

function Field({ label, children, wide = false, required = false }: { label: string; children: React.ReactNode; wide?: boolean; required?: boolean }) {
  return (
    <label className={wide ? 'md:col-span-2' : ''}>
      <span className="text-[11px] font-semibold uppercase tracking-tight text-slate-700">{label}{required && <b className="text-rose-600"> *</b>}</span>
      {children}
    </label>
  );
}

export default function CandidateCreateForm() {
  const router = useRouter();
  const qc = useQueryClient();
  const [form, setForm] = useState(base);
  const [resumeName, setResumeName] = useState('');
  const [photoName, setPhotoName] = useState('');
  const [uploading, setUploading] = useState<'resume' | 'photo' | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [resumeReview, setResumeReview] = useState<{ verdict: string; reason: string } | null>(null);
  const [photoWarning, setPhotoWarning] = useState<string | null>(null);

  const { data: requests = [] } = useQuery<any[]>({
    queryKey: ['manpower-request'],
    queryFn: async () => (await api.get('/hiring/manpower-request')).data,
  });

  const approved = requests.filter((request) => request.status === 'Approved');
  const selectedRequest = approved.find((request) => request._id === form.manpowerRequestId);

  const updateApplication = (patch: Partial<Application>) => {
    setForm((current) => ({ ...current, applicationDetails: { ...current.applicationDetails, ...patch } }));
  };

  const create = useMutation({
    mutationFn: async () => (await api.post('/hiring/candidates', form)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['candidates'] });
      router.push('/dashboard/hiring/candidates/new');
    },
  });

  const upload = async (kind: 'resume' | 'photo', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(kind);
    setUploadError(null);
    if (kind === 'resume') setResumeReview(null);
    if (kind === 'photo') setPhotoWarning(null);
    try {
      const data = new FormData();
      data.append('file', file);
      if (kind === 'resume') data.append('documentLabel', 'Resume');
      const result = await api.post('/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (kind === 'resume') {
        setForm((current) => ({ ...current, resumeUrl: result.data.url }));
        setResumeName(file.name);
        if (result.data.review) setResumeReview(result.data.review);
      } else {
        setForm((current) => ({ ...current, profileImageUrl: result.data.url }));
        setPhotoName(file.name);
        if (result.data.warning) setPhotoWarning(result.data.warning);
      }
    } catch (error: any) {
      setUploadError(error.response?.data?.message || `Could not upload ${kind === 'resume' ? 'resume' : 'photo'}.`);
    } finally {
      setUploading(null);
    }
  };

  const setEducation = (key: 'education' | 'technicalSkills', index: number, field: string, value: string) => {
    updateApplication({ [key]: form.applicationDetails[key].map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: value } : row)) } as Partial<Application>);
  };

  const setEmployment = (index: number, field: string, value: string) => {
    updateApplication({ employmentHistory: form.applicationDetails.employmentHistory.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: value } : row)) });
  };

  return (
    <div className="mx-auto max-w-[1500px] pb-10 font-sans text-slate-900">
      <div className="border-b-2 border-[#0e4778] px-1 pb-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#0e4778]">Hiring process · candidate application</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">Candidate Application & Interview Intake</h1>
        <p className="mt-1 text-sm text-slate-600">Create candidates only against an approved manpower requisition. All details stay linked to the candidate through the hiring workflow.</p>
      </div>

      <Card className="mt-4 border-slate-200">
        <CardContent className="p-0">
          <form onSubmit={(event) => { event.preventDefault(); create.mutate(); }}>
            <Section number="1" title="Approved Manpower Requirement">
              <Field label="Approved Manpower Requisition" required>
                <div className="mt-1">
                  <SearchableDropdown
                    options={approved.map((request) => ({ label: `${request.jobTitle} · ${request.designation || '—'} · ${request.locationBranchId?.name || 'Location'}`, value: request._id }))}
                    value={form.manpowerRequestId}
                    onChange={(value) => setForm((current) => ({ ...current, manpowerRequestId: value, jobRole: approved.find((request) => request._id === value)?.jobTitle || current.jobRole }))}
                    placeholder="Select an approved request"
                  />
                </div>
                {!approved.length && <p className="mt-2 flex items-center gap-1 text-xs text-amber-700"><LockKeyhole size={13} /> First create and approve a manpower requisition.</p>}
              </Field>

              {selectedRequest && (
                <div className="mt-3 grid gap-2 rounded-md bg-slate-50 p-3 text-xs text-slate-600 md:grid-cols-4">
                  <span><b>Role:</b> {selectedRequest.jobTitle}</span>
                  <span><b>Department:</b> {selectedRequest.departmentId?.name || '—'}</span>
                  <span><b>Positions:</b> {selectedRequest.numberOfPositions}</span>
                  <span><b>Joining target:</b> {selectedRequest.requiredJoiningDate ? new Date(selectedRequest.requiredJoiningDate).toLocaleDateString() : '—'}</span>
                </div>
              )}
            </Section>

            <Section number="2" title="Personal & Contact Details">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Field label="Title"><select className={input} value={form.applicationDetails.title} onChange={(e) => updateApplication({ title: e.target.value })}><option value="">Select</option><option>Mr.</option><option>Ms.</option><option>Mrs.</option><option>Dr.</option></select></Field>
                <Field label="First Name" required><input required className={input} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></Field>
                <Field label="Last Name" required><input required className={input} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></Field>
                <Field label="Gender" required><select required className={input} value={form.applicationDetails.gender} onChange={(e) => updateApplication({ gender: e.target.value })}><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></select></Field>
                <Field label="Primary Phone" required><input required className={input} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
                <Field label="Alternate Phone"><input className={input} value={form.applicationDetails.alternatePhone} onChange={(e) => updateApplication({ alternatePhone: e.target.value })} /></Field>
                <Field label="Email" required><input required type="email" className={input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
                <Field label="Date of Birth"><input type="date" className={input} value={form.applicationDetails.dateOfBirth} onChange={(e) => updateApplication({ dateOfBirth: e.target.value })} /></Field>
                <PincodeLookup value={form.applicationDetails.postalCode} onResolved={updateApplication} />
                <Field label="Address" wide required><textarea required className={`${input} h-20 resize-y`} value={form.applicationDetails.address} onChange={(e) => updateApplication({ address: e.target.value })} /></Field>
                <Field label="Country"><input className={input} value={form.applicationDetails.country} onChange={(e) => updateApplication({ country: e.target.value })} /></Field>
                <Field label="State"><input className={input} value={form.applicationDetails.state} onChange={(e) => updateApplication({ state: e.target.value })} /></Field>
                <Field label="City"><input className={input} value={form.applicationDetails.city} onChange={(e) => updateApplication({ city: e.target.value })} /></Field>
              </div>
            </Section>

            <Section number="3" title="Application & Attachments">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Field label="Role Applied For" required><input required className={input} value={form.jobRole} onChange={(e) => setForm({ ...form, jobRole: e.target.value })} /></Field>
                <Field label="Candidate Type"><select className={input} value={form.applicationDetails.candidateType} onChange={(e) => updateApplication({ candidateType: e.target.value })}><option>Experienced</option><option>Fresher</option></select></Field>
                <Field label="Source"><select className={input} value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}><option value="">Select source</option><option>LinkedIn</option><option>Referral</option><option>Website</option><option>Agency</option><option>Walk-In</option><option>Other</option></select></Field>
                <Field label="CV Screened By"><input className={input} value={form.applicationDetails.cvScreenedBy} onChange={(e) => updateApplication({ cvScreenedBy: e.target.value })} /></Field>
                <Field label="Reason for Leaving" wide><textarea className={`${input} h-20 resize-y`} disabled={form.applicationDetails.candidateType === 'Fresher'} value={form.applicationDetails.reasonForLeaving} onChange={(e) => updateApplication({ reasonForLeaving: e.target.value })} /></Field>
                <Field label="Resume (PDF/DOCX)" wide>
                  <label className="mt-1 flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-slate-300 px-3 py-3 text-sm"><FileUp size={16} /><span>{uploading === 'resume' ? 'Uploading...' : resumeName || (form.resumeUrl ? 'Resume attached' : 'Attach resume')}</span>{form.resumeUrl && <CheckCircle2 size={16} className="text-emerald-600" />}<input className="hidden" type="file" accept=".pdf,.docx" onChange={(e) => upload('resume', e)} /></label>
                  {resumeReview && (
                    <p className={`mt-1 flex items-center gap-1 text-xs ${resumeReview.verdict === 'genuine' ? 'text-emerald-700' : resumeReview.verdict === 'suspicious' ? 'text-amber-700' : 'text-slate-500'}`}>
                      {resumeReview.verdict === 'genuine' ? <ShieldCheck size={13} /> : <ShieldAlert size={13} />}
                      AI review: {resumeReview.reason}
                    </p>
                  )}
                </Field>
                <Field label="Candidate Photo" wide>
                  <label className="mt-1 flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-slate-300 px-3 py-3 text-sm"><ImagePlus size={16} /><span>{uploading === 'photo' ? 'Uploading...' : photoName || (form.profileImageUrl ? 'Photo attached' : 'Upload photo')}</span>{form.profileImageUrl && <CheckCircle2 size={16} className="text-emerald-600" />}<input className="hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => upload('photo', e)} /></label>
                  {photoWarning && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-amber-700">
                      <AlertTriangle size={13} /> {photoWarning}
                    </p>
                  )}
                </Field>
                {uploadError && (
                  <div className="md:col-span-2"><p className="flex items-center gap-1.5 text-xs text-rose-600"><AlertTriangle size={13} /> {uploadError}</p></div>
                )}
              </div>
            </Section>

            <Section number="4" title="Education Details">
              <RepeatingRows rows={form.applicationDetails.education} onAdd={() => updateApplication({ education: [...form.applicationDetails.education, blankEducation()] })} onRemove={(index) => updateApplication({ education: form.applicationDetails.education.filter((_, rowIndex) => rowIndex !== index) })}>
                {(row, index) => <div className="grid gap-3 md:grid-cols-5"><input className={input} placeholder="Qualification" value={row.qualification} onChange={(e) => setEducation('education', index, 'qualification', e.target.value)} /><input className={input} placeholder="University" value={row.university} onChange={(e) => setEducation('education', index, 'university', e.target.value)} /><input className={input} placeholder="Institute" value={row.institute} onChange={(e) => setEducation('education', index, 'institute', e.target.value)} /><input className={input} type="month" value={row.monthYear} onChange={(e) => setEducation('education', index, 'monthYear', e.target.value)} /><input className={input} placeholder="Result / %" value={row.result} onChange={(e) => setEducation('education', index, 'result', e.target.value)} /></div>}
              </RepeatingRows>
            </Section>

            <Section number="5" title="Technical / IT Skills">
              <RepeatingRows rows={form.applicationDetails.technicalSkills} onAdd={() => updateApplication({ technicalSkills: [...form.applicationDetails.technicalSkills, blankEducation()] })} onRemove={(index) => updateApplication({ technicalSkills: form.applicationDetails.technicalSkills.filter((_, rowIndex) => rowIndex !== index) })}>
                {(row, index) => <div className="grid gap-3 md:grid-cols-5"><input className={input} placeholder="Skill / Qualification" value={row.qualification} onChange={(e) => setEducation('technicalSkills', index, 'qualification', e.target.value)} /><input className={input} placeholder="Tool / Platform" value={row.university} onChange={(e) => setEducation('technicalSkills', index, 'university', e.target.value)} /><input className={input} placeholder="Institute / Source" value={row.institute} onChange={(e) => setEducation('technicalSkills', index, 'institute', e.target.value)} /><input className={input} type="month" value={row.monthYear} onChange={(e) => setEducation('technicalSkills', index, 'monthYear', e.target.value)} /><input className={input} placeholder="Proficiency" value={row.result} onChange={(e) => setEducation('technicalSkills', index, 'result', e.target.value)} /></div>}
              </RepeatingRows>
            </Section>

            <Section number="6" title="Employment History">
              <RepeatingRows rows={form.applicationDetails.employmentHistory} onAdd={() => updateApplication({ employmentHistory: [...form.applicationDetails.employmentHistory, blankEmployment()] })} onRemove={(index) => updateApplication({ employmentHistory: form.applicationDetails.employmentHistory.filter((_, rowIndex) => rowIndex !== index) })}>
                {(row, index) => <div className="grid gap-3 md:grid-cols-5"><input className={input} placeholder="Employer" value={row.employer} onChange={(e) => setEmployment(index, 'employer', e.target.value)} /><input className={input} type="month" value={row.periodFrom} onChange={(e) => setEmployment(index, 'periodFrom', e.target.value)} /><input className={input} type="month" value={row.periodTo} onChange={(e) => setEmployment(index, 'periodTo', e.target.value)} /><input className={input} placeholder="Designation" value={row.designation} onChange={(e) => setEmployment(index, 'designation', e.target.value)} /><input className={input} placeholder="Last CTC" value={row.ctc} onChange={(e) => setEmployment(index, 'ctc', e.target.value)} /></div>}
              </RepeatingRows>
            </Section>

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-5 py-4">
              <Button type="submit" className="bg-[#0e4778] hover:bg-[#073a69]" disabled={create.isPending || uploading !== null || !approved.length}>{create.isPending ? 'Adding candidate...' : 'Add Candidate to Pipeline'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function RepeatingRows<T extends object>({ rows, onAdd, onRemove, children }: { rows: T[]; onAdd: () => void; onRemove: (index: number) => void; children: (row: T, index: number) => React.ReactNode }) {
  return (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <div key={index} className="grid grid-cols-[1fr_auto] gap-2 rounded-md border border-slate-200 bg-slate-50 p-3">
          <div>{children(row, index)}</div>
          <Button type="button" variant="ghost" className="mt-1 h-9 w-9 p-0 text-rose-600" onClick={() => onRemove(index)} disabled={rows.length === 1}><Trash2 size={15} /></Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={onAdd}><Plus size={15} className="mr-2" />Add row</Button>
    </div>
  );
}

function PincodeLookup({ value, onResolved }: { value: string; onResolved: (location: Partial<Application>) => void }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const lookup = async (postalCode: string) => {
    onResolved({ postalCode });
    if (!/^\d{6}$/.test(postalCode)) {
      setMessage('');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const result = await api.get(`/locations/pincode/${postalCode}`);
      onResolved({ postalCode, country: result.data.country, state: result.data.state, city: result.data.city });
      setMessage(`Location found: ${result.data.city}, ${result.data.state}`);
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Enter address manually');
    } finally {
      setLoading(false);
    }
  };

  return (
    <label>
      <span className="text-[11px] font-semibold uppercase tracking-tight text-slate-700">PIN Code <b className="text-rose-600">*</b></span>
      <input required className={input} inputMode="numeric" maxLength={6} value={value} onChange={(e) => lookup(e.target.value.replace(/\D/g, ''))} placeholder="Enter 6-digit PIN code" />
      {loading && <p className="mt-1 text-[11px] text-slate-500">Finding location...</p>}
      {message && !loading && <p className="mt-1 text-[11px] text-indigo-700">{message}</p>}
    </label>
  );
}
