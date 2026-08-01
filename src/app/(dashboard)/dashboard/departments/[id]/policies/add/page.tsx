'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMasterDataStore } from '@/store/masterDataStore';
import { createCompanyPolicy } from '@/services/companyPolicyService';
import { Breadcrumb } from '@/components/ui/breadCrumb';
import {
  FileText, ArrowLeft, Save, Info, UploadCloud, File, Bold, Italic, Underline, AlignLeft, List, Link as LinkIcon,
  CheckCircle2, Circle, ChevronDown, Calendar, RotateCcw
} from 'lucide-react';

export default function AddNewPolicyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const [policyType, setPolicyType] = useState('Mandatory');
  const [requireAck, setRequireAck] = useState(true);
  const [showInPortal, setShowInPortal] = useState(true);
  const [includeInTraining, setIncludeInTraining] = useState(false);

  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [status, setStatus] = useState('Published');
  const [effectiveFrom, setEffectiveFrom] = useState('');
  const [version, setVersion] = useState('1.0');
  const [shortDescription, setShortDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [reviewDate, setReviewDate] = useState('');

  const [allEmployees, setAllEmployees] = useState(true);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedDesignations, setSelectedDesignations] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const { departments, designations, locations, categories, subCategories, employees, fetchMasterData } = useMasterDataStore();

  useEffect(() => {
    fetchMasterData();
  }, [fetchMasterData]);

  const handleSave = async () => {
    if (!title || !code || !categoryId || !effectiveFrom || !version || !shortDescription) {
      alert('Please fill out all required fields.');
      return;
    }
    try {
      const payload = {
        title, code, category: categoryId, subCategory: subCategoryId || undefined,
        type: policyType, status, effectiveFrom, version, shortDescription, detailedDescription,
        applicability: {
          allEmployees,
          departments: selectedDepartments,
          designations: selectedDesignations,
          locations: selectedLocations
        },
        settings: { requireAck, showInPortal, includeInTraining, reviewDate: reviewDate || undefined }
      };
      await createCompanyPolicy(payload);
      router.push(`/dashboard/departments/${id}/policies`);
    } catch (error: any) {
      console.error('Error saving policy', error);
      alert(error?.response?.data?.message || 'Error saving policy');
    }
  };

  return (
    <div className="flex flex-col gap-1 p-2 w-full font-sans text-slate-800 animate-in fade-in duration-300">
      
      {/* BREADCRUMB */}
      <Breadcrumb items={[
        { label: 'Home', href: '/dashboard' },
        { label: 'Organization Setup' },
        { label: 'Policies & Documents', href: `/dashboard/departments/${id}/policies` },
        { label: 'Add Policies' },
        { label: 'Add New Policy' }
      ]} />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-1">
        <div className="flex items-start gap-2">
          <div className="mt-1 w-8 h-8 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
            <FileText size={18} className="text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add New Policy</h1>
            <p className="text-[12px] text-slate-500 font-medium mt-0.5">Create a new company policy and define its applicability and rules.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/departments/${id}/policies`} className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 bg-white rounded-md text-[11px] font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Policies
          </Link>
          <button onClick={handleSave} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 border border-indigo-600 text-white rounded-md text-[11px] font-semibold hover:bg-indigo-700 shadow-sm transition-colors">
            <Save className="w-3.5 h-3.5" /> Save Policy
          </button>
        </div>
      </div>

      {/* MAIN THREE-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-[2fr_1fr_1fr] gap-3 items-start mt-1">
        
        {/* LEFT SECTION (~72%) */}
        <div className="flex flex-col gap-2">
          
          {/* Card 1: Policy Information */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
            <h3 className="text-[12px] font-bold text-slate-900 mb-4">Policy Information</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-700">Policy Title <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter policy title" className="w-full px-3 py-2 border border-slate-200 rounded-md text-[11px] focus:outline-none focus:border-indigo-400 placeholder:text-slate-400" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-slate-400">{title.length}/120</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-700">Policy Code <span className="text-red-500">*</span></label>
                <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter unique policy code" className="w-full px-3 py-2 border border-slate-200 rounded-md text-[11px] focus:outline-none focus:border-indigo-400 placeholder:text-slate-400" />
                <span className="text-[9px] text-slate-500">Example: HR-POL-001</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-700">Category <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full appearance-none px-3 py-2 border border-slate-200 rounded-md text-[11px] text-slate-700 focus:outline-none focus:border-indigo-400">
                    <option value="">Select Category</option>
                    <option value="HR Policies">HR Policies</option>
                    <option value="Attendance">Attendance</option>
                    <option value="Leave">Leave</option>
                    <option value="IT Policies">IT Policies</option>
                    <option value="Benefits">Benefits</option>
                    <option value="Others">Others</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-700">Sub Category (Optional)</label>
                <div className="relative">
                  <select value={subCategoryId} onChange={(e) => setSubCategoryId(e.target.value)} className="w-full appearance-none px-3 py-2 border border-slate-200 rounded-md text-[11px] text-slate-700 focus:outline-none focus:border-indigo-400">
                    <option value="">Select Sub Category</option>
                    <option value="General">General</option>
                    <option value="Compliance">Compliance</option>
                    <option value="Guidelines">Guidelines</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-3">
              <label className="text-[11px] font-bold text-slate-700">Policy Type <span className="text-red-500">*</span></label>
              <div className="flex items-center gap-6">
                {['Mandatory', 'Recommended', 'Informational'].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input type="radio" name="policyType" className="peer sr-only" checked={policyType === type} onChange={() => setPolicyType(type)} />
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${policyType === type ? 'border-indigo-600' : 'border-slate-300 group-hover:border-indigo-400'}`}>
                        {policyType === type && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-700 font-medium">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-700">Status <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full appearance-none px-3 py-2 border border-slate-200 rounded-md text-[11px] font-bold text-slate-800 focus:outline-none focus:border-indigo-400">
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-700">Effective From <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input type="date" value={effectiveFrom} onChange={(e) => setEffectiveFrom(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-md text-[11px] focus:outline-none focus:border-indigo-400 font-medium text-slate-800" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-700">Version <span className="text-red-500">*</span></label>
                <input type="text" value={version} onChange={(e) => setVersion(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-md text-[11px] focus:outline-none focus:border-indigo-400 font-medium" />
              </div>
            </div>
          </div>

          {/* Card 2: Policy Description */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
            <h3 className="text-[12px] font-bold text-slate-900 mb-4">Policy Description</h3>
            <div className="flex flex-col gap-1.5 mb-3">
              <label className="text-[11px] font-bold text-slate-700">Short Description <span className="text-red-500">*</span></label>
              <div className="relative">
                <input type="text" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} placeholder="Enter a short summary of the policy" className="w-full px-3 py-2 border border-slate-200 rounded-md text-[11px] focus:outline-none focus:border-indigo-400 placeholder:text-slate-400" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-slate-400">{shortDescription.length}/250</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-700">Detailed Description <span className="text-red-500">*</span></label>
              <div className="border border-slate-200 rounded-md overflow-hidden focus-within:border-indigo-400 transition-colors">
                <div className="flex items-center gap-1 border-b border-slate-200 p-1 bg-slate-50/50">
                  <div className="relative flex items-center border-r border-slate-200 pr-2 mr-1">
                    <select className="appearance-none pl-2 pr-6 py-1 bg-transparent text-[11px] font-semibold text-slate-700 focus:outline-none cursor-pointer">
                      <option>Normal</option>
                      <option>Heading 1</option>
                      <option>Heading 2</option>
                    </select>
                    <ChevronDown className="w-3 h-3 absolute right-2 text-slate-500 pointer-events-none" />
                  </div>
                  <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors focus:bg-indigo-100 focus:text-indigo-600"><Bold className="w-3.5 h-3.5" /></button>
                  <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors focus:bg-indigo-100 focus:text-indigo-600"><Italic className="w-3.5 h-3.5" /></button>
                  <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors focus:bg-indigo-100 focus:text-indigo-600"><Underline className="w-3.5 h-3.5" /></button>
                  <div className="w-px h-4 bg-slate-200 mx-1"></div>
                  <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors focus:bg-indigo-100 focus:text-indigo-600"><AlignLeft className="w-3.5 h-3.5" /></button>
                  <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors focus:bg-indigo-100 focus:text-indigo-600"><List className="w-3.5 h-3.5" /></button>
                  <div className="w-px h-4 bg-slate-200 mx-1"></div>
                  <button type="button" className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors focus:bg-indigo-100 focus:text-indigo-600"><LinkIcon className="w-3.5 h-3.5" /></button>
                </div>
                <div className="relative">
                  <textarea rows={5} value={detailedDescription} onChange={(e) => setDetailedDescription(e.target.value)} placeholder="Write detailed policy description..." className="w-full p-2.5 text-[11px] focus:outline-none placeholder:text-slate-400 resize-none"></textarea>
                  <span className="absolute bottom-2 right-3 text-[9px] text-slate-400">{detailedDescription.length}/5000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Policy Document */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
            <h3 className="text-[12px] font-bold text-slate-900 mb-3">Policy Document</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-700">Upload Policy Document <span className="text-red-500">*</span></label>
                <label className="h-28 border-2 border-dashed border-indigo-200 bg-indigo-50/50 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50 transition-colors group relative">
                  <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".pdf,.doc,.docx" />
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-[11px] font-bold text-indigo-700">Drag & drop file here <span className="text-slate-600 font-medium">or click to browse</span></span>
                  <span className="text-[9px] text-slate-500 mt-0.5">Supports PDF, DOC, DOCX (Max. 10MB)</span>
                </label>
              </div>
              <div className="flex-1 flex flex-col">
                <h4 className="text-[10px] font-bold text-slate-800 mb-1.5 mt-4">Policy Document Guidelines</h4>
                <ul className="flex flex-col gap-1.5">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span className="text-[10px] text-slate-600">Use clear and simple language</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span className="text-[10px] text-slate-600">Include purpose, scope, rules and responsibilities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span className="text-[10px] text-slate-600">Review and approve before publishing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span className="text-[10px] text-slate-600">Notify employees after publication</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* NOTE */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="text-[10px] text-slate-700"><strong className="font-bold">Note:</strong> After saving, this policy will be reviewed by the approver(s) as per the approval workflow.</span>
          </div>

        </div>

        {/* MIDDLE SECTION */}
        <div className="flex flex-col gap-2">
          
          {/* Card 1: Applicability */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
            <h3 className="text-[11px] font-bold text-slate-900 mb-4">Applicability</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-700">Applies To <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select value={allEmployees ? 'all' : 'specific'} onChange={(e) => setAllEmployees(e.target.value === 'all')} className="w-full appearance-none px-3 py-2 border border-slate-200 rounded-md text-[11px] font-medium text-slate-800 focus:outline-none focus:border-indigo-400">
                    <option value="all">All Employees</option>
                    <option value="specific">Specific Groups</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-700">Department (Optional)</label>
                <div className="relative">
                  <select disabled={allEmployees} value={selectedDepartments[0] || ''} onChange={(e) => setSelectedDepartments(e.target.value ? [e.target.value] : [])} className="w-full appearance-none px-3 py-2 border border-slate-200 rounded-md text-[11px] text-slate-500 focus:outline-none focus:border-indigo-400 disabled:opacity-50">
                    <option value="">Select Departments</option>
                    {departments.map((dept: any, idx) => (
                      <option key={dept.id || idx} value={dept.id || dept._id}>{dept.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-700">Designation (Optional)</label>
                <div className="relative">
                  <select disabled={allEmployees} value={selectedDesignations[0] || ''} onChange={(e) => setSelectedDesignations(e.target.value ? [e.target.value] : [])} className="w-full appearance-none px-3 py-2 border border-slate-200 rounded-md text-[11px] text-slate-500 focus:outline-none focus:border-indigo-400 disabled:opacity-50">
                    <option value="">Select Designations</option>
                    {designations.map((desg: any, idx) => (
                      <option key={desg.id || idx} value={desg.id || desg._id}>{desg.title || desg.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-700">Location (Optional)</label>
                <div className="relative">
                  <select disabled={allEmployees} value={selectedLocations[0] || ''} onChange={(e) => setSelectedLocations(e.target.value ? [e.target.value] : [])} className="w-full appearance-none px-3 py-2 border border-slate-200 rounded-md text-[11px] text-slate-500 focus:outline-none focus:border-indigo-400 disabled:opacity-50">
                    <option value="">Select Locations</option>
                    {locations.map((loc: any, idx) => (
                      <option key={loc.id || idx} value={loc.id || loc._id}>{loc.city || loc.name || loc.locality}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Policy Settings */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
            <h3 className="text-[11px] font-bold text-slate-900 mb-4">Policy Settings</h3>
            <div className="flex flex-col gap-3.5 mb-4">
              <label className="flex items-start gap-2.5 cursor-pointer group" onClick={() => setRequireAck(!requireAck)}>
                <input type="checkbox" className="sr-only" checked={requireAck} onChange={() => {}} />
                <div className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 mt-0.5 ${requireAck ? 'bg-indigo-600' : 'border border-slate-300 group-hover:border-indigo-400'}`}>
                  {requireAck && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-800">Require Acknowledgement</span>
                  <span className="text-[9px] text-slate-500">Collect acknowledgement from employees</span>
                </div>
              </label>
              <label className="flex items-start gap-2.5 cursor-pointer group" onClick={() => setShowInPortal(!showInPortal)}>
                <input type="checkbox" className="sr-only" checked={showInPortal} onChange={() => {}} />
                <div className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 mt-0.5 ${showInPortal ? 'bg-indigo-600' : 'border border-slate-300 group-hover:border-indigo-400'}`}>
                  {showInPortal && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-800">Show in Employee Portal</span>
                  <span className="text-[9px] text-slate-500">Make this policy visible to employees</span>
                </div>
              </label>
              <label className="flex items-start gap-2.5 cursor-pointer group" onClick={() => setIncludeInTraining(!includeInTraining)}>
                <input type="checkbox" className="sr-only" checked={includeInTraining} onChange={() => {}} />
                <div className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 mt-0.5 ${includeInTraining ? 'bg-indigo-600' : 'border border-slate-300 group-hover:border-indigo-400'}`}>
                  {includeInTraining && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-800">Include in Policy Training</span>
                  <span className="text-[9px] text-slate-500">Add this policy to training program</span>
                </div>
              </label>
            </div>
            
            <div className="flex flex-col gap-1.5 pt-3 border-t border-slate-100">
              <label className="text-[10px] font-bold text-slate-700">Review Date (Optional)</label>
              <div className="relative">
                <input type="date" value={reviewDate} onChange={(e) => setReviewDate(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-md text-[11px] focus:outline-none focus:border-indigo-400 text-slate-800" />
              </div>
              <span className="text-[9px] text-slate-500 mt-0.5">Set date for next review and update</span>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex flex-col gap-2">

          {/* Card 3: Policy Preview */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
            <h3 className="text-[12px] font-bold text-slate-900 mb-5">Policy Preview</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-slate-900 leading-tight">Untitled Policy</span>
                <span className="text-[11px] text-slate-500 font-medium">v1.0 &middot; Draft &middot; Mandatory</span>
              </div>
            </div>
            <div className="flex flex-col gap-3.5 text-[11px]">
              <div className="grid grid-cols-[100px_1fr] items-center">
                <span className="text-slate-500 font-medium">Category</span>
                <span className="font-semibold text-slate-900 text-right">-</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] items-center">
                <span className="text-slate-500 font-medium">Applies To</span>
                <span className="font-semibold text-slate-900 text-right">All Employees</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] items-center">
                <span className="text-slate-500 font-medium">Effective From</span>
                <span className="font-semibold text-slate-900 text-right">15 May 2025</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] items-center">
                <span className="text-slate-500 font-medium">Document</span>
                <span className="font-semibold text-slate-900 text-right">Not Uploaded</span>
              </div>
            </div>
          </div>

          {/* Card 4: Approval Workflow */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
            <h3 className="text-[11px] font-bold text-slate-900 mb-3">Approval Workflow</h3>
            <div className="mb-3">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Current Workflow</span>
              <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 border border-green-200 text-[9.5px] font-bold rounded">Default Policy Approval</span>
            </div>
            <div className="relative pl-3 mt-3">
              <div className="absolute top-2 bottom-4 left-[17px] w-px bg-slate-200"></div>
              <div className="flex flex-col gap-3.5">
                
                <div className="flex gap-2.5 relative z-10">
                  <div className="w-4 h-4 rounded-full border-2 border-indigo-600 bg-white flex items-center justify-center shrink-0">
                    <span className="text-[8px] font-bold text-indigo-600">1</span>
                  </div>
                  <div className="flex flex-col mt-0.5">
                    <span className="text-[10.5px] font-bold text-slate-900 leading-tight">HR Manager</span>
                    <span className="text-[9px] text-slate-500">First Level Approval</span>
                  </div>
                </div>

                <div className="flex gap-2.5 relative z-10">
                  <div className="w-4 h-4 rounded-full border-2 border-indigo-600 bg-white flex items-center justify-center shrink-0">
                    <span className="text-[8px] font-bold text-indigo-600">2</span>
                  </div>
                  <div className="flex flex-col mt-0.5">
                    <span className="text-[10.5px] font-bold text-slate-900 leading-tight">Department Head</span>
                    <span className="text-[9px] text-slate-500">Second Level Approval</span>
                  </div>
                </div>

                <div className="flex gap-2.5 relative z-10">
                  <div className="w-4 h-4 rounded-full border-2 border-indigo-600 bg-white flex items-center justify-center shrink-0">
                    <span className="text-[8px] font-bold text-indigo-600">3</span>
                  </div>
                  <div className="flex flex-col mt-0.5">
                    <span className="text-[10.5px] font-bold text-slate-900 leading-tight">Finance Manager</span>
                    <span className="text-[9px] text-slate-500">Budget & Compliance Check</span>
                  </div>
                </div>

                <div className="flex gap-2.5 relative z-10">
                  <div className="w-4 h-4 rounded-full border-2 border-indigo-600 bg-white flex items-center justify-center shrink-0">
                    <span className="text-[8px] font-bold text-indigo-600">4</span>
                  </div>
                  <div className="flex flex-col mt-0.5">
                    <span className="text-[10.5px] font-bold text-slate-900 leading-tight">General Manager</span>
                    <span className="text-[9px] text-slate-500">Final Approval</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Card 5: Quick Actions */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
            <h3 className="text-[11px] font-bold text-slate-900 mb-2">Quick Actions</h3>
            <div className="flex flex-col gap-0.5">
              <button className="flex items-center gap-2.5 py-1.5 group text-left w-full">
                <Save className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-[11px] font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">Save as Draft</span>
              </button>
              <button className="flex items-center gap-2.5 py-1.5 group text-left w-full">
                <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-[11px] font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">Clear Form</span>
              </button>
            </div>
          </div>
          
        </div>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-slate-200">
        <button className="px-4 py-1.5 border border-slate-300 rounded-md text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors">
          Cancel
        </button>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 border border-indigo-600 text-white rounded-md text-[11px] font-bold hover:bg-indigo-700 shadow-sm transition-colors">
          <Save className="w-3.5 h-3.5" /> Save Policy
        </button>
      </div>

    </div>
  );
}
