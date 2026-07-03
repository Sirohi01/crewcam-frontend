'use client';
import React, { Suspense, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable, Column } from '@/components/shared/DataTable';
import { Plus, Upload, MessageCircle, CalendarClock, PhoneCall, Mail } from 'lucide-react';
import api from '@/lib/axios';
import { STAGE_LABELS, STAGE_COLOR } from '@/lib/leadStages';
import LeadScoreBadge from '@/components/leads/LeadScoreBadge';
import QuickActionModal, { QuickActionType } from '@/components/leads/QuickActionModal';

const STATUS_OPTIONS = [
  { value: '', label: 'All Follow-Ups' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'today', label: 'Due Today' },
  { value: 'tomorrow', label: 'Due Tomorrow' },
  { value: 'week', label: 'Due This Week' },
  { value: 'month', label: 'Due This Month' },
];

const REMIND_OPTIONS = [
  { value: 15, label: '15 Minutes Before' },
  { value: 30, label: '30 Minutes Before' },
  { value: 60, label: '1 Hour Before' },
  { value: 120, label: '2 Hours Before' },
  { value: 1440, label: '1 Day Before' },
];

const DONUT_SEGMENTS = [
  { key: 'dueToday', label: 'Due Today', color: '#3b82f6' },
  { key: 'dueTomorrow', label: 'Due Tomorrow', color: '#f59e0b' },
  { key: 'dueThisWeek', label: 'Due This Week', color: '#6366f1' },
  { key: 'overdue', label: 'Overdue', color: '#ef4444' },
];

export default function FollowUpsPage() {
  return (
    <Suspense fallback={null}>
      <FollowUpsPageInner />
    </Suspense>
  );
}

