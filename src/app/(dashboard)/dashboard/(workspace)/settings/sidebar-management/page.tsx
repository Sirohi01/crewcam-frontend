'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, Edit2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

interface SidebarItem {
  _id: string;
  section: string;
  label: string;
  href: string;
  order: number;
  icon?: string;
  parent?: string;
  sectionOrder?: number;
  requiredPermission?: string;
  requiredFeature?: string;
  roleIds: Array<{ _id: string; name: string } | string>;
  isActive: boolean;
}

export default function SidebarManagementPage() {
  const queryClient = useQueryClient();
  const { data: items, isLoading } = useQuery<SidebarItem[]>({
    queryKey: ['admin', 'sidebar-config'],
    queryFn: async () => (await api.get('/permissions/sidebar-config')).data,
  });

  const createMutation = useMutation({
    mutationFn: async (payload: Partial<SidebarItem>) =>
      (await api.post('/permissions/sidebar-config', payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'sidebar-config'] });
      queryClient.invalidateQueries({ queryKey: ['sidebar', 'mine'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<SidebarItem> }) =>
      (await api.put(`/permissions/sidebar-config/${id}`, payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'sidebar-config'] });
      queryClient.invalidateQueries({ queryKey: ['sidebar', 'mine'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) =>
      (await api.delete(`/permissions/sidebar-config/${id}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'sidebar-config'] });
      queryClient.invalidateQueries({ queryKey: ['sidebar', 'mine'] });
    },
  });

  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    label: '',
    href: '',
    section: 'MAIN',
    icon: 'Circle',
    parent: '',
    order: 0,
    isActive: true,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterSection, setFilterSection] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddingCustomMode, setIsAddingCustomMode] = useState(false);

  const uniqueSections = Array.from(new Set((items || []).map(i => i.section).filter(Boolean)));
  const uniqueParents = Array.from(new Set((items || []).map(i => i.label).filter(Boolean)));

  const filteredItems = (items || []).filter(item => {
    const matchesSearch = item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.href.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSection = filterSection ? item.section === filterSection : true;
    const matchesStatus = filterStatus ? (filterStatus === 'active' ? item.isActive : !item.isActive) : true;

    return matchesSearch && matchesSection && matchesStatus;
  });

  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const paginatedItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Reset page when search or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize]);

  const resetForm = () => {
    setEditId(null);
    setIsAddingCustomMode(false);
    setFormData({
      label: '',
      href: '',
      section: 'MAIN',
      icon: 'Circle',
      parent: '',
      order: 0,
      isActive: true,
    });
  };

  const handleEdit = (item: SidebarItem) => {
    setEditId(item._id);
    setIsAddingCustomMode(false);
    setFormData({
      label: item.label,
      href: item.href,
      section: item.section || 'MAIN',
      icon: item.icon || 'Circle',
      parent: item.parent || '',
      order: item.order || 0,
      isActive: item.isActive,
    });
  };

  const handleSave = () => {
    if (editId) {
      updateMutation.mutate({ id: editId, payload: formData });
    } else {
      createMutation.mutate({ ...formData, sectionOrder: 999 });
    }
  };

  const isCustomSection = isAddingCustomMode || (!uniqueSections.includes(formData.section) && formData.section !== '');

  return (
    <div className="flex flex-col gap-2 animate-in fade-in duration-300 p-2 w-full font-sans text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">Sidebar Management</h1>
          <p className="text-[13px] text-zinc-500 mt-1">Configure dynamic sidebar menu items</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">

        {/* LEFT PANE - Add/Edit Form */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <Card className="border-zinc-200/80 shadow-sm">
            <CardHeader className="pb-3 border-b border-zinc-100">
              <CardTitle className="text-[13px] font-semibold text-zinc-900">
                {editId ? 'Edit Sidebar Item' : 'Add New Sidebar Item'}
              </CardTitle>
              <p className="text-[12px] text-zinc-500 mt-1">
                {editId ? 'Update item details' : 'Create a new menu item'}
              </p>
            </CardHeader>
            <CardContent className="pt-2 flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-zinc-900">Label <span className="text-red-500">*</span></label>
                <Input
                  placeholder="Menu Label"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="h-8 text-[12px] border-zinc-200 focus-visible:ring-zinc-900/20"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-zinc-900">Path <span className="text-red-500">*</span></label>
                <Input
                  placeholder="/route-path"
                  value={formData.href}
                  onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                  className="h-8 text-[12px] border-zinc-200 focus-visible:ring-zinc-900/20"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-zinc-900">Section <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <select
                    value={isCustomSection ? 'CUSTOM' : formData.section}
                    onChange={(e) => {
                      if (e.target.value === 'CUSTOM') {
                        setIsAddingCustomMode(true);
                        setFormData({ ...formData, section: '' });
                      } else {
                        setIsAddingCustomMode(false);
                        setFormData({ ...formData, section: e.target.value });
                      }
                    }}
                    className="h-8 text-[11px] flex w-full rounded-md border border-zinc-200 bg-white px-3 py-1 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-900/20"
                  >
                    <option value="" disabled>Select Section</option>
                    {uniqueSections.map((sec) => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                    <option value="CUSTOM">+ Add New Section</option>
                  </select>
                  {isCustomSection && (
                    <Input
                      placeholder="New Section"
                      value={formData.section}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                      className="h-8 text-[12px] border-zinc-200 focus-visible:ring-zinc-900/20"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-zinc-900">Icon</label>
                  <Input
                    placeholder="Icon Name"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="h-8 text-[12px] border-zinc-200 focus-visible:ring-zinc-900/20"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-zinc-900">Order</label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="h-8 text-[12px] border-zinc-200 focus-visible:ring-zinc-900/20"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-zinc-900">Parent Menu</label>
                <select
                  value={formData.parent}
                  onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                  className="h-8 text-[12px] flex w-full rounded-md border border-zinc-200 bg-white px-3 py-1 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-900/20"
                >
                  <option value="">-- None (Root) --</option>
                  {uniqueParents.map((parentLabel) => (
                    <option key={parentLabel} value={parentLabel}>{parentLabel}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1 mt-1">
                <label className="text-[12px] font-medium text-zinc-900">Status <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.isActive}
                      onChange={() => setFormData({ ...formData, isActive: true })}
                      className="text-zinc-900 focus:ring-zinc-900 w-3 h-3"
                    />
                    <span className="text-[12px] text-zinc-700">Active</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={!formData.isActive}
                      onChange={() => setFormData({ ...formData, isActive: false })}
                      className="text-zinc-900 focus:ring-zinc-900 w-3 h-3"
                    />
                    <span className="text-[12px] text-zinc-700">Inactive</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button variant="outline" onClick={resetForm} className="h-8 text-[12px] px-4 rounded-md border-zinc-200 text-zinc-600">
                  Cancel
                </Button>
                <Button
                  className="h-8 text-[12px] px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-md font-medium"
                  onClick={handleSave}
                  disabled={!formData.label || !formData.href || createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) ? <Loader2 size={14} className="animate-spin" /> : editId ? 'Update Item' : 'Add Item'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT PANE - List */}
        <div className="lg:col-span-9 flex flex-col gap-4">
          <Card className="border-zinc-200/80 shadow-sm h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-zinc-100">
              <div>
                <CardTitle className="text-[13px] font-semibold text-zinc-900">Sidebar Items</CardTitle>
                <p className="text-[11px] text-zinc-500 mt-0.5">All sidebar configurations in the system</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Input
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 w-64 text-[13px] pl-9 border-zinc-200 focus-visible:ring-zinc-900/20"
                  />
                  <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                </div>
                <Button
                  variant={showFilters ? "default" : "outline"}
                  onClick={() => setShowFilters(!showFilters)}
                  className={`h-9 px-4 text-[13px] flex items-center gap-2 ${showFilters ? 'bg-zinc-900 text-white hover:bg-zinc-800 border-zinc-900' : 'border-zinc-200'}`}
                >
                  <FilterIcon className="h-3.5 w-3.5" /> Filter
                </Button>
              </div>
            </CardHeader>

            {showFilters && (
              <div className="flex items-center gap-5 px-6 py-3 border-b border-zinc-100 bg-zinc-50/50 text-[12px]">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-zinc-600">Section:</span>
                  <select
                    value={filterSection}
                    onChange={e => setFilterSection(e.target.value)}
                    className="h-7 border border-zinc-200 rounded px-2 bg-white outline-none focus:border-zinc-900"
                  >
                    <option value="">All Sections</option>
                    {uniqueSections.map(sec => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-zinc-600">Status:</span>
                  <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="h-7 border border-zinc-200 rounded px-2 bg-white outline-none focus:border-zinc-900"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                {(filterSection || filterStatus) && (
                  <button
                    onClick={() => { setFilterSection(''); setFilterStatus(''); }}
                    className="text-red-500 hover:text-red-700 ml-auto font-medium"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}

            <CardContent className="p-0 flex-1">
              {isLoading ? (
                <div className="p-12 text-center text-sm text-zinc-500">Loading sidebar items...</div>
              ) : (
                <div className="w-full overflow-x-auto">
                  <table className="min-w-full text-[13px] text-left table-fixed">
                    <thead className="bg-white border-b border-zinc-100">
                      <tr className="whitespace-nowrap">
                        <th className="px-3 py-2 font-semibold text-zinc-900 w-12">#</th>
                        <th className="px-3 py-2 font-semibold text-zinc-900">Label</th>
                        <th className="px-3 py-2 font-semibold text-zinc-900">Path</th>
                        <th className="px-3 py-2 font-semibold text-zinc-900">Section</th>
                        <th className="px-3 py-2 font-semibold text-zinc-900 text-center">Order</th>
                        <th className="px-3 py-2 font-semibold text-zinc-900">Status</th>
                        <th className="px-3 py-2 font-semibold text-zinc-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100/80">
                      {paginatedItems.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">No items found.</td>
                        </tr>
                      ) : (
                        paginatedItems.map((item, index) => (
                          <tr key={item._id} className="hover:bg-zinc-50/50 transition-colors bg-white whitespace-nowrap">
                            <td className="px-3 py-2 text-zinc-500">{(currentPage - 1) * pageSize + index + 1}</td>
                            <td className="px-3 py-2 font-medium text-zinc-800">{item.label}</td>
                            <td className="px-3 py-2 text-zinc-500">
                              <div className="truncate max-w-[150px] lg:max-w-[200px] xl:max-w-[300px]" title={item.href}>
                                {item.href}
                              </div>
                            </td>
                            <td className="px-3 py-2 text-zinc-500">{item.section}</td>
                            <td className="px-3 py-2 text-zinc-500 text-center">{item.order}</td>
                            <td className="px-3 py-2">
                              <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium ${item.isActive ? 'bg-green-100/60 text-green-700' : 'bg-red-100/60 text-red-600'}`}>
                                {item.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-3 py-2">
                              <div className="flex items-center gap-4">
                                <button onClick={() => handleEdit(item)} className="text-zinc-900 hover:text-zinc-700 transition-colors">
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to delete "${item.label}"?`)) {
                                      deleteMutation.mutate(item._id);
                                    }
                                  }}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
            {/* Pagination */}
            {!isLoading && filteredItems.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 bg-white">
                <div className="flex items-center gap-3 text-[13px] text-zinc-500">
                  <span>Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredItems.length)} of {filteredItems.length} items</span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="h-8 rounded-md border border-zinc-200 bg-white px-2 py-1 text-[13px] outline-none focus:border-zinc-900"
                  >
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                    <option value="100">100 per page</option>
                  </select>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="h-8 w-8 p-0 text-[12px] border-zinc-200">&laquo;</Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="h-8 w-8 p-0 text-[12px] border-zinc-200">&lsaquo;</Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .map((page, i, arr) => (
                      <React.Fragment key={page}>
                        {i > 0 && arr[i - 1] !== page - 1 && <span className="px-2 text-zinc-400">...</span>}
                        <Button
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={`h-8 w-8 p-0 text-[12px] ${currentPage === page ? 'bg-zinc-900 text-white hover:bg-zinc-800 border-zinc-900' : 'border-zinc-200'}`}
                        >
                          {page}
                        </Button>
                      </React.Fragment>
                    ))}
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="h-8 w-8 p-0 text-[12px] border-zinc-200">&rsaquo;</Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="h-8 w-8 p-0 text-[12px] border-zinc-200">&raquo;</Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

// Simple icons to avoid missing imports
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function FilterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}
