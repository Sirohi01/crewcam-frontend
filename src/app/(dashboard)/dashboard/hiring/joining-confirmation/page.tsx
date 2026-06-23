"use client";
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { FormField, FormInput, FormSelect } from '@/components/shared/FormComponents';
import { Save, RotateCcw, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';

export default function JoiningConfirmationPage() {
  const [showForm, setShowForm] = useState(false);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    candidateName: '',
    joiningDate: '',
    reportingTime: '',
    reportingLocation: '',
    confirmationStatus: 'Pending',
  });

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await api.get('/hiring/joining-confirmation');
      setRecords(res.data.data || []);
    } catch (err) {
      console.error('Error fetching joining confirmations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSave = async () => {
    try {
      await api.post('/hiring/joining-confirmation', formData);
      setShowForm(false);
      fetchRecords();
      setFormData({
        candidateName: '',
        joiningDate: '',
        reportingTime: '',
        reportingLocation: '',
        confirmationStatus: 'Pending',
      });
    } catch (err) {
      console.error('Error saving joining confirmation:', err);
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
    { key: 'position', label: 'Position', width: '180px' },
    {
      key: 'joiningDate',
      label: 'Joining Date',
      width: '120px',
      render: (val: any) => val ? new Date(val).toLocaleDateString('en-GB') : 'N/A'
    },
    { key: 'reportingTime', label: 'Reporting Time', width: '150px' },
    {
      key: 'status',
      label: 'Candidate Confirmation',
      width: '180px',
      align: 'center' as const,
      render: (val: any) => (
        <span className={cn(
          "px-2 py-1 text-[10px] font-bold rounded uppercase",
          val === 'Confirmed' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
        )}>
          {val || 'Pending'}
        </span>
      )
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
          {val ? new Date(val).toLocaleString('en-GB') : 'N/A'}
        </span>
      )
    },
  ];

  return (
    <div className="page-container bg-slate-50/50 min-h-full pb-2">
      <PageHeader
        title="JOINING CONFIRMATION"
        rightElement={
          !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#0d3c68] text-white px-4 py-2 text-xs font-bold rounded hover:bg-[#0a2e50]"
            >
              + Create Confirmation
            </button>
          )
        }
      />

      {showForm ? (
        <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-white px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-[13px] font-bold text-[#0d3c68] flex items-center gap-2 uppercase tracking-tight">
              <FileText className="h-4 w-4" />
              New Joining Confirmation
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Candidate Name:" required>
                  <FormInput 
                    value={formData.candidateName}
                    onChange={(e) => setFormData({...formData, candidateName: e.target.value})}
                    placeholder="Enter full name" 
                  />
                </FormField>
                <FormField label="Confirmed Joining Date:" required>
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
                    placeholder="Enter location address" 
                  />
                </FormField>
                <FormField label="Candidate Confirmation Status:" required>
                  <FormSelect 
                    value={formData.confirmationStatus}
                    onChange={(e) => setFormData({...formData, confirmationStatus: e.target.value})}
                    options={[{ label: 'Confirmed', value: 'Confirmed' }, { label: 'Pending', value: 'Pending' }, { label: 'Declined', value: 'Declined' }]} 
                    placeholder="Select Status" 
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
