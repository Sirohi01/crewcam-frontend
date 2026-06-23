'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Receipt, CheckCircle, Clock, XCircle, Banknote } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';

export default function ExpensesPage() {
  const token = useAuthStore(state => state.token);
  const user = useAuthStore(state => state.user);
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'my-expenses' | 'all-expenses'>('my-expenses');

  const { data: expenses, isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const res = await fetch('http://localhost:8000/api/v1/finance/expenses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch expenses');
      return res.json();
    },
    enabled: !!token
  });

  const submitExpenseMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch('http://localhost:8000/api/v1/finance/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to submit expense');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      alert('Expense submitted successfully');
      setForm({ type: 'Travel', amount: '', date: '', description: '' });
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, approverComments }: { id: string, status: string, approverComments: string }) => {
      const res = await fetch(`http://localhost:8000/api/v1/finance/expenses/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status, approverComments })
      });
      if (!res.ok) throw new Error('Failed to update expense status');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    }
  });

  const [form, setForm] = useState({ type: 'Travel', amount: '', date: '', description: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitExpenseMutation.mutate({
      ...form,
      amount: Number(form.amount)
    });
  };

  const handleAction = (id: string, status: string) => {
    const comments = prompt(`Enter comments for ${status}:`, '');
    if (comments !== null) {
      updateStatusMutation.mutate({ id, status, approverComments: comments });
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved': return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-md px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle size={10} /> Approved</span>;
      case 'Rejected': return <span className="bg-rose-100 text-rose-800 text-[10px] font-md px-2 py-0.5 rounded-full flex items-center gap-1"><XCircle size={10} /> Rejected</span>;
      case 'Reimbursed': return <span className="bg-blue-100 text-blue-800 text-[10px] font-md px-2 py-0.5 rounded-full flex items-center gap-1">Reimbursed</span>;
      default: return <span className="bg-amber-100 text-amber-800 text-[10px] font-md px-2 py-0.5 rounded-full flex items-center gap-1"><Clock size={10} /> Pending</span>;
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300 pb-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Expenses & Reimbursements</h1>
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-md">Manage Travel, Food & Fuel Claims</p>
        </div>
        <div className="flex bg-zinc-100 p-1 rounded-md dark:bg-zinc-800">
          <button
            onClick={() => setActiveTab('my-expenses')}
            className={`px-3 py-1 text-xs font-md rounded ${activeTab === 'my-expenses' ? 'bg-white shadow text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            My Claims
          </button>
          {(user as any)?.role !== 'Employee' && (
            <button
              onClick={() => setActiveTab('all-expenses')}
              className={`px-3 py-1 text-xs font-md rounded ${activeTab === 'all-expenses' ? 'bg-white shadow text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              Finance Approvals
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'my-expenses' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-md flex items-center gap-2">
                    <Receipt size={16} className="text-indigo-600" />
                    Submit New Claim
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                      <label className="text-xs font-md text-zinc-700 mb-1 block">Expense Type</label>
                      <select required value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm">
                        <option value="Travel">Travel</option>
                        <option value="Food">Food</option>
                        <option value="Fuel">Fuel</option>
                        <option value="Hotel">Hotel</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-md text-zinc-700 mb-1 block">Amount (₹)</label>
                      <input required type="number" min="1" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-md text-zinc-700 mb-1 block">Date of Expense</label>
                      <input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-md text-zinc-700 mb-1 block">Description</label>
                      <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm resize-none" placeholder="Details about this expense..." />
                    </div>
                    <Button type="submit" disabled={submitExpenseMutation.isPending} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                      {submitExpenseMutation.isPending ? 'Submitting...' : 'Submit Claim'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 h-full">
                <CardHeader>
                  <CardTitle className="text-md">My Claim History</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="py-4 text-center text-sm text-zinc-500">Loading...</div>
                  ) : expenses?.filter((e: any) => e.employeeId?._id === user?.id).length === 0 ? (
                    <div className="py-8 text-center text-sm text-zinc-500 border border-dashed rounded-lg">No expenses submitted yet.</div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {expenses?.filter((e: any) => e.employeeId?._id === user?.id).map((exp: any) => (
                        <div key={exp._id} className="border rounded-lg p-4 bg-zinc-50 dark:bg-zinc-800/50 flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-md text-zinc-900 dark:text-zinc-100">{exp.type}</h4>
                              {renderStatusBadge(exp.status)}
                            </div>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">{exp.description}</p>
                            <div className="text-[10px] text-zinc-500 font-medium">Date: {new Date(exp.date).toLocaleDateString()}</div>
                            {exp.approverComments && (
                              <div className="mt-2 text-[10px] bg-white dark:bg-zinc-900 p-2 rounded border border-zinc-200 dark:border-zinc-700">
                                <strong>Finance Comment:</strong> {exp.approverComments}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-black text-zinc-800 dark:text-zinc-200">₹{exp.amount}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'all-expenses' && (user as any)?.role !== 'Employee' && (
          <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-md">Company Expenses (Finance Queue)</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-4 text-center text-sm text-zinc-500">Loading...</div>
              ) : expenses?.length === 0 ? (
                <div className="py-8 text-center text-sm text-zinc-500 border border-dashed rounded-lg">No expenses to review.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500">
                      <tr>
                        <th className="p-3 font-md text-xs uppercase">Employee</th>
                        <th className="p-3 font-md text-xs uppercase">Type & Date</th>
                        <th className="p-3 font-md text-xs uppercase">Description</th>
                        <th className="p-3 font-md text-xs uppercase text-right">Amount</th>
                        <th className="p-3 font-md text-xs uppercase text-center">Status</th>
                        <th className="p-3 font-md text-xs uppercase text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {expenses?.map((exp: any) => (
                        <tr key={exp._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                          <td className="p-3 font-medium text-zinc-900 dark:text-zinc-100">
                            {exp.employeeId?.firstName} {exp.employeeId?.lastName}
                          </td>
                          <td className="p-3">
                            <div className="font-md text-zinc-700 dark:text-zinc-300">{exp.type}</div>
                            <div className="text-[10px] text-zinc-500">{new Date(exp.date).toLocaleDateString()}</div>
                          </td>
                          <td className="p-3 text-xs text-zinc-600 max-w-xs truncate" title={exp.description}>
                            {exp.description}
                          </td>
                          <td className="p-3 text-right font-md text-zinc-800 dark:text-zinc-200">
                            ₹{exp.amount}
                          </td>
                          <td className="p-3 text-center">
                            {renderStatusBadge(exp.status)}
                          </td>
                          <td className="p-3 text-right">
                            {exp.status === 'Pending' && (
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="outline" className="h-7 text-xs text-emerald-600 hover:text-emerald-700" onClick={() => handleAction(exp._id, 'Approved')}>Approve</Button>
                                <Button size="sm" variant="outline" className="h-7 text-xs text-rose-600 hover:text-rose-700" onClick={() => handleAction(exp._id, 'Rejected')}>Reject</Button>
                              </div>
                            )}
                            {exp.status === 'Approved' && (
                              <Button size="sm" className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleAction(exp._id, 'Reimbursed')}>Mark Reimbursed</Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
