// 'use client';
// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import {
//   Upload, Download, Sparkles, Plus, ChevronRight, Search, Filter,
//   RotateCcw, Eye, Edit2, MoreVertical, X, ChevronDown, ChevronLeft,
//   Building, Users, User, PieChart as PieChartIcon, TrendingUp, Clock,
//   Delete,
//   Trash2
// } from 'lucide-react';
// import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area } from 'recharts';
// import { Card } from '@/components/ui/card';
// import { getDepartments, deleteDepartment } from '@/services/departmentService';
// import { Breadcrumb } from '@/components/ui/breadCrumb';
// import BulkUploadModal, { ColumnConfig } from '@/components/upload/bulkUploadModal';
// import { FormInput } from '@/components/ui/form-input';

// const topCards = [
//   { title: 'TOTAL DEPARTMENTS', value: '10', subtitle: 'All departments', color: '#3b82f6', isChart: true, linkText: 'View all' },
//   { title: 'ACTIVE DEPARTMENTS', value: '10', subtitle: '100% of total', color: '#10b981', isChart: true, linkText: 'View all' },
//   { title: 'DEPARTMENT HEADS', value: '9', subtitle: 'With assigned head', color: '#8b5cf6', isChart: true, linkText: 'View all' },
//   { title: 'TOTAL EMPLOYEES', value: '467', subtitle: 'Across all departments', color: '#3b82f6', isChart: true, linkText: 'View all' },
//   { title: 'TOTAL BUDGET (FY 2025-26)', value: '₹ 15.45 Cr', subtitle: 'Allocated budget', color: '#f97316', isChart: true, linkText: 'View details' },
//   { title: 'AVG. UTILIZATION', value: '72%', subtitle: 'Budget utilization', color: '#10b981', isPie: true, linkText: 'View details' },
// ];

// const mockChartData = [{ v: 10 }, { v: 25 }, { v: 20 }, { v: 45 }, { v: 30 }, { v: 50 }, { v: 40 }];

// const compositionData = [
//   { name: 'Managers', value: 10, color: '#3b82f6', percent: '24%' },
//   { name: 'Executives', value: 20, color: '#10b981', percent: '48%' },
//   { name: 'Officers', value: 10, color: '#f59e0b', percent: '24%' },
//   { name: 'Support Staff', value: 2, color: '#8b5cf6', percent: '4%' },
// ];

// const activities = [
//   { id: 1, text: 'Budget updated for FY 2025-26', by: 'Vijay Sharma', time: '28 May 2025, 11:30 AM' },
//   { id: 2, text: 'Neha Sethi assigned as GM - Retail', by: 'Vijay Sharma', time: '20 May 2025, 04:15 PM' },
//   { id: 3, text: 'Department created', by: 'Vijay Sharma', time: '12 Jan 2024, 10:00 AM' },
// ];

// const MicroLineChart = ({ color }: { color: string }) => {
//   const chartId = color.replace('#', '');
//   return (
//     <ResponsiveContainer width="100%" height={35}>
//       <AreaChart data={mockChartData}>
//         <defs>
//           <linearGradient id={`color${chartId}`} x1="0" y1="0" x2="0" y2="1">
//             <stop offset="5%" stopColor={color} stopOpacity={0.3} />
//             <stop offset="95%" stopColor={color} stopOpacity={0} />
//           </linearGradient>
//         </defs>
//         <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fillOpacity={1} fill={`url(#color${chartId})`} isAnimationActive={false} />
//       </AreaChart>
//     </ResponsiveContainer>
//   );
// };

// const CircularProgress = ({ value, color, hideText }: { value: number, color: string, hideText?: boolean }) => {
//   const data = [{ value }, { value: 100 - value }];
//   return (
//     <div className="relative w-full h-full flex items-center justify-center">
//       <ResponsiveContainer width="100%" height="100%">
//         <PieChart>
//           <Pie data={data} innerRadius="70%" outerRadius="100%" dataKey="value" stroke="none" startAngle={90} endAngle={-270} isAnimationActive={false}>
//             <Cell fill={color} />
//             <Cell fill={`${color}33`} />
//           </Pie>
//         </PieChart>
//       </ResponsiveContainer>
//       {!hideText && <span className="absolute text-[10px] font-bold text-slate-700">{value}%</span>}
//     </div>
//   );
// };

// interface DepartmentRow {
//   name: string;
//   code: string;
//   branchId: string;
//   departmentType: string;
//   businessUnit: string;
//   isActive: string;
//   hodEmployeeId: string;
//   reportingToId: string;
//   effectiveDate: string;
//   description: string;
//   keyResponsibilities: string;
//   employeeCapacity: string;
//   location: string;
//   costCenter: string;
//   probationPeriod: string;
//   departmentEmail: string;
//   budgetOwner: string;
//   assistantCoHead: string;
//   workingDays: string;
//   defaultShift: string;
//   departmentKeywords: string;
//   budgetStr: string;
// }

// const departmentColumns: ColumnConfig<DepartmentRow>[] = [
//   { key: 'name', label: 'Department Name', required: true, unique: true, sampleValue: 'Design Studio' },
//   { key: 'code', label: 'Department Code', required: true, unique: true, sampleValue: 'DS' },
//   { key: 'branchId', label: 'Parent Department', sampleValue: 'Business Operations' },
//   { key: 'departmentType', label: 'Department Type', required: true, sampleValue: 'Core Department' },
//   { key: 'businessUnit', label: 'Business Unit', required: true, sampleValue: 'Retail Interiors & Exhibition' },
//   { key: 'isActive', label: 'Status', required: true, sampleValue: 'Active', validate: (v) => (['active', 'inactive'].includes(String(v).toLowerCase()) ? null : 'Status must be Active or Inactive') },
//   { key: 'hodEmployeeId', label: 'Department Head (HOD)', required: true, sampleValue: 'EMP1023' },
//   { key: 'reportingToId', label: 'Reporting To', required: true, sampleValue: 'EMP1001' },
//   { key: 'effectiveDate', label: 'Effective Date', required: true, sampleValue: '2026-01-01' },
//   { key: 'description', label: 'Department Purpose', required: true, sampleValue: 'Handles design and creative operations' },
//   { key: 'keyResponsibilities', label: 'Key Responsibilities', required: true, sampleValue: 'Design, Creative direction, Client handling' },
//   { key: 'employeeCapacity', label: 'Employee Capacity', required: true, sampleValue: '50', validate: (v) => (isNaN(Number(v)) ? 'Employee Capacity must be a number' : null) },
//   { key: 'location', label: 'Location', required: true, sampleValue: 'Noida - Head Office' },
//   { key: 'costCenter', label: 'Cost Center', required: true, sampleValue: 'CC-DS-1001' },
//   { key: 'probationPeriod', label: 'Probation Period (Months)', sampleValue: '3' },
//   { key: 'departmentEmail', label: 'Department Email', sampleValue: 'designstudio@designhouse.co.in' },
//   { key: 'budgetOwner', label: 'Budget Owner', sampleValue: 'EMP1050' },
//   { key: 'assistantCoHead', label: 'Assistant / Co-Head', sampleValue: 'EMP1040' },
//   { key: 'workingDays', label: 'Working Days', sampleValue: 'Monday - Saturday' },
//   { key: 'defaultShift', label: 'Default Shift', sampleValue: 'General Shift (09:30 AM - 06:30 PM)' },
//   { key: 'departmentKeywords', label: 'Department Keywords', sampleValue: 'Design, Creative, Interior' },
//   { key: 'budgetStr', label: 'Budget (FY 25-26)', required: true, sampleValue: '₹ 1.5 Cr' },
// ];

