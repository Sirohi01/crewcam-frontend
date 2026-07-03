'use client';
import React, { Suspense, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { DataTable, Column } from '@/components/shared/DataTable';
import { Plus, X, Users, Clock, CalendarDays, CalendarRange, BellRing, Upload, MessageCircle, UserCog, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import api from '@/lib/axios';
import { STAGE_LABELS, STAGE_COLOR, LEAD_STAGE_GROUPS, stageGroupQuery, findStageGroup } from '@/lib/leadStages';
import { downloadCsv } from '@/lib/csv';
import LeadScoreBadge from '@/components/leads/LeadScoreBadge';

const STAGES = ['LEAD', 'DEMO_SCHEDULED', 'PROPOSAL_SENT', 'QUOTATION_APPROVED', 'WON', 'LOST'] as const;
const SOURCES = ['WEBSITE', 'REFERRAL', 'OUTBOUND', 'EVENT', 'OTHER'] as const;
const DONUT_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6', '#ef4444'];

const EMPTY_FORM = {
  companyName: '', contactName: '', contactEmail: '', contactPhone: '',
  source: 'OTHER' as typeof SOURCES[number], stage: 'LEAD' as typeof STAGES[number],
  estimatedValue: 0, currency: 'INR' as 'INR' | 'USD', notes: '', lostReason: '',
};

export default function SuperAdminLeadsPage() {
  return (
    <Suspense fallback={null}>
      <SuperAdminLeadsPageInner />
    </Suspense>
  );
}

function SuperAdminLeadsPageInner() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [stageFilter, setStageFilter] = useState(searchParams.get('stage') || '');
  const [sourceFilter, setSourceFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const filterParams = { stage: stageFilter || undefined, source: sourceFilter || undefined, industry: industryFilter || undefined, search: search || undefined };

  const { data, isLoading } = useQuery({
    queryKey: ['super-admin', 'leads', page, pageSize, stageFilter, sourceFilter, industryFilter, search],
    queryFn: async () => (await api.get('/super-admin/leads', { params: { page, limit: pageSize, ...filterParams } })).data,
  });

  const { data: stats } = useQuery({
    queryKey: ['super-admin', 'leads', 'stats', stageFilter],
    queryFn: async () => (await api.get('/super-admin/leads/stats', { params: { stage: stageFilter || undefined } })).data,
  });

  const rows = data?.data || [];
  const total = data?.pagination?.total ?? 0;

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['super-admin', 'leads'] });

  const openEdit = (row: any) => {
    setEditId(row._id);
    setFormData({
      companyName: row.companyName, contactName: row.contactName, contactEmail: row.contactEmail,
      contactPhone: row.contactPhone || '', source: row.source, stage: row.stage,
      estimatedValue: row.estimatedValue || 0, currency: row.currency || 'INR',
      notes: row.notes || '', lostReason: row.lostReason || '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      await api.put(`/super-admin/leads/${editId}`, formData);
      setIsModalOpen(false);
      invalidate();
    } catch (e: any) {
      setFormError(e?.response?.data?.message || 'Failed to save lead');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/super-admin/leads/${deleteId}`);
      setDeleteId(null);
      invalidate();
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to delete lead');
    }
  };

  const handleReset = () => {
    setStageFilter('');
    setSourceFilter('');
    setIndustryFilter('');
    setSearch('');
    setPage(1);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await api.get('/super-admin/leads', { params: { page: 1, limit: 10000, ...filterParams } });
      const allRows = res.data?.data || [];
      const csvRows: (string | number)[][] = [
        ['Company Name', 'Contact Name', 'Contact Email', 'Source', 'Industry', 'Status', 'Lead Score'],
        ...allRows.map((r: any) => [r.companyName, r.contactName, r.contactEmail, r.source, r.industry || '', STAGE_LABELS[r.stage] || r.stage, r.leadScore]),
      ];
      downloadCsv('leads.csv', csvRows);
    } finally {
      setExporting(false);
    }
  };

  const columns: Column<any>[] = [
    {
      key: 'companyName',
      label: 'COMPANY',
      sortable: true,
      render: (v, row) => <Link href={`/super-admin/leads/${row._id}`} className="font-medium text-indigo-600 hover:text-indigo-700">{v}</Link>,
    },
    { key: 'source', label: 'SOURCE', width: '100px' },
    { key: 'industry', label: 'INDUSTRY', width: '120px', render: (v) => v || '—' },
    {
      key: 'stage',
      label: 'STATUS',
      width: '110px',
      render: (v) => <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${STAGE_COLOR[v]}`}>{STAGE_LABELS[v] || v}</span>,
    },
    {
      key: 'leadScore',
      label: 'LEAD SCORE',
      width: '120px',
      render: (v) => <LeadScoreBadge score={v || 0} />,
    },
    {
      key: 'assignedTo',
      label: 'ASSIGNED TO / UPDATED',
      width: '160px',
      render: (_v, row) => (
        <div className="text-[11px] text-zinc-500">
          <p className="font-medium text-zinc-700">{row.assignedTo ? `${row.assignedTo.firstName} ${row.assignedTo.lastName}` : 'Unassigned'}</p>
          <p>{row.updatedAt ? formatDistanceToNow(new Date(row.updatedAt), { addSuffix: true }) : '—'}</p>
        </div>
      ),
    },
    {
      key: 'actions',
      label: '',
      width: '170px',
      sortable: false,
      filterable: false,
      render: (_v, row) => (
        <div className="flex justify-end gap-1.5">
          {row.stage === 'WON' && !row.convertedTenantId && (
            <Link href={`/super-admin/companies?fromLead=${row._id}`} className="text-xs font-medium text-indigo-600 hover:text-indigo-700 px-1.5">Convert</Link>
          )}
          <button onClick={() => openEdit(row)} className="text-xs font-medium text-indigo-600 hover:text-indigo-700 px-1.5">Edit</button>
          <button onClick={() => setDeleteId(row._id)} className="text-xs font-medium text-rose-600 hover:text-rose-700 px-1.5">Delete</button>
        </div>
      ),
    },
  ];

  const activeGroup = findStageGroup(stageFilter);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">{activeGroup ? activeGroup.pageTitle : 'Master Data — All Leads'}</h1>
          <p className="text-xs text-zinc-500">{activeGroup ? activeGroup.subtitle : 'Every lead in the pipeline, regardless of status.'}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/super-admin/leads/new">
            <Button className="h-8 text-xs bg-indigo-600 text-white hover:bg-indigo-700">
              <Plus size={14} className="mr-1" /> Add Lead
            </Button>
          </Link>
          <Link href="/super-admin/leads/import">
            <Button variant="outline" className="h-8 text-xs">
              <Upload size={14} className="mr-1" /> Import Leads
            </Button>
          </Link>
          <Button variant="outline" disabled title="Coming soon — requires a WhatsApp Business API integration" className="h-8 text-xs opacity-60 cursor-not-allowed">
            <MessageCircle size={14} className="mr-1" /> Send Bulk WhatsApp
          </Button>
        </div>
      </div>

      <div className="flex gap-3 items-start">
        <div className="flex-1 min-w-0 space-y-3">
          <div className="grid grid-cols-5 gap-3">
            <StatCard label="Total Leads" value={stats?.total ?? '—'} icon={<Users size={14} className="text-indigo-500" />} sub="Matching current filters" />
            <StatCard label="Today's Leads" value={stats?.today ?? '—'} icon={<Clock size={14} className="text-emerald-500" />} sub="Created today" />
            <StatCard label="This Week" value={stats?.thisWeek ?? '—'} icon={<CalendarDays size={14} className="text-amber-500" />} sub="Last 7 days" />
            <StatCard label="This Month" value={stats?.thisMonth ?? '—'} icon={<CalendarRange size={14} className="text-violet-500" />} sub="Last 30 days" />
            <StatCard label="Pending Follow-Ups" value={stats?.pendingFollowUps ?? '—'} icon={<BellRing size={14} className="text-rose-500" />} sub="Due or unscheduled" />
          </div>

          <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg">
            <CardContent className="p-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 min-w-[200px]">
                  <input
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search lead by name, company, email..."
                    className="w-full h-8 border border-zinc-200 rounded-lg text-xs px-3"
                  />
                </div>
                <select value={sourceFilter} onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }} className="h-8 border border-zinc-200 rounded-lg text-xs px-2.5 bg-white">
                  <option value="">Source</option>
                  {(stats?.bySource || []).map((s: any) => <option key={s.source} value={s.source}>{s.source}</option>)}
                </select>
                <select value={stageFilter} onChange={(e) => { setStageFilter(e.target.value); setPage(1); }} className="h-8 border border-zinc-200 rounded-lg text-xs px-2.5 bg-white">
                  <option value="">Status</option>
                  {LEAD_STAGE_GROUPS.map((g) => <option key={g.key} value={stageGroupQuery(g)}>{g.navLabel}</option>)}
                </select>
                <select value={industryFilter} onChange={(e) => { setIndustryFilter(e.target.value); setPage(1); }} className="h-8 border border-zinc-200 rounded-lg text-xs px-2.5 bg-white">
                  <option value="">Industry</option>
                  {(stats?.byIndustry || []).map((i: any) => <option key={i.industry} value={i.industry}>{i.industry}</option>)}
                </select>
                <Button variant="outline" onClick={handleReset} className="h-8 text-xs">Reset</Button>
                <Button onClick={handleExport} disabled={exporting} className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Download size={14} className="mr-1" /> {exporting ? 'Exporting...' : 'Export'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <DataTable
            columns={columns}
            data={rows}
            rowKey="_id"
            loading={isLoading}
            showActions={false}
            selectable
            enableColumnFilters={false}
            showSearch={false}
            showEntries={false}
            currentPage={page}
            pageSize={pageSize}
            totalItems={total}
            onPageChange={setPage}
            onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
            emptyMessage="No leads yet."
          />
        </div>

        <aside className="w-[280px] flex-shrink-0 space-y-3">
          <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg">
            <CardContent className="p-3">
              <h3 className="text-xs font-md text-zinc-900 mb-2">Follow-Ups Due <span className="text-zinc-400 font-normal">(Next 7 Days)</span></h3>
              {(stats?.followUpsDue || []).length === 0 && <p className="text-[11px] text-zinc-400">No upcoming follow-ups.</p>}
              <div className="space-y-2">
                {(stats?.followUpsDue || []).map((f: any) => (
                  <div key={f._id} className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-700 truncate">{f.companyName}</span>
                    <span className="text-zinc-400 whitespace-nowrap ml-2">{formatDistanceToNow(new Date(f.followUpDate), { addSuffix: true })}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg">
            <CardContent className="p-3">
              <h3 className="text-xs font-md text-zinc-900 mb-2">Leads by Source</h3>
              {(stats?.bySource || []).length === 0 ? (
                <p className="text-[11px] text-zinc-400">No data yet.</p>
              ) : (
                <div className="flex items-center gap-3">
                  <div style={{ width: 70, height: 70 }} className="flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={stats.bySource} dataKey="count" nameKey="source" innerRadius={20} outerRadius={32} paddingAngle={2} stroke="none">
                          {stats.bySource.map((_: any, i: number) => <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    {stats.bySource.slice(0, 5).map((s: any, i: number) => (
                      <div key={s.source} className="flex items-center gap-1.5 text-[10px] text-zinc-600">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                        <span className="truncate flex-1">{s.source}</span>
                        <span className="text-zinc-400">{s.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg">
            <CardContent className="p-3">
              <h3 className="text-xs font-md text-zinc-900 mb-2">Recent Activities</h3>
              {(stats?.recentActivities || []).length === 0 && <p className="text-[11px] text-zinc-400">No recent activity.</p>}
              <div className="space-y-2">
                {(stats?.recentActivities || []).map((a: any, i: number) => (
                  <div key={i} className="text-[11px]">
                    <p className="text-zinc-700"><span className="font-medium">{a.companyName}</span> — {a.note}</p>
                    <p className="text-zinc-400">{formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg">
            <CardContent className="p-3">
              <h3 className="text-xs font-md text-zinc-900 mb-2">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/super-admin/leads/new" className="flex flex-col items-center justify-center gap-1 rounded-lg border border-zinc-200 py-2.5 text-[10px] font-medium text-zinc-700 hover:bg-zinc-50">
                  <Plus size={14} /> Add Lead
                </Link>
                <Link href="/super-admin/leads/import" className="flex flex-col items-center justify-center gap-1 rounded-lg border border-zinc-200 py-2.5 text-[10px] font-medium text-zinc-700 hover:bg-zinc-50">
                  <Upload size={14} /> Import
                </Link>
                <button disabled title="Coming soon" className="flex flex-col items-center justify-center gap-1 rounded-lg border border-zinc-200 py-2.5 text-[10px] font-medium text-zinc-400 opacity-60 cursor-not-allowed">
                  <MessageCircle size={14} /> WhatsApp
                </button>
                <button disabled title="Coming soon" className="flex flex-col items-center justify-center gap-1 rounded-lg border border-zinc-200 py-2.5 text-[10px] font-medium text-zinc-400 opacity-60 cursor-not-allowed">
                  <UserCog size={14} /> Assign Leads
                </button>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm border border-zinc-200/50">
            <div className="p-5">
              <h3 className="text-lg font-md text-zinc-900 mb-2">Delete Lead?</h3>
              <p className="text-sm text-zinc-500 mb-6">This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" size="sm" onClick={() => setDeleteId(null)}>Cancel</Button>
                <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white" onClick={handleDelete}>Delete</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4 overflow-y-auto py-10">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg border border-zinc-200/50 my-auto">
            <div className="px-5 py-4 border-b border-zinc-100 flex justify-between items-center">
              <h2 className="text-sm font-md text-zinc-900">Edit Lead</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-1 rounded-md">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {formError && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{formError}</div>}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2">
                  <label className="block text-xs font-md text-zinc-700">Company Name *</label>
                  <input required value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-md text-zinc-700">Contact Name *</label>
                  <input required value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-md text-zinc-700">Contact Phone</label>
                  <input value={formData.contactPhone} onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2" />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <label className="block text-xs font-md text-zinc-700">Contact Email *</label>
                  <input required type="email" value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-md text-zinc-700">Source</label>
                  <select value={formData.source} onChange={(e) => setFormData({ ...formData, source: e.target.value as any })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2">
                    {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-md text-zinc-700">Stage</label>
                  <select value={formData.stage} onChange={(e) => setFormData({ ...formData, stage: e.target.value as any })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2">
                    {STAGES.map((s) => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-md text-zinc-700">Estimated Value</label>
                  <input type="number" min={0} value={formData.estimatedValue} onChange={(e) => setFormData({ ...formData, estimatedValue: Number(e.target.value) || 0 })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-md text-zinc-700">Currency</label>
                  <select value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2">
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
                <div className="space-y-1.5 col-span-2">
                  <label className="block text-xs font-md text-zinc-700">Notes</label>
                  <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={2} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2" />
                </div>
                {formData.stage === 'LOST' && (
                  <div className="space-y-1.5 col-span-2">
                    <label className="block text-xs font-md text-zinc-700">Lost Reason</label>
                    <input value={formData.lostReason} onChange={(e) => setFormData({ ...formData, lostReason: e.target.value })} className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2" />
                  </div>
                )}
              </div>
              <div className="pt-3 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, sub }: { label: string; value: number | string; icon: React.ReactNode; sub: string }) {
  return (
    <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg">
      <CardContent className="p-3">
        <div className="flex justify-between items-center mb-2">
          <p className="text-[10px] font-md text-zinc-500 uppercase tracking-wider">{label}</p>
          {icon}
        </div>
        <h3 className="text-xl font-md tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">{value}</h3>
        <p className="text-[10px] text-zinc-400 mt-1.5">{sub}</p>
      </CardContent>
    </Card>
  );
}
