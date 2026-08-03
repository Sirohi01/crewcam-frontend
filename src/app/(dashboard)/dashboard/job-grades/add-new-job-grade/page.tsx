'use client';
import React, { useState } from 'react';
import {
  ArrowLeft, Save, IdCard, Check, Info,
} from 'lucide-react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/breadCrumb';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import api from '@/lib/axios';

// ─── Static data ────────────────────────────────────────────────────────────
const EXAMPLE_GRADES = [
  { code: 'JG-01', level: 'Level 10', levelColor: 'bg-indigo-50 text-indigo-600', border: 'border-indigo-200', title: 'Director', pay: '₹ 2,00,000 - ₹ 3,20,000', family: 'Management', reports: 'CEO' },
  { code: 'JG-03', level: 'Level 7', levelColor: 'bg-blue-50 text-blue-600', border: 'border-blue-200', title: 'Deputy Manager', pay: '₹ 75,000 - ₹ 1,10,000', family: 'Management', reports: 'Manager' },
  { code: 'JG-05', level: 'Level 5', levelColor: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-200', title: 'Junior Manager', pay: '₹ 45,000 - ₹ 70,000', family: 'Management', reports: 'Manager' },
  { code: 'JG-07', level: 'Level 3', levelColor: 'bg-amber-50 text-amber-600', border: 'border-amber-200', title: 'Executive', pay: '₹ 25,000 - ₹ 35,000', family: 'Operations', reports: 'Asst. Manager' },
  { code: 'JG-09', level: 'Level 1', levelColor: 'bg-rose-50 text-rose-500', border: 'border-rose-200', title: 'Trainee', pay: '₹ 15,000 - ₹ 18,000', family: 'Operations', reports: 'Executive' },
];

const GRADE_LEVEL_GUIDE = [
  { level: '10', title: 'Executive', sub: 'CEO, President, VP', bg: 'bg-indigo-600' },
  { level: '9-8', title: 'Senior Management', sub: 'Director, Head', bg: 'bg-blue-500' },
  { level: '7-6', title: 'Supervisory', sub: 'Sr. Manager, Manager', bg: 'bg-teal-500' },
  { level: '5-4', title: 'Staff', sub: 'Asst. Manager, Executive', bg: 'bg-emerald-500' },
  { level: '3-1', title: 'Support Staff', sub: 'Assistant, Trainee', bg: 'bg-amber-500' },
];

const WHY_ADD = [
  'Defines role hierarchy in the organization.',
  'Helps in salary structure and pay planning.',
  'Supports performance management.',
  'Improves reporting and analytics.',
];

const NOTES = [
  'Fields marked with * are mandatory.',
  'You can edit or archive the grade anytime.',
  'Ensure grade level mapping is consistent.',
];

// ─── Shared field styles ─────────────────────────────────────────────────────
function inputCls(error?: string) {
  return `w-full rounded-lg border ${error ? 'border-rose-400 focus:ring-rose-200' : 'border-zinc-200 focus:ring-indigo-100'} bg-white px-3 py-2 text-[12.5px] text-zinc-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 transition-colors placeholder:text-zinc-400`;
}

// ─── Field wrapper with error support ───────────────────────────────────────
function Field({
  label, hint, required, error, children,
}: {
  label: string; hint?: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[12px] font-semibold text-zinc-700 mb-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-[10.5px] text-rose-500 mt-1">{error}</p>
      ) : hint ? (
        <p className="text-[10.5px] text-zinc-400 mt-1">{hint}</p>
      ) : null}
    </div>
  );
}