// export default function DepartmentsPage() {
//   const [activeLeftTab, setActiveLeftTab] = useState('Department List');
//   const [activeRightTab, setActiveRightTab] = useState('Overview');
//   const [departments, setDepartments] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showImportModal, setShowImportModal] = useState(false);

//   useEffect(() => {
//     fetchDepartments();
//   }, []);

//   const fetchDepartments = async () => {
//     try {
//       setLoading(true);
//       const data = await getDepartments();
//       setDepartments(data);
//     } catch (error) {
//       console.error('Failed to fetch departments:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (confirm('Are you sure you want to delete this department?')) {
//       try {
//         await deleteDepartment(id);
//         fetchDepartments();
//       } catch (error) {
//         console.error('Failed to delete department:', error);
//       }
//     }
//   };

//   const handleImportDepartments = async (rows: DepartmentRow[]) => {
//     await Promise.all(
//       rows.map((row) =>
//         fetch('/api/departments/bulk-import-row', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             name: row.name,
//             code: row.code,
//             branchId: row.branchId,
//             departmentType: row.departmentType,
//             businessUnit: row.businessUnit,
//             isActive: row.isActive?.toLowerCase() === 'active',
//             hodEmployeeId: row.hodEmployeeId,
//             reportingToId: row.reportingToId,
//             effectiveDate: row.effectiveDate,
//             description: row.description,
//             keyResponsibilities: row.keyResponsibilities,
//             employeeCapacity: row.employeeCapacity,
//             location: row.location,
//             costCenter: row.costCenter,
//             probationPeriod: row.probationPeriod,
//             departmentEmail: row.departmentEmail,
//             budgetOwner: row.budgetOwner,
//             assistantCoHead: row.assistantCoHead,
//             workingDays: row.workingDays,
//             defaultShift: row.defaultShift,
//             departmentKeywords: row.departmentKeywords,
//             budgetStr: row.budgetStr,
//           }),
//         })
//       )
//     );
//     await fetchDepartments();
//   };

//   return (
//     <div className="flex flex-col gap-2 animate-in fade-in duration-300 p-2 w-full font-sans text-slate-800">

//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
//         <div>
//         <Breadcrumb
//       items={[
//         { label: "Organization Setup", href: "/dashboard" },
//         { label: "Departments" },
//       ]}
//     />
//           <h1 className="text-xl font-bold text-slate-900 mb-1">Departments</h1>
//           <p className="text-[11px] text-slate-500">Manage, organize and track all departments across the organization.</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => setShowImportModal(true)}
//             className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] font-medium hover:bg-slate-50 transition-colors shadow-sm text-slate-700"
//           >
//             <Upload className="w-4 h-4" /> Import
//           </button>
//           <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] font-medium hover:bg-slate-50 transition-colors shadow-sm text-slate-700">
//             <Download className="w-4 h-4" /> Export
//           </button>
//           <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-md text-[11px] font-medium hover:bg-indigo-100 transition-colors relative">
//             <span className="absolute -top-2.5 -right-2 bg-purple-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">New</span>
//             <Sparkles className="w-4 h-4" /> AI Insights
//           </button>
//           <div className="flex items-center rounded-md overflow-hidden shadow-sm h-8 ml-2">
//             <Link href="/dashboard/departments/add-department/basic-info" className="flex items-center gap-2 px-2 h-full bg-blue-600 text-white text-[11px] font-medium hover:bg-blue-700 transition-colors">
//               <Plus className="w-4 h-4" /> Add Department
//             </Link>
//             <button className="px-2 h-full bg-blue-700 text-white hover:bg-blue-800 transition-colors border-l border-blue-500 flex items-center justify-center">
//               <ChevronDown className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 mb-1">
//         {topCards.map((card, idx) => (
//           <Card key={idx} className="p-2.5 flex flex-col justify-between bg-white border border-slate-200 shadow-sm rounded-lg min-h-[110px]">
//             <div className="flex items-start gap-2 mb-2">
//               {card.isPie ? (
//                 <div className="w-10 h-10 shrink-0 -mt-1"><CircularProgress value={parseInt(card.value)} color={card.color} hideText /></div>
//               ) : (
//                 <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
//                   {card.title.includes('DEPARTMENT') && !card.title.includes('HEADS') ? <Building className="w-5 h-5" /> : card.title.includes('EMPLOYEE') ? <Users className="w-5 h-5" /> : card.title.includes('HEADS') ? <User className="w-5 h-5" /> : <PieChartIcon className="w-5 h-5" />}
//                 </div>
//               )}
//               <div className="flex flex-col pt-0.5">
//                 <h3 className="text-[9px] font-bold text-slate-600 uppercase tracking-wider mb-0.5">{card.title}</h3>
//                 <span className="text-md font-bold text-slate-900 leading-none">{card.value}</span>
//                 <p className="text-[10px] text-slate-500 mt-1 leading-tight">{card.subtitle}</p>
//               </div>
//             </div>
//             <div className="flex items-end justify-between mt-auto">
//               <a href="#" className="text-[10px] font-bold text-blue-700 hover:underline">{card.linkText}</a>
//               {card.isChart && (
//                 <div className="w-[70px]">
//                   <MicroLineChart color={card.color} />
//                 </div>
//               )}
//             </div>
//           </Card>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 xl:grid-cols-10 gap-2 items-start">

//         <div className="xl:col-span-7 flex flex-col gap-1 min-w-0">
//           <Card className="bg-white border border-slate-100 shadow-sm rounded-lg overflow-hidden flex flex-col">