function FollowUpsPageInner() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [search, setSearch] = useState('');
  const [ownerFilter, setOwnerFilter] = useState<'me' | ''>('me');
  const [actionModal, setActionModal] = useState<{ type: QuickActionType; leadId: string } | null>(null);

  const filterParams = {
    followUpStatus: statusFilter || 'pending',
    source: sourceFilter || undefined,
    search: search || undefined,
    owner: ownerFilter || undefined,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['super-admin', 'leads', 'follow-ups', page, pageSize, statusFilter, sourceFilter, search, ownerFilter],
    queryFn: async () => (await api.get('/super-admin/leads', { params: { page, limit: pageSize, ...filterParams } })).data,
  });

  const { data: stats } = useQuery({
    queryKey: ['super-admin', 'leads', 'follow-ups', 'stats', ownerFilter],
    queryFn: async () => (await api.get('/super-admin/leads/follow-ups/stats', { params: { owner: ownerFilter || undefined } })).data,
  });

  const { data: sources } = useQuery({
    queryKey: ['super-admin', 'leads', 'master-data', 'SOURCE'],
    queryFn: async () => (await api.get('/super-admin/leads/master-data', { params: { type: 'SOURCE' } })).data,
  });

  const { data: reminderSettings } = useQuery({
    queryKey: ['super-admin', 'leads', 'reminder-settings'],
    queryFn: async () => (await api.get('/super-admin/leads/reminder-settings')).data,
  });

  const rows = data?.data || [];
  const total = data?.pagination?.total ?? 0;

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['super-admin', 'leads', 'follow-ups'] });
  };

  const updateReminderSettings = async (patch: Record<string, any>) => {
    await api.put('/super-admin/leads/reminder-settings', { ...reminderSettings, ...patch });
    queryClient.invalidateQueries({ queryKey: ['super-admin', 'leads', 'reminder-settings'] });
  };

  const donutTotal = DONUT_SEGMENTS.reduce((s, seg) => s + (stats?.[seg.key] || 0), 0);
  const donutData = DONUT_SEGMENTS.map((seg) => ({ ...seg, value: stats?.[seg.key] || 0 }));

  const columns: Column<any>[] = [
    {
      key: 'companyName',
      label: 'COMPANY NAME',
      sortable: true,
      render: (v, row) => <Link href={`/super-admin/leads/${row._id}`} className="font-medium text-indigo-600 hover:text-indigo-700">{v}</Link>,
    },
    { key: 'source', label: 'SOURCE', width: '100px' },
    { key: 'leadScore', label: 'LEAD SCORE', width: '110px', render: (v) => <LeadScoreBadge score={v || 0} /> },
    {
      key: 'stage',
      label: 'STATUS',
      width: '110px',
      render: (v) => <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${STAGE_COLOR[v]}`}>{STAGE_LABELS[v] || v}</span>,
    },
    {
      key: 'followUpDate',
      label: 'FOLLOW-UP DATE',
      width: '160px',
      render: (v) => {
        if (!v) return '—';
        const overdue = new Date(v).getTime() < Date.now();
        return <span className={overdue ? 'text-rose-600 font-medium' : 'text-zinc-600'}>{formatDistanceToNow(new Date(v), { addSuffix: true })}</span>;
      },
    },
    {
      key: 'updatedAt',
      label: 'LAST UPDATED',
      width: '130px',
      render: (v) => <span className="text-zinc-500">{v ? formatDistanceToNow(new Date(v), { addSuffix: true }) : '—'}</span>,
    },
    {
      key: 'actions',
      label: '',
      width: '120px',
      sortable: false,
      filterable: false,
      render: (_v, row) => (
        <div className="flex justify-end gap-1.5">
          <button title="Schedule Follow-Up" onClick={() => setActionModal({ type: 'schedule', leadId: row._id })} className="text-zinc-400 hover:text-indigo-600 p-1"><CalendarClock size={14} /></button>
          <button title="Log Call" onClick={() => setActionModal({ type: 'call', leadId: row._id })} className="text-zinc-400 hover:text-indigo-600 p-1"><PhoneCall size={14} /></button>
          <button title="Send Email" onClick={() => setActionModal({ type: 'email', leadId: row._id })} className="text-zinc-400 hover:text-indigo-600 p-1"><Mail size={14} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            My Follow-Ups
            {stats?.total != null && <span className="text-xs font-md bg-zinc-100 text-zinc-600 rounded-full px-2 py-0.5">{stats.total}</span>}
          </h1>
          <p className="text-xs text-zinc-500">Leads with pending follow-ups.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/super-admin/leads/new"><Button className="h-8 text-xs bg-indigo-600 text-white hover:bg-indigo-700"><Plus size={14} className="mr-1" /> Add Lead</Button></Link>
          <Link href="/super-admin/leads/import"><Button variant="outline" className="h-8 text-xs"><Upload size={14} className="mr-1" /> Import Leads</Button></Link>
          <Button variant="outline" disabled title="Coming soon — requires a WhatsApp Business API integration" className="h-8 text-xs opacity-60 cursor-not-allowed">
            <MessageCircle size={14} className="mr-1" /> Send Bulk WhatsApp
          </Button>
        </div>
      </div>

      <div className="flex gap-3 items-start">
        <div className="flex-1 min-w-0 space-y-3">
          <div className="grid grid-cols-5 gap-3">
            <StatCard label="Total Follow-Ups" value={stats?.total ?? '—'} sub="Pending" />
            <StatCard label="Due Today" value={stats?.dueToday ?? '—'} sub="Follow-ups" />
            <StatCard label="Overdue" value={stats?.overdue ?? '—'} sub="Follow-ups" tone="rose" />
            <StatCard label="Due This Week" value={stats?.dueThisWeek ?? '—'} sub="Follow-ups" />
            <StatCard label="Due This Month" value={stats?.dueThisMonth ?? '—'} sub="Follow-ups" />
          </div>

          <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg">
            <CardContent className="p-3">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search within follow-ups..."
                  className="flex-1 min-w-[200px] h-8 border border-zinc-200 rounded-lg text-xs px-3"
                />
                <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="h-8 border border-zinc-200 rounded-lg text-xs px-2.5 bg-white">
                  {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <select value={sourceFilter} onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }} className="h-8 border border-zinc-200 rounded-lg text-xs px-2.5 bg-white">
                  <option value="">Source</option>
                  {(sources || []).filter((s: any) => s.isActive !== false).map((s: any) => <option key={s._id} value={s.value}>{s.value}</option>)}
                </select>
                <select value={ownerFilter} onChange={(e) => { setOwnerFilter(e.target.value as 'me' | ''); setPage(1); }} className="h-8 border border-zinc-200 rounded-lg text-xs px-2.5 bg-white">
                  <option value="me">Lead Owner: Me</option>
                  <option value="">Lead Owner: Anyone</option>
                </select>
                <Button variant="outline" onClick={() => { setStatusFilter(''); setSourceFilter(''); setSearch(''); setOwnerFilter('me'); setPage(1); }} className="h-8 text-xs">Reset</Button>
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
            emptyMessage="No pending follow-ups."
          />
        </div>

        <aside className="w-[280px] flex-shrink-0 space-y-3">
          <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg">
            <CardContent className="p-3">
              <h3 className="text-xs font-md text-zinc-900 mb-2">Follow-Up Overview</h3>
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0" style={{ width: 80, height: 80 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={donutData} dataKey="value" nameKey="label" innerRadius={26} outerRadius={38} paddingAngle={2} stroke="none">
                        {donutData.map((seg) => <Cell key={seg.key} fill={seg.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                    <strong className="text-base font-bold text-zinc-900 leading-none">{donutTotal}</strong>
                    <span className="text-[8px] text-zinc-500 mt-0.5">Total</span>
                  </div>
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  {donutData.map((seg) => (
                    <div key={seg.key} className="flex items-center gap-1.5 text-[10px] text-zinc-600">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: seg.color }} />
                      <span className="truncate flex-1">{seg.label}</span>
                      <span className="text-zinc-400">{seg.value} ({donutTotal > 0 ? Math.round((seg.value / donutTotal) * 100) : 0}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-md text-zinc-900">Overdue Follow-Ups</h3>
                {(stats?.overdueLeads || []).length > 0 && (
                  <button onClick={() => { setStatusFilter('overdue'); setPage(1); }} className="text-[10px] text-indigo-600 hover:text-indigo-700">View All</button>
                )}
              </div>
              {(stats?.overdueLeads || []).length === 0 && <p className="text-[11px] text-zinc-400">No overdue follow-ups.</p>}
              <div className="space-y-2">
                {(stats?.overdueLeads || []).slice(0, 5).map((f: any) => (
                  <div key={f._id} className="flex items-center justify-between text-[11px]">
                    <div className="min-w-0">
                      <p className="text-zinc-700 truncate">{f.companyName}</p>
                      <p className="text-zinc-400">Due {formatDistanceToNow(new Date(f.followUpDate), { addSuffix: true })}</p>
                    </div>
                    <span className="text-rose-600 font-medium whitespace-nowrap ml-2 text-[10px]">
                      {Math.floor((Date.now() - new Date(f.followUpDate).getTime()) / (24 * 60 * 60 * 1000))}d overdue
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg">
            <CardContent className="p-3">
              <h3 className="text-xs font-md text-zinc-900 mb-2">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setActionModal({ type: 'schedule', leadId: rows[0]?._id || '' })} className="flex flex-col items-center justify-center gap-1 rounded-lg border border-zinc-200 py-2.5 text-[10px] font-medium text-zinc-700 hover:bg-zinc-50">
                  <CalendarClock size={14} /> Schedule Follow-Up
                </button>
                <button onClick={() => setActionModal({ type: 'call', leadId: rows[0]?._id || '' })} className="flex flex-col items-center justify-center gap-1 rounded-lg border border-zinc-200 py-2.5 text-[10px] font-medium text-zinc-700 hover:bg-zinc-50">
                  <PhoneCall size={14} /> Log Call
                </button>
                <button onClick={() => setActionModal({ type: 'email', leadId: rows[0]?._id || '' })} className="flex flex-col items-center justify-center gap-1 rounded-lg border border-zinc-200 py-2.5 text-[10px] font-medium text-zinc-700 hover:bg-zinc-50">
                  <Mail size={14} /> Send Email
                </button>
                <button disabled title="Coming soon" className="flex flex-col items-center justify-center gap-1 rounded-lg border border-zinc-200 py-2.5 text-[10px] font-medium text-zinc-400 opacity-60 cursor-not-allowed">
                  <MessageCircle size={14} /> Send WhatsApp
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg">
            <CardContent className="p-3 space-y-3">
              <div>
                <h3 className="text-xs font-md text-zinc-900">Reminder Settings</h3>
                <p className="text-[10px] text-zinc-400">Saved as a preference — automatic sending isn't built yet.</p>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-700">
                <span>Enable Reminders</span>
                <input type="checkbox" checked={!!reminderSettings?.enabled} onChange={(e) => updateReminderSettings({ enabled: e.target.checked })} />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] text-zinc-500">Remind me</label>
                <select
                  value={reminderSettings?.remindBeforeMinutes ?? 60}
                  onChange={(e) => updateReminderSettings({ remindBeforeMinutes: Number(e.target.value) })}
                  className="w-full border border-zinc-200 rounded-lg text-xs px-2.5 py-1.5"
                >
                  {REMIND_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] text-zinc-500">Send via</label>
                <div className="flex items-center gap-3 text-xs text-zinc-700">
                  <label className="flex items-center gap-1.5">
                    <input type="checkbox" checked={!!reminderSettings?.notifyByWhatsApp} onChange={(e) => updateReminderSettings({ notifyByWhatsApp: e.target.checked })} /> WhatsApp
                  </label>
                  <label className="flex items-center gap-1.5">
                    <input type="checkbox" checked={!!reminderSettings?.notifyByEmail} onChange={(e) => updateReminderSettings({ notifyByEmail: e.target.checked })} /> Email
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {actionModal && (
        <QuickActionModal
          type={actionModal.type}
          leadId={actionModal.leadId}
          leads={rows}
          onClose={() => setActionModal(null)}
          onDone={() => { setActionModal(null); invalidate(); }}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, sub, tone }: { label: string; value: number | string; sub: string; tone?: 'rose' }) {
  return (
    <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg">
      <CardContent className="p-3">
        <p className="text-[10px] font-md text-zinc-500 uppercase tracking-wider mb-1">{label}</p>
        <h3 className={`text-xl font-md tracking-tight leading-none ${tone === 'rose' ? 'text-rose-600' : 'text-zinc-900 dark:text-zinc-50'}`}>{value}</h3>
        <p className="text-[10px] text-zinc-400 mt-1.5">{sub}</p>
      </CardContent>
    </Card>
  );
}

