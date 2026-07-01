'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit2, Filter, Laptop, MonitorSmartphone, Package, Plus, Search, Trash2, X, AlertTriangle } from 'lucide-react';
import api from '@/lib/axios';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';
import { MultiSearchableDropdown } from '@/components/ui/MultiSearchableDropdown';

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  profilePictureUrl: '',
  employeeCode: '',
  mobileNumber: '',
  dateOfJoining: '',
  dateOfBirth: '',
  gender: 'male',
  bloodGroup: '',
  maritalStatus: 'single',
  currentAddress: '',
  currentPincode: '',
  currentCity: '',
  currentState: '',
  currentCountry: 'India',
  permanentAddress: '',
  permanentPincode: '',
  permanentCity: '',
  permanentState: '',
  permanentCountry: 'India',
  sameAsCurrent: false as boolean,
  panNumber: '',
  aadhaarNumber: '',
  uanNumber: '',
  emergencyContactName: '',
  emergencyContactRelation: '',
  emergencyContactNumber: '',
  attendanceRuleId: '',
  policyIds: [] as string[],
  holidayGroupIds: [] as string[],
  jobLevelId: '',
  roleId: '',
  branchId: '',
  departmentId: '',
  designationId: '',
  reportingToId: '',
  makeDepartmentHod: false as boolean,
  makeDesignationReportingLead: false as boolean,
  employmentStatus: 'active',
  selectedAssetIds: [] as string[],
  allocatedInventoryIds: [] as string[],
  selectedCompanyAssetIds: [] as string[],
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);
  const [attendanceRules, setAttendanceRules] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [holidays, setHolidays] = useState<any[]>([]);
  const [levels, setLevels] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [companyAssets, setCompanyAssets] = useState<any[]>([]);
  const [companyAssetAllocationMap, setCompanyAssetAllocationMap] = useState<Record<string, string>>({});
  const [originalCompanyAssetIds, setOriginalCompanyAssetIds] = useState<string[]>([]);

  const [modalItem, setModalItem] = useState<any | null>(null);
  const [deleteItem, setDeleteItem] = useState<any | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [employeeTab, setEmployeeTab] = useState<'profile' | 'organization' | 'address' | 'reporting' | 'rules' | 'assets'>('profile');
  const [statusFilter, setStatusFilter] = useState<'active' | 'ex'>('active');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReferenceData();
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [statusFilter]);

  useEffect(() => {
    if (loading || employees.length === 0) return;
    const editId = new URLSearchParams(window.location.search).get('edit');
    if (editId) {
      const target = employees.find((emp) => emp._id === editId);
      if (target) openEdit(target);
      window.history.replaceState(null, '', window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, employees]);

  const branchMap = useMemo(() => new Map(branches.map((item) => [item._id, item.name])), [branches]);
  const departmentMap = useMemo(() => new Map(departments.map((item) => [item._id, item.name])), [departments]);
  const designationMap = useMemo(() => new Map(designations.map((item) => [item._id, item.name])), [designations]);
  const reportingOptions = useMemo(() => employees.map((emp) => ({
    _id: emp._id,
    name: formatEmployeeName(emp) || emp.email || 'Unnamed employee',
  })), [employees]);

  const filteredEmployees = employees.filter((emp) => {
    const text = `${emp.firstName} ${emp.lastName} ${emp.email} ${emp.employeeCode || ''}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  const fetchReferenceData = async () => {
    try {
      const [rRes, bRes, dRes, desRes, arRes, pRes, hRes, lRes, aRes, caRes] = await Promise.all([
        api.get('/companies/roles'),
        api.get('/companies/branches'),
        api.get('/companies/departments'),
        api.get('/companies/designations'),
        api.get('/master-data/attendance-rules').catch(() => ({ data: { data: [] } })),
        api.get('/master-data/policies').catch(() => ({ data: { data: [] } })),
        api.get('/master-data/holidays').catch(() => ({ data: { data: [] } })),
        api.get('/master-data/levels').catch(() => ({ data: { data: [] } })),
        api.get('/master-data/it-inventories').catch(() => ({ data: { data: [] } })),
        api.get('/support/assets').catch(() => ({ data: [] })),
      ]);
      setRoles(rRes.data.data || []);
      setBranches(bRes.data.data || []);
      setDepartments(dRes.data.data || []);
      setDesignations(desRes.data.data || []);
      setAttendanceRules(arRes.data.data || []);
      setPolicies(pRes.data.data || []);
      setHolidays(hRes.data.data || []);
      setLevels(lRes.data.data || []);
      setAssets(aRes.data.data || []);
      setCompanyAssets(caRes.data || []);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to load reference data');
    }
  };

  const fetchEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const endpoint = statusFilter === 'ex' ? '/employees/ex' : '/employees';
      const res = await api.get(endpoint);
      setEmployees(res.data.data || []);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setFormData(emptyForm);
    setEmployeeTab('profile');
    setCompanyAssetAllocationMap({});
    setOriginalCompanyAssetIds([]);
    setModalItem({});
    setError('');
  };

  const resolveId = (obj: any) => obj && typeof obj === 'object' ? obj._id : (obj || '');

  const openEdit = async (emp: any) => {
    let selectedCompanyAssetIds: string[] = [];
    try {
      const allocRes = await api.get('/support/assets/allocations', { params: { employeeId: emp._id } });
      const activeAllocations = (allocRes.data || []).filter((a: any) => a.status === 'Active');
      const allocationMap: Record<string, string> = {};
      activeAllocations.forEach((a: any) => { allocationMap[resolveId(a.assetId)] = a._id; });
      selectedCompanyAssetIds = activeAllocations.map((a: any) => resolveId(a.assetId));
      setCompanyAssetAllocationMap(allocationMap);
    } catch {
      setCompanyAssetAllocationMap({});
    }
    setOriginalCompanyAssetIds(selectedCompanyAssetIds);
    setFormData({
      firstName: emp.firstName || '',
      lastName: emp.lastName || '',
      email: emp.email || '',
      password: '',
      profilePictureUrl: emp.profilePictureUrl || '',
      employeeCode: emp.employeeCode || '',
      mobileNumber: emp.mobileNumber || '',
      dateOfJoining: emp.dateOfJoining ? emp.dateOfJoining.substring(0, 10) : '',
      dateOfBirth: emp.dateOfBirth ? emp.dateOfBirth.substring(0, 10) : '',
      gender: emp.gender || 'male',
      bloodGroup: emp.bloodGroup || '',
      maritalStatus: emp.maritalStatus || 'single',
      currentAddress: emp.currentAddress || '',
      currentPincode: emp.currentPincode || '',
      currentCity: emp.currentCity || '',
      currentState: emp.currentState || '',
      currentCountry: emp.currentCountry || 'India',
      permanentAddress: emp.permanentAddress || '',
      permanentPincode: emp.permanentPincode || '',
      permanentCity: emp.permanentCity || '',
      permanentState: emp.permanentState || '',
      permanentCountry: emp.permanentCountry || 'India',
      sameAsCurrent: false,
      panNumber: emp.panNumber || '',
      aadhaarNumber: emp.aadhaarNumber || '',
      uanNumber: emp.uanNumber || '',
      emergencyContactName: emp.emergencyContactName || '',
      emergencyContactRelation: emp.emergencyContactRelation || '',
      emergencyContactNumber: emp.emergencyContactNumber || '',
      attendanceRuleId: resolveId(emp.attendanceRuleId),
      policyIds: Array.isArray(emp.policyIds)
        ? emp.policyIds.map(resolveId)
        : emp.policyId ? [resolveId(emp.policyId)] : [],
      holidayGroupIds: Array.isArray(emp.holidayGroupIds)
        ? emp.holidayGroupIds.map(resolveId)
        : emp.holidayGroupId ? [resolveId(emp.holidayGroupId)] : [],
      jobLevelId: resolveId(emp.jobLevelId),
      roleId: resolveId(emp.roleId),
      branchId: resolveId(emp.branchId),
      departmentId: resolveId(emp.departmentId),
      designationId: resolveId(emp.designationId),
      reportingToId: resolveId(emp.reportingToId),
      makeDepartmentHod: false,
      makeDesignationReportingLead: false,
      employmentStatus: emp.employmentStatus || (emp.isActive ? 'active' : 'ex'),
      selectedAssetIds: Array.isArray(emp.allocatedInventoryIds) ? emp.allocatedInventoryIds.map(resolveId) : [],
      allocatedInventoryIds: Array.isArray(emp.allocatedInventoryIds) ? emp.allocatedInventoryIds.map(resolveId) : [],
      selectedCompanyAssetIds,
    });
    setEmployeeTab('profile');
    setModalItem(emp);
    setError('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload: any = { ...formData };
      // Map selectedAssetIds → allocatedInventoryIds for backend
      payload.allocatedInventoryIds = formData.selectedAssetIds;
      delete payload.selectedAssetIds;
      const selectedCompanyAssetIds = payload.selectedCompanyAssetIds || [];
      delete payload.selectedCompanyAssetIds;
      if (modalItem?._id && !payload.password) delete payload.password;

      let employeeId = modalItem?._id;
      if (employeeId) {
        await api.put(`/employees/${employeeId}`, payload);
      } else {
        const res = await api.post('/employees', payload);
        employeeId = res.data.data?._id || res.data._id;
      }

      const newlyAllocated = selectedCompanyAssetIds.filter((id: string) => !originalCompanyAssetIds.includes(id));
      const newlyReturned = originalCompanyAssetIds.filter((id: string) => !selectedCompanyAssetIds.includes(id));
      await Promise.all([
        ...newlyAllocated.map((assetId: string) => api.post('/support/assets/allocate', { assetId, employeeId })),
        ...newlyReturned.map((assetId: string) => {
          const allocationId = companyAssetAllocationMap[assetId];
          return allocationId ? api.post(`/support/assets/return/${allocationId}`, {}) : Promise.resolve();
        }),
      ]);
      if (newlyAllocated.length > 0 || newlyReturned.length > 0) {
        await fetchReferenceData();
      }

      setModalItem(null);
      await fetchEmployees();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const uploadEmployeeImage = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData((prev) => ({ ...prev, profilePictureUrl: res.data.url }));
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to upload employee image');
    } finally {
      setUploading(false);
    }
  };

  const executeDelete = async () => {
    if (!deleteItem) return;
    setSaving(true);
    setError('');
    try {
      await api.delete(`/employees/${deleteItem._id}`);
      setDeleteItem(null);
      await fetchEmployees();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Delete failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePincodeChange = async (val: string, type: 'current' | 'permanent') => {
    setFormData((prev) => ({
      ...prev,
      [type === 'current' ? 'currentPincode' : 'permanentPincode']: val,
      ...(prev.sameAsCurrent && type === 'current' ? { permanentPincode: val } : {})
    }));

    if (val.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
        const data = await res.json();
        if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
          const po = data[0].PostOffice[0];
          setFormData((prev) => {
            const updates: any = {
              [`${type}City`]: po.District,
              [`${type}State`]: po.State,
              [`${type}Country`]: po.Country || 'India',
            };
            if (prev.sameAsCurrent && type === 'current') {
              updates.permanentCity = po.District;
              updates.permanentState = po.State;
              updates.permanentCountry = po.Country || 'India';
            }
            return { ...prev, ...updates };
          });
        }
      } catch (err) {
        console.error('Failed to fetch pincode details', err);
      }
    }
  };

  const handleSameAsCurrentToggle = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      sameAsCurrent: checked,
      ...(checked ? {
        permanentAddress: prev.currentAddress,
        permanentPincode: prev.currentPincode,
        permanentCity: prev.currentCity,
        permanentState: prev.currentState,
        permanentCountry: prev.currentCountry,
      } : {})
    }));
  };

  return (
    <div className="space-y-4 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Employee Directory</h1>
          <p className="text-xs text-zinc-500">Manage comprehensive employee profiles, roles, and organization assignments.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={openCreate} className="h-8 text-xs bg-zinc-900 text-white hover:bg-zinc-800">
            <Plus size={14} className="mr-1" /> Add Legacy / Direct Employee
          </Button>
        </div>
      </div>

      {!modalItem && !deleteItem && error && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}

      <div className="grid grid-cols-1 gap-4">
        <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
          <CardHeader className="py-2.5 px-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-row items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-1.5 h-4 w-4 text-zinc-500" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employees by name, email, or code..." className="h-7 pl-8 text-xs" />
            </div>
            <div className="inline-flex rounded-md border border-zinc-200 bg-white p-0.5">
              <button onClick={() => setStatusFilter('active')} className={`px-2 py-1 text-xs rounded ${statusFilter === 'active' ? 'bg-zinc-900 text-white' : 'text-zinc-600'}`}>Current</button>
              <button onClick={() => setStatusFilter('ex')} className={`px-2 py-1 text-xs rounded ${statusFilter === 'ex' ? 'bg-zinc-900 text-white' : 'text-zinc-600'}`}>Ex</button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2 grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_80px] gap-4 text-[10px] font-md text-zinc-500 uppercase tracking-wider bg-zinc-50/50 dark:bg-zinc-900/20">
              <div>Employee</div>
              <div>Role / Designation</div>
              <div>Department</div>
              <div>Branch</div>
              <div>Rules & Policy</div>
              <div className="text-right">Actions</div>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {loading && <div className="p-4 text-center text-xs text-zinc-500">Loading...</div>}
              {!loading && filteredEmployees.length === 0 && <div className="p-4 text-center text-xs text-zinc-500">No employees found.</div>}
              {!loading && filteredEmployees.map((emp) => (
                <div key={emp._id} className="px-4 py-2 grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_80px] gap-4 items-center hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar employee={emp} />
                    <div className="min-w-0">
                      <Link
                        href={`/dashboard/employees/${emp._id}`}
                        className="text-xs font-md text-zinc-900 dark:text-zinc-100 truncate hover:text-indigo-600 hover:underline block"
                      >
                        {emp.employeeCode ? <span className="text-indigo-600 font-semibold mr-1">[{emp.employeeCode}]</span> : ''}
                        {emp.firstName} {emp.lastName}
                      </Link>
                      <div className="text-[10px] text-zinc-500 truncate">{emp.email} {emp.mobileNumber ? `• ${emp.mobileNumber}` : ''}</div>
                    </div>
                  </div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400 truncate">
                    {emp.roleId?.name || 'No Role'}{emp.designationId ? ` / ${emp.designationId.name || designationMap.get(resolveId(emp.designationId))}` : ''}
                  </div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400 truncate">
                    {emp.departmentId?.name || departmentMap.get(resolveId(emp.departmentId)) || '-'}
                  </div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400 truncate">{emp.branchId?.name || branchMap.get(resolveId(emp.branchId)) || '-'}</div>
                  <div className="text-[10px] text-zinc-500 truncate space-y-0.5">
                    {emp.attendanceRuleId && <div>A: {emp.attendanceRuleId.name}</div>}
                    {emp.policyId && <div>P: {emp.policyId.name}</div>}
                    {!emp.attendanceRuleId && !emp.policyId && <span>-</span>}
                  </div>
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      title="Edit Profile"
                      onClick={() => openEdit(emp)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 text-zinc-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      type="button"
                      title="Deactivate"
                      onClick={() => setDeleteItem(emp)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 text-rose-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {modalItem && (
        <Modal title={`${modalItem._id ? 'Edit' : 'Add Legacy/Direct'} Employee`} busy={saving} onClose={() => { setModalItem(null); setError(''); }} onSubmit={submit}>
          {error && <div className="mb-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}
          <div className="mb-2 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-md flex items-start gap-2">
            <AlertTriangle size={13} className="mt-0.5 shrink-0" />
            <div className="text-[10px] leading-relaxed">
              <strong>Important Note:</strong> Standard employees should be created via the <strong>Hiring Pipeline</strong>. This direct creation tool should only be used for founders, immediate directors, or legacy data imports.
            </div>
          </div>
          <Tabs value={employeeTab} onChange={setEmployeeTab} />
          <div className="mt-1 px-1 pb-4">
            {employeeTab === 'profile' && (
              <div className="space-y-3">
                <div className="grid grid-cols-[56px_1fr] gap-3 items-center">
                  <Avatar employee={formData} size="xl" />
                  <div className="space-y-1">
                    <label className="text-xs font-medium block">Employee Photo</label>
                    <input type="file" accept="image/*" onChange={(e) => uploadEmployeeImage(e.target.files?.[0])} className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-xs" />
                    <p className="text-[10px] text-zinc-500">{uploading ? 'Uploading...' : formData.profilePictureUrl ? 'Photo uploaded.' : 'Optional, max 5MB.'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="First Name" value={formData.firstName} onChange={(value) => setFormData({ ...formData, firstName: value })} required />
                  <Field label="Last Name" value={formData.lastName} onChange={(value) => setFormData({ ...formData, lastName: value })} required />
                  <Field label="Email Address" type="email" value={formData.email} onChange={(value) => setFormData({ ...formData, email: value })} required />
                  <Field label="Mobile Number" value={formData.mobileNumber} onChange={(value) => setFormData({ ...formData, mobileNumber: value })} />
                  <Field label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={(value) => setFormData({ ...formData, dateOfBirth: value })} />
                  <Select label="Gender" value={formData.gender} options={[{ _id: 'male', name: 'Male' }, { _id: 'female', name: 'Female' }, { _id: 'other', name: 'Other' }]} onChange={(value) => setFormData({ ...formData, gender: value })} />
                  <Field label="Blood Group" value={formData.bloodGroup} onChange={(value) => setFormData({ ...formData, bloodGroup: value })} />
                  <Select label="Marital Status" value={formData.maritalStatus} options={[{ _id: 'single', name: 'Single' }, { _id: 'married', name: 'Married' }, { _id: 'divorced', name: 'Divorced' }, { _id: 'widowed', name: 'Widowed' }]} onChange={(value) => setFormData({ ...formData, maritalStatus: value })} />
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <h3 className="text-xs font-semibold text-zinc-900">Emergency Contact</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <Field label="Name" value={formData.emergencyContactName} onChange={(value) => setFormData({ ...formData, emergencyContactName: value })} />
                    <Field label="Relation" value={formData.emergencyContactRelation} onChange={(value) => setFormData({ ...formData, emergencyContactRelation: value })} />
                    <Field label="Phone" value={formData.emergencyContactNumber} onChange={(value) => setFormData({ ...formData, emergencyContactNumber: value })} />
                  </div>
                </div>
              </div>
            )}

            {employeeTab === 'address' && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-zinc-900">Current Address</h3>
                  <Field label="Address Line 1" value={formData.currentAddress} onChange={(val) => {
                    setFormData(p => ({ ...p, currentAddress: val, ...(p.sameAsCurrent ? { permanentAddress: val } : {}) }));
                  }} placeholder="House No, Building, Street" />
                  <div className="grid grid-cols-4 gap-3">
                    <Field label="Pincode" value={formData.currentPincode} onChange={(val) => handlePincodeChange(val, 'current')} placeholder="e.g. 110001" maxLength={6} />
                    <Field label="City / District" value={formData.currentCity} onChange={(val) => setFormData(p => ({ ...p, currentCity: val, ...(p.sameAsCurrent ? { permanentCity: val } : {}) }))} />
                    <Field label="State" value={formData.currentState} onChange={(val) => setFormData(p => ({ ...p, currentState: val, ...(p.sameAsCurrent ? { permanentState: val } : {}) }))} />
                    <Field label="Country" value={formData.currentCountry} onChange={(val) => setFormData(p => ({ ...p, currentCountry: val, ...(p.sameAsCurrent ? { permanentCountry: val } : {}) }))} />
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-zinc-900">Permanent Address</h3>
                    <label className="flex items-center gap-2 text-xs text-zinc-600 cursor-pointer">
                      <input type="checkbox" checked={formData.sameAsCurrent} onChange={(e) => handleSameAsCurrentToggle(e.target.checked)} className="rounded border-zinc-300" />
                      Same as Current Address
                    </label>
                  </div>
                  {!formData.sameAsCurrent && (
                    <>
                      <Field label="Address Line 1" value={formData.permanentAddress} onChange={(val) => setFormData({ ...formData, permanentAddress: val })} placeholder="House No, Building, Street" />
                      <div className="grid grid-cols-4 gap-3">
                        <Field label="Pincode" value={formData.permanentPincode} onChange={(val) => handlePincodeChange(val, 'permanent')} placeholder="e.g. 110001" maxLength={6} />
                        <Field label="City / District" value={formData.permanentCity} onChange={(val) => setFormData({ ...formData, permanentCity: val })} />
                        <Field label="State" value={formData.permanentState} onChange={(val) => setFormData({ ...formData, permanentState: val })} />
                        <Field label="Country" value={formData.permanentCountry} onChange={(val) => setFormData({ ...formData, permanentCountry: val })} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {employeeTab === 'organization' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Employee Code" value={formData.employeeCode} onChange={(value) => setFormData({ ...formData, employeeCode: value })} placeholder="e.g. EMP-1001" />
                  <Field label="Date of Joining" type="date" value={formData.dateOfJoining} onChange={(value) => setFormData({ ...formData, dateOfJoining: value })} />
                  <Select label="Branch" value={formData.branchId} options={branches} onChange={(value) => setFormData({ ...formData, branchId: value })} />
                  <Select label="Department" value={formData.departmentId} options={departments} onChange={(value) => setFormData({ ...formData, departmentId: value })} />
                  <Select label="Designation" value={formData.designationId} options={designations} onChange={(value) => setFormData({ ...formData, designationId: value })} />
                  <Select label="Job Level" value={formData.jobLevelId} options={levels} onChange={(value) => setFormData({ ...formData, jobLevelId: value })} />
                  <Select label="Employment Status" value={formData.employmentStatus} options={[{ _id: 'active', name: 'Active' }, { _id: 'ex', name: 'Ex Employee' }]} onChange={(value) => setFormData({ ...formData, employmentStatus: value })} />
                </div>
              </div>
            )}

            {employeeTab === 'rules' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Select label="System Access Role" value={formData.roleId} options={roles} onChange={(value) => setFormData({ ...formData, roleId: value })} />
                  <Field label={modalItem._id ? 'Reset Password' : 'Temporary Password'} type="password" value={formData.password} onChange={(value) => setFormData({ ...formData, password: value })} required={!modalItem._id} placeholder={modalItem._id ? "Leave blank to keep unchanged" : "Must contain 8 chars, 1 Uppercase, 1 Number"} />
                </div>
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                  <h3 className="text-xs font-semibold text-zinc-900">Work & HR Compliance Policies</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <Select label="Attendance Rule" value={formData.attendanceRuleId} options={attendanceRules} onChange={(value) => setFormData({ ...formData, attendanceRuleId: value })} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block">
                      Holiday Groups <span className="text-zinc-400 font-normal">(multiple allowed)</span>
                    </label>
                    <MultiSearchableDropdown
                      options={holidays.map(h => ({ label: h.name || h._id, value: h._id }))}
                      values={formData.holidayGroupIds}
                      onChange={(vals) => setFormData({ ...formData, holidayGroupIds: vals })}
                      placeholder="-- Select holiday groups --"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block">
                      Company Policies <span className="text-zinc-400 font-normal">(multiple allowed)</span>
                    </label>
                    <MultiSearchableDropdown
                      options={policies.map(p => ({ label: p.name || p.title || p._id, value: p._id }))}
                      values={formData.policyIds}
                      onChange={(vals) => setFormData({ ...formData, policyIds: vals })}
                      placeholder="-- Select one or more policies --"
                    />
                  </div>
                </div>
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                  <h3 className="text-xs font-semibold text-zinc-900">Compliance & Identity (PAN/Aadhaar)</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <Field label="PAN Number" value={formData.panNumber} onChange={(value) => setFormData({ ...formData, panNumber: value })} />
                    <Field label="Aadhaar Number" value={formData.aadhaarNumber} onChange={(value) => setFormData({ ...formData, aadhaarNumber: value })} />
                    <Field label="UAN (PF Number)" value={formData.uanNumber} onChange={(value) => setFormData({ ...formData, uanNumber: value })} />
                  </div>
                </div>
              </div>
            )}

            {employeeTab === 'reporting' && (
              <div className="space-y-3">
                <Select label="Reports To (Direct Manager)" value={formData.reportingToId} options={reportingOptions.filter((emp) => emp._id !== modalItem?._id)} onChange={(value) => setFormData({ ...formData, reportingToId: value })} />
                <div className="grid grid-cols-2 gap-3">
                  <HierarchyCheck
                    checked={formData.makeDepartmentHod}
                    onChange={(checked) => setFormData({ ...formData, makeDepartmentHod: checked })}
                    title="Make Department HOD"
                    description="This employee will be the head of their selected department."
                  />
                  <HierarchyCheck
                    checked={formData.makeDesignationReportingLead}
                    onChange={(checked) => setFormData({ ...formData, makeDesignationReportingLead: checked })}
                    title="Make Designation Lead"
                    description="Employees with the same designation will report to them by default."
                  />
                </div>
              </div>
            )}

            {employeeTab === 'assets' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-zinc-500">Tick the IT hardware / stationery items allocated to this employee.</p>
                  <span className="text-[10px] text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
                    {formData.selectedAssetIds.length} selected
                  </span>
                </div>
                {assets.length === 0 ? (
                  <div className="text-center py-8 text-zinc-400">
                    <Package size={28} className="mx-auto mb-2 text-zinc-300" />
                    <p className="text-xs font-medium">No IT inventory items found</p>
                    <p className="text-[10px] mt-1">Add items from Master → IT Inventory first.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {assets.map((asset: any) => {
                      const isSelected = formData.selectedAssetIds.includes(asset._id);
                      return (
                        <label
                          key={asset._id}
                          className={`flex items-center gap-3 rounded-md border px-3 py-2.5 cursor-pointer transition-colors ${isSelected
                              ? 'border-indigo-300 bg-indigo-50'
                              : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                            }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              const ids = e.target.checked
                                ? [...formData.selectedAssetIds, asset._id]
                                : formData.selectedAssetIds.filter((id: string) => id !== asset._id);
                              setFormData({ ...formData, selectedAssetIds: ids });
                            }}
                            className="rounded border-zinc-300 accent-indigo-600"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-medium text-zinc-900 truncate block">{asset.name}</span>
                            {asset.description && <span className="text-[10px] text-zinc-400 truncate block">{asset.description}</span>}
                          </div>
                          <Laptop size={13} className={isSelected ? 'text-indigo-400' : 'text-zinc-300'} />
                        </label>
                      );
                    })}
                  </div>
                )}

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-zinc-500">Tick the company assets (laptops, mobiles, vehicles...) allocated to this employee.</p>
                    <span className="text-[10px] text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
                      {formData.selectedCompanyAssetIds.length} selected
                    </span>
                  </div>
                  {companyAssets.filter((a: any) => a.status === 'Available' || formData.selectedCompanyAssetIds.includes(a._id)).length === 0 ? (
                    <div className="text-center py-8 text-zinc-400">
                      <MonitorSmartphone size={28} className="mx-auto mb-2 text-zinc-300" />
                      <p className="text-xs font-medium">No available company assets found</p>
                      <p className="text-[10px] mt-1">Add items from Support → Asset Management first.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {companyAssets
                        .filter((asset: any) => asset.status === 'Available' || formData.selectedCompanyAssetIds.includes(asset._id))
                        .map((asset: any) => {
                          const isSelected = formData.selectedCompanyAssetIds.includes(asset._id);
                          return (
                            <label
                              key={asset._id}
                              className={`flex items-center gap-3 rounded-md border px-3 py-2.5 cursor-pointer transition-colors ${isSelected
                                  ? 'border-indigo-300 bg-indigo-50'
                                  : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                                }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  const ids = e.target.checked
                                    ? [...formData.selectedCompanyAssetIds, asset._id]
                                    : formData.selectedCompanyAssetIds.filter((id: string) => id !== asset._id);
                                  setFormData({ ...formData, selectedCompanyAssetIds: ids });
                                }}
                                className="rounded border-zinc-300 accent-indigo-600"
                              />
                              <div className="flex-1 min-w-0">
                                <span className="text-xs font-medium text-zinc-900 truncate block">{asset.name}</span>
                                <span className="text-[10px] text-zinc-400 truncate block">{asset.type} • {asset.serialNumber}</span>
                              </div>
                              <MonitorSmartphone size={13} className={isSelected ? 'text-indigo-400' : 'text-zinc-300'} />
                            </label>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {deleteItem && (
        <ConfirmModal busy={saving} title={`Deactivate ${deleteItem.firstName}?`} onCancel={() => { setDeleteItem(null); setError(''); }} onConfirm={executeDelete}>
          {error && <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}
          This will move the employee to the ex-employee list and deactivate their system access immediately.
        </ConfirmModal>
      )}
    </div>
  );
}

function Modal({ title, onClose, onSubmit, children, busy }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-3xl border border-zinc-200/50 dark:border-zinc-800 flex flex-col" style={{ maxHeight: '90vh' }}>
        <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0">
          {/* Sticky header with buttons */}
          <div className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 rounded-t-xl shrink-0">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" className="h-8 px-3 text-xs bg-white" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={busy} className="h-8 px-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white">{busy ? 'Saving...' : 'Save Employee Data'}</Button>
            </div>
          </div>
          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1 px-5 pt-3 pb-5 custom-scrollbar">
            {children}
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmModal({ title, children, onCancel, onConfirm, busy }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-sm border border-zinc-200/50 dark:border-zinc-800">
        <div className="p-5">
          <h3 className="text-lg font-md text-zinc-900 dark:text-zinc-50 mb-2">{title}</h3>
          <p className="text-sm text-zinc-500 mb-6">{children}</p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
            <Button size="sm" disabled={busy} className="bg-rose-600 hover:bg-rose-700 text-white" onClick={onConfirm}>{busy ? 'Saving...' : 'Deactivate'}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tabs({ value, onChange }: { value: 'profile' | 'organization' | 'address' | 'reporting' | 'rules' | 'assets'; onChange: (value: 'profile' | 'organization' | 'address' | 'reporting' | 'rules' | 'assets') => void }) {
  const tabs = [
    { key: 'profile', label: 'Profile' },
    { key: 'address', label: 'Address' },
    { key: 'organization', label: 'Organization' },
    { key: 'reporting', label: 'Reporting' },
    { key: 'rules', label: 'Rules & Compliance' },
    { key: 'assets', label: 'Assets' },
  ] as const;

  return (
    <div className="flex rounded-md border border-zinc-200 bg-zinc-50 p-0.5">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`h-7 flex-1 rounded px-2 text-[11px] font-medium transition-colors ${value === tab.key ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function HierarchyCheck({ checked, onChange, title, description }: { checked: boolean; onChange: (checked: boolean) => void; title: string; description: string }) {
  return (
    <label className="flex items-start gap-2 rounded-md border border-zinc-200 p-3 text-xs cursor-pointer hover:bg-zinc-50">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5"
      />
      <span>
        <span className="block font-md text-zinc-900">{title}</span>
        <span className="mt-0.5 block text-[10px] text-zinc-500">{description}</span>
      </span>
    </label>
  );
}

type FieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function Field({ label, value, onChange, ...props }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block">{label} {props.required && <span className="text-rose-500">*</span>}</label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 text-xs bg-white dark:bg-zinc-900"
        {...props}
      />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: any[] }) {
  const dropdownOptions = options.map(opt => ({
    label: opt.name || opt.title || opt.email || opt._id,
    value: opt._id
  }));

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block">{label}</label>
      <SearchableDropdown
        options={dropdownOptions}
        value={value}
        onChange={onChange}
        placeholder="-- Select --"
      />
    </div>
  );
}

function formatEmployeeName(emp: any) {
  if (!emp) return '';
  if (emp.firstName && emp.lastName) return `${emp.firstName} ${emp.lastName}`;
  if (emp.firstName) return emp.firstName;
  return '';
}

function Avatar({ employee, size = 'default' }: { employee: any, size?: 'default' | 'large' | 'xl' }) {
  const sizeMap = {
    default: 'w-8 h-8 text-xs',
    large: 'w-12 h-12 text-sm',
    xl: 'w-16 h-16 text-lg'
  };

  if (employee?.profilePictureUrl) {
    return <img src={employee.profilePictureUrl} alt="" className={`${sizeMap[size]} rounded-full object-cover shrink-0`} />;
  }

  const initials = employee?.firstName ? employee.firstName[0].toUpperCase() : '?';
  return (
    <div className={`${sizeMap[size]} shrink-0 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-medium border border-indigo-200/50`}>
      {initials}
    </div>
  );
}
