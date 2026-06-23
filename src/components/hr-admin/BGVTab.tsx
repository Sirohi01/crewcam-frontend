'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, UploadCloud, Search, Plus, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export default function BGVTab({ employees, selectedEmployeeId }: { employees: any[], selectedEmployeeId?: string }) {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [form, setForm] = useState({ employeeId: '', vendor: '', checksRequested: 'Identity, Address, Criminal, Education' });
  const [modal, setModal] = useState<any | null>(null);

  const { data: bgvRequests, isLoading } = useQuery({
    queryKey: ['bgv-requests'],
    queryFn: async () => (await api.get('/hr-admin/bgv')).data,
  });

  const filteredRequests = React.useMemo(() => {
    if (!bgvRequests) return [];
    if (!selectedEmployeeId || selectedEmployeeId === 'all') return bgvRequests;
    return bgvRequests.filter((r: any) => r.employeeId?._id === selectedEmployeeId || r.candidateId?._id === selectedEmployeeId);
  }, [bgvRequests, selectedEmployeeId]);

  const createMutation = useMutation({
    mutationFn: async (payload: any) => (await api.post('/hr-admin/bgv', payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bgv-requests'] });
      alert('BGV request initiated.');
      setForm({ employeeId: '', vendor: '', checksRequested: 'Identity, Address, Criminal, Education' });
      setIsDrawerOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: any) => (await api.put(`/hr-admin/bgv/${id}`, data)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bgv-requests'] });
      alert('BGV status updated.');
      setModal(null);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ ...form, checksRequested: form.checksRequested.split(',').map(s => s.trim()) });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Initiated': return 'bg-zinc-100 text-zinc-700 border border-zinc-200';
      case 'InProgress': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Completed': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'Flagged': return 'bg-rose-50 text-rose-700 border border-rose-200';
      default: return 'bg-zinc-100 text-zinc-700';
    }
  };

  return (
    <div className="flex flex-col gap-3 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div></div>
        <Button size="sm" onClick={() => setIsDrawerOpen(true)} className="h-8 text-xs bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 flex items-center gap-1.5">
          <Plus size={14} /> Initiate BGV
        </Button>
      </div>

      <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 h-full">
        <CardHeader>
          <CardTitle className="text-md font-medium flex items-center gap-2">
            <Search size={16} className="text-zinc-600" />
            Background Verification Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-4 text-center text-sm text-zinc-500">Loading...</div>
          ) : filteredRequests?.length === 0 ? (
            <div className="py-8 text-center text-sm text-zinc-500 border border-dashed rounded-lg">
              {selectedEmployeeId && selectedEmployeeId !== 'all' ? 'No BGV requests found for this employee.' : 'No active BGV requests.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500">
                  <tr>
                    <th className="px-4 py-2 font-medium">Employee / Candidate</th>
                    <th className="px-4 py-2 font-medium">Vendor</th>
                    <th className="px-4 py-2 font-medium text-center">Status</th>
                    <th className="px-4 py-2 font-medium">Result</th>
                    <th className="px-4 py-2 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredRequests?.map((req: any) => (
                    <tr key={req._id}>
                      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                        {req.employeeId ? `${req.employeeId.firstName} ${req.employeeId.lastName}` : (req.candidateId ? `${req.candidateId.firstName} ${req.candidateId.lastName}` : 'Unknown')}
                      </td>
                      <td className="px-4 py-3 text-zinc-600">{req.vendor}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(req.status)}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {req.overallResult === 'Clear' && <span className="text-emerald-600 font-medium text-xs">Clear</span>}
                        {req.overallResult === 'Discrepancy' && <span className="text-rose-600 font-medium text-xs">Discrepancy</span>}
                        {req.overallResult === 'Pending' && <span className="text-zinc-400 text-xs">-</span>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setModal({ ...req })}>
                          Update
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Slide-over Form */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-zinc-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-zinc-950 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
              <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">Initiate BGV</h2>
              <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Employee (or Candidate)</label>
                  <select required value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })} className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm dark:bg-zinc-900">
                    <option value="">Select Employee</option>
                    {employees?.map((emp: any) => (
                      <option key={emp._id} value={emp._id}>{emp.firstName} {emp.lastName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Verification Vendor</label>
                  <input required type="text" value={form.vendor} onChange={e => setForm({ ...form, vendor: e.target.value })} className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm dark:bg-zinc-900" placeholder="e.g. AuthBridge, HireRight" />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Checks Requested (comma separated)</label>
                  <textarea rows={3} required value={form.checksRequested} onChange={e => setForm({ ...form, checksRequested: e.target.value })} className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm dark:bg-zinc-900 resize-none" />
                </div>
              </form>
            </div>
            
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3 bg-zinc-50 dark:bg-zinc-900/50">
              <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={createMutation.isPending} className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900">
                {createMutation.isPending ? 'Initiating...' : 'Initiate Verification'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* BGV Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-zinc-900/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
              <h2 className="text-md font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2"><UploadCloud size={16} /> Update BGV Status</h2>
              <button onClick={() => setModal(null)} className="text-zinc-400 hover:text-zinc-700">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1 block">Process Status</label>
                <select value={modal.status} onChange={(e) => setModal({ ...modal, status: e.target.value })} className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm dark:bg-zinc-900">
                  <option value="Initiated">Initiated</option>
                  <option value="InProgress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Flagged">Flagged</option>
                </select>
              </div>
              {modal.status === 'Completed' && (
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1 block">Overall Result</label>
                  <select value={modal.overallResult || 'Clear'} onChange={(e) => setModal({ ...modal, overallResult: e.target.value })} className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm dark:bg-zinc-900">
                    <option value="Clear">Clear (Green)</option>
                    <option value="Discrepancy">Discrepancy / Red Flag</option>
                  </select>
                </div>
              )}
              {modal.overallResult === 'Discrepancy' && (
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1 block">Discrepancy Details</label>
                  <textarea rows={3} value={modal.discrepancyDetails || ''} onChange={e => setModal({ ...modal, discrepancyDetails: e.target.value })} className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm dark:bg-zinc-900 resize-none" placeholder="Provide context..." />
                </div>
              )}
              <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-2">
                <Button variant="outline" onClick={() => setModal(null)}>Cancel</Button>
                <Button disabled={updateMutation.isPending} onClick={() => updateMutation.mutate({ id: modal._id, data: { status: modal.status, overallResult: modal.overallResult, discrepancyDetails: modal.discrepancyDetails } })} className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900">
                  Save Update
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
