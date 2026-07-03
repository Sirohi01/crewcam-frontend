'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import api from '@/lib/axios';

type Mode = 'features' | 'permissions';

const emptyForm = { name: '', code: '', module: '', description: '' };

export default function SuperAdminFeaturesPage() {
  const [mode, setMode] = useState<Mode>('features');
  const [features, setFeatures] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [featureRes, permissionRes] = await Promise.all([
        api.get('/super-admin/features'),
        api.get('/super-admin/permissions'),
      ]);
      setFeatures(featureRes.data || []);
      setPermissions(permissionRes.data || []);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to load features and permissions');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'features') {
        await api.post('/super-admin/features', {
          name: formData.name,
          code: formData.code,
          description: formData.description,
        });
      } else {
        await api.post('/super-admin/permissions', {
          name: formData.name,
          module: formData.module,
          description: formData.description,
        });
      }
      setIsModalOpen(false);
      setFormData(emptyForm);
      fetchData();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Create failed');
    }
  };

  const activeRows = mode === 'features' ? features : permissions;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Features & RBAC</h1>
          <p className="text-xs text-zinc-500">Manage package feature flags and global permission codes.</p>
        </div>
        <Button onClick={() => { setFormData(emptyForm); setIsModalOpen(true); }} className="h-8 text-xs bg-indigo-600 text-white hover:bg-indigo-700">
          <Plus size={14} className="mr-1" /> Add {mode === 'features' ? 'Feature' : 'Permission'}
        </Button>
      </div>

      {error && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}

      <div className="inline-flex rounded-md border border-zinc-200 bg-white p-0.5">
        <button onClick={() => setMode('features')} className={`px-3 py-1.5 text-xs rounded ${mode === 'features' ? 'bg-indigo-600 text-white' : 'text-zinc-600'}`}>Feature Flags</button>
        <button onClick={() => setMode('permissions')} className={`px-3 py-1.5 text-xs rounded ${mode === 'permissions' ? 'bg-indigo-600 text-white' : 'text-zinc-600'}`}>Permissions</button>
      </div>

      <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
        <CardContent className="p-0">
          <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2 bg-zinc-50 dark:bg-zinc-900 flex gap-4 text-xs font-md text-zinc-500">
            <div className="w-1/3">{mode === 'features' ? 'FEATURE CODE' : 'PERMISSION CODE'}</div>
            <div className="w-1/4">{mode === 'features' ? 'FEATURE NAME' : 'MODULE'}</div>
            <div className="flex-1">DESCRIPTION</div>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {activeRows.map((item: any) => (
              <div key={item._id} className="px-4 py-2.5 flex items-center gap-4 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                <div className="w-1/3 font-medium text-indigo-600">{mode === 'features' ? item.code : item.name}</div>
                <div className="w-1/4 text-zinc-500">{mode === 'features' ? item.name : item.module}</div>
                <div className="flex-1 text-zinc-500">{item.description}</div>
              </div>
            ))}
            {activeRows.length === 0 && (
              <div className="p-8 text-center text-zinc-500 text-sm">No records found.</div>
            )}
          </div>
        </CardContent>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-zinc-200/50">
            <div className="px-5 py-4 border-b border-zinc-100 flex justify-between items-center bg-white">
              <h2 className="text-sm font-md text-zinc-900">Create {mode === 'features' ? 'Feature' : 'Permission'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-1 rounded-md">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-5">
              <Field label={mode === 'features' ? 'Feature Name' : 'Permission Code'} value={formData.name} onChange={(value) => setFormData({ ...formData, name: mode === 'permissions' ? value.toUpperCase() : value })} required />
              {mode === 'features' ? (
                <Field label="Feature Code" value={formData.code} onChange={(value) => setFormData({ ...formData, code: value.toUpperCase() })} required />
              ) : (
                <Field label="Module" value={formData.module} onChange={(value) => setFormData({ ...formData, module: value })} required />
              )}
              <Field label="Description" value={formData.description} onChange={(value) => setFormData({ ...formData, description: value })} required />
              <div className="pt-3 flex justify-end gap-3">
                <Button type="button" variant="outline" className="h-9 px-4 text-xs" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="h-9 px-4 text-xs bg-indigo-600 hover:bg-indigo-700 text-white">Create</Button>
              </div>
            </form>
          </div>
        </div>
      )}
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
      <label className="block text-xs font-md text-zinc-700">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" {...props} />
    </div>
  );
}
