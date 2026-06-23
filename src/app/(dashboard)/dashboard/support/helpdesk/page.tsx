'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Plus, Search, Filter, MessageSquare, AlertCircle, Clock, CheckCircle2, X } from 'lucide-react';

export default function HelpdeskPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ department: 'IT', subject: '', description: '', priority: 'Medium' });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/support/tickets');
      setTickets(res.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/support/tickets', formData);
      setIsAddModalOpen(false);
      setFormData({ department: 'IT', subject: '', description: '', priority: 'Medium' });
      fetchTickets();
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Failed to create ticket');
    }
  };

  const handleResolveTicket = async (id: string) => {
    try {
      await api.put(`/support/tickets/${id}`, { status: 'Resolved' });
      fetchTickets();
    } catch (error) {
      console.error('Error resolving ticket:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-500/30';
      case 'High': return 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 border-orange-200 dark:border-orange-500/30';
      case 'Medium': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-500/30';
      case 'Low': return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-400 border-zinc-200 dark:border-zinc-500/30';
      default: return 'bg-zinc-100 text-zinc-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open': return <AlertCircle size={16} className="text-red-500" />;
      case 'In_Progress': return <Clock size={16} className="text-amber-500" />;
      case 'Resolved': return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'Closed': return <CheckCircle2 size={16} className="text-zinc-400" />;
      default: return <AlertCircle size={16} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-md">Helpdesk & Support</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage and resolve internal employee requests</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={16} />
          New Ticket
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input
              type="text"
              placeholder="Search tickets by subject or ID..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <button className="px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-2 text-sm">
            <Filter size={16} /> Filter
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-zinc-500">Loading tickets...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-800/50">
                <tr>
                  <th className="px-6 py-3 font-medium">Ticket</th>
                  <th className="px-6 py-3 font-medium">Requester</th>
                  <th className="px-6 py-3 font-medium">Department</th>
                  <th className="px-6 py-3 font-medium">Priority</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {tickets.map(ticket => (
                  <tr key={ticket._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-900 dark:text-zinc-100">{ticket.subject}</div>
                      <div className="text-xs text-zinc-500 mt-1 line-clamp-1">{ticket.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 flex items-center justify-center font-medium text-xs">
                          {ticket.employeeId?.firstName?.[0]}{ticket.employeeId?.lastName?.[0]}
                        </div>
                        <span>{ticket.employeeId?.firstName} {ticket.employeeId?.lastName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{ticket.department}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-medium">
                        {getStatusIcon(ticket.status)}
                        {ticket.status.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {(ticket.status === 'Open' || ticket.status === 'In_Progress') && (
                        <button
                          onClick={() => handleResolveTicket(ticket._id)}
                          className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                        >
                          Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {tickets.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                      <MessageSquare className="mx-auto mb-3 opacity-20" size={32} />
                      No tickets found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="font-md">Raise New Ticket</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateTicket} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1">Department</label>
                <select required value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm bg-transparent dark:border-zinc-800">
                  <option>IT</option>
                  <option>HR</option>
                  <option>Finance</option>
                  <option>Facility</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Priority</label>
                <select required value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm bg-transparent dark:border-zinc-800">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Subject</label>
                <input required type="text" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm bg-transparent dark:border-zinc-800" placeholder="Brief summary of the issue..." />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Description</label>
                <textarea required rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm bg-transparent dark:border-zinc-800" placeholder="Detailed explanation..." />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-2 border rounded-lg text-sm font-medium">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">Submit Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
