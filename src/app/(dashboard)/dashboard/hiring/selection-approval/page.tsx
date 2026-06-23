"use client";
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { FormField, FormInput, FormSelect } from '@/components/shared/FormComponents';
import { Save, RotateCcw, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';

export default function SelectionApprovalPage() {
  const [showForm, setShowForm] = useState(false);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    candidateName: '',
    proposedPosition: '',
    recruitmentSource: '',
    proposedAnnualCTC: '',
    budgetedCTC: '',
    justification: '',
  });

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await api.get('/hiring/selection-approval');
      setRecords(res.data.data || []);
    } catch (err) {
      console.error('Error fetching selection approvals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSave = async () => {
    try {
      await api.post('/hiring/selection-approval', formData);
      setShowForm(false);
      fetchRecords();
      setFormData({
        candidateName: '',
        proposedPosition: '',
        recruitmentSource: '',
        proposedAnnualCTC: '',
        budgetedCTC: '',
        justification: '',
      });
    } catch (err) {
      console.error('Error saving selection approval:', err);
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
    { key: 'proposedPosition', label: 'Proposed Position', width: '180px' },
    { key: 'proposedAnnualCTC', label: 'Proposed CTC', width: '150px' },
    {
      key: 'decision',
      label: 'Approval Status',
      width: '120px',
      align: 'center' as const,
      render: (val: any) => (
        <span className={cn(
          "px-2 py-1 text-[10px] font-bold rounded uppercase",
          val === 'Approved' ? "bg-green-100 text-green-700" : val === 'Pending' ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
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
        title="SELECTION APPROVAL NOTE"
        rightElement={
          !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#0d3c68] text-white px-4 py-2 text-xs font-bold rounded hover:bg-[#0a2e50]"
            >
              + Create Approval Note
            </button>
          )
        }
      />

      {showForm ? (
        <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-white px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-[13px] font-bold text-[#0d3c68] flex items-center gap-2 uppercase tracking-tight">
              <FileText className="h-4 w-4" />
              New Selection Approval Note
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
                <FormField label="Proposed Position:" required>
                  <FormInput 
                    value={formData.proposedPosition}
                    onChange={(e) => setFormData({...formData, proposedPosition: e.target.value})}
                    placeholder="Designation" 
                  />
                </FormField>
                <FormField label="Recruitment Source:" required>
                  <FormSelect 
                    value={formData.recruitmentSource}
                    onChange={(e) => setFormData({...formData, recruitmentSource: e.target.value})}
                    options={[{ label: 'Direct', value: 'Direct' }, { label: 'Consultant', value: 'Consultant' }]} 
                    placeholder="Select Source" 
                  />
                </FormField>
                <FormField label="Proposed Annual CTC:" required>
                  <FormInput 
                    value={formData.proposedAnnualCTC}
                    onChange={(e) => setFormData({...formData, proposedAnnualCTC: e.target.value})}
                    placeholder="e.g. 15,00,000" 
                  />
                </FormField>
                <FormField label="Budgeted CTC:" required>
                  <FormInput 
                    value={formData.budgetedCTC}
                    onChange={(e) => setFormData({...formData, budgetedCTC: e.target.value})}
                    placeholder="e.g. 14,00,000" 
                  />
                </FormField>
                <FormField label="Justification for Variance:">
                  <FormInput 
                    value={formData.justification}
                    onChange={(e) => setFormData({...formData, justification: e.target.value})}
                    placeholder="Reasoning..." 
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
