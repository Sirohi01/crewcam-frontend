'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Save, Printer, ArrowLeft, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import api from '@/lib/axios';
// import PageHeader from '@/components/common/PageHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TeamIntroPageProps {
  candidateId: string;
}

export default function TeamIntroPage({ candidateId }: TeamIntroPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<any>({
    candidateName: '',
    department: '',
    position: '',
    reportingTo: '',
    joiningDate: '',
    effectiveDate: '',
  });

  const { data: departmentsResponse } = useQuery({
    queryKey: ['departments'],
    queryFn: () => api.get('/companies/departments').then(res => res.data)
  });
  const departments = departmentsResponse?.data || [];

  const { data: designationsResponse } = useQuery({
    queryKey: ['designations'],
    queryFn: () => api.get('/designations').then(res => res.data)
  });
  const designations = designationsResponse?.data || [];

  const { data: recordsData, isLoading } = useQuery({
    queryKey: ['team-intro', candidateId],
    queryFn: () => api.get(`/hiring/team-intro?candidateId=${candidateId}`).then(res => res.data)
  });

  const records = recordsData?.data || [];

  const { data: candidateData } = useQuery({
    queryKey: ['candidate', candidateId],
    queryFn: () => api.get(`/hiring/candidates/${candidateId}`).then(res => res.data)
  });

  useEffect(() => {
    if (editId && records.length > 0) {
      const recordToEdit = records.find((r: any) => r._id === editId);
      if (recordToEdit) {
        setFormData({
          candidateName: recordToEdit.candidateName || '',
          department: recordToEdit.department || '',
          position: recordToEdit.position || '',
          reportingTo: recordToEdit.reportingTo || '',
          joiningDate: recordToEdit.joiningDate ? recordToEdit.joiningDate.split('T')[0] : '',
          effectiveDate: recordToEdit.effectiveDate ? recordToEdit.effectiveDate.split('T')[0] : '',
        });
      }
    } else if (records.length > 0 && !editId) {
      // Intentionally leave blank for a new entry if no edit ID
    } else if (candidateData?.data) {
      const candidate = candidateData.data;
      setFormData((prev: any) => ({
        ...prev,
        candidateName: candidate.fullName || '',
        department: candidate.department || '',
        position: candidate.designation || candidate.position || '',
      }));
    }
  }, [editId, records, candidateData]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = { ...data, candidateId };
      if (editId) {
        return await api.put(`/hiring/team-intro/${editId}`, payload);
      } else if (records && records.length > 0 && records[0]._id) {
        return await api.put(`/hiring/team-intro/${records[0]._id}`, payload);
      }
      return await api.post('/hiring/team-intro', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hiring-step-records'] });
      queryClient.invalidateQueries({ queryKey: ['team-intro'] });
      toast.success('Team intro details saved successfully');
      router.push(`/dashboard/hiring/${candidateId}/steps/team-intro`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to save team intro details');
    }
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handlePrint = () => {
    let printId = editId;
    if (!printId && records.length > 0) {
      printId = records[0]._id;
    }
    if (printId) {
      router.push(`/dashboard/hiring/${candidateId}/print/team-intro?recordId=${printId}`);
    } else {
      toast.error('Please save the record first before printing.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      await api.delete(`/hiring/team-intro/${id}`);
      queryClient.invalidateQueries({ queryKey: ['team-intro'] });
      toast.success('Record deleted successfully');
      if (editId === id) {
        router.push(`/dashboard/hiring/${candidateId}/steps/team-intro`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete record');
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading...</div>;
  }

  return (
    <div className="page-container bg-slate-50/50 min-h-full pb-3">
      {/* <PageHeader
        title="TEAM INTRODUCTION NOTE"
        subtitle={`Candidate ID: ${candidateId}`}
        backButton={
          <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/hiring/${candidateId}/steps`)} className="mb-2 hover:bg-slate-200">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </Button>
        }
      /> */}

      <div className="section-card shadow-sm border-slate-200 overflow-hidden mb-2 max-w-5xl mx-auto">
        <div className="bg-slate-50 px-2 pt-2 border-b border-slate-200 flex items-center gap-1">
          <div className="flex items-center gap-2 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0d3c68] border-b-2 border-[#0d3c68] bg-white rounded-t-[4px]">
            <Users className="h-4 w-4" />
            TEAM INTRODUCTION RECORDS
          </div>
        </div>

        <div className="p-4 md:p-6 bg-white">
          <form onSubmit={onSubmit} className="space-y-6">

            {/* Section A: Employee Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2 uppercase tracking-wide">
                <span className="bg-[#0d3c68] text-white w-5 h-5 flex items-center justify-center text-[11px] rounded-full">
                  1
                </span>
                Employee Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Candidate / Employee Name <span className="text-red-500">*</span></label>
                  <Input
                    required
                    value={formData.candidateName}
                    onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                    placeholder="Mr. / Ms. Full Name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Position / Designation <span className="text-red-500">*</span></label>
                  <Select value={formData.position} onValueChange={(val) => setFormData({ ...formData, position: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Designation" />
                    </SelectTrigger>
                    <SelectContent>
                      {designations.map((des: any) => (
                        <SelectItem key={des._id || des.name} value={des.name || des.title || des.designationName || des.id}>{des.name || des.title || des.designationName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Department <span className="text-red-500">*</span></label>
                  <Select value={formData.department} onValueChange={(val) => setFormData({ ...formData, department: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept: any) => (
                        <SelectItem key={dept._id || dept.name} value={dept.name || dept.departmentName || dept.id}>{dept.name || dept.departmentName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Reporting To</label>
                  <Input
                    value={formData.reportingTo}
                    onChange={(e) => setFormData({ ...formData, reportingTo: e.target.value })}
                    placeholder="Enter Reporting Manager Name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Date of Joining <span className="text-red-500">*</span></label>
                  <Input
                    type="date"
                    required
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Effective Date</label>
                  <Input
                    type="date"
                    value={formData.effectiveDate}
                    onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <Button type="button" variant="outline" className="text-xs font-bold" onClick={() => router.push(`/dashboard/hiring/${candidateId}/steps`)}>
                CANCEL
              </Button>
              <Button type="button" variant="outline" className="text-xs font-bold flex items-center gap-2" onClick={handlePrint}>
                <Printer className="w-4 h-4" />
                PRINT NOTE
              </Button>
              <Button type="submit" disabled={saveMutation.isPending} className="text-xs font-bold bg-[#0d3c68] hover:bg-[#0a2e50] text-white">
                {saveMutation.isPending ? 'SAVING...' : editId ? 'UPDATE RECORD' : 'SAVE RECORD'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* List of existing records */}
      {records.length > 0 && !editId && (
        <div className="section-card shadow-sm border-slate-200 overflow-hidden mt-6 max-w-5xl mx-auto">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
            <h3 className="text-xs font-bold text-[#0d3c68] uppercase tracking-wider">Saved Records</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {records.map((record: any) => (
              <div key={record._id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <p className="font-bold text-sm text-slate-800">{record.candidateName}</p>
                  <p className="text-xs text-slate-500">{record.position} • {record.department}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => router.push(`/dashboard/hiring/${candidateId}/steps/team-intro?edit=${record._id}`)}>
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => router.push(`/dashboard/hiring/${candidateId}/print/team-intro?recordId=${record._id}`)}>
                    <Printer className="w-3.5 h-3.5 mr-1" />
                    Print
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(record._id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
