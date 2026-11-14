'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import toast from 'react-hot-toast';
import {
  FileText, ChevronDown, Calendar as CalendarIcon,
  Bell, Check, RefreshCcw, BellRing, ExternalLink, Loader2
} from 'lucide-react';
import { useMarkAllNotificationsRead, useMarkNotificationRead, useMyNotifications } from '@/hooks/useMyNotifications';
import { MyNotification, NotificationFilters } from '@/services/notificationFeedService';

type TabId = 'all' | 'unread' | 'important';

const EMPTY_FILTERS: NotificationFilters = {};

const iconFor = (n: MyNotification) => {
  if (n.priority === 'High') return { icon: <BellRing size={18} />, color: 'text-orange-500 bg-orange-50' };
  if (n.isDirect) return { icon: <Bell size={18} />, color: 'text-blue-600 bg-blue-50' };
  return { icon: <FileText size={18} />, color: 'text-purple-600 bg-purple-50' };
};

const groupLabel = (d: moment.Moment) => {
  if (d.isSame(moment(), 'day')) return `Today - ${d.format('DD MMM YYYY')}`;
  if (d.isSame(moment().subtract(1, 'day'), 'day')) return `Yesterday - ${d.format('DD MMM YYYY')}`;
  return d.format('DD MMM YYYY');
};

const timeLabel = (d: moment.Moment) => {
  if (moment().diff(d, 'hours') < 12) return d.fromNow();
  if (d.isSame(moment().subtract(1, 'day'), 'day')) return `Yesterday, ${d.format('h:mm A')}`;
  return d.format('DD MMM YYYY, h:mm A');
};

const selectCls = 'w-full appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-2 pr-6 text-[11px] font-semibold text-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500';

export default function NotificationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('all');
  // Sidebar filters are edited in `draft` and take effect on "Apply Filters".
  const [draft, setDraft] = useState<NotificationFilters>(EMPTY_FILTERS);
  const [applied, setApplied] = useState<NotificationFilters>(EMPTY_FILTERS);

  // The tab narrows on top of the sidebar filters.
  const filters = useMemo<NotificationFilters>(() => ({
    ...applied,
    ...(activeTab === 'unread' ? { status: 'unread' as const } : {}),
    ...(activeTab === 'important' ? { priority: 'High' as const } : {}),
  }), [applied, activeTab]);

  const { data, isLoading, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useMyNotifications(filters);
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  const summary = data?.pages[0]?.summary;
  const groups = useMemo(() => {
    const out: { group: string; items: MyNotification[] }[] = [];
    for (const n of data?.pages.flatMap((p) => p.items) ?? []) {
      const label = groupLabel(moment(n.createdAt));
      if (out[out.length - 1]?.group !== label) out.push({ group: label, items: [] });
      out[out.length - 1].items.push(n);
    }
    return out;
  }, [data]);

  const TABS: { id: TabId; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: summary?.total ?? 0 },
    { id: 'unread', label: 'Unread', count: summary?.unread ?? 0 },
    { id: 'important', label: 'Important', count: summary?.important ?? 0 },
  ];

  const open = (n: MyNotification) => {
    if (!n.isRead) markRead.mutate(n._id);
    if (n.link) router.push(n.link);
  };

  const markAllRead = async () => {
    try {
      const res: any = await markAll.mutateAsync();
      toast.success(res?.updated ? `Marked ${res.updated} as read` : 'Nothing unread');
    } catch {
      toast.error('Could not mark notifications as read');
    }
  };

  const hasFilters = Object.keys(applied).length > 0;

  return (
    <div className="flex h-[calc(100vh-3rem)] w-full overflow-hidden bg-[#fafbfd]">

      {/* Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.6);
        }
      `}</style>

      {/* LEFT COLUMN - MAIN LIST */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="mx-auto max-w-4xl p-4 lg:p-5 flex flex-col gap-4">

          {/* Header */}
          <div>
            <h1 className="text-[22px] font-bold text-slate-900">All Notifications</h1>
            <p className="text-[13px] text-slate-500 mt-1">Stay updated with all important alerts and activities.</p>
          </div>

          {/* Tabs & Actions */}
          <div className="flex items-center justify-between border-b border-slate-200">
            <div className="flex gap-6">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#2563eb] text-[#2563eb]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span className="text-[14px] font-bold">{tab.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                    activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 pb-3">
              <button onClick={markAllRead} disabled={markAll.isPending || !summary?.unread} className="text-[13px] font-bold text-blue-600 hover:underline disabled:opacity-40 disabled:no-underline">
                Mark all as read
              </button>
              <button onClick={() => refetch()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-[13px] font-semibold text-slate-700 hover:bg-slate-50 shadow-sm">
                <RefreshCcw size={14} className={`text-slate-400 ${isFetching ? 'animate-spin' : ''}`} />
                Most Recent
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex flex-col gap-4">
            {isLoading && (
              <div className="flex justify-center py-8 text-slate-400"><Loader2 size={18} className="animate-spin" /></div>
            )}
            {!isLoading && groups.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white py-8 text-center text-[13px] text-slate-500">
                {activeTab === 'all' && !hasFilters ? 'No notifications yet.' : 'No notifications match these filters.'}
              </div>
            )}
            {groups.map((group) => (
              <div key={group.group} className="flex flex-col gap-2.5">
                <h3 className="text-[13px] font-bold text-slate-900">{group.group}</h3>

                <div className="flex flex-col rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                  {group.items.map((notif, nIdx) => {
                    const { icon, color } = iconFor(notif);
                    return (
                      <div
                        key={notif._id}
                        onClick={() => open(notif)}
                        className={`flex items-start gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                          nIdx !== group.items.length - 1 ? 'border-b border-slate-100' : ''
                        }`}
                      >
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${color} scale-90`}>
                          {icon}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-[13px] font-bold text-slate-900 leading-tight">{notif.title}</h4>
                          <p className="text-[12px] text-slate-500 mt-0.5">{notif.message}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 pt-0.5">
                          <span className="text-[10px] font-semibold text-slate-400">{timeLabel(moment(notif.createdAt))}</span>
                          <div className={`h-2 w-2 rounded-full ${!notif.isRead ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="flex justify-center mt-2 pb-8">
            {hasNextPage && (
              <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-bold text-blue-600 hover:bg-slate-50 shadow-sm transition-colors">
                Load more
                {isFetchingNextPage ? <Loader2 size={16} className="animate-spin" /> : <ChevronDown size={16} />}
              </button>
            )}
          </div>

        </div>
      </div>

      {/* RIGHT COLUMN - SIDEBAR */}
      <div className="hidden xl:flex w-[320px] shrink-0 flex-col overflow-y-auto custom-scrollbar p-4 pl-0 gap-2">

        {/* Filter Notifications */}
        <div className="flex flex-col rounded-[16px] border border-slate-100 bg-white p-3 shadow-sm">
          <h3 className="text-[13px] font-bold text-slate-900 mb-2">Filter Notifications</h3>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-900">Type</label>
              <div className="relative">
                <select value={draft.kind || ''} onChange={(e) => setDraft({ ...draft, kind: (e.target.value || undefined) as NotificationFilters['kind'] })} className={selectCls}>
                  <option value="">All Types</option>
                  <option value="announcement">Announcements</option>
                  <option value="direct">Sent to me</option>
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-900">Priority</label>
              <div className="relative">
                <select value={draft.priority || ''} onChange={(e) => setDraft({ ...draft, priority: (e.target.value || undefined) as NotificationFilters['priority'] })} className={selectCls}>
                  <option value="">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Normal">Normal</option>
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-900">Since</label>
              <input
                type="date"
                value={draft.from || ''}
                max={moment().format('YYYY-MM-DD')}
                onChange={(e) => setDraft({ ...draft, from: e.target.value || undefined })}
                className="w-full rounded-lg border border-slate-200 bg-white py-1.5 px-2 text-[11px] font-semibold text-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-900">Status</label>
              <div className="relative">
                <select value={draft.status || ''} onChange={(e) => setDraft({ ...draft, status: (e.target.value || undefined) as NotificationFilters['status'] })} className={selectCls}>
                  <option value="">All Status</option>
                  <option value="read">Read</option>
                  <option value="unread">Unread</option>
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 mt-1">
              <button onClick={() => setApplied(Object.fromEntries(Object.entries(draft).filter(([, v]) => v)))} className="w-full rounded-lg bg-[#2563eb] py-1.5 text-[11px] font-bold text-white hover:bg-blue-700 transition-colors shadow-sm">
                Apply Filters
              </button>
              <button onClick={() => { setDraft(EMPTY_FILTERS); setApplied(EMPTY_FILTERS); }} className="w-full rounded-lg bg-transparent py-1 text-[11px] font-bold text-[#2563eb] hover:bg-blue-50 transition-colors">
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Notification Summary */}
        <div className="flex flex-col rounded-[16px] border border-slate-100 bg-white p-3 shadow-sm">
          <h3 className="text-[13px] font-bold text-slate-900 mb-2">Notification Summary</h3>

          <div className="flex flex-col gap-2">
            {[
              { label: 'Total Notifications', value: summary?.total, icon: <Bell size={12} strokeWidth={2} />, cls: 'bg-[#eff6ff] text-[#3b82f6]' },
              { label: 'Unread', value: summary?.unread, icon: <Check size={12} strokeWidth={2} />, cls: 'bg-[#ecfdf5] text-[#10b981]' },
              { label: 'Important', value: summary?.important, icon: <BellRing size={12} strokeWidth={2} />, cls: 'bg-[#fff7ed] text-[#f97316]' },
              { label: 'This Week', value: summary?.thisWeek, icon: <CalendarIcon size={12} strokeWidth={2} />, cls: 'bg-[#faf5ff] text-[#a855f7]' },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-[8px] ${row.cls}`}>
                    {row.icon}
                  </div>
                  <span className="text-[11px] font-semibold text-[#334155]">{row.label}</span>
                </div>
                <span className="text-[12px] font-bold text-slate-900">{row.value ?? '—'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Need Help Card */}
        <div className="relative overflow-hidden flex flex-col rounded-2xl border border-slate-100 bg-[#f8fafc] p-4 shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50"></div>
          <div className="relative z-10 pr-12">
            <h3 className="text-[13px] font-bold text-slate-900 mb-1">Need help with notifications?</h3>
            <p className="text-[11px] text-slate-500 leading-snug mb-3">
              Something missing or wrong? Raise a request with the helpdesk.
            </p>
            <Link href="/dashboard/helpdesk" className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-blue-600 hover:bg-slate-50 transition-colors shadow-sm w-max">
              Go to Help Center
              <ExternalLink size={12} />
            </Link>
          </div>

          {/* Mock Graphic */}
          <div className="absolute -right-4 bottom-1 h-16 w-20 opacity-80">
            <div className="relative h-full w-full">
              <div className="absolute right-4 bottom-2 h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg transform -rotate-12">
                <Bell size={24} className="text-white fill-white" />
              </div>
              <div className="absolute right-12 top-2 h-3 w-5 rounded-full bg-indigo-200 border border-white shadow-sm"></div>
              <div className="absolute right-2 top-4 h-2.5 w-2.5 rounded-full bg-purple-300"></div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
