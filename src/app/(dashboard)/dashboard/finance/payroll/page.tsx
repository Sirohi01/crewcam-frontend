'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IndianRupee, Settings2, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';

type PayrollTab = 'structures' | 'slips' | 'approvals';

export default function PayrollPage() {
  const user = useAuthStore(state => state.user);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<PayrollTab>('structures');
  const [selectedEmpForStructure, setSelectedEmpForStructure] = useState<string>('');

  const isEmployee = (user as any)?.role === 'Employee';

  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => (await api.get('/employees')).data,
    enabled: !isEmployee
  });

  const { data: slips, isLoading: isSlipsLoading } = useQuery({
    queryKey: ['salary-slips'],
    queryFn: async () => (await api.get('/finance/salary-slips')).data,
    enabled: activeTab === 'slips'
  });

  const { data: approvalRequests, isLoading: isApprovalsLoading } = useQuery({
    queryKey: ['payroll-approval-requests'],
    queryFn: async () => (await api.get('/finance/salary-slips/approvals')).data,
    enabled: !isEmployee && activeTab === 'approvals'
  });

  const { data: currentStructure } = useQuery({
    queryKey: ['salary-structure', selectedEmpForStructure],
    queryFn: async () => (await api.get(`/finance/salary-structure/${selectedEmpForStructure}`)).data,
    enabled: !!selectedEmpForStructure
  });

  const saveStructureMutation = useMutation({
    mutationFn: async (payload: any) => (await api.post('/finance/salary-structure', payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salary-structure', selectedEmpForStructure] });
      alert('Salary structure saved successfully');
    }
  });

  const generateSlipsMutation = useMutation({
    mutationFn: async (payload: any) => (await api.post('/finance/salary-slips/generate', payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll-approval-requests'] });
      setActiveTab('approvals');
      alert('Payroll generation request submitted for approval');
    }
  });

  const reviewRequestMutation = useMutation({
    mutationFn: async ({ id, decision }: { id: string; decision: 'Approved' | 'Rejected' }) =>
      (await api.put(`/finance/salary-slips/approvals/${id}/review`, { decision })).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll-approval-requests'] });
      queryClient.invalidateQueries({ queryKey: ['salary-slips'] });
    }
  });

  const handleSaveStructure = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    saveStructureMutation.mutate({
      employeeId: selectedEmpForStructure,
      basic: Number(formData.get('basic')),
      hra: Number(formData.get('hra')),
      conveyance: Number(formData.get('conveyance')),
      specialAllowance: Number(formData.get('specialAllowance')),
      pfDeduction: Number(formData.get('pfDeduction')),
      esiDeduction: Number(formData.get('esiDeduction')),
      taxDeduction: Number(formData.get('taxDeduction')),
    });
  };

  const handleGenerateSlips = () => {
    const employeeList = employees?.data || employees || [];
    const allEmpIds = employeeList.map((employee: any) => employee._id);
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    if (!allEmpIds.length) return alert('No employees found for payroll generation');

    if (confirm(`Submit payroll generation request for ${allEmpIds.length} employees for ${month}/${year}?`)) {
      generateSlipsMutation.mutate({ employeeIds: allEmpIds, month, year });
    }
  };

  const employeeList = employees?.data || employees || [];

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300 pb-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Payroll & Salaries</h1>
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-md">Manage salary structures, approvals & slips</p>
        </div>
        <div className="flex bg-zinc-100 p-1 rounded-md dark:bg-zinc-800">
          {!isEmployee && (
            <button
              onClick={() => setActiveTab('structures')}
              className={`px-3 py-1 text-xs font-md rounded ${activeTab === 'structures' ? 'bg-white shadow text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              Structures
            </button>
          )}
          {!isEmployee && (
            <button
              onClick={() => setActiveTab('approvals')}
              className={`px-3 py-1 text-xs font-md rounded ${activeTab === 'approvals' ? 'bg-white shadow text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              Approvals
            </button>
          )}
          <button
            onClick={() => setActiveTab('slips')}
            className={`px-3 py-1 text-xs font-md rounded ${activeTab === 'slips' ? 'bg-white shadow text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            Slips
          </button>
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'structures' && !isEmployee && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-md flex items-center gap-2">
                    <Settings2 size={16} className="text-indigo-600" />
                    Select Employee
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <select
                    value={selectedEmpForStructure}
                    onChange={e => setSelectedEmpForStructure(e.target.value)}
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                  >
                    <option value="">Choose Employee</option>
                    {employeeList.map((emp: any) => (
                      <option key={emp._id} value={emp._id}>{emp.firstName} {emp.lastName}</option>
                    ))}
                  </select>
                </CardContent>
              </Card>
            </div>

            {selectedEmpForStructure && (
              <div className="lg:col-span-2">
                <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-md flex items-center gap-2">
                      <IndianRupee size={16} className="text-emerald-600" />
                      Define Salary Structure
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSaveStructure} className="flex flex-col gap-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div className="space-y-4">
                          <h3 className="text-[11px] font-md uppercase tracking-wider text-emerald-600 border-b pb-1">Earnings</h3>
                          {['basic', 'hra', 'conveyance', 'specialAllowance'].map(field => (
                            <div key={field}>
                              <label className="text-xs font-md text-zinc-700 mb-1 block capitalize dark:text-zinc-300">{field.replace(/([A-Z])/g, ' $1')}</label>
                              <input name={field} type="number" defaultValue={currentStructure?.[field] || 0} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
                            </div>
                          ))}
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-[11px] font-md uppercase tracking-wider text-rose-600 border-b pb-1">Deductions</h3>
                          {['pfDeduction', 'esiDeduction', 'taxDeduction'].map(field => (
                            <div key={field}>
                              <label className="text-xs font-md text-zinc-700 mb-1 block capitalize dark:text-zinc-300">{field.replace(/([A-Z])/g, ' $1')}</label>
                              <input name={field} type="number" defaultValue={currentStructure?.[field] || 0} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button type="submit" disabled={saveStructureMutation.isPending} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                        {saveStructureMutation.isPending ? 'Saving...' : 'Save Structure'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {activeTab === 'approvals' && !isEmployee && (
          <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-md flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                Payroll Approvals
              </CardTitle>
              <Button onClick={handleGenerateSlips} disabled={generateSlipsMutation.isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white h-8 text-xs">
                {generateSlipsMutation.isPending ? 'Submitting...' : 'Request Current Month'}
              </Button>
            </CardHeader>
            <CardContent>
              {isApprovalsLoading ? (
                <div className="py-4 text-center text-sm text-zinc-500">Loading approvals...</div>
              ) : !approvalRequests?.length ? (
                <div className="py-8 text-center text-sm text-zinc-500 border border-dashed rounded-lg">No payroll approval requests yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs uppercase tracking-wider text-zinc-500 dark:border-zinc-800">
                        <th className="py-2 pr-3">Period</th>
                        <th className="py-2 pr-3">Employees</th>
                        <th className="py-2 pr-3">Requested By</th>
                        <th className="py-2 pr-3">Status</th>
                        <th className="py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {approvalRequests.map((request: any) => (
                        <tr key={request._id} className="border-b last:border-0 dark:border-zinc-800">
                          <td className="py-3 pr-3 font-medium">{request.month}/{request.year}</td>
                          <td className="py-3 pr-3">{request.employeeIds?.length || 0}</td>
                          <td className="py-3 pr-3 text-zinc-600 dark:text-zinc-300">
                            {request.requestedBy?.firstName} {request.requestedBy?.lastName}
                          </td>
                          <td className="py-3 pr-3">
                            <span className={`rounded-full px-2 py-0.5 text-[11px] font-md ${request.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : request.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                              {request.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            {request.status === 'Pending' ? (
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="outline" disabled={reviewRequestMutation.isPending} onClick={() => reviewRequestMutation.mutate({ id: request._id, decision: 'Rejected' })}>
                                  <XCircle size={14} />
                                </Button>
                                <Button size="sm" disabled={reviewRequestMutation.isPending} onClick={() => reviewRequestMutation.mutate({ id: request._id, decision: 'Approved' })}>
                                  <CheckCircle2 size={14} />
                                </Button>
                              </div>
                            ) : (
                              <span className="text-xs text-zinc-500">Reviewed</span>
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

        {activeTab === 'slips' && (
          <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-md flex items-center gap-2">
                <FileText size={16} className="text-indigo-600" />
                Salary Slips
              </CardTitle>
              {!isEmployee && (
                <Button onClick={() => setActiveTab('approvals')} className="bg-indigo-600 hover:bg-indigo-700 text-white h-8 text-xs">
                  Open Approvals
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {isSlipsLoading ? (
                <div className="py-4 text-center text-sm text-zinc-500">Loading slips...</div>
              ) : slips?.length === 0 ? (
                <div className="py-8 text-center text-sm text-zinc-500 border border-dashed rounded-lg">No salary slips generated yet.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {slips?.map((slip: any) => (
                    <div key={slip._id} className="border rounded-lg p-4 bg-zinc-50 dark:bg-zinc-800/50 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-md text-zinc-900 dark:text-zinc-100">{slip.employeeId?.firstName} {slip.employeeId?.lastName}</h3>
                          <div className="text-[10px] text-zinc-500">{slip.month}/{slip.year}</div>
                        </div>
                        <span className="text-[10px] font-md px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {slip.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-md mb-0.5">Earnings</div>
                          <div className="font-md text-emerald-600 text-sm">INR {slip.totalEarnings}</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-md mb-0.5">Deductions</div>
                          <div className="font-md text-rose-600 text-sm">INR {slip.totalDeductions}</div>
                        </div>
                      </div>
                      <div className="mt-4 p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded flex justify-between items-center border border-indigo-100 dark:border-indigo-800">
                        <span className="text-xs font-md text-indigo-900 dark:text-indigo-100">Net Pay</span>
                        <span className="font-black text-indigo-700 dark:text-indigo-400">INR {slip.netPay}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
