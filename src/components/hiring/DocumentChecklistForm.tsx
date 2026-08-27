'use client';

import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ClipboardCheck, Save, RotateCcw, FileText, Check, PencilLine, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StepGate from './StepGate';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface DocumentItem {
  id: string;
  name: string;
  submitted: boolean;
  verified: boolean;
  remarks: string;
}

interface DocumentCategory {
  title: string;
  items: DocumentItem[];
}

const INITIAL_CATEGORIES: DocumentCategory[] = [
  {
    title: "1. Identity & Address Proofs",
    items: [
      { id: "id1", name: "Aadhaar Card", submitted: false, verified: false, remarks: "" },
      { id: "id2", name: "PAN Card", submitted: false, verified: false, remarks: "" },
      { id: "id3", name: "Address Proof", submitted: false, verified: false, remarks: "" },
    ]
  },
  {
    title: "2. Educational Certificates",
    items: [
      { id: "ed1", name: "10th Marksheet", submitted: false, verified: false, remarks: "" },
      { id: "ed2", name: "12th Marksheet", submitted: false, verified: false, remarks: "" },
      { id: "ed3", name: "Graduation Degree", submitted: false, verified: false, remarks: "" },
      { id: "ed4", name: "Post-Graduation", submitted: false, verified: false, remarks: "" },
      { id: "ed5", name: "Technical Certificates", submitted: false, verified: false, remarks: "" },
      { id: "ed6", name: "Professional Certificates", submitted: false, verified: false, remarks: "" },
    ]
  },
  {
    title: "3. Previous Employment Documents",
    items: [
      { id: "em1", name: "Experience Letters", submitted: false, verified: false, remarks: "" },
      { id: "em2", name: "Relieving Letter", submitted: false, verified: false, remarks: "" },
      { id: "em3", name: "Last 3 Months Salary Slips", submitted: false, verified: false, remarks: "" },
      { id: "em4", name: "Last 3 Months Bank Statement", submitted: false, verified: false, remarks: "" },
    ]
  },
  {
    title: "4. Bank Details",
    items: [
      { id: "bk1", name: "Cancelled Cheque", submitted: false, verified: false, remarks: "" },
      { id: "bk2", name: "Bank Passbook Copy", submitted: false, verified: false, remarks: "" },
    ]
  },
  {
    title: "5. Family KYC",
    items: [
      { id: "kyc1", name: "Aadhaar of Parents/Spouse", submitted: false, verified: false, remarks: "" },
    ]
  },
  {
    title: "6. Company Property & Access",
    items: [
      { id: "pr1", name: "Laptop", submitted: false, verified: false, remarks: "" },
      { id: "pr2", name: "ID Card", submitted: false, verified: false, remarks: "" },
      { id: "pr3", name: "Email & System Access", submitted: false, verified: false, remarks: "" },
    ]
  },
  {
    title: "7. Mandatory HR Documents",
    items: [
      { id: "hr1", name: "Offer Letter Acceptance", submitted: false, verified: false, remarks: "" },
      { id: "hr2", name: "Appointment Letter", submitted: false, verified: false, remarks: "" },
      { id: "hr3", name: "NDA (Confidentiality Agreement)", submitted: false, verified: false, remarks: "" },
      { id: "hr4", name: "Company Policies Acceptance", submitted: false, verified: false, remarks: "" },
    ]
  }
];

