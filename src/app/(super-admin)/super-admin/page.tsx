'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Server, Users, Activity, Building2, DollarSign, ArrowUpRight, ArrowDownRight, FileText, Settings, ShieldAlert, CreditCard } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const growthData = [
  { name: 'Jan', value: 4 },
  { name: 'Feb', value: 7 },
  { name: 'Mar', value: 5 },
  { name: 'Apr', value: 12 },
  { name: 'May', value: 18 },
  { name: 'Jun', value: 24 },
  { name: 'Jul', value: 28 },
];

export default function SuperAdminOverviewPage() {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300 pb-6 max-w-[1400px] mx-auto">

      {/* Header section - Highly compact */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Super Admin Work Space</h1>
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-md">System Metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/50 rounded p-0.5">
            <button className="px-2.5 py-1 text-[11px] font-medium bg-white dark:bg-zinc-700 rounded shadow-sm text-zinc-900 dark:text-zinc-100">Overview</button>
            <button className="px-2.5 py-1 text-[11px] font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Tenants</button>
            <button className="px-2.5 py-1 text-[11px] font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Billing</button>
          </div>
          <button className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-white text-zinc-50 dark:text-zinc-900 px-3 py-1 rounded text-[11px] font-medium transition-colors">
            <Settings size={12} />
            <span>Config</span>
          </button>
        </div>
      </div>

      {/* KPI Cards - Ultra dense grid */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard title="Total Tenants" value="128" icon={<Building2 size={14} />} trend="+12" isPositive={true} />
        <StatCard title="Active Users" value="8,442" icon={<Users size={14} />} trend="+840" isPositive={true} />
        <StatCard title="MRR (Rev)" value="₹42.5k" icon={<DollarSign size={14} />} trend="+14.2%" isPositive={true} />
        <StatCard title="Health" value="99.9%" icon={<Activity size={14} />} trend="Stable" isPositive={true} />
      </div>

      <div className="grid grid-cols-12 gap-3">

        {/* Main Chart Section - Compact */}
        <Card className="col-span-8 border-zinc-200/80 shadow-sm dark:border-zinc-800 overflow-hidden rounded-lg">
          <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/30 px-4 py-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-[13px] font-md">Tenant Growth</CardTitle>
                <span className="text-[10px] text-zinc-500">Last 6 months</span>
              </div>
              <span className="flex items-center gap-0.5 text-[10px] font-medium text-emerald-600">
                <ArrowUpRight size={12} /> 24% YoY
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-1">
            <div className="h-[220px] w-full min-h-[220px] min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <AreaChart data={growthData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#18181b" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#18181b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '6px', border: '1px solid #e4e4e7', padding: '4px 8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                    itemStyle={{ color: '#18181b', fontSize: '12px', fontWeight: 600 }}
                    labelStyle={{ fontSize: '10px', color: '#71717a' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#18181b" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Right Sidebar Section - Dense */}
        <div className="col-span-4 flex flex-col gap-3">

          {/* Quick Actions */}
          <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg">
            <CardHeader className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/30">
              <CardTitle className="text-[12px] font-md flex items-center gap-1.5">
                <Server size={12} className="text-zinc-500" />
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 grid grid-cols-2 gap-1.5">
              <QuickAction icon={<Building2 size={14} />} label="New Tenant" />
              <QuickAction icon={<CreditCard size={14} />} label="Packages" />
              <QuickAction icon={<FileText size={14} />} label="Invoices" badge="12" />
              <QuickAction icon={<ShieldAlert size={14} />} label="Security" />
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg flex-1 flex flex-col">
            <CardHeader className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-row items-center justify-between">
              <CardTitle className="text-[12px] font-md">Events</CardTitle>
              <button className="text-[10px] text-zinc-500 hover:text-zinc-900 font-medium">Logs</button>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto">
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                <ActivityItem user="Acme Corp" action="upgraded plan" time="15m" dotColor="bg-emerald-500" />
                <ActivityItem user="Stark Ind" action="tenant created" time="2h" dotColor="bg-blue-500" />
                <ActivityItem user="System" action="db backup done" time="5h" dotColor="bg-zinc-400" />
                <ActivityItem user="TechFlow" action="payment failed" time="1d" dotColor="bg-rose-500" />
                <ActivityItem user="Wayne Ent" action="api key rotated" time="2d" dotColor="bg-amber-500" />
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Additional Data Table */}
      <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg overflow-hidden mt-2">
        <CardHeader className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/30">
          <CardTitle className="text-[13px] font-md">Recently Onboarded Tenants</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-zinc-50/80 dark:bg-zinc-900/50 text-zinc-500 uppercase tracking-wider font-md border-b border-zinc-100 dark:border-zinc-800/50">
                <tr>
                  <th className="px-4 py-2">Tenant Name</th>
                  <th className="px-4 py-2">Admin Email</th>
                  <th className="px-4 py-2">Package</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2 text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                  <td className="px-4 py-2.5 font-medium text-zinc-900 dark:text-zinc-100">Acme Corporation</td>
                  <td className="px-4 py-2.5 text-zinc-500">admin@acmecorp.com</td>
                  <td className="px-4 py-2.5 text-zinc-500">Enterprise</td>
                  <td className="px-4 py-2.5"><span className="px-1.5 py-0.5 rounded text-[9px] font-md bg-emerald-100 text-emerald-700">ACTIVE</span></td>
                  <td className="px-4 py-2.5 text-right text-zinc-500">Today</td>
                </tr>
                <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                  <td className="px-4 py-2.5 font-medium text-zinc-900 dark:text-zinc-100">Stark Industries</td>
                  <td className="px-4 py-2.5 text-zinc-500">tony@stark.com</td>
                  <td className="px-4 py-2.5 text-zinc-500">Professional</td>
                  <td className="px-4 py-2.5"><span className="px-1.5 py-0.5 rounded text-[9px] font-md bg-emerald-100 text-emerald-700">ACTIVE</span></td>
                  <td className="px-4 py-2.5 text-right text-zinc-500">Yesterday</td>
                </tr>
                <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                  <td className="px-4 py-2.5 font-medium text-zinc-900 dark:text-zinc-100">Wayne Enterprises</td>
                  <td className="px-4 py-2.5 text-zinc-500">bruce@wayne.com</td>
                  <td className="px-4 py-2.5 text-zinc-500">Enterprise</td>
                  <td className="px-4 py-2.5"><span className="px-1.5 py-0.5 rounded text-[9px] font-md bg-emerald-100 text-emerald-700">ACTIVE</span></td>
                  <td className="px-4 py-2.5 text-right text-zinc-500">2 days ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon, trend, isPositive }: any) {
  return (
    <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg hover:shadow transition-shadow">
      <CardContent className="p-3">
        <div className="flex justify-between items-center mb-2">
          <p className="text-[11px] font-md text-zinc-500 uppercase tracking-wider">{title}</p>
          <div className="text-zinc-400">
            {icon}
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-xl font-md tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">{value}</h3>
          {trend && (
            <div className={`flex items-center text-[10px] font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
              {trend}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function QuickAction({ icon, label, badge }: any) {
  return (
    <button className="flex items-center gap-2 p-2 rounded-md bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 transition-colors border border-zinc-100 dark:border-zinc-800/80 relative text-left">
      <div className="text-zinc-600 dark:text-zinc-300">
        {icon}
      </div>
      <span className="text-[11px] font-md text-zinc-700 dark:text-zinc-200 flex-1 truncate">{label}</span>
      {badge && (
        <span className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-[9px] font-md px-1.5 py-0.5 rounded">
          {badge}
        </span>
      )}
    </button>
  );
}

function ActivityItem({ user, action, time, dotColor }: any) {
  return (
    <div className="flex items-center gap-2.5 p-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`}></div>
      <div className="flex-1 min-w-0 flex items-center justify-between">
        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 truncate">
          <span className="font-md text-zinc-900 dark:text-zinc-100">{user}</span> {action}
        </p>
        <p className="text-[10px] text-zinc-400 font-medium shrink-0 ml-2">
          {time}
        </p>
      </div>
    </div>
  );
}
