'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Plus, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import moment from 'moment';

export default function ComplianceTab({ employees, selectedEmployeeId }: { employees: any[], selectedEmployeeId?: string }) {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [form, setForm] = useState({ type: 'PF', employeeId: '', amount: '', complianceDate: '', remarks: '' });

  const { data: complianceRecords, isLoading } = useQuery({
    queryKey: ['compliance-records'],
    queryFn: async () => (await api.get('/hr-admin/compliance')).data,
  });

  const filteredRecords = React.useMemo(() => {
    if (!complianceRecords) return [];
    if (!selectedEmployeeId || selectedEmployeeId === 'all') return complianceRecords;
    return complianceRecords.filter((r: any) => r.employeeId?._id === selectedEmployeeId);
  }, [complianceRecords, selectedEmployeeId]);

  const createMutation = useMutation({
    mutationFn: async (payload: any) => (await api.post('/hr-admin/compliance', payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance-records'] });
      alert('Compliance record added.');
      setForm({ type: 'PF', employeeId: '', amount: '', complianceDate: '', remarks: '' });
      setIsDrawerOpen(false);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ ...form, amount: Number(form.amount) });
  };

  return (
    <div className="flex flex-col gap-3 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div></div>
        <Button size="sm" onClick={() => setIsDrawerOpen(true)} className="h-8 text-xs bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 flex items-center gap-1.5">
          <Plus size={14} /> Add Compliance Record
        </Button>
      </div>

      <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 h-full">
        <CardHeader>
          <CardTitle className="text-md font-medium flex items-center gap-2">
            <CheckCircle2 size={16} className="text-zinc-600" />
            Recent Compliance Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-4 text-center text-sm text-zinc-500">Loading...</div>
          ) : filteredRecords?.length === 0 ? (
            <div className="py-8 text-center text-sm text-zinc-500 border border-dashed rounded-lg">
              {selectedEmployeeId && selectedEmployeeId !== 'all' ? 'No compliance records found for this employee.' : 'No compliance records found.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500">
                  <tr>
                    <th className="px-4 py-2 font-medium">Type</th>
                    <th className="px-4 py-2 font-medium">Employee</th>
                    <th className="px-4 py-2 font-medium">Amount (₹)</th>
                    <th className="px-4 py-2 font-medium">Compliance Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredRecords?.map((rec: any) => (
                    <tr key={rec._id}>
                      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{rec.type}</td>
                      <td className="px-4 py-3">{rec.employeeId?.firstName} {rec.employeeId?.lastName}</td>
                      <td className="px-4 py-3 font-mono text-zinc-600">₹{rec.amount}</td>
                      <td className="px-4 py-3 text-zinc-600">{moment(rec.complianceDate).format('DD MMM YYYY')}</td>
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
              <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">Add Compliance Record</h2>
              <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Compliance Type</label>
                  <select required value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm dark:bg-zinc-900">
                    <option value="PF">Provident Fund (PF)</option>
                    <option value="ESI">Employee State Insurance (ESI)</option>
                    <option value="TDS">Tax Deducted at Source (TDS)</option>
                    <option value="PT">Professional Tax (PT)</option>
                    <option value="LWF">Labour Welfare Fund (LWF)</option>
                  </select>
                </div>
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
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Amount Deposited (₹)</label>
                  <input required type="number" min="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm dark:bg-zinc-900" placeholder="e.g. 1800" />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Date of Compliance</label>
                  <input required type="date" value={form.complianceDate} onChange={e => setForm({ ...form, complianceDate: e.target.value })} className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm dark:bg-zinc-900" />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Remarks / Challan Ref</label>
                  <input type="text" value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm dark:bg-zinc-900" placeholder="Optional" />
                </div>
              </form>
            </div>
            
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3 bg-zinc-50 dark:bg-zinc-900/50">
              <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={createMutation.isPending} className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900">
                {createMutation.isPending ? 'Saving...' : 'Save Record'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
