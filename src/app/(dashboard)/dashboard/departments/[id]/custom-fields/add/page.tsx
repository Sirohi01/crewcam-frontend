'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createCustomField, getCustomFieldById, updateCustomField } from '@/services/customFieldService';
import { Breadcrumb } from '@/components/ui/breadCrumb';
import {
  ArrowLeft, Save, Info, Check, X, HelpCircle, ExternalLink,
  Type, Hash, Calendar, List, AlignLeft, LayoutList, DollarSign, ChevronDown, CheckCircle2
} from 'lucide-react';

export default function AddCustomFieldPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddCustomFieldContent params={params} />
    </Suspense>
  );
}

function AddCustomFieldContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true';
  const fieldId = searchParams.get('fieldId');

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(isEdit);

  const [label, setLabel] = useState('Project Specialization');
  const [apiKey, setApiKey] = useState('project_specialization');
  const [group, setGroup] = useState('Department Info');
  const [dataType, setDataType] = useState('Dropdown');
  const [options, setOptions] = useState(['Interior Design', 'Turnkey Projects', 'Consultancy', 'Design & Build', 'Others']);
  const [optionInput, setOptionInput] = useState('');
  const [defaultValue, setDefaultValue] = useState('');
  const [description, setDescription] = useState('Select the primary area of specialization for projects handled by this department.');

  const [mandatory, setMandatory] = useState(true);
  const [showInReports, setShowInReports] = useState(true);
  const [showInProfile, setShowInProfile] = useState(true);
  const [showInDirectory, setShowInDirectory] = useState(false);
  const [applicableFor, setApplicableFor] = useState('Departments');
  const [fieldOrder, setFieldOrder] = useState('3');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isEdit && fieldId) {
      setIsLoading(true);
      getCustomFieldById(fieldId)
        .then((res) => {
          if (res.success && res.data) {
            const data = res.data;
            setLabel(data.label || '');
            setApiKey(data.apiKey || '');
            setGroup(data.group || '');
            setDataType(data.dataType || '');
            setOptions(data.options || []);
            setDefaultValue(data.defaultValue || '');
            setDescription(data.description || '');
            setMandatory(data.mandatory ?? true);
            setShowInReports(data.showInReports ?? true);
            setShowInProfile(data.showInProfile ?? true);
            setShowInDirectory(data.showInDirectory ?? false);
            setApplicableFor(data.applicableFor || 'Departments');
            setFieldOrder(data.fieldOrder?.toString() || '0');
          }
        })
        .catch((err) => {
          console.error("Failed to load field data", err);
          alert("Failed to load field data");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isEdit, fieldId]);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setLabel(newLabel);
    setApiKey(newLabel.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, ''));
    if (errors.label) setErrors(prev => ({ ...prev, label: '' }));
  };

  const handleAddOption = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && optionInput.trim()) {
      e.preventDefault();
      if (!options.includes(optionInput.trim())) {
        setOptions([...options, optionInput.trim()]);
      }
      setOptionInput('');
      if (errors.options) setErrors(prev => ({ ...prev, options: '' }));
    }
  };

  const removeOption = (optionToRemove: string) => {
    setOptions(options.filter(opt => opt !== optionToRemove));
  };

  const handleSave = () => {
    const newErrors: { [key: string]: string } = {};
    if (!label.trim()) newErrors.label = 'Label is required';
    if (!apiKey.trim()) newErrors.apiKey = 'API Key is required';
    if (!group) newErrors.group = 'Field Group is required';
    if (!dataType) newErrors.dataType = 'Data Type is required';
    if ((dataType === 'Dropdown' || dataType === 'Multi Select') && options.length === 0) {
      newErrors.options = 'At least one option is required for this data type';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setErrors({});
      setIsSaving(true);
      
      const payload = {
        departmentId: id,
        label,
        apiKey,
        group,
        dataType,
        options,
        defaultValue,
        description,
        mandatory,
        showInReports,
        showInProfile,
        showInDirectory,
        applicableFor,
        fieldOrder: Number(fieldOrder) || 0,
        status: 'Active'
      };

      const savePromise = isEdit && fieldId 
        ? updateCustomField(fieldId, payload)
        : createCustomField(payload);

      savePromise.then(() => {
        alert(`Custom field ${isEdit ? 'updated' : 'saved'} successfully!`);
        router.push(`/dashboard/departments/${id}/custom-fields`);
      }).catch((err: any) => {
        console.error(err);
        alert(err?.response?.data?.message || `Failed to ${isEdit ? 'update' : 'save'} custom field`);
      }).finally(() => {
        setIsSaving(false);
      });
    }
  };

  return (
    <div className="flex flex-col gap-1 p-2 w-full font-sans text-slate-800 animate-in fade-in duration-300 pb-20 relative min-h-screen">

      {/* BREADCRUMB */}
      <Breadcrumb items={[
        { label: 'Organization Setup' },
        { label: 'Departments', href: '/dashboard/departments' },
        { label: 'Department Details', href: `/dashboard/departments/${id}` },
        { label: 'Custom Fields', href: `/dashboard/departments/${id}/custom-fields` },
        { label: isEdit ? 'Edit Custom Field' : 'Add Custom Field' }
      ]} />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{isEdit ? 'Edit Custom Field' : 'Add Custom Field'}</h1>
          <p className="text-[12px] text-slate-500 font-medium mt-0.5">{isEdit ? 'Update the custom field information for this department.' : 'Create a new custom field to capture additional information for this department.'}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/departments/${id}/custom-fields`} className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 bg-white rounded-md text-[11px] font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Custom Fields
          </Link>
          <button onClick={handleSave} disabled={isSaving || isLoading} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 border border-indigo-600 text-white rounded-md text-[11px] font-semibold hover:bg-indigo-700 shadow-sm transition-colors disabled:opacity-50">
            <Save className="w-3.5 h-3.5" /> {isSaving ? (isEdit ? 'Updating...' : 'Saving...') : (isEdit ? 'Update Field' : 'Save Field')}
          </button>
        </div>
      </div>

      {/* MAIN 2-COLUMN LAYOUT */}
      <div className="flex flex-col xl:flex-row gap-2">

        {/* LEFT SECTION (75%) */}
        <div className="w-full xl:w-[75%] flex flex-col gap-2">

          {/* CARD 1: FIELD INFORMATION */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-[13px] font-bold text-slate-900">Field Information</h3>
            </div>

            <div className="p-4 flex flex-col gap-5">

              {/* Row 1 */}
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Field Label <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={label}
                    onChange={handleLabelChange}
                    className={`w-full px-3 py-2 text-[12px] border rounded-md focus:outline-none focus:border-indigo-400 font-medium bg-white text-slate-900 ${errors.label ? 'border-red-500' : 'border-slate-200'}`}
                  />
                  {errors.label ? (
                    <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.label}</p>
                  ) : (
                    <p className="text-[10px] text-slate-500 mt-1 font-medium">This label will be visible to users.</p>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Field Name (API Key) <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => { setApiKey(e.target.value); if(errors.apiKey) setErrors(prev => ({...prev, apiKey: ''})); }}
                    className={`w-full px-3 py-2 text-[12px] border rounded-md focus:outline-none focus:border-indigo-400 font-medium bg-slate-50 text-slate-700 ${errors.apiKey ? 'border-red-500' : 'border-slate-200'}`}
                  />
                  {errors.apiKey ? (
                    <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.apiKey}</p>
                  ) : (
                    <p className="text-[10px] text-slate-500 mt-1 font-medium">Unique key for system reference. Use lowercase and underscores only.</p>
                  )}
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Field Group <span className="text-red-500">*</span></label>
                  <select 
                    value={group} 
                    onChange={(e) => { setGroup(e.target.value); if(errors.group) setErrors(prev => ({...prev, group: ''})); }}
                    className={`w-full appearance-none pl-3 pr-8 py-2 text-[12px] border rounded-md focus:outline-none focus:border-indigo-400 font-medium bg-white text-slate-900 ${errors.group ? 'border-red-500' : 'border-slate-200'}`}
                  >
                    <option value="">Select Field Group</option>
                    <option value="Department Info">Department Info</option>
                    <option value="Business Info">Business Info</option>
                    <option value="Finance Info">Finance Info</option>
                    <option value="Compliance">Compliance</option>
                    <option value="Review Info">Review Info</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2.5 top-[26px] text-slate-400 pointer-events-none" />
                  {errors.group ? (
                    <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.group}</p>
                  ) : (
                    <p className="text-[10px] text-slate-500 mt-1 font-medium">Group under which this field will be categorized.</p>
                  )}
                </div>
                <div className="flex-1 relative">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Data Type <span className="text-red-500">*</span></label>
                  <select 
                    value={dataType} 
                    onChange={(e) => { setDataType(e.target.value); if(errors.dataType) setErrors(prev => ({...prev, dataType: ''})); }}
                    className={`w-full appearance-none pl-3 pr-8 py-2 text-[12px] border rounded-md focus:outline-none focus:border-indigo-400 font-medium bg-white text-slate-900 ${errors.dataType ? 'border-red-500' : 'border-slate-200'}`}
                  >
                    <option value="Dropdown">Dropdown</option>
                    <option value="Number">Number</option>
                    <option value="Text">Text</option>
                    <option value="Currency">Currency</option>
                    <option value="Multi Select">Multi Select</option>
                    <option value="Date">Date</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2.5 top-[26px] text-slate-400 pointer-events-none" />
                  <p className="text-[10px] text-slate-500 mt-1 font-medium">Select the type of data this field will store.</p>
                </div>
              </div>

              {/* Row 3 */}
              {(dataType === 'Dropdown' || dataType === 'Multi Select') && (
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex-1">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Field Options <span className="text-red-500">*</span></label>
                    <div className={`w-full min-h-[40px] px-2 py-1.5 border rounded-md bg-white flex flex-wrap gap-1.5 ${errors.options ? 'border-red-500' : 'border-slate-200'}`}>
                      {options.map((opt) => (
                        <div key={opt} className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-md px-2 py-1">
                          <span className="text-[11px] font-medium text-slate-700">{opt}</span>
                          <button onClick={() => removeOption(opt)} className="text-slate-400 hover:text-slate-600 focus:outline-none">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <input 
                        type="text" 
                        value={optionInput}
                        onChange={(e) => setOptionInput(e.target.value)}
                        onKeyDown={handleAddOption}
                        className="flex-1 min-w-[60px] text-[12px] font-medium outline-none bg-transparent" 
                        placeholder="Add option (Press Enter)..." 
                      />
                    </div>
                    {errors.options ? (
                      <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.options}</p>
                    ) : (
                      <p className="text-[10px] text-slate-500 mt-1 font-medium">Add options for the dropdown. Press enter to add.</p>
                    )}
                  </div>
                  <div className="flex-1 relative">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Default Value</label>
                    <select 
                      value={defaultValue}
                      onChange={(e) => setDefaultValue(e.target.value)}
                      className="w-full appearance-none pl-3 pr-8 py-2 text-[12px] border border-slate-200 rounded-md focus:outline-none focus:border-indigo-400 font-medium bg-white text-slate-900"
                    >
                      <option value="">Select default value (optional)</option>
                      {options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-2.5 top-[26px] text-slate-400 pointer-events-none" />
                    <p className="text-[10px] text-slate-500 mt-1 font-medium">Select a default value for this field.</p>
                  </div>
                </div>
              )}

              {/* Row 4 Full Width */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Help Text / Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-md focus:outline-none focus:border-indigo-400 font-medium bg-white text-slate-900 resize-none"
                  placeholder="Enter help text..."
                />
                <p className="text-[10px] text-slate-500 mt-1 font-medium">This help text will guide users while entering data.</p>
              </div>

            </div>
          </div>

          {/* CARD 2: FIELD SETTINGS */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-[13px] font-bold text-slate-900">Field Settings</h3>
            </div>

            <div className="p-4 flex flex-col gap-5">

              {/* Toggles Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">

                {/* Toggle 1 */}
                <div className="flex items-start justify-between p-3 border border-slate-100 rounded-lg bg-slate-50/30">
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-900 mb-0.5">Mandatory Field</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Users must fill this field.</p>
                  </div>
                  <button
                    onClick={() => setMandatory(!mandatory)}
                    className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${mandatory ? 'bg-indigo-600' : 'bg-slate-200'}`}
                  >
                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${mandatory ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                  </button>
                </div>

                {/* Toggle 2 */}
                <div className="flex items-start justify-between p-3 border border-slate-100 rounded-lg bg-slate-50/30">
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-900 mb-0.5">Show in Reports</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Include in reports & exports.</p>
                  </div>
                  <button
                    onClick={() => setShowInReports(!showInReports)}
                    className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${showInReports ? 'bg-indigo-600' : 'bg-slate-200'}`}
                  >
                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${showInReports ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                  </button>
                </div>

                {/* Toggle 3 */}
                <div className="flex items-start justify-between p-3 border border-slate-100 rounded-lg bg-slate-50/30">
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-900 mb-0.5">Show in Employee Profile</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Display in employee profile.</p>
                  </div>
                  <button
                    onClick={() => setShowInProfile(!showInProfile)}
                    className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${showInProfile ? 'bg-indigo-600' : 'bg-slate-200'}`}
                  >
                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${showInProfile ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                  </button>
                </div>

                {/* Toggle 4 */}
                <div className="flex items-start justify-between p-3 border border-slate-100 rounded-lg bg-slate-50/30">
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-900 mb-0.5">Show in Directory</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Visible in company directory.</p>
                  </div>
                  <button
                    onClick={() => setShowInDirectory(!showInDirectory)}
                    className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${showInDirectory ? 'bg-indigo-600' : 'bg-slate-200'}`}
                  >
                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${showInDirectory ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                  </button>
                </div>

              </div>

              {/* Bottom Row */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-slate-700 mb-2">Applicable For <span className="text-red-500">*</span></label>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer" onClick={() => setApplicableFor('Employees')}>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${applicableFor === 'Employees' ? 'border-indigo-600 border-2' : 'border-slate-300'}`}>
                        {applicableFor === 'Employees' && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>}
                      </div>
                      <span className={`text-[11px] font-medium ${applicableFor === 'Employees' ? 'text-slate-900' : 'text-slate-700'}`}>Employees</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer" onClick={() => setApplicableFor('Departments')}>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${applicableFor === 'Departments' ? 'border-indigo-600 border-2' : 'border-slate-300'}`}>
                        {applicableFor === 'Departments' && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>}
                      </div>
                      <span className={`text-[11px] font-medium ${applicableFor === 'Departments' ? 'text-slate-900' : 'text-slate-700'}`}>Departments</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer" onClick={() => setApplicableFor('Both')}>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${applicableFor === 'Both' ? 'border-indigo-600 border-2' : 'border-slate-300'}`}>
                        {applicableFor === 'Both' && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>}
                      </div>
                      <span className={`text-[11px] font-medium ${applicableFor === 'Both' ? 'text-slate-900' : 'text-slate-700'}`}>Both Employees & Departments</span>
                    </label>
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Field Order</label>
                  <input
                    type="number"
                    value={fieldOrder}
                    onChange={(e) => setFieldOrder(e.target.value)}
                    className="w-full px-3 py-2 text-[12px] border border-slate-200 rounded-md focus:outline-none focus:border-indigo-400 font-medium bg-white text-slate-900"
                  />
                  <p className="text-[10px] text-slate-500 mt-1 font-medium">Display order in the form. Lower number shows first.</p>
                </div>
              </div>

            </div>
          </div>

          {/* CARD 3: NOTE */}
          <div className="p-3 px-4 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-start gap-2 shadow-sm">
            <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 border border-indigo-200 mt-0.5">
              <Info className="w-3 h-3 text-indigo-600" />
            </div>
            <div className="mt-0.5">
              <p className="text-[12px] font-bold text-indigo-800 mb-0.5">Note</p>
              <p className="text-[11px] font-medium text-indigo-700/80">
                After saving, this field will be available in the department forms and reports where applicable.
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT SECTION (25%) */}
        <div className="flex flex-col gap-2 w-full xl:w-[25%]">

          {/* Card 1: Field Preview */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-[13px] font-bold text-slate-900">Field Preview</h3>
            </div>
            <div className="p-4 flex flex-col gap-2">

              <div className="flex items-start gap-2">
                <span className="w-20 text-[11px] font-medium text-slate-500 shrink-0">Label</span>
                <span className="text-[12px] font-bold text-slate-900">{label || '-'}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-20 text-[11px] font-medium text-slate-500 shrink-0">Type</span>
                {dataType === 'Dropdown' ? (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold rounded-md border text-blue-600 bg-blue-50 border-blue-200 w-max"><List size={10} /> Dropdown</span>
                ) : dataType === 'Number' ? (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold rounded-md border text-indigo-600 bg-indigo-50 border-indigo-200 w-max"><Hash size={10} /> Number</span>
                ) : dataType === 'Multi Select' ? (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold rounded-md border text-amber-600 bg-amber-50 border-amber-200 w-max"><LayoutList size={10} /> Multi Select</span>
                ) : dataType === 'Currency' ? (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold rounded-md border text-emerald-600 bg-emerald-50 border-emerald-200 w-max"><DollarSign size={10} /> Currency</span>
                ) : dataType === 'Text' ? (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold rounded-md border text-slate-600 bg-slate-50 border-slate-200 w-max"><AlignLeft size={10} /> Text</span>
                ) : dataType === 'Date' ? (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold rounded-md border text-teal-600 bg-teal-50 border-teal-200 w-max"><Calendar size={10} /> Date</span>
                ) : (
                  <span className="text-[11px] font-bold text-slate-900">{dataType || '-'}</span>
                )}
              </div>

              {(dataType === 'Dropdown' || dataType === 'Multi Select') && (
                <div className="flex items-start gap-2">
                  <span className="w-20 text-[11px] font-medium text-slate-500 shrink-0 pt-0.5">Options</span>
                  <ul className="text-[11px] font-medium text-slate-700 space-y-1">
                    {options.length === 0 && <span className="text-slate-400 italic">None</span>}
                    {options.map((opt) => (
                      <li key={opt} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                        {opt}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="w-20 text-[11px] font-medium text-slate-500 shrink-0">Mandatory</span>
                {mandatory ? (
                  <div className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[11px] font-bold text-slate-900">Yes</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <X className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-900">No</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="w-20 text-[11px] font-medium text-slate-500 shrink-0">Status</span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded uppercase tracking-wide w-max">Active</span>
              </div>

            </div>
          </div>

          {/* Card 2: Field Guidelines */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-[13px] font-bold text-slate-900">Field Guidelines</h3>
            </div>
            <div className="p-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-[11px] font-medium text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>Use clear and meaningful labels.</span>
                </li>
                <li className="flex items-start gap-2 text-[11px] font-medium text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>Choose the appropriate data type.</span>
                </li>
                <li className="flex items-start gap-2 text-[11px] font-medium text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>Avoid creating duplicate fields.</span>
                </li>
                <li className="flex items-start gap-2 text-[11px] font-medium text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>Mark as mandatory only if required.</span>
                </li>
                <li className="flex items-start gap-2 text-[11px] font-medium text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>Changes will reflect in all related forms.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 3: Need Help? */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2 border border-blue-100">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-[13px] font-bold text-slate-900 mb-1">Need Help?</h3>
            <p className="text-[11px] font-medium text-slate-500 mb-3">Learn more about custom fields.</p>
            <button className="flex items-center justify-center gap-2 w-full py-2 px-3 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
              View Help Documentation <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* BOTTOM STICKY ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 px-8 flex justify-end gap-3 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] lg:ml-64">
        <Link href={`/dashboard/departments/${id}/custom-fields`} className="px-4 py-2 bg-white border border-slate-200 rounded-md text-[12px] font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
          Cancel
        </Link>
        <button onClick={handleSave} disabled={isSaving || isLoading} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 border border-indigo-600 rounded-md text-[12px] font-bold text-white hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50">
          <Save className="w-3.5 h-3.5" /> {isSaving ? (isEdit ? 'Updating...' : 'Saving...') : (isEdit ? 'Update Field' : 'Save Field')}
        </button>
      </div>

    </div>
  );
}
