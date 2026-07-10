'use client';
import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, X, Mail, RefreshCw, Copy, Check, AlertTriangle, Sparkles } from 'lucide-react';
import { DataTable, Column } from '@/components/shared/DataTable';
import api from '@/lib/axios';

const EMPTY_FORM = {
  name: '', packageId: '', isActive: true, aiCredits: 0, country: 'India',
  adminFirstName: '', adminLastName: '', adminEmail: '', adminPassword: '',
  tradeName: '', industry: '', companyType: '', website: '', email: '', phone: '',
  addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '',
  timezone: 'Asia/Kolkata', baseCurrency: 'INR', financialYearStartMonth: 4,
  panNumber: '', gstin: '', cin: '', tan: '', epfoNumber: '', esicNumber: '', ptNumber: '', lwfNumber: '',
  tin: '', ein: '', vatNumber: '', businessLicenseNumber: '',
  logoUrl: '', adminProfilePictureUrl: '',
  setupFeeAmount: 0, setupFeeCurrency: 'INR' as 'INR' | 'USD', setupFeeStatus: 'PENDING' as 'PENDING' | 'PAID' | 'WAIVED',
  billingCycle: 'MONTHLY' as 'MONTHLY' | 'YEARLY', subscriptionAmount: 0, subscriptionCurrency: 'INR' as 'INR' | 'USD',
  subscriptionStatus: 'ACTIVE' as 'ACTIVE' | 'PENDING' | 'PAST_DUE' | 'CANCELLED',
};

function generateTempPassword() {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnpqrstuvwxyz';
  const digits = '23456789';
  const pick = (set: string) => set[Math.floor(Math.random() * set.length)];
  const body = Array.from({ length: 9 }, () => pick(lower)).join('');
  return `${pick(upper)}${body}${pick(digits)}${pick(digits)}`;
}

export default function SuperAdminCompaniesPage() {
  return (
    <Suspense fallback={null}>
      <SuperAdminCompaniesPageInner />
    </Suspense>
  );
}

function SuperAdminCompaniesPageInner() {
  const searchParams = useSearchParams();
  const [tenants, setTenants] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [credentialsPanel, setCredentialsPanel] = useState<{
    companyName: string; adminEmail: string; emailSent: boolean; passwordFallback?: string; error?: string;
  } | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [topUpTarget, setTopUpTarget] = useState<any>(null);
  const [topUpCredits, setTopUpCredits] = useState<number | ''>('');
  const [topUpSubmitting, setTopUpSubmitting] = useState(false);
  const [topUpError, setTopUpError] = useState('');
  const [topUpResult, setTopUpResult] = useState<{ aiCredits: number; amountCharged: number } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fromLead = searchParams.get('fromLead');
    if (!fromLead) return;
    api.get(`/super-admin/leads/${fromLead}`).then((res) => {
      const lead = res.data;
      const [adminFirstName, ...rest] = (lead.contactName || '').split(' ');
      setFormData((prev) => ({
        ...prev,
        name: lead.companyName || '',
        adminFirstName: adminFirstName || '',
        adminLastName: rest.join(' ') || '',
        adminEmail: lead.contactEmail || '',
        phone: lead.contactPhone || '',
      }));
      setIsModalOpen(true);
    }).catch((e) => console.error('Failed to load lead for conversion:', e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tRes, pRes] = await Promise.all([
        api.get('/super-admin/tenants'),
        api.get('/super-admin/packages')
      ]);
      setTenants(tRes.data || tRes.data.data || []);
      setPackages(pRes.data || pRes.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      if (isEditMode && editId) {
        await api.put(`/super-admin/tenants/${editId}`, formData);
        setIsModalOpen(false);
        resetForm();
      } else {
        const res = await api.post('/super-admin/tenants', formData);
        setIsModalOpen(false);
        resetForm();
        setCredentialsPanel({
          companyName: formData.name,
          adminEmail: res.data.adminEmail,
          emailSent: !!res.data.credentialsEmailSent,
          passwordFallback: res.data.adminPasswordFallback,
          error: res.data.credentialsEmailError,
        });
        const fromLead = searchParams.get('fromLead');
        if (fromLead) {
          api.put(`/super-admin/leads/${fromLead}`, { convertedTenantId: res.data._id }).catch((e) => console.error('Failed to link lead to company:', e));
        }
      }
      fetchData();
    } catch (e: any) {
      setFormError(e?.response?.data?.message || 'Something went wrong. Please review the form and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await api.delete(`/super-admin/tenants/${deleteConfirmId}`);
      fetchData();
      setDeleteConfirmId(null);
    } catch (e) {
      console.error(e);
      alert('Failed to delete company');
    }
  };

  const handleResendCredentials = async (t: any) => {
    setResendingId(t._id);
    try {
      const newPassword = generateTempPassword();
      const res = await api.post(`/super-admin/tenants/${t._id}/resend-credentials`, { newPassword });
      setCredentialsPanel({
        companyName: t.name,
        adminEmail: res.data.adminEmail,
        emailSent: !!res.data.credentialsEmailSent,
        passwordFallback: res.data.adminPasswordFallback,
        error: res.data.credentialsEmailError,
      });
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to resend credentials');
    } finally {
      setResendingId(null);
    }
  };

  const openTopUpModal = (t: any) => {
    setTopUpTarget(t);
    setTopUpCredits('');
    setTopUpError('');
    setTopUpResult(null);
  };

  const handleSubmitTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topUpTarget) return;
    setTopUpError('');
    setTopUpSubmitting(true);
    try {
      const res = await api.post(`/super-admin/tenants/${topUpTarget._id}/topup-ai-credits`, { credits: Number(topUpCredits) });
      setTopUpResult(res.data);
      fetchData();
    } catch (e: any) {
      setTopUpError(e?.response?.data?.message || 'Failed to top up AI credits');
    } finally {
      setTopUpSubmitting(false);
    }
  };

  const topUpPricePerCredit = topUpTarget ? (packages.find((p: any) => p._id === (topUpTarget.packageId?._id || topUpTarget.packageId))?.aiCreditTopUpPriceINR || 0) : 0;
  const topUpEstimatedCost = topUpPricePerCredit * (Number(topUpCredits) || 0);

  const subscriptionAmountForPackage = (pkg: any, billingCycle: 'MONTHLY' | 'YEARLY') => {
    if (!pkg) return 0;
    const perUser = billingCycle === 'YEARLY' ? (pkg.pricePerUserYearlyINR || 0) : (pkg.pricePerUserMonthlyINR || 0);
    return perUser * (pkg.maxUsers || 0);
  };

  const handlePackageChange = (packageId: string) => {
    const pkg = packages.find((p: any) => p._id === packageId);
    setFormData((prev) => ({
      ...prev,
      packageId,
      ...(pkg && {
        setupFeeAmount: pkg.setupFeeINR || 0,
        setupFeeCurrency: 'INR',
        subscriptionAmount: subscriptionAmountForPackage(pkg, prev.billingCycle),
        subscriptionCurrency: 'INR',
        aiCredits: pkg.freeAiCredits || 0,
      }),
    }));
  };

  const handleBillingCycleChange = (billingCycle: 'MONTHLY' | 'YEARLY') => {
    const pkg = packages.find((p: any) => p._id === formData.packageId);
    setFormData((prev) => ({
      ...prev,
      billingCycle,
      ...(pkg && { subscriptionAmount: subscriptionAmountForPackage(pkg, billingCycle) }),
    }));
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
    setFormError('');
    setFormData(EMPTY_FORM);
  };

  const openEditModal = async (t: any) => {
    setIsEditMode(true);
    setEditId(t._id);
    setActiveTab('basic');
    setFormError('');

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
      logoUrl: c.logoUrl || '', adminProfilePictureUrl: t.admin?.profilePictureUrl || '',
      setupFeeAmount: t.setupFeeAmount ?? 0,
      setupFeeCurrency: t.setupFeeCurrency || 'INR',
      setupFeeStatus: t.setupFeeStatus || 'PENDING',
      billingCycle: t.billingCycle || 'MONTHLY',
      subscriptionAmount: t.subscriptionAmount ?? 0,
      subscriptionCurrency: t.subscriptionCurrency || 'INR',
      subscriptionStatus: t.subscriptionStatus || 'ACTIVE',
    });
    setIsModalOpen(true);
  };

  const filteredTenants = tenants.filter((t: any) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.name?.toLowerCase().includes(q) ||
      t.admin?.email?.toLowerCase().includes(q) ||
      t.packageId?.name?.toLowerCase().includes(q)
    );
  });

  const lifecycleLabel = (status: string) => (status || '').split('_').map((w) => w[0] + w.slice(1).toLowerCase()).join(' ');
  const lifecycleColor = (status: string) => {
    if (status === 'ACTIVE' || status === 'LIVE') return 'bg-emerald-100 text-emerald-700';
    if (status === 'SUSPENDED' || status === 'EXPIRED' || status === 'CLOSED') return 'bg-rose-100 text-rose-700';
    return 'bg-amber-100 text-amber-700';
  };

  const columns: Column<any>[] = [
    {
      key: 'name',
      label: 'COMPANY NAME',
      sortable: true,
      render: (v, row) => <Link href={`/super-admin/companies/${row._id}/lifecycle`} className="font-medium hover:text-indigo-600">{v}</Link>,
    },
    {
      key: 'lifecycleStatus',
      label: 'LIFECYCLE',
      width: '160px',
      render: (v) => <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${lifecycleColor(v)}`}>{lifecycleLabel(v || 'ACTIVATION_PENDING')}</span>,
    },
    { key: 'admin.email', label: 'ADMIN EMAIL', render: (_v, row) => row.admin?.email || 'N/A' },
    { key: 'packageId.name', label: 'PACKAGE', render: (_v, row) => row.packageId?.name || 'Custom' },
    {
      key: 'setupFeeStatus',
      label: 'SETUP FEE',
      width: '110px',
      render: (_v, row) => (
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${row.setupFeeStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700'
            : row.setupFeeStatus === 'WAIVED' ? 'bg-zinc-100 text-zinc-600'
              : 'bg-amber-100 text-amber-700'
          }`}>
          {row.setupFeeStatus || 'PENDING'}
        </span>
      ),
    },
    {
      key: 'subscriptionStatus',
      label: 'SUBSCRIPTION',
      width: '130px',
      render: (_v, row) => (
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${row.subscriptionStatus === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700'
            : row.subscriptionStatus === 'PAST_DUE' ? 'bg-rose-100 text-rose-700'
              : 'bg-zinc-100 text-zinc-600'
          }`}>
          {row.subscriptionStatus || 'PENDING'} · {row.billingCycle === 'YEARLY' ? 'Yearly' : 'Monthly'}
        </span>
      ),
    },
    {
      key: 'aiCredits',
      label: 'AI CREDITS',
      width: '90px',
      align: 'center',
      render: (v) => <span className="tabular-nums">{v || 0}</span>,
    },
    {
      key: 'isActive',
      label: 'STATUS',
      width: '90px',
      render: (_v, row) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${row.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      width: '180px',
      sortable: false,
      filterable: false,
      render: (_v, row) => (
        <div className="flex justify-end gap-1.5">
          <button
            onClick={() => openTopUpModal(row)}
            title="Top up AI credits"
            className="p-1.5 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
          >
            <Sparkles size={14} />
          </button>
          <button
            onClick={() => handleResendCredentials(row)}
            disabled={resendingId === row._id}
            title="Resend login credentials"
            className="p-1.5 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors disabled:opacity-40"
          >
            {resendingId === row._id ? <RefreshCw size={14} className="animate-spin" /> : <Mail size={14} />}
          </button>
          <button onClick={() => openEditModal(row)} className="text-xs font-medium text-indigo-600 hover:text-indigo-700 px-1.5">Edit</button>
          <button onClick={() => setDeleteConfirmId(row._id)} className="text-xs font-medium text-rose-600 hover:text-rose-700 px-1.5">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Companies</h1>
          <p className="text-xs text-zinc-500">Manage all customer companies provisioned by CrewCam and their subscriptions.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => { resetForm(); setIsModalOpen(true); }} className="h-8 text-xs">
            Quick Add
          </Button>
          <Button asChild className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white">
            <Link href="/super-admin/companies/new/step-1"><Plus size={14} className="mr-1" /> New Company (Wizard)</Link>
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredTenants}
        rowKey="_id"
        loading={loading}
        showActions={false}
        enableColumnFilters={false}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search company, admin email, or package..."
        currentPage={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        emptyMessage="No companies found. Create one."
      />

      {/* AI Credit Top-Up Modal */}
      {topUpTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm border border-zinc-200/50">
            <div className="px-5 py-4 border-b border-zinc-100 flex justify-between items-center">
              <h2 className="text-sm font-md text-zinc-900 flex items-center gap-1.5"><Sparkles size={14} className="text-violet-500" /> Top Up AI Credits</h2>
              <button onClick={() => setTopUpTarget(null)} className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-1 rounded-md">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <p className="text-xs text-zinc-500">{topUpTarget.name} currently has <strong>{topUpTarget.aiCredits || 0}</strong> AI credits.</p>

              {topUpResult ? (
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-700">
                  Added successfully. New balance: <strong>{topUpResult.aiCredits}</strong> credits.
                  {topUpResult.amountCharged > 0 && <> Charged <strong>₹{topUpResult.amountCharged}</strong> (separate from setup fee — recorded in Invoices).</>}
                </div>
              ) : (
                <form onSubmit={handleSubmitTopUp} className="space-y-3">
                  {topUpError && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{topUpError}</div>}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-md text-zinc-700">Extra Credits to Add</label>
                    <input required type="number" min={1} value={topUpCredits} onChange={(e: any) => setTopUpCredits(e.target.value === '' ? '' : Number(e.target.value))} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2" placeholder="e.g. 100" />
                  </div>
                  {topUpPricePerCredit > 0 ? (
                    <p className="text-[11px] text-zinc-500">₹{topUpPricePerCredit} per credit → estimated cost: <strong>₹{topUpEstimatedCost}</strong> (billed separately, not from setup fee)</p>
                  ) : (
                    <p className="text-[11px] text-amber-600">This package has no top-up price configured — credits will be added at no charge.</p>
                  )}
                  <div className="pt-2 flex justify-end gap-3">
                    <Button type="button" variant="outline" size="sm" onClick={() => setTopUpTarget(null)}>Cancel</Button>
                    <Button type="submit" size="sm" disabled={topUpSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white">{topUpSubmitting ? 'Adding...' : 'Add Credits'}</Button>
                  </div>
                </form>
              )}
              {topUpResult && (
                <div className="pt-2 flex justify-end">
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setTopUpTarget(null)}>Done</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Credentials Result Panel */}
      {credentialsPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-zinc-200/50 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-zinc-100 flex justify-between items-center">
              <h2 className="text-sm font-md text-zinc-900">
                {credentialsPanel.emailSent ? 'Setup Complete' : 'Setup Complete — Email Failed'}
              </h2>
              <button onClick={() => setCredentialsPanel(null)} className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-1 rounded-md">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              {credentialsPanel.emailSent ? (
                <p className="text-sm text-zinc-600">
                  <strong>{credentialsPanel.companyName}</strong> is ready. Login credentials were emailed to{' '}
                  <strong>{credentialsPanel.adminEmail}</strong>.
                </p>
              ) : (
                <>
                  <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3">
                    <AlertTriangle size={15} className="text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-800">
                      Could not email credentials automatically ({credentialsPanel.error || 'SMTP not configured'}).
                      Share these with the customer manually.
                    </p>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between border border-zinc-200 rounded-md px-3 py-2">
                      <span className="text-zinc-500">Email</span>
                      <span className="font-medium">{credentialsPanel.adminEmail}</span>
                    </div>
                    <div className="flex justify-between items-center border border-zinc-200 rounded-md px-3 py-2">
                      <span className="text-zinc-500">Password</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{credentialsPanel.passwordFallback}</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(credentialsPanel.passwordFallback || '');
                            setCopied(true);
                            setTimeout(() => setCopied(false), 1500);
                          }}
                          className="text-zinc-400 hover:text-indigo-600"
                        >
                          {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-400">This password will not be shown again — copy it now.</p>
                </>
              )}
              <div className="pt-2 flex justify-end">
                <Button size="sm" className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setCredentialsPanel(null)}>Done</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm transition-all duration-200 py-10">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-sm border border-zinc-200/50 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5">
              <h3 className="text-lg font-md text-zinc-900 dark:text-zinc-50 mb-2">Delete Company?</h3>
              <p className="text-sm text-zinc-500 mb-6">Are you sure you want to delete this company? This action cannot be undone and will erase all associated data.</p>
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
              <h2 className="text-sm font-md text-zinc-900">{isEditMode ? 'Edit Company' : 'Create New Company'}</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-1 rounded-md transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="flex border-b border-zinc-100 px-5 shrink-0 overflow-x-auto">
              <button onClick={() => setActiveTab('basic')} className={`py-2.5 text-xs font-md border-b-2 mr-6 whitespace-nowrap transition-colors ${activeTab === 'basic' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}>
                Core Settings
              </button>
              <button onClick={() => setActiveTab('billing')} className={`py-2.5 text-xs font-md border-b-2 mr-6 whitespace-nowrap transition-colors ${activeTab === 'billing' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}>
                Billing & Setup
              </button>
              <button onClick={() => setActiveTab('location')} className={`py-2.5 text-xs font-md border-b-2 mr-6 whitespace-nowrap transition-colors ${activeTab === 'location' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}>
                Geography & Finance
              </button>
              <button onClick={() => setActiveTab('compliance')} className={`py-2.5 text-xs font-md border-b-2 whitespace-nowrap transition-colors ${activeTab === 'compliance' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}>
                Statutory & Legal
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdate} className="p-5 flex-1 overflow-y-auto">

              {formError && (
                <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{formError}</div>
              )}

              {activeTab === 'basic' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-md text-zinc-700">Company Name *</label>
                      <input required value={formData.name} onChange={(e: any) => setFormData({ ...formData, name: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="Acme Corp" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-md text-zinc-700">Select Package *</label>
                      <select required value={formData.packageId} onChange={(e: any) => handlePackageChange(e.target.value)} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                        <option value="">Choose a subscription package</option>
                        {packages.map((p: any) => (
                          <option key={p._id} value={p._id}>{p.name} (₹{p.pricePerUserMonthlyINR || 0}/user/mo · ₹{p.setupFeeINR || 0} setup · {p.freeAiCredits || 0} free AI credits)</option>
                        ))}
                      </select>
                      <p className="text-[10px] text-zinc-400">Setup fee and subscription amount in the Billing tab auto-fill from this package — editable before saving.</p>
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
                        <div className="flex gap-2">
                          <input required={!isEditMode} type="text" value={formData.adminPassword} onChange={(e: any) => setFormData({ ...formData, adminPassword: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono" placeholder={isEditMode ? "Leave blank to keep unchanged" : "Min 8 chars, 1 uppercase, 1 number"} />
                          <button type="button" onClick={() => setFormData({ ...formData, adminPassword: generateTempPassword() })} className="px-3 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 whitespace-nowrap">Generate</button>
                        </div>
                        {!isEditMode && <p className="text-[10px] text-zinc-400">This will be emailed to the admin once the company is created.</p>}
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

              {activeTab === 'billing' && (
                <div className="space-y-6 animate-in fade-in">
                  <div>
                    <h3 className="text-xs font-md uppercase tracking-wider text-slate-500 mb-4">One-Time Setup Fee</h3>
                    <div className="grid grid-cols-3 gap-5">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-md text-zinc-700">Amount</label>
                        <input type="number" min={0} step="any" value={formData.setupFeeAmount} onChange={(e: any) => setFormData({ ...formData, setupFeeAmount: Number(e.target.value) || 0 })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-md text-zinc-700">Currency</label>
                        <select value={formData.setupFeeCurrency} onChange={(e: any) => setFormData({ ...formData, setupFeeCurrency: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2">
                          <option value="INR">INR (₹)</option>
                          <option value="USD">USD ($)</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-md text-zinc-700">Status</label>
                        <select value={formData.setupFeeStatus} onChange={(e: any) => setFormData({ ...formData, setupFeeStatus: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2">
                          <option value="PENDING">Pending</option>
                          <option value="PAID">Paid</option>
                          <option value="WAIVED">Waived</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-zinc-100">
                    <h3 className="text-xs font-md uppercase tracking-wider text-slate-500 mb-4">Recurring Subscription</h3>
                    <div className="grid grid-cols-3 gap-5">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-md text-zinc-700">Billing Cycle</label>
                        <select value={formData.billingCycle} onChange={(e: any) => handleBillingCycleChange(e.target.value)} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2">
                          <option value="MONTHLY">Monthly</option>
                          <option value="YEARLY">Yearly</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-md text-zinc-700">Amount per cycle</label>
                        <input type="number" min={0} step="any" value={formData.subscriptionAmount} onChange={(e: any) => setFormData({ ...formData, subscriptionAmount: Number(e.target.value) || 0 })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-md text-zinc-700">Currency</label>
                        <select value={formData.subscriptionCurrency} onChange={(e: any) => setFormData({ ...formData, subscriptionCurrency: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2">
                          <option value="INR">INR (₹)</option>
                          <option value="USD">USD ($)</option>
                        </select>
                      </div>
                      {isEditMode && (
                        <div className="space-y-1.5 col-span-3">
                          <label className="block text-xs font-md text-zinc-700">Subscription Status</label>
                          <select value={formData.subscriptionStatus} onChange={(e: any) => setFormData({ ...formData, subscriptionStatus: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2 max-w-xs">
                            <option value="ACTIVE">Active</option>
                            <option value="PENDING">Pending</option>
                            <option value="PAST_DUE">Past Due</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        </div>
                      )}
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
                <Button type="submit" disabled={submitting} className="h-9 px-4 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 disabled:opacity-60">
                  {submitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Company'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
