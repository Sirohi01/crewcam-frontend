'use client';
import React from 'react';
import { ChevronRight, ArrowLeft, Save, Building2, Info, FileText, ChevronDown, Calendar, X, LayoutGrid } from 'lucide-react';

const BREADCRUMB = ['Organization Setup', 'Departments', 'Sub Departments', 'Add Sub Department'];

function PageHeading() {
  return (
    <section className="space-y-2">
      <div className="flex items-center gap-1.5 text-[12px] text-zinc-500 flex-wrap">
        {BREADCRUMB.map((crumb, i) => (
          <React.Fragment key={crumb}>
            {i === BREADCRUMB.length - 1 ? (
              <span className="text-indigo-600 font-semibold">{crumb}</span>
            ) : (
              <span className="text-zinc-500 hover:underline cursor-pointer">{crumb}</span>
            )}
            {i < BREADCRUMB.length - 1 && <ChevronRight size={12} />}
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-1xl font-bold text-zinc-900 leading-tight">Add Sub Department</h1>
          <p className="text-[13px] text-zinc-500 mt-0.5">Create a new sub department under an existing department.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-[12.5px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors">
            <ArrowLeft size={14} /> Back to Sub Departments
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-indigo-600 pl-4 pr-3 py-2.5 text-[12.5px] font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
            <Save size={14} /> Save Sub Department
          </button>
        </div>
      </div>
    </section>
  );
}

function SubDepartmentForm() {
  return (
    <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
      <h3 className="text-[14px] font-semibold text-zinc-900 mb-3">Sub Department Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Department */}
        <div>
          <label className="block text-[12px] font-medium text-zinc-700 mb-1">
            Department <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <select className="w-full rounded-lg border border-zinc-200 bg-white pl-3 pr-8 py-2 text-[12px] text-zinc-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors appearance-none">
              <option>Design & Build</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Select the parent department</p>
        </div>

        {/* Sub Department Name */}
        <div>
          <label className="block text-[12px] font-medium text-zinc-700 mb-1">
            Sub Department Name <span className="text-rose-500">*</span>
          </label>
          <input type="text" defaultValue="Interior Design" className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] text-zinc-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors" />
          <p className="text-[11px] text-zinc-500 mt-1">Enter sub department name</p>
        </div>

        {/* Sub Department Code */}
        <div>
          <label className="block text-[12px] font-medium text-zinc-700 mb-1">
            Sub Department Code <span className="text-rose-500">*</span>
          </label>
          <input type="text" defaultValue="INT-DSN" className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] text-zinc-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors" />
          <p className="text-[11px] text-zinc-500 mt-1">Unique code for this sub department</p>
        </div>

        {/* Short Name */}
        <div>
          <label className="block text-[12px] font-medium text-zinc-700 mb-1">
            Short Name
          </label>
          <input type="text" defaultValue="Int. Design" className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] text-zinc-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors" />
          <p className="text-[11px] text-zinc-500 mt-1">Short name / Abbreviation (optional)</p>
        </div>
      </div>

      <div className="mt-3">
        <label className="block text-[12px] font-medium text-zinc-700 mb-1">
          Description
        </label>
        <textarea rows={3} defaultValue="Handles interior design concepts, space planning, 3D visualization and client coordination." className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] text-zinc-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors resize-none"></textarea>
        <p className="text-[11px] text-zinc-500 mt-1">Brief description about the sub department</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-zinc-100">
        {/* Department Head */}
        <div>
          <label className="block text-[12px] font-medium text-zinc-700 mb-1">
            Department Head
          </label>
          <div className="relative">
            <div className="w-full rounded-lg border border-zinc-200 bg-white pl-3 pr-2 py-1.5 text-[12px] text-zinc-800 shadow-sm flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Avatar" className="w-5 h-5 rounded-full bg-zinc-200" />
                <span className="font-medium text-zinc-900">Rahul Nair</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400">
                <X size={13} className="hover:text-zinc-600 transition-colors cursor-pointer" />
                <ChevronDown size={14} className="pointer-events-none" />
              </div>
            </div>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Select sub department head</p>
        </div>

        {/* Reporting To */}
        <div>
          <label className="block text-[12px] font-medium text-zinc-700 mb-1">
            Reporting To <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <select className="w-full rounded-lg border border-zinc-200 bg-white pl-3 pr-8 py-2 text-[12px] text-zinc-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors appearance-none">
              <option>Design & Build Head Office</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Select parent / reporting department</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
        <div>
          <label className="block text-[12px] font-medium text-zinc-700 mb-1">Business Unit</label>
          <div className="relative">
            <select className="w-full rounded-lg border border-zinc-200 bg-white pl-3 pr-8 py-2 text-[12px] text-zinc-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors appearance-none">
              <option>Design House - Projects</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-[12px] font-medium text-zinc-700 mb-1">Cost Center</label>
          <div className="relative">
            <select className="w-full rounded-lg border border-zinc-200 bg-white pl-3 pr-8 py-2 text-[12px] text-zinc-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors appearance-none">
              <option>CC-DB-001</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-[12px] font-medium text-zinc-700 mb-1">Location</label>
          <div className="relative">
            <select className="w-full rounded-lg border border-zinc-200 bg-white pl-3 pr-8 py-2 text-[12px] text-zinc-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors appearance-none">
              <option>Noida Head Office</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-zinc-100">
        <div>
          <label className="block text-[12px] font-medium text-zinc-700 mb-1">Status <span className="text-rose-500">*</span></label>
          <div className="flex items-center gap-4 mt-2">
            <label className="flex items-center gap-2 text-[12px] text-zinc-800 cursor-pointer">
              <input type="radio" name="status" defaultChecked className="w-3.5 h-3.5 accent-indigo-600" />
              Active
            </label>
            <label className="flex items-center gap-2 text-[12px] text-zinc-800 cursor-pointer">
              <input type="radio" name="status" className="w-3.5 h-3.5 accent-indigo-600" />
              Inactive
            </label>
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-medium text-zinc-700 mb-1">Effective Date <span className="text-rose-500">*</span></label>
          <div className="relative">
            <input type="text" defaultValue="01/06/2025" className="w-full rounded-lg border border-zinc-200 bg-white pl-3 pr-8 py-2 text-[12px] text-zinc-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors" />
            <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

function HierarchyPreviewCard() {
  return (
    <div className="rounded-xl border border-slate-100 bg-white shadow-sm p-5">
      <h3 className="text-[13.5px] font-bold text-slate-900 mb-6">Hierarchy Preview</h3>
      
      <div className="flex flex-col">
        
        {/* Node 1 */}
        <div className="flex items-center gap-3.5">
          <div className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-[#1d4ed8] text-white shadow-sm">
            <Building2 size={16} />
          </div>
          <div>
            <p className="text-[12.5px] font-bold text-slate-900 leading-tight">Design House India Pvt. Ltd.</p>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">Organization</p>
          </div>
        </div>

        {/* Arrow 1 */}
        <div className="ml-[16px] py-1">
          <div className="w-[1.5px] h-[18px] bg-slate-200 relative">
            <div className="absolute -bottom-1 -left-[2px] w-[5.5px] h-[5.5px] bg-slate-200 rotate-45 rounded-sm"></div>
          </div>
        </div>

        {/* Node 2 */}
        <div className="flex items-center gap-3.5 ml-6">
          <div className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-[#1d4ed8] text-white shadow-sm ring-4 ring-blue-50/50">
            <Building2 size={16} />
          </div>
          <div>
            <p className="text-[12.5px] font-bold text-slate-900 leading-tight">Design & Build</p>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">Department</p>
          </div>
        </div>

        {/* Arrow 2 */}
        <div className="ml-[40px] py-1">
          <div className="w-[1.5px] h-[18px] bg-slate-200 relative">
            <div className="absolute -bottom-1 -left-[2px] w-[5.5px] h-[5.5px] bg-slate-200 rotate-45 rounded-sm"></div>
          </div>
        </div>

        {/* Node 3 */}
        <div className="flex items-center gap-3.5 ml-12 bg-[#f8faff] rounded-xl p-2.5 pr-8 border border-blue-50/50 w-max">
          <div className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-[#1d4ed8] text-white shadow-sm ring-4 ring-blue-100">
            <Building2 size={16} />
          </div>
          <div>
            <p className="text-[12.5px] font-bold text-slate-900 leading-tight">Interior Design</p>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">Sub Department (New)</p>
          </div>
        </div>
        
      </div>
    </div>
  );
}

function InformationCard() {
  return (
    <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
      <div className="flex items-center gap-2 mb-2">
        <Info size={14} className="text-indigo-600" />
        <h3 className="text-[13px] font-semibold text-zinc-900">Information</h3>
      </div>
      <p className="text-[11.5px] text-zinc-600 leading-relaxed">
        Sub departments help you organize teams within a department for better structure and reporting. You can manage roles, employees and workflows separately for each sub department.
      </p>
    </div>
  );
}

function ExampleCard() {
  return (
    <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-3">
      <div className="flex items-center gap-2 mb-3">
        <div className="grid h-6 w-6 place-items-center rounded-md bg-fuchsia-50 text-fuchsia-600">
          <FileText size={13} />
        </div>
        <h3 className="text-[13px] font-semibold text-zinc-900">Example</h3>
      </div>
      <p className="text-[11.5px] text-zinc-800 font-medium mb-2">Department: Design & Build</p>
      <ul className="list-disc pl-4 text-[11.5px] text-zinc-600 space-y-1.5 marker:text-zinc-400">
        <li>Interior Design</li>
        <li>Architecture</li>
        <li>Project Execution</li>
        <li>Site Management</li>
      </ul>
    </div>
  );
}

export default function AddSubDepartmentPage() {
  return (
    <div className="space-y-2 font-sans text-zinc-900 p-2">
      <PageHeading />

      <div className="grid grid-cols-1 xl:grid-cols-[2.6fr_1fr] gap-2 items-start">
        <SubDepartmentForm />

        <div className="space-y-2 min-w-0 xl:sticky xl:top-[20px]">
          <HierarchyPreviewCard />
          <InformationCard />
          <ExampleCard />
        </div>
      </div>
    </div>
  );
}
