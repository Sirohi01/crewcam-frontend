'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Calculator, Save, RotateCcw, Building, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StepGate from './StepGate';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const empty = () => ({
  dear: '',
  department: '',
  position: '',
  workLocation: '',
  reportingTo: '',
  effectiveDate: '',
  monthlyGross: '',
});

function Field({ title, children, required, className }: { title: string; children: React.ReactNode; required?: boolean, className?: string }) {
  return (
    <div className={className}>
      <label className="block text-[11px] font-semibold text-black uppercase mb-0.5">
        {title}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass = "w-full h-7 px-2 bg-white border border-[#cbd5e1] hover:border-[#94a3b8] rounded-[2px] text-[13px] transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0d3c68] focus:border-[#0d3c68] disabled:bg-slate-50 disabled:text-slate-500";

export default function CTCBreakupForm({ candidateId }: { candidateId: string }) {
  const router = useRouter();
  const qc = useQueryClient();
  const [form, setForm] = useState(empty);
  const set = (patch: Partial<ReturnType<typeof empty>>) => setForm(old => ({ ...old, ...patch }));

  const { data: candidate } = useQuery<any>({ queryKey: ['candidate', candidateId], queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}`)).data });
  const { data: pipeline } = useQuery<any>({ queryKey: ['candidate-pipeline', candidateId], queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}/pipeline`)).data });

  const { data: savedCTCRecords } = useQuery<any[]>({
    queryKey: ['ctc-breakup', candidateId],
    queryFn: async () => {
      const response = await api.get('/hiring/ctc-breakup', { params: { candidateId } });
      return Array.isArray(response.data) ? response.data : (response.data.data || []);
    }
  });

  const { data: selectionApprovals } = useQuery<any[]>({
    queryKey: ['selection-approval', candidateId],
    queryFn: async () => {
      const response = await api.get('/hiring/selection-approval', { params: { candidateId } });
      return Array.isArray(response.data) ? response.data : (response.data.data || []);
    }
  });

  useEffect(() => {
    const saved = savedCTCRecords?.[0];
    if (saved) {
      setForm(current => ({
        ...current,
        dear: saved.dear || current.dear,
        department: saved.department || current.department,
        position: saved.position || current.position,
        workLocation: saved.workLocation || current.workLocation,
        reportingTo: saved.reportingTo || current.reportingTo,
        effectiveDate: saved.effectiveDate ? new Date(saved.effectiveDate).toISOString().slice(0, 10) : current.effectiveDate,
        monthlyGross: saved.monthlyGross ? String(saved.monthlyGross) : current.monthlyGross
      }));
      return;
    }

    // Pre-fill from Selection Approval
    const selection = selectionApprovals?.[0];
    if (selection) {
      setForm(current => ({
        ...current,
        dear: selection.candidateName ? selection.candidateName.split(' ')[0] : current.dear,
        department: selection.department || current.department,
        position: selection.position || current.position,
        workLocation: selection.workLocation || current.workLocation,
        reportingTo: selection.reportingTo || current.reportingTo,
        effectiveDate: (selection.joiningDate && !isNaN(new Date(selection.joiningDate).getTime())) ? new Date(selection.joiningDate).toISOString().slice(0, 10) : current.effectiveDate,
        monthlyGross: selection.proposedMonthlyCTC ? String(selection.proposedMonthlyCTC) : current.monthlyGross
      }));
    } else if (candidate) {
      setForm(current => ({
        ...current,
        dear: candidate.firstName || current.dear,
        position: candidate.jobRole || current.position,
        department: candidate.departmentId?.name || current.department
      }));
    }
  }, [savedCTCRecords, selectionApprovals, candidate]);

  const gate = pipeline?.steps?.find((step: any) => step.key === 'ctcBreakup')?.gate || { unlocked: false, blockedBy: ['selectionApproval'] };

  // Calculations
  const gross = parseFloat(form.monthlyGross) || 0;
  const basic = gross * 0.5;
  const hra = gross * 0.3;
  const otherAllowance = gross * 0.2;

  const employeePF = basic > 15000 ? 1800 : basic * 0.12;
  const employeeESI = gross <= 21000 ? gross * 0.0075 : 0;

  const employerPF = basic > 15000 ? 1800 : basic * 0.12;
  const employerESI = gross <= 21000 ? gross * 0.0325 : 0;

  const netTakeHome = gross - (employeePF + employeeESI);
  const annualCTC = gross * 12;

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        candidateId,
        candidateName: `${candidate?.firstName || ''} ${candidate?.lastName || ''}`.trim(),
        dear: form.dear,
        department: form.department,
        position: form.position,
        workLocation: form.workLocation,
        reportingTo: form.reportingTo,
        effectiveDate: form.effectiveDate || undefined,
        monthlyGross: Number(form.monthlyGross) || 0,
        status: 'Finalized'
      };

      const existing = savedCTCRecords?.[0];
      if (existing?._id) {
        return (await api.put(`/hiring/ctc-breakup/${existing._id}`, payload)).data;
      }
      return (await api.post('/hiring/ctc-breakup', payload)).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['candidate-pipeline', candidateId] });
      qc.invalidateQueries({ queryKey: ['ctc-breakup', candidateId] });
      toast.success('CTC Details saved successfully!');
      router.push(`/dashboard/hiring/steps/ctc-breakup`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.response?.data?.error || 'CTC Details could not be saved.');
    }
  });

  return (
    <div className="mx-auto max-w-[1500px] pb-10">
      <div className="border-b-2 border-[#0d3c68] px-1 pb-2 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#0d3c68] uppercase tracking-tight font-poppins px-1">STAFF CTC BREAKUP FORM</h1>
        <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/hiring/${candidateId}`)}>Back to Pipeline</Button>
      </div>

      <div className="mt-4 shadow-sm border border-slate-200 overflow-hidden bg-white rounded-md">
        <div className="bg-white px-5 py-2 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-[#0d3c68] flex items-center gap-2 uppercase tracking-tight">
            <Calculator className="h-4 w-4 text-[#0d3c68]" />
            STAFF CTC BREAKUP CALCULATOR
          </h2>
          <StepGate unlocked={gate.unlocked} blockedBy={gate.blockedBy || []} />
        </div>

        {!gate.unlocked ? (
          <div className="p-6">
            <StepGate unlocked={false} blockedBy={gate.blockedBy || []} />
          </div>
        ) : (
          <div className="p-3">
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
                <Field title="Candidate Name" required>
                  <input readOnly className={inputClass} value={`${candidate?.firstName || ''} ${candidate?.lastName || ''}`} />
                </Field>
                <Field title="Dear" required>
                  <input className={inputClass} value={form.dear} onChange={(e) => set({ dear: e.target.value })} placeholder="Salutation name" required />
                </Field>
                <Field title="Department" required>
                  <input className={inputClass} value={form.department} onChange={(e) => set({ department: e.target.value })} required />
                </Field>
                <Field title="Position" required>
                  <input className={inputClass} value={form.position} onChange={(e) => set({ position: e.target.value })} required />
                </Field>
                <Field title="Work Location" required>
                  <input className={inputClass} value={form.workLocation} onChange={(e) => set({ workLocation: e.target.value })} required />
                </Field>
                <Field title="Reporting To" required>
                  <input className={inputClass} value={form.reportingTo} onChange={(e) => set({ reportingTo: e.target.value })} required />
                </Field>
                <Field title="Effective Date" required>
                  <input type="date" className={inputClass} value={form.effectiveDate} onChange={(e) => set({ effectiveDate: e.target.value })} required />
                </Field>
              </div>

              <div className="bg-slate-50/50 p-2 rounded-lg border border-slate-200 mt-2">
                <div className="max-w-xs mb-6">
                  <Field title="Monthly Gross Salary (INR)" required>
                    <input
                      type="number"
                      value={form.monthlyGross}
                      onChange={(e) => set({ monthlyGross: e.target.value })}
                      className="mt-1 h-10 w-full rounded-[2px] border border-slate-300 bg-white px-3 text-lg font-bold text-[#0d3c68] focus:border-[#0d3c68] focus:outline-none focus:ring-1 focus:ring-[#0d3c68]"
                      required
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Calculation Details */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2 uppercase tracking-wide">
                      <Building className="h-4 w-4 text-slate-500" />
                      Earnings Breakup
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center bg-white p-2 border border-slate-100 rounded">
                        <span className="text-xs font-medium text-slate-500">Basic Salary (50%)</span>
                        <span className="text-sm font-bold text-slate-900">₹{basic.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-2 border border-slate-100 rounded">
                        <span className="text-xs font-medium text-slate-500">HRA (30%)</span>
                        <span className="text-sm font-bold text-slate-900">₹{hra.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-2 border border-slate-100 rounded">
                        <span className="text-xs font-medium text-slate-500">Other Allowances (20%)</span>
                        <span className="text-sm font-bold text-slate-900">₹{otherAllowance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                      </div>
                    </div>

                    <h3 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-2 uppercase tracking-wide pt-4">
                      <User className="h-4 w-4 text-slate-500" />
                      Employee Deductions
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center bg-white p-2 border border-slate-100 rounded">
                        <span className="text-xs font-medium text-slate-500">Employee PF (12% of Basic)</span>
                        <span className="text-sm font-bold text-red-600">(-) ₹{employeePF.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-2 border border-slate-100 rounded">
                        <span className="text-xs font-medium text-slate-500">Employee ESI (0.75% of Gross)</span>
                        <span className="text-sm font-bold text-red-600">(-) ₹{employeeESI.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm space-y-6">
                    <div>
                      <div className="text-[10px] font-bold text-[#0d3c68] uppercase tracking-widest mb-1">Monthly Take Home</div>
                      <div className="text-3xl font-black text-[#0d3c68]">
                        ₹{netTakeHome.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        <span className="text-sm font-medium text-slate-400 ml-2">/ month</span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                      <div className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-1">Total Annual CTC</div>
                      <div className="text-2xl font-black text-green-700">
                        ₹{annualCTC.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        <span className="text-xs font-medium text-slate-400 ml-2">per annum</span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 space-y-3">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Included Employer Costs</div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Employer PF Contribution:</span>
                        <span className="font-bold text-slate-700">₹{employerPF.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Employer ESI Contribution:</span>
                        <span className="font-bold text-slate-700">₹{employerESI.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end items-center gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setForm(empty())}
                  className="group flex items-center gap-2 px-6 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-all rounded-[2px]"
                >
                  <RotateCcw className="h-3.5 w-3.5 transition-transform group-hover:-rotate-45" />
                  RESET
                </button>
                <button
                  type="submit"
                  disabled={save.isPending}
                  className="flex items-center gap-2 px-10 py-2 text-xs font-bold bg-[#ed7d31] text-white hover:bg-[#d96a20] shadow-md hover:shadow-lg transition-all rounded-[2px] tracking-wide"
                >
                  <Save className="h-4 w-4" />
                  {save.isPending ? 'SAVING...' : 'SAVE CTC DETAILS'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
