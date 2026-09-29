'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FileCheck, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StepGate from './StepGate';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const input = 'mt-1 h-9 w-full rounded border border-slate-300 bg-white px-3 text-sm focus:border-[#0e4778] focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500';
const label = 'text-[12px] font-md uppercase text-slate-950';

const empty = () => ({
  department: '',
  position: '',
  workLocation: 'Mohan Nagar Ghaziabad',
  joiningDate: '',
  reportingTo: '',
  
  sourceOfHiring: '',
  sourceOthers: '',
  dateOfInterview: '',
  interviewedBy: '',
  evaluationSummary: '',
  
  proposedMonthlyCTC: '',
  proposedAnnualCTC: '',
  salaryStructure: 'As per company slab',
  exceptionJustification: '',
  budgetAvailability: 'Within Budget',
  
  justification: '',
  
  hrManagerName: '',
  deptHeadName: '',
  managementName: '',
  managementDecision: ''
});

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-slate-200 px-5 py-4 last:border-0">
      <h2 className="mb-3 flex items-center gap-2 text-base font-extrabold text-slate-950">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-[#0e4778] text-xs text-white">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({ title, children, required, className }: { title: string; children: React.ReactNode; required?: boolean, className?: string }) {
  return (
    <label className={className}>
      <span className={label}>{title}{required && <b className="text-red-600"> *</b>}</span>
      {children}
    </label>
  );
}

const formatDate = (dateStr: string | null | undefined, fallback: string) => {
  if (!dateStr) return fallback;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? fallback : d.toISOString().slice(0, 10);
};

export default function SelectionApprovalNote({ candidateId }: { candidateId: string }) {
  const router = useRouter();
  const qc = useQueryClient();
  const [form, setForm] = useState(empty);
  const set = (patch: Partial<ReturnType<typeof empty>>) => setForm(old => ({ ...old, ...patch }));

  const { data: candidate } = useQuery<any>({ queryKey: ['candidate', candidateId], queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}`)).data });
  const { data: pipeline } = useQuery<any>({ queryKey: ['candidate-pipeline', candidateId], queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}/pipeline`)).data });
  const { data: employees = [] } = useQuery<any[]>({ queryKey: ['employees-picker'], queryFn: async () => (await api.get('/employees')).data.data || [] });
  
  const { data: savedApprovalsData } = useQuery<any[]>({ 
    queryKey: ['selection-approval', candidateId], 
    queryFn: async () => { 
      const response = await api.get('/hiring/selection-approval', { params: { candidateId } }); 
      return Array.isArray(response.data) ? response.data : (response.data.data || []); 
    } 
  });
  const savedApprovals = savedApprovalsData || [];

  const { data: evaluationsData } = useQuery<any[]>({ 
    queryKey: ['evaluation', candidateId], 
    queryFn: async () => { 
      const response = await api.get('/hiring/evaluation', { params: { candidateId } }); 
      return Array.isArray(response.data) ? response.data : (response.data.data || []); 
    } 
  });
  const evaluations = evaluationsData || [];

  const [formInitialized, setFormInitialized] = useState(false);

  useEffect(() => {
    if (formInitialized) return;
    
    const saved = savedApprovals[0];
    if (saved) {
      setForm(current => ({
        ...current,
        department: saved.department || current.department,
        position: saved.position || current.position,
        workLocation: saved.workLocation || current.workLocation,
        joiningDate: formatDate(saved.joiningDate, current.joiningDate),
        reportingTo: saved.reportingTo || current.reportingTo,
        
        sourceOfHiring: saved.sourceOfHiring || current.sourceOfHiring,
        sourceOthers: saved.sourceOthers || current.sourceOthers,
        dateOfInterview: formatDate(saved.dateOfInterview, current.dateOfInterview),
        interviewedBy: saved.interviewedBy || current.interviewedBy,
        evaluationSummary: saved.evaluationSummary || current.evaluationSummary,
        
        proposedMonthlyCTC: saved.proposedMonthlyCTC ? String(saved.proposedMonthlyCTC) : current.proposedMonthlyCTC,
        proposedAnnualCTC: saved.proposedAnnualCTC ? String(saved.proposedAnnualCTC) : current.proposedAnnualCTC,
        salaryStructure: saved.salaryStructure || current.salaryStructure,
        exceptionJustification: saved.exceptionJustification || current.exceptionJustification,
        budgetAvailability: saved.budgetAvailability || current.budgetAvailability,
        
        justification: saved.justification || current.justification,
        
        hrManagerName: saved.hrManagerName || current.hrManagerName,
        deptHeadName: saved.deptHeadName || current.deptHeadName,
        managementName: saved.managementName || current.managementName,
        managementDecision: saved.managementDecision || current.managementDecision
      }));
      setFormInitialized(true);
      return;
    }

    // Pre-fill from previous step (evaluation) if no saved approval
    const evalData = evaluations[0];
    if (evalData) {
      setForm(current => ({
        ...current,
        dateOfInterview: evalData.candidateSnapshot?.interviewDate || current.dateOfInterview,
        interviewedBy: evalData.candidateSnapshot?.interviewerName || current.interviewedBy,
        workLocation: evalData.candidateSnapshot?.workLocation || current.workLocation,
        reportingTo: evalData.candidateSnapshot?.reportingTo || current.reportingTo,
        evaluationSummary: evalData.interviewerDecision || current.evaluationSummary,
        joiningDate: formatDate(evalData.earliestJoiningDate, current.joiningDate),
        proposedMonthlyCTC: evalData.proposedSalaryMax ? String(evalData.proposedSalaryMax) : current.proposedMonthlyCTC,
        hrManagerName: evalData.hrName || current.hrManagerName,
        deptHeadName: evalData.hodName || current.deptHeadName
      }));
      setFormInitialized(true);
    }
  }, [savedApprovals, evaluations, formInitialized]);

  const gate = pipeline?.steps?.find((step: any) => step.key === 'selectionApproval')?.gate || { unlocked: false, blockedBy: ['evaluation'] };

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        candidateId,
        candidateName: `${candidate?.firstName || ''} ${candidate?.lastName || ''}`.trim(),
        department: form.department,
        position: form.position || candidate?.jobRole,
        workLocation: form.workLocation,
        joiningDate: form.joiningDate || undefined,
        reportingTo: form.reportingTo,
        
        sourceOfHiring: form.sourceOfHiring,
        sourceOthers: form.sourceOthers,
        dateOfInterview: form.dateOfInterview || undefined,
        interviewedBy: form.interviewedBy,
        evaluationSummary: form.evaluationSummary,
        
        proposedMonthlyCTC: form.proposedMonthlyCTC ? Number(form.proposedMonthlyCTC) : undefined,
        proposedAnnualCTC: form.proposedAnnualCTC ? Number(form.proposedAnnualCTC) : undefined,
        salaryStructure: form.salaryStructure,
        exceptionJustification: form.exceptionJustification,
        budgetAvailability: form.budgetAvailability,
        
        justification: form.justification,
        
        hrManagerName: form.hrManagerName,
        deptHeadName: form.deptHeadName,
        managementName: form.managementName,
        managementDecision: form.managementDecision,
        
        status: 'active'
      };
      
      const existing = savedApprovals[0];
      if (existing?._id) {
        return (await api.put(`/hiring/selection-approval/${existing._id}`, payload)).data;
      }
      return (await api.post('/hiring/selection-approval', payload)).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['candidate-pipeline', candidateId] });
      qc.invalidateQueries({ queryKey: ['selection-approval', candidateId] });
      toast.success('Selection approval saved successfully!');
      router.push(`/dashboard/hiring/steps/selection-approval`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.response?.data?.error || 'Selection approval could not be saved.');
    }
  });

  return (
    <div className="mx-auto max-w-[1500px] pb-10">
      <div className="border-b-2 border-[#0e4778] px-1 pb-2 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-[#073a69] uppercase">SELECTION APPROVAL NOTE</h1>
        <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/hiring/${candidateId}`)}>Back to Pipeline</Button>
      </div>

      <div className="mt-4 overflow-hidden rounded border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3 font-extrabold text-[#073a69]">
            <FileCheck size={19} /> SELECTION APPROVAL NOTE (FILLED BY RECRUITMENT DIVISION)
          </div>
          <StepGate unlocked={gate.unlocked} blockedBy={gate.blockedBy || []} />
        </div>

        {!gate.unlocked ? (
          <div className="p-6">
            <StepGate unlocked={false} blockedBy={gate.blockedBy || []} />
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
            <Section n="1" title="CANDIDATE DETAILS">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
                <Field title="Name of Candidate" required className="xl:col-span-2">
                  <input readOnly className={`${input} bg-slate-100`} value={`${candidate?.firstName || ''} ${candidate?.lastName || ''}`} />
                </Field>
                <Field title="Department" required>
                  <input className={input} value={form.department} onChange={(e) => set({ department: e.target.value })} required />
                </Field>
                <Field title="Position Selected For" required>
                  <input className={input} value={form.position || candidate?.jobRole || ''} onChange={(e) => set({ position: e.target.value })} required />
                </Field>
                <Field title="Work Location" required>
                  <input className={input} value={form.workLocation} onChange={(e) => set({ workLocation: e.target.value })} required />
                </Field>
                <Field title="Date of Joining" required>
                  <input type="date" className={input} value={form.joiningDate} onChange={(e) => set({ joiningDate: e.target.value })} required />
                </Field>
                <Field title="Reporting To" required className="xl:col-span-2">
                  <input className={input} value={form.reportingTo} onChange={(e) => set({ reportingTo: e.target.value })} required />
                </Field>
              </div>
            </Section>

            <Section n="2" title="RECRUITMENT SUMMARY">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <Field title="Source of Hiring" required>
                  <select className={input} value={form.sourceOfHiring} onChange={(e) => set({ sourceOfHiring: e.target.value })} required>
                    <option value="">Select Source</option>
                    <option value="Internal Referral">Internal Referral</option>
                    <option value="Job Portal">Job Portal</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="Consultant">Consultant</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Others">Others</option>
                  </select>
                </Field>
                {form.sourceOfHiring === 'Others' && (
                  <Field title="Specify Others" required>
                    <input className={input} value={form.sourceOthers} onChange={(e) => set({ sourceOthers: e.target.value })} required />
                  </Field>
                )}
                <Field title="Date of Interview" required>
                  <input type="date" className={input} value={form.dateOfInterview} onChange={(e) => set({ dateOfInterview: e.target.value })} required />
                </Field>
                <Field title="Interviewed By" required>
                  <select className={input} value={form.interviewedBy} onChange={(e) => set({ interviewedBy: e.target.value })} required>
                    <option value="">Select Employee</option>
                    {employees.map((e: any) => <option key={e._id}>{e.firstName} {e.lastName}</option>)}
                  </select>
                </Field>
                <Field title="Evaluation Summary" required className="xl:col-span-2">
                  <div className="flex gap-4 mt-2">
                    {['Selected', 'Hold', 'Rejected'].map(val => (
                      <label key={val} className="flex items-center gap-1 text-sm cursor-pointer">
                        <input type="radio" checked={form.evaluationSummary === val} onChange={() => set({ evaluationSummary: val })} />
                        {val}
                      </label>
                    ))}
                  </div>
                </Field>
              </div>
            </Section>

            <Section n="3" title="CTC RECOMMENDATION">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <Field title="Proposed Monthly CTC" required>
                  <input type="number" className={input} value={form.proposedMonthlyCTC} onChange={(e) => set({ proposedMonthlyCTC: e.target.value })} required />
                </Field>
                <Field title="Proposed Annual CTC" required>
                  <input type="number" className={input} value={form.proposedAnnualCTC} onChange={(e) => set({ proposedAnnualCTC: e.target.value })} required />
                </Field>
                
                <Field title="Salary Structure" required className="xl:col-span-3">
                  <div className="flex gap-4 mt-2 items-center">
                    {['As per company slab', 'Exception Approved'].map(val => (
                      <label key={val} className="flex items-center gap-1 text-sm cursor-pointer whitespace-nowrap">
                        <input type="radio" checked={form.salaryStructure === val} onChange={() => set({ salaryStructure: val })} />
                        {val}
                      </label>
                    ))}
                    {form.salaryStructure === 'Exception Approved' && (
                      <input type="text" placeholder="Enter justification" className={`${input} !mt-0 ml-4`} value={form.exceptionJustification} onChange={(e) => set({ exceptionJustification: e.target.value })} required />
                    )}
                  </div>
                </Field>

                <Field title="Budget Availability" required className="xl:col-span-3">
                  <div className="flex gap-6 mt-2">
                    {['Within Budget', 'Budget Exceeded'].map(val => (
                      <label key={val} className="flex items-center gap-1 text-sm cursor-pointer">
                        <input type="radio" checked={form.budgetAvailability === val} onChange={() => set({ budgetAvailability: val })} />
                        {val}
                      </label>
                    ))}
                  </div>
                </Field>
              </div>
            </Section>

            <Section n="4" title="JUSTIFICATION FOR SELECTION">
              <textarea 
                className={`${input} h-24 py-3`} 
                placeholder="Enter detailed justification for selecting the candidate..."
                value={form.justification} 
                onChange={(e) => set({ justification: e.target.value })} 
                required 
              />
            </Section>

            <Section n="5" title="APPROVALS REQUIRED">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Field title="HR Manager - Name">
                  <input className={`${input} bg-slate-50`} placeholder="Auto-filled from evaluation" value={form.hrManagerName} disabled />
                </Field>
                <Field title="Department Head - Name">
                  <input className={`${input} bg-slate-50`} placeholder="Auto-filled from evaluation" value={form.deptHeadName} disabled />
                </Field>
                <Field title="Management Person Name">
                  <select className={input} value={form.managementName} onChange={(e) => set({ managementName: e.target.value })}>
                    <option value="">Select Management</option>
                    {employees.map((e: any) => <option key={e._id}>{e.firstName} {e.lastName}</option>)}
                  </select>
                </Field>
                <Field title="Management Decision" required>
                  <select className={input} value={form.managementDecision} onChange={(e) => set({ managementDecision: e.target.value })} required>
                    <option value="">Select Decision</option>
                    <option value="Approved for Offer Letter">Approved for Offer Letter</option>
                    <option value="Not Approved">Not Approved</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </Field>
              </div>
            </Section>

            <div className="flex items-center justify-between gap-3 bg-slate-50 px-5 py-4">
              <p className="max-w-xl text-xs italic text-slate-600">Please review all details before submitting the selection approval note.</p>
              <div className="flex gap-3">
                <Button type="button" variant="destructive" onClick={() => setForm(empty())}>
                  <RotateCcw size={16} className="mr-2" /> RESET FORM
                </Button>
                <Button type="submit" className="bg-[#0e4778] hover:bg-[#073a69]" disabled={save.isPending}>
                  <Save size={16} className="mr-2" /> {save.isPending ? 'SAVING…' : 'SAVE SELECTION NOTE'}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
