'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ClipboardCheck, CalendarDays } from 'lucide-react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';

export default function AssessmentPage() {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading } = useQuery<{ data: any[]; meta: any }>({
    queryKey: ['scheduled-interviews', page],
    queryFn: async () => (await api.get('/hiring/candidates', {
      params: { page, limit, status: 'INTERVIEW_SCHEDULED' }
    })).data,
  });

  const candidates = data?.data || [];
  const meta = data?.meta || { total: 0, totalPages: 1 };

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-4 mb-10 p-4">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ClipboardCheck className="text-[#0d3c68]" /> Interview Assessments
          </h1>
          <p className="text-sm text-slate-500 mt-1">Select a candidate to fill out their interview evaluation sheet.</p>
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
                  No candidates with scheduled interviews found.
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
                  <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                    Interview Scheduled
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button size="sm" asChild className="bg-[#0d3c68] text-white">
                      <Link href={`/dashboard/hiring/${c._id}/steps/evaluation`}>
                        <ClipboardCheck size={14} className="mr-2" /> Fill Evaluation
                      </Link>
                    </Button>
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
    </div>
  );
}