//             <div className="flex items-center justify-between border-b border-slate-100 pl-2 pr-3 w-full">
//               <div className="flex items-center gap-3">
//                 {['Department List', 'Hierarchy View', 'Analytics', 'Budget Overview'].map(tab => (
//                   <button
//                     key={tab}
//                     onClick={() => setActiveLeftTab(tab)}
//                     className={`whitespace-nowrap py-2.5 text-[11px] font-semibold border-b-[3px] transition-colors flex items-center gap-2 ${activeLeftTab === tab ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-600 hover:text-slate-800'}`}
//                   >
//                     {tab === 'Hierarchy View' && <Users className="w-4 h-4 text-slate-500" />}
//                     {tab === 'Analytics' && <TrendingUp className="w-4 h-4 text-slate-500" />}
//                     {tab === 'Budget Overview' && <PieChartIcon className="w-4 h-4 text-slate-500" />}
//                     {tab}
//                   </button>
//                 ))}
//               </div>
//               <div className="flex items-center gap-2 shrink-0">
//                 <div className="relative">
//                   <FormInput variant="search" type="text" placeholder="Search departments..." className="w-36 pl-3 pr-7" />
//                   <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
//                 </div>
//                 <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-md text-[11px] font-medium text-slate-600 hover:bg-slate-50 transition-colors">
//                   <Filter className="w-3.5 h-3.5" /> Filters
//                 </button>
//                 <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-md text-[11px] font-medium text-slate-600 hover:bg-slate-50 transition-colors">
//                   Active Only <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
//                 </button>
//                 <button className="flex flex-col items-center justify-center w-12 py-1 border border-slate-200 rounded-md text-blue-500 hover:bg-blue-50 transition-colors">
//                   <RotateCcw className="w-3 h-3 mb-0.5" />
//                   <span className="text-[9px] font-bold">Reset</span>
//                 </button>
//               </div>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full text-left border-collapse table-fixed">
//                 <colgroup>
//                   <col style={{width:'22%'}} />
//                   <col style={{width:'7%'}} />
//                   <col style={{width:'20%'}} />
//                   <col style={{width:'13%'}} />
//                   <col style={{width:'18%'}} />
//                   <col style={{width:'10%'}} />
//                   <col style={{width:'10%'}} />
//                 </colgroup>
//                 <thead>
//                   <tr className="border-b border-slate-100">
//                     <th className="py-1.5 px-2 text-[10px] text-align-center font-semibold text-slate-500 uppercase tracking-wider">Department</th>
//                     <th className="py-1.5 px-2 text-[10px] text-align-center font-semibold text-slate-500 uppercase tracking-wider">Code</th>
//                     <th className="py-1.5 px-2 text-[10px] text-align-center font-semibold text-slate-500 uppercase tracking-wider">Department Head</th>
//                     <th className="py-1.5 px-2 text-[10px] text-align-center font-semibold text-slate-500 uppercase tracking-wider leading-tight">Employees <span className="block text-[9px] text-slate-400 font-normal normal-case tracking-normal">Count</span></th>
//                     <th className="py-1.5 px-2 text-[10px] text-align-center font-semibold text-slate-500 uppercase tracking-wider leading-tight">Budget(FY 25-26) <span className="block text-[9px] text-slate-400 font-normal normal-case tracking-normal">Utilization</span></th>
//                     <th className="py-1.5 px-2 text-[10px] text-align-center font-semibold text-slate-500 uppercase tracking-wider">Status</th>
//                     <th className="py-1.5 px-2 text-[10px] text-align-center font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="text-[11px]">
//                   {loading ? (
//                     <tr><td colSpan={7} className="text-center py-4 text-slate-500">Loading departments...</td></tr>
//                   ) : departments.length === 0 ? (
//                     <tr><td colSpan={7} className="text-center py-4 text-slate-500">No departments found.</td></tr>
//                   ) : departments.map((dept, i) => (
//                     <tr key={dept._id || i} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors group ${i === 0 ? 'bg-blue-50/20' : ''}`}>
//                       <td className="py-2 px-2 align-middle">
//                         <span className="font-semibold text-slate-800 truncate block">{dept.name}</span>
//                       </td>
//                       <td className="py-2 px-2 align-middle font-semibold text-slate-600 text-[10.5px]">{dept.code}</td>
//                       <td className="py-2 px-2 align-middle">
//                         <div className="flex items-center gap-2">
//                           <img src={`https://i.pravatar.cc/150?u=${dept._id || dept.id}`} alt={dept.headName || 'User'} className="w-6 h-6 rounded-full border border-slate-200 shrink-0" />
//                           <div className="min-w-0">
//                             <p className="font-semibold text-slate-800 text-[11px] truncate">{dept.hodEmployeeId || 'Aman Malhotra'}</p>
//                             <p className="text-[10px] text-slate-400 truncate">Design Director</p>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="py-2 px-2 align-middle">
//                         <span className="font-semibold text-slate-800 block">{dept.employeeCapacity || dept.empTotal || 0}</span>
//                         <div className="flex items-center gap-1.5 text-[10px] font-medium mt-0.5">
//                           <span className="text-blue-600 flex items-center gap-0.5"><Users className="w-3 h-3" /> {dept.empManager || 0}</span>
//                           <span className="text-rose-500 flex items-center gap-0.5"><Users className="w-3 h-3" /> {dept.empSupport || 0}</span>
//                         </div>
//                       </td>
//                       <td className="py-2 px-2 align-middle">
//                         <div className="flex items-center justify-between text-[10px] mb-1">
//                           <span className="font-semibold text-slate-800">{dept.budgetStr || '₹ 0'}</span>
//                           <span className="font-semibold text-slate-500">{dept.util || 0}%</span>
//                         </div>
//                         <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
//                           <div className="h-full bg-blue-600 rounded-full" style={{ width: `${dept.util || 0}%` }} />
//                         </div>
//                       </td>
//                       <td className="py-2 px-2 align-middle">
//                         <span className={`inline-flex items-center px-2 py-0.5 rounded-md ${dept.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'} text-[10px] font-bold uppercase tracking-wider border`}>
//                           {dept.isActive ? 'Active' : 'Inactive'}
//                         </span>
//                       </td>
//                       <td className="py-2 px-2 align-middle">
//                         <div className="flex items-center justify-center gap-0.5">
//                           <Link href={`/dashboard/departments/${dept._id || dept.id}`} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors block"><Eye className="w-3 h-3" /></Link>
//                           <Link href={`/dashboard/departments/add-department/init/${dept._id || dept.id}`} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors block"><Edit2 className="w-3 h-3" /></Link>
//                           <button onClick={() => handleDelete(dept._id || dept.id?.toString())} className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"><Trash2 className="w-3 h-3" /></button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div className="mt-auto border-t border-slate-100 p-2 flex items-center justify-between text-[11px] text-slate-500 bg-white">
//               <div className="flex-1">Showing 1 to 10 of 10 departments</div>
//               <div className="flex-1 flex justify-center items-center gap-1">
//                 <button className="p-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-400"><ChevronLeft className="w-4 h-4" /></button>
//                 <button className="w-7 h-7 flex items-center justify-center border border-blue-600 bg-blue-600 text-white rounded-md font-medium text-[11px]">1</button>
//                 <button className="p-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-400"><ChevronRight className="w-4 h-4" /></button>
//               </div>
//               <div className="flex-1 flex justify-end">
//                 <div className="relative">
//                   <select className="appearance-none border border-slate-200 bg-white pl-3 pr-8 py-1.5 rounded-md cursor-pointer hover:bg-slate-50 transition-colors font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-[11px]">
//                     <option value="10">10 per page</option>
//                     <option value="20">20 per page</option>
//                     <option value="50">50 per page</option>
//                   </select>
//                   <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
//                 </div>
//               </div>
//             </div>
//           </Card>
//         </div>

