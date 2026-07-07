'use client';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

import EmployeeAiSummaryPanel from '@/components/hr-admin/EmployeeAiSummaryPanel';
import ComplianceTab from '@/components/hr-admin/ComplianceTab';
import DisciplinaryTab from '@/components/hr-admin/DisciplinaryTab';
import AssetsTab from '@/components/hr-admin/AssetsTab';
import PoliciesTab from '@/components/hr-admin/PoliciesTab';
import HelpdeskTab from '@/components/hr-admin/HelpdeskTab';
import BGVTab from '@/components/hr-admin/BGVTab';

import { ShieldCheck, Hammer, Laptop, FileSignature, Ticket, CheckCircle2, LayoutDashboard } from 'lucide-react';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';

type TabId = 'overview' | 'compliance' | 'disciplinary' | 'assets' | 'policies' | 'helpdesk' | 'bgv';

export default function HRAdminPage() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('all');

  const { data: employees } = useQuery({
    queryKey: ['employees-list'],
    queryFn: async () => (await api.get('/employees?limit=100')).data?.data || [],
  });

  const employeeOptions = [
    { value: 'all', label: 'All Employees' },
    ...(employees?.map((emp: any) => ({
      value: emp._id,
      label: `${emp.firstName} ${emp.lastName} (${emp.employeeCode || 'No Code'})`,
    })) || [])
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} /> },
    { id: 'helpdesk', label: 'Helpdesk Tickets', icon: <Ticket size={16} /> },
    { id: 'assets', label: 'Assets & Allocation', icon: <Laptop size={16} /> },
    { id: 'policies', label: 'Policy Tracking', icon: <FileSignature size={16} /> },
    { id: 'bgv', label: 'Background Checks', icon: <ShieldCheck size={16} /> },
    { id: 'compliance', label: 'Legal Compliance', icon: <CheckCircle2 size={16} /> },
    { id: 'disciplinary', label: 'Disciplinary Actions', icon: <Hammer size={16} /> },
  ];

  return (
    <div className="flex flex-col gap-2 animate-in fade-in duration-300 pb-2">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50">HR Control Center</h1>
          <p className="text-xs text-zinc-500 mt-1">Operational HR Management</p>
        </div>
        <div className="w-64">
          <SearchableDropdown
            options={employeeOptions}
            value={selectedEmployeeId}
            onChange={(val) => setSelectedEmployeeId(val)}
            placeholder="Filter by Employee..."
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1 border-b border-zinc-200 dark:border-zinc-800">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabId)}
            className={`flex items-center gap-1 px-3 py-2 text-[13px] transition-all border-b-2 font-medium mb-[-1px]
              ${activeTab === tab.id
                ? 'border-zinc-900 text-zinc-900 dark:border-white dark:text-white bg-zinc-50 dark:bg-zinc-900/50'
                : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300 dark:text-zinc-400 dark:hover:text-zinc-300 dark:hover:border-zinc-700'}`}
          >
            <div className={activeTab === tab.id ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}>
              {tab.icon}
            </div>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 w-full">
        {activeTab === 'overview' && (
          <div className="space-y-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
              <div className="bg-white dark:bg-zinc-900 rounded-lg p-3.5 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
                <h3 className="text-zinc-500 font-medium text-xs">Active Employees</h3>
                <div className="text-2xl font-medium mt-1 text-zinc-900 dark:text-zinc-50">{employees?.length || 0}</div>
              </div>
              <div className="bg-white dark:bg-zinc-900 rounded-lg p-3.5 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
                <h3 className="text-zinc-500 font-medium text-xs">Pending Tickets</h3>
                <div className="text-2xl font-medium mt-1 text-zinc-900 dark:text-white">--</div>
              </div>
              <div className="bg-white dark:bg-zinc-900 rounded-lg p-3.5 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
                <h3 className="text-zinc-500 font-medium text-xs">BGV In Progress</h3>
                <div className="text-2xl font-medium mt-1 text-zinc-900 dark:text-white">--</div>
              </div>
            </div>
            <EmployeeAiSummaryPanel employees={employees || []} selectedEmployeeId={selectedEmployeeId} />
          </div>
        )}
        {activeTab === 'helpdesk' && <HelpdeskTab employees={employees} selectedEmployeeId={selectedEmployeeId} />}
        {activeTab === 'assets' && <AssetsTab employees={employees} selectedEmployeeId={selectedEmployeeId} />}
        {activeTab === 'policies' && <PoliciesTab employees={employees} selectedEmployeeId={selectedEmployeeId} />}
        {activeTab === 'bgv' && <BGVTab employees={employees} selectedEmployeeId={selectedEmployeeId} />}
        {activeTab === 'compliance' && <ComplianceTab employees={employees} selectedEmployeeId={selectedEmployeeId} />}
        {activeTab === 'disciplinary' && <DisciplinaryTab employees={employees} selectedEmployeeId={selectedEmployeeId} />}
      </div>
    </div>
  );
}
