'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    ChevronRight, Building, ArrowLeft, Save, UploadCloud,
    CheckCircle2, Info, Link as LinkIcon, DollarSign, Image as ImageIcon
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';

// Reusable Input Field Components
const inputCls = 'mt-1 h-8 w-full rounded-md border border-zinc-200 bg-white px-2.5 text-[11px] text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50';
const selectCls = `${inputCls} appearance-none`;
const labelCls = 'text-[11px] font-semibold text-zinc-700';
const helpTextCls = 'text-[10px] text-zinc-400 mt-1 leading-tight';

function Field({ title, required, children, helpText }: { title: string; required?: boolean; children: React.ReactNode; helpText?: string }) {
    return (
        <label className="block">
            <span className={labelCls}>{title}{required && <b className="text-rose-500"> *</b>}</span>
            {children}
            {helpText && <p className={helpTextCls}>{helpText}</p>}
        </label>
    );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
        <div className="flex items-center gap-2 mb-2 bg-indigo-50/50 p-2 rounded-lg border border-indigo-50">
            <div className="text-indigo-600">{icon}</div>
            <h2 className="text-[12px] font-bold text-indigo-900">{title}</h2>
        </div>
    );
}

export default function AddNewBusinessUnitPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('edit');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        head: '',
        parent: '',
        type: 'Retail Interiors',
        status: 'Active',
        description: '',
        establishedOn: '',
        totalEmployees: '',
        totalDepartments: '',
        primaryFocus: '',
        keyServices: '',
        annualBudget: '',
        costCenters: '',
        financialOwner: '',
        iconUrl: '',
    });

    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [employees, setEmployees] = useState<any[]>([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await api.get('/employees');
                setEmployees(response.data.data || []);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };
        fetchEmployees();
    }, []);

    useEffect(() => {
        if (editId) {
            const fetchBU = async () => {
                try {
                    const res = await api.get(`/business-units/${editId}`);
                    const data = res.data.data || res.data;
                    setFormData({
                        name: data.name || '',
                        code: data.code || '',
                        head: data.head?._id || data.head || '',
                        parent: data.parent || '',
                        type: data.type || 'Retail Interiors',
                        status: data.status || 'Active',
                        description: data.description || '',
                        establishedOn: data.establishedOn ? data.establishedOn.split('T')[0] : '',
                        totalEmployees: data.totalEmployees?.toString() || '',
                        totalDepartments: data.totalDepartments?.toString() || '',
                        primaryFocus: data.primaryFocus || '',
                        keyServices: data.keyServices || '',
                        annualBudget: data.annualBudget || '',
                        costCenters: data.costCenters ? data.costCenters.join(', ') : '',
                        financialOwner: data.financialOwner?._id || data.financialOwner || '',
                        iconUrl: data.iconUrl || '',
                    });
                } catch (error) {
                    console.error('Error fetching BU:', error);
                    toast.error('Failed to load business unit details');
                }
            };
            fetchBU();
        }
    }, [editId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const toastId = toast.loading('Uploading icon...');
        try {
            const formData = new FormData();
            formData.append('file', file);
            // using the existing /api/v1/upload route which handles Cloudinary directly
            const response = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData(prev => ({ ...prev, iconUrl: response.data.url }));
            toast.success('Icon uploaded successfully', { id: toastId });
        } catch (error: any) {
            console.error('Error uploading icon:', error);
            toast.error(error.response?.data?.message || 'Failed to upload icon', { id: toastId });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.code || !formData.type || !formData.status) {
            toast.error('Please fill all mandatory fields');
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading('Saving business unit...');
        
        try {
            const payload = {
                ...formData,
                // Converting string numbers to actual numbers where appropriate
                totalEmployees: formData.totalEmployees ? Number(formData.totalEmployees) : undefined,
                totalDepartments: formData.totalDepartments ? Number(formData.totalDepartments) : undefined,
                // costCenters might be entered as comma separated, if they decide to change input later
                costCenters: formData.costCenters ? formData.costCenters.split(',').map(s => s.trim()) : [],
                head: formData.head || undefined,
                parent: formData.parent || undefined,
                financialOwner: formData.financialOwner || undefined,
            };

            if (editId) {
                await api.put(`/business-units/${editId}`, payload);
                toast.success('Business unit updated successfully', { id: toastId });
            } else {
                await api.post('/business-units', payload);
                toast.success('Business unit saved successfully', { id: toastId });
            }
            router.push('/dashboard/bussiness-unit/bussinessunit-bu');
        } catch (error: any) {
            console.error('Error saving BU:', error);
            toast.error(error.response?.data?.message || 'Failed to save business unit', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-2 animate-in fade-in duration-300 p-2 w-full font-sans text-zinc-800 bg-[#f8f9fc] min-h-screen">

            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                <div>
                    <div className="text-[11px] font-medium text-zinc-500 mb-1 flex items-center gap-2">
                        <span className="cursor-pointer hover:text-zinc-700">Organization Setup</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="cursor-pointer hover:text-zinc-700">Departments</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="cursor-pointer hover:text-zinc-700">Business Units</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-indigo-600 font-semibold cursor-pointer">{editId ? 'Edit Business Unit' : 'Add New Business Unit'}</span>
                    </div>
                    <h1 className="text-lg font-bold text-zinc-900 mb-0.5">{editId ? 'Edit Business Unit' : 'Add New Business Unit'}</h1>
                    <p className="text-[11px] text-zinc-500">{editId ? 'Modify the details of this business unit.' : 'Create a new business unit (BU) and define its details.'}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/dashboard/bussiness-unit/bussinessunit-bu" className="flex items-center gap-1.5 h-8 px-3 bg-white border border-zinc-200 rounded-md text-[11px] font-semibold hover:bg-zinc-50 transition-colors shadow-sm text-zinc-700">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Business Units
                    </Link>
                    <button 
                        onClick={handleSubmit} 
                        disabled={isSubmitting}
                        className="flex items-center gap-1.5 h-8 px-4 bg-indigo-600 text-white rounded-md text-[11px] font-semibold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
                    >
                        <Save className="w-3.5 h-3.5" /> {isSubmitting ? 'Saving...' : (editId ? 'Update Business Unit' : 'Save Business Unit')}
                    </button>
                </div>
            </div>

            {/* MAIN TWO-COLUMN LAYOUT */}
            <div className="grid grid-cols-1 xl:grid-cols-10 gap-2 items-stretch">

                {/* LEFT SECTION (Forms) */}
                <div className="xl:col-span-7 flex flex-col gap-2 h-full">
                    <Card className="bg-white border border-zinc-200 shadow-sm rounded-xl p-4 flex flex-col gap-3">

                        {/* Business Unit Information */}
                        <div>
                            <SectionHeader icon={<Building className="w-4 h-4" />} title="Business Unit Information" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                                <Field title="Business Unit Name" required>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputCls} placeholder="Enter business unit name" />
                                </Field>
                                <Field title="BU Code" required helpText="Short code (e.g., BU-RI)">
                                    <input type="text" name="code" value={formData.code} onChange={handleChange} className={inputCls} placeholder="Enter unique BU code" />
                                </Field>
                                <Field title="Head / Owner" helpText="Person responsible for this BU">
                                    <div className="relative">
                                        <select name="head" value={formData.head} onChange={handleChange} className={selectCls}>
                                            <option value="">Select BU Head / Owner</option>
                                            {employees.map(emp => (
                                                <option key={emp._id} value={emp._id}>
                                                    {emp.firstName} {emp.lastName} {emp.employeeId ? `(${emp.employeeId})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronRight className="w-3.5 h-3.5 absolute right-2.5 top-[18px] rotate-90 text-zinc-400 pointer-events-none" />
                                    </div>
                                </Field>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                                <Field title="Parent Business Unit" helpText="Enter the parent business unit">
                                    <input type="text" name="parent" value={formData.parent} onChange={handleChange} className={inputCls} placeholder="Enter parent BU (if any)" />
                                </Field>
                                <Field title="Business Unit Type" required helpText="Select the appropriate category">
                                    <div className="relative">
                                        <select name="type" value={formData.type} onChange={handleChange} className={selectCls}>
                                            <option value="Retail Interiors">Retail Interiors</option>
                                            <option value="Design & Planning">Design & Planning</option>
                                            <option value="Display Solutions">Display Solutions</option>
                                            <option value="Corporate Services">Corporate Services</option>
                                        </select>
                                        <ChevronRight className="w-3.5 h-3.5 absolute right-2.5 top-[18px] rotate-90 text-zinc-400 pointer-events-none" />
                                    </div>
                                </Field>
                                <Field title="Status" required helpText="Choose current status">
                                    <div className="relative">
                                        <select name="status" value={formData.status} onChange={handleChange} className={selectCls}>
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                        <ChevronRight className="w-3.5 h-3.5 absolute right-2.5 top-[18px] rotate-90 text-zinc-400 pointer-events-none" />
                                    </div>
                                </Field>
                            </div>

                            <div className="mb-0.5">
                                <Field title="Business Unit Description">
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="mt-1 w-full rounded-md border border-zinc-200 bg-white p-2.5 text-[11px] text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 min-h-[80px] resize-none"
                                        placeholder="Enter a brief description about this business unit, its objectives and key focus areas..."
                                        maxLength={500}
                                    />
                                    <div className="text-right text-[9px] text-zinc-400 mt-1">{formData.description.length}/500</div>
                                </Field>
                            </div>
                        </div>

                        {/* Additional Details */}
                        <div>
                            <SectionHeader icon={<LinkIcon className="w-4 h-4" />} title="Additional Details" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                                <Field title="Established On">
                                    <input type="date" name="establishedOn" value={formData.establishedOn} onChange={handleChange} className={inputCls} placeholder="Select date" />
                                </Field>
                                <Field title="Total Employees (Approx.)">
                                    <input type="number" name="totalEmployees" value={formData.totalEmployees} onChange={handleChange} className={inputCls} placeholder="Enter approx. number" />
                                </Field>
                                <Field title="Total Departments (Approx.)">
                                    <input type="number" name="totalDepartments" value={formData.totalDepartments} onChange={handleChange} className={inputCls} placeholder="Enter approx. number" />
                                </Field>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <Field title="Primary Focus Area">
                                    <input type="text" name="primaryFocus" value={formData.primaryFocus} onChange={handleChange} className={inputCls} placeholder="e.g., Retail Solutions, Interior Design, Corporate Services" />
                                </Field>
                                <Field title="Key Services / Products">
                                    <input type="text" name="keyServices" value={formData.keyServices} onChange={handleChange} className={inputCls} placeholder="Enter key services or products offered" />
                                </Field>
                            </div>
                        </div>

                        {/* Budget & Financial Details (Optional) */}
                        <div>
                            <SectionHeader icon={<DollarSign className="w-4 h-4" />} title="Budget & Financial Details (Optional)" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <Field title="Annual Budget (FY 25-26)" helpText="Enter budget amount">
                                    <div className="relative">
                                        <span className="absolute left-2.5 top-[10px] text-zinc-500 text-[11px]">₹</span>
                                        <input type="text" name="annualBudget" value={formData.annualBudget} onChange={handleChange} className={`${inputCls} pl-7`} placeholder="Enter annual budget" />
                                    </div>
                                </Field>
                                <Field title="Cost Centers" helpText="Link one or more cost centers">
                                    <div className="relative">
                                        <select name="costCenters" value={formData.costCenters} onChange={handleChange} className={selectCls}>
                                            <option value="">Select cost centers</option>
                                        </select>
                                        <ChevronRight className="w-3.5 h-3.5 absolute right-2.5 top-[18px] rotate-90 text-zinc-400 pointer-events-none" />
                                    </div>
                                </Field>
                                <Field title="Financial Owner" helpText="Person responsible for financials">
                                    <div className="relative">
                                        <select name="financialOwner" value={formData.financialOwner} onChange={handleChange} className={selectCls}>
                                            <option value="">Select financial owner</option>
                                            {employees.map(emp => (
                                                <option key={emp._id} value={emp._id}>
                                                    {emp.firstName} {emp.lastName} {emp.employeeId ? `(${emp.employeeId})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronRight className="w-3.5 h-3.5 absolute right-2.5 top-[18px] rotate-90 text-zinc-400 pointer-events-none" />
                                    </div>
                                </Field>
                            </div>
                        </div>

                    </Card>
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="xl:col-span-3 flex flex-col gap-3 h-full">

                    {/* Business Unit Icon Card */}
                    <Card className="bg-white border border-zinc-200 shadow-sm rounded-xl p-4">
                        <h2 className="text-[14px] font-bold text-zinc-800 mb-1">Business Unit Icon</h2>
                        <p className="text-[11px] text-zinc-500 mb-4">Upload an icon or choose from library to represent this BU.</p>

                        <div className="flex gap-3 h-[140px]">
                            {/* Upload Box */}
                            <div 
                                onClick={() => !isUploading && fileInputRef.current?.click()}
                                className={`w-1/3 border border-dashed border-zinc-300 rounded-lg flex flex-col items-center justify-center bg-zinc-50/50 hover:bg-zinc-50 transition-colors cursor-pointer p-2.5 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {formData.iconUrl ? (
                                    <img src={formData.iconUrl} alt="BU Icon" className="w-10 h-10 object-contain mb-1" />
                                ) : (
                                    <UploadCloud className="w-7 h-7 text-indigo-500 mb-2" />
                                )}
                                <span className="text-[11px] font-bold text-zinc-700 text-center leading-tight mb-1">
                                    {isUploading ? 'Uploading...' : (formData.iconUrl ? 'Change Icon' : 'Upload Icon')}
                                </span>
                                <span className="text-[9px] text-zinc-400 text-center">PNG, JPG (Max 2MB)</span>
                            </div>
                            <input 
                                type="file" 
                                accept="image/png, image/jpeg, image/webp" 
                                className="hidden" 
                                ref={fileInputRef} 
                                onChange={handleIconUpload}
                            />

                            {/* Choose from Library Box */}
                            <div className="w-2/3 border border-zinc-200 rounded-lg p-2.5 flex flex-col">
                                <span className="text-[11px] font-bold text-zinc-700 text-center mb-2.5">Choose from Library</span>
                                <div className="grid grid-cols-3 gap-2 flex-1 place-items-center">
                                    <div className="w-8 h-8 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center cursor-pointer hover:bg-indigo-100"><Building className="w-4 h-4" /></div>
                                    <div className="w-8 h-8 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center cursor-pointer hover:bg-emerald-100"><ImageIcon className="w-4 h-4" /></div>
                                    <div className="w-8 h-8 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center cursor-pointer hover:bg-amber-100"><Building className="w-4 h-4" /></div>
                                    <div className="w-8 h-8 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center cursor-pointer hover:bg-purple-100"><Building className="w-4 h-4" /></div>
                                    <div className="w-8 h-8 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center cursor-pointer hover:bg-rose-100"><Building className="w-4 h-4" /></div>
                                    <div className="w-8 h-8 rounded-md bg-teal-50 text-teal-600 flex items-center justify-center cursor-pointer hover:bg-teal-100"><Building className="w-4 h-4" /></div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Why Add Business Unit Card */}
                    <Card className="bg-white border border-zinc-200 shadow-sm rounded-xl p-4 flex-1">
                        <h2 className="text-[14px] font-bold text-zinc-800 mb-3">Why Add Business Unit?</h2>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                <p className="text-[12px] text-zinc-600 leading-relaxed">Helps in organizing departments and resources under a specific business unit.</p>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                <p className="text-[12px] text-zinc-600 leading-relaxed">Enables budget allocation and cost management at BU level.</p>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                <p className="text-[12px] text-zinc-600 leading-relaxed">Provides better reporting and performance tracking.</p>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                <p className="text-[12px] text-zinc-600 leading-relaxed">Improves accountability and decision making.</p>
                            </div>
                        </div>
                    </Card>

                    {/* Note Card */}
                    <Card className="bg-white border border-zinc-200 shadow-sm rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Info className="w-5 h-5 text-indigo-600" />
                            <h2 className="text-[14px] font-bold text-zinc-800">Note</h2>
                        </div>
                        <ul className="list-disc pl-5 flex flex-col gap-2.5">
                            <li className="text-[12px] text-zinc-600 leading-relaxed pl-1">All fields marked with <b className="text-rose-500">*</b> are mandatory.</li>
                            <li className="text-[12px] text-zinc-600 leading-relaxed pl-1">You can edit business unit details anytime from the business unit list.</li>
                        </ul>
                    </Card>

                </div>
            </div>

        </div>
    );
}
