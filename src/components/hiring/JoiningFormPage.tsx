'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Plus, Save, Trash2, FileText, CheckCircle2, User, MapPin, Briefcase, Shield, AlertCircle, GraduationCap, Building } from 'lucide-react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StepGate from './StepGate';
import { openFileUrl } from '@/lib/fileUrls';

const inp = 'w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-indigo-500';
const lbl = 'block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1';
const SectionHeader = ({ icon: Icon, title }: { icon: any; title: string }) => (
  <div className="flex items-center gap-2 border-b border-zinc-100 pb-2 dark:border-zinc-800">
    <Icon size={16} className="text-indigo-600" />
    <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{title}</h3>
  </div>
);

export default function JoiningFormPage({ candidateId }: { candidateId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState(0);

  const { data: candidate } = useQuery<any>({
    queryKey: ['candidate', candidateId],
    queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}`)).data,
  });
  const { data: pipeline } = useQuery<any>({
    queryKey: ['candidate-pipeline', candidateId],
    queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}/pipeline`)).data,
  });
  const { data: hiringProfile } = useQuery<any>({
    queryKey: ['candidate-hiring-profile', candidateId],
    queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}/hiring-profile`)).data,
  });
  const { data: records = [] } = useQuery<any[]>({
    queryKey: ['hiring-step-records', 'joining-form', candidateId],
    queryFn: async () => (await api.get(`/hiring/joining-form?candidateId=${candidateId}`)).data,
  });

  const stepState = pipeline?.steps?.find((s: any) => s.key === 'joiningForm');
  const locked = stepState?.gate?.unlocked === false;

  const { register, control, handleSubmit, reset, formState: { errors, isDirty } } = useForm<any>({
    defaultValues: {
      educationDetails: [{ qualification: '', institution: '', yearOfPassing: '', percentage: '' }],
      previousEmployment: [{ companyName: '', designation: '', fromDate: '', toDate: '', lastSalary: '', reasonForLeaving: '' }],
    }
  });

  useEffect(() => {
    if (!hiringProfile || isDirty) return;
    const c = hiringProfile.candidate || {};
    const m = hiringProfile.manpower || {};
    const previous = hiringProfile.joiningForm || {};
    const p = previous.personalDetails || {};
    const contact = previous.contactDetails || {};
    const position = previous.positionDetails || {};
    reset({
      personalDetails: { ...p, fullName: p.fullName || `${c.firstName || ''} ${c.lastName || ''}`.trim(), dob: p.dob || c.applicationDetails?.dateOfBirth || '' },
      contactDetails: { ...contact, mobileNumber: contact.mobileNumber || c.phone || '', personalEmail: contact.personalEmail || c.email || '' },
      positionDetails: { ...position, designation: position.designation || m.designation || c.jobRole || '', department: position.department || m.departmentName || '', joiningDate: position.joiningDate || hiringProfile.loi?.joiningDate || m.requiredJoiningDate || '', workLocation: position.workLocation || m.workLocation || '' },
      educationDetails: previous.educationDetails?.length ? previous.educationDetails : [{ qualification: '', institution: '', yearOfPassing: '', percentage: '' }],
      previousEmployment: previous.previousEmployment?.length ? previous.previousEmployment : [{ companyName: '', designation: '', fromDate: '', toDate: '', lastSalary: '', reasonForLeaving: '' }],
    });
  }, [hiringProfile, isDirty, reset]);

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: 'educationDetails' });
  const { fields: empFields, append: appendEmp, remove: removeEmp } = useFieldArray({ control, name: 'previousEmployment' });

  const saveMutation = useMutation({
    mutationFn: async (values: any) => (await api.post('/hiring/joining-form', { ...values, candidateId })).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hiring-step-records', 'joining-form', candidateId] });
      queryClient.invalidateQueries({ queryKey: ['candidate-pipeline', candidateId] });
    },
  });

  const pdfMutation = useMutation({
    mutationFn: async (id: string) => (await api.post(`/hiring/joining-form/${id}/generate-pdf`)).data,
    onSuccess: (data) => {
      const url = data.pdfUrl;
      if (url) openFileUrl(url);
      queryClient.invalidateQueries({ queryKey: ['hiring-step-records', 'joining-form', candidateId] });
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (id: string) => (await api.put(`/hiring/joining-form/${id}/verify`, {})).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hiring-step-records', 'joining-form', candidateId] });
      queryClient.invalidateQueries({ queryKey: ['candidate-pipeline', candidateId] });
      queryClient.invalidateQueries({ queryKey: ['employees-picker'] });
    },
  });

  const sections = ['Personal', 'Contact & Address', 'Position', 'Identity', 'Emergency', 'Education', 'Employment', 'Operational'];

  return (
    <div className="mx-auto max-w-5xl space-y-4 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <Button variant="ghost" className="h-8 gap-2 px-2 text-xs" onClick={() => router.push(`/company/hiring/${candidateId}`)}>
          <ArrowLeft size={14} /> Candidate Workflow
        </Button>
        <StepGate unlocked={!locked} blockedBy={stepState?.gate?.blockedBy || []} compact />
      </div>

      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 px-6 py-5 text-white shadow-lg">
        <p className="text-[11px] font-medium uppercase tracking-widest text-indigo-200">Step 9 · Onboarding</p>
        <h1 className="mt-1 text-2xl font-bold">Employee Joining Form</h1>
        {candidate && <p className="mt-1 text-sm text-indigo-200">{candidate.firstName} {candidate.lastName} · {candidate.jobRole}</p>}
      </div>

      {/* Saved Records */}
      {records.length > 0 && (
        <Card className="border-emerald-100 dark:border-emerald-900">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-emerald-700 dark:text-emerald-400">Saved Records ({records.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {records.map((r: any) => (
              <div key={r._id} className="flex items-center justify-between rounded-lg border border-zinc-100 p-3 dark:border-zinc-800">
                <div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${r.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {r.status === 'Verified' && <CheckCircle2 size={11} />} {r.status}
                  </span>
                  <span className="ml-3 text-xs text-zinc-500">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-7 gap-1 px-2 text-xs" onClick={() => pdfMutation.mutate(r._id)}>
                    <FileText size={12} /> PDF
                  </Button>
                  {r.status !== 'Verified' && (
                    <Button size="sm" variant="outline" className="h-7 gap-1 px-2 text-xs text-emerald-600 border-emerald-200" onClick={() => verifyMutation.mutate(r._id)}>
                      <CheckCircle2 size={12} /> Verify
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Form */}
      {!locked && (
        <form onSubmit={handleSubmit((v) => saveMutation.mutate(v))} className="space-y-4">
          {/* Section Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {sections.map((s, i) => (
              <button key={s} type="button" onClick={() => setActiveSection(i)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${activeSection === i ? 'bg-indigo-600 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'}`}>
                {s}
              </button>
            ))}
          </div>

          {/* Section 0: Personal */}
          {activeSection === 0 && (
            <Card><CardContent className="pt-5 space-y-4">
              <SectionHeader icon={User} title="Personal Details" />
              <div className="grid gap-3 md:grid-cols-2">
                {[['personalDetails.fullName','Full Name','text',true],['personalDetails.dob','Date of Birth','date',true],['personalDetails.fatherMotherName',"Father's / Mother's Name",'text',false],['personalDetails.nationality','Nationality','text',false],].map(([n,l,t,r]: any) => (
                  <label key={n}><span className={lbl}>{l}{r && <span className="text-rose-500 ml-0.5">*</span>}</span>
                    <input {...register(n as any, r ? {required:`${l} is required`} : {})} type={t} className={inp} />
                    {(errors as any)[n] && <p className="mt-1 text-xs text-rose-600">{(errors as any)[n]?.message}</p>}
                  </label>
                ))}
                <label><span className={lbl}>Gender<span className="text-rose-500 ml-0.5">*</span></span>
                  <select {...register('personalDetails.gender' as any, { required: true })} className={inp}>
                    <option value="">Select...</option>
                    {['Male','Female','Other'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </label>
                <label><span className={lbl}>Blood Group</span>
                  <select {...register('personalDetails.bloodGroup' as any)} className={inp}>
                    <option value="">Select...</option>
                    {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </label>
                <label><span className={lbl}>Marital Status</span>
                  <select {...register('personalDetails.maritalStatus' as any)} className={inp}>
                    <option value="">Select...</option>
                    {['Single','Married','Divorced','Widowed'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </label>
              </div>
            </CardContent></Card>
          )}

          {/* Section 1: Contact */}
          {activeSection === 1 && (
            <Card><CardContent className="pt-5 space-y-4">
              <SectionHeader icon={MapPin} title="Contact & Address Details" />
              <div className="grid gap-3 md:grid-cols-2">
                {[['contactDetails.mobileNumber','Mobile Number','text',true],['contactDetails.alternateNumber','Alternate Number','text',false],['contactDetails.personalEmail','Personal Email','text',false]].map(([n,l,t,r]: any) => (
                  <label key={n}><span className={lbl}>{l}{r && <span className="text-rose-500 ml-0.5">*</span>}</span>
                    <input {...register(n as any)} type={t} className={inp} />
                  </label>
                ))}
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="md:col-span-2"><span className={lbl}>Current Address</span>
                  <textarea {...register('contactDetails.currentAddress' as any)} rows={3} className={inp} />
                </label>
                <label className="md:col-span-2"><span className={lbl}>Permanent Address</span>
                  <textarea {...register('contactDetails.permanentAddress' as any)} rows={3} className={inp} />
                </label>
              </div>
            </CardContent></Card>
          )}

          {/* Section 2: Position */}
          {activeSection === 2 && (
            <Card><CardContent className="pt-5 space-y-4">
              <SectionHeader icon={Briefcase} title="Position & Employment Details" />
              <div className="grid gap-3 md:grid-cols-2">
                {[['positionDetails.designation','Designation','text',true],['positionDetails.department','Department','text',true],['positionDetails.joiningDate','Joining Date','date',true],['positionDetails.reportingManager','Reporting Manager','text',false],['positionDetails.workLocation','Work Location','text',false],['positionDetails.empCode','Employee Code','text',false]].map(([n,l,t,r]: any) => (
                  <label key={n}><span className={lbl}>{l}{r && <span className="text-rose-500 ml-0.5">*</span>}</span>
                    <input {...register(n as any)} type={t} className={inp} />
                  </label>
                ))}
                <label><span className={lbl}>Employee Category</span>
                  <select {...register('positionDetails.employeeCategory' as any)} className={inp}>
                    <option value="">Select...</option>
                    {['Permanent','Contract','Probation','Intern'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </label>
                <label><span className={lbl}>Link Employee Record</span>
                  <select {...register('employeeId' as any)} className={inp}>
                    <option value="">— Link existing employee (optional) —</option>
                  </select>
                </label>
              </div>
            </CardContent></Card>
          )}

          {/* Section 3: Identity */}
          {activeSection === 3 && (
            <Card><CardContent className="pt-5 space-y-4">
              <SectionHeader icon={Shield} title="Identification Details" />
              <div className="rounded-md bg-amber-50 border border-amber-200 p-3 flex gap-2 text-xs text-amber-700 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                Sensitive identifiers (Aadhaar, PAN) are encrypted at rest and masked in the UI.
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {[['identificationDetails.aadhaarNumber','Aadhaar Number'],['identificationDetails.panNumber','PAN Number'],['identificationDetails.drivingLicense','Driving License'],['identificationDetails.passportNumber','Passport Number'],['identificationDetails.voterId','Voter ID'],['identificationDetails.uanNumber','UAN Number'],['identificationDetails.pfNumber','PF Number'],['identificationDetails.esiNumber','ESI Number']].map(([n,l]) => (
                  <label key={n}><span className={lbl}>{l}</span><input {...register(n as any)} type="text" className={inp} /></label>
                ))}
              </div>
            </CardContent></Card>
          )}

          {/* Section 4: Emergency */}
          {activeSection === 4 && (
            <Card><CardContent className="pt-5 space-y-4">
              <SectionHeader icon={AlertCircle} title="Emergency Contact" />
              <div className="grid gap-3 md:grid-cols-2">
                {[['emergencyContact.name','Contact Name','text'],['emergencyContact.relationship','Relationship','text'],['emergencyContact.mobileNumber','Mobile Number','text'],['emergencyContact.alternateNumber','Alternate Number','text']].map(([n,l,t]) => (
                  <label key={n}><span className={lbl}>{l}</span><input {...register(n as any)} type={t} className={inp} /></label>
                ))}
                <label className="md:col-span-2"><span className={lbl}>Address</span>
                  <textarea {...register('emergencyContact.address' as any)} rows={2} className={inp} />
                </label>
              </div>
            </CardContent></Card>
          )}

          {/* Section 5: Education */}
          {activeSection === 5 && (
            <Card><CardContent className="pt-5 space-y-4">
              <SectionHeader icon={GraduationCap} title="Education Details" />
              {eduFields.map((f, i) => (
                <div key={f.id} className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900 relative">
                  <div className="grid gap-2 md:grid-cols-2">
                    {[['qualification','Qualification'],['institution','Institution'],['yearOfPassing','Year of Passing'],['percentage','Percentage / CGPA']].map(([k,l]) => (
                      <label key={k}><span className={lbl}>{l}</span>
                        <input {...register(`educationDetails.${i}.${k}` as any)} className={inp} />
                      </label>
                    ))}
                  </div>
                  {i > 0 && <Button type="button" variant="ghost" size="sm" className="absolute top-2 right-2 h-7 w-7 p-0 text-rose-500" onClick={() => removeEdu(i)}><Trash2 size={13} /></Button>}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => appendEdu({ qualification: '', institution: '', yearOfPassing: '', percentage: '' } as any)}>
                <Plus size={14} /> Add Education
              </Button>
            </CardContent></Card>
          )}

          {/* Section 6: Employment */}
          {activeSection === 6 && (
            <Card><CardContent className="pt-5 space-y-4">
              <SectionHeader icon={Building} title="Previous Employment" />
              {empFields.map((f, i) => (
                <div key={f.id} className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900 relative">
                  <div className="grid gap-2 md:grid-cols-2">
                    {[['companyName','Company Name'],['designation','Designation'],['fromDate','From Date'],['toDate','To Date'],['lastSalary','Last Salary'],['reasonForLeaving','Reason for Leaving']].map(([k,l]) => (
                      <label key={k}><span className={lbl}>{l}</span>
                        <input {...register(`previousEmployment.${i}.${k}` as any)} type={k.includes('Date') ? 'date' : 'text'} className={inp} />
                      </label>
                    ))}
                  </div>
                  {i > 0 && <Button type="button" variant="ghost" size="sm" className="absolute top-2 right-2 h-7 w-7 p-0 text-rose-500" onClick={() => removeEmp(i)}><Trash2 size={13} /></Button>}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => appendEmp({ companyName: '' } as any)}>
                <Plus size={14} /> Add Employment
              </Button>
            </CardContent></Card>
          )}

          {/* Section 7: Operational */}
          {activeSection === 7 && (
            <Card><CardContent className="pt-5 space-y-4">
              <SectionHeader icon={Briefcase} title="Operational Details & Declaration" />
              <div className="grid gap-3 md:grid-cols-2">
                {[['operationalDetails.weeklyOff','Weekly Off'],['operationalDetails.shift','Shift'],['operationalDetails.dutyTimingFrom','Duty From'],['operationalDetails.dutyTimingTo','Duty To'],['operationalDetails.attendanceMode','Attendance Mode'],['operationalDetails.dutyLocation','Duty Location']].map(([n,l]) => (
                  <label key={n}><span className={lbl}>{l}</span><input {...register(n as any)} className={inp} /></label>
                ))}
              </div>
              <div className="border-t pt-3 dark:border-zinc-800">
                <p className="text-xs font-medium text-zinc-600 mb-2 dark:text-zinc-400">HR Verification</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <label><span className={lbl}>HR Verified By</span><input {...register('declaration.hrVerifiedBy' as any)} className={inp} /></label>
                  <label><span className={lbl}>HR Designation</span><input {...register('declaration.hrDesignation' as any)} className={inp} /></label>
                  <label className="md:col-span-2"><span className={lbl}>HR Remarks</span><textarea {...register('declaration.hrRemarks' as any)} rows={2} className={inp} /></label>
                </div>
              </div>
            </CardContent></Card>
          )}

          {/* Navigation + Submit */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {activeSection > 0 && <Button type="button" variant="outline" size="sm" onClick={() => setActiveSection(s => s - 1)}>← Previous</Button>}
              {activeSection < sections.length - 1 && <Button type="button" size="sm" onClick={() => setActiveSection(s => s + 1)}>Next →</Button>}
            </div>
            <Button type="submit" disabled={saveMutation.isPending} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
              <Save size={16} /> {saveMutation.isPending ? 'Saving...' : 'Save Joining Form'}
            </Button>
          </div>
        </form>
      )}
      {locked && <StepGate unlocked={false} blockedBy={stepState?.gate?.blockedBy || []} />}
    </div>
  );
}
