'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, ExternalLink, RefreshCw, ChevronLeft, ChevronRight, Eye, Edit2, Trash2, ArrowUpDown, X, UserRound, ArrowRight, ShieldCheck, FileText, CheckCircle, XCircle } from 'lucide-react';
import api from '@/lib/axios';
import { getHiringStepById, HIRING_STEPS } from '@/lib/hiringSteps';
import { openFileUrl } from '@/lib/fileUrls';
import { Button } from '@/components/ui/button';

const idOf = (value: any) => typeof value === 'object' && value ? String(value._id || '') : String(value || '');
const nameOf = (value: any) => value && typeof value === 'object' && value.firstName ? `${value.firstName} ${value.lastName || ''}`.trim() : '';
const prettyKey = (key: string) => key.replace(/([A-Z])/g, ' $1').replace(/[._]/g, ' ').replace(/^./, (letter) => letter.toUpperCase());
const displayValue = (value: any): string => {
  if (value === undefined || value === null || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (value instanceof Date) return value.toLocaleDateString();
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) return new Date(value).toLocaleDateString();
  if (Array.isArray(value)) return value.map(displayValue).join(', ');
  if (typeof value === 'object') return nameOf(value) || value.name || value.title || 'Saved details';
  return String(value);
};
const nestedValue = (row: Record<string, any>, path: string) => path.split('.').reduce((value, key) => value?.[key], row);
const detailRows = (value: any, prefix = ''): { label: string; value: string }[] => {
  if (value === undefined || value === null || value === '') return [];
  if (Array.isArray(value)) return value.flatMap((item, index) => detailRows(item, `${prefix || 'Item'} ${index + 1}`));
  if (typeof value === 'object' && !(value instanceof Date)) return Object.entries(value)
    .filter(([key]) => !['_id', '__v', 'tenantId', 'passwordHash'].includes(key))
    .flatMap(([key, item]) => detailRows(item, prefix ? `${prefix} · ${prettyKey(key)}` : prettyKey(key)));
  const masked = /aadhaar|pan|account number/i.test(prefix) ? `••••${String(value).slice(-4)}` : displayValue(value);
  return [{ label: prefix || 'Value', value: masked }];
};