//         <div className="xl:col-span-3 min-w-0">
//           <Card className="bg-white border border-slate-100 shadow-sm rounded-lg flex flex-col">

//             <div className="p-3 pb-2 relative">
//               <button className="absolute top-4 right-2 text-slate-400 hover:text-slate-600 transition-colors"><X className="w-4 h-4" /></button>
//               <div className="flex items-start gap-3">
//                 <div className="w-12 h-12 rounded-2xl bg-blue-100 border-4 border-blue-50 flex items-center justify-center shrink-0 shadow-sm relative">
//                   <div className="absolute inset-0 bg-blue-600 rounded-xl m-0.5 flex items-center justify-center text-white"><Edit2 className="w-4 h-4" /></div>
//                 </div>
//                 <div className="pt-0.5">
//                   <h2 className="text-[14px] font-bold text-slate-900 leading-tight mb-1">Design Studio</h2>
//                   <span className="inline-flex items-center px-2 py-0.5 rounded text-emerald-600 bg-emerald-50 text-[10px] font-bold tracking-wide mb-1.5 border border-emerald-100/50">Active</span>
//                   <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
//                     <span>DS</span>
//                     <span className="w-0.5 h-0.5 bg-slate-400 rounded-full" />
//                     <span>Core Function</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center border-b border-slate-100 px-3">
//               {['Overview', 'Employees', 'Budget', 'Documents'].map(tab => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveRightTab(tab)}
//                   className={`flex-1 text-center py-1.5 text-[10px] font-bold border-b-[3px] transition-colors ${activeRightTab === tab ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>

//             <div className="p-3 pb-3 border-b border-slate-100">
//               <div className="grid grid-cols-[125px_1fr] gap-y-2.5 gap-x-2 text-[10.5px]">

//                 <div className="flex items-center gap-2 text-slate-500 font-medium"><Users className="w-4 h-4" /> Department Head</div>
//                 <div className="flex items-center gap-3">
//                   <img src="https://i.pravatar.cc/150?u=1" alt="Aman" className="w-7 h-7 rounded-full object-cover border border-slate-200" />
//                   <div className="leading-tight">
//                     <p className="font-bold text-slate-900 text-[11px]">Aman Malhotra</p>
//                     <p className="text-[10px] text-slate-500 font-medium">Design Director</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2 text-slate-500 font-medium"><User className="w-4 h-4" /> Parent Department</div>
//                 <div className="font-bold text-slate-800">-</div>

//                 <div className="flex items-center gap-2 text-slate-500 font-medium"><Building className="w-4 h-4" /> Business Unit</div>
//                 <div className="font-bold text-slate-800">Design & Creative</div>

//                 <div className="flex items-center gap-2 text-slate-500 font-medium"><PieChartIcon className="w-4 h-4" /> Cost Center</div>
//                 <div className="font-bold text-slate-800">CC-DS-1001</div>

//                 <div className="flex items-center gap-2 text-slate-500 font-medium"><Filter className="w-4 h-4" /> Location</div>
//                 <div className="font-bold text-slate-800">Noida – Head Office</div>

//                 <div className="flex items-center gap-2 text-slate-500 font-medium"><Clock className="w-4 h-4" /> Established On</div>
//                 <div className="font-bold text-slate-800">12 Jan 2024</div>

//                 <div className="flex items-center gap-2 text-slate-500 font-medium"><Users className="w-4 h-4" /> Employee Capacity</div>
//                 <div className="font-bold text-slate-800">60</div>

//                 <div className="flex items-center gap-2 text-slate-500 font-medium"><Upload className="w-4 h-4" /> Email</div>
//                 <div className="font-semibold text-blue-600 hover:underline cursor-pointer">design@house.co.in</div>

//                 <div className="flex items-start gap-2 text-slate-500 font-medium"><Edit2 className="w-4 h-4" /> Description</div>
//                 <div className="text-slate-700 font-medium leading-relaxed text-[10px]">Responsible for conceptualization, space planning, 3D design and creative development for all projects and client requirements.</div>
//               </div>
//             </div>

//             <div className="p-4 border-b border-slate-100">
//               <h3 className="text-[11.5px] font-bold text-slate-800 mb-4">Department Composition</h3>
//               <div className="flex items-center gap-8">
//                 <div className="w-20 h-20 shrink-0">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie data={compositionData} innerRadius="55%" outerRadius="100%" dataKey="value" stroke="none">
//                         {compositionData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
//                       </Pie>
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//                 <div className="flex flex-col gap-3 flex-1">
//                   {compositionData.map((item, i) => (
//                     <div key={i} className="flex items-center justify-between text-[11px]">
//                       <div className="flex items-center gap-3">
//                         <div className="w-2.5 h-2.5 rounded-[3px]" style={{ backgroundColor: item.color }} />
//                         <span className="text-slate-700 font-semibold">{item.name}</span>
//                       </div>
//                       <div className="text-slate-700 font-medium">
//                         {item.value} <span className="text-slate-500 font-normal ml-1">({item.percent})</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="p-3 pb-3">
//               <h3 className="text-[11px] font-bold text-slate-800 mb-2.5">Recent Activity</h3>
//               <div className="flex flex-col gap-2.5">
//                 {activities.map((act) => (
//                   <div key={act.id} className="flex gap-3">
//                     <div className="w-7 h-7 rounded bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 text-slate-500">
//                       {act.id === 1 ? <PieChartIcon className="w-4 h-4" /> : act.id === 2 ? <User className="w-4 h-4" /> : <Building className="w-4 h-4" />}
//                     </div>
//                     <div className="leading-tight flex-1 flex justify-between items-start pt-0.5">
//                       <div>
//                         <p className="text-[11px] font-bold text-slate-800 mb-1">{act.text}</p>
//                         <p className="text-[10px] text-slate-500 font-medium">by <span className="text-slate-400">{act.by}</span></p>
//                       </div>
//                       <span className="text-[10px] font-semibold text-slate-500">{act.time}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <button className="mt-3 text-[11px] font-bold text-blue-600 hover:underline flex items-center justify-center w-full gap-1">
//                 View all activity <ChevronRight className="w-3.5 h-3.5" />
//               </button>
//             </div>
//           </Card>
//         </div>


