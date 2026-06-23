"use client";
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { FormField, FormInput, FormSelect } from '@/components/shared/FormComponents';
import { Save, RotateCcw, FileText, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';

export default function Step5LOIPage() {
  const [showForm, setShowForm] = useState(false);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    candidateName: '',
    department: '',
    position: '',
    joiningDate: '',
    reportingLocation: '',
    reportingTo: '',
    reportingTime: '09:30',
  });

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await api.get('/hiring/loi');
      setRecords(res.data.data || []);
    } catch (err) {
      console.error('Error fetching LOI records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSave = async () => {
    try {
      await api.post('/hiring/loi', formData);
      setShowForm(false);
      fetchRecords();
      setFormData({
        candidateName: '',
        department: '',
        position: '',
        joiningDate: '',
        reportingLocation: '',
        reportingTo: '',
        reportingTime: '09:30',
      });
    } catch (err) {
      console.error('Error saving LOI:', err);
    }
  };

  const columns = [
    {
      key: 'sno',
      label: 'S.No',
      width: '60px',
      align: 'center' as const,
      render: (_: any, __: any, index: number) => (
        <span className="text-slate-500 font-medium">{index + 1}</span>
      )
    },
    { key: 'candidateName', label: 'Candidate Name', width: '200px' },
    { key: 'department', label: 'Department', width: '150px' },
    { key: 'position', label: 'Position', width: '180px' },
    {
      key: 'joiningDate',
      label: 'Joining Date',
      width: '120px',
      render: (val: any) => val ? new Date(val).toLocaleDateString('en-GB') : 'N/A'
    },
    {
      key: 'status',
      label: 'Status',
      width: '100px',
      align: 'center' as const,
      render: (val: any) => (
        <div className="relative inline-block w-[100px]">
          <select
            value={val}
            className={cn(
              "appearance-none cursor-pointer w-full pl-3 pr-7 py-1.5 rounded-[3px] text-[10px] font-bold uppercase tracking-wider transition-all border outline-none",
              val === 'active' || val === 'Issued'
                ? "bg-green-50/50 text-green-700 border-green-200 hover:bg-green-100"
                : "bg-red-50/50 text-red-700 border-red-200 hover:bg-red-100"
            )}
            onChange={(e) => {}}
          >
            <option value="Issued">ISSUED</option>
            <option value="Pending">PENDING</option>
            <option value="active">ACTIVE</option>
            <option value="inactive">INACTIVE</option>
          </select>
          <ChevronDown
            size={12}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none",
              val === 'active' || val === 'Issued' ? "text-green-700" : "text-red-700"
            )}
          />
        </div>
      ),
    },
    {
      key: 'createdBy',
      label: 'Created By',
      width: '120px',
      render: (val: any) => {
        const creatorName = typeof val === 'object' && val ? val.name || val.firstName : val;
        return <span className="text-red-600 font-bold text-[10px] uppercase truncate block">{creatorName || 'Admin'}</span>;
      }
    },
    {
      key: 'updatedAt',
      label: 'Last Update',
      width: '160px',
      render: (val: any) => (
        <span className="text-slate-500 font-medium text-[10px]">
          {val ? new Date(val).toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }).replace(',', '') : 'N/A'}
        </span>
      )
    },
  ];

  return (
    <div className="page-container bg-slate-50/50 min-h-full pb-2">
      <PageHeader
        prefix=""
        title="LETTER OF INTENT (LOI)"
        rightElement={
          !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#0d3c68] text-white px-4 py-2 text-xs font-bold rounded hover:bg-[#0a2e50]"
            >
              + Create LOI
            </button>
          )
        }
      />

      {showForm ? (
        <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-white px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-[13px] font-bold text-[#0d3c68] flex items-center gap-2 uppercase tracking-tight">
              <FileText className="h-4 w-4" />
              New Letter of Intent
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-[11px] font-bold text-red-500 hover:text-red-700 uppercase tracking-tight"
            >
              Cancel
            </button>
          </div>
          <div className="p-4">
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField label="Candidate Name:" required>
                  <FormInput 
                    value={formData.candidateName}
                    onChange={(e) => setFormData({...formData, candidateName: e.target.value})}
                    placeholder="Enter full name" 
                  />
                </FormField>
                <FormField label="Department:" required>
                  <FormInput 
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    placeholder="Department" 
                  />
                </FormField>
                <FormField label="Position Selected For:" required>
                  <FormInput 
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    placeholder="Designation" 
                  />
                </FormField>
                <FormField label="Proposed Joining Date:" required>
                  <FormInput 
                    type="date"
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({...formData, joiningDate: e.target.value})}
                  />
                </FormField>
                <FormField label="Reporting Time:" required>
                  <FormInput 
                    type="time" 
                    value={formData.reportingTime}
                    onChange={(e) => setFormData({...formData, reportingTime: e.target.value})}
                  />
                </FormField>
                <FormField label="Reporting Location:" required>
                  <FormInput 
                    value={formData.reportingLocation}
                    onChange={(e) => setFormData({...formData, reportingLocation: e.target.value})}
                    placeholder="Location" 
                  />
                </FormField>
                <FormField label="Reporting To:" required>
                  <FormInput 
                    value={formData.reportingTo}
                    onChange={(e) => setFormData({...formData, reportingTo: e.target.value})}
                    placeholder="Reporting Manager" 
                  />
                </FormField>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-[2px]"
                >
                  <RotateCcw className="h-4 w-4" /> RESET
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2 text-xs font-bold bg-[#0d3c68] text-white hover:bg-[#0a2e50] rounded-[2px]"
                >
                  <Save className="h-4 w-4" /> SAVE ENTRY
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <DataTable
          loading={loading}
          columns={columns}
          data={records}
          selectable
          showActions
          onEdit={() => {}}
          onDelete={() => {}}
          onView={() => {}}
        />
      )}
    </div>
  );
}
