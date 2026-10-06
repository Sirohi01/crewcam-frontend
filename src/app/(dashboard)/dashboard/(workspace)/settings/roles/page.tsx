'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Edit2, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

interface Role {
  _id: string;
  name: string;
  description?: string;
  scope: string;
  isActive: boolean;
  updatedAt?: string;
  updatedBy?: { name: string } | string;
}

export default function RoleManagementPage() {
  const queryClient = useQueryClient();
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    scope: 'TENANT_ALL',
    isActive: true,
  });

  const { data: rolesRes, isLoading } = useQuery({
    queryKey: ['companies', 'roles'],
    queryFn: async () => (await api.get('/companies/roles')).data,
  });
  const roles: Role[] = rolesRes?.data || [];

  const createMutation = useMutation({
    mutationFn: async (payload: Partial<Role>) =>
      (await api.post('/companies/roles', payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies', 'roles'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<Role> }) =>
      (await api.put(`/companies/roles/${id}`, payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies', 'roles'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) =>
      (await api.delete(`/companies/roles/${id}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies', 'roles'] });
    },
  });

  const resetForm = () => {
    setEditId(null);
    setFormData({
      name: '',
      description: '',
      scope: 'TENANT_ALL',
      isActive: true,
    });
  };

  const handleEdit = (role: Role) => {
    setEditId(role._id);
    setFormData({
      name: role.name,
      description: role.description || '',
      scope: role.scope || 'TENANT_ALL',
      isActive: role.isActive,
    });
  };

  const handleSave = () => {
    if (editId) {
      updateMutation.mutate({ id: editId, payload: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  // Pagination & Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus ? (filterStatus === 'active' ? role.isActive : !role.isActive) : true;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredRoles.length / pageSize);
  const paginatedRoles = filteredRoles.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize, filterStatus]);

  return (
    <div className="flex flex-col gap-2 animate-in fade-in duration-300 p-2 w-full font-sans text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">Role Management</h1>
          <p className="text-[13px] text-zinc-500 mt-1">Manage all role types used across the platform</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 mt-2">
        
        {/* LEFT PANE - Add/Edit Form */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <Card className="border-zinc-200/80 shadow-sm overflow-hidden">
            <CardHeader className="pb-3 border-b border-zinc-100">
              <CardTitle className="text-[13px] font-semibold text-zinc-900">
                {editId ? 'Edit Role' : 'Add New Role'}
              </CardTitle>
              <p className="text-[12px] text-zinc-500 mt-1">
                {editId ? 'Update role details' : 'Create a new role type'}
              </p>
            </CardHeader>
            <CardContent className="pt-2 flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-zinc-900">Role Name <span className="text-red-500">*</span></label>
                <Input
                  placeholder="Enter role name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-8 text-[12px] border-zinc-200 focus-visible:ring-zinc-900/20"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-zinc-900">Description (Optional)</label>
                <textarea
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-[80px] text-[12px] p-2 rounded-md border border-zinc-200 bg-white shadow-sm placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900/20 resize-y"
                />
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
                  disabled={!formData.name || createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) ? <Loader2 size={14} className="animate-spin" /> : editId ? 'Update Role' : 'Save Role'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT PANE - List */}
        <div className="lg:col-span-9 flex flex-col gap-4">
          <Card className="border-zinc-200/80 shadow-sm h-full flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-zinc-100">
              <div>
                <CardTitle className="text-[13px] font-semibold text-zinc-900">Role List</CardTitle>
                <p className="text-[11px] text-zinc-500 mt-0.5">All roles in the system</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Input 
                    placeholder="Search role..." 
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
                {filterStatus && (
                  <button 
                    onClick={() => { setFilterStatus(''); }}
                    className="text-red-500 hover:text-red-700 ml-auto font-medium"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}

            <CardContent className="p-0 flex-1 overflow-x-auto">
              {isLoading ? (
                <div className="p-12 text-center text-sm text-zinc-500">Loading roles...</div>
              ) : (
                <div className="min-w-full">
                  <table className="w-full text-[13px] text-left">
                    <thead className="bg-white border-b border-zinc-100">
                      <tr>
                        <th className="px-3 py-2 font-semibold text-zinc-900 w-16">#</th>
                        <th className="px-3 py-2 font-semibold text-zinc-900">Role Name</th>
                        <th className="px-3 py-2 font-semibold text-zinc-900">Status</th>
                        <th className="px-3 py-2 font-semibold text-zinc-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100/80">
                      {paginatedRoles.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">No roles found.</td>
                        </tr>
                      ) : (
                        paginatedRoles.map((role, index) => (
                          <tr key={role._id} className="hover:bg-zinc-50/50 transition-colors bg-white whitespace-nowrap">
                            <td className="px-3 py-2 text-zinc-500">{(currentPage - 1) * pageSize + index + 1}</td>
                            <td className="px-3 py-2 font-medium text-zinc-800">{role.name}</td>
                            <td className="px-3 py-2">
                              <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium ${role.isActive ? 'bg-green-100/60 text-green-700' : 'bg-red-100/60 text-red-600'}`}>
                                {role.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-3 py-2">
                              <div className="flex items-center gap-4">
                                <button onClick={() => handleEdit(role)} className="text-zinc-900 hover:text-zinc-700 transition-colors">
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
                                      deleteMutation.mutate(role._id);
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
            {!isLoading && filteredRoles.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 bg-white">
                <div className="flex items-center gap-3 text-[13px] text-zinc-500">
                  <span>Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredRoles.length)} of {filteredRoles.length} roles</span>
                  <select 
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="h-8 rounded-md border border-zinc-200 bg-white px-2 py-1 text-[13px] outline-none focus:border-zinc-900"
                  >
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
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