//       </div>

//       <BulkUploadModal<DepartmentRow>
//         open={showImportModal}
//         onClose={() => setShowImportModal(false)}
//         title="Upload Department Data"
//         description="Upload an Excel file to import departments in bulk."
//         sampleFileName="Department_Example.xlsx"
//         columns={departmentColumns}
//         existingData={departments}
//         onImport={handleImportDepartments}
//       />

//       <style dangerouslySetInnerHTML={{
//         __html: `
//         .custom-scrollbar::-webkit-scrollbar { width: 5px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 5px; }
//         .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
//       `}} />
//     </div>
//   );
// }

'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import {
    Plus, Upload, Search, ChevronDown, Check, Calendar, ChevronLeft, ChevronRight,
    Eye, Download, MoreVertical, Wallet, CheckCircle2, Clock, XCircle, Receipt,
    FileText, Upload as UploadIcon, BarChart2, Wallet as WalletIcon, ClipboardList
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import api from '@/lib/axios';

// ---- DUMMY / MOCK DATA (used as fallback when the API is unavailable) ----
const MOCK_EXPENSES = [
    {
        _id: 'exp1',
        title: 'Client Meeting - Travel',
        note: 'Taxi fare to client site',
        category: 'Travel',
        vendor: 'Uber',
        department: 'Business Development',
        date: '2025-05-29',
        amount: 1250,
        status: 'Approved',
        statusDate: '2025-05-29',
        submittedBy: { firstName: 'Rahul', lastName: 'Nair', designation: 'Manager', avatarUrl: 'https://i.pravatar.cc/150?u=exp1' },
    },
    {
        _id: 'exp2',
        title: 'Office Supplies Purchase',
        note: 'Stationery for office use',
        category: 'Office Supplies',
        vendor: 'Vardhman Stationers',
        department: 'Administration',
        date: '2025-05-28',
        amount: 2850,
        status: 'Pending',
        statusDate: null,
        submittedBy: { firstName: 'Neha', lastName: 'Joshi', designation: 'Executive', avatarUrl: 'https://i.pravatar.cc/150?u=exp2' },
    },
    {
        _id: 'exp3',
        title: 'Team Lunch',
        note: 'Team lunch with client',
        category: 'Entertainment',
        vendor: 'Barbeque Nation',
        department: 'Business Development',
        date: '2025-05-27',
        amount: 5750,
        status: 'Approved',
        statusDate: '2025-05-28',
        submittedBy: { firstName: 'Amit', lastName: 'Verma', designation: 'Manager', avatarUrl: 'https://i.pravatar.cc/150?u=exp3' },
    },
    {
        _id: 'exp4',
        title: 'Printer Cartridge',
        note: 'HP 88A Toner Cartridge',
        category: 'Office Supplies',
        vendor: 'Amazon India',
        department: 'IT',
        date: '2025-05-26',
        amount: 1650,
        status: 'Rejected',
        statusDate: '2025-05-27',
        submittedBy: { firstName: 'Sandeep', lastName: 'Singh', designation: 'Executive', avatarUrl: 'https://i.pravatar.cc/150?u=exp4' },
    },
    {
        _id: 'exp5',
        title: 'Hotel Booking',
        note: 'Outstation client visit',
        category: 'Travel',
        vendor: 'MakeMyTrip',
        department: 'Business Development',
        date: '2025-05-25',
        amount: 9200,
        status: 'Approved',
        statusDate: '2025-05-26',
        submittedBy: { firstName: 'Rahul', lastName: 'Nair', designation: 'Manager', avatarUrl: 'https://i.pravatar.cc/150?u=exp5' },
    },
];

const MOCK_TOTAL_ENTRIES = 58;

const expenseByCategory = [
    { name: 'Travel', value: 325450, percent: '37.1%', color: '#3b82f6' },
    { name: 'Office Supplies', value: 215800, percent: '24.6%', color: '#d946ef' },
    { name: 'Entertainment', value: 145600, percent: '16.6%', color: '#10b981' },
    { name: 'Utilities', value: 105200, percent: '12.0%', color: '#f59e0b' },
    { name: 'Others', value: 83400, percent: '9.7%', color: '#f43f5e' },
];

const monthlyTrend = [
    { month: 'Jan', amount: 320000 },
    { month: 'Feb', amount: 480000 },
    { month: 'Mar', amount: 620000 },
    { month: 'Apr', amount: 400000 },
    { month: 'May', amount: 950000 },
    { month: 'Jun', amount: 875450 },
];

const topExpenses = [
    { title: 'Hotel Booking', amount: 145000 },
    { title: 'Team Lunch', amount: 125750 },
    { title: 'Client Entertainment', amount: 98300 },
    { title: 'Outstation Travel', amount: 85400 },
    { title: 'Office Supplies', amount: 76200 },
];
const quickActions = [
    { label: 'New Expense', icon: Plus, href: '/dashboard/departments/INT-DSN/expense-tracking/add' },
    { label: 'Upload Bulk Expenses', icon: UploadIcon },
    { label: 'Expense Reports', icon: FileText },
    { label: 'Budget vs Actual', icon: BarChart2 },
    { label: 'My Expenses', icon: WalletIcon },
];
// ---------------------------------------------------------------------------

const formatCurrency = (amount: number) => {
    return `₹ ${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount)}`;
};

const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/');
};

