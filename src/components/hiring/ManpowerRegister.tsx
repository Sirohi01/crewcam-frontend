'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, FileText, Pencil, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/axios';
import { openFileUrl } from '@/lib/fileUrls';

const PAGE_SIZE = 20;

function unwrapList(payload: any) {
  if (Array.isArray(payload)) return { rows: payload, meta: { page: 1, totalPages: 1, total: payload.length } };
  return { rows: payload?.data || [], meta: payload?.meta || { page: 1, totalPages: 1, total: 0 } };
}

export default function ManpowerRegister() {
  const qc = useQueryClient();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [query, status]);

  const params = {
    page,
    limit: PAGE_SIZE,
    ...(status !== 'All' ? { status } : {}),
    ...(query.trim() ? { search: query.trim() } : {}),
  };

  const { data, isLoading } = useQuery({
    queryKey: ['manpower-requests', params],
    queryFn: async () => unwrapList((await api.get('/hiring/manpower-request', { params })).data),
  });

  const rows = data?.rows || [];
  const meta = data?.meta || { page: 1, totalPages: 1, total: 0 };
  const refresh = () => qc.invalidateQueries({ queryKey: ['manpower-requests'] });
  const changeStatus = useMutation({
    mutationFn: async ({ id, nextStatus }: { id: string; nextStatus: 'Approved' | 'Rejected' }) => (await api.put(`/hiring/manpower-request/${id}/status`, { status: nextStatus })).data,
    onSuccess: refresh,
  });
  const generatePdf = useMutation({
    mutationFn: async (id: string) => (await api.post(`/hiring/manpower-request/${id}/generate-pdf`)).data,
    onSuccess: (payload) => {
      refresh();
      openFileUrl(payload.pdfUrl);
    },
  });

  return <div className="mx-auto max-w-[1500px] space-y-4 pb-10">
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-zinc-200 pb-3 dark:border-zinc-800">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">Hiring process · Step 1</p>
        <h1 className="mt-1 text-xl font-semibold">Manpower Requisition Register</h1>
        <p className="mt-1 text-sm text-zinc-500">Review, approve and print requirements before candidate intake.</p>
      </div>
      <Button asChild className="bg-[#0e4778] hover:bg-[#073a69]"><Link href="/dashboard/hiring/manpower/new"><Plus size={15} className="mr-2" />Add Manpower</Link></Button>
    </div>

    <Card><CardContent className="grid gap-2 p-3 md:grid-cols-[1fr_180px]">
      <label className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search position, designation, department or branch..." className="h-9 w-full rounded-md border border-zinc-300 bg-white pl-9 pr-3 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
      </label>
      <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"><option>All</option><option>Pending</option><option>Approved</option><option>Rejected</option></select>
    </CardContent></Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm">{meta.total || rows.length} requisition{(meta.total || rows.length) === 1 ? '' : 's'}</CardTitle>
        <span className="text-xs text-zinc-500">Page {meta.page || page} of {meta.totalPages || 1}</span>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] text-left text-xs">
            <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-900"><tr><th className="px-4 py-3 font-medium">Request date</th><th className="px-4 py-3 font-medium">Position</th><th className="px-4 py-3 font-medium">Department</th><th className="px-4 py-3 font-medium">Branch</th><th className="px-4 py-3 font-medium">Positions</th><th className="px-4 py-3 font-medium">Joining date</th><th className="px-4 py-3 font-medium">Priority</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 text-right font-medium">Actions</th></tr></thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {isLoading && <tr><td colSpan={9} className="px-4 py-7 text-zinc-500">Loading requisitions...</td></tr>}
              {rows.map((request: any) => <tr key={request._id}>
                <td className="px-4 py-3">{request.requestDate ? new Date(request.requestDate).toLocaleDateString() : '-'}</td>
                <td className="px-4 py-3 font-medium">{request.jobTitle}<span className="mt-0.5 block font-normal text-zinc-500">{request.designation || '-'}</span></td>
                <td className="px-4 py-3">{request.departmentId?.name || '-'}</td>
                <td className="px-4 py-3">{request.locationBranchId?.name || request.workLocation || '-'}</td>
                <td className="px-4 py-3 text-center">{request.numberOfPositions}</td>
                <td className="px-4 py-3">{request.requiredJoiningDate ? new Date(request.requiredJoiningDate).toLocaleDateString() : '-'}</td>
                <td className="px-4 py-3">{request.priority || '-'}</td>
                <td className="px-4 py-3"><span className="rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-semibold dark:bg-zinc-800">{request.status}</span></td>
                <td className="px-4 py-3"><div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" asChild><Link href={`/dashboard/hiring/manpower/${request._id}`}><Eye size={13} className="mr-1" />View</Link></Button>
                  {request.status === 'Pending' && <Button size="sm" variant="outline" asChild><Link href={`/dashboard/hiring/manpower/${request._id}/edit`}><Pencil size={13} className="mr-1" />Edit</Link></Button>}
                  {request.status === 'Pending' && <><Button size="sm" onClick={() => changeStatus.mutate({ id: request._id, nextStatus: 'Approved' })}>Approve</Button><Button size="sm" variant="outline" onClick={() => changeStatus.mutate({ id: request._id, nextStatus: 'Rejected' })}>Reject</Button></>}
                  <Button size="sm" variant="outline" disabled={generatePdf.isPending} onClick={() => generatePdf.mutate(request._id)}><FileText size={13} className="mr-1" />PDF</Button>
                </div></td>
              </tr>)}
              {!isLoading && !rows.length && <tr><td colSpan={9} className="px-4 py-8 text-center text-zinc-500">No requisitions match the selected filters.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-zinc-100 px-4 py-3 text-xs dark:border-zinc-800">
          <span className="text-zinc-500">Showing {rows.length} of {meta.total || rows.length}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={page <= 1 || isLoading} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</Button>
            <Button size="sm" variant="outline" disabled={page >= (meta.totalPages || 1) || isLoading} onClick={() => setPage((value) => value + 1)}>Next</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>;
}
