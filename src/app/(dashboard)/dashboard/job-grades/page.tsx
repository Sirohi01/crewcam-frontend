'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
    Upload, Download, Plus, ChevronRight, Search, Filter,
    Users, UserCircle, IndianRupee, UserPlus, CheckCircle2, ChevronDown, ChevronLeft, MoreVertical,
    FileText, Lightbulb, MapPin, Briefcase, Info
} from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadCrumb';
import BulkUploadModal, { ColumnConfig } from '@/components/upload/bulkUploadModal';

interface JobGradeRow {
  gradeName: string;
  gradeCode: string;
  gradeLevel: string;
  payRangeMin: string;
  payRangeMax: string;
  jobFamily: string;
  parentGrade: string;
  status: string;
  shortDescription: string;
  ctcRangeMin: string;
  ctcRangeMax: string;
  probationPeriod: string;
  remarks: string;
}

const jobGradeColumns: ColumnConfig<JobGradeRow>[] = [
  { key: 'gradeName', label: 'Grade Name', required: true, sampleValue: 'Junior Manager' },
  { key: 'gradeCode', label: 'Grade Code', required: true, unique: true, sampleValue: 'JG-05' },
  { key: 'gradeLevel', label: 'Grade Level', required: true, sampleValue: '5-4', validate: (v) => (['10', '9-8', '7-6', '5-4', '3-1'].includes(String(v)) ? null : 'Grade Level must be 10, 9-8, 7-6, 5-4, or 3-1') },
  { key: 'payRangeMin', label: 'Pay Range Min (Monthly)', required: true, sampleValue: '45,000' },
  { key: 'payRangeMax', label: 'Pay Range Max (Monthly)', required: true, sampleValue: '70,000' },
  { key: 'jobFamily', label: 'Job Family', required: true, sampleValue: 'Management', validate: (v) => (['management', 'operations', 'technical', 'support'].includes(String(v).toLowerCase()) ? null : 'Job Family must be Management, Operations, Technical, or Support') },
  { key: 'parentGrade', label: 'Parent Grade', sampleValue: 'Manager (JG-06)' },
  { key: 'status', label: 'Status', required: true, sampleValue: 'Active', validate: (v) => (['active', 'inactive', 'draft'].includes(String(v).toLowerCase()) ? null : 'Status must be Active, Inactive, or Draft') },
  { key: 'shortDescription', label: 'Short Description', sampleValue: 'Mid-level management roles' },
  { key: 'ctcRangeMin', label: 'CTC Range Min (Annual)', sampleValue: '6,00,000' },
  { key: 'ctcRangeMax', label: 'CTC Range Max (Annual)', sampleValue: '9,00,000' },
  { key: 'probationPeriod', label: 'Probation Period (Months)', sampleValue: '6' },
  { key: 'remarks', label: 'Remarks', sampleValue: 'Applicable for mid-level managers' },
];
import { FormInput } from '@/components/ui/form-input';

// --- MOCK DATA ---
const topCards = [
    { title: 'Total Job Grades', value: '12', subtitle: 'Active', bg: 'bg-blue-50', text: 'text-blue-600', icon: Users },
    { title: 'Mapped Designations', value: '42', subtitle: 'Across Grades', bg: 'bg-emerald-50', text: 'text-emerald-600', icon: CheckCircle2 },
    { title: 'Employees Mapped', value: '532', subtitle: 'Total Employees', bg: 'bg-purple-50', text: 'text-purple-600', icon: UserCircle },
    { title: 'Avg. Pay Range (Min - Max)', value: '₹ 18,000 - ₹ 3,20,000', subtitle: '', bg: 'bg-blue-50', text: 'text-blue-600', icon: IndianRupee },
    { title: 'Grades with Open Positions', value: '5', subtitle: 'Openings', bg: 'bg-purple-50', text: 'text-purple-600', icon: UserPlus },
];

