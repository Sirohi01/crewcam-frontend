'use client';

import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Mail, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';

const empty = () => ({
  subject: 'Official Joining Confirmation',
  candidateName: '',
  designation: '',
  department: '',
  joiningDate: '',
  reportingTime: '09:30',
  reportingLocation: 'Head Office - Mohan Nagar, Ghaziabad',
  reportingTo: '',
  failureToReportDate: '',
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

export default function JoiningConfirmationForm({ candidateId }: { candidateId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const qc = useQueryClient();
  const [form, setForm] = useState(empty);
  const set = (patch: Partial<ReturnType<typeof empty>>) => setForm(old => ({ ...old, ...patch }));

  const { data: candidate } = useQuery<any>({ queryKey: ['candidate', candidateId], queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}`)).data });
  const { data: pipeline } = useQuery<any>({ queryKey: ['candidate-pipeline', candidateId], queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}/pipeline`)).data });

  const { data: records } = useQuery<any[]>({
    queryKey: ['joining-confirmation', candidateId],
    queryFn: async () => {
      const response = await api.get('/hiring/joining-confirmation', { params: { candidateId } });
      return Array.isArray(response.data) ? response.data : (response.data.data || []);
    }
  });

  const { data: lois } = useQuery<any[]>({
    queryKey: ['loi', candidateId],
    queryFn: async () => {
      const response = await api.get('/hiring/loi', { params: { candidateId } });
      return Array.isArray(response.data) ? response.data : (response.data.data || []);
    }
  });

  const isInitialized = React.useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;

    if (records === undefined || lois === undefined || candidate === undefined) return;

    const saved = editId ? records?.find(r => r._id === editId) : records?.[0];
    if (saved) {
      // Convert 12-hour AM/PM to 24-hour time input format if needed
      const convertTo24Hour = (time12: string) => {
        if (!time12) return '09:30';
        if (!time12.includes(' ')) return time12;
        const [time, period] = time12.trim().split(' ');
        let [hours, minutes] = time.split(':');
        let hour = parseInt(hours);

        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;

        return `${hour.toString().padStart(2, '0')}:${minutes}`;
      };

      setForm(current => ({
        ...current,
        candidateName: saved.candidateName || current.candidateName,
        subject: saved.subject || current.subject,
        department: saved.department || current.department,
        designation: saved.designation || current.designation,
        joiningDate: saved.confirmedJoiningDate ? new Date(saved.confirmedJoiningDate).toISOString().slice(0, 10) : (saved.joiningDate ? new Date(saved.joiningDate).toISOString().slice(0, 10) : current.joiningDate),
        reportingTime: convertTo24Hour(saved.reportingTime),
        reportingLocation: saved.reportingLocation || current.reportingLocation,
        reportingTo: saved.reportingTo || current.reportingTo,
        failureToReportDate: saved.failureToReportDate ? new Date(saved.failureToReportDate).toISOString().slice(0, 10) : current.failureToReportDate,
      }));
      return;
    }

    // Pre-fill from LOI
    const loi = lois?.[0];
    const candName = `${candidate?.firstName || ''} ${candidate?.lastName || ''}`.trim();
    if (loi) {
      const designation = loi.designation || loi.position || '';
      setForm(current => ({
        ...current,
        candidateName: candName || current.candidateName,
        department: loi.department || current.department,
        designation: designation || current.designation,
        joiningDate: loi.joiningDate ? new Date(loi.joiningDate).toISOString().slice(0, 10) : current.joiningDate,
        failureToReportDate: loi.joiningDate ? new Date(loi.joiningDate).toISOString().slice(0, 10) : current.failureToReportDate,
        reportingLocation: loi.reportingLocation || current.reportingLocation,
        reportingTo: loi.reportingTo || current.reportingTo,
        subject: candName && designation ? `Official Joining Confirmation - ${candName} - ${designation}` : current.subject
      }));
    } else if (candidate) {
      setForm(current => ({
        ...current,
        candidateName: candName || current.candidateName,
        designation: candidate.jobRole || current.designation
      }));
    }
    isInitialized.current = true;
  }, [records, lois, candidate, editId]);

  // Update subject automatically when name or designation changes
  useEffect(() => {
    if (form.candidateName || form.designation) {
      set({ subject: `Official Joining Confirmation - ${form.candidateName || ''} - ${form.designation || ''}`.replace(/ -  - /g, ' - ').replace(/ - $/g, '') });
    }
  }, [form.candidateName, form.designation]);

  const gate = pipeline?.steps?.find((step: any) => step.key === 'joiningConfirmation')?.gate || { unlocked: false, blockedBy: ['LOI'] };

  const save = useMutation({
    mutationFn: async () => {
      const formatTime = (time24: string) => {
        if (!time24) return time24;
        const [hours, minutes] = time24.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
      };

      const payload = {
        candidateId,
        candidateName: form.candidateName,
        subject: form.subject,
        department: form.department,
        designation: form.designation,
        joiningDate: form.joiningDate || undefined,
        confirmedJoiningDate: form.joiningDate || undefined,
        reportingTime: formatTime(form.reportingTime),
        reportingLocation: form.reportingLocation,
        reportingTo: form.reportingTo,
        failureToReportDate: form.failureToReportDate || undefined,
        status: 'Finalized'
      };

      const existing = editId ? records?.find(r => r._id === editId) : records?.[0];
      if (existing?._id) {
        return (await api.put(`/hiring/joining-confirmation/${existing._id}`, payload)).data;
      }
      return (await api.post('/hiring/joining-confirmation', payload)).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['candidate-pipeline', candidateId] });
      qc.invalidateQueries({ queryKey: ['joining-confirmation', candidateId] });
      toast.success('Joining Confirmation details saved successfully!');
      router.push(`/dashboard/hiring/steps/joining-confirmation`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.response?.data?.error || 'Joining Confirmation details could not be saved.');
    }
  });

  return (
    <div className="mx-auto max-w-[1500px] pb-10">
      <div className="border-b-2 border-[#0d3c68] px-1 pb-2 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#0d3c68] uppercase tracking-tight font-poppins px-1">JOINING CONFIRMATION</h1>
        <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/hiring/${candidateId}`)}>Back to Pipeline</Button>
      </div>

      <div className="mt-4 shadow-sm border border-slate-200 overflow-hidden bg-white rounded-md">
        <div className="bg-white px-5 py-2 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-[#0d3c68] flex items-center gap-2 uppercase tracking-tight">
            <Mail className="h-4 w-4 text-[#0d3c68]" />
            {records?.[0] ? 'EDIT JOINING CONFIRMATION' : 'NEW JOINING CONFIRMATION ENTRY'}
          </h2>
        </div>

        <div className="p-2">
          <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <Field title="Candidate Name" required className="md:col-span-1">
                  <input className={inputClass} value={form.candidateName} onChange={(e) => set({ candidateName: e.target.value })} required />
                </Field>
                <Field title="Position/Designation" required>
                  <input className={inputClass} value={form.designation} onChange={(e) => set({ designation: e.target.value })} required />
                </Field>
                <Field title="Department">
                  <input className={inputClass} value={form.department} onChange={(e) => set({ department: e.target.value })} />
                </Field>
                <Field title="Joining Date" required>
                  <input type="date" className={inputClass} value={form.joiningDate} onChange={(e) => {
                    set({ joiningDate: e.target.value });
                    if (!form.failureToReportDate || form.failureToReportDate === form.joiningDate) {
                      set({ failureToReportDate: e.target.value });
                    }
                  }} required />
                </Field>
                <Field title="Reporting Time">
                  <input type="time" className={inputClass} value={form.reportingTime} onChange={(e) => set({ reportingTime: e.target.value })} />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <Field title="Reporting Location" className="md:col-span-2">
                  <input className={inputClass} value={form.reportingLocation} onChange={(e) => set({ reportingLocation: e.target.value })} />
                </Field>
                <Field title="Reporting To">
                  <input className={inputClass} value={form.reportingTo} onChange={(e) => set({ reportingTo: e.target.value })} />
                </Field>
                <Field title="Failure to Report Date">
                  <input type="date" className={inputClass} value={form.failureToReportDate} onChange={(e) => set({ failureToReportDate: e.target.value })} />
                </Field>
                <Field title="Subject">
                  <input className={inputClass} value={form.subject} onChange={(e) => set({ subject: e.target.value })} />
                </Field>
              </div>

              <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setForm(empty())}
                  className="group flex items-center gap-2 px-5 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-all rounded-[2px]"
                >
                  <RotateCcw className="h-3.5 w-3.5 transition-transform group-hover:-rotate-45" />
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={save.isPending}
                  className="flex items-center gap-2 px-8 py-2 text-xs font-bold bg-[#0d3c68] text-white hover:bg-[#0a2e50] shadow-md hover:shadow-lg transition-all rounded-[2px] tracking-wide"
                >
                  <Save className="h-4 w-4" />
                  {save.isPending ? 'SAVING...' : (records?.[0] ? 'UPDATE ENTRY' : 'SAVE ENTRY')}
                </button>
                <button
                  type="button"
                  onClick={() => window.open(`/dashboard/hiring/${candidateId}/print/joining-confirmation`, '_blank')}
                  className="flex items-center gap-2 px-8 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-all rounded-[2px] tracking-wide"
                >
                  PRINT
                </button>
              </div>
            </form>
          </div>
      </div>
    </div>
  );
}
