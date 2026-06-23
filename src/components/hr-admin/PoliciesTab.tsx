'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSignature, Plus, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export default function PoliciesTab({ employees, selectedEmployeeId }: { employees: any[], selectedEmployeeId?: string }) {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [form, setForm] = useState({ employeeId: '', policyId: '' });

  const { data: policies } = useQuery({
    queryKey: ['policies-list'],
    queryFn: async () => (await api.get('/master-data/policies?limit=100')).data?.data || [],
  });

  const { data: signatures, isLoading } = useQuery({
    queryKey: ['policy-signatures'],
    queryFn: async () => (await api.get('/hr-admin/policies/signatures')).data,
  });

  const filteredSignatures = React.useMemo(() => {
    if (!signatures) return [];
    if (!selectedEmployeeId || selectedEmployeeId === 'all') return signatures;
    return signatures.filter((s: any) => s.employeeId?._id === selectedEmployeeId);
  }, [signatures, selectedEmployeeId]);

  const requestMutation = useMutation({
    mutationFn: async (payload: any) => (await api.post('/hr-admin/policies/signatures', payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policy-signatures'] });
      alert('Signature requested successfully.');
      setForm({ employeeId: '', policyId: '' });
      setIsDrawerOpen(false);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestMutation.mutate(form);
  };

  return (
    <div className="flex flex-col gap-3 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div></div>
        <Button size="sm" onClick={() => setIsDrawerOpen(true)} className="h-8 text-xs bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 flex items-center gap-1.5">
          <Plus size={14} /> Request Signature
        </Button>
      </div>

      <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 h-full">
        <CardHeader>
          <CardTitle className="text-md font-medium flex items-center gap-2">
            <FileSignature size={16} className="text-zinc-600" />
            Policy Tracking Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-4 text-center text-sm text-zinc-500">Loading...</div>
          ) : filteredSignatures?.length === 0 ? (
            <div className="py-8 text-center text-sm text-zinc-500 border border-dashed rounded-lg">
              {selectedEmployeeId && selectedEmployeeId !== 'all' ? 'No policies found for this employee.' : 'No policies assigned for tracking yet.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500">
                  <tr>
                    <th className="px-4 py-2 font-medium">Policy Name</th>
                    <th className="px-4 py-2 font-medium">Employee</th>
                    <th className="px-4 py-2 font-medium">Version</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredSignatures?.map((sig: any) => (
                    <tr key={sig._id}>
                      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{sig.policyId?.name}</td>
                      <td className="px-4 py-3">{sig.employeeId?.firstName} {sig.employeeId?.lastName}</td>
                      <td className="px-4 py-3 text-zinc-600">v{sig.policyVersion}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${sig.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                          {sig.status}
                        </span>
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
              <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">Request Signature</h2>
              <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Employee</label>
                  <select required value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })} className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm dark:bg-zinc-900">
                    <option value="">Select Employee</option>
                    {employees?.map((emp: any) => (
                      <option key={emp._id} value={emp._id}>{emp.firstName} {emp.lastName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Policy Document (Master Data)</label>
                  <select required value={form.policyId} onChange={e => setForm({ ...form, policyId: e.target.value })} className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm dark:bg-zinc-900">
                    <option value="">Select Policy</option>
                    {policies?.map((pol: any) => (
                      <option key={pol._id} value={pol._id}>{pol.name} (v{pol.version})</option>
                    ))}
                  </select>
                </div>
              </form>
            </div>
            
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3 bg-zinc-50 dark:bg-zinc-900/50">
              <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={requestMutation.isPending} className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900">
                {requestMutation.isPending ? 'Sending Request...' : 'Send Request'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
