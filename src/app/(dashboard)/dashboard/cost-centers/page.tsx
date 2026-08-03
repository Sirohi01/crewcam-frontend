"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight, Building2, Search, X, Users, PieChart,
  Wallet, ArrowRight, Info, ExternalLink, ChevronLeft, Building
} from 'lucide-react';

const BREADCRUMB = ['Organization Setup', 'Cost Centers', 'Go to Cost Center'];

export default function CostCentersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const tableData = [
    {
      code: 'CC-INT-001', name: 'Interior Projects', subName: 'Interior Design & Build Projects',
      bu: 'Interior Design BU', division: 'Design & Build',
      head: { name: 'Rahul Nair', role: 'Manager', avatar: '150?u=rahul' },
      budget: '1,25,00,000', util: 72.45, status: 'Active'
    },
    {
      code: 'CC-ADM-001', name: 'Administration', subName: 'Admin & Office Operations',
      bu: 'Corporate Services', division: 'Administration',
      head: { name: 'Neha Joshi', role: 'HR Executive', avatar: '150?u=neha' },
      budget: '85,00,000', util: 58.30, status: 'Active'
    },
    {
      code: 'CC-MKT-001', name: 'Marketing & Branding', subName: 'Marketing & Brand Activities',
      bu: 'Corporate Services', division: 'Marketing',
      head: { name: 'Amit Verma', role: 'Manager', avatar: '150?u=amit' },
      budget: '95,00,000', util: 61.10, status: 'Active'
    },
    {
      code: 'CC-FIN-001', name: 'Finance & Accounts', subName: 'Finance, Accounts & Taxation',
      bu: 'Corporate Services', division: 'Finance',
      head: { name: 'Pooja Mehta', role: 'Finance Executive', avatar: '150?u=pooja' },
      budget: '1,10,00,000', util: 68.75, status: 'Active'
    },
    {
      code: 'CC-IT-001', name: 'IT & Systems', subName: 'IT Infrastructure & Support',
      bu: 'Corporate Services', division: 'Information Technology',
      head: { name: 'Vikram Singh', role: 'IT Executive', avatar: '150?u=vikram' },
      budget: '70,00,000', util: 54.20, status: 'Active'
    },
    {
      code: 'CC-PROC-001', name: 'Procurement', subName: 'Purchasing & Vendor Mgmt.',
      bu: 'Corporate Services', division: 'Procurement',
      head: { name: 'Sandeep Kumar', role: 'Procurement Executive', avatar: '150?u=sandeep' },
      budget: '60,00,000', util: 49.60, status: 'Active'
    },
    {
      code: 'CC-OPE-001', name: 'Operations', subName: 'General Operations',
      bu: 'Operations BU', division: 'Operations',
      head: { name: 'Renu Yadav', role: 'Operations Manager', avatar: '150?u=renu' },
      budget: '2,05,00,000', util: 66.40, status: 'Active'
    },
    {
      code: 'CC-TRN-001', name: 'Training & Development', subName: 'Employee Training & Development',
      bu: 'People Development BU', division: 'Training & Development',
      head: { name: 'Swati Sharma', role: 'Training Manager', avatar: '150?u=swati' },
      budget: '40,00,000', util: 45.20, status: 'Active'
    }
  ];

  return (
    <div className="flex flex-col gap-2 p-2 w-full font-sans text-slate-800 bg-slate-100 min-h-screen overflow-x-hidden">

      {/* Breadcrumb */}
      <div className="text-[10px] font-semibold text-slate-500 mb-0 flex items-center gap-1 flex-wrap">
        {BREADCRUMB.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <ChevronRight className="w-3 h-3 text-slate-400" />}
            <span className={i === BREADCRUMB.length - 1 ? 'text-indigo-700 font-bold' : 'hover:text-slate-700 cursor-pointer transition-colors'}>
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-1 mt-1">
        <div className="w-10 h-10 rounded-lg bg-indigo-700 text-white flex items-center justify-center shrink-0 shadow-sm">
          <Building2 className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-[18px] font-extrabold text-slate-900 leading-tight">Go to Cost Center</h1>
          <p className="text-[11.5px] text-slate-600 font-medium">View, manage and navigate to specific cost centers.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-1">
        <div className="bg-white border border-slate-300 rounded-lg p-3 flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Building className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 mb-0.5">Total Cost Centers</span>
            <span className="text-[18px] font-extrabold text-slate-900 leading-none mb-1">48</span>
            <span className="text-[9.5px] font-bold text-emerald-600">Active Cost Centers <span className="text-slate-600 font-medium">42</span></span>
          </div>
        </div>

        <div className="bg-white border border-slate-300 rounded-lg p-3 flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 mb-0.5">Total Budget (FY 2025-26)</span>
            <span className="text-[18px] font-extrabold text-slate-900 leading-none mb-1">₹ 9,50,00,000</span>
            <span className="text-[9.5px] font-medium text-slate-600">Allocated <span className="font-bold text-slate-800">0</span></span>
          </div>
        </div>

        <div className="bg-white border border-slate-300 rounded-lg p-3 flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 mb-0.5">Total Employees</span>
            <span className="text-[18px] font-extrabold text-slate-900 leading-none mb-1">352</span>
            <span className="text-[9.5px] font-medium text-slate-600">Assigned to Cost Centers</span>
          </div>
        </div>

        <div className="bg-white border border-slate-300 rounded-lg p-3 flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
            <PieChart className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 mb-0.5">Average Utilization</span>
            <span className="text-[18px] font-extrabold text-slate-900 leading-none mb-1">63.25%</span>
            <span className="text-[9.5px] font-medium text-slate-600">YTD</span>
          </div>
        </div>
      </div>

      {/* Filters & Table Container */}
      <div className="bg-white border border-slate-300 rounded-lg shadow-md flex flex-col flex-1 overflow-hidden">

        {/* Filters Row */}
        <div className="p-3 border-b border-slate-200 grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-700">Search Cost Center</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by code or name..."
                className="w-full h-8 pl-3 pr-8 text-[11px] bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-700">Business Unit</label>
            <select className="w-full h-8 px-2 text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer">
              <option>All Business Units</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-700">Division</label>
            <select className="w-full h-8 px-2 text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer">
              <option>All Divisions</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-700">Cost Center Head</label>
            <select className="w-full h-8 px-2 text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer">
              <option>All Heads</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-700">Status</label>
            <select className="w-full h-8 px-2 text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer">
              <option>Active</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <button className="h-8 flex items-center justify-center gap-1.5 px-3 border border-slate-300 rounded-md text-[11px] font-bold text-slate-600 hover:bg-slate-100 transition-colors w-full bg-white">
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-1.5 px-2 text-[9.5px] font-extrabold text-slate-700 tracking-wider whitespace-nowrap">Cost Center Code <span className="inline-block align-middle ml-1 text-slate-400">↕</span></th>
                <th className="py-1.5 px-2 text-[9.5px] font-extrabold text-slate-700 tracking-wider whitespace-nowrap">Cost Center Name <span className="inline-block align-middle ml-1 text-slate-400">↕</span></th>
                <th className="py-1.5 px-2 text-[9.5px] font-extrabold text-slate-700 tracking-wider whitespace-nowrap">Business Unit <span className="inline-block align-middle ml-1 text-slate-400">↕</span></th>
                <th className="py-1.5 px-2 text-[9.5px] font-extrabold text-slate-700 tracking-wider whitespace-nowrap">Division <span className="inline-block align-middle ml-1 text-slate-400">↕</span></th>
                <th className="py-1.5 px-2 text-[9.5px] font-extrabold text-slate-700 tracking-wider whitespace-nowrap">Cost Center Head <span className="inline-block align-middle ml-1 text-slate-400">↕</span></th>
                <th className="py-1.5 px-2 text-[9.5px] font-extrabold text-slate-700 tracking-wider text-right whitespace-nowrap">Budget (FY 2025-26) <span className="inline-block align-middle ml-1 text-slate-400">↕</span></th>
                <th className="py-1.5 px-2 text-[9.5px] font-extrabold text-slate-700 tracking-wider text-center whitespace-nowrap">Utilization (YTD) <span className="inline-block align-middle ml-1 text-slate-400">↕</span></th>
                <th className="py-1.5 px-2 text-[9.5px] font-extrabold text-slate-700 tracking-wider text-center">Status <span className="inline-block align-middle ml-1 text-slate-400">↕</span></th>
                <th className="py-1.5 px-2 text-[9.5px] font-extrabold text-slate-700 tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tableData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-1.5 px-2 align-middle">
                    <span className="inline-block px-1.5 py-0.5 bg-slate-100 rounded text-[9.5px] font-extrabold text-slate-700">{row.code}</span>
                  </td>
                  <td className="py-1.5 px-2 align-middle">
                    <div className="flex flex-col">
                      <span className="text-[10.5px] font-extrabold text-slate-900">{row.name}</span>
                      <span className="text-[9px] text-slate-500 font-medium">{row.subName}</span>
                    </div>
                  </td>
                  <td className="py-1.5 px-2 align-middle text-[10px] font-bold text-slate-700">{row.bu}</td>
                  <td className="py-1.5 px-2 align-middle text-[10px] font-bold text-slate-700">{row.division}</td>
                  <td className="py-1.5 px-2 align-middle">
                    <div className="flex items-center gap-1.5">
                      <img src={`https://i.pravatar.cc/150?u=${row.head.avatar}`} alt={row.head.name} className="w-5 h-5 rounded-full border border-slate-200" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-extrabold text-slate-900 leading-tight">{row.head.name}</span>
                        <span className="text-[8.5px] text-slate-500 font-medium leading-tight">{row.head.role}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-1.5 px-2 align-middle text-right text-[10.5px] font-extrabold text-slate-800">
                    ₹ {row.budget}
                  </td>
                  <td className="py-1.5 px-2 align-middle">
                    <div className="flex flex-col items-center gap-0.5 w-20 mx-auto">
                      <span className="text-[10px] font-extrabold text-slate-800">{row.util.toFixed(2)}%</span>
                      <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${row.util}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-1.5 px-2 align-middle text-center">
                    <span className="inline-block px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[9px] font-extrabold">{row.status}</span>
                  </td>
                  <td className="py-1.5 px-2 align-middle text-center">
                    <button className="inline-flex items-center gap-1 px-2 py-1 border border-slate-300 rounded text-[9.5px] font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap">
                      Go to Cost Center <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-3 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
          <span className="text-[11px] font-extrabold text-slate-700">Showing 1 to 8 of 48 entries</span>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-500 transition-colors">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded border border-indigo-600 bg-indigo-700 text-white font-bold text-[11px]">1</button>
            <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-[11px] transition-colors">2</button>
            <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-[11px] transition-colors">3</button>
            <span className="w-7 h-7 flex items-center justify-center text-slate-400 font-bold text-[11px]">...</span>
            <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-[11px] transition-colors">6</button>
            <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-500 transition-colors">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-3 flex items-start gap-2 shadow-sm mb-2 mt-1">
        <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div className="flex flex-col flex-1 gap-0.5">
          <h4 className="text-[11.5px] font-extrabold text-indigo-900">How it works?</h4>
          <p className="text-[10.5px] text-slate-600 font-medium">Click on "Go to Cost Center" to view details, budgets, expenses, employees and reports for that cost center.</p>
        </div>
        <button className="flex items-center gap-1 text-[11px] font-bold text-indigo-700 hover:text-indigo-800 shrink-0 self-end">
          Learn more <ExternalLink className="w-3 h-3" />
        </button>
      </div>

    </div>
  );
}
