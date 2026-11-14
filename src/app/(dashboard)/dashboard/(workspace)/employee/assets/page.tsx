"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import moment from 'moment';
import { Search, ChevronDown, Eye as EyeIcon, Wrench, ShoppingBag, CheckCircle, Clock, ShieldCheck, LifeBuoy, CheckCircle2, AlertCircle, Package, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AssetIssueDialog } from '@/components/assets/AssetIssueDialog';
import { useMyAssets } from '@/hooks/useMyAssets';
import { MyAssetAllocation } from '@/services/myAssetService';
import { inr } from '@/services/payslipService';

import laptop from '../../../../../../../public/assets/laptop.jpg';
import iphone from '../../../../../../../public/assets/iphone.jpg';
import headset from '../../../../../../../public/assets/headset.jpg';
import bag from '../../../../../../../public/assets/bag.jpg';
import cards from '../../../../../../../public/assets/cards.jpg';
import charger from '../../../../../../../public/assets/charger.jpg';
import wallet from '../../../../../../../public/assets/wallet 2.png';

// Picture for an asset by its type/name; anything unrecognised gets a plain icon.
const IMAGES: { match: RegExp; img: StaticImageData }[] = [
  { match: /laptop|notebook|macbook/i, img: laptop },
  { match: /mobile|phone|iphone/i, img: iphone },
  { match: /headset|headphone/i, img: headset },
  { match: /bag|backpack/i, img: bag },
  { match: /card|access/i, img: cards },
  { match: /charger|adapter/i, img: charger },
];
const imageFor = (a: { type: string; name: string }) => IMAGES.find((x) => x.match.test(`${a.type} ${a.name}`))?.img;

const CATEGORY_COLORS = ['#3b82f6', '#a855f7', '#fb923c', '#2dd4bf', '#f43f5e', '#84cc16'];
const CATEGORY_CHIPS = [
  'bg-blue-50 text-blue-600 border-blue-100',
  'bg-purple-50 text-purple-600 border-purple-100',
  'bg-orange-50 text-orange-600 border-orange-100',
  'bg-teal-50 text-teal-600 border-teal-100',
  'bg-rose-50 text-rose-600 border-rose-100',
  'bg-lime-50 text-lime-600 border-lime-100',
];

/** What the employee sees: returned, under maintenance (still with them), or active. */
const statusOf = (a: MyAssetAllocation) => (a.status === 'Returned' ? 'Returned' : a.assetId?.status === 'Maintenance' ? 'Maintenance' : 'Active');

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    case 'Maintenance': return 'bg-orange-50 text-orange-600 border-orange-100';
    case 'Returned': return 'bg-zinc-100 text-zinc-500 border-zinc-200';
    default: return 'bg-zinc-50 text-zinc-600 border-zinc-100';
  }
};

type Tab = 'all' | 'returned';

export default function AssetsPage() {
  const { data, isLoading } = useMyAssets();
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<Tab>('all');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [viewing, setViewing] = useState<MyAssetAllocation | null>(null);
  const [issueFor, setIssueFor] = useState<string | null>(null); // asset id, or '' for "any"

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const allocations = useMemo(() => (data?.allocations ?? []).filter((a) => a.assetId), [data]);
  const active = allocations.filter((a) => a.status === 'Active');
  const issues = data?.openIssues ?? [];

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    active.forEach((a) => counts.set(a.assetId!.type, (counts.get(a.assetId!.type) || 0) + 1));
    return [...counts.entries()].sort((x, y) => y[1] - x[1]);
  }, [active]);
  const chipFor = (type: string) => {
    const i = categories.findIndex(([c]) => c === type);
    return CATEGORY_CHIPS[(i === -1 ? categories.length : i) % CATEGORY_CHIPS.length];
  };

  const rows = allocations.filter((a) => {
    const q = search.trim().toLowerCase();
    return (tab === 'all' || a.status === 'Returned') &&
      (!status || statusOf(a) === status) &&
      (!category || a.assetId!.type === category) &&
      (!q || `${a.assetId!.name} ${a.assetId!.serialNumber} ${a.assetId!.type}`.toLowerCase().includes(q));
  });

  const valued = active.filter((a) => typeof a.assetId!.purchaseValue === 'number');
  const totalValue = valued.reduce((sum, a) => sum + (a.assetId!.purchaseValue || 0), 0);
  const maintenance = active.filter((a) => statusOf(a) === 'Maintenance');

  // Donut segments: each category's share of active assets, with a 1-unit gap between.
  const radius = 15.915;
  const circumference = 100;
  const segments = useMemo(() => {
    const total = active.length || 1;
    const gap = categories.length > 1 ? 1 : 0;
    let offset = 0;
    return categories.map(([, count], i) => {
      const share = (count / total) * 100;
      const seg = { color: CATEGORY_COLORS[i % CATEGORY_COLORS.length], percent: Math.max(share - gap, 0.5), offset: -offset };
      offset += share;
      return seg;
    });
  }, [categories, active.length]);

  const stats = [
    { label: 'Total Assets', value: allocations.length, detail: 'Ever assigned to you', icon: ShoppingBag, accent: 'bg-blue-50 text-[#1d4ed8]' },
    { label: 'Active Assets', value: active.length - maintenance.length, detail: 'Currently in Use', icon: CheckCircle, accent: 'bg-emerald-50 text-emerald-600' },
    { label: 'Under Maintenance', value: maintenance.length, detail: 'With IT for repair', icon: Wrench, accent: 'bg-orange-50 text-orange-600' },
    { label: 'Returned Assets', value: allocations.length - active.length, detail: 'Already Returned', icon: Clock, accent: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans">
      <div className="mx-auto max-w-[1400px] p-0">

        {/* Breadcrumb & Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 mb-2">
              <span>Dashboard</span>
              <span>›</span>
              <span>My Profile</span>
              <span>›</span>
              <span className="font-semibold text-zinc-800">Assets</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1a1c21]">My Assets</h1>
            <p className="text-[10px] text-zinc-500 mt-1">View and manage all the assets assigned to you.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIssueFor('')} className="flex items-center gap-2 rounded-md bg-[#1d4ed8] px-4 py-2 text-[10px] font-semibold text-white shadow-sm hover:bg-blue-700">
              <Wrench size={12} /> Report an Issue
            </button>
          </div>
        </div>

        {/* Main Content Layout: 3 Columns Left, 1 Column Right */}
        <div className="grid grid-cols-1 gap-2 xl:grid-cols-4">

          {/* Left Main Content (Stat Cards + Table) */}
          <div className="xl:col-span-3 flex flex-col gap-2">

            {/* Top Stat Cards (4 cards) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm flex items-center gap-3">
                  <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${s.accent}`}>
                    <s.icon size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-zinc-500">{s.label}</p>
                    <p className="text-lg font-bold text-zinc-900 leading-tight">{isLoading ? '…' : s.value}</p>
                    <p className="text-[9px] text-zinc-400">{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Table Area */}
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm flex-1 flex flex-col">

              {/* Table Header / Filters */}
              <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                <div className="flex gap-4 text-[10px] font-bold">
                  {([['all', 'All Assets'], ['returned', 'Returned Assets']] as const).map(([id, label]) => (
                    <button
                      key={id}
                      onClick={() => setTab(id)}
                      className={tab === id ? 'text-[#1d4ed8] border-b-[2.5px] border-[#1d4ed8] pb-3 -mb-[14px]' : 'text-zinc-500 hover:text-zinc-800 pb-3'}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="appearance-none rounded-md border border-zinc-200 bg-white pl-2 pr-6 py-1.5 text-[10px] font-semibold text-zinc-700 outline-none hover:bg-zinc-50">
                      <option value="">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Maintenance">Under Maintenance</option>
                      <option value="Returned">Returned</option>
                    </select>
                    <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="appearance-none rounded-md border border-zinc-200 bg-white pl-2 pr-6 py-1.5 text-[10px] font-semibold text-zinc-700 outline-none hover:bg-zinc-50">
                      <option value="">All Categories</option>
                      {[...new Set(allocations.map((a) => a.assetId!.type))].sort().map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search assets..."
                      className="w-32 rounded-md border border-zinc-200 bg-white pl-6 pr-2 py-1.5 text-[10px] text-zinc-700 outline-none placeholder:text-zinc-400 focus:border-[#1d4ed8]"
                    />
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-[10px]">
                  <thead>
                    <tr className="border-b border-zinc-100 font-semibold text-zinc-900 whitespace-nowrap">
                      <th className="pb-3 pl-2">Asset Details</th>
                      <th className="pb-3">Asset ID</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Assigned On</th>
                      <th className="pb-3 text-center">Status</th>
                      <th className="pb-3">Condition</th>
                      <th className="pb-3">Value (₹)</th>
                      <th className="pb-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {isLoading && (
                      <tr><td colSpan={8} className="py-6 text-center text-zinc-400"><Loader2 size={14} className="mx-auto animate-spin" /></td></tr>
                    )}
                    {!isLoading && rows.length === 0 && (
                      <tr><td colSpan={8} className="py-6 text-center text-zinc-500">
                        {allocations.length === 0 ? 'No assets have been assigned to you yet.' : 'No assets match these filters.'}
                      </td></tr>
                    )}
                    {rows.map((a) => {
                      const asset = a.assetId!;
                      const img = imageFor(asset);
                      const st = statusOf(a);
                      return (
                        <tr key={a._id} className="hover:bg-zinc-50/50 transition-colors">
                          <td className="py-2.5 pl-2">
                            <div className="flex items-center gap-3">
                              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md overflow-hidden bg-white border border-zinc-200">
                                {img ? <Image src={img} alt={asset.name} width={32} height={32} className="w-full h-full object-contain p-1" /> : <Package size={14} className="text-zinc-400" />}
                              </div>
                              <div>
                                <p className="font-semibold text-zinc-900">{asset.name}</p>
                                <p className="text-[9px] text-zinc-500 mt-0.5">{asset.type}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 text-zinc-600 font-medium">{asset.serialNumber}</td>
                          <td className="py-2.5">
                            <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold border ${chipFor(asset.type)}`}>
                              {asset.type}
                            </span>
                          </td>
                          <td className="py-2.5 text-zinc-600 font-medium">{moment(a.allocatedDate).format('DD MMM YYYY')}</td>
                          <td className="py-2.5 text-center">
                            <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold border ${getStatusColor(st)}`}>
                              {st === 'Maintenance' ? 'Under Maintenance' : st}
                            </span>
                          </td>
                          <td className="py-2.5 text-zinc-600 font-medium">{a.condition || '—'}</td>
                          <td className="py-2.5 text-zinc-900 font-semibold">{typeof asset.purchaseValue === 'number' ? asset.purchaseValue.toLocaleString('en-IN') : '—'}</td>
                          <td className="py-2.5">
                            <div className="flex items-center justify-center gap-1.5">
                              <button onClick={() => setViewing(a)} title="View details" className="rounded border border-blue-100 p-1 text-[#1d4ed8] hover:bg-blue-50 transition-colors">
                                <EyeIcon size={10} />
                              </button>
                              {a.status === 'Active' && (
                                <button onClick={() => setIssueFor(asset._id)} title="Report an issue" className="rounded border border-blue-100 p-1 text-[#1d4ed8] hover:bg-blue-50 transition-colors">
                                  <Wrench size={10} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-[10px] text-zinc-500 font-medium border-t border-zinc-100 pt-3">
                {rows.length === 0 ? 'No assets' : `Showing ${rows.length} of ${allocations.length} assets`}
              </div>
            </div>

            {/* Need Help Banner */}
            <div className="rounded-xl border border-violet-200 bg-[#f8f7ff] p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-violet-100 text-violet-600">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h3 className="text-[11px] font-bold text-zinc-900">Need Help?</h3>
                  <p className="text-[10px] text-zinc-500 mt-0.5">For any asset related queries or issues, please contact the IT Department.</p>
                </div>
              </div>
              <button onClick={() => setIssueFor('')} className="flex items-center gap-2 rounded-md border border-[#1d4ed8] bg-white px-3 py-1.5 text-[10px] font-semibold text-[#1d4ed8] hover:bg-blue-50 transition-colors">
                <LifeBuoy size={12} /> Contact IT Department
              </button>
            </div>

          </div>

          {/* Right Sidebar Stats (1 Column) */}
          <div className="xl:col-span-1 flex flex-col gap-2">

            {/* Merged Total Value & Breakdown Card */}
            <div className="rounded-xl border border-zinc-200 bg-white shadow-sm flex flex-col">

              {/* Top: Total Value */}
              <div className="flex items-center justify-between border-b border-zinc-100 p-4">
                <div>
                  <p className="text-[11px] font-bold text-zinc-900">Total Value (₹)</p>
                  <p className="text-2xl font-bold text-zinc-900 mt-1.5">{valued.length ? inr(totalValue) : '—'}</p>
                  <p className="text-[10px] font-medium text-zinc-500 mt-1.5">
                    {valued.length < active.length ? `${valued.length} of ${active.length} active assets have a value` : 'Of Active Assets'}
                  </p>
                </div>
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#f0f4ff]">
                  <Image src={wallet} alt="wallet" className='w-full h-full' />
                </div>
              </div>

              {/* Bottom: Breakdown by Category */}
              <div className="p-4 pt-4">
                <h3 className="text-[11px] font-bold text-zinc-900 mb-4">Breakdown by Category</h3>
                {categories.length === 0 ? (
                  <p className="text-[10px] text-zinc-500">No active assets.</p>
                ) : (
                  <div className="flex items-center gap-4">
                    {/* Animated SVG Donut Chart */}
                    <div className="relative h-20 w-20 shrink-0">
                      <svg viewBox="0 0 42 42" className="w-full h-full -rotate-90">
                        {segments.map((seg, i) => (
                          <circle
                            key={i}
                            cx="21"
                            cy="21"
                            r={radius}
                            fill="transparent"
                            stroke={seg.color}
                            strokeWidth="6"
                            strokeDasharray={`${mounted ? seg.percent : 0} ${circumference}`}
                            strokeDashoffset={seg.offset}
                            className="transition-all duration-1000 ease-out"
                          />
                        ))}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[14px] font-bold text-zinc-900 leading-none">{active.length}</span>
                        <span className="text-[9px] text-zinc-500 mt-0.5">Active</span>
                      </div>
                    </div>
                    {/* Legend */}
                    <div className="flex-1 space-y-2 text-[9px] font-bold">
                      {categories.map(([name, count], i) => (
                        <div key={name} className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-zinc-700">
                            <div className="h-2 w-2 rounded-[2px]" style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}></div> {name}
                          </div>
                          <div className="text-zinc-900">{count} ({Math.round((count / active.length) * 100)}%)</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Assets Needing Attention */}
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <h3 className="text-[11px] font-bold text-[#1e293b] mb-4">Assets Needing Attention</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-gradient-to-br from-orange-100 to-orange-50/50 text-orange-500 border border-orange-100/50">
                    <Wrench size={16} />
                  </div>
                  <div className="pt-0.5">
                    <p className="text-[11px] font-bold text-[#1e293b]">Under Maintenance</p>
                    <p className="text-[10px] font-medium text-slate-500 mt-1">
                      {maintenance.length ? maintenance.map((a) => a.assetId!.name).join(', ') : 'No assets under maintenance'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-gradient-to-br from-rose-100 to-rose-50/50 text-rose-600 border border-rose-100/50">
                    <AlertCircle size={16} />
                  </div>
                  <div className="pt-0.5">
                    <p className="text-[11px] font-bold text-[#1e293b]">Open Issues</p>
                    <p className="text-[15px] font-bold text-[#1e293b] leading-tight my-0.5">{issues.length}</p>
                    <p className="text-[10px] font-medium text-slate-500">
                      {issues.length ? <Link href="/dashboard/helpdesk" className="text-[#1d4ed8] hover:underline">Track in Helpdesk</Link> : 'No asset issues reported'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Guidelines */}
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm flex-1 flex flex-col">
              <h3 className="text-[11px] font-bold text-zinc-900 mb-3">Guidelines</h3>
              <ul className="space-y-2.5 text-[10px] text-zinc-700 flex-1">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={12} className="text-[#1d4ed8] shrink-0 mt-0.5" /> Take care of the assets assigned to you.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={12} className="text-[#1d4ed8] shrink-0 mt-0.5" /> Do not share company assets with others.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={12} className="text-[#1d4ed8] shrink-0 mt-0.5" /> Report any damage or issue immediately.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={12} className="text-[#1d4ed8] shrink-0 mt-0.5" /> Return assets on or before your last working day.
                </li>
              </ul>
              <Link href="/dashboard/policies" className="text-[10px] font-bold text-[#1d4ed8] hover:underline mt-4 text-left">
                View Asset Policy →
              </Link>
            </div>

          </div>
        </div>
      </div>

      <AssetIssueDialog
        assets={active}
        initialAssetId={issueFor || undefined}
        open={issueFor !== null}
        onClose={() => setIssueFor(null)}
      />
      <AssetDetailDialog allocation={viewing} issues={issues.filter((i) => i.assetId === viewing?.assetId?._id)} onClose={() => setViewing(null)} />
    </div>
  );
}

function AssetDetailDialog({ allocation, issues, onClose }: { allocation: MyAssetAllocation | null; issues: { _id: string; subject: string; ticketNumber?: string; status: string }[]; onClose: () => void }) {
  const asset = allocation?.assetId;
  return (
    <Dialog open={!!allocation} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[14px]">{asset?.name}</DialogTitle>
        </DialogHeader>
        {allocation && asset && (
          <div className="space-y-2 py-1 text-[12px] text-zinc-600">
            <div className="flex justify-between"><span>Type</span><span className="font-medium text-zinc-800">{asset.type}</span></div>
            <div className="flex justify-between"><span>Serial / IMEI</span><span className="font-medium text-zinc-800">{asset.serialNumber}</span></div>
            <div className="flex justify-between"><span>Assigned on</span><span>{moment(allocation.allocatedDate).format('DD MMM YYYY')}</span></div>
            {allocation.returnDate && <div className="flex justify-between"><span>Returned on</span><span>{moment(allocation.returnDate).format('DD MMM YYYY')}</span></div>}
            <div className="flex justify-between"><span>Condition</span><span>{allocation.condition || '—'}</span></div>
            {asset.purchaseDate && <div className="flex justify-between"><span>Purchased</span><span>{moment(asset.purchaseDate).format('DD MMM YYYY')}</span></div>}
            <div className="flex justify-between"><span>Value</span><span>{typeof asset.purchaseValue === 'number' ? inr(asset.purchaseValue) : '—'}</span></div>
            {issues.length > 0 && (
              <div className="rounded-md bg-orange-50 p-2 text-orange-800">
                {issues.map((i) => <p key={i._id}>{i.ticketNumber ? `#${i.ticketNumber} · ` : ''}{i.subject} — {i.status.replace('_', ' ')}</p>)}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
