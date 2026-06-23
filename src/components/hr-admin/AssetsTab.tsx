'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Laptop, Plus, RotateCcw, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import moment from 'moment';

export default function AssetsTab({ employees, selectedEmployeeId }: { employees: any[], selectedEmployeeId?: string }) {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [form, setForm] = useState({ type: '', serialNumber: '', employeeId: '', condition: 'New' });

  const { data: allocations, isLoading } = useQuery({
    queryKey: ['asset-allocations'],
    queryFn: async () => (await api.get('/support/assets/allocations')).data,
  });

  const filteredAllocations = React.useMemo(() => {
    if (!allocations) return [];
    if (!selectedEmployeeId || selectedEmployeeId === 'all') return allocations;
    return allocations.filter((a: any) => a.employeeId?._id === selectedEmployeeId);
  }, [allocations, selectedEmployeeId]);

  const { data: itInventories } = useQuery({
    queryKey: ['it-inventories'],
    queryFn: async () => (await api.get('/master-data/it-inventories?limit=100')).data?.data || [],
  });

  const allocateMutation = useMutation({
    mutationFn: async (payload: any) => {
      const assetRes = await api.post('/support/assets', {
        name: `${payload.type} - ${payload.serialNumber}`,
        type: payload.type,
        serialNumber: payload.serialNumber,
        status: 'Available'
      });
      return (await api.post('/support/assets/allocate', {
        assetId: assetRes.data._id,
        employeeId: payload.employeeId,
        condition: payload.condition
      })).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset-allocations'] });
      alert('Asset allocated successfully!');
      setForm({ type: '', serialNumber: '', employeeId: '', condition: 'New' });
      setIsDrawerOpen(false);
    }
  });

  const returnMutation = useMutation({
    mutationFn: async (allocationId: string) => (await api.post(`/support/assets/return/${allocationId}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset-allocations'] });
      alert('Asset marked as returned!');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    allocateMutation.mutate(form);
  };

  return (
    <div className="flex flex-col gap-3 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div></div>
        <Button size="sm" onClick={() => setIsDrawerOpen(true)} className="h-8 text-xs bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 flex items-center gap-1.5">
          <Plus size={14} /> Allocate Asset
        </Button>
      </div>

      <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="text-md flex items-center gap-2">
            <Laptop size={16} className="text-zinc-600" />
            Asset Allocation History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-4 text-center text-sm text-zinc-500">Loading...</div>
          ) : filteredAllocations?.length === 0 ? (
            <div className="py-8 text-center text-sm text-zinc-500 border border-dashed rounded-lg">
              {selectedEmployeeId && selectedEmployeeId !== 'all' ? 'No assets allocated to this employee.' : 'No assets allocated yet.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500">
                  <tr>
                    <th className="px-4 py-2 font-medium">Asset Details</th>
                    <th className="px-4 py-2 font-medium">Employee</th>
                    <th className="px-4 py-2 font-medium">Issue Date</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredAllocations?.map((alloc: any) => (
                    <tr key={alloc._id}>
                      <td className="px-4 py-3">
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">{alloc.assetId?.type}</div>
                        <div className="text-[11px] text-zinc-500">SN: {alloc.assetId?.serialNumber}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{alloc.employeeId?.firstName} {alloc.employeeId?.lastName}</div>
                      </td>
                      <td className="px-4 py-3 text-zinc-600">{moment(alloc.allocatedDate).format('MMM DD, YYYY')}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${alloc.status === 'Active' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                          {alloc.status}
                        </span>
                        {alloc.status === 'Returned' && (
                          <div className="text-[10px] text-zinc-500 mt-1">Returned: {moment(alloc.returnDate).format('MMM DD')}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {alloc.status === 'Active' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => returnMutation.mutate(alloc._id)}
                            disabled={returnMutation.isPending}
                            className="h-7 text-xs flex items-center gap-1 text-rose-600 border-rose-200 hover:bg-rose-50"
                          >
                            <RotateCcw size={12} />
                            Mark Returned
                          </Button>
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

      {/* Slide-over Form */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-zinc-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-zinc-950 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
              <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">Allocate Asset</h2>
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
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">IT Inventory Item (Master Data)</label>
                  <select required value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm dark:bg-zinc-900">
                    <option value="">Select Asset Type</option>
                    {itInventories?.map((inv: any) => (
                      <option key={inv._id} value={inv.code}>{inv.code} - {inv.category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Serial Number / Asset Tag</label>
                  <input required type="text" value={form.serialNumber} onChange={e => setForm({ ...form, serialNumber: e.target.value })} className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm dark:bg-zinc-900" placeholder="e.g. LPT-2024-001" />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Initial Condition</label>
                  <input required type="text" value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })} className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm dark:bg-zinc-900" placeholder="New, Good, Minor Scratches..." />
                </div>
              </form>
            </div>
            
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3 bg-zinc-50 dark:bg-zinc-900/50">
              <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={allocateMutation.isPending} className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900">
                {allocateMutation.isPending ? 'Allocating...' : 'Allocate Asset'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
