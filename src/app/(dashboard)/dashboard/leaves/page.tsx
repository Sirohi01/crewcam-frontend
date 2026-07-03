'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, CheckCircle2, XCircle, Clock, TrendingUp, Wallet, ShieldAlert } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import moment from 'moment';

export default function LeavesPage() {
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'my-leaves' | 'tenant-leaves'>('my-leaves');

  const [leaveTypeId, setLeaveTypeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { data: myLeaves, isLoading } = useQuery({
    queryKey: ['my-leaves'],
    queryFn: async () => (await api.get('/leaves/my-leaves')).data,
    enabled: activeTab === 'my-leaves',
  });

  const { data: tenantLeaves, isLoading: isTenantLoading } = useQuery({
    queryKey: ['tenant-leaves'],
    queryFn: async () => (await api.get('/leaves/tenant-leaves')).data,
    enabled: activeTab === 'tenant-leaves',
    retry: false,
  });

  const { data: leaveTypes } = useQuery({
    queryKey: ['leaveTypes'],
    queryFn: async () => (await api.get('/master-data/leave-types')).data,
  });

  const applyMutation = useMutation({
    mutationFn: async (payload: any) => (await api.post('/leaves/apply', payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-leaves'] });
      setLeaveTypeId('');
      setStartDate('');
      setEndDate('');
      setReason('');
      setSuccessMsg('Leave request submitted successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
    },
    onError: (err: any) => alert(err.response?.data?.message || err.message),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, rejectionReason }: any) =>
      (await api.put(`/leaves/${id}/status`, { status, rejectionReason })).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-leaves'] });
      alert('Leave status updated successfully');
    },
    onError: (err: any) => alert(err.response?.data?.message || err.message),
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    applyMutation.mutate({ leaveTypeId, startDate, endDate, reason });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved': return <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-900/30 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"><CheckCircle2 size={12} /> Approved</span>;
      case 'Rejected': return <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100/80 dark:bg-rose-900/30 px-2.5 py-1 text-xs font-semibold text-rose-800 dark:text-rose-400 border border-rose-200 dark:border-rose-800"><XCircle size={12} /> Rejected</span>;
      default: return <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/80 dark:bg-amber-900/30 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800"><Clock size={12} /> Pending</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300 pb-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Leaves</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage time off requests</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/leave-statistics" className="text-sm font-medium bg-white border border-zinc-200 shadow-sm hover:bg-zinc-50 text-zinc-700 px-4 py-2.5 rounded-lg inline-flex items-center gap-2 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-all">
            <TrendingUp size={16} className="text-indigo-600 dark:text-indigo-400" /> Leave Statistics
          </Link>
          <Link href="/dashboard/leave-credit" className="text-sm font-medium bg-white border border-zinc-200 shadow-sm hover:bg-zinc-50 text-zinc-700 px-4 py-2.5 rounded-lg inline-flex items-center gap-2 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-all">
            <Wallet size={16} className="text-indigo-600 dark:text-indigo-400" /> Credit Leave
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-zinc-100/80 dark:bg-zinc-900/50 p-1.5 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('my-leaves')}
          className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all ${activeTab === 'my-leaves' ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'}`}
        >
          My Leaves
        </button>
        <button
          onClick={() => setActiveTab('tenant-leaves')}
          className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'tenant-leaves' ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'}`}
        >
          <ShieldAlert size={14} className={activeTab === 'tenant-leaves' ? 'text-indigo-600' : ''} /> Admin Approvals
        </button>
      </div>

      {activeTab === 'my-leaves' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-zinc-200/80 shadow-md dark:border-zinc-800 overflow-hidden">
              <div className="bg-indigo-50/50 dark:bg-indigo-900/10 px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
                <CardTitle className="text-base font-medium flex items-center gap-2 text-indigo-900 dark:text-indigo-100">
                  <FileText size={18} className="text-indigo-600 dark:text-indigo-400" /> Apply for Leave
                </CardTitle>
              </div>
              <CardContent className="p-6">
                <form onSubmit={handleApply} className="flex flex-col gap-5">
                  {successMsg && (
                    <div className="bg-emerald-50 text-emerald-700 text-sm p-3 rounded-md border border-emerald-100 flex items-center gap-2">
                      <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                      {successMsg}
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Leave Type</label>
                    <select
                      required
                      value={leaveTypeId}
                      onChange={e => setLeaveTypeId(e.target.value)}
                      className="w-full rounded-md border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:bg-zinc-800/50"
                    >
                      <option value="">Select Type...</option>
                      {leaveTypes?.data?.map((lt: any) => (
                        <option key={lt._id} value={lt._id}>{lt.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Start Date</label>
                      <input
                        type="date"
                        required
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="w-full rounded-md border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:bg-zinc-800/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">End Date</label>
                      <input
                        type="date"
                        required
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        className="w-full rounded-md border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:bg-zinc-800/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Reason</label>
                    <textarea
                      required
                      rows={4}
                      value={reason}
                      onChange={e => setReason(e.target.value)}
                      className="w-full rounded-md border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:bg-zinc-800/50"
                      placeholder="Briefly explain the reason for your leave..."
                    />
                  </div>
                  <Button disabled={applyMutation.isPending} type="submit" className="w-full py-2.5 h-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm transition-all mt-2">
                    {applyMutation.isPending ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800">
              <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Calendar size={18} className="text-indigo-600" />
                  My Leave History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center text-zinc-400">
                    <div className="h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
                    <p className="text-sm font-medium">Loading history...</p>
                  </div>
                ) : myLeaves?.length === 0 ? (
                  <div className="py-16 flex flex-col items-center justify-center text-zinc-400">
                    <Calendar size={40} className="mb-4 text-zinc-300 dark:text-zinc-600" />
                    <p className="text-base font-medium text-zinc-600 dark:text-zinc-300">No leave requests found</p>
                    <p className="text-sm text-zinc-500 mt-1">When you apply for leave, it will appear here.</p>
                  </div>
                ) : (
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="bg-zinc-50/50 dark:bg-zinc-900/30">
                        <tr className="border-b border-zinc-200 dark:border-zinc-800">
                          <th className="h-12 px-6 text-left align-middle font-medium text-zinc-500">Type</th>
                          <th className="h-12 px-6 text-left align-middle font-medium text-zinc-500">Dates</th>
                          <th className="h-12 px-6 text-left align-middle font-medium text-zinc-500">Reason</th>
                          <th className="h-12 px-6 text-left align-middle font-medium text-zinc-500">Status</th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {myLeaves?.map((leave: any) => (
                          <tr key={leave._id} className="border-b border-zinc-100 dark:border-zinc-800 transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50 group">
                            <td className="p-6 align-middle font-medium text-zinc-900 dark:text-zinc-100">{leave.leaveTypeId?.name || 'Unknown'}</td>
                            <td className="p-6 align-middle whitespace-nowrap text-zinc-600 dark:text-zinc-400">
                              <span className="font-medium text-zinc-900 dark:text-zinc-200">{moment(leave.startDate).format('MMM DD')}</span>
                              <span className="mx-2 text-zinc-400">to</span>
                              <span className="font-medium text-zinc-900 dark:text-zinc-200">{moment(leave.endDate).format('MMM DD, YYYY')}</span>
                            </td>
                            <td className="p-6 align-middle text-zinc-600 dark:text-zinc-400">
                              <p className="line-clamp-2 max-w-[300px]" title={leave.reason}>{leave.reason}</p>
                            </td>
                            <td className="p-6 align-middle">{getStatusBadge(leave.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'tenant-leaves' && (
        <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800">
          <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <ShieldAlert size={18} className="text-indigo-600" />
              Leave Requests Needing Approval
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isTenantLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-zinc-400">
                <div className="h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm font-medium">Loading requests...</p>
              </div>
            ) : tenantLeaves?.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-zinc-400">
                <CheckCircle2 size={40} className="mb-4 text-emerald-400/50" />
                <p className="text-base font-medium text-zinc-600 dark:text-zinc-300">All caught up!</p>
                <p className="text-sm text-zinc-500 mt-1">There are no pending leave requests to review.</p>
              </div>
            ) : (
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="bg-zinc-50/50 dark:bg-zinc-900/30">
                    <tr className="border-b border-zinc-200 dark:border-zinc-800">
                      <th className="h-12 px-6 text-left align-middle font-medium text-zinc-500">Employee</th>
                      <th className="h-12 px-6 text-left align-middle font-medium text-zinc-500">Type</th>
                      <th className="h-12 px-6 text-left align-middle font-medium text-zinc-500">Dates</th>
                      <th className="h-12 px-6 text-left align-middle font-medium text-zinc-500">Reason</th>
                      <th className="h-12 px-6 text-left align-middle font-medium text-zinc-500">Status</th>
                      <th className="h-12 px-6 text-center align-middle font-medium text-zinc-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {tenantLeaves?.map((leave: any) => (
                      <tr key={leave._id} className="border-b border-zinc-100 dark:border-zinc-800 transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50">
                        <td className="p-6 align-middle">
                          <div className="font-semibold text-zinc-900 dark:text-zinc-100">{leave.userId?.firstName} {leave.userId?.lastName}</div>
                          <div className="text-xs text-zinc-500 mt-0.5">{leave.userId?.email}</div>
                        </td>
                        <td className="p-6 align-middle font-medium text-zinc-700 dark:text-zinc-300">{leave.leaveTypeId?.name || 'Unknown'}</td>
                        <td className="p-6 align-middle whitespace-nowrap text-zinc-600 dark:text-zinc-400">
                          <span className="font-medium text-zinc-900 dark:text-zinc-200">{moment(leave.startDate).format('MMM DD')}</span>
                          <span className="mx-2 text-zinc-400">to</span>
                          <span className="font-medium text-zinc-900 dark:text-zinc-200">{moment(leave.endDate).format('MMM DD, YYYY')}</span>
                        </td>
                        <td className="p-6 align-middle text-zinc-600 dark:text-zinc-400">
                          <p className="line-clamp-2 max-w-[250px]" title={leave.reason}>{leave.reason}</p>
                        </td>
                        <td className="p-6 align-middle">{getStatusBadge(leave.status)}</td>
                        <td className="p-6 align-middle text-center">
                          {leave.status === 'Pending' && (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => updateStatusMutation.mutate({ id: leave._id, status: 'Rejected' })}
                                disabled={updateStatusMutation.isPending}
                                className="text-sm font-medium bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-md shadow-sm transition-colors"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => updateStatusMutation.mutate({ id: leave._id, status: 'Approved' })}
                                disabled={updateStatusMutation.isPending}
                                className="text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-1.5 rounded-md shadow-sm transition-colors"
                              >
                                Approve
                              </button>
                            </div>
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
  );
}
