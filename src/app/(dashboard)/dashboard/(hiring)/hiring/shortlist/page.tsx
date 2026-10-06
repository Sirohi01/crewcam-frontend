'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Users, Calendar, X } from 'lucide-react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';

export default function ShortlistPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 20;
  const [schedulingFor, setSchedulingFor] = useState<any>(null);
  const [formData, setFormData] = useState({
    scheduledDate: '',
    interviewerId: '',
    roundType: 'Technical',
    mode: 'Online',
    location: '',
    meetingLink: ''
  });

  const { data, isLoading } = useQuery<{ data: any[]; meta: any }>({
    queryKey: ['shortlisted-candidates', page],
    queryFn: async () => (await api.get('/hiring/candidates', {
      params: { page, limit, status: 'SHORTLISTED' }
    })).data,
  });

  const scheduleMutation = useMutation({
    mutationFn: async () => {
      return (await api.post('/hiring/interviews', {
        candidateId: schedulingFor._id,
        ...formData
      })).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shortlisted-candidates'] });
      setSchedulingFor(null);
    }
  });

  const candidates = data?.data || [];
  const meta = data?.meta || { total: 0, totalPages: 1 };

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-4 mb-10 p-4">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-[#0d3c68]" /> Shortlisted Candidates
          </h1>
          <p className="text-sm text-slate-500 mt-1">Candidates approved by HOD, ready for interview scheduling.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 font-semibold text-slate-700">Candidate</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Role</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Status</th>
              <th className="px-6 py-3 font-semibold text-slate-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                  Loading...
                </td>
              </tr>
            )}
            {!isLoading && candidates.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  No shortlisted candidates found.
                </td>
              </tr>
            )}
            {!isLoading && candidates.map((c) => (
              <tr key={c._id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{c.firstName} {c.lastName}</div>
                  <div className="text-xs text-slate-500">{c.email}</div>
                </td>
                <td className="px-6 py-4 text-slate-700">{c.jobRole}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    Shortlisted
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button size="sm" onClick={() => setSchedulingFor(c)} className="bg-[#0d3c68] text-white">
                      <Calendar size={14} className="mr-2" /> Schedule Interview
                    </Button>
                    <Link href={`/dashboard/hiring/${c._id}`} className="text-slate-500 hover:underline text-xs">
                      View
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center bg-slate-50">
          <span className="text-sm text-slate-500">Total: {meta.total}</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
            <button disabled={page >= meta.totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>

      {/* Scheduling Modal */}
      {schedulingFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold">Schedule Interview</h2>
              <button onClick={() => setSchedulingFor(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-sm text-slate-600">
                Candidate: <span className="font-semibold">{schedulingFor.firstName} {schedulingFor.lastName}</span>
              </p>
              
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Date & Time</label>
                <input 
                  type="datetime-local" 
                  className="w-full border p-2 rounded text-sm"
                  value={formData.scheduledDate}
                  onChange={e => setFormData({...formData, scheduledDate: e.target.value})}
                />
              </div>

              {/* Note: In a real app, interviewerId should be a dropdown of users. Using text for simplicity */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Interviewer ID (Optional)</label>
                <input 
                  type="text" 
                  className="w-full border p-2 rounded text-sm"
                  placeholder="Enter interviewer User ID"
                  value={formData.interviewerId}
                  onChange={e => setFormData({...formData, interviewerId: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Round Type</label>
                <select 
                  className="w-full border p-2 rounded text-sm"
                  value={formData.roundType}
                  onChange={e => setFormData({...formData, roundType: e.target.value})}
                >
                  <option>Technical</option>
                  <option>HR</option>
                  <option>Managerial</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Mode</label>
                <select 
                  className="w-full border p-2 rounded text-sm"
                  value={formData.mode}
                  onChange={e => setFormData({...formData, mode: e.target.value})}
                >
                  <option>Online</option>
                  <option>In-Person</option>
                </select>
              </div>

              {formData.mode === 'Online' ? (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Meeting Link</label>
                  <input 
                    type="url" 
                    className="w-full border p-2 rounded text-sm"
                    value={formData.meetingLink}
                    onChange={e => setFormData({...formData, meetingLink: e.target.value})}
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Location</label>
                  <input 
                    type="text" 
                    className="w-full border p-2 rounded text-sm"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              )}
            </div>
            <div className="p-4 border-t bg-slate-50 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSchedulingFor(null)}>Cancel</Button>
              <Button 
                onClick={() => scheduleMutation.mutate()} 
                disabled={!formData.scheduledDate || scheduleMutation.isPending}
                className="bg-[#0d3c68] text-white"
              >
                {scheduleMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : 'Schedule'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
