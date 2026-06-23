'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ClipboardList, FileText, RotateCcw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import { openFileUrl } from '@/lib/fileUrls';

const input = 'mt-1 h-9 w-full rounded border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-[#0e4778] focus:ring-2 focus:ring-blue-100';
const textArea = `${input} h-24 resize-y py-2`;
const label = 'text-[11px] font-semibold uppercase tracking-tight text-slate-700';
const today = new Date().toISOString().slice(0, 10);

const empty = () => ({
  departmentId: '', requestDate: today, locationBranchId: '', jobTitle: '', designation: '', reportingTo: '', numberOfPositions: '1',
  employmentTypes: [] as string[], hiringReasons: [] as string[], replacementName: '', detailedJustification: '', jobDescriptionSummary: '', kraReport: '',
  keyResponsibilitiesText: '', qualificationReq: '', experienceReq: '', technicalSkills: '', softSkills: '', salaryCtcMin: '', salaryCtcMax: '',
  budgetApprovedBy: '', benefits: [] as string[], otherBenefits: '', requiredJoiningDate: '', isUrgent: false, requestReceivedOn: '', recruitmentStartDate: '', recruitmentStatus: 'Pending', declarationAccepted: false,
});
const toggle = (items: string[], item: string) => items.includes(item) ? items.filter((entry) => entry !== item) : [...items, item];

function Field({ title, required, children, wide = false }: { title: string; required?: boolean; children: React.ReactNode; wide?: boolean }) {
  return <label className={wide ? 'md:col-span-2' : ''}><span className={label}>{title}{required && <b className="text-red-600"> *</b>}</span>{children}</label>;
}
function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return <section className="border-b border-slate-200 px-5 py-5 last:border-0"><h2 className="mb-4 text-base font-bold text-[#073a69]">{number}. {title}</h2>{children}</section>;
}
function CheckGroup({ values, onChange, options }: { values: string[]; onChange: (items: string[]) => void; options: string[] }) {
  return <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">{options.map((option) => <label key={option} className="flex items-center gap-2 text-xs font-medium text-slate-700"><input type="checkbox" checked={values.includes(option)} onChange={() => onChange(toggle(values, option))} className="h-4 w-4" />{option}</label>)}</div>;
}

const toId = (value: any) => value?._id || value || '';
const toDateInput = (value: any) => value ? new Date(value).toISOString().slice(0, 10) : '';

