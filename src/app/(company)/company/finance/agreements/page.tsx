'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSignature, CheckCircle, XCircle, FileText } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';

export default function AgreementsPage() {
  const token = useAuthStore(state => state.token);
  const user = useAuthStore(state => state.user);
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');

  const { data: agreements, isLoading } = useQuery({
    queryKey: ['agreements'],
    queryFn: async () => {
      const res = await fetch('http://localhost:8000/api/v1/finance/agreements', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch agreements');
      return res.json();
    },
    enabled: !!token
  });

  const createAgreementMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch('http://localhost:8000/api/v1/finance/agreements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to create agreement');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agreements'] });
      alert('Agreement created successfully');
      setForm({ title: '', type: 'MOU', partiesInvolved: '', startDate: '', endDate: '' });
      setActiveTab('list');
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const res = await fetch(`http://localhost:8000/api/v1/finance/agreements/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agreements'] });
    }
  });

  const [form, setForm] = useState({ title: '', type: 'MOU', partiesInvolved: '', startDate: '', endDate: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAgreementMutation.mutate({
      ...form,
      partiesInvolved: form.partiesInvolved.split(',').map(s => s.trim())
    });
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-md px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle size={10} /> Active</span>;
      case 'Expired': return <span className="bg-amber-100 text-amber-800 text-[10px] font-md px-2 py-0.5 rounded-full flex items-center gap-1">Expired</span>;
      case 'Terminated': return <span className="bg-rose-100 text-rose-800 text-[10px] font-md px-2 py-0.5 rounded-full flex items-center gap-1"><XCircle size={10} /> Terminated</span>;
      default: return <span className="bg-zinc-100 text-zinc-800 text-[10px] font-md px-2 py-0.5 rounded-full flex items-center gap-1">Draft</span>;
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300 pb-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Legal Agreements</h1>
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-md">MOU, JV, Rent & Corporate</p>
        </div>
        <div className="flex bg-zinc-100 p-1 rounded-md dark:bg-zinc-800">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-3 py-1 text-xs font-md rounded ${activeTab === 'list' ? 'bg-white shadow text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            All Agreements
          </button>
          {(user as any)?.role !== 'Employee' && (
            <button
              onClick={() => setActiveTab('add')}
              className={`px-3 py-1 text-xs font-md rounded ${activeTab === 'add' ? 'bg-white shadow text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              New Agreement
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'list' && (
          <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-md flex items-center gap-2">
                <FileSignature size={16} className="text-indigo-600" />
                Agreement Repository
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-4 text-center text-sm text-zinc-500">Loading...</div>
              ) : agreements?.length === 0 ? (
                <div className="py-8 text-center text-sm text-zinc-500 border border-dashed rounded-lg">No agreements found.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {agreements?.map((agr: any) => (
                    <div key={agr._id} className="border rounded-lg p-4 bg-zinc-50 dark:bg-zinc-800/50">
                      <div className="flex justify-between items-start mb-2 border-b pb-2 border-zinc-200 dark:border-zinc-700">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-zinc-500" />
                          <h4 className="font-md text-sm text-zinc-900 dark:text-zinc-100">{agr.title}</h4>
                        </div>
                        {renderStatusBadge(agr.status)}
                      </div>
                      <div className="space-y-1 mb-4">
                        <div className="text-xs"><span className="text-zinc-500 font-md w-16 inline-block">Type:</span> {agr.type}</div>
                        <div className="text-xs"><span className="text-zinc-500 font-md w-16 inline-block">Parties:</span> {agr.partiesInvolved?.join(', ')}</div>
                        <div className="text-xs"><span className="text-zinc-500 font-md w-16 inline-block">Valid:</span> {new Date(agr.startDate).toLocaleDateString()} {agr.endDate ? `- ${new Date(agr.endDate).toLocaleDateString()}` : '(No Expiry)'}</div>
                      </div>

                      {(user as any)?.role !== 'Employee' && (
                        <div className="flex gap-2 justify-end border-t border-zinc-200 dark:border-zinc-700 pt-3">
                          {agr.status === 'Draft' && <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updateStatusMutation.mutate({ id: agr._id, status: 'Active' })}>Mark Active</Button>}
                          {agr.status === 'Active' && <Button size="sm" variant="outline" className="h-7 text-xs text-rose-600 hover:text-rose-700" onClick={() => updateStatusMutation.mutate({ id: agr._id, status: 'Terminated' })}>Terminate</Button>}
                          <Button size="sm" variant="secondary" className="h-7 text-xs">View Document</Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'add' && (user as any)?.role !== 'Employee' && (
          <Card className="max-w-xl mx-auto border-zinc-200/80 shadow-sm dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-md">Create New Agreement</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-md text-zinc-700 mb-1 block">Title / Document Name</label>
                  <input required type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" placeholder="e.g. Master Services Agreement" />
                </div>
                <div>
                  <label className="text-xs font-md text-zinc-700 mb-1 block">Agreement Type</label>
                  <select required value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm">
                    <option value="MOU">MOU (Memorandum of Understanding)</option>
                    <option value="JV">JV (Joint Venture)</option>
                    <option value="Rent">Rent Agreement</option>
                    <option value="Company">Company / Corporate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-md text-zinc-700 mb-1 block">Parties Involved (Comma Separated)</label>
                  <input required type="text" value={form.partiesInvolved} onChange={e => setForm({ ...form, partiesInvolved: e.target.value })} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" placeholder="e.g. Namo Gange, Tech Corp Ltd" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-md text-zinc-700 mb-1 block">Start Date</label>
                    <input required type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-md text-zinc-700 mb-1 block">End Date (Optional)</label>
                    <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" />
                  </div>
                </div>
                <Button type="submit" disabled={createAgreementMutation.isPending} className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                  {createAgreementMutation.isPending ? 'Creating...' : 'Create Agreement'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