const jobGrades = [
    { level: '01', levelBg: 'bg-purple-50', levelText: 'text-purple-700', name: 'Grade 1 - Entry Level', desc: 'Entry level roles', code: 'JG-01', payRange: '₹18,000-₹28,000', designations: 4, employees: 56 },
    { level: '02', levelBg: 'bg-blue-50', levelText: 'text-blue-700', name: 'Grade 2 - Junior', desc: 'Junior level roles', code: 'JG-02', payRange: '₹25,000-₹38,000', designations: 6, employees: 78 },
    { level: '03', levelBg: 'bg-emerald-50', levelText: 'text-emerald-700', name: 'Grade 3 - Executive', desc: 'Executive level roles', code: 'JG-03', payRange: '₹35,000-₹55,000', designations: 8, employees: 112 },
    { level: '04', levelBg: 'bg-amber-50', levelText: 'text-amber-700', name: 'Grade 4 - Senior Executive', desc: 'Senior executive roles', code: 'JG-04', payRange: '₹50,000-₹75,000', designations: 7, employees: 98 },
    { level: '05', levelBg: 'bg-rose-50', levelText: 'text-rose-700', name: 'Grade 5 - Assistant Manager', desc: 'Assistant manager roles', code: 'JG-05', payRange: '₹70,000-₹1,00,000', designations: 5, employees: 72 },
    { level: '06', levelBg: 'bg-indigo-50', levelText: 'text-indigo-700', name: 'Grade 6 - Manager', desc: 'Manager level roles', code: 'JG-06', payRange: '₹90,000-₹1,40,000', designations: 4, employees: 48 },
    { level: '07', levelBg: 'bg-cyan-50', levelText: 'text-cyan-700', name: 'Grade 7 - Senior Manager', desc: 'Senior manager roles', code: 'JG-07', payRange: '₹1,30,000-₹2,00,000', designations: 3, employees: 36 },
    { level: '08', levelBg: 'bg-orange-50', levelText: 'text-orange-700', name: 'Grade 8 - Deputy General Manager', desc: 'Department leadership roles', code: 'JG-08', payRange: '₹1,80,000-₹2,80,000', designations: 3, employees: 24 },
    { level: '09', levelBg: 'bg-teal-50', levelText: 'text-teal-700', name: 'Grade 9 - General Manager', desc: 'Business unit leadership', code: 'JG-09', payRange: '₹2,50,000-₹4,00,000', designations: 2, employees: 12 },
];