export default function HiringRegisterShell({ stepId }: { stepId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const step = getHiringStepById(stepId);
  const currentIndex = HIRING_STEPS.findIndex((s) => s.id === stepId);
  const nextStep = currentIndex !== -1 && currentIndex < HIRING_STEPS.length - 1 ? HIRING_STEPS[currentIndex + 1] : null;

  const proceedToNextStep = async (row: any) => {
    if (!nextStep) return;
    if (nextStep.entityField === 'employeeId') {
      const employeeId = idOf(row.employeeId) || (step?.entityField === 'employeeId' ? idOf(row[step?.entityField]) : null);
      if (employeeId) {
        const response = await api.get(`/hiring/employees/${employeeId}/candidate`);
        router.push(`/dashboard/hiring/${response.data.candidateId}/steps/${nextStep.id}`);
        return;
      }
    }
    const candidateId = idOf(row.candidateId) || (step?.entityField === 'candidateId' ? idOf(row[step?.entityField]) : null);
    if (!candidateId) return;
    router.push(`/dashboard/hiring/${candidateId}/steps/${nextStep.id}`);
  };
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [candidateSearch, setCandidateSearch] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  const { data: people = [] } = useQuery<any[]>({
    queryKey: ['hiring-register-people', step?.entityField],
    queryFn: async () => step?.entityField === 'employeeId'
      ? (await api.get('/employees')).data.data || []
      : (await api.get('/hiring/candidates')).data,
    enabled: showAddModal,
  });
  const { data: candidateDirectory = [] } = useQuery<any[]>({
    queryKey: ['hiring-candidate-directory'],
    queryFn: async () => (await api.get('/hiring/candidates')).data,
  });
  const { data: employeeDirectory = [] } = useQuery<any[]>({
    queryKey: ['hiring-employee-directory'],
    queryFn: async () => (await api.get('/employees')).data.data || [],
  });

  const { data: records = [], isLoading, refetch } = useQuery<any[]>({
    queryKey: ['hiring-register', step?.apiPath],
    queryFn: async () => {
      const response = await api.get(step!.apiPath, { params: { details: 'true' } });
      return Array.isArray(response.data) ? response.data : (response.data.data || []);
    },
    enabled: !!step,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => (await api.delete(`${step!.apiPath}/${id}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hiring-register', step?.apiPath] });
    },
  });

  const pdfMutation = useMutation({
    mutationFn: async (recordId: string) => (await api.post(`${step!.apiPath}/${recordId}/generate-pdf`)).data,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['hiring-register', step?.apiPath] });
      const url = data.pdfUrl || data.loi?.pdfUrl || data.offer?.pdfUrl || data.nda?.pdfUrl || data.letter?.pdfUrl || data.card?.pdfUrl;
      if (url) openFileUrl(url);
    },
  });

  const actionMutation = useMutation({
    mutationFn: async ({ recordId, action }: { recordId: string; action: any }) => {
      const url = `${step!.apiPath}/${recordId}${action.pathSuffix}`;
      return action.method === 'POST' ? (await api.post(url, action.payload || {})).data : (await api.put(url, action.payload || {})).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hiring-register', step?.apiPath] });
    },
  });
  const loiStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => (await api.put(`/hiring/loi/${id}/status`, { status })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hiring-register', step?.apiPath] }),
    onError: (error: any) => window.alert(error?.response?.data?.message || 'Unable to update LOI status'),
  });

  if (!step) return <div className="p-8 text-center text-sm text-zinc-500">Unknown register step.</div>;

  const dynamicColumns = step.listColumns || step.fields.slice(0, 3).map((f) => ({ key: f.name, label: f.label }));
  const subjectName = (row: any) => {
    const linked = step.entityField === 'employeeId' ? row.employeeId : row.candidateId;
    const direct = nameOf(linked);
    if (direct) return direct;
    if (row.candidateName) return row.candidateName;
    const source = step.entityField === 'employeeId' ? employeeDirectory : candidateDirectory;
    const person = source.find((entry: any) => String(entry._id) === idOf(linked));
    return person ? `${person.firstName} ${person.lastName || ''}`.trim() : 'Not linked';
  };
  const openRecordForm = async (row: any) => {
    if (step.entityField === 'employeeId') {
      const employeeId = idOf(row.employeeId);
      if (!employeeId) return;
      const response = await api.get(`/hiring/employees/${employeeId}/candidate`);
      router.push(`/dashboard/hiring/${response.data.candidateId}/steps/${stepId}?edit=${row._id}`);
      return;
    }
    const candidateId = idOf(row.candidateId);
    if (!candidateId) return;
    router.push(`/dashboard/hiring/${candidateId}/steps/${stepId}?edit=${row._id}`);
  };

  const filteredData = records.filter((item: any) => {
    const searchMatch = Object.values(item).some((v) => String(v).toLowerCase().includes(search.toLowerCase()));
    const columnMatch = Object.entries(columnFilters).every(([key, filterValue]) => {
      if (!filterValue) return true;
      const cellValue = String(item[key] || '');
      return cellValue.toLowerCase().includes(filterValue.toLowerCase());
    });
    return searchMatch && columnMatch;
  });

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="bg-white rounded-[4px] shadow-sm border border-slate-200 overflow-hidden mb-10 w-full max-w-[1400px] mx-auto">
      <div className="bg-slate-50 px-3 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0d3c68] border-b-2 border-[#0d3c68] pb-0.5">
            {step.title.toUpperCase()} RECORDS
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-7 gap-2 px-3 text-[11px] font-bold uppercase" onClick={() => refetch()}>
            <RefreshCw size={12} /> Refresh
          </Button>
          <Button onClick={() => setShowAddModal(true)} className="h-7 gap-2 bg-[#0d3c68] px-3 text-[11px] font-bold uppercase hover:bg-[#0a2e50] text-white rounded-[2px]">
            <ExternalLink size={12} /> Add New
          </Button>
        </div>
      </div>

      <div className="p-4 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            Show
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="border border-slate-300 rounded px-1.5 py-1 outline-none focus:border-[#0d3c68]"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            entries
          </div>
          <div className="relative">
            <span className="text-xs text-slate-600 font-medium mr-2">Search:</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-slate-300 rounded px-2 py-1 text-xs outline-none focus:border-[#0d3c68] w-[200px]"
            />
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-[2px]">
          <table className="w-full text-left text-[11px] whitespace-nowrap">
            <thead className="bg-[#111] text-white">
              <tr>
                <th className="px-3 py-2.5 border-r border-[#333] w-10 text-center"><input type="checkbox" className="rounded" /></th>
                <th className="px-3 py-2.5 font-bold uppercase tracking-wider border-r border-[#333] w-12 text-center">S.No</th>
                {dynamicColumns.map((col) => (
                  <th key={col.key} className="px-3 py-2.5 font-bold uppercase tracking-wider border-r border-[#333] min-w-[120px]">
                    <div className="flex items-center justify-between">{col.label} <ArrowUpDown size={12} className="opacity-50" /></div>
                  </th>
                ))}
                <th className="px-3 py-2.5 font-bold uppercase tracking-wider min-w-[180px] text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={dynamicColumns.length + 3} className="p-4 text-center text-slate-500">Loading records...</td></tr>
              ) : paginatedData.length === 0 ? (
                <tr><td colSpan={dynamicColumns.length + 3} className="p-4 text-center text-slate-500">No records found.</td></tr>
              ) : (
                paginatedData.map((row, index) => (
                  <tr key={row._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-2 border-r border-slate-100 text-center">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100 text-center font-medium text-slate-500">
                      {(page - 1) * pageSize + index + 1}
                    </td>
                    {dynamicColumns.map((col) => (
                      <td key={col.key} className="px-3 py-2 border-r border-slate-100 text-slate-700">
                        {displayValue(nestedValue(row, col.key))}
                      </td>
                    ))}
                    <td className="px-3 py-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setSelectedRecord(row)} className="p-1.5 text-slate-700 hover:bg-slate-100 rounded transition-colors" title="View complete details">
                          <Eye size={13} />
                        </button>
                        <button onClick={() => openRecordForm(row)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => { if(confirm('Are you sure you want to delete this record?')) deleteMutation.mutate(row._id); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                          <Trash2 size={13} />
                        </button>
                        {step.hasPdf && (
                          <button onClick={() => pdfMutation.mutate(row._id)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors flex items-center gap-1" title="Generate PDF">
                            <FileText size={13} />
                          </button>
                        )}
                        {(step.postCreateActions || []).map((action) => {
                          const lower = action.label.toLowerCase();
                          const isApprove = lower.includes('approve') || lower.includes('accept') || lower.includes('confirm') || lower.includes('verify') || lower.includes('issue');
                          const isReject = lower.includes('reject') || lower.includes('decline') || lower.includes('terminate');
                          return (
                            <button 
                              key={action.label} 
                              onClick={() => actionMutation.mutate({ recordId: row._id, action })} 
                              className={`p-1.5 rounded transition-colors flex items-center gap-1 ${isApprove ? 'text-emerald-600 hover:bg-emerald-50' : isReject ? 'text-red-600 hover:bg-red-50' : 'text-indigo-600 hover:bg-indigo-50'}`} 
                              title={action.label}
                            >
                              {isApprove ? <CheckCircle size={13} /> : isReject ? <XCircle size={13} /> : <ShieldCheck size={13} />}
                            </button>
                          );
                        })}
                        {nextStep && (
                          <button onClick={() => proceedToNextStep(row)} className="p-1.5 text-zinc-600 hover:bg-zinc-100 rounded transition-colors flex items-center gap-1" title="Proceed to Next Step">
                            <ArrowRight size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="bg-slate-50">
              <tr>
                <td className="px-3 py-2 border-r border-slate-200"></td>
                <td className="px-3 py-2 border-r border-slate-200"></td>
                {dynamicColumns.map((col) => (
                  <td key={col.key} className="px-3 py-2 border-r border-slate-200">
                    <div className="relative">
                      <Search size={10} className="absolute left-2 top-2 text-slate-400" />
                      <input type="text" placeholder="Search..." className="w-full pl-6 pr-2 py-1 text-[10px] border border-slate-300 rounded outline-none focus:border-[#0d3c68]" value={columnFilters[col.key] || ''} onChange={(e) => setColumnFilters({ ...columnFilters, [col.key]: e.target.value })} />
                    </div>
                  </td>
                ))}
                <td className="px-3 py-2"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-xs text-slate-600 font-medium">
            Showing {filteredData.length === 0 ? 0 : (page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredData.length)} of {filteredData.length} entries
          </div>
          <div className="flex gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-2 py-1 text-xs border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-slate-600">
              Previous
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-2 py-1 text-xs border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-slate-600">
              Next
            </button>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-md bg-white shadow-xl overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-slate-50">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Select Candidate</h3>
                <p className="text-xs text-slate-500 mt-0.5">Choose a candidate to start {step.title}</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-5 border-b border-slate-100">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  autoFocus
                  className="w-full rounded-[4px] border border-slate-300 bg-white py-2 pl-9 pr-3 text-[13px] outline-none transition focus:border-[#0d3c68] focus:ring-1 focus:ring-[#0d3c68]"
                  placeholder="Search candidate by name, email or role..."
                  value={candidateSearch}
                  onChange={(e) => setCandidateSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-50">
              {people
                .filter((candidate) => `${candidate.firstName} ${candidate.lastName} ${candidate.jobRole || candidate.employeeCode || ''} ${candidate.email}`.toLowerCase().includes(candidateSearch.toLowerCase()))
                .map((candidate) => (
                  <button
                    key={candidate._id}
                    onClick={async () => {
                      if (step.entityField === 'employeeId') {
                        const response = await api.get(`/hiring/employees/${candidate._id}/candidate`);
                        router.push(`/dashboard/hiring/${response.data.candidateId}/steps/${stepId}`);
                        return;
                      }
                      router.push(`/dashboard/hiring/${candidate._id}/steps/${stepId}`);
                    }}
                    className="w-full group flex items-center justify-between gap-3 p-4 transition-colors hover:bg-blue-50/50 text-left"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        <UserRound size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900 group-hover:text-[#0d3c68] transition-colors">{candidate.firstName} {candidate.lastName}</p>
                        <p className="mt-0.5 truncate text-[11px] font-medium text-slate-500">{candidate.jobRole} · {candidate.email}</p>
                      </div>
                    </div>
                    <span className="flex shrink-0 items-center gap-1 text-[11px] font-bold uppercase text-[#0d3c68] opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                      Open <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
      {selectedRecord && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div><h3 className="text-base font-semibold text-slate-900">{step.title} Details</h3><p className="text-xs text-slate-500">{subjectName(selectedRecord)}</p></div>
              <button onClick={() => setSelectedRecord(null)} className="rounded p-1.5 text-slate-500 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="grid flex-1 gap-x-6 gap-y-3 overflow-y-auto p-5 md:grid-cols-2">
              {detailRows(selectedRecord).map((entry, index) => <div key={`${entry.label}-${index}`} className="border-b border-slate-100 pb-2"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{entry.label}</p><p className="mt-1 break-words text-sm text-slate-800">{entry.value}</p></div>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
