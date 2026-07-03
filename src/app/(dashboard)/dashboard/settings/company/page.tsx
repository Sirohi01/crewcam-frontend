'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, MapPin, ShieldCheck, Save, Loader2, Edit2, X, Map, Calendar, Coins, User, Mail, Phone, Globe } from 'lucide-react';
import api from '@/lib/axios';
import Image from 'next/image';
import Link from 'next/link';

export default function CompanyProfilePage() {
  const [profile, setProfile] = useState<any>({});
  const [branches, setBranches] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);
  const [counts, setCounts] = useState({ branches: 0, departments: 0, designations: 0, employees: 0 });
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState<any>({});
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingDocumentHeader, setUploadingDocumentHeader] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [profRes, brRes, deptRes, desigRes, empRes] = await Promise.all([
        api.get('/companies/profile').catch(() => ({ data: {} })),
        api.get('/companies/branches?limit=5').catch(() => ({ data: { data: [], meta: { total: 0 } } })),
        api.get('/companies/departments?limit=5').catch(() => ({ data: { data: [], meta: { total: 0 } } })),
        api.get('/companies/designations?limit=5').catch(() => ({ data: { data: [], meta: { total: 0 } } })),
        api.get('/employees?limit=1').catch(() => ({ data: { meta: { total: 0 } } }))
      ]);

      const profData = profRes.data || {};
      setProfile(profData);
      setFormData({
        legalName: '', tradeName: '', industry: '', companyType: '', website: '',
        email: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: 'India',
        timezone: 'Asia/Kolkata', baseCurrency: 'INR', financialYearStartMonth: 4,
        panNumber: '', gstin: '', cin: '', tan: '', epfoNumber: '', esicNumber: '', ptNumber: '', lwfNumber: '',
        tin: '', ein: '', vatNumber: '', businessLicenseNumber: '',
        ...profData,
        incorporationDate: profData.incorporationDate ? profData.incorporationDate.split('T')[0] : ''
      });

      setBranches(brRes.data?.data || []);
      setDepartments(deptRes.data?.data || []);
      setDesignations(desigRes.data?.data || []);
      setCounts({
        branches: brRes.data?.meta?.total || 0,
        departments: deptRes.data?.meta?.total || 0,
        designations: desigRes.data?.meta?.total || 0,
        employees: empRes.data?.meta?.total || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard', error);
    } finally {
      setLoading(false);
    }
  };

  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    try {
      const payload = { ...formData };
      if (!payload.incorporationDate) {
        delete payload.incorporationDate;
      }
      await api.put('/companies/profile', payload);
      setIsEditModalOpen(false);
      fetchDashboardData();
    } catch (error: any) {
      console.error('Save failed', error);
      setErrorMsg(error.response?.data?.message || error.message || 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    const form = new FormData();
    form.append('file', file);

    try {
      const res = await api.post('/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData((prev: any) => ({ ...prev, logoUrl: res.data.url }));
    } catch (err: any) {
      console.error('Error uploading logo', err);
      alert(err.response?.data?.message || 'Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleDocumentHeaderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDocumentHeader(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setFormData((prev: any) => ({ ...prev, documentHeaderImageUrl: res.data.url }));
    } catch (err: any) {
      console.error('Error uploading document header', err);
      alert(err.response?.data?.message || 'Failed to upload document header image');
    } finally {
      setUploadingDocumentHeader(false);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-2 mb-10">
      <div className="bg-white rounded-[4px] shadow-sm border border-slate-200 overflow-hidden mb-3">
        <div className="bg-slate-50 px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0d3c68] border-b-2 border-[#0d3c68] pb-0.5">COMPANY PROFILE</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Manage your organization's legal, location, and compliance settings.</p>
          </div>
          <Button variant="outline" className="h-7 px-3 rounded-[2px] border-slate-300 text-[11px] font-bold uppercase tracking-wider text-slate-700 bg-white hover:bg-slate-50" onClick={() => setIsEditModalOpen(true)}>
            <Edit2 size={12} className="mr-2" /> Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 pl-2 pr-2">
        {/* Left Column - Overview */}
        <div className="lg:col-span-2">
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm h-full">
            <CardContent className="p-4 flex flex-col">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#0d3c68] border-b border-slate-200 pb-2 mb-3">
                  <Building2 size={14} /> Company Overview
                </div>
                <div className="flex flex-col sm:flex-row items-start gap-5">
                  <div className="w-20 h-20 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm p-1">
                    {profile.logoUrl ? (
                      <Image src={profile.logoUrl} alt="Company Logo" width={80} height={80} className="w-full h-full object-contain aspect-square" />
                    ) : (
                      <Building2 size={32} className="text-zinc-400" />
                    )}
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-md text-zinc-900 dark:text-zinc-100">{profile.legalName || 'Set Legal Name'}</h3>
                      {profile.companyType && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-medium border border-indigo-100">{profile.companyType}</span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{profile.industry || 'Industry not set'}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 mt-2 text-xs text-zinc-600 dark:text-zinc-400">
                      <div className="flex items-center gap-2 min-w-0"><Mail size={14} className="text-indigo-400 shrink-0" /> <span className="truncate">{profile.email || '-'}</span></div>
                      <div className="flex items-center gap-2 min-w-0"><Phone size={14} className="text-indigo-400 shrink-0" /> <span className="truncate">{profile.phone || '-'}</span></div>
                      <div className="flex items-center gap-2 sm:col-span-2 min-w-0"><Globe size={14} className="text-indigo-400 shrink-0" /> <a href={profile.website} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline truncate block">{profile.website || '-'}</a></div>
                      <div className="flex items-center gap-2 sm:col-span-2 min-w-0"><MapPin size={14} className="text-indigo-400 shrink-0" /> <span className="truncate">{[profile.addressLine1, profile.city, profile.state].filter(Boolean).join(', ') || 'Address not set'}</span></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <div>
                  <div className="text-[10px] font-medium text-zinc-500 mb-1">Trade Name / DBA</div>
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{profile.tradeName || '-'}</div>
                </div>
                <div>
                  <div className="text-[10px] font-medium text-zinc-500 mb-1">Company Type</div>
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{profile.companyType || '-'}</div>
                </div>
                <div>
                  <div className="text-[10px] font-medium text-zinc-500 mb-1">Incorporation Type</div>
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{profile.country === 'India' ? 'Indian Company' : 'Foreign Company'}</div>
                </div>
                <div>
                  <div className="text-[10px] font-medium text-zinc-500 mb-1">Established On</div>
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {profile.incorporationDate ? new Date(profile.incorporationDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Key Info */}
        <div className="">
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm h-full flex flex-col">
            <CardContent className="p-4 flex flex-col flex-1">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#0d3c68] border-b border-slate-200 pb-2 mb-3">
                <ShieldCheck size={14} /> Key Information
              </div>
              <div className="flex flex-col justify-between flex-1">
                <div className="flex items-center justify-between pb-1.5 border-b border-zinc-100 dark:border-zinc-800/50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 flex items-center justify-center shrink-0"><User size={14} /></div>
                    <span className="text-[11px] font-md text-zinc-500 uppercase tracking-wider">Founder</span>
                  </div>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 text-right">{profile.founderName || '-'}</span>
                </div>
                <div className="flex items-center justify-between pb-1.5 border-b border-zinc-100 dark:border-zinc-800/50 pt-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 flex items-center justify-center shrink-0"><Building2 size={14} /></div>
                    <span className="text-[11px] font-md text-zinc-500 uppercase tracking-wider">Industry</span>
                  </div>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 text-right">{profile.industry || '-'}</span>
                </div>
                <div className="flex items-center justify-between pb-1.5 border-b border-zinc-100 dark:border-zinc-800/50 pt-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 flex items-center justify-center shrink-0"><Coins size={14} /></div>
                    <span className="text-[11px] font-md text-zinc-500 uppercase tracking-wider">Currency</span>
                  </div>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 text-right">{profile.baseCurrency || '-'}</span>
                </div>
                <div className="flex items-center justify-between pb-1.5 border-b border-zinc-100 dark:border-zinc-800/50 pt-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 flex items-center justify-center shrink-0"><Map size={14} /></div>
                    <span className="text-[11px] font-md text-zinc-500 uppercase tracking-wider">Timezone</span>
                  </div>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 text-right">{profile.timezone || '-'}</span>
                </div>
                <div className="flex items-center justify-between pt-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 flex items-center justify-center shrink-0"><Calendar size={14} /></div>
                    <span className="text-[11px] font-md text-zinc-500 uppercase tracking-wider">FY Month</span>
                  </div>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 text-right">
                    {profile.financialYearStartMonth ? new Date(2000, profile.financialYearStartMonth - 1).toLocaleString('default', { month: 'short' }) : '-'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pl-2 pr-2">
        <SummaryCard icon={<Building2 size={18} />} color="indigo" title="Branches" count={counts.branches} label="Total Branches" />
        <SummaryCard icon={<ShieldCheck size={18} />} color="emerald" title="Departments" count={counts.departments} label="Total Departments" />
        <SummaryCard icon={<User size={18} />} color="orange" title="Designations" count={counts.designations} label="Total Designations" />
        <SummaryCard icon={<User size={18} />} color="blue" title="Employees" count={counts.employees} label="Total Employees" />
        <SummaryCard icon={<ShieldCheck size={18} />} color="indigo" title="Roles" count={0} label="System Roles" />
        <SummaryCard icon={<MapPin size={18} />} color="emerald" title="Locations" count={counts.branches} label="Active Locations" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 pl-2 pr-2">
        {/* Branches Table */}
        <div className="lg:col-span-2">
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm h-[380px] flex flex-col">
            <CardContent className="p-0 flex-1 flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
                <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#0d3c68]">Branches</h2>
                <Link href="/dashboard/branches" className="text-xs font-md text-indigo-600 hover:text-indigo-700 flex items-center gap-1">View All Branches &gt;</Link>
              </div>
              <div className="overflow-x-auto overflow-y-auto flex-1">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-500">
                    <tr>
                      <th className="px-4 py-2.5 font-md">Branch Name</th>
                      <th className="px-4 py-2.5 font-md">Location</th>
                      <th className="px-4 py-2.5 font-md">Manager</th>
                      <th className="px-4 py-2.5 font-md text-center">Employees</th>
                      <th className="px-4 py-2.5 font-md text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {branches.map(b => (
                      <tr key={b._id}>
                        <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{b.name}</td>
                        <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{[b.city, b.state].filter(Boolean).join(', ') || '-'}</td>
                        <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{b.contactPerson || '-'}</td>
                        <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 text-center">-</td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-md border border-emerald-100">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                    {branches.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-zinc-500">No branches found.</td></tr>}
                  </tbody>
                </table>
              </div>
              <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-[10px] text-zinc-500 bg-zinc-50/50">
                <span>Showing 1 to {branches.length} of {counts.branches} branches</span>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" className="h-6 w-6 p-0">&lt;</Button>
                  <Button variant="default" size="sm" className="h-6 w-6 p-0 bg-indigo-600 text-white">1</Button>
                  <Button variant="outline" size="sm" className="h-6 w-6 p-0">&gt;</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dept & Desig Lists */}
        <div className="space-y-3">
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm h-[184px] flex flex-col">
            <CardContent className="p-0 flex flex-col flex-1 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
                <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#0d3c68]">Departments</h2>
                <Link href="/dashboard/departments" className="text-xs font-md text-indigo-600 hover:text-indigo-700">View All</Link>
              </div>
              <div className="p-2 space-y-1 overflow-y-auto flex-1">
                {departments.map(d => (
                  <div key={d._id} className="flex justify-between items-center px-3 py-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                    <div className="flex items-center gap-3 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                      <ShieldCheck size={14} className="text-zinc-400" />
                      {d.name}
                    </div>
                    <div className="text-[10px] font-md text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">-</div>
                  </div>
                ))}
              </div>
              {counts.departments > departments.length && (
                <div className="p-3 text-center border-t border-zinc-100 dark:border-zinc-800">
                  <Link href="/dashboard/departments" className="text-xs font-md text-indigo-600">+{counts.departments - departments.length} more departments</Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm h-[184px] flex flex-col">
            <CardContent className="p-0 flex flex-col flex-1 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
                <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#0d3c68]">Designations</h2>
                <Link href="/dashboard/designations" className="text-xs font-md text-indigo-600 hover:text-indigo-700">View All</Link>
              </div>
              <div className="p-2 space-y-1 overflow-y-auto flex-1">
                {designations.map(d => (
                  <div key={d._id} className="flex justify-between items-center px-3 py-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                    <div className="flex items-center gap-3 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                      <User size={14} className="text-zinc-400" />
                      {d.name}
                    </div>
                    <div className="text-[10px] font-md text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">-</div>
                  </div>
                ))}
              </div>
              {counts.designations > designations.length && (
                <div className="p-3 text-center border-t border-zinc-100 dark:border-zinc-800">
                  <Link href="/dashboard/designations" className="text-xs font-md text-indigo-600">+{counts.designations - designations.length} more designations</Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>


      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-zinc-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
              <h2 className="text-lg font-md text-zinc-900 dark:text-zinc-100">Edit Company Profile</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-zinc-400 hover:text-zinc-700 p-1"><X size={20} /></button>
            </div>
            <div className="flex overflow-x-auto hide-scrollbar border-b border-zinc-200 dark:border-zinc-800 px-6 pt-2 bg-white dark:bg-zinc-950">
              <button type="button" onClick={() => setActiveTab('basic')} className={`shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${activeTab === 'basic' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}>
                <Building2 size={16} /> Basic Info
              </button>
              <button type="button" onClick={() => setActiveTab('location')} className={`shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${activeTab === 'location' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}>
                <MapPin size={16} /> Geography & Finance
              </button>
              <button type="button" onClick={() => setActiveTab('compliance')} className={`shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${activeTab === 'compliance' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}>
                <ShieldCheck size={16} /> Statutory & Legal
              </button>
            </div>

            {errorMsg && (
              <div className="px-6 py-3 bg-red-50 text-red-600 text-sm border-b border-red-100">
                <strong>Error: </strong>{errorMsg}
              </div>
            )}

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 bg-zinc-50/30 dark:bg-zinc-950">
              {/* BASIC INFO TAB */}
              {activeTab === 'basic' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-in fade-in duration-300">
                  <div className="col-span-1 sm:col-span-2 space-y-2 mb-2 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                    <Label className="text-xs font-md">Company Logo</Label>
                    <div className="flex items-center gap-4">
                      {formData.logoUrl ? (
                        <div className="w-16 h-16 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm p-1">
                          <Image src={formData.logoUrl} alt="Logo" width={64} height={64} className="w-full h-full object-contain aspect-square rounded-lg" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 text-zinc-400 shadow-sm"><Building2 size={24} /></div>
                      )}
                      <div className="flex-1 max-w-sm">
                        <Input type="file" accept="image/*" onChange={handleLogoUpload} className="h-9 text-xs file:bg-zinc-100 file:border-0 file:text-xs file:font-md file:px-3 file:py-1 file:rounded-sm file:mr-3 hover:file:bg-zinc-200 cursor-pointer bg-white dark:bg-zinc-900" disabled={uploadingLogo} />
                        {uploadingLogo ? (
                          <span className="text-[10px] text-indigo-600 mt-1.5 flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> Uploading to Cloudinary...</span>
                        ) : (
                          <span className="text-[10px] text-zinc-500 mt-1.5 block">Upload a square image (JPG, PNG). Max 5MB.</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 sm:col-span-2 space-y-1.5">
                    <Label className="text-xs font-md">Hiring PDF Footer Text</Label>
                    <Input name="documentFooterText" value={formData.documentFooterText || ''} onChange={handleChange} className="h-9 text-sm bg-white" placeholder="e.g. This is a system-generated document." />
                    <p className="text-[10px] text-zinc-500">This footer is printed on all hiring PDFs. Leave empty to use the system default.</p>
                  </div>
                  <div className="col-span-1 sm:col-span-2 space-y-2 mb-2 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                    <Label className="text-xs font-md">Hiring PDF Header Image</Label>
                    <p className="text-[10px] text-zinc-500">This wide banner appears on every generated hiring document. Your logo is used if no banner is uploaded.</p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <div className="h-16 w-full max-w-sm overflow-hidden rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                        {formData.documentHeaderImageUrl ? (
                          <Image src={formData.documentHeaderImageUrl} alt="Hiring PDF header preview" width={480} height={96} className="h-full w-full object-contain" />
                        ) : <div className="grid h-full place-items-center text-[10px] text-zinc-400">No hiring document header uploaded</div>}
                      </div>
                      <div className="flex-1 max-w-sm">
                        <Input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleDocumentHeaderUpload} disabled={uploadingDocumentHeader} className="h-9 text-xs file:bg-zinc-100 file:border-0 file:text-xs file:font-md file:px-3 file:py-1 file:rounded-sm file:mr-3 hover:file:bg-zinc-200 cursor-pointer bg-white dark:bg-zinc-900" />
                        <span className="mt-1.5 block text-[10px] text-zinc-500">Use a wide JPG, PNG or WEBP image. Recommended ratio: 5:1. Max 5MB.</span>
                      </div>
                      {formData.documentHeaderImageUrl && <Button type="button" variant="outline" size="sm" onClick={() => setFormData((prev: any) => ({ ...prev, documentHeaderImageUrl: '' }))}>Remove</Button>}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-md">Legal Company Name *</Label>
                    <Input required name="legalName" value={formData.legalName || ''} onChange={handleChange} className="h-9 text-sm bg-white" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-md">Trade Name / DBA</Label>
                    <Input name="tradeName" value={formData.tradeName || ''} onChange={handleChange} className="h-9 text-sm bg-white" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-md">Industry</Label>
                    <Input name="industry" value={formData.industry || ''} onChange={handleChange} className="h-9 text-sm bg-white" placeholder="IT, Healthcare, Manufacturing..." />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-md">Company Type</Label>
                    <select name="companyType" value={formData.companyType || ''} onChange={handleChange} className="flex h-9 w-full items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-950">
                      <option value="">Select Type</option>
                      <option value="Private Limited">Private Limited</option>
                      <option value="Public Limited">Public Limited</option>
                      <option value="LLC">LLC</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Sole Proprietorship">Sole Proprietorship</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-md">Established On</Label>
                    <Input type="date" name="incorporationDate" value={formData.incorporationDate || ''} onChange={handleChange} className="h-9 text-sm bg-white" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-md">Founder / Owner</Label>
                    <Input name="founderName" value={formData.founderName || ''} onChange={handleChange} className="h-9 text-sm bg-white" placeholder="John Doe" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-md">Official Email *</Label>
                    <Input required type="email" name="email" value={formData.email || ''} onChange={handleChange} className="h-9 text-sm bg-white" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-md">Official Phone</Label>
                    <Input name="phone" value={formData.phone || ''} onChange={handleChange} className="h-9 text-sm bg-white" />
                  </div>
                  <div className="col-span-1 sm:col-span-2 space-y-1.5">
                    <Label className="text-xs font-md">Website</Label>
                    <Input name="website" value={formData.website || ''} onChange={handleChange} className="h-9 text-sm bg-white" placeholder="https://..." />
                  </div>
                </div>
              )}

              {/* LOCATION TAB */}
              {activeTab === 'location' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="space-y-4">
                    <h3 className="text-sm font-md text-zinc-900 border-b pb-2">Headquarters Address</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="col-span-1 sm:col-span-2 space-y-1.5">
                        <Label className="text-xs font-md">Address Line 1</Label>
                        <Input name="addressLine1" value={formData.addressLine1 || ''} onChange={handleChange} className="h-9 text-sm bg-white" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-md">City</Label>
                        <Input name="city" value={formData.city || ''} onChange={handleChange} className="h-9 text-sm bg-white" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-md">State / Province</Label>
                        <Input name="state" value={formData.state || ''} onChange={handleChange} className="h-9 text-sm bg-white" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-md">ZIP / Postal Code</Label>
                        <Input name="postalCode" value={formData.postalCode || ''} onChange={handleChange} className="h-9 text-sm bg-white" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-md">Country</Label>
                        <select name="country" value={formData.country || 'India'} onChange={handleChange} className="flex h-9 w-full items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-950">
                          <option value="India">India</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <h3 className="text-sm font-md text-zinc-900 border-b pb-2">Regional Settings</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-md">Base Currency</Label>
                        <select name="baseCurrency" value={formData.baseCurrency || 'INR'} onChange={handleChange} className="flex h-9 w-full items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-950">
                          <option value="INR">INR (₹)</option>
                          <option value="USD">USD ($)</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-md">Timezone</Label>
                        <select name="timezone" value={formData.timezone || 'Asia/Kolkata'} onChange={handleChange} className="flex h-9 w-full items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-950">
                          <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-md">FY Start Month</Label>
                        <select name="financialYearStartMonth" value={formData.financialYearStartMonth || 4} onChange={handleChange} className="flex h-9 w-full items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-950">
                          <option value={1}>January</option>
                          <option value={4}>April</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* COMPLIANCE TAB */}
              {activeTab === 'compliance' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="space-y-4">
                    <h3 className="text-sm font-md text-zinc-900 border-b pb-2">Taxation & Corporate</h3>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-md">PAN Number</Label>
                        <Input name="panNumber" value={formData.panNumber || ''} onChange={handleChange} className="h-9 text-sm uppercase bg-white" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-md">GSTIN</Label>
                        <Input name="gstin" value={formData.gstin || ''} onChange={handleChange} className="h-9 text-sm uppercase bg-white" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-md">CIN</Label>
                        <Input name="cin" value={formData.cin || ''} onChange={handleChange} className="h-9 text-sm uppercase bg-white" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>

            <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6">
                {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ icon, color, title, count, label }: any) {
  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800/50',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800/50',
    orange: 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20 dark:border-orange-800/50',
    blue: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/50',
  };
  return (
    <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
      <CardContent className="p-3 flex flex-col justify-center gap-2">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${colorMap[color]}`}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-md text-zinc-500 uppercase tracking-wider truncate">{title}</div>
            <div className="text-xl font-md text-zinc-900 dark:text-zinc-100 leading-none mt-0.5">{count}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
