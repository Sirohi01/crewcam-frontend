'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ticket, Search, CheckCircle2, AlertCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import moment from 'moment';

export default function HelpdeskTab({ employees, selectedEmployeeId }: { employees: any[], selectedEmployeeId?: string }) {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<any | null>(null);

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['helpdesk-tickets'],
    queryFn: async () => (await api.get('/hr-admin/helpdesk')).data,
  });

  const filteredTickets = React.useMemo(() => {
    if (!tickets) return [];
    if (!selectedEmployeeId || selectedEmployeeId === 'all') return tickets;
    return tickets.filter((t: any) => t.employeeId?._id === selectedEmployeeId);
  }, [tickets, selectedEmployeeId]);

  const updateMutation = useMutation({
    mutationFn: async ({ id, status, resolution }: any) => (await api.put(`/support/tickets/${id}`, { status, resolution })).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['helpdesk-tickets'] });
      alert('Ticket updated successfully.');
      setModal(null);
    }
  });

  const [resolutionText, setResolutionText] = useState('');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Low': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'text-amber-600';
      case 'In_Progress': return 'text-blue-600';
      case 'Resolved': return 'text-emerald-600';
      case 'Closed': return 'text-zinc-600';
      default: return 'text-zinc-600';
    }
  };

  return (
    <div className="flex flex-col gap-3 animate-in fade-in duration-300">
      <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="text-md  flex items-center gap-2">
            <Ticket size={16} className="text-zinc-600" />
            Employee Helpdesk Tickets
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-4 text-center text-sm text-zinc-500">Loading...</div>
          ) : filteredTickets?.length === 0 ? (
            <div className="py-8 text-center text-sm text-zinc-500 border border-dashed rounded-lg">
              {selectedEmployeeId && selectedEmployeeId !== 'all' ? 'No tickets found for this employee.' : 'No helpdesk tickets found.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500">
                  <tr>
                    <th className="px-4 py-2 font-medium">Ticket ID</th>
                    <th className="px-4 py-2 font-medium">Employee</th>
                    <th className="px-4 py-2 font-medium">Subject</th>
                    <th className="px-4 py-2 font-medium">Date</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredTickets?.map((ticket: any) => (
                    <tr key={ticket._id}>
                      <td className="px-4 py-3  text-zinc-900 dark:text-zinc-100 text-xs">#{ticket._id.slice(-6).toUpperCase()}</td>
                      <td className="px-4 py-3">
                        <div className=" text-zinc-900 dark:text-zinc-100">{ticket.employeeId?.firstName} {ticket.employeeId?.lastName}</div>
                        <div className="text-[11px] text-zinc-500">{ticket.department}</div>
                      </td>
                      <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300 max-w-[200px] truncate" title={ticket.subject}>{ticket.subject}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-md border ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-md text-xs ${getStatusColor(ticket.status)}`}>{ticket.status.replace('_', ' ')}</span>
                      </td>
                      <td className="px-4 py-3 text-zinc-600">{moment(ticket.createdAt).format('MMM DD, YYYY')}</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => { setModal(ticket); setResolutionText(ticket.resolution || ''); }}>
                          Manage
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

      {/* Ticket Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-zinc-900/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
              <h2 className="text-md  text-zinc-900 dark:text-zinc-100 flex items-center gap-2"><Ticket size={16} /> Manage Ticket #{modal._id.slice(-6).toUpperCase()}</h2>
              <button onClick={() => setModal(null)} className="text-zinc-400 hover:text-zinc-700">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="text-[10px] font-md uppercase text-zinc-500 mb-1">Subject</div>
                <div className="text-sm  text-zinc-900 dark:text-zinc-100">{modal.subject}</div>
              </div>
              <div>
                <div className="text-[10px] font-md uppercase text-zinc-500 mb-1">Description</div>
                <div className="text-sm text-zinc-700 dark:text-zinc-300 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-md border border-zinc-100 dark:border-zinc-800">{modal.description}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div>
                  <label className="text-xs font-md text-zinc-700 mb-1 block">Update Status</label>
                  <select value={modal.status} onChange={(e) => setModal({ ...modal, status: e.target.value })} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm">
                    <option value="Open">Open</option>
                    <option value="In_Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
              {(modal.status === 'Resolved' || modal.status === 'Closed') && (
                <div>
                  <label className="text-xs font-md text-zinc-700 mb-1 block">Resolution Notes</label>
                  <textarea rows={3} value={resolutionText} onChange={e => setResolutionText(e.target.value)} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm resize-none" placeholder="Explain how it was resolved..." />
                </div>
              )}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setModal(null)}>Cancel</Button>
                <Button disabled={updateMutation.isPending} onClick={() => updateMutation.mutate({ id: modal._id, status: modal.status, resolution: resolutionText })} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