export default function ExpenseTrackingPage() {
    const filterRef = useRef<HTMLDivElement>(null);

    const [expensesData, setExpensesData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [categoryFilter, setCategoryFilter] = useState('All Categories');
    const [departmentFilter, setDepartmentFilter] = useState('All Departments');
    const [dateRange, setDateRange] = useState('01/06/2025 - 30/06/2025');

    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isDeptOpen, setIsDeptOpen] = useState(false);

    const [appliedFilters, setAppliedFilters] = useState({
        search: '',
        status: 'All Status',
        category: 'All Categories',
        department: 'All Departments',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await api.get('/expenses');
                const data = response.data.data || [];
                setExpensesData(data.length > 0 ? data : MOCK_EXPENSES);
            } catch (error) {
                console.error('Error fetching expenses:', error);
                toast.error('Failed to load expenses, showing sample data');
                setExpensesData(MOCK_EXPENSES);
            } finally {
                setIsLoading(false);
            }
        };
        fetchExpenses();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsStatusOpen(false);
                setIsCategoryOpen(false);
                setIsDeptOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Derived stats
    const totalExpenses = expensesData.reduce((acc, e) => acc + (e.amount || 0), 0);
    const approvedAmount = expensesData.filter((e) => e.status === 'Approved').reduce((acc, e) => acc + (e.amount || 0), 0);
    const pendingAmount = expensesData.filter((e) => e.status === 'Pending').reduce((acc, e) => acc + (e.amount || 0), 0);
    const rejectedAmount = expensesData.filter((e) => e.status === 'Rejected').reduce((acc, e) => acc + (e.amount || 0), 0);
    const approvedPct = totalExpenses > 0 ? ((approvedAmount / totalExpenses) * 100).toFixed(2) : '0.00';
    const pendingPct = totalExpenses > 0 ? ((pendingAmount / totalExpenses) * 100).toFixed(2) : '0.00';
    const rejectedPct = totalExpenses > 0 ? ((rejectedAmount / totalExpenses) * 100).toFixed(2) : '0.00';

    const topCards = [
        { title: 'Total Expenses (This Month)', value: formatCurrency(totalExpenses), subtitle: '▲ 12.4% vs last month', subtitleColor: 'text-emerald-600', icon: Wallet, bg: 'bg-blue-50', text: 'text-blue-600' },
        { title: 'Approved Amount', value: formatCurrency(approvedAmount), subtitle: `${approvedPct}% of total`, subtitleColor: 'text-zinc-400', icon: CheckCircle2, bg: 'bg-emerald-50', text: 'text-emerald-600' },
        { title: 'Pending Approval', value: formatCurrency(pendingAmount), subtitle: `${pendingPct}% of total`, subtitleColor: 'text-amber-600', icon: Clock, bg: 'bg-amber-50', text: 'text-amber-600' },
        { title: 'Rejected Amount', value: formatCurrency(rejectedAmount), subtitle: `${rejectedPct}% of total`, subtitleColor: 'text-rose-600', icon: XCircle, bg: 'bg-rose-50', text: 'text-rose-600' },
        { title: 'Total Transactions', value: MOCK_TOTAL_ENTRIES.toString(), subtitle: 'This Month', subtitleColor: 'text-zinc-400', icon: Receipt, bg: 'bg-purple-50', text: 'text-purple-600' },
    ];

    const mappedExpenses = expensesData.map((e) => ({
        id: e._id,
        title: e.title || '-',
        note: e.note || '',
        category: e.category || '-',
        vendor: e.vendor || '-',
        department: e.department || '-',
        date: e.date,
        amount: e.amount || 0,
        status: e.status || 'Pending',
        statusDate: e.statusDate,
        submittedByName: e.submittedBy ? `${e.submittedBy.firstName} ${e.submittedBy.lastName}` : 'Unassigned',
        submittedByRole: e.submittedBy?.designation || '-',
        submittedByAvatar: e.submittedBy?.avatarUrl || `https://i.pravatar.cc/150?u=${e._id}`,
    }));

    const statusOptions = ['All Status', ...Array.from(new Set(mappedExpenses.map((e) => e.status)))];
    const categoryOptions = ['All Categories', ...Array.from(new Set(mappedExpenses.map((e) => e.category)))];
    const departmentOptions = ['All Departments', ...Array.from(new Set(mappedExpenses.map((e) => e.department)))];

    let processedExpenses = mappedExpenses.filter((e) => {
        let isValid = true;

        if (appliedFilters.search.trim()) {
            const q = appliedFilters.search.toLowerCase();
            const matchesGlobal =
                e.title.toLowerCase().includes(q) ||
                e.category.toLowerCase().includes(q) ||
                e.vendor.toLowerCase().includes(q);
            if (!matchesGlobal) isValid = false;
        }

        if (appliedFilters.status !== 'All Status' && e.status !== appliedFilters.status) isValid = false;
        if (appliedFilters.category !== 'All Categories' && e.category !== appliedFilters.category) isValid = false;
        if (appliedFilters.department !== 'All Departments' && e.department !== appliedFilters.department) isValid = false;

        return isValid;
    });

    const handleApply = () => {
        setAppliedFilters({
            search: searchQuery,
            status: statusFilter,
            category: categoryFilter,
            department: departmentFilter,
        });
        setCurrentPage(1);
    };

    const handleClear = () => {
        setSearchQuery('');
        setStatusFilter('All Status');
        setCategoryFilter('All Categories');
        setDepartmentFilter('All Departments');
        setAppliedFilters({ search: '', status: 'All Status', category: 'All Categories', department: 'All Departments' });
        setCurrentPage(1);
    };

    const totalPages = Math.max(1, Math.ceil(MOCK_TOTAL_ENTRIES / rowsPerPage));
    const paginatedExpenses = processedExpenses.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const statusStyles: Record<string, string> = {
        Approved: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        Pending: 'bg-amber-50 text-amber-600 border-amber-100',
        Rejected: 'bg-rose-50 text-rose-600 border-rose-100',
    };

    return (
        <div className="flex flex-col gap-2 animate-in fade-in duration-300 p-2 w-full font-sans text-zinc-800 bg-[#f8f9fc] min-h-screen">

            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                <div>
                    <h1 className="text-xl font-bold text-zinc-900 mb-0.5">Expense Tracking</h1>
                    <p className="text-[12px] text-zinc-500">Track, manage and analyze all business expenses in one place.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 h-9 px-3 bg-white border border-zinc-200 rounded-md text-[12px] font-semibold hover:bg-zinc-50 transition-colors shadow-sm text-zinc-700">
                        <Plus className="w-4 h-4" /> New Expense
                    </button>
                    <button className="flex items-center gap-1.5 h-9 px-3 bg-indigo-600 text-white rounded-md text-[12px] font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
                        <Upload className="w-4 h-4" /> Upload Receipt
                    </button>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 mb-1">
                {topCards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <div key={idx} className="p-2 flex items-center gap-3 bg-white border border-zinc-200 shadow-sm rounded-md">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${card.bg} ${card.text}`}>
                                <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-[10px] font-medium text-zinc-500 whitespace-nowrap">{card.title}</h3>
                                <span className="text-md font-bold text-zinc-900 leading-tight mt-0.5 whitespace-nowrap">{card.value}</span>
                                <p className={`text-[10px] font-semibold mt-0.5 ${card.subtitleColor}`}>{card.subtitle}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* FILTER BAR */}
            <div ref={filterRef} className="bg-white border border-zinc-200 shadow-sm rounded-md p-2 flex flex-wrap items-stretch md:items-center gap-2">
                <div className="relative flex-1 min-w-[180px]">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search by title, category, vendor..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleApply(); }}
                        className="pl-8 pr-3 h-9 w-full bg-white border border-zinc-200 rounded-md text-[12px] focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-zinc-400"
                    />
                </div>

                {/* All Status */}
                <div className="relative shrink-0">
                    <button
                        onClick={() => { setIsStatusOpen(!isStatusOpen); setIsCategoryOpen(false); setIsDeptOpen(false); }}
                        className="flex items-center justify-between gap-1.5 h-9 px-3 w-full md:w-32 border border-zinc-200 rounded-md text-[12px] font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                    >
                        {statusFilter} <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                    </button>
                    {isStatusOpen && (
                        <div className="absolute left-0 top-full mt-1 w-36 bg-white border border-zinc-200 shadow-lg rounded-md py-1 z-50 max-h-56 overflow-y-auto">
                            {statusOptions.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => { setStatusFilter(opt); setIsStatusOpen(false); }}
                                    className="w-full flex items-center justify-between px-2 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50"
                                >
                                    {opt} {statusFilter === opt && <Check className="w-3 h-3 text-indigo-600" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Date Range */}
                <div className="relative shrink-0">
                    <button className="flex items-center justify-between gap-2 h-9 px-3 w-full md:w-52 border border-zinc-200 rounded-md text-[12px] font-medium text-zinc-700 hover:bg-zinc-50 transition-colors">
                        <span className="truncate">{dateRange}</span> <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    </button>
                </div>

                {/* All Categories */}
                <div className="relative shrink-0">
                    <button
                        onClick={() => { setIsCategoryOpen(!isCategoryOpen); setIsStatusOpen(false); setIsDeptOpen(false); }}
                        className="flex items-center justify-between gap-1.5 h-9 px-3 w-full md:w-40 border border-zinc-200 rounded-md text-[12px] font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                    >
                        <span className="truncate">{categoryFilter}</span> <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    </button>
                    {isCategoryOpen && (
                        <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-zinc-200 shadow-lg rounded-md py-1 z-50 max-h-56 overflow-y-auto">
                            {categoryOptions.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => { setCategoryFilter(opt); setIsCategoryOpen(false); }}
                                    className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50"
                                >
                                    <span className="truncate">{opt}</span> {categoryFilter === opt && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* All Departments */}
                <div className="relative shrink-0">
                    <button
                        onClick={() => { setIsDeptOpen(!isDeptOpen); setIsStatusOpen(false); setIsCategoryOpen(false); }}
                        className="flex items-center justify-between gap-1.5 h-9 px-3 w-full md:w-44 border border-zinc-200 rounded-md text-[12px] font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                    >
                        <span className="truncate">{departmentFilter}</span> <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    </button>
                    {isDeptOpen && (
                        <div className="absolute left-0 top-full mt-1 w-52 bg-white border border-zinc-200 shadow-lg rounded-md py-1 z-50 max-h-56 overflow-y-auto">
                            {departmentOptions.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => { setDepartmentFilter(opt); setIsDeptOpen(false); }}
                                    className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50"
                                >
                                    <span className="truncate">{opt}</span> {departmentFilter === opt && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={handleClear}
                        className="h-9 px-3.5 border border-zinc-200 rounded-md text-[12px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors whitespace-nowrap"
                    >
                        Clear
                    </button>
                    <button
                        onClick={handleApply}
                        className="h-9 px-3.5 bg-indigo-600 text-white rounded-md text-[12px] font-semibold hover:bg-indigo-700 transition-colors whitespace-nowrap"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white border border-zinc-200 shadow-sm rounded-md overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-200">
                                <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-500 whitespace-nowrap">#</th>
                                <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-500 whitespace-nowrap">Expense Title</th>
                                <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-500 whitespace-nowrap">Category</th>
                                <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-500 whitespace-nowrap">Vendor</th>
                                <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-500 whitespace-nowrap">Department</th>
                                <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-500 whitespace-nowrap">Date</th>
                                <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-500 whitespace-nowrap">Amount</th>
                                <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-500 whitespace-nowrap">Status</th>
                                <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-500 whitespace-nowrap">Submitted By</th>
                                <th className="py-2.5 px-3 text-[11px] font-semibold text-zinc-500 text-center whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-[12px]">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={10} className="py-8 text-center text-zinc-500 font-medium">
                                        Loading expenses...
                                    </td>
                                </tr>
                            ) : paginatedExpenses.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="py-8 text-center text-zinc-500 font-medium">
                                        No expenses found
                                    </td>
                                </tr>
                            ) : paginatedExpenses.map((e, idx) => (
                                <tr key={e.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                                    <td className="py-3 px-3 text-zinc-500 font-semibold align-top">{(currentPage - 1) * rowsPerPage + idx + 1}</td>
                                    <td className="py-3 px-3 align-top">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-zinc-800 text-[12px]">{e.title}</span>
                                            {e.note && <span className="text-[11px] text-zinc-400 mt-0.5">{e.note}</span>}
                                        </div>
                                    </td>
                                    <td className="py-3 px-3 align-top">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10.5px] font-semibold">{e.category}</span>
                                    </td>
                                    <td className="py-3 px-3 align-top text-zinc-700 font-medium">{e.vendor}</td>
                                    <td className="py-3 px-3 align-top text-zinc-700">{e.department}</td>
                                    <td className="py-3 px-3 align-top text-zinc-700">{formatDate(e.date)}</td>
                                    <td className="py-3 px-3 align-top font-bold text-zinc-800">{formatCurrency(e.amount)}</td>
                                    <td className="py-3 px-3 align-top">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-bold border ${statusStyles[e.status] || 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}>
                                            {e.status}
                                        </span>
                                        {e.statusDate && <p className="text-[10px] text-zinc-400 mt-1">{formatDate(e.statusDate)}</p>}
                                        {!e.statusDate && e.status === 'Pending' && <p className="text-[10px] text-zinc-400 mt-1">-</p>}
                                    </td>
                                    <td className="py-3 px-3 align-top">
                                        <div className="flex items-center gap-2">
                                            <img src={e.submittedByAvatar} alt={e.submittedByName} className="w-7 h-7 rounded-full border border-zinc-200 shrink-0" />
                                            <div className="leading-tight">
                                                <p className="font-semibold text-zinc-800 text-[11px] whitespace-nowrap">{e.submittedByName}</p>
                                                <p className="text-[10.5px] text-zinc-500">{e.submittedByRole}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3 align-top">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <button className="p-1.5 text-zinc-500 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors" title="View">
                                                <Eye className="w-3.5 h-3.5" />
                                            </button>
                                            <button className="p-1.5 text-zinc-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors" title="Download">
                                                <Download className="w-3.5 h-3.5" />
                                            </button>
                                            <button className="p-1.5 text-zinc-500 hover:bg-zinc-100 rounded-md transition-colors" title="More">
                                                <MoreVertical className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* TABLE FOOTER */}
                <div className="p-3 flex items-center justify-between text-[12px] text-zinc-500">
                    <div className="pl-1">
                        Showing {processedExpenses.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to{' '}
                        {Math.min(currentPage * rowsPerPage, processedExpenses.length)} of {MOCK_TOTAL_ENTRIES} entries
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-1.5 border border-zinc-200 rounded-md bg-white hover:bg-zinc-50 text-zinc-400 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        {[1, 2, 3].map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-7 h-7 flex items-center justify-center border rounded-md font-semibold ${
                                    currentPage === page
                                        ? 'border-indigo-600 bg-indigo-600 text-white'
                                        : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <span className="px-1 text-zinc-400">...</span>
                        <button
                            onClick={() => setCurrentPage(totalPages)}
                            className={`w-7 h-7 flex items-center justify-center border rounded-md font-semibold ${
                                currentPage === totalPages
                                    ? 'border-indigo-600 bg-indigo-600 text-white'
                                    : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                            }`}
                        >
                            {totalPages}
                        </button>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-1.5 border border-zinc-200 rounded-md bg-white hover:bg-zinc-50 text-zinc-400 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* BOTTOM GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 mt-1">

                {/* Expense by Category */}
                <div className="bg-white border border-zinc-200 shadow-sm rounded-md p-3 lg:col-span-3">
                    <h2 className="text-[11px] font-bold text-zinc-800 mb-3">Expense by Category</h2>
                    <div className="flex items-center gap-3">
                        <div className="w-16 h-16 xl:w-20 xl:h-20 shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={expenseByCategory}
                                        innerRadius="60%"
                                        outerRadius="100%"
                                        paddingAngle={2}
                                        dataKey="value"
                                        stroke="none"
                                        isAnimationActive={false}
                                    >
                                        {expenseByCategory.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                            {expenseByCategory.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-[11px]">
                                    <div className="flex items-center gap-1.5 min-w-0 pr-1">
                                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                        <span className="text-zinc-700 font-medium truncate">{item.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <span className="text-zinc-600 font-medium whitespace-nowrap">₹ {new Intl.NumberFormat('en-IN').format(item.value)}</span>
                                        <span className="text-zinc-400 whitespace-nowrap">({item.percent})</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Monthly Trend */}
                <div className="bg-white border border-zinc-200 shadow-sm rounded-md p-3 lg:col-span-3 overflow-hidden">
                    <h2 className="text-[11px] font-bold text-zinc-800 mb-2">Monthly Trend <span className="text-zinc-400 font-medium">(This Year)</span></h2>
                    <div className="h-40 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyTrend} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickMargin={8} />
                                <YAxis
                                    width={32}
                                    tickCount={6}
                                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(v) => v === 0 ? '₹ 0' : (v >= 100000 ? `${(v / 100000).toFixed(0)}L` : `${(v / 1000).toFixed(0)}K`)}
                                />
                                <Tooltip
                                    content={({ active, payload, label }) => {
                                        if (!active || !payload || !payload.length) return null;
                                        return (
                                            <div className="bg-white border border-zinc-200 rounded-md shadow-md px-2.5 py-1.5 text-[11px] leading-tight max-w-[140px]">
                                                <p className="font-bold text-zinc-800 mb-0.5">{label}</p>
                                                <p className="text-indigo-600 font-semibold whitespace-nowrap">
                                                    {formatCurrency(payload[0].value as number)}
                                                </p>
                                            </div>
                                        );
                                    }}
                                    wrapperStyle={{ zIndex: 20, pointerEvents: 'none' }}
                                    isAnimationActive={false}
                                />
                                <Line type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3, fill: '#4f46e5' }} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Expenses */}
                <div className="bg-white border border-zinc-200 shadow-sm rounded-xl p-3 lg:col-span-3">
                    <h2 className="text-[13px] font-bold text-zinc-800 mb-3">Top Expenses</h2>
                    <div className="flex flex-col gap-2.5 mb-3">
                        {topExpenses.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-[11.5px]">
                                <span className="text-zinc-700 font-medium">{item.title}</span>
                                <span className="text-zinc-800 font-bold">₹ {new Intl.NumberFormat('en-IN').format(item.amount)}</span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full h-8 bg-zinc-50 border border-zinc-200 rounded-md text-[11px] font-semibold text-zinc-600 hover:bg-zinc-100 transition-colors">
                        View All Reports
                    </button>
                </div>

                {/* Quick Actions */}
                <div className="bg-white border border-zinc-200 shadow-sm rounded-md p-3 lg:col-span-3">
                    <h2 className="text-[13px] font-bold text-zinc-800 mb-3">Quick Actions</h2>
                    <div className="flex flex-col gap-1">
                        {quickActions.map((action, idx) => {
                            const ActionIcon = action.icon;
                            if (action.href) {
                                return (
                                    <Link
                                        key={idx}
                                        href={action.href}
                                        className="flex items-center gap-2.5 px-2 py-1 rounded-md text-[11px] font-medium text-zinc-700 hover:bg-zinc-50 transition-colors text-left"
                                    >
                                        <ActionIcon className="w-4 h-4 text-indigo-500" /> {action.label}
                                    </Link>
                                );
                            }
                            return (
                                <button
                                    key={idx}
                                    className="flex items-center gap-2.5 px-2 py-1 rounded-md text-[11px] font-medium text-zinc-700 hover:bg-zinc-50 transition-colors text-left"
                                >
                                    <ActionIcon className="w-4 h-4 text-indigo-500" /> {action.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}