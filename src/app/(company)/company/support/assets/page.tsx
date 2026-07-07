'use client';

import React, { useEffect, useMemo, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';
import {
  Plus, Search, Monitor, Smartphone, Car, Settings, X, Edit2, ArrowLeftRight, Undo2,
} from 'lucide-react';

const emptyForm = { name: '', type: 'Laptop', serialNumber: '', purchaseDate: '', status: 'Available' };
const STATUS_OPTIONS = ['Available', 'Allocated', 'Maintenance', 'Retired'];
const TYPE_OPTIONS = ['Laptop', 'Mobile', 'Tablet', 'Vehicle', 'Other'];

export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'inventory' | 'allocations'>('inventory');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [modalItem, setModalItem] = useState<any | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const [allocateAsset, setAllocateAsset] = useState<any | null>(null);
  const [allocateEmployeeId, setAllocateEmployeeId] = useState('');
  const [allocateCondition, setAllocateCondition] = useState('');

  useEffect(() => {
    api.get('/employees').then((res) => setEmployees(res.data.data || [])).catch(() => setEmployees([]));
  }, []);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'inventory') {
        const res = await api.get('/support/assets');
        setAssets(res.data || []);
      } else {
        const res = await api.get('/support/assets/allocations');
        setAllocations(res.data || []);
      }
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const employeeMap = useMemo(() => new Map(employees.map((e) => [e._id, `${e.firstName} ${e.lastName}`])), [employees]);

  const filteredAssets = assets.filter((asset) => {
    if (statusFilter !== 'all' && asset.status !== statusFilter) return false;
    const text = `${asset.name} ${asset.type} ${asset.serialNumber}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  const filteredAllocations = allocations.filter((alloc) => {
    const empName = alloc.employeeId ? `${alloc.employeeId.firstName} ${alloc.employeeId.lastName}` : '';
    const text = `${empName} ${alloc.assetId?.name || ''}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  const openCreate = () => {
    setFormData(emptyForm);
    setModalItem({});
    setError('');
  };

  const openEdit = (asset: any) => {
    setFormData({
      name: asset.name || '',
      type: asset.type || 'Laptop',
      serialNumber: asset.serialNumber || '',
      purchaseDate: asset.purchaseDate ? asset.purchaseDate.substring(0, 10) : '',
      status: asset.status || 'Available',
    });
    setModalItem(asset);
    setError('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (modalItem?._id) {
        await api.put(`/support/assets/${modalItem._id}`, formData);
      } else {
        await api.post('/support/assets', formData);
      }
      setModalItem(null);
      await fetchData();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const submitAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocateEmployeeId) return;
    setSaving(true);
    setError('');
    try {
      await api.post('/support/assets/allocate', {
        assetId: allocateAsset._id,
        employeeId: allocateEmployeeId,
        condition: allocateCondition,
      });
      setAllocateAsset(null);
      setAllocateEmployeeId('');
      setAllocateCondition('');
      await fetchData();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to allocate asset');
    } finally {
      setSaving(false);
    }
  };

  const handleReturn = async (allocation: any) => {
    if (!confirm('Mark this asset as returned?')) return;
    setSaving(true);
    try {
      await api.post(`/support/assets/return/${allocation._id}`, {});
      await fetchData();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to return asset');
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400';
      case 'Allocated': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
      case 'Maintenance': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400';
      case 'Retired': return 'bg-zinc-200 text-zinc-600 dark:bg-zinc-500/20 dark:text-zinc-400';
      default: return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-400';
    }
  };

  const getAssetIcon = (type: string) => {
    const t = (type || '').toLowerCase();
    if (t.includes('laptop') || t.includes('computer')) return <Monitor size={14} />;
    if (t.includes('mobile') || t.includes('phone')) return <Smartphone size={14} />;
    if (t.includes('vehicle') || t.includes('car')) return <Car size={14} />;
    return <Settings size={14} />;
  };

  return (
    <div className="space-y-4 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Asset Management</h1>
          <p className="text-xs text-zinc-500">Manage company assets and track employee allocations.</p>
        </div>
        <Button onClick={openCreate} className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus size={14} className="mr-1" /> Add Asset
        </Button>
      </div>

      {error && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}

      <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
        <CardHeader className="py-0 px-0 border-b border-zinc-200 dark:border-zinc-800 flex flex-row items-center gap-0">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${activeTab === 'inventory' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
          >
            Asset Inventory
          </button>
          <button
            onClick={() => setActiveTab('allocations')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${activeTab === 'allocations' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
          >
            Employee Allocations
          </button>
        </CardHeader>

        <div className="px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2 bg-zinc-50/50 dark:bg-zinc-900/20">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-1.5 h-4 w-4 text-zinc-500" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, type, or S/N..." className="h-7 pl-8 text-xs" />
          </div>
          {activeTab === 'inventory' && (
            <div className="inline-flex rounded-md border border-zinc-200 bg-white p-0.5 dark:bg-zinc-900 dark:border-zinc-800">
              {['all', ...STATUS_OPTIONS].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2 py-1 text-[11px] rounded ${statusFilter === s ? 'bg-zinc-900 text-white' : 'text-zinc-600 dark:text-zinc-400'}`}
                >
                  {s === 'all' ? 'All' : s}
                </button>
              ))}
            </div>
          )}
        </div>

        <CardContent className="p-0">
          {activeTab === 'inventory' ? (
            <>
              <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2 grid grid-cols-[2fr_1fr_1fr_1fr_90px] gap-4 text-[10px] font-md text-zinc-500 uppercase tracking-wider bg-zinc-50/50 dark:bg-zinc-900/20">
                <div>Asset Name</div>
                <div>S/N</div>
                <div>Type</div>
                <div>Status</div>
                <div className="text-right">Actions</div>
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {loading && <div className="p-4 text-center text-xs text-zinc-500">Loading...</div>}
                {!loading && filteredAssets.length === 0 && <div className="p-4 text-center text-xs text-zinc-500">No assets found.</div>}
                {!loading && filteredAssets.map((asset) => (
                  <div key={asset._id} className="px-4 py-2 grid grid-cols-[2fr_1fr_1fr_1fr_90px] gap-4 items-center hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 shrink-0 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                        {getAssetIcon(asset.type)}
                      </div>
                      <span className="text-xs font-md text-zinc-900 dark:text-zinc-100 truncate">{asset.name}</span>
                    </div>
                    <div className="text-xs font-mono text-zinc-600 dark:text-zinc-400 truncate">{asset.serialNumber}</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 truncate">{asset.type}</div>
                    <div>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-md ${getStatusColor(asset.status)}`}>
                        {asset.status}
                      </span>
                    </div>
                    <div className="flex justify-end gap-1">
                      {asset.status === 'Available' && (
                        <button
                          type="button"
                          title="Allocate to Employee"
                          onClick={() => setAllocateAsset(asset)}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 text-zinc-500 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                        >
                          <ArrowLeftRight size={13} />
                        </button>
                      )}
                      <button
                        type="button"
                        title="Edit Asset"
                        onClick={() => openEdit(asset)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 text-zinc-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <Edit2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2 grid grid-cols-[1.5fr_1.5fr_1fr_1fr_90px] gap-4 text-[10px] font-md text-zinc-500 uppercase tracking-wider bg-zinc-50/50 dark:bg-zinc-900/20">
                <div>Employee</div>
                <div>Asset</div>
                <div>Allocated Date</div>
                <div>Status</div>
                <div className="text-right">Actions</div>
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {loading && <div className="p-4 text-center text-xs text-zinc-500">Loading...</div>}
                {!loading && filteredAllocations.length === 0 && <div className="p-4 text-center text-xs text-zinc-500">No allocations found.</div>}
                {!loading && filteredAllocations.map((alloc) => (
                  <div key={alloc._id} className="px-4 py-2 grid grid-cols-[1.5fr_1.5fr_1fr_1fr_90px] gap-4 items-center hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <div className="text-xs font-md text-zinc-900 dark:text-zinc-100 truncate">
                      {alloc.employeeId ? `${alloc.employeeId.firstName} ${alloc.employeeId.lastName}` : 'Unknown'}
                    </div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 truncate">{alloc.assetId?.name || 'Unknown Asset'}</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">{new Date(alloc.allocatedDate).toLocaleDateString()}</div>
                    <div>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-md ${alloc.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-200 text-zinc-600'}`}>
                        {alloc.status}
                      </span>
                    </div>
                    <div className="flex justify-end">
                      {alloc.status === 'Active' && (
                        <button
                          type="button"
                          title="Mark as Returned"
                          onClick={() => handleReturn(alloc)}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 text-rose-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                        >
                          <Undo2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {modalItem && (
        <Modal title={`${modalItem._id ? 'Edit' : 'Add New'} Asset`} busy={saving} onClose={() => setModalItem(null)} onSubmit={submit}>
          <div className="space-y-3">
            <Field label="Asset Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} required placeholder="e.g. MacBook Pro M2" />
            <div className="grid grid-cols-2 gap-3">
              <Select label="Type" value={formData.type} options={TYPE_OPTIONS} onChange={(v) => setFormData({ ...formData, type: v })} />
              <Select label="Status" value={formData.status} options={STATUS_OPTIONS} onChange={(v) => setFormData({ ...formData, status: v })} />
            </div>
            <Field label="Serial Number / IMEI" value={formData.serialNumber} onChange={(v) => setFormData({ ...formData, serialNumber: v })} required />
            <Field label="Purchase Date" type="date" value={formData.purchaseDate} onChange={(v) => setFormData({ ...formData, purchaseDate: v })} />
          </div>
        </Modal>
      )}

      {allocateAsset && (
        <Modal title={`Allocate "${allocateAsset.name}"`} busy={saving} onClose={() => setAllocateAsset(null)} onSubmit={submitAllocate}>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block">Employee <span className="text-rose-500">*</span></label>
              <SearchableDropdown
                options={employees.map((e) => ({ label: `${e.firstName} ${e.lastName}`, value: e._id }))}
                value={allocateEmployeeId}
                onChange={setAllocateEmployeeId}
                placeholder="-- Select employee --"
              />
            </div>
            <Field label="Condition Note" value={allocateCondition} onChange={setAllocateCondition} placeholder="e.g. New / Good condition" />
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, onClose, onSubmit, children, busy }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-md border border-zinc-200/50 dark:border-zinc-800 flex flex-col" style={{ maxHeight: '90vh' }}>
        <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 rounded-t-xl shrink-0">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
            <button type="button" onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
              <X size={18} />
            </button>
          </div>
          <div className="overflow-y-auto flex-1 px-5 py-4 custom-scrollbar">
            {children}
          </div>
          <div className="px-5 py-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3 shrink-0">
            <Button type="button" variant="outline" className="h-8 px-3 text-xs bg-white" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={busy} className="h-8 px-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white">{busy ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </div>
    </div>
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
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="h-8 text-xs bg-white dark:bg-zinc-900" {...props} />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block">{label}</label>
      <SearchableDropdown
        options={options.map((opt) => ({ label: opt, value: opt }))}
        value={value}
        onChange={onChange}
        placeholder="-- Select --"
      />
    </div>
  );
}
