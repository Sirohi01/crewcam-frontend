'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Plus, Trash2, X, Sparkles } from 'lucide-react';
import api from '@/lib/axios';

const empty = { title: '', designation: '', kraReport: '', kpisText: '' };

export default function KpaLibraryPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(false);
  const [modalItem, setModalItem] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);
  const [form, setForm] = useState(empty);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/kpa-library');
      setEntries(res.data || []);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to load KPA library');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setError(''); setForm(empty); setModalItem(null); setModal(true); };
  const openEdit = (item: any) => {
    setError('');
    setForm({
      title: item.title || '', designation: item.designation || '',
      kraReport: item.kraReport || '', kpisText: (item.kpis || []).join('\n'),
    });
    setModalItem(item);
    setModal(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const { kpisText, ...rest } = form;
      const payload = { ...rest, kpis: kpisText.split('\n').map((s) => s.trim()).filter(Boolean) };
      if (modalItem?._id) await api.put(`/kpa-library/${modalItem._id}`, payload);
      else await api.post('/kpa-library', payload);
      setModal(false);
      await fetchData();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const executeDelete = async () => {
    if (!deleteConfirm) return;
    setSaving(true);
    try {
      await api.delete(`/kpa-library/${deleteConfirm.id}`);
      setDeleteConfirm(null);
      await fetchData();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Delete failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">KPA Library</h1>
          <p className="text-xs text-zinc-500">Reusable KRA/KPI templates — pick one directly in a Manpower Request, or generate a new one with AI and save it here.</p>
        </div>
        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={openCreate}>
          <Plus size={14} className="mr-1.5" /> Add KPA
        </Button>
      </div>

      {error && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}

      <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
        <CardHeader className="py-3 px-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <CardTitle className="text-sm font-medium">Saved Templates</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {loading && <div className="p-8 text-center text-sm text-zinc-500">Loading...</div>}
            {!loading && entries.length === 0 && <div className="p-8 text-center text-sm text-zinc-500">No KPA templates yet.</div>}
            {!loading && entries.map((item) => (
              <div key={item._id} className="px-5 py-3 flex items-start justify-between gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100">{item.title}</span>
                    {item.designation && <span className="text-xs text-zinc-500">· {item.designation}</span>}
                    {item.source === 'ai-generated' && (
                      <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700"><Sparkles size={10} /> AI</span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{item.kraReport}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => openEdit(item)} className="text-zinc-500 hover:text-indigo-600 p-1 rounded"><Edit2 size={14} /></button>
                  <button onClick={() => setDeleteConfirm({ id: item._id, title: item.title })} className="text-rose-500 hover:text-rose-700 p-1 rounded"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {deleteConfirm && (
        <ConfirmModal title={`Delete ${deleteConfirm.title}?`} busy={saving} onCancel={() => setDeleteConfirm(null)} onConfirm={executeDelete}>
          This KPA template will be removed from the library.
        </ConfirmModal>
      )}

      {modal && (
        <Modal title={`${modalItem ? 'Edit' : 'Create'} KPA Template`} onClose={() => setModal(false)} onSubmit={submit} busy={saving}>
          <Input label="Title" value={form.title} onChange={(e: any) => setForm({ ...form, title: e.target.value })} required />
          <Input label="Designation" value={form.designation} onChange={(e: any) => setForm({ ...form, designation: e.target.value })} />
          <TextArea label="KRA Report" value={form.kraReport} onChange={(e: any) => setForm({ ...form, kraReport: e.target.value })} required />
          <TextArea label="KPIs — one per line" value={form.kpisText} onChange={(e: any) => setForm({ ...form, kpisText: e.target.value })} />
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, onClose, onSubmit, children, busy }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-lg border border-zinc-200/50 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
        <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center rounded-t-xl bg-zinc-50/50 dark:bg-zinc-900/50 sticky top-0">
          <h2 className="text-sm font-md text-zinc-900 dark:text-zinc-100">{title}</h2>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-zinc-600 p-1 rounded-md"><X size={16} /></button>
        </div>
        <form onSubmit={onSubmit} className="p-5 space-y-4">
          {children}
          <div className="pt-3 flex justify-end gap-3">
            <Button type="button" variant="outline" className="h-9 px-4 text-xs" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={busy} className="h-9 px-4 text-xs bg-indigo-600 hover:bg-indigo-700 text-white">{busy ? 'Saving...' : 'Save'}</Button>
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
            <Button size="sm" disabled={busy} className="bg-rose-600 hover:bg-rose-700 text-white" onClick={onConfirm}>{busy ? 'Deleting...' : 'Delete'}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-md text-zinc-700 dark:text-zinc-300">{label}</label>
      <input className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-transparent" {...props} />
    </div>
  );
}

function TextArea({ label, ...props }: any) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-md text-zinc-700 dark:text-zinc-300">{label}</label>
      <textarea className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm px-3.5 py-2 h-20 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-transparent" {...props} />
    </div>
  );
}
