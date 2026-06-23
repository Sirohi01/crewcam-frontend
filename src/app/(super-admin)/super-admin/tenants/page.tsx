'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import api from '@/lib/axios';

export default function SuperAdminTenantsPage() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    name: '', packageId: '', isActive: true, aiCredits: 0, country: 'India',
    adminFirstName: '', adminLastName: '', adminEmail: '', adminPassword: '',
    tradeName: '', industry: '', companyType: '', website: '', email: '', phone: '',
    addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '',
    timezone: 'Asia/Kolkata', baseCurrency: 'INR', financialYearStartMonth: 4,
    panNumber: '', gstin: '', cin: '', tan: '', epfoNumber: '', esicNumber: '', ptNumber: '', lwfNumber: '',
    tin: '', ein: '', vatNumber: '', businessLicenseNumber: '',
    logoUrl: '', adminProfilePictureUrl: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tRes, pRes] = await Promise.all([
        api.get('/super-admin/tenants'),
        api.get('/super-admin/packages')
      ]);
      setTenants(tRes.data || tRes.data.data || []);
      setPackages(pRes.data || pRes.data.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && editId) {
        await api.put(`/super-admin/tenants/${editId}`, formData);
      } else {
        await api.post('/super-admin/tenants', formData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await api.delete(`/super-admin/tenants/${deleteConfirmId}`);
      fetchData();
      setDeleteConfirmId(null);
    } catch (e) {
      console.error(e);
      alert('Failed to delete tenant');
    }
  };

  const handleFileUpload = async (e: any, fieldName: 'logoUrl' | 'adminProfilePictureUrl') => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    try {
      const res = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, [fieldName]: res.data.url }));
    } catch (error) {
      console.error('Error uploading file', error);
      alert('Failed to upload image. Max size 5MB.');
    }
  };

  const resetForm = () => {
    setIsEditMode(false);
    setEditId(null);
    setActiveTab('basic');
    setFormData({
      name: '', packageId: '', isActive: true, aiCredits: 0, country: 'India',
      adminFirstName: '', adminLastName: '', adminEmail: '', adminPassword: '',
      tradeName: '', industry: '', companyType: '', website: '', email: '', phone: '',
      addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '',
      timezone: 'Asia/Kolkata', baseCurrency: 'INR', financialYearStartMonth: 4,
      panNumber: '', gstin: '', cin: '', tan: '', epfoNumber: '', esicNumber: '', ptNumber: '', lwfNumber: '',
      tin: '', ein: '', vatNumber: '', businessLicenseNumber: '',
      logoUrl: '', adminProfilePictureUrl: ''
    });
  };

  const openEditModal = async (t: any) => {
    setIsEditMode(true);
    setEditId(t._id);
    setActiveTab('basic');

    const c = t.company || {};

    setFormData({
      name: t.name,
      packageId: t.packageId?._id || '',
      isActive: t.isActive,
      aiCredits: t.aiCredits || 0,
      country: c.country || 'India',
      adminFirstName: t.admin?.firstName || '',
      adminLastName: t.admin?.lastName || '',
      adminEmail: t.admin?.email || '',
      adminPassword: '',
      tradeName: c.tradeName || '', industry: c.industry || '', companyType: c.companyType || '', website: c.website || '', email: c.email || '', phone: c.phone || '',
      addressLine1: c.addressLine1 || '', addressLine2: c.addressLine2 || '', city: c.city || '', state: c.state || '', postalCode: c.postalCode || '',
      timezone: c.timezone || 'Asia/Kolkata', baseCurrency: c.baseCurrency || 'INR', financialYearStartMonth: c.financialYearStartMonth || 4,
      panNumber: c.panNumber || '', gstin: c.gstin || '', cin: c.cin || '', tan: c.tan || '', epfoNumber: c.epfoNumber || '', esicNumber: c.esicNumber || '', ptNumber: c.ptNumber || '', lwfNumber: c.lwfNumber || '',
      tin: c.tin || '', ein: c.ein || '', vatNumber: c.vatNumber || '', businessLicenseNumber: c.businessLicenseNumber || '',
      logoUrl: c.logoUrl || '', adminProfilePictureUrl: t.admin?.profilePictureUrl || ''
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Tenant Management</h1>
          <p className="text-xs text-zinc-500">Manage all registered companies and their subscriptions.</p>
        </div>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }} className="h-8 text-xs bg-zinc-900 text-white hover:bg-zinc-800">
          <Plus size={14} className="mr-1" /> Add Tenant
        </Button>
      </div>

      <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
        <CardContent className="p-0">
          <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2 bg-zinc-50 dark:bg-zinc-900 flex gap-4 text-xs font-md text-zinc-500">
            <div className="w-1/5">TENANT NAME</div>
            <div className="w-1/4">ADMIN EMAIL</div>
            <div className="w-1/6">PACKAGE</div>
            <div className="w-[12.5%] text-center">AI CREDITS</div>
            <div className="w-[12.5%] text-center">STATUS</div>
            <div className="w-[12.5%] text-right">ACTIONS</div>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {tenants.map((t: any) => (
              <div key={t._id} className="px-4 py-2.5 flex items-center gap-4 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                <div className="w-1/5 font-medium">{t.name}</div>
                <div className="w-1/4 text-zinc-500 truncate">{t.admin?.email || 'N/A'}</div>
                <div className="w-1/6 text-zinc-500">{t.packageId?.name || 'Custom'}</div>
                <div className="w-[12.5%] text-center tabular-nums text-zinc-600">{t.aiCredits || 0}</div>
                <div className="w-[12.5%] text-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${t.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {t.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="w-[12.5%] text-right flex justify-end gap-2">
                  <Button onClick={() => openEditModal(t)} variant="ghost" size="sm" className="h-7 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                    Edit
                  </Button>
                  <Button onClick={() => confirmDelete(t._id)} variant="ghost" size="sm" className="h-7 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50">
                    Delete
                  </Button>
                </div>
              </div>
            ))}
            {tenants.length === 0 && (
              <div className="p-8 text-center text-zinc-500 text-sm">No tenants found. Create one.</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm transition-all duration-200 py-10">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-sm border border-zinc-200/50 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5">
              <h3 className="text-lg font-md text-zinc-900 dark:text-zinc-50 mb-2">Delete Tenant?</h3>
              <p className="text-sm text-zinc-500 mb-6">Are you sure you want to delete this tenant? This action cannot be undone and will erase all associated data.</p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" size="sm" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
                <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white" onClick={handleDelete}>Delete</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Premium Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm transition-all duration-200 py-10 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl border border-zinc-200/50 animate-in fade-in zoom-in-95 duration-200 flex flex-col my-auto max-h-full">
            <div className="px-5 py-4 border-b border-zinc-100 flex justify-between items-center bg-white rounded-t-xl shrink-0">
              <h2 className="text-sm font-md text-zinc-900">{isEditMode ? 'Edit Tenant' : 'Create New Tenant'}</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-1 rounded-md transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="flex border-b border-zinc-100 px-5 shrink-0">
              <button onClick={() => setActiveTab('basic')} className={`py-2.5 text-xs font-md border-b-2 mr-6 transition-colors ${activeTab === 'basic' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}>
                Core Settings
              </button>
              <button onClick={() => setActiveTab('location')} className={`py-2.5 text-xs font-md border-b-2 mr-6 transition-colors ${activeTab === 'location' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}>
                Geography & Finance
              </button>
              <button onClick={() => setActiveTab('compliance')} className={`py-2.5 text-xs font-md border-b-2 transition-colors ${activeTab === 'compliance' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}>
                Statutory & Legal
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdate} className="p-5 flex-1 overflow-y-auto">

              {activeTab === 'basic' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-md text-zinc-700">Company Name *</label>
                      <input required value={formData.name} onChange={(e: any) => setFormData({ ...formData, name: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="Acme Corp" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-md text-zinc-700">Select Package *</label>
                      <select required value={formData.packageId} onChange={(e: any) => setFormData({ ...formData, packageId: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                        <option value="">Choose a subscription package</option>
                        {packages.map(p => (
                          <option key={p._id} value={p._id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-md text-zinc-700">Company Logo (Optional)</label>
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'logoUrl')} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                      {formData.logoUrl && <p className="text-xs text-green-600 mt-1">Logo uploaded successfully.</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-md text-zinc-700">AI Credits</label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={formData.aiCredits}
                        onChange={(e: any) => setFormData({ ...formData, aiCredits: Math.max(0, Number(e.target.value) || 0) })}
                        className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                    {isEditMode && (
                      <div className="space-y-1.5">
                        <label className="block text-xs font-md text-zinc-700">Status</label>
                        <select value={formData.isActive ? 'true' : 'false'} onChange={(e: any) => setFormData({ ...formData, isActive: e.target.value === 'true' })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 pt-4 border-t border-zinc-100">
                    <h3 className="text-xs font-md uppercase tracking-wider text-slate-500 mb-4">Company Admin Login Details</h3>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-md text-zinc-700">Admin First Name *</label>
                        <input required value={formData.adminFirstName} onChange={(e: any) => setFormData({ ...formData, adminFirstName: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="John" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-md text-zinc-700">Admin Last Name *</label>
                        <input required value={formData.adminLastName} onChange={(e: any) => setFormData({ ...formData, adminLastName: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="Doe" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-md text-zinc-700">Admin Email *</label>
                        <input required type="email" value={formData.adminEmail} onChange={(e: any) => setFormData({ ...formData, adminEmail: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="admin@company.com" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-md text-zinc-700">Admin Password {isEditMode ? '' : '*'}</label>
                        <input required={!isEditMode} type="password" value={formData.adminPassword} onChange={(e: any) => setFormData({ ...formData, adminPassword: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder={isEditMode ? "Leave blank to keep unchanged" : "••••••••"} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-md text-zinc-700">Admin Photo (Optional)</label>
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'adminProfilePictureUrl')} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                        {formData.adminProfilePictureUrl && <p className="text-xs text-green-600 mt-1">Photo uploaded successfully.</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'location' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="col-span-2 space-y-1.5">
                      <label className="block text-xs font-md text-zinc-700">Address Line 1</label>
                      <input value={formData.addressLine1} onChange={(e: any) => setFormData({ ...formData, addressLine1: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-md text-zinc-700">City</label>
                      <input value={formData.city} onChange={(e: any) => setFormData({ ...formData, city: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-md text-zinc-700">State / Province</label>
                      <input value={formData.state} onChange={(e: any) => setFormData({ ...formData, state: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-md text-zinc-700">Country</label>
                      <select required value={formData.country} onChange={(e: any) => setFormData({ ...formData, country: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2">
                        <option value="India">India</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="UAE">UAE</option>
                        <option value="Singapore">Singapore</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-md text-zinc-700">Base Currency</label>
                      <select value={formData.baseCurrency} onChange={(e: any) => setFormData({ ...formData, baseCurrency: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2">
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'compliance' && (
                <div className="space-y-6 animate-in fade-in">
                  {formData.country === 'India' ? (
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-md text-zinc-700">PAN Number</label>
                        <input value={formData.panNumber} onChange={(e: any) => setFormData({ ...formData, panNumber: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2 uppercase" placeholder="ABCDE1234F" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-md text-zinc-700">GSTIN</label>
                        <input value={formData.gstin} onChange={(e: any) => setFormData({ ...formData, gstin: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2 uppercase" placeholder="22AAAAA0000A1Z5" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-md text-zinc-700">CIN (Corporate ID)</label>
                        <input value={formData.cin} onChange={(e: any) => setFormData({ ...formData, cin: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2 uppercase" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-md text-zinc-700">TAN</label>
                        <input value={formData.tan} onChange={(e: any) => setFormData({ ...formData, tan: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2 uppercase" />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-md text-zinc-700">Employer ID Number (EIN)</label>
                        <input value={formData.ein} onChange={(e: any) => setFormData({ ...formData, ein: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2 uppercase" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-md text-zinc-700">Value Added Tax (VAT)</label>
                        <input value={formData.vatNumber} onChange={(e: any) => setFormData({ ...formData, vatNumber: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2 uppercase" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-6 mt-6 border-t border-zinc-100 flex justify-end gap-3 shrink-0">
                <Button type="button" variant="outline" className="h-9 px-4 text-xs font-medium border-zinc-200" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="h-9 px-4 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20">
                  {isEditMode ? 'Save Changes' : 'Create Tenant'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
