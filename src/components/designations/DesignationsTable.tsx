'use client';

import React, { useState } from 'react';
import { Search, Filter, ChevronDown, Settings2, RotateCcw, Crown, User, Users, Briefcase, UserCircle, Badge, Square, MoreVertical, Edit2, ChevronLeft, ChevronRight, Trash2, Loader2 } from 'lucide-react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-hot-toast';

const TABS = ['All Designations', 'Active', 'Inactive', 'By Job Grade', 'By Job Family'];

// Helper to get random styling based on string
const getStyling = (str: string = '') => {
  const styles = [
    { icon: User, color: 'text-purple-600', bg: 'bg-purple-50', jgColor: 'text-purple-600 bg-purple-50' },
    { icon: User, color: 'text-pink-600', bg: 'bg-pink-50', jgColor: 'text-pink-600 bg-pink-50' },
    { icon: User, color: 'text-blue-600', bg: 'bg-blue-50', jgColor: 'text-blue-600 bg-blue-50' },
    { icon: User, color: 'text-emerald-600', bg: 'bg-emerald-50', jgColor: 'text-emerald-600 bg-emerald-50' },
    { icon: User, color: 'text-orange-600', bg: 'bg-orange-50', jgColor: 'text-orange-600 bg-orange-50' },
    { icon: User, color: 'text-amber-600', bg: 'bg-amber-50', jgColor: 'text-amber-600 bg-amber-50' },
  ];
  const hash = str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return styles[hash % styles.length];
};

import { Monitor, LayoutDashboard, Presentation, Folder, Network } from 'lucide-react';
const getLibraryIcon = (id: string) => {
  switch (id) {
    case 'monitor': return Monitor;
    case 'layout': return LayoutDashboard;
    case 'presentation': return Presentation;
    case 'users': return Users;
    case 'folder': return Folder;
    case 'network': return Network;
    default: return null;
  }
};

