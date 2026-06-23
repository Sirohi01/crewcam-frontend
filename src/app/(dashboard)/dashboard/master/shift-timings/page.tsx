'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Plus, Search, Trash2, X, AlertCircle } from 'lucide-react';
import api from '@/lib/axios';

const initialForm = {
  name: '', code: '', description: '',
  checkInTime: '09:00', checkOutTime: '18:00',
  gracePeriodLC: 15, gracePeriodEG: 15, halfDayThresholdMHD: 4, absentThreshold: '12:00',
  isSandwichRuleApplicable: false, weekOffDays: ['Sunday'],
  workOnWeekOffMultiplier: 2.0, workOnHolidayMultiplier: 2.0, isActive: true
};

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ShiftTimingsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });

  const [modalItem, setModalItem] = useState<any | null>(null);
  const [deleteItem, setDeleteItem] = useState<any | null>(null);
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    fetchItems();
  }, [page, debouncedSearch]);

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/master-data/shift-timings?page=${page}&limit=10&search=${encodeURIComponent(debouncedSearch)}`);
      setItems(res.data.data || []);
      if (res.data.meta) setMeta(res.data.meta);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to load Shift Timings');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setFormData(initialForm);
    setModalItem('new');
    setError('');
  };

  const openEdit = (item: any) => {
    setFormData({
      name: item.name || '',
      code: item.code || '',
      description: item.description || '',
      checkInTime: item.checkInTime || '09:00',
      checkOutTime: item.checkOutTime || '18:00',
      gracePeriodLC: item.gracePeriodLC || 15,
      gracePeriodEG: item.gracePeriodEG || 15,
      halfDayThresholdMHD: item.halfDayThresholdMHD || 4,
      absentThreshold: item.absentThreshold || '12:00',
      isSandwichRuleApplicable: !!item.isSandwichRuleApplicable,
      weekOffDays: item.weekOffDays || ['Sunday'],
      workOnWeekOffMultiplier: item.workOnWeekOffMultiplier || 2.0,
      workOnHolidayMultiplier: item.workOnHolidayMultiplier || 2.0,
      isActive: item.isActive ?? true
    });
    setModalItem(item);
    setError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (modalItem === 'new') {
        await api.post('/master-data/shift-timings', formData);
      } else {
        await api.put(`/master-data/shift-timings/${modalItem._id}`, formData);
      }
      setModalItem(null);
      fetchItems();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    setSaving(true);
    setError('');
    try {
      await api.delete(`/master-data/shift-timings/${deleteItem._id}`);
      setDeleteItem(null);
      fetchItems();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Delete failed');
    } finally {
      setSaving(false);
    }
  };

  const toggleWeekDay = (day: string) => {
    setFormData(prev => {
      const isSelected = prev.weekOffDays.includes(day);
      const newDays = isSelected ? prev.weekOffDays.filter(d => d !== day) : [...prev.weekOffDays, day];
      return { ...prev, weekOffDays: newDays };
    });
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50">Shift Timings</h1>
          <p className="text-xs text-zinc-500 mt-1">Manage attendance shifts, timings, grace periods and rules.</p>
        </div>
        <Button onClick={openCreate} className="h-9 text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
          <Plus size={14} className="mr-1.5" /> Add Shift Timing
        </Button>
      </div>

      {error && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}

      <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
        <CardHeader className="py-3 px-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-sm font-medium">Shift Timings List</CardTitle>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search shift timings...`} className="h-9 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-3 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-sm" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading && <div className="p-6 text-sm text-center text-zinc-500">Loading Shift Timings...</div>}
          {!loading && items.length === 0 && (
            <div className="p-12 text-center">
              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">No Shift Timings found</div>
              <div className="mt-1 text-xs text-zinc-500">Click “Add Shift Timing” to create your first record.</div>
            </div>
          )}
          {!loading && items.length > 0 && (
            <div className="flex flex-col overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Timings</th>
                    <th className="px-5 py-3 font-medium">Grace (LC/EG)</th>
                    <th className="px-5 py-3 font-medium">Half-Day/Absent</th>
                    <th className="px-5 py-3 font-medium text-right w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {items.map((item) => (
                    <tr key={item._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group">
                      <td className="px-5 py-3 align-middle">
                        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.name}</div>
                        <div className="text-[11px] text-zinc-500">{item.code}</div>
                      </td>
                      <td className="px-5 py-3 align-middle">
                        <div className="text-sm text-zinc-700">{item.checkInTime} to {item.checkOutTime}</div>
                        <div className="text-[11px] text-zinc-500">Off: {item.weekOffDays.join(', ')}</div>
                      </td>
                      <td className="px-5 py-3 align-middle">
                        <div className="text-sm text-zinc-700">{item.gracePeriodLC}m / {item.gracePeriodEG}m</div>
                      </td>
                      <td className="px-5 py-3 align-middle">
                        <div className="text-sm text-zinc-700">{item.halfDayThresholdMHD} hrs / {item.absentThreshold}</div>
                        {item.isSandwichRuleApplicable && <div className="text-[11px] text-orange-600">Sandwich Rule On</div>}
                      </td>
                      <td className="px-5 py-3 align-middle text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => openEdit(item)} className="text-zinc-400 hover:bg-zinc-200 hover:text-indigo-600 p-1.5 rounded-md transition-colors"><Edit2 size={14} /></button>
                          <button onClick={() => setDeleteItem(item)} className="text-zinc-400 hover:bg-rose-100 hover:text-rose-600 p-1.5 rounded-md transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {meta.totalPages > 1 && (
                <div className="px-4 py-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
                  <div className="text-xs text-zinc-500">Showing page {meta.page} of {meta.totalPages} ({meta.total} records)</div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="h-8 text-xs" disabled={meta.page <= 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs" disabled={meta.page >= meta.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {modalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-lg font-medium">{modalItem === 'new' ? 'Add' : 'Edit'} Shift Timing</h3>
              <button onClick={() => setModalItem(null)} className="text-zinc-400 hover:text-zinc-600"><X size={18} /></button>
            </div>
            <div className="p-5 overflow-y-auto">
              <form id="shift-form" onSubmit={handleSave} className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2 md:col-span-1">
                  <label className="text-xs font-medium text-zinc-700">Shift Name *</label>
                  <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm" />
                </div>
                <div className="space-y-1 col-span-2 md:col-span-1">
                  <label className="text-xs font-medium text-zinc-700">Shift Code</label>
                  <input value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm" />
                </div>
                
                <div className="space-y-1 col-span-2 md:col-span-1">
                  <label className="text-xs font-medium text-zinc-700">Check-In Time *</label>
                  <input required type="time" value={formData.checkInTime} onChange={(e) => setFormData({...formData, checkInTime: e.target.value})} className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm" />
                </div>
                <div className="space-y-1 col-span-2 md:col-span-1">
                  <label className="text-xs font-medium text-zinc-700">Check-Out Time *</label>
                  <input required type="time" value={formData.checkOutTime} onChange={(e) => setFormData({...formData, checkOutTime: e.target.value})} className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm" />
                </div>

                <div className="space-y-1 col-span-2 md:col-span-1">
                  <label className="text-xs font-medium text-zinc-700">Late Coming Grace (mins)</label>
                  <input type="number" required min="0" value={formData.gracePeriodLC} onChange={(e) => setFormData({...formData, gracePeriodLC: Number(e.target.value)})} className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm" />
                </div>
                <div className="space-y-1 col-span-2 md:col-span-1">
                  <label className="text-xs font-medium text-zinc-700">Early Going Grace (mins)</label>
                  <input type="number" required min="0" value={formData.gracePeriodEG} onChange={(e) => setFormData({...formData, gracePeriodEG: Number(e.target.value)})} className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm" />
                </div>

                <div className="space-y-1 col-span-2 md:col-span-1">
                  <label className="text-xs font-medium text-zinc-700">MHD Threshold (hours)</label>
                  <input type="number" required min="0" step="0.5" value={formData.halfDayThresholdMHD} onChange={(e) => setFormData({...formData, halfDayThresholdMHD: Number(e.target.value)})} className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm" />
                  <p className="text-[10px] text-zinc-500">Minimum work hours to avoid Half Day</p>
                </div>
                <div className="space-y-1 col-span-2 md:col-span-1">
                  <label className="text-xs font-medium text-zinc-700">Absent Threshold Time</label>
                  <input type="time" required value={formData.absentThreshold} onChange={(e) => setFormData({...formData, absentThreshold: e.target.value})} className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm" />
                  <p className="text-[10px] text-zinc-500">Check-in past this time marks Absent</p>
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-medium text-zinc-700">Week-Off Days</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {WEEK_DAYS.map(day => (
                      <button type="button" key={day} onClick={() => toggleWeekDay(day)} className={`px-3 py-1.5 text-[11px] rounded-full border transition-colors ${formData.weekOffDays.includes(day) ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-zinc-200 text-zinc-600'}`}>
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 col-span-2 md:col-span-1">
                  <label className="text-xs font-medium text-zinc-700">Week-Off Pay Multiplier</label>
                  <input type="number" required min="1" step="0.1" value={formData.workOnWeekOffMultiplier} onChange={(e) => setFormData({...formData, workOnWeekOffMultiplier: Number(e.target.value)})} className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm" />
                </div>
                <div className="space-y-1 col-span-2 md:col-span-1">
                  <label className="text-xs font-medium text-zinc-700">Holiday Pay Multiplier</label>
                  <input type="number" required min="1" step="0.1" value={formData.workOnHolidayMultiplier} onChange={(e) => setFormData({...formData, workOnHolidayMultiplier: Number(e.target.value)})} className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm" />
                </div>

                <div className="space-y-1 col-span-2 flex items-center gap-2 mt-2">
                  <input type="checkbox" id="sandwichRule" checked={formData.isSandwichRuleApplicable} onChange={(e) => setFormData({...formData, isSandwichRuleApplicable: e.target.checked})} className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600" />
                  <label htmlFor="sandwichRule" className="text-sm font-medium text-zinc-700 cursor-pointer">Enable Sandwich Rule</label>
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-medium text-zinc-700">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full rounded-md border border-zinc-200 p-3 text-sm min-h-[60px]" />
                </div>
              </form>
            </div>
            <div className="p-5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setModalItem(null)}>Cancel</Button>
              <Button type="submit" form="shift-form" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={saving}>
                {saving ? 'Saving...' : 'Save Shift Timing'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 mb-4">
                <AlertCircle className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Delete Shift Timing</h3>
              <p className="text-sm text-zinc-500 mt-2">Are you sure you want to delete "{deleteItem.name}"? This action cannot be undone.</p>
            </div>
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 flex justify-center gap-3">
              <Button variant="outline" onClick={() => setDeleteItem(null)} className="flex-1">Cancel</Button>
              <Button onClick={handleDelete} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white" disabled={saving}>
                {saving ? 'Deleting...' : 'Yes, Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