export default function ManpowerRequestsTab({ formOnly = false, requestId }: { formOnly?: boolean; requestId?: string }) {
  const qc = useQueryClient();
  const [form, setForm] = useState(empty);
  const set = (patch: Partial<ReturnType<typeof empty>>) => setForm((current) => ({ ...current, ...patch }));
  const { data: existing } = useQuery<any>({ queryKey: ['manpower-request', requestId], queryFn: async () => (await api.get(`/hiring/manpower-request/${requestId}`)).data, enabled: Boolean(requestId) });
  const { data: requests = [] } = useQuery<any[]>({ queryKey: ['manpower-requests'], queryFn: async () => (await api.get('/hiring/manpower-request')).data });
  const { data: employees = [] } = useQuery<any[]>({ queryKey: ['employees-picker'], queryFn: async () => (await api.get('/employees')).data.data || [] });
  const { data: departments = [] } = useQuery<any[]>({ queryKey: ['departments'], queryFn: async () => (await api.get('/companies/departments')).data.data || [] });
  const { data: branches = [] } = useQuery<any[]>({ queryKey: ['branches'], queryFn: async () => (await api.get('/companies/branches')).data.data || [] });
  const { data: designations = [] } = useQuery<any[]>({ queryKey: ['designations'], queryFn: async () => (await api.get('/companies/designations')).data.data || [] });
  const refresh = () => qc.invalidateQueries({ queryKey: ['manpower-requests'] });

  useEffect(() => {
    if (!existing) return;
    setForm({
      departmentId: toId(existing.departmentId),
      requestDate: toDateInput(existing.requestDate) || today,
      locationBranchId: toId(existing.locationBranchId),
      jobTitle: existing.jobTitle || '',
      designation: existing.designation || '',
      reportingTo: toId(existing.reportingTo),
      numberOfPositions: String(existing.numberOfPositions || 1),
      employmentTypes: existing.employmentTypes || (existing.employmentType ? [existing.employmentType] : []),
      hiringReasons: existing.hiringReasons || (existing.reasonForHiring ? [existing.reasonForHiring] : []),
      replacementName: existing.replacementName || '',
      detailedJustification: existing.detailedJustification || '',
      jobDescriptionSummary: existing.jobDescriptionSummary || '',
      kraReport: existing.kraReport || '',
      keyResponsibilitiesText: (existing.keyResponsibilities || []).join('\n'),
      qualificationReq: existing.qualificationReq || '',
      experienceReq: existing.experienceReq || '',
      technicalSkills: existing.technicalSkills || '',
      softSkills: existing.softSkills || '',
      salaryCtcMin: existing.salaryCtcMin ? String(existing.salaryCtcMin) : '',
      salaryCtcMax: existing.salaryCtcMax ? String(existing.salaryCtcMax) : '',
      budgetApprovedBy: toId(existing.budgetApprovedBy),
      benefits: existing.benefits || [],
      otherBenefits: existing.otherBenefits || '',
      requiredJoiningDate: toDateInput(existing.requiredJoiningDate),
      isUrgent: Boolean(existing.isUrgent || existing.priority === 'Urgent'),
      requestReceivedOn: toDateInput(existing.requestReceivedOn),
      recruitmentStartDate: toDateInput(existing.recruitmentStartDate),
      recruitmentStatus: existing.recruitmentStatus || 'Pending',
      declarationAccepted: Boolean(existing.declarationAccepted),
    });
  }, [existing]);

  const create = useMutation({
    mutationFn: async () => {
      const { keyResponsibilitiesText, ...rest } = form;
      const payload = { ...rest, keyResponsibilities: keyResponsibilitiesText.split('\n').map((item) => item.trim()).filter(Boolean), numberOfPositions: Number(form.numberOfPositions), employmentType: form.employmentTypes[0] || 'Full-time', reasonForHiring: form.hiringReasons[0] || 'New Position', priority: form.isUrgent ? 'Urgent' : 'Medium', salaryCtcMin: form.salaryCtcMin ? Number(form.salaryCtcMin) : undefined, salaryCtcMax: form.salaryCtcMax ? Number(form.salaryCtcMax) : undefined, budgetCTC: form.salaryCtcMax ? Number(form.salaryCtcMax) : undefined };
      return requestId ? (await api.put(`/hiring/manpower-request/${requestId}`, payload)).data : (await api.post('/hiring/manpower-request', payload)).data;
    }, onSuccess: () => { refresh(); if (!requestId) setForm(empty()); qc.invalidateQueries({ queryKey: ['manpower-request', requestId] }); },
  });
  const changeStatus = useMutation({ mutationFn: async ({ id, status }: { id: string; status: 'Approved' | 'Rejected' }) => (await api.put(`/hiring/manpower-request/${id}/status`, { status })).data, onSuccess: refresh });
  const generatePdf = useMutation({ mutationFn: async (id: string) => (await api.post(`/hiring/manpower-request/${id}/generate-pdf`)).data, onSuccess: (data) => { refresh(); openFileUrl(data.pdfUrl); } });
  const employeeOptions = employees.map((employee) => <option key={employee._id} value={employee._id}>{employee.firstName} {employee.lastName}</option>);
  const filteredDesignations = form.departmentId ? designations.filter((item) => item.departmentId?._id === form.departmentId || item.departmentId === form.departmentId) : designations;

  return <div className={`mx-auto max-w-[1500px] pb-10 font-sans text-slate-900${formOnly ? ' manpower-form-only' : ''}`}>
    {formOnly && <style>{`.manpower-form-only > section { display: none; }`}</style>}
    <div className="border-b-2 border-[#0e4778] px-1 pb-2 pt-1"><p className="text-[11px] font-bold uppercase tracking-wider text-[#0e4778]">Hiring process · Step 1</p><h1 className="text-2xl font-extrabold tracking-tight text-[#073a69]">Manpower Requisition Form</h1><p className="mt-1 text-sm text-slate-600">Create a complete approved requirement before candidates can be added.</p></div>
    <form className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm" onSubmit={(event) => { event.preventDefault(); create.mutate(); }}>
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4"><div className="flex items-center gap-3 text-base font-bold text-[#073a69]"><ClipboardList size={19} /> For Internal Use — HR & Recruitment Department</div><Button type="button" variant="outline" onClick={() => setForm(empty())}><RotateCcw size={15} className="mr-2" /> Reset</Button></div>
      <Section number="1" title="Department & Position Details"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><Field title="Department" required><select required className={input} value={form.departmentId} onChange={(e) => set({ departmentId: e.target.value })}><option value="">Select department</option>{departments.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select></Field><Field title="Date of Request" required><input required type="date" className={input} value={form.requestDate} onChange={(e) => set({ requestDate: e.target.value })} /></Field><Field title="Work Location" required><select required className={input} value={form.locationBranchId} onChange={(e) => set({ locationBranchId: e.target.value })}><option value="">Select branch</option>{branches.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select></Field><Field title="Number of Positions" required><input required min="1" type="number" className={input} value={form.numberOfPositions} onChange={(e) => set({ numberOfPositions: e.target.value })} /></Field><Field title="Position / Job Title" required><select required className={input} value={form.jobTitle} onChange={(e) => set({ jobTitle: e.target.value, designation: e.target.options[e.target.selectedIndex].text })}><option value="">Select position</option>{filteredDesignations.map((item) => <option key={item._id} value={item.name}>{item.name}</option>)}</select></Field><Field title="Reporting To" required><select required className={input} value={form.reportingTo} onChange={(e) => set({ reportingTo: e.target.value })}><option value="">Select employee</option>{employeeOptions}</select></Field><Field title="Requested By"><select className={input} value={form.budgetApprovedBy} onChange={(e) => set({ budgetApprovedBy: e.target.value })}><option value="">Select employee</option>{employeeOptions}</select></Field><Field title="Employment Type"><CheckGroup values={form.employmentTypes} onChange={(employmentTypes) => set({ employmentTypes })} options={['Full-time', 'Contract', 'Temporary', 'Internship']} /></Field></div></Section>
      <Section number="2" title="Hiring Need & Job Description"><div><span className={label}>Reason for Hiring</span><CheckGroup values={form.hiringReasons} onChange={(hiringReasons) => set({ hiringReasons })} options={['New Position', 'Replacement', 'Expansion', 'Urgent Operational Need', 'Project Requirement']} /></div><div className="mt-4 grid gap-4 md:grid-cols-2"><Field title="Replacement Employee Name"><input className={input} value={form.replacementName} onChange={(e) => set({ replacementName: e.target.value })} /></Field><Field title="Detailed Justification" required><input required className={input} value={form.detailedJustification} onChange={(e) => set({ detailedJustification: e.target.value })} /></Field><Field title="Job Description Summary" wide><textarea className={textArea} value={form.jobDescriptionSummary} onChange={(e) => set({ jobDescriptionSummary: e.target.value })} /></Field><Field title="KRA / Key Result Areas" wide><textarea className={textArea} value={form.kraReport} onChange={(e) => set({ kraReport: e.target.value })} /></Field><Field title="Key Responsibilities — one per line" wide><textarea className={textArea} value={form.keyResponsibilitiesText} onChange={(e) => set({ keyResponsibilitiesText: e.target.value })} /></Field></div></Section>
      <Section number="3" title="Candidate Requirement"><div className="grid gap-4 md:grid-cols-2"><Field title="Qualification Requirement"><textarea className={textArea} value={form.qualificationReq} onChange={(e) => set({ qualificationReq: e.target.value })} /></Field><Field title="Experience Requirement"><textarea className={textArea} value={form.experienceReq} onChange={(e) => set({ experienceReq: e.target.value })} /></Field><Field title="Technical Skills"><textarea className={textArea} value={form.technicalSkills} onChange={(e) => set({ technicalSkills: e.target.value })} /></Field><Field title="Soft Skills"><textarea className={textArea} value={form.softSkills} onChange={(e) => set({ softSkills: e.target.value })} /></Field></div></Section>
      <Section number="4" title="Budget, Benefits & Timeline"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><Field title="CTC From"><input type="number" className={input} value={form.salaryCtcMin} onChange={(e) => set({ salaryCtcMin: e.target.value })} /></Field><Field title="CTC To"><input type="number" className={input} value={form.salaryCtcMax} onChange={(e) => set({ salaryCtcMax: e.target.value })} /></Field><Field title="Budget Approved By"><select className={input} value={form.budgetApprovedBy} onChange={(e) => set({ budgetApprovedBy: e.target.value })}><option value="">Select employee</option>{employeeOptions}</select></Field><Field title="Required Joining Date"><input type="date" className={input} value={form.requiredJoiningDate} onChange={(e) => set({ requiredJoiningDate: e.target.value })} /></Field><Field title="Benefits" wide><CheckGroup values={form.benefits} onChange={(benefits) => set({ benefits })} options={['PF', 'ESIC', 'Incentives', 'Travel Allowance', 'Accommodation', 'Other']} /></Field><Field title="Other Benefits" wide><input className={input} value={form.otherBenefits} onChange={(e) => set({ otherBenefits: e.target.value })} /></Field></div><label className="mt-4 flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={form.isUrgent} onChange={(e) => set({ isUrgent: e.target.checked })} /> This is an urgent requirement.</label></Section>
      <Section number="5" title="HR Use & Declaration"><div className="grid gap-4 md:grid-cols-3"><Field title="Request Received On"><input type="date" className={input} value={form.requestReceivedOn} onChange={(e) => set({ requestReceivedOn: e.target.value })} /></Field><Field title="Recruitment Start Date"><input type="date" className={input} value={form.recruitmentStartDate} onChange={(e) => set({ recruitmentStartDate: e.target.value })} /></Field><Field title="Recruitment Status"><select className={input} value={form.recruitmentStatus} onChange={(e) => set({ recruitmentStatus: e.target.value })}><option>Pending</option><option>In Progress</option><option>On Hold</option><option>Completed</option></select></Field></div><label className="mt-5 flex items-start gap-2 text-sm text-slate-700"><input required type="checkbox" checked={form.declarationAccepted} onChange={(e) => set({ declarationAccepted: e.target.checked })} className="mt-1" />I confirm that this manpower requirement is essential for operational/project needs and budget has been considered.</label></Section>
      <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-5 py-4"><Button type="submit" className="bg-[#0e4778] hover:bg-[#073a69]" disabled={create.isPending}><Save size={16} className="mr-2" />{create.isPending ? 'Saving…' : 'Save Requisition'}</Button></div>
    </form>
    <section className="mt-7 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-200 px-5 py-4"><h2 className="font-bold text-[#073a69]">Manpower Requisition Register</h2><p className="mt-1 text-xs text-slate-500">Approve a request before adding candidates. Every PDF uses the Company Profile document header.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-left text-xs"><thead className="bg-slate-50 text-slate-600"><tr><th className="px-4 py-3">Request Date</th><th className="px-4 py-3">Position</th><th className="px-4 py-3">Department</th><th className="px-4 py-3">Positions</th><th className="px-4 py-3">Joining Date</th><th className="px-4 py-3">Priority</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{requests.map((request) => <tr key={request._id}><td className="px-4 py-3">{request.requestDate ? new Date(request.requestDate).toLocaleDateString() : '—'}</td><td className="px-4 py-3 font-semibold">{request.jobTitle}<span className="block font-normal text-slate-500">{request.designation || ''}</span></td><td className="px-4 py-3">{request.departmentId?.name || '—'}</td><td className="px-4 py-3">{request.numberOfPositions}</td><td className="px-4 py-3">{request.requiredJoiningDate ? new Date(request.requiredJoiningDate).toLocaleDateString() : '—'}</td><td className="px-4 py-3">{request.priority}</td><td className="px-4 py-3"><span className="rounded-full bg-slate-100 px-2 py-1 font-semibold">{request.status}</span></td><td className="px-4 py-3"><div className="flex justify-end gap-2">{request.status === 'Pending' && <><Button size="sm" onClick={() => changeStatus.mutate({ id: request._id, status: 'Approved' })}>Approve</Button><Button size="sm" variant="outline" onClick={() => changeStatus.mutate({ id: request._id, status: 'Rejected' })}>Reject</Button></>}<Button size="sm" variant="outline" onClick={() => generatePdf.mutate(request._id)} disabled={generatePdf.isPending}><FileText size={13} className="mr-1" />PDF</Button></div></td></tr>)}{!requests.length && <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-500">No manpower requisitions created yet.</td></tr>}</tbody></table></div></section>
  </div>;
}
