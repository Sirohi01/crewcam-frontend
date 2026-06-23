'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hammer, AlertTriangle, Plus, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import moment from 'moment';

export default function DisciplinaryTab({ employees, selectedEmployeeId }: { employees: any[], selectedEmployeeId?: string }) {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [form, setForm] = useState({ employeeId: '', issueType: 'Warning', reason: '', actionTaken: '', actionDate: '' });

  const { data: actions, isLoading } = useQuery({
    queryKey: ['disciplinary-actions'],
    queryFn: async () => (await api.get('/hr-admin/disciplinary')).data,
  });

  const filteredActions = React.useMemo(() => {
    if (!actions) return [];
    if (!selectedEmployeeId || selectedEmployeeId === 'all') return actions;
    return actions.filter((a: any) => a.employeeId?._id === selectedEmployeeId);
  }, [actions, selectedEmployeeId]);

  const createMutation = useMutation({
    mutationFn: async (payload: any) => (await api.post('/hr-admin/disciplinary', payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disciplinary-actions'] });
      alert('Disciplinary action recorded.');
      setForm({ employeeId: '', issueType: 'Warning', reason: '', actionTaken: '', actionDate: '' });
      setIsDrawerOpen(false);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  return (
    <div className="flex flex-col gap-3 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div></div>
        <Button size="sm" onClick={() => setIsDrawerOpen(true)} className="h-8 text-xs bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 flex items-center gap-1.5">
          <Plus size={14} /> Issue Action
        </Button>
      </div>

      <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 h-full">
        <CardHeader>
          <CardTitle className="text-md font-medium flex items-center gap-2">
            <AlertTriangle size={16} className="text-zinc-600" />
            Disciplinary Action History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-4 text-center text-sm text-zinc-500">Loading...</div>
          ) : filteredActions?.length === 0 ? (
            <div className="py-8 text-center text-sm text-zinc-500 border border-dashed rounded-lg">
              {selectedEmployeeId && selectedEmployeeId !== 'all' ? 'No disciplinary actions recorded for this employee.' : 'No disciplinary actions recorded.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500">
                  <tr>
                    <th className="px-4 py-2 font-medium">Employee</th>
                    <th className="px-4 py-2 font-medium">Type</th>
                    <th className="px-4 py-2 font-medium">Reason</th>
                    <th className="px-4 py-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredActions?.map((act: any) => (
                    <tr key={act._id}>
                      <td className="px-4 py-3">{act.employeeId?.firstName} {act.employeeId?.lastName}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${act.issueType === 'Warning' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                          {act.issueType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-600 truncate max-w-[300px]" title={act.reason}>{act.reason}</td>
                      <td className="px-4 py-3 text-zinc-600">{moment(act.actionDate).format('DD MMM YYYY')}</td>
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
              <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">Issue Disciplinary Action</h2>
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
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Action Type</label>
                  <select required value={form.issueType} onChange={e => setForm({ ...form, issueType: e.target.value })} className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm dark:bg-zinc-900">
                    <option value="Warning">Formal Warning</option>
                    <option value="Suspension">Suspension</option>
                    <option value="Termination">Termination</option>
                    <option value="PIP">Performance Improvement Plan (PIP)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Date of Action</label>
                  <input required type="date" value={form.actionDate} onChange={e => setForm({ ...form, actionDate: e.target.value })} className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm dark:bg-zinc-900" />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Reason / Details</label>
                  <textarea rows={3} required value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm dark:bg-zinc-900 resize-none" placeholder="Provide context..." />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Specific Action Taken</label>
                  <input required type="text" value={form.actionTaken} onChange={e => setForm({ ...form, actionTaken: e.target.value })} className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm dark:bg-zinc-900" placeholder="e.g. Issued written warning letter" />
                </div>
              </form>
            </div>
            
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3 bg-zinc-50 dark:bg-zinc-900/50">
              <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={createMutation.isPending} className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900">
                {createMutation.isPending ? 'Saving...' : 'Record Action'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