export default function DesignationsTable() {
  const [activeTab, setActiveTab] = useState('All Designations');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('All');
  const [filterFamily, setFilterFamily] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const user = useAuthStore(state => state.user);
  const qc = useQueryClient();

  const hasEditPermission = true;

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await api.delete(`/designations/${id}`),
    onSuccess: () => {
      toast.success('Designation deleted successfully');
      qc.invalidateQueries({ queryKey: ['designations'] });
      qc.invalidateQueries({ queryKey: ['designationStats'] });
    },
    onError: () => toast.error('Failed to delete designation')
  });

  const { data: designations = [], isLoading } = useQuery({
    queryKey: ['designations'],
    queryFn: async () => {
      const res = await api.get('/designations');
      return res.data;
    }
  });

  const filtered = designations.map((d: any) => {
    const styling = getStyling(d.name);
    return {
      id: d._id,
      name: d.name,
      subtitle: d.summary || d.keyResponsibilities || '',
      code: d.code,
      jg: d.jobGrade || 'N/A',
      family: d.jobFamily || 'N/A',
      emp: 0, // Mock for now
      vac: 0, // Mock for now
      status: d.isActive ? 'Active' : 'Inactive',
      iconUrl: d.icon,
      ...styling
    };
  }).filter((d: any) => {
    const tabMatch = activeTab === 'All Designations' ? true : activeTab === 'Active' ? d.status === 'Active' : activeTab === 'Inactive' ? d.status === 'Inactive' : true;
    const searchMatch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.code.toLowerCase().includes(searchTerm.toLowerCase());
    const gradeMatch = filterGrade === 'All' ? true : d.jg === filterGrade;
    const familyMatch = filterFamily === 'All' ? true : d.family === filterFamily;
    const statusMatch = filterStatus === 'All' ? true : d.status === filterStatus;
    return tabMatch && searchMatch && gradeMatch && familyMatch && statusMatch;
  });

  const uniqueGrades = Array.from(new Set(designations.map((d: any) => d.jobGrade))).filter(Boolean) as string[];
  const uniqueFamilies = Array.from(new Set(designations.map((d: any) => d.jobFamily))).filter(Boolean) as string[];

  const totalPages = Math.ceil(filtered.length / rowsPerPage) || 1;
  const paginatedData = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col min-w-0">

      {/* Tabs */}
      <div className="flex items-center gap-6 px-4 pt-2 border-b border-zinc-200">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`pb-3 pt-2 text-[13px] font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === t
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-zinc-600 hover:text-zinc-900'
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="p-4 border-b border-zinc-100 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search designations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 py-2 text-[12px] text-zinc-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-zinc-400"
          />
        </div>

        <select
          value={filterGrade}
          onChange={(e) => setFilterGrade(e.target.value)}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-[12px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors outline-none cursor-pointer bg-white"
        >
          <option value="All">Job Grade (All)</option>
          {uniqueGrades.map(g => <option key={g} value={g}>{g}</option>)}
        </select>

        <select
          value={filterFamily}
          onChange={(e) => setFilterFamily(e.target.value)}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-[12px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors outline-none cursor-pointer bg-white"
        >
          <option value="All">Job Family (All)</option>
          {uniqueFamilies.map(f => <option key={f} value={f}>{f}</option>)}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-[12px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors outline-none cursor-pointer bg-white"
        >
          <option value="All">Status (All)</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button
          onClick={() => {
            setSearchTerm('');
            setFilterGrade('All');
            setFilterFamily('All');
            setFilterStatus('All');
            setActiveTab('All Designations');
          }}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-semibold text-zinc-500 hover:text-zinc-700 transition-colors ml-auto"
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-w-0">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-zinc-50/50 border-b border-zinc-100">
              <th className="py-3 pl-4 pr-2 w-10">
                <input
                  type="checkbox"
                  className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  checked={filtered.length > 0 && selectedIds.length === filtered.length}
                  onChange={(e) => setSelectedIds(e.target.checked ? filtered.map((d: any) => d.id) : [])}
                />
              </th>
              <th className="py-3 px-2 text-[11px] font-semibold text-zinc-700 text-left">Designation Name</th>
              <th className="py-3 px-2 text-[11px] font-semibold text-zinc-700 text-left">Code</th>
              <th className="py-3 px-2 text-[11px] font-semibold text-zinc-700 text-left">Job Grade</th>
              <th className="py-3 px-2 text-[11px] font-semibold text-zinc-700 text-left">Job Family</th>
              <th className="py-3 px-2 text-[11px] font-semibold text-zinc-700 text-left">Employees</th>
              <th className="py-3 px-2 text-[11px] font-semibold text-zinc-700 text-left">Vacant</th>
              <th className="py-3 px-2 text-[11px] font-semibold text-zinc-700 text-left">Status</th>
              {hasEditPermission && <th className="py-3 px-4 text-[11px] font-semibold text-zinc-700 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {isLoading ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-[13px] text-zinc-500">Loading designations...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-[13px] text-zinc-500">No designations found.</td>
              </tr>
            ) : (
              paginatedData.map((d: any) => (
                <tr key={d.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="py-2.5 pl-4 pr-2">
                    <input
                      type="checkbox"
                      className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      checked={selectedIds.includes(d.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedIds(p => [...p, d.id]);
                        else setSelectedIds(p => p.filter(id => id !== d.id));
                      }}
                    />
                  </td>
                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-2.5">
                      {d.iconUrl && d.iconUrl.startsWith('data:image') ? (
                        <img src={d.iconUrl} alt={d.name} className="w-8 h-8 rounded-md object-cover shrink-0 border border-zinc-200 bg-white" />
                      ) : (
                        <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${d.bg} ${d.color}`}>
                          {(() => {
                            const LibIcon = d.iconUrl ? getLibraryIcon(d.iconUrl) : null;
                            return LibIcon ? <LibIcon size={16} /> : <d.icon size={16} />;
                          })()}
                        </div>
                      )}
                      <div>
                        <p className="text-[12.5px] font-bold text-blue-600 group-hover:underline cursor-pointer">{d.name}</p>
                        <p className="text-[10.5px] text-zinc-500 truncate max-w-[200px]">{d.subtitle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-2">
                    <span className="text-[12px] font-semibold text-zinc-700">{d.code}</span>
                  </td>
                  <td className="py-2.5 px-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${d.jgColor}`}>
                      {d.jg}
                    </span>
                  </td>
                  <td className="py-2.5 px-2">
                    <span className="text-[12px] text-zinc-600">{d.family}</span>
                  </td>
                  <td className="py-2.5 px-2">
                    <span className="text-[12px] font-semibold text-zinc-700">{d.emp}</span>
                  </td>
                  <td className="py-2.5 px-2">
                    <span className="text-[12px] font-semibold text-zinc-700">{d.vac}</span>
                  </td>
                  <td className="py-2.5 px-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${d.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-600'
                      }`}>
                      {d.status}
                    </span>
                  </td>
                  {hasEditPermission && (
                    <td className="py-2.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Link href={`/dashboard/divisions/designations/add-designation?editId=${d.id}`} className="w-7 h-7 rounded hover:bg-zinc-200 flex items-center justify-center text-blue-600 transition-colors">
                          <Edit2 size={14} />
                        </Link>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this designation?')) {
                              deleteMutation.mutate(d.id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="w-7 h-7 rounded hover:bg-red-50 flex items-center justify-center text-red-500 transition-colors disabled:opacity-50"
                        >
                          {deleteMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-100 flex flex-wrap items-center justify-between text-[11px] text-zinc-500 gap-4">
        <div>Showing {filtered.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} to {Math.min(currentPage * rowsPerPage, filtered.length)} of {filtered.length} designations</div>
        <div className="flex items-center gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:bg-zinc-100 disabled:opacity-50"
          >
            <ChevronLeft size={14} />
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-6 h-6 rounded flex items-center justify-center font-medium ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'text-zinc-700 hover:bg-zinc-100'}`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:bg-zinc-100 disabled:opacity-50"
          >
            <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="font-semibold text-zinc-700 bg-transparent cursor-pointer hover:bg-zinc-50 px-1 py-0.5 rounded border border-transparent hover:border-zinc-200 outline-none"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

    </div>
  );
}
