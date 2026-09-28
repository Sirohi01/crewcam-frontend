'use client';
// trigger reload

import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FileText, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';

const empty = () => ({
  department: '',
  position: '',
  joiningDate: '',
  reportingTime: '09:30',
  reportingLocation: 'Head Office – Ghaziabad',
  reportingTo: '',
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

export default function LetterOfIntentForm({ candidateId }: { candidateId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const qc = useQueryClient();
  const [form, setForm] = useState(empty);
  const set = (patch: Partial<ReturnType<typeof empty>>) => setForm(old => ({ ...old, ...patch }));

  const { data: candidate } = useQuery<any>({ queryKey: ['candidate', candidateId], queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}`)).data });

  const { data: savedLOIs } = useQuery<any[]>({
    queryKey: ['loi', candidateId],
    queryFn: async () => {
      const response = await api.get('/hiring/loi', { params: { candidateId } });
      return Array.isArray(response.data) ? response.data : (response.data.data || []);
    }
  });

  const { data: ctcBreakups } = useQuery<any[]>({
    queryKey: ['ctc-breakup', candidateId],
    queryFn: async () => {
      const response = await api.get('/hiring/ctc-breakup', { params: { candidateId } });
      return Array.isArray(response.data) ? response.data : (response.data.data || []);
    }
  });

  const isInitialized = React.useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;

    const saved = editId ? savedLOIs?.find(r => r._id === editId) : savedLOIs?.[0];
    const ctc = ctcBreakups?.[0];

    if (savedLOIs === undefined || ctcBreakups === undefined || candidate === undefined) return;
    if (saved) {
      // Convert 12-hour AM/PM to 24-hour time input format
      const convertTo24Hour = (time12: string) => {
        if (!time12) return '09:30';
        if (!time12.includes(' ')) return time12; // Already 24h probably
        const [time, period] = time12.trim().split(' ');
        let [hours, minutes] = time.split(':');
        let hour = parseInt(hours);

        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;

        return `${hour.toString().padStart(2, '0')}:${minutes}`;
      };

      setForm(current => ({
        ...current,
        department: saved.department || current.department,
        position: saved.position || current.position,
        joiningDate: saved.joiningDate ? new Date(saved.joiningDate).toISOString().slice(0, 10) : current.joiningDate,
        reportingTime: convertTo24Hour(saved.reportingTime),
        reportingLocation: saved.reportingLocation || current.reportingLocation,
        reportingTo: saved.reportingTo || current.reportingTo
      }));
      isInitialized.current = true;
      return;
    }

    // Pre-fill from CTC Breakup
    if (ctc) {
      setForm(current => ({
        ...current,
        department: ctc.department || current.department,
        position: ctc.position || current.position,
        joiningDate: ctc.effectiveDate ? new Date(ctc.effectiveDate).toISOString().slice(0, 10) : current.joiningDate,
        reportingLocation: ctc.workLocation || current.reportingLocation,
        reportingTo: ctc.reportingTo || current.reportingTo
      }));
    } else if (candidate) {
      setForm(current => ({
        ...current,
        position: candidate.jobRole || current.position
      }));
    }
    isInitialized.current = true;
  }, [savedLOIs, ctcBreakups, candidate]);

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

      const existing = editId ? savedLOIs?.find(r => r._id === editId) : savedLOIs?.[0];
      const payload = {
        candidateId,
        department: form.department,
        position: form.position,
        joiningDate: form.joiningDate,
        reportingTime: formatTime(form.reportingTime),
        reportingLocation: form.reportingLocation,
        reportingTo: form.reportingTo,
        status: existing?.status || 'Draft'
      };

      if (existing?._id) {
        return (await api.put(`/hiring/loi/${existing._id}`, payload)).data;
      }
      return (await api.post('/hiring/loi', payload)).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['candidate-pipeline', candidateId] });
      qc.invalidateQueries({ queryKey: ['loi', candidateId] });
      toast.success('LOI details saved successfully!');
      router.push(`/dashboard/hiring/steps/loi`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.response?.data?.error || 'LOI details could not be saved.');
    }
  });

  return (
    <div className="mx-auto max-w-[1500px] pb-10">
      <div className="border-b-2 border-[#0d3c68] px-1 pb-2 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#0d3c68] uppercase tracking-tight font-poppins px-1">LETTER OF INTENT (LOI)</h1>
        <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/hiring/${candidateId}`)}>Back to Pipeline</Button>
      </div>

      <div className="mt-4 shadow-sm border border-slate-200 overflow-hidden bg-white rounded-md">
        <div className="bg-white px-5 py-2 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-[#0d3c68] flex items-center gap-2 uppercase tracking-tight">
            <FileText className="h-4 w-4 text-[#0d3c68]" />
            {savedLOIs?.[0] ? 'EDIT LETTER OF INTENT' : 'NEW LETTER OF INTENT'}
          </h2>
        </div>

        <div className="p-2">
          <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                <Field title="Candidate Name" required>
                  <input readOnly className={inputClass} value={`${candidate?.firstName || ''} ${candidate?.lastName || ''}`} />
                </Field>
                <Field title="Department" required>
                  <input className={inputClass} value={form.department} onChange={(e) => set({ department: e.target.value })} required />
                </Field>
                <Field title="Position Selected For" required>
                  <input className={inputClass} value={form.position} onChange={(e) => set({ position: e.target.value })} required />
                </Field>
                <Field title="Proposed Joining Date" required>
                  <input type="date" className={inputClass} value={form.joiningDate} onChange={(e) => set({ joiningDate: e.target.value })} required />
                </Field>
                <Field title="Reporting Time" required>
                  <input type="time" className={inputClass} value={form.reportingTime} onChange={(e) => set({ reportingTime: e.target.value })} required />
                </Field>
                <Field title="Reporting Location" required className="md:col-span-2">
                  <input className={inputClass} value={form.reportingLocation} onChange={(e) => set({ reportingLocation: e.target.value })} required />
                </Field>
                <Field title="Reporting To" required className="md:col-span-2">
                  <input className={inputClass} value={form.reportingTo} onChange={(e) => set({ reportingTo: e.target.value })} required />
                </Field>
              </div>

              <div className="flex justify-end items-center gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => window.open(`/dashboard/hiring/${candidateId}/print/loi`, '_blank')}
                  className="group flex items-center gap-2 px-6 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-all rounded-[2px]"
                >
                  PRINT
                </button>
                <button
                  type="button"
                  onClick={() => setForm(empty())}
                  className="group flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-all rounded-[2px]"
                >
                  <RotateCcw className="h-3.5 w-3.5 transition-transform group-hover:-rotate-45" />
                  RESET
                </button>
                <button
                  type="submit"
                  disabled={save.isPending}
                  className="flex items-center gap-2 px-5 py-2 text-xs font-bold bg-[#0d3c68] text-white hover:bg-[#0a2e50] shadow-md hover:shadow-lg transition-all rounded-[2px] tracking-wide"
                >
                  <Save className="h-4 w-4" />
                  {save.isPending ? 'SAVING...' : 'SAVE ENTRY'}
                </button>
              </div>
            </form>
          </div>
      </div>
    </div>
  );
}
