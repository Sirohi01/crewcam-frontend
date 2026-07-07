'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/shared/DataTable';
import { getHiringStepById } from '@/lib/hiringSteps';
import api from '@/lib/axios';

export default function HiringStepLanding({ stepId }: { stepId: string }) {
  const step = getHiringStepById(stepId);
  const router = useRouter();
  const { data: candidates, isLoading } = useQuery<any[]>({
    queryKey: ['candidates'],
    queryFn: async () => (await api.get('/hiring/candidates')).data,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchValue, setSearchValue] = useState('');

  if (!step) return <div className="py-16 text-center text-sm text-zinc-500">This hiring step does not exist.</div>;

  const columns = [
    {
      key: 'index',
      label: 'S.NO',
      width: '60px',
      align: 'center' as const,
      render: (_: any, __: any, idx: number) => (
        <span className="text-slate-500 font-medium">{idx + 1}</span>
      ),
    },
    {
      key: 'firstName',
      label: 'CANDIDATE NAME',
      width: '200px',
      render: (_: any, row: any) => (
        <span className="font-semibold text-slate-800">{row.firstName} {row.lastName}</span>
      ),
    },
    {
      key: 'jobRole',
      label: 'POSITION',
      width: '180px',
    },
    {
      key: 'department',
      label: 'DEPARTMENT',
      width: '150px',
    },
    {
      key: 'joiningDate',
      label: 'JOINING DATE',
      width: '140px',
      render: (_: any, row: any) =>
        row.joiningDate
          ? <span className="font-semibold text-[#0d3c68]">{new Date(row.joiningDate).toLocaleDateString('en-GB').replace(/\//g, '/')}</span>
          : <span className="text-slate-400">—</span>,
    },
    {
      key: 'status',
      label: 'STATUS',
      width: '130px',
      align: 'center' as const,
      render: (_: any, row: any) => (
        <div className="relative inline-block">
          <select
            defaultValue="active"
            className="appearance-none cursor-pointer pl-2 pr-7 py-1 rounded-[2px] text-[10px] font-bold uppercase tracking-wider transition-all border outline-none bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
          >
            <option value="active">ACTIVE</option>
            <option value="inactive">INACTIVE</option>
          </select>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-green-700 text-[8px]">▾</span>
        </div>
      ),
    },
    {
      key: 'updatedAt',
      label: 'LAST UPDATE',
      width: '160px',
      render: (_: any, row: any) => (
        <span className="text-slate-500 font-medium text-[10px]">
          {row.updatedAt
            ? new Date(row.updatedAt).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).replace(',', '')
            : 'N/A'}
        </span>
      ),
    },
  ];

  return (
    <div className="page-container bg-slate-50/50 min-h-screen pb-10">
      {/* Page Header - hr-crm-final style */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 mb-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-[#0d3c68] uppercase tracking-[0.18em] mb-1">
              HIRING WORKFLOW · STEP {step.step} OF 24
            </p>
            <h1 className="text-[22px] font-extrabold text-[#0d3c68] uppercase tracking-tight leading-none">
              {step.title.toUpperCase()}
            </h1>
          </div>
        </div>
        <div className="mt-3 h-[3px] w-full bg-[#0d3c68] rounded-full" />
      </div>

      {/* Full-width DataTable */}
      <div className="px-4">
        <DataTable
          columns={columns}
          data={candidates || []}
          loading={isLoading}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }}
          searchValue={searchValue}
          onSearchChange={(v) => { setSearchValue(v); setCurrentPage(1); }}
          onRowClick={(c: any) => router.push(`/company/hiring/${c._id}/steps/${step.id}`)}
          onView={(c: any) => router.push(`/company/hiring/${c._id}/steps/${step.id}`)}
          onNextStep={(c: any) => router.push(`/company/hiring/${c._id}/steps/${step.id}`)}
          showActions={true}
          showPrint={false}
          selectable={true}
        />
      </div>
    </div>
  );
}