export default function JobGradesPage() {
    const [showImportModal, setShowImportModal] = useState(false);

    return (
        <div className="flex flex-col gap-2 animate-in fade-in duration-300 p-2 w-full font-sans text-zinc-800 bg-[#f8f9fc] min-h-screen">

            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                <div>
                 <Breadcrumb
  items={[
    { label: "Organization Setup", href: "/dashboard" },
    { label: "Job Grades" },
  ]}
/>
                    <h1 className="text-lg font-bold text-zinc-900 mb-0.5">Job Grades</h1>
                    <p className="text-[11px] text-zinc-500">Create and manage job grades used across the organization for role hierarchy and pay structure.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowImportModal(true)}
                        className="flex items-center gap-1.5 h-8 px-2.5 bg-white border border-zinc-200 rounded-md text-[11px] font-semibold hover:bg-zinc-50 transition-colors shadow-sm text-zinc-700"
                    >
                        <Upload className="w-3.5 h-3.5" /> Import Grades
                    </button>
                    <button className="flex items-center gap-1.5 h-8 px-2.5 bg-white border border-zinc-200 rounded-md text-[11px] font-semibold hover:bg-zinc-50 transition-colors shadow-sm text-zinc-700">
                        <Download className="w-3.5 h-3.5" /> Export <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
                    </button>
                    <Link href={"/dashboard/job-grades/add-new-job-grade"} className="flex items-center gap-1.5 h-8 px-2.5 bg-indigo-600 text-white rounded-md text-[11px] font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
                        <Plus className="w-3.5 h-3.5" /> Add New Job Grade
                    </Link>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 mb-1">
                {topCards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <div key={idx} className="p-3 flex items-center gap-2.5 bg-white border border-zinc-200 shadow-sm rounded-xl">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${card.bg} ${card.text}`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide">{card.title}</h3>
                                <span className="text-md font-bold text-zinc-900 leading-tight">{card.value}</span>
                                {card.subtitle && <p className="text-[10px] text-zinc-400">{card.subtitle}</p>}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* MAIN TWO-COLUMN LAYOUT */}
            <div className="grid grid-cols-1 xl:grid-cols-10 gap-2 items-stretch">

                {/* LEFT SECTION (70%) */}
                <div className="xl:col-span-7 flex flex-col gap-2 h-full">
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-xl overflow-hidden flex flex-col flex-1">

                        {/* TABLE HEADER */}
                        <div className="flex items-center justify-between p-3 border-b border-zinc-100">
                            <h2 className="text-[13px] font-bold text-zinc-800 flex items-center gap-2">Job Grades List</h2>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <FormInput variant="search" type="text" placeholder="Search job grades..." className="pl-2.5 pr-7 h-8 w-48" />
                                    <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                                </div>
                                <button className="flex items-center gap-1.5 h-8 px-2.5 border border-zinc-200 rounded-md text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
                                    <Filter className="w-3.5 h-3.5" /> Filters
                                </button>
                                <div className="flex items-center gap-1.5 h-8 px-2.5 border border-zinc-200 rounded-md text-[11px] font-semibold text-zinc-700 cursor-pointer hover:bg-zinc-50 transition-colors">
                                    Sort by: Grade Level (Low - High) <ChevronDown className="w-3.5 h-3.5" />
                                </div>
                            </div>
                        </div>

                        {/* TABLE */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-zinc-100 bg-zinc-50/50">
                                        <th className="py-2 px-2.5 text-[10px] font-semibold text-zinc-500 uppercase">Grade Level</th>
                                        <th className="py-2 px-2.5 text-[10px] font-semibold text-zinc-500 uppercase">Grade Name</th>
                                        <th className="py-2 px-2.5 text-[10px] font-semibold text-zinc-500 uppercase">Code</th>
                                        <th className="py-2 px-2.5 text-[10px] font-semibold text-zinc-500 uppercase">Pay Range (Monthly)</th>
                                        <th className="py-2 px-2.5 text-[10px] font-semibold text-zinc-500 uppercase text-center">Mapped Designations</th>
                                        <th className="py-2 px-2.5 text-[10px] font-semibold text-zinc-500 uppercase text-center">Employees</th>
                                        <th className="py-2 px-2.5 text-[10px] font-semibold text-zinc-500 uppercase text-center">Status</th>
                                        <th className="py-2 px-2.5 text-[10px] font-semibold text-zinc-500 uppercase text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[11px]">
                                    {jobGrades.map((jg, idx) => (
                                        <tr key={idx} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                                            <td className="py-1.5 px-3 text-center w-14">
                                                <div className={`w-full py-1.5 rounded font-semibold text-[10px] flex items-center justify-center ${jg.levelBg} ${jg.levelText}`}>
                                                    {jg.level}
                                                </div>
                                            </td>
                                            <td className="py-1.5 px-3">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-zinc-800 text-[10px]">{jg.name}</span>
                                                    <span className="text-[10px] text-zinc-500">{jg.desc}</span>
                                                </div>
                                            </td>
                                            <td className="py-1.5 px-2">
                                                <span className="inline-flex items-center px-1 py-0.5 rounded-md text-blue-600 bg-blue-50 text-[9px] font-semibold border border-blue-100">
                                                    {jg.code}
                                                </span>
                                            </td>
                                            <td className="py-1.5 px-2 font-semibold text-zinc-800">{jg.payRange}</td>
                                            <td className="py-1.5 px-2 text-center font-semibold text-zinc-800">{jg.designations}</td>
                                            <td className="py-1.5 px-2 text-center font-semibold text-zinc-800">{jg.employees}</td>
                                            <td className="py-1.5 px-2 text-center">
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100">
                                                    Active
                                                </span>
                                            </td>
                                            <td className="py-1.5 px-3">
                                                <div className="flex items-center justify-center gap-1 text-zinc-400">
                                                    <button className="p-1 hover:text-zinc-600 transition-colors"><FileText className="w-3.5 h-3.5" /></button>
                                                    <button className="p-1 hover:text-zinc-600 transition-colors"><MoreVertical className="w-3.5 h-3.5" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* TABLE FOOTER */}
                        <div className="p-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                            <div className="pl-2">Showing 1 to 10 of 12 job grades</div>
                            <div className="flex items-center gap-1">
                                <button className="p-1 border border-zinc-200 rounded-md bg-white hover:bg-zinc-50 text-zinc-400"><ChevronLeft className="w-3.5 h-3.5" /></button>
                                <button className="w-6 h-6 flex items-center justify-center border border-indigo-600 bg-indigo-600 text-white rounded-md font-semibold">1</button>
                                <button className="w-6 h-6 flex items-center justify-center border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 rounded-md font-semibold">2</button>
                                <button className="p-1 border border-zinc-200 rounded-md bg-white hover:bg-zinc-50 text-zinc-400"><ChevronRight className="w-3.5 h-3.5" /></button>
                            </div>
                            <div className="flex items-center gap-2 pr-2">
                                <span>Rows per page:</span>
                                <div className="relative">
                                    <select className="appearance-none border border-zinc-200 bg-white pl-2 pr-6 py-1 rounded-md cursor-pointer hover:bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold text-zinc-700 text-[11px]">
                                        <option value="10">10</option>
                                    </select>
                                    <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDEBAR (30%) */}
                <div className="xl:col-span-3 flex flex-col gap-2 h-full">

                    {/* Grade Structure Overview */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-xl p-3 2xl:p-5 flex-1 flex flex-col">
                        <h2 className="text-[14px] font-bold text-zinc-800 mb-3 flex items-center gap-2">Grade Structure Overview</h2>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-28 h-28 shrink-0">
                                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
                                    {/* Level 5: Bottom (1-3) */}
                                    <polygon points="10,80 90,80 100,100 0,100" fill="#fcd34d" />
                                    {/* Level 4 (4-5) */}
                                    <polygon points="20,60 80,60 90,80 10,80" fill="#4ade80" />
                                    {/* Level 3 (6-7) */}
                                    <polygon points="30,40 70,40 80,60 20,60" fill="#3b82f6" />
                                    {/* Level 2 (8-9) */}
                                    <polygon points="40,20 60,20 70,40 30,40" fill="#e0e7ff" />
                                    {/* Level 1: Top (10) */}
                                    <polygon points="50,0 60,20 40,20" fill="#7c3aed" />

                                    {/* Labels inside */}
                                    <text x="50" y="15" fill="white" fontSize="6.5" fontWeight="bold" textAnchor="middle">10</text>

                                    <text x="50" y="28" fill="#312e81" fontSize="6.5" fontWeight="bold" textAnchor="middle">9</text>
                                    <text x="50" y="37" fill="#312e81" fontSize="6.5" fontWeight="bold" textAnchor="middle">8</text>

                                    <text x="50" y="53" fill="white" fontSize="6.5" fontWeight="bold" textAnchor="middle">6 - 7</text>
                                    <text x="50" y="73" fill="white" fontSize="6.5" fontWeight="bold" textAnchor="middle">4 - 5</text>
                                    <text x="50" y="93" fill="#78350f" fontSize="6.5" fontWeight="bold" textAnchor="middle">1 - 3</text>
                                </svg>
                            </div>
                            <div className="flex flex-col gap-3 flex-1 overflow-hidden">
                                <div className="flex items-center justify-between text-[11px] gap-2">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <div className="w-2 h-2 shrink-0 rounded-full bg-purple-600"></div>
                                        <span className="font-semibold text-zinc-700 whitespace-nowrap overflow-hidden text-ellipsis">Executive <span className="text-zinc-400 font-normal">(8 - 10)</span></span>
                                    </div>
                                    <span className="font-semibold text-zinc-500 shrink-0">3 Grades</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px] gap-2">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <div className="w-2 h-2 shrink-0 rounded-full bg-blue-500"></div>
                                        <span className="font-semibold text-zinc-700 whitespace-nowrap overflow-hidden text-ellipsis">Management <span className="text-zinc-400 font-normal">(6 - 7)</span></span>
                                    </div>
                                    <span className="font-semibold text-zinc-500 shrink-0">2 Grades</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px] gap-2">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <div className="w-2 h-2 shrink-0 rounded-full bg-emerald-400"></div>
                                        <span className="font-semibold text-zinc-700 whitespace-nowrap overflow-hidden text-ellipsis">Supervisory <span className="text-zinc-400 font-normal">(4 - 5)</span></span>
                                    </div>
                                    <span className="font-semibold text-zinc-500 shrink-0">2 Grades</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px] gap-2">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <div className="w-2 h-2 shrink-0 rounded-full bg-amber-300"></div>
                                        <span className="font-semibold text-zinc-700 whitespace-nowrap overflow-hidden text-ellipsis">Staff <span className="text-zinc-400 font-normal">(1 - 3)</span></span>
                                    </div>
                                    <span className="font-semibold text-zinc-500 shrink-0">3 Grades</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-auto bg-zinc-50 rounded-md py-2.5 flex items-center justify-center border border-zinc-100">
                            <span className="text-[12px] font-bold text-zinc-700">Total Grades: 10</span>
                        </div>
                    </div>

                    {/* Quick Actions Card */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-xl p-6 2xl:p-6 flex-1 flex flex-col justify-center">
                        <h2 className="text-[14px] font-bold text-zinc-800 mb-4 flex items-center gap-2">Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex items-center gap-2 p-2.5 border border-zinc-200 rounded-lg text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors justify-center whitespace-nowrap">
                                <Plus className="w-4 h-4" /> Add New Job Grade
                            </button>
                            <button className="flex items-center gap-2 p-2.5 border border-zinc-200 rounded-lg text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors justify-center whitespace-nowrap">
                                <MapPin className="w-4 h-4 text-zinc-400" /> Map Designation
                            </button>
                            <button className="flex items-center gap-2 p-2.5 border border-zinc-200 rounded-lg text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors justify-center whitespace-nowrap">
                                <Users className="w-4 h-4 text-zinc-400" /> View Grade Hierarchy
                            </button>
                            <button className="flex items-center gap-2 p-2.5 border border-zinc-200 rounded-lg text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors justify-center whitespace-nowrap">
                                <FileText className="w-4 h-4 text-zinc-400" /> Grade-Wise Pay Report
                            </button>
                        </div>
                    </div>

                    {/* Note */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-xl p-5 2xl:p-6 flex-1 flex flex-col justify-center">
                        <h2 className="text-[14px] font-bold text-zinc-800 mb-3 flex items-center gap-1.5">
                            <Info className="w-4 h-4 text-indigo-600" /> Note
                        </h2>
                        <ul className="flex flex-col gap-2.5 pl-5 list-disc marker:text-indigo-600 text-[11px] text-zinc-600 leading-snug font-medium">
                            <li>Job grades define the hierarchy and pay structure.</li>
                            <li>Map designations to appropriate grades.</li>
                            <li>Pay ranges help in compensation planning.</li>
                            <li>You can reorder grades from hierarchy view.</li>
                        </ul>
                    </div>

                </div>
            </div>

            <BulkUploadModal<JobGradeRow>
                open={showImportModal}
                onClose={() => setShowImportModal(false)}
                title="Upload Job Grade Data"
                description="Upload an Excel file to import job grades in bulk."
                sampleFileName="JobGrade_Example.xlsx"
                columns={jobGradeColumns}
                onImport={async (rows) => {
                    console.log('Importing job grades:', rows);
                }}
            />

        </div>
    );
}
