'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronRight, ArrowLeft, Save, Building2, Info, FileText,
  ChevronDown, Calendar, Loader2
} from 'lucide-react';
import { getDepartments, Department } from '@/services/departmentService';
import { createSubDepartment, getSubDepartmentById, updateSubDepartment } from '@/services/subDepartmentService';

const BREADCRUMB = ['Organization Setup', 'Departments', 'Sub Departments', 'Add Sub Department'];

interface FormData {
  parentDepartmentId: string;
  name: string;
  code: string;
  shortName: string;
  description: string;
  reportingToId: string;
  businessUnit: string;
  costCenter: string;
  location: string;
  isActive: boolean;
  effectiveDate: string;
}

function AddSubDepartmentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');

  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [loadingData, setLoadingData] = useState(!!editId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<FormData>({
    parentDepartmentId: '',
    name: '',
    code: '',
    shortName: '',
    description: '',
    reportingToId: '',
    businessUnit: '',
    costCenter: '',
    location: '',
    isActive: true,
    effectiveDate: '',
  });

  const selectedParent = departments.find(d => d._id === form.parentDepartmentId);

  useEffect(() => {
    // Load departments for the dropdowns
    getDepartments({ limit: 1000 })
      .then(data => setDepartments(data))
      .catch(() => setError('Failed to load departments.'))
      .finally(() => setLoadingDepts(false));
  }, []);

  useEffect(() => {
    // Load edit data if ID is present
    if (editId) {
      setLoadingData(true);
      getSubDepartmentById(editId)
        .then(data => {
          setForm({
            parentDepartmentId: data.parentDepartmentId?._id || data.parentDepartmentId || '',
            name: data.name || '',
            code: data.code || '',
            shortName: data.shortName || '',
            description: data.description || '',
            reportingToId: data.reportingToId?._id || data.reportingToId || '',
            businessUnit: data.businessUnit || '',
            costCenter: data.costCenter || '',
            location: data.location || '',
            isActive: data.isActive !== false,
            effectiveDate: data.effectiveDate ? new Date(data.effectiveDate).toISOString().split('T')[0] : '',
          });
        })
        .catch(() => setError('Failed to load sub-department details for editing.'))
        .finally(() => setLoadingData(false));
    }
  }, [editId]);

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.parentDepartmentId) { setError('Please select a parent department.'); return; }
    if (!form.name.trim()) { setError('Sub department name is required.'); return; }
    if (!form.code.trim()) { setError('Sub department code is required.'); return; }
    setError('');
    try {
      setSaving(true);
      const payload = {
        name: form.name,
        code: form.code,
        shortName: form.shortName,
        description: form.description,
        parentDepartmentId: form.parentDepartmentId,
        reportingToId: form.reportingToId || undefined,
        businessUnit: form.businessUnit,
        costCenter: form.costCenter,
        location: form.location,
        isActive: form.isActive,
        effectiveDate: form.effectiveDate || undefined,
      };

      if (editId) {
        await updateSubDepartment(editId, payload);
      } else {
        await createSubDepartment(payload);
      }
      
      router.push('/dashboard/departments/sub-department-management');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save sub department.');
    } finally {
      setSaving(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-indigo-600 w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="space-y-2 font-sans text-zinc-900 p-2">
      <section className="space-y-2">
        <div className="flex items-center gap-1.5 text-[12px] text-zinc-500 flex-wrap">
          {BREADCRUMB.map((crumb, i) => (
            <React.Fragment key={crumb}>
              {i === BREADCRUMB.length - 1
                ? <span className="text-indigo-600 font-semibold">{editId ? 'Edit Sub Department' : crumb}</span>
                : <span className="text-zinc-500">{crumb}</span>}
              {i < BREADCRUMB.length - 1 && <ChevronRight size={12} />}
            </React.Fragment>
          ))}
        </div>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 leading-tight">{editId ? 'Edit Sub Department' : 'Add Sub Department'}</h1>
            <p className="text-[13px] text-zinc-500 mt-0.5">
              {editId ? 'Update details for this sub department.' : 'Create a new sub department under an existing department.'}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => router.back()} className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-[12.5px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors">
              <ArrowLeft size={14} /> Back to Sub Departments
            </button>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 rounded-lg bg-indigo-600 pl-4 pr-3 py-2.5 text-[12.5px] font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-60">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {saving ? 'Saving...' : (editId ? 'Update Sub Department' : 'Save Sub Department')}
            </button>
          </div>
        </div>
        {error && <div className="rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[12px] font-medium px-3 py-2">{error}</div>}
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[2.6fr_1fr] gap-2 items-start">
        <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3 space-y-3">
          <h3 className="text-[14px] font-semibold text-zinc-900">Sub Department Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

            <div>
              <label className="block text-[12px] font-medium text-zinc-700 mb-1">Department <span className="text-rose-500">*</span></label>
              <div className="relative">
                <select
                  value={form.parentDepartmentId}
                  onChange={e => handleChange('parentDepartmentId', e.target.value)}
                  disabled={loadingDepts}
                  className="w-full rounded-lg border border-zinc-200 bg-white pl-3 pr-8 py-2 text-[12px] text-zinc-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors appearance-none disabled:opacity-60"
                >
                  <option value="">{loadingDepts ? 'Loading...' : '-- Select Parent Department --'}</option>
                  {departments.map(dept => (
                    <option key={dept._id} value={dept._id}>{dept.name} {dept.code ? `(${dept.code})` : ''}</option>
                  ))}
                </select>
                {loadingDepts
                  ? <Loader2 size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 animate-spin pointer-events-none" />
                  : <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />}
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">{loadingDepts ? 'Loading from database...' : `${departments.length} department(s) available`}</p>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-zinc-700 mb-1">Sub Department Name <span className="text-rose-500">*</span></label>
              <input type="text" value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="e.g. Interior Design" className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] text-zinc-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors" />
              <p className="text-[11px] text-zinc-500 mt-1">Enter sub department name</p>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-zinc-700 mb-1">Sub Department Code <span className="text-rose-500">*</span></label>
              <input type="text" value={form.code} onChange={e => handleChange('code', e.target.value.toUpperCase())} placeholder="e.g. INT-DSN" className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] text-zinc-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors" />
              <p className="text-[11px] text-zinc-500 mt-1">Unique code for this sub department</p>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-zinc-700 mb-1">Short Name</label>
              <input type="text" value={form.shortName} onChange={e => handleChange('shortName', e.target.value)} placeholder="e.g. Int. Design" className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] text-zinc-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors" />
              <p className="text-[11px] text-zinc-500 mt-1">Short name / Abbreviation (optional)</p>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-zinc-700 mb-1">Description</label>
            <textarea rows={3} value={form.description} onChange={e => handleChange('description', e.target.value)} placeholder="Brief description..." className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] text-zinc-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors resize-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-zinc-100">
            <div>
              <label className="block text-[12px] font-medium text-zinc-700 mb-1">Reporting To</label>
              <div className="relative">
                <select value={form.reportingToId} onChange={e => handleChange('reportingToId', e.target.value)} disabled={loadingDepts} className="w-full rounded-lg border border-zinc-200 bg-white pl-3 pr-8 py-2 text-[12px] text-zinc-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors appearance-none disabled:opacity-60">
                  <option value="">-- Select Reporting Department --</option>
                  {departments.map(dept => <option key={dept._id} value={dept._id}>{dept.name}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-zinc-700 mb-1">Business Unit</label>
              <input type="text" value={form.businessUnit} onChange={e => handleChange('businessUnit', e.target.value)} placeholder="e.g. Design House - Projects" className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] text-zinc-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-zinc-700 mb-1">Cost Center</label>
              <input type="text" value={form.costCenter} onChange={e => handleChange('costCenter', e.target.value)} placeholder="e.g. CC-DS-001" className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] text-zinc-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors" />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-zinc-700 mb-1">Location</label>
              <input type="text" value={form.location} onChange={e => handleChange('location', e.target.value)} placeholder="e.g. Noida Head Office" className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] text-zinc-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors" />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-zinc-700 mb-1">Effective Date</label>
              <div className="relative">
                <input type="date" value={form.effectiveDate} onChange={e => handleChange('effectiveDate', e.target.value)} className="w-full rounded-lg border border-zinc-200 bg-white pl-3 pr-8 py-2 text-[12px] text-zinc-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors" />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-100">
            <label className="block text-[12px] font-medium text-zinc-700 mb-2">Status <span className="text-rose-500">*</span></label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-[12px] text-zinc-800 cursor-pointer">
                <input type="radio" name="status" checked={form.isActive === true} onChange={() => handleChange('isActive', true)} className="w-3.5 h-3.5 accent-indigo-600" /> Active
              </label>
              <label className="flex items-center gap-2 text-[12px] text-zinc-800 cursor-pointer">
                <input type="radio" name="status" checked={form.isActive === false} onChange={() => handleChange('isActive', false)} className="w-3.5 h-3.5 accent-indigo-600" /> Inactive
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-2 min-w-0 xl:sticky xl:top-[20px]">
          <div className="rounded-xl border border-slate-100 bg-white shadow-sm p-5">
            <h3 className="text-[13.5px] font-bold text-slate-900 mb-6">Hierarchy Preview</h3>
            <div className="flex flex-col">
              <div className="flex items-center gap-3.5">
                <div className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-[#1d4ed8] text-white shadow-sm"><Building2 size={16} /></div>
                <div><p className="text-[12.5px] font-bold text-slate-900 leading-tight">Organization</p><p className="text-[11px] font-medium text-slate-500 mt-0.5">Top Level</p></div>
              </div>
              <div className="ml-[16px] py-1"><div className="w-[1.5px] h-[18px] bg-slate-200 relative"><div className="absolute -bottom-1 -left-[2px] w-[5.5px] h-[5.5px] bg-slate-200 rotate-45 rounded-sm" /></div></div>
              <div className="flex items-center gap-3.5 ml-6">
                <div className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-[#1d4ed8] text-white shadow-sm ring-4 ring-blue-50/50"><Building2 size={16} /></div>
                <div>
                  <p className="text-[12.5px] font-bold text-slate-900 leading-tight">{selectedParent ? selectedParent.name : <span className="text-zinc-400 italic font-normal">Select a department</span>}</p>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">Department</p>
                </div>
              </div>
              <div className="ml-[40px] py-1"><div className="w-[1.5px] h-[18px] bg-slate-200 relative"><div className="absolute -bottom-1 -left-[2px] w-[5.5px] h-[5.5px] bg-slate-200 rotate-45 rounded-sm" /></div></div>
              <div className="flex items-center gap-3.5 ml-12 bg-[#f8faff] rounded-xl p-2.5 pr-8 border border-blue-50/50 w-max">
                <div className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-[#1d4ed8] text-white shadow-sm ring-4 ring-blue-100"><Building2 size={16} /></div>
                <div>
                  <p className="text-[12.5px] font-bold text-slate-900 leading-tight">{form.name || <span className="text-zinc-400 italic font-normal">{editId ? 'Edit Sub Department' : 'New Sub Department'}</span>}</p>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">Sub Department ({editId ? 'Editing' : 'New'})</p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
            <div className="flex items-center gap-2 mb-2"><Info size={14} className="text-indigo-600" /><h3 className="text-[13px] font-semibold text-zinc-900">Information</h3></div>
            <p className="text-[11.5px] text-zinc-600 leading-relaxed">Sub departments help you organize teams within a department for better structure and reporting.</p>
          </div>
          <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
            <div className="flex items-center gap-2 mb-3"><div className="grid h-6 w-6 place-items-center rounded-md bg-fuchsia-50 text-fuchsia-600"><FileText size={13} /></div><h3 className="text-[13px] font-semibold text-zinc-900">Example</h3></div>
            <p className="text-[11.5px] text-zinc-800 font-medium mb-2">Department: Design &amp; Build</p>
            <ul className="list-disc pl-4 text-[11.5px] text-zinc-600 space-y-1.5 marker:text-zinc-400"><li>Interior Design</li><li>Architecture</li><li>Project Execution</li><li>Site Management</li></ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AddSubDepartmentPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="animate-spin text-indigo-600 w-8 h-8" /></div>}>
      <AddSubDepartmentForm />
    </Suspense>
  );
}
