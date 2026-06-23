'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FileText, Pencil } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/axios';
import { openFileUrl } from '@/lib/fileUrls';

function value(text: any) {
  if (!text) return '-';
  if (typeof text === 'string') return text;
  return text.name || `${text.firstName || ''} ${text.lastName || ''}`.trim() || '-';
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="rounded-lg border border-zinc-100 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950"><p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{label}</p><div className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">{children}</div></div>;
}

export default function ManpowerRequestDetail({ id }: { id: string }) {
  const qc = useQueryClient();
  const { data: request, isLoading } = useQuery({ queryKey: ['manpower-request', id], queryFn: async () => (await api.get(`/hiring/manpower-request/${id}`)).data });
  const generatePdf = useMutation({
    mutationFn: async () => (await api.post(`/hiring/manpower-request/${id}/generate-pdf`)).data,
    onSuccess: (payload) => {
      qc.invalidateQueries({ queryKey: ['manpower-request', id] });
      openFileUrl(payload.pdfUrl);
    },
  });

  if (isLoading) return <div className="p-6 text-sm text-zinc-500">Loading manpower request...</div>;
  if (!request) return <div className="p-6 text-sm text-zinc-500">Manpower request not found.</div>;

  const details = [
    ['Department', value(request.departmentId)],
    ['Position / Job Title', request.jobTitle || request.designation || '-'],
    ['Work Location', value(request.locationBranchId) || request.workLocation || '-'],
    ['Reporting To', value(request.reportingTo)],
    ['Requested By', value(request.requestedBy)],
    ['Positions', request.numberOfPositions || '-'],
    ['Employment Type', request.employmentTypes?.join(', ') || request.employmentType || '-'],
    ['Reason For Hiring', request.hiringReasons?.join(', ') || request.reasonForHiring || '-'],
    ['Salary Range', `${request.salaryCtcMin || '-'} to ${request.salaryCtcMax || '-'}`],
    ['Recruitment Status', request.recruitmentStatus || request.status || '-'],
  ];

  return <div className="mx-auto max-w-[1300px] space-y-4 pb-10">
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-zinc-200 pb-3 dark:border-zinc-800">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">Hiring process · Step 1</p>
        <h1 className="mt-1 text-xl font-semibold">Manpower Requisition Details</h1>
        <p className="mt-1 text-sm text-zinc-500">View the source requisition record before candidate intake.</p>
      </div>
      <div className="flex gap-2">
        {request.status === 'Pending' && <Button variant="outline" asChild><Link href={`/dashboard/hiring/manpower/${id}/edit`}><Pencil size={15} className="mr-2" />Edit</Link></Button>}
        <Button disabled={generatePdf.isPending} onClick={() => generatePdf.mutate()} className="bg-[#0e4778] hover:bg-[#073a69]"><FileText size={15} className="mr-2" />Generate PDF</Button>
      </div>
    </div>

    <Card><CardHeader><CardTitle className="text-sm">Core details</CardTitle></CardHeader><CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{details.map(([label, text]) => <Row key={label} label={label}>{text}</Row>)}</CardContent></Card>
    <Card><CardHeader><CardTitle className="text-sm">Requirement notes</CardTitle></CardHeader><CardContent className="grid gap-3 md:grid-cols-2">
      <Row label="Detailed Justification">{request.detailedJustification || '-'}</Row>
      <Row label="Job Description Summary"><p className="whitespace-pre-wrap">{request.jobDescriptionSummary || '-'}</p></Row>
      <Row label="KRA Report"><p className="whitespace-pre-wrap">{request.kraReport || '-'}</p></Row>
      <Row label="Other Benefits"><p className="whitespace-pre-wrap">{request.otherBenefits || '-'}</p></Row>
    </CardContent></Card>
  </div>;
}