// Note: PageHeading and JobGradeDetailsCard are integrated below into the main component.

          {/* Examples */}
          <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
            <h3 className="text-[14px] font-bold text-zinc-900 mb-3">Examples of Job Grades in Your Organization</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {EXAMPLE_GRADES.map((g) => (
                <div key={g.code} className={`rounded-lg border ${g.border} bg-white p-1.5`}>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-bold text-zinc-500">{g.code}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${g.levelColor}`}>{g.level}</span>
                  </div>
                  <p className="text-[12px] font-bold text-zinc-900 mt-1">{g.title}</p>
                  <p className="text-[10px] text-zinc-500 mt-1">{g.pay}</p>
                  <div className="mt-2 pt-2 border-t border-zinc-100 space-y-0.5">
                    <p className="text-[10px] text-zinc-400">Family: <span className="text-zinc-600">{g.family}</span></p>
                    <p className="text-[10px] text-zinc-400">Reports To: <span className="text-zinc-600">{g.reports}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>

// ─── Additional Information card ────────────────────────────────────────────
function AdditionalInfoCard({
  formData, setFormData
}: any) {
  const [remarksLen, setRemarksLen] = useState((formData.description || '').length);
  return (
    <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
      <div className="flex items-center gap-2 mb-2">
        <Info size={15} className="text-zinc-400" />
        <h3 className="text-[14px] font-bold text-zinc-900">Additional Information (Optional)</h3>
      </div>
      <div className="grid gap-2.5" style={{ gridTemplateColumns: '1fr 170px 1.6fr' }}>
        <Field label="CTC Range (Annual)" hint="Enter annual CTC range">
          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-zinc-400">₹</span>
              <input type="text" placeholder="6,00,000" className={`${inputClass} pl-6`} />
            </div>
            <span className="text-[11px] text-zinc-400">-</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-zinc-400">₹</span>
              <input type="text" placeholder="9,00,000" className={`${inputClass} pl-6`} />
            </div>
          </div>
        </Field>
        <Field label="Probation Period (Months)" hint="e.g., 3, 6">
          <input type="text" placeholder="6" className={inputClass} />
        </Field>
        <Field label="Remarks">
          <div className="relative">
            <textarea
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                setRemarksLen(e.target.value.length);
              }}
              rows={2}
              className={`${inputClass} resize-none pr-12`}
            />
            <span className="pointer-events-none absolute bottom-1.5 right-2.5 text-[9px] text-zinc-400">{remarksLen}/160</span>
          </div>
        </Field>
      </div>
    </div>
  );
}

        {/* Right rail */}
        <div className="space-y-2 min-w-0 xl:sticky xl:top-[20px]">
          <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
            <h3 className="text-[14px] font-bold text-zinc-900 mb-3">Grade Level Guide</h3>
            <div className="space-y-1.5">
              {GRADE_LEVEL_GUIDE.map((g) => (
                <div key={g.level} className="flex items-center gap-2.5">
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg ${g.bg} text-[11px] font-bold text-white`}>{g.level}</span>
                  <div>
                    <p className="text-[12px] font-semibold text-zinc-900">{g.title}</p>
                    <p className="text-[10.5px] text-zinc-400">{g.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
            <h3 className="text-[14px] font-bold text-zinc-900 mb-3">Why Add Job Grade?</h3>
            <div className="space-y-1.5">
              {WHY_ADD.map((w) => (
                <div key={w} className="flex items-start gap-2">
                  <Check size={14} className="mt-0.5 shrink-0 rounded-full bg-emerald-100 text-emerald-600 p-0.5" />
                  <p className="text-[12px] text-zinc-600 leading-snug">{w}</p>
                </div>
              ))}
            </div>
          </div>

// ─── Right rail: Note ────────────────────────────────────────────────────────
function NoteCard() {
  return (
    <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
      <div className="flex items-center gap-2 mb-2">
        <Info size={14} className="text-indigo-500" />
        <h3 className="text-[13.5px] font-bold text-zinc-900">Note</h3>
      </div>
      <ul className="space-y-1.5">
        {NOTES.map((n) => (
          <li key={n} className="flex items-start gap-1.5 text-[11.5px] text-zinc-500 leading-snug">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-400" />
            {n}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
// ─── Page ───────────────────────────────────────────────────────────────────
function AddJobGradeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get('editId');

  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    level: '5-4',
    payRange: '',
    jobFamily: '',
    parentGrade: '',
    ctcRangeMin: '',
    ctcRangeMax: '',
    probationPeriod: '',
    isActive: true,
    description: ''
  });

  const { data: allJobGrades = [] } = useQuery({
    queryKey: ['jobGrades'],
    queryFn: async () => {
      const res = await api.get('/job-grades');
      return res.data;
    }
  });

  const { data: jobFamilies = [] } = useQuery({
    queryKey: ['jobFamilies'],
    queryFn: async () => {
      const res = await api.get('/job-families');
      return res.data;
    }
  });

  const { data: jobGrade, isLoading: isFetching } = useQuery({
    queryKey: ['jobGrade', editId],
    queryFn: async () => {
      const res = await api.get(`/job-grades/${editId}`);
      return res.data;
    },
    enabled: !!editId
  });

  useEffect(() => {
    if (jobGrade) {
      setFormData({
        name: jobGrade.name || '',
        code: jobGrade.code || '',
        level: jobGrade.level || '5-4',
        payRange: jobGrade.payRange || '',
        jobFamily: jobGrade.jobFamily ? jobGrade.jobFamily._id : '',
        parentGrade: jobGrade.parentGrade ? jobGrade.parentGrade._id : '',
        ctcRangeMin: jobGrade.ctcRangeMin || '',
        ctcRangeMax: jobGrade.ctcRangeMax || '',
        probationPeriod: jobGrade.probationPeriod || '',
        isActive: jobGrade.isActive !== undefined ? jobGrade.isActive : true,
        description: jobGrade.description || ''
      });
    }
  }, [jobGrade]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editId) {
        const res = await api.put(`/job-grades/${editId}`, data);
        return res.data;
      } else {
        const res = await api.post('/job-grades', data);
        return res.data;
      }
    },
    onSuccess: () => {
      toast.success(editId ? 'Job Grade updated successfully!' : 'Job Grade created successfully!');
      queryClient.invalidateQueries({ queryKey: ['jobGrades'] });
      router.push('/dashboard/job-grades');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || `Failed to ${editId ? 'update' : 'create'} Job Grade`);
    }
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.code || !formData.level) {
      toast.error('Name, Code and Level are required');
      return;
    }
    const payload = { ...formData };
    if (!payload.jobFamily) delete (payload as any).jobFamily;
    if (!payload.parentGrade) delete (payload as any).parentGrade;
    saveMutation.mutate(payload);
  };

  return (
    <div className="space-y-2 font-sans text-zinc-900 p-2">
      <section className="flex items-start justify-between gap-3 flex-wrap">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[12px] text-zinc-500 flex-wrap">
            <Breadcrumb
              items={[
                { label: "Organization Setup", href: "/dashboard" },
                { label: "Job Grades", href: "/dashboard/job-grades" },
                { label: editId ? "Edit Job Grade" : "Add New Job Grade" },
              ]}
            />
          </div>
          <h1 className="text-1xl font-bold text-zinc-900 leading-tight">{editId ? 'Edit Job Grade' : 'Add New Job Grade'}</h1>
          <p className="text-[13px] text-zinc-500">{editId ? 'Update job grade details.' : 'Create a new job grade and define its basic details.'}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/dashboard/job-grades" className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-[12.5px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors">
            <ArrowLeft size={14} /> Back to Job Grades
          </Link>
          <button
            onClick={handleSubmit}
            disabled={saveMutation.isPending}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2.5 text-[12.5px] font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <Save size={14} /> {saveMutation.isPending ? 'Saving...' : 'Save Job Grade'}
          </button>
        </div>
      </section>

      {isFetching ? (
        <div className="p-8 text-center text-zinc-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[2.6fr_1fr] gap-2.5 items-start">
          <div className="min-w-0 space-y-2">
            <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
              <div className="flex items-center gap-2 mb-3">
                <span className="grid h-6 w-6 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
                  <IdCard size={15} />
                </span>
                <h3 className="text-[14px] font-bold text-zinc-900">Job Grade Details</h3>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Field label="Grade Name" required hint="e.g., Junior Manager">
                    <input type="text" placeholder="Junior Manager" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} />
                  </Field>
                  <Field label="Grade Code" required hint="e.g., JG-05">
                    <input type="text" placeholder="JG-05" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className={inputClass} />
                  </Field>
                  <Field label="Grade Level" required hint="Select grade level">
                    <select className={inputClass} value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })}>
                      <option value="10">10</option>
                      <option value="9-8">9 - 8</option>
                      <option value="7-6">7 - 6</option>
                      <option value="5-4">5 - 4</option>
                      <option value="3-1">3 - 1</option>
                    </select>
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Field label="Pay Range (Monthly)" required hint="Enter minimum and maximum monthly pay range">
                    <input type="text" placeholder="e.g., ₹45,000 - ₹70,000" value={formData.payRange} onChange={(e) => setFormData({ ...formData, payRange: e.target.value })} className={inputClass} />
                  </Field>
                  <Field label="Job Family" required hint="Choose job family">
                    <select className={inputClass} value={formData.jobFamily} onChange={(e) => setFormData({ ...formData, jobFamily: e.target.value })}>
                      <option value="">Select a family...</option>
                      {jobFamilies.map((jf: any) => (
                        <option key={jf._id} value={jf._id}>{jf.name}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Parent Grade (Optional)" hint="Select if this grade has a parent">
                    <select className={inputClass} value={formData.parentGrade} onChange={(e) => setFormData({ ...formData, parentGrade: e.target.value })}>
                      <option value="">None</option>
                      {allJobGrades.filter((jg: any) => jg.isActive && jg._id !== editId).map((jg: any) => (
                        <option key={jg._id} value={jg._id}>{jg.name}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Status" required hint="Choose status">
                    <select className={inputClass} value={formData.isActive ? 'Active' : 'Inactive'} onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'Active' })}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </Field>
                  <Field label="Short Description" hint="e.g., Mid-level management roles">
                    <input type="text" placeholder="Mid-level management roles with functional ownership." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={inputClass} />
                  </Field>
                </div>
              </div>
            </div>

            <ExampleGradesCard />
            <AdditionalInfoCard formData={formData} setFormData={setFormData} />
          </div>

          <div className="space-y-2 min-w-0 xl:sticky xl:top-[20px]">
            <GradeLevelGuideCard />
            <WhyAddCard />
            <NoteCard />
          </div>
        </div>
      )}

      <footer className="text-center text-[11px] text-zinc-400 py-3 flex items-center justify-center gap-2.5 flex-wrap">
        <span>© 2025 Crewcam HRMS. All Rights Reserved.</span>
      </footer>
    </form>
  );
}

export default function AddNewJobGradePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-500">Loading...</div>}>
      <AddJobGradeContent />
    </Suspense>
  );
}