const empty = () => ({
  employeeName: '',
  designation: '',
  department: '',
  dateOfJoining: '',
  workLocation: 'Mohannagar, Ghaziabad',
  employeeCode: '',
  employeeSignatureDate: '',
  hrName: '',
  hrRemarks: '',
  hrSignatureDate: '',
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

export default function DocumentChecklistForm({ candidateId }: { candidateId: string }) {
  const router = useRouter();
  const qc = useQueryClient();
  const [form, setForm] = useState(empty);
  const [categories, setCategories] = useState<DocumentCategory[]>(JSON.parse(JSON.stringify(INITIAL_CATEGORIES)));
  const set = (patch: Partial<ReturnType<typeof empty>>) => setForm(old => ({ ...old, ...patch }));

  const { data: candidate } = useQuery<any>({ queryKey: ['candidate', candidateId], queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}`)).data });
  const { data: pipeline } = useQuery<any>({ queryKey: ['candidate-pipeline', candidateId], queryFn: async () => (await api.get(`/hiring/candidates/${candidateId}/pipeline`)).data });
  const { data: records } = useQuery<any[]>({ 
    queryKey: ['doc-checklist', candidateId], 
    queryFn: async () => { 
      const response = await api.get('/hiring/doc-checklist', { params: { candidateId } }); 
      return Array.isArray(response.data) ? response.data : (response.data.data || []); 
    } 
  });
  const { data: joiningConfirmations } = useQuery<any[]>({ 
    queryKey: ['joining-confirmation', candidateId], 
    queryFn: async () => { 
      const response = await api.get('/hiring/joining-confirmation', { params: { candidateId } }); 
      return Array.isArray(response.data) ? response.data : (response.data.data || []); 
    } 
  });

  useEffect(() => {
    const saved = records?.[0];
    if (saved) {
      setForm(current => ({
        ...current,
        employeeName: saved.employeeName || current.employeeName,
        department: saved.department || current.department,
        designation: saved.designation || current.designation,
        dateOfJoining: saved.dateOfJoining ? new Date(saved.dateOfJoining).toISOString().slice(0, 10) : current.dateOfJoining,
        workLocation: saved.workLocation || current.workLocation,
        employeeCode: saved.employeeCode || current.employeeCode,
        employeeSignatureDate: saved.employeeSignatureDate ? new Date(saved.employeeSignatureDate).toISOString().slice(0, 10) : current.employeeSignatureDate,
        hrName: saved.hrName || current.hrName,
        hrRemarks: saved.hrRemarks || current.hrRemarks,
        hrSignatureDate: saved.hrSignatureDate ? new Date(saved.hrSignatureDate).toISOString().slice(0, 10) : current.hrSignatureDate,
      }));

      if (saved.items && saved.items.length > 0) {
        const newCats = JSON.parse(JSON.stringify(INITIAL_CATEGORIES)) as DocumentCategory[];
        newCats.forEach(cat => {
          cat.items.forEach(item => {
            const savedItem = saved.items.find((si: any) => si.documentName === item.name);
            if (savedItem) {
              item.submitted = savedItem.status === 'Submitted' || savedItem.status === 'Verified';
              item.verified = savedItem.status === 'Verified';
              item.remarks = savedItem.remarks || '';
            }
          });
        });
        setCategories(newCats);
      }
      return;
    }

    const jc = joiningConfirmations?.[0];
    const candName = `${candidate?.firstName || ''} ${candidate?.lastName || ''}`.trim();
    if (jc) {
      setForm(current => ({
        ...current,
        employeeName: jc.candidateName || candName || current.employeeName,
        department: jc.department || current.department,
        designation: jc.designation || current.designation,
        dateOfJoining: jc.confirmedJoiningDate ? new Date(jc.confirmedJoiningDate).toISOString().slice(0, 10) : (jc.joiningDate ? new Date(jc.joiningDate).toISOString().slice(0, 10) : current.dateOfJoining),
        workLocation: jc.reportingLocation || current.workLocation,
        reportingTo: jc.reportingTo || current.reportingTo
      }));
    } else if (candidate) {
      setForm(current => ({
        ...current,
        employeeName: candName || current.employeeName,
        designation: candidate.jobRole || current.designation
      }));
    }
  }, [records, joiningConfirmations, candidate]);

  const gate = pipeline?.steps?.find((step: any) => step.key === 'documentChecklist')?.gate || { unlocked: false, blockedBy: ['joiningConfirmation'] };

  const handleDocChange = (catIndex: number, docIndex: number, field: keyof DocumentItem, value: any) => {
    const newCategories = [...categories];
    newCategories[catIndex].items[docIndex] = {
      ...newCategories[catIndex].items[docIndex],
      [field]: value
    };
    setCategories(newCategories);
  };

  const save = useMutation({
    mutationFn: async () => {
      const flatItems = categories.flatMap(cat => cat.items.map(item => ({
        documentName: item.name,
        isMandatory: true,
        status: item.verified ? 'Verified' : (item.submitted ? 'Submitted' : 'Pending'),
        remarks: item.remarks
      })));

      const payload = {
        candidateId,
        employeeName: form.employeeName,
        designation: form.designation,
        department: form.department,
        dateOfJoining: form.dateOfJoining || undefined,
        workLocation: form.workLocation,
        employeeCode: form.employeeCode,
        employeeSignatureDate: form.employeeSignatureDate || undefined,
        hrName: form.hrName,
        hrRemarks: form.hrRemarks,
        hrSignatureDate: form.hrSignatureDate || undefined,
        items: flatItems,
        overallStatus: 'Incomplete'
      };
      
      const existing = records?.[0];
      if (existing?._id) {
        return (await api.put(`/hiring/doc-checklist/${existing._id}`, payload)).data;
      }
      return (await api.post('/hiring/doc-checklist', payload)).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['candidate-pipeline', candidateId] });
      qc.invalidateQueries({ queryKey: ['doc-checklist', candidateId] });
      toast.success('Document Checklist saved successfully!');
      router.push(`/dashboard/hiring/${candidateId}?autoNext=true`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.response?.data?.error || 'Document Checklist could not be saved.');
    }
  });

  return (
    <div className="mx-auto max-w-[1500px] pb-10">
      <div className="border-b-2 border-[#0d3c68] px-1 pb-2 flex items-center justify-between no-print">
        <h1 className="text-xl font-bold text-[#0d3c68] uppercase tracking-tight font-poppins px-1">STAFF ONBOARDING - DOCUMENT CHECKLIST</h1>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => window.print()}>Print Form</Button>
            <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/hiring/${candidateId}`)}>Back to Pipeline</Button>
        </div>
      </div>

      {/* PRINT VERSION (Replicated from hr-crm) */}
      <div className="hidden print:block font-serif text-black p-8 bg-white max-w-[900px] mx-auto min-h-screen">
          <div className="text-center mb-6">
              <h1 className="text-2xl font-bold border-b-2 border-slate-900 pb-2 mb-1 tracking-tight">DOCUMENT RECEIPT & VERIFICATION CHECKLIST</h1>
              <p className="text-[11px] font-medium">(To be completed during employee onboarding)</p>
          </div>

          <div className="mb-6">
              <h2 className="text-sm font-bold bg-slate-100 p-1 mb-3 uppercase border-l-4 border-slate-900 px-3 tracking-wide">EMPLOYEE DETAILS</h2>
              <div className="grid grid-cols-2 gap-y-3 px-2 text-xs">
                  <div className="flex border-b border-slate-100 pb-1 mr-4">
                      <span className="w-32 font-bold uppercase text-[10px] text-slate-500">Employee Name:</span>
                      <span className="font-bold border-b border-slate-900 w-full">{form.employeeName || '____________________'}</span>
                  </div>
                  <div className="flex border-b border-slate-100 pb-1">
                      <span className="w-32 font-bold uppercase text-[10px] text-slate-500">Date of Joining:</span>
                      <span className="font-bold border-b border-slate-900 w-full">{form.dateOfJoining || '____________________'}</span>
                  </div>
                  <div className="flex border-b border-slate-100 pb-1 mr-4">
                      <span className="w-32 font-bold uppercase text-[10px] text-slate-500">Designation:</span>
                      <span className="font-bold border-b border-slate-900 w-full">{form.designation || '____________________'}</span>
                  </div>
                  <div className="flex border-b border-slate-100 pb-1">
                      <span className="w-32 font-bold uppercase text-[10px] text-slate-500">Work Location:</span>
                      <span className="font-bold border-b border-slate-900 w-full">{form.workLocation || '____________________'}</span>
                  </div>
                  <div className="flex border-b border-slate-100 pb-1 mr-4">
                      <span className="w-32 font-bold uppercase text-[10px] text-slate-500">Department:</span>
                      <span className="font-bold border-b border-slate-900 w-full">{form.department || '____________________'}</span>
                  </div>
                  <div className="flex border-b border-slate-100 pb-1">
                      <span className="w-32 font-bold uppercase text-[10px] text-slate-500">Employee Code:</span>
                      <span className="font-bold border-b border-slate-900 w-full">{form.employeeCode || '____________________'}</span>
                  </div>
              </div>
          </div>

          <div className="mb-4">
              <h2 className="text-sm font-bold bg-slate-100 p-1 mb-2 uppercase border-l-4 border-slate-900 px-3 tracking-wide">B. DOCUMENT SUBMISSION</h2>
              <p className="text-[10px] mb-4 px-2 tracking-tight">I <span className="font-bold border-b border-slate-900 px-2">{form.employeeName || '____________________'}</span> hereby submit the following documents for verification.</p>
          </div>

          <div className="space-y-4">
              <table className="w-full text-[10px] border-collapse">
                  <thead>
                      <tr className="bg-slate-50 border-y border-slate-300">
                          <th className="p-1 px-4 text-left border-r border-slate-200 w-12">S.No.</th>
                          <th className="p-1 px-4 text-left border-r border-slate-200">Document / Description</th>
                          <th className="p-1 px-4 text-center border-r border-slate-200 w-20">Submitted</th>
                          <th className="p-1 px-4 text-center border-r border-slate-200 w-20">Verified</th>
                          <th className="p-1 px-4 text-left w-64">Remarks</th>
                      </tr>
                  </thead>
                  <tbody>
                      {categories.map((cat, catIdx) => (
                          <React.Fragment key={cat.title}>
                              <tr className="bg-slate-100/50">
                                  <td colSpan={5} className="p-1 px-4 font-bold border-b border-slate-200 uppercase tracking-tighter text-slate-600 bg-slate-50 text-[11px] py-1.5">
                                      {cat.title}
                                  </td>
                              </tr>
                              {cat.items.map((item, idx) => (
                                  <tr key={item.id} className="border-b border-slate-200 last:border-slate-300">
                                      <td className="p-1 px-4 text-center border-r border-slate-100">{idx + 1}</td>
                                      <td className="p-1 px-4 border-r border-slate-100">{item.name}</td>
                                      <td className="p-1 px-4 text-center border-r border-slate-100">
                                          <div className="w-4 h-4 border border-slate-900 mx-auto bg-white flex items-center justify-center font-bold">
                                              {item.submitted ? "✓" : ""}
                                          </div>
                                      </td>
                                      <td className="p-1 px-4 text-center border-r border-slate-100 font-bold">
                                          <div className="w-4 h-4 border border-slate-900 mx-auto bg-white flex items-center justify-center">
                                              {item.verified ? "✓" : ""}
                                          </div>
                                      </td>
                                      <td className="p-1 px-4 italic text-slate-600">{item.remarks || "________________________________________"}</td>
                                  </tr>
                              ))}
                          </React.Fragment>
                      ))}
                  </tbody>
              </table>
          </div>

          <div className="mt-12" style={{ pageBreakInside: 'avoid' }}>
              <h2 className="text-sm font-bold bg-slate-100 p-1 mb-4 uppercase border-l-4 border-slate-900 px-3 tracking-wide">C. EMPLOYEE DECLARATION</h2>
              <p className="text-[11px] mb-8 leading-relaxed">I declare that the information and documents submitted by me are true, correct and complete to the best of my knowledge.</p>
              <div className="grid grid-cols-2 gap-x-24 gap-y-12">
                  <div className="border-t border-slate-900 pt-1">
                      <span className="font-bold text-[10px] block uppercase text-slate-400 mb-1">Candiate Name:</span>
                      <span className="font-bold">{form.employeeName || '____________________'}</span>
                  </div>
                  <div className="border-t border-slate-900 pt-1">
                      <span className="font-bold text-[10px] block uppercase text-slate-400 mb-1">Employee Signature:</span>
                      <span className="font-bold text-slate-200">____________________</span>
                  </div>
                  <div className="border-t border-slate-900 pt-1">
                      <span className="font-bold text-[10px] block uppercase text-slate-400 mb-1">Date of Submission:</span>
                      <span className="font-bold">{form.employeeSignatureDate || '____________________'}</span>
                  </div>
              </div>
          </div>

          <div className="mt-16 pt-8 border-t-2 border-double border-slate-300" style={{ pageBreakInside: 'avoid' }}>
              <h2 className="text-sm font-bold bg-slate-100 p-1 mb-4 uppercase border-l-4 border-slate-400 px-3 tracking-wide">D. HR VERIFICATION SECTION</h2>
              <div className="mb-6 border border-dashed border-slate-300 p-3 min-h-[40px]">
                  <span className="font-bold text-[10px] block uppercase text-slate-400 mb-1">HR Remarks:</span>
                  <p className="text-[11px] font-bold">{form.hrRemarks || 'No remarks'}</p>
              </div>
              <div className="grid grid-cols-2 gap-x-24 gap-y-12 mt-8">
                  <div className="border-t border-slate-500 pt-1">
                      <span className="font-bold text-[10px] block uppercase text-slate-400 mb-1">HR Name:</span>
                      <span className="font-bold">{form.hrName || '____________________'}</span>
                  </div>
                  <div className="border-t border-slate-500 pt-1">
                      <span className="font-bold text-[10px] block uppercase text-slate-400 mb-1">HR Signature:</span>
                      <span className="font-bold text-slate-200">____________________</span>
                  </div>
                  <div className="border-t border-slate-500 pt-1">
                      <span className="font-bold text-[10px] block uppercase text-slate-400 mb-1">Signature Date:</span>
                      <span className="font-bold">{form.hrSignatureDate || '____________________'}</span>
                  </div>
              </div>
          </div>
      </div>

      <div className="mt-4 shadow-sm border border-slate-200 overflow-hidden bg-white rounded-md no-print">
        <div className="bg-white px-5 py-2 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-[#0d3c68] flex items-center gap-2 uppercase tracking-tight">
            <ClipboardCheck className="h-4 w-4 text-[#0d3c68]" />
            Staff Document Verification Checklist
          </h2>
          <StepGate unlocked={gate.unlocked} blockedBy={gate.blockedBy || []} />
        </div>

        {!gate.unlocked ? (
          <div className="p-6">
            <StepGate unlocked={false} blockedBy={gate.blockedBy || []} />
          </div>
        ) : (
          <div className="p-2 space-y-2">
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-2">
              <div className="bg-slate-50/30 p-2 border border-slate-100 rounded">
                <h3 className="text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <FileText className="h-3 w-3" /> Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <Field title="Candidate Name" required>
                    <input className={inputClass} value={form.employeeName} onChange={(e) => set({ employeeName: e.target.value })} required />
                  </Field>
                  <Field title="Designation" required>
                    <input className={inputClass} value={form.designation} onChange={(e) => set({ designation: e.target.value })} required />
                  </Field>
                  <Field title="Department" required>
                    <input className={inputClass} value={form.department} onChange={(e) => set({ department: e.target.value })} required />
                  </Field>
                  <Field title="Date of Joining" required>
                    <input type="date" className={inputClass} value={form.dateOfJoining} onChange={(e) => set({ dateOfJoining: e.target.value })} required />
                  </Field>
                  <Field title="Work Location" required>
                    <input className={inputClass} value={form.workLocation} onChange={(e) => set({ workLocation: e.target.value })} required />
                  </Field>
                  <Field title="Reporting To">
                    <input className={inputClass} value={form.reportingTo} onChange={(e) => set({ reportingTo: e.target.value })} />
                  </Field>
                  <Field title="Employee Code">
                    <input className={inputClass} value={form.employeeCode} onChange={(e) => set({ employeeCode: e.target.value })} placeholder="Auto-generated later" />
                  </Field>
                </div>
              </div>

              {/* CHECKLIST TABLE */}
              <div className="overflow-x-auto border border-slate-200 rounded-sm shadow-sm">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80">
                      <th className="border border-slate-200 px-3 py-2 text-center text-[11px] font-bold text-[#0d3c68] uppercase w-12">Sr.</th>
                      <th className="border border-slate-200 px-3 py-2 text-left text-[11px] font-bold text-[#0d3c68] uppercase">Document / Item Description</th>
                      <th className="border border-slate-200 px-3 py-2 text-center text-[11px] font-bold text-[#0d3c68] uppercase w-24">Submitted</th>
                      <th className="border border-slate-200 px-3 py-2 text-center text-[11px] font-bold text-[#0d3c68] uppercase w-28 tracking-tighter">Verified (HR)</th>
                      <th className="border border-slate-200 px-3 py-2 text-left text-[11px] font-bold text-[#0d3c68] uppercase w-1/3">Internal Remarks / Observations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat, catIdx) => (
                      <React.Fragment key={cat.title}>
                        <tr className="bg-slate-100/50">
                          <td colSpan={5} className="border border-slate-200 px-3 py-1.5 font-bold text-[#0d3c68] uppercase text-[10px] tracking-wider">
                            {cat.title}
                          </td>
                        </tr>
                        {cat.items.map((item, docIdx) => (
                          <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                            <td className="border border-slate-200 px-3 py-2 text-[12px] font-medium text-slate-600 text-center bg-slate-50/30">{docIdx + 1}</td>
                            <td className="border border-slate-200 px-3 py-2 text-[12px] font-bold text-slate-900">{item.name}</td>
                            <td className="border border-slate-200 px-3 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleDocChange(catIdx, docIdx, 'submitted', !item.submitted)}
                                className={cn(
                                  "mx-auto flex items-center justify-center h-5 w-5 transition-all border-2",
                                  item.submitted
                                    ? "bg-green-600 text-white border-green-600 shadow-inner"
                                    : "bg-white border-slate-400 text-slate-300 hover:border-[#0d3c68]/50"
                                )}
                              >
                                {item.submitted ? <Check className="h-4 w-4" /> : null}
                              </button>
                            </td>
                            <td className="border border-slate-200 px-3 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleDocChange(catIdx, docIdx, 'verified', !item.verified)}
                                className={cn(
                                  "mx-auto flex items-center justify-center h-5 w-5 transition-all border-2",
                                  item.verified
                                    ? "bg-[#0d3c68] text-white border-[#0d3c68] shadow-inner"
                                    : "bg-white border-slate-400 text-slate-300 hover:border-[#0d3c68]/50"
                                )}
                              >
                                {item.verified ? <Check className="h-4 w-4" /> : null}
                              </button>
                            </td>
                            <td className="border border-slate-200 px-2 py-1 bg-white/50">
                              <input
                                type="text"
                                value={item.remarks}
                                onChange={(e) => handleDocChange(catIdx, docIdx, 'remarks', e.target.value)}
                                placeholder="Enter remarks here..."
                                className="w-full h-8 px-2 border-2 border-slate-400 bg-white rounded-[2px] text-[10px] placeholder:text-[10px] text-slate-700 outline-none focus:border-[#0d3c68] placeholder:text-slate-400 font-medium transition-all"
                              />
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Declaration & Verification */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="bg-white p-2 border border-slate-300 rounded shadow-sm">
                  <h3 className="text-[11px] font-bold text-[#0d3c68] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <PencilLine className="h-3 w-3" /> Employee Declaration
                  </h3>
                  <div className="space-y-2">
                    <p className="text-[11px] text-slate-500 italic pb-2 border-b border-slate-100">"I declare that the information and documents submitted by me are true, correct and complete."</p>
                    <Field title="Submission Date">
                      <input type="date" className={inputClass} value={form.employeeSignatureDate} onChange={(e) => set({ employeeSignatureDate: e.target.value })} />
                    </Field>
                  </div>
                </div>

                <div className="bg-white p-2 border border-slate-300 rounded shadow-sm">
                  <h3 className="text-[11px] font-bold text-[#0d3c68] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5" /> HR Verification Details
                  </h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <Field title="Verified By HR">
                        <input className={inputClass} value={form.hrName} onChange={(e) => set({ hrName: e.target.value })} placeholder="Enter HR Name" />
                      </Field>
                      <Field title="Verification Date">
                        <input type="date" className={inputClass} value={form.hrSignatureDate} onChange={(e) => set({ hrSignatureDate: e.target.value })} />
                      </Field>
                    </div>
                    <Field title="General HR Remarks">
                      <input className={inputClass} value={form.hrRemarks} onChange={(e) => set({ hrRemarks: e.target.value })} placeholder="Overall verification status remarks..." />
                    </Field>
                  </div>
                </div>
              </div>

              <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setForm(empty()); setCategories(JSON.parse(JSON.stringify(INITIAL_CATEGORIES))); }}
                  className="group flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-all rounded-[2px]"
                >
                  <RotateCcw className="h-3.5 w-3.5 transition-transform group-hover:-rotate-45" />
                  RESET
                </button>
                <button
                  type="submit"
                  disabled={save.isPending}
                  className="flex items-center gap-2 px-8 py-2 text-xs font-bold bg-[#0d3c68] text-white hover:bg-[#0a2e50] shadow-md hover:shadow-lg transition-all rounded-[2px] tracking-wide"
                >
                  <Save className="h-4 w-4" />
                  {save.isPending ? 'SAVING...' : (records?.[0] ? 'UPDATE ENTRY' : 'SAVE ENTRY')}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}