"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Search, ChevronDown, MoreVertical, Eye as EyeIcon, Pencil,
  Laptop, Smartphone, Headphones, Backpack, CreditCard, BatteryCharging,
  ShoppingBag, CheckCircle, Wrench, Clock, Info, ShieldCheck, LifeBuoy,
  CheckCircle2, Calendar
} from 'lucide-react';

import laptop from '../../../../../../public/assets/laptop.jpg';
import iphone from '../../../../../../public/assets/iphone.jpg';
import headset from '../../../../../../public/assets/headset.jpg';
import bag from '../../../../../../public/assets/bag.jpg';
import cards from '../../../../../../public/assets/cards.jpg';
import charger from '../../../../../../public/assets/charger.jpg';
import wallet from '../../../../../../public/assets/wallet 2.png';

const assetsData = [
  { id: 1, name: 'Dell Latitude 5440', type: 'Laptop', assetId: 'AST-LAP-0001', category: 'IT Equipment', assignedOn: '15 Apr 2024', status: 'Active', condition: 'Good', value: '75,000', img: laptop, iconBg: 'bg-zinc-800 text-white' },
  { id: 2, name: 'iPhone 14', type: 'Mobile Phone', assetId: 'AST-MOB-0002', category: 'IT Equipment', assignedOn: '15 Apr 2024', status: 'Active', condition: 'Good', value: '52,000', img: iphone, iconBg: 'bg-[#1d4ed8] text-white' },
  { id: 3, name: 'Logitech H390 Headset', type: 'Headset', assetId: 'AST-ACC-0003', category: 'Accessories', assignedOn: '15 Apr 2024', status: 'Active', condition: 'Good', value: '4,000', img: headset, iconBg: 'bg-zinc-800 text-white' },
  { id: 4, name: 'SwissGear Backpack', type: 'Bag', assetId: 'AST-BAG-0004', category: 'Office Utility', assignedOn: '15 Apr 2024', status: 'Active', condition: 'Good', value: '3,500', img: bag, iconBg: 'bg-zinc-800 text-white' },
  { id: 5, name: 'Access Card', type: 'Access Card', assetId: 'AST-ACC-0005', category: 'Access', assignedOn: '15 Apr 2024', status: 'Active', condition: 'Good', value: '1,250', img: cards, iconBg: 'bg-zinc-200 text-zinc-600' },
  { id: 6, name: 'Laptop Charger', type: 'Charger', assetId: 'AST-ACC-0006', category: 'Accessories', assignedOn: '15 Apr 2024', status: 'Returned', condition: 'Good', value: '1,000', img: charger, iconBg: 'bg-zinc-100 text-zinc-400' },
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'IT Equipment': return 'bg-blue-50 text-blue-600 border-blue-100';
    case 'Accessories': return 'bg-purple-50 text-purple-600 border-purple-100';
    case 'Office Utility': return 'bg-orange-50 text-orange-600 border-orange-100';
    case 'Access': return 'bg-teal-50 text-teal-600 border-teal-100';
    default: return 'bg-zinc-50 text-zinc-600 border-zinc-100';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    case 'Returned': return 'bg-zinc-100 text-zinc-500 border-zinc-200';
    default: return 'bg-zinc-50 text-zinc-600 border-zinc-100';
  }
};

export default function AssetsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    setTimeout(() => setMounted(true), 100);
  }, []);

  const radius = 15.915;
  const circumference = 100;

  // IT (33%), Accessories (33%), Office (17%), Access (17%)
  // Adjusted percentages to leave a gap of 1 between each segment (Total gap = 4, remaining = 96)
  const segments = [
    { color: '#3b82f6', percent: 32, offset: 0 },      // Blue (IT Equipment)
    { color: '#a855f7', percent: 32, offset: -33 },    // Purple (Accessories)
    { color: '#fb923c', percent: 16, offset: -66 },    // Orange (Office Utility)
    { color: '#2dd4bf', percent: 16, offset: -83 },    // Teal (Access)
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
            <button className="flex items-center gap-2 rounded-md bg-[#1d4ed8] px-4 py-2 text-[10px] font-semibold text-white shadow-sm hover:bg-blue-700">
              <span className="text-sm leading-none">+</span> Add Asset
            </button>
          </div>
        </div>

        {/* Main Content Layout: 3 Columns Left, 1 Column Right */}
        <div className="grid grid-cols-1 gap-2 xl:grid-cols-4">

          {/* Left Main Content (Stat Cards + Table) */}
          <div className="xl:col-span-3 flex flex-col gap-2">

            {/* Top Stat Cards (4 cards) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-50 text-[#1d4ed8]">
                  <ShoppingBag size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-zinc-500">Total Assets</p>
                  <p className="text-lg font-bold text-zinc-900 leading-tight">6</p>
                  <p className="text-[9px] text-zinc-400">All Assets Assigned</p>
                </div>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-zinc-500">Active Assets</p>
                  <p className="text-lg font-bold text-zinc-900 leading-tight">5</p>
                  <p className="text-[9px] text-zinc-400">Currently in Use</p>
                </div>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-orange-50 text-orange-600">
                  <Wrench size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-zinc-500">Under Maintenance</p>
                  <p className="text-lg font-bold text-zinc-900 leading-tight">0</p>
                  <p className="text-[9px] text-zinc-400">Not Available</p>
                </div>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-purple-50 text-purple-600">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-zinc-500">Returned Assets</p>
                  <p className="text-lg font-bold text-zinc-900 leading-tight">1</p>
                  <p className="text-[9px] text-zinc-400">Already Returned</p>
                </div>
              </div>
            </div>

            {/* Table Area */}
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm flex-1 flex flex-col">

              {/* Table Header / Filters */}
              <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                <div className="flex gap-4 text-[10px] font-bold">
                  <span className="text-[#1d4ed8] border-b-[2.5px] border-[#1d4ed8] pb-3 -mb-[14px] cursor-pointer">All Assets</span>
                  <span className="text-zinc-500 hover:text-zinc-800 cursor-pointer pb-3">Returned Assets</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <select className="appearance-none rounded-md border border-zinc-200 bg-white pl-2 pr-6 py-1.5 text-[10px] font-semibold text-zinc-700 outline-none hover:bg-zinc-50">
                      <option>All Status</option>
                    </select>
                    <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select className="appearance-none rounded-md border border-zinc-200 bg-white pl-2 pr-6 py-1.5 text-[10px] font-semibold text-zinc-700 outline-none hover:bg-zinc-50">
                      <option>All Categories</option>
                    </select>
                    <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
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
                      <th className="pb-3">Current Value (₹)</th>
                      <th className="pb-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {assetsData.map((asset) => (
                      <tr key={asset.id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="py-2.5 pl-2">
                          <div className="flex items-center gap-3">
                            <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-md overflow-hidden bg-white border border-zinc-200`}>
                              <Image src={asset.img} alt={asset.name} width={32} height={32} className='w-full h-full object-contain p-1' />
                            </div>
                            <div>
                              <p className="font-semibold text-zinc-900">{asset.name}</p>
                              <p className="text-[9px] text-zinc-500 mt-0.5">{asset.type}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 text-zinc-600 font-medium">{asset.assetId}</td>
                        <td className="py-2.5">
                          <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold border ${getCategoryColor(asset.category)}`}>
                            {asset.category}
                          </span>
                        </td>
                        <td className="py-2.5 text-zinc-600 font-medium">{asset.assignedOn}</td>
                        <td className="py-2.5 text-center">
                          <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold border ${getStatusColor(asset.status)}`}>
                            {asset.status}
                          </span>
                        </td>
                        <td className="py-2.5 text-zinc-600 font-medium">{asset.condition}</td>
                        <td className="py-2.5 text-zinc-900 font-semibold">{asset.value}</td>
                        <td className="py-2.5">
                          <div className="flex items-center justify-center gap-1.5">
                            <button className="rounded border border-blue-100 p-1 text-[#1d4ed8] hover:bg-blue-50 transition-colors">
                              <EyeIcon size={10} />
                            </button>
                            <button className="rounded border border-blue-100 p-1 text-[#1d4ed8] hover:bg-blue-50 transition-colors">
                              <Pencil size={10} />
                            </button>
                            <button className="p-1 text-zinc-400 hover:text-zinc-700 transition-colors">
                              <MoreVertical size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-[10px] text-zinc-500 font-medium border-t border-zinc-100 pt-3">
                Showing 1 to 6 of 6 assets
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
              <button className="flex items-center gap-2 rounded-md border border-[#1d4ed8] bg-white px-3 py-1.5 text-[10px] font-semibold text-[#1d4ed8] hover:bg-blue-50 transition-colors">
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
                  <p className="text-[11px] font-bold text-zinc-900">Total Current Value (₹)</p>
                  <p className="text-2xl font-bold text-zinc-900 mt-1.5">₹1,48,750</p>
                  <p className="text-[10px] font-medium text-zinc-500 mt-1.5">Of Active Assets</p>
                </div>
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#f0f4ff]">
                  <Image src={wallet} alt="wallet" className='w-full h-full' />
                </div>
              </div>

              {/* Bottom: Breakdown by Category */}
              <div className="p-4 pt-4">
                <h3 className="text-[11px] font-bold text-zinc-900 mb-4">Breakdown by Category</h3>
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
                      <span className="text-[14px] font-bold text-zinc-900 leading-none">6</span>
                      <span className="text-[9px] text-zinc-500 mt-0.5">Total</span>
                    </div>
                  </div>
                  {/* Legend */}
                  <div className="flex-1 space-y-2 text-[9px] font-bold">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-zinc-700">
                        <div className="h-2 w-2 rounded-[2px] bg-blue-500"></div> IT Equipment
                      </div>
                      <div className="text-zinc-900">2 (33%)</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-zinc-700">
                        <div className="h-2 w-2 rounded-[2px] bg-purple-500"></div> Accessories
                      </div>
                      <div className="text-zinc-900">2 (33%)</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-zinc-700">
                        <div className="h-2 w-2 rounded-[2px] bg-orange-400"></div> Office Utility
                      </div>
                      <div className="text-zinc-900">1 (17%)</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-zinc-700">
                        <div className="h-2 w-2 rounded-[2px] bg-teal-400"></div> Access
                      </div>
                      <div className="text-zinc-900">1 (17%)</div>
                    </div>
                  </div>
                </div>
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
                    <p className="text-[10px] font-medium text-slate-500 mt-1">No assets under maintenance</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-gradient-to-br from-rose-100 to-rose-50/50 text-rose-600 border border-rose-100/50">
                    <Calendar size={16} />
                  </div>
                  <div className="pt-0.5">
                    <p className="text-[11px] font-bold text-[#1e293b]">Need to Return</p>
                    <p className="text-[15px] font-bold text-[#1e293b] leading-tight my-0.5">0</p>
                    <p className="text-[10px] font-medium text-slate-500">No assets pending return</p>
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
              <button className="text-[10px] font-bold text-[#1d4ed8] hover:underline mt-4 text-left">
                View Asset Policy →
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
