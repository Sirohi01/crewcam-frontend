"use client";
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { FormField, FormInput, FormSelect } from '@/components/shared/FormComponents';
import { Save, RotateCcw, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';

export default function CTCBreakupPage() {
  const [showForm, setShowForm] = useState(false);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    candidateName: '',
    department: '',
    annualCTC: '',
    monthlyBasic: '',
    hra: '',
    specialAllowance: '',
    pfDeduction: '',
    netTakeHome: '',
  });

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await api.get('/hiring/ctc-breakup');
      setRecords(res.data.data || []);
    } catch (err) {
      console.error('Error fetching CTC breakups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSave = async () => {
    try {
      await api.post('/hiring/ctc-breakup', formData);
      setShowForm(false);
      fetchRecords();
      setFormData({
        candidateName: '',
        department: '',
        annualCTC: '',
        monthlyBasic: '',
        hra: '',
        specialAllowance: '',
        pfDeduction: '',
        netTakeHome: '',
      });
    } catch (err) {
      console.error('Error saving CTC breakup:', err);
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
    { key: 'annualCTC', label: 'Annual CTC', width: '150px' },
    { key: 'netTakeHome', label: 'Monthly Take Home', width: '150px' },
    {
      key: 'status',
      label: 'Status',
      width: '120px',
      align: 'center' as const,
      render: (val: any) => (
        <span className={cn(
          "px-2 py-1 text-[10px] font-bold rounded uppercase",
          val === 'Approved' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
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
        title="CTC BREAKUP"
        rightElement={
          !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#0d3c68] text-white px-4 py-2 text-xs font-bold rounded hover:bg-[#0a2e50]"
            >
              + Create CTC
            </button>
          )
        }
      />

      {showForm ? (
        <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-white px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-[13px] font-bold text-[#0d3c68] flex items-center gap-2 uppercase tracking-tight">
              <FileText className="h-4 w-4" />
              New CTC Breakup
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
                <FormField label="Annual CTC:" required>
                  <FormInput 
                    value={formData.annualCTC}
                    onChange={(e) => setFormData({...formData, annualCTC: e.target.value})}
                    placeholder="e.g. 15,00,000" 
                  />
                </FormField>
                <FormField label="Monthly Basic:" required>
                  <FormInput 
                    value={formData.monthlyBasic}
                    onChange={(e) => setFormData({...formData, monthlyBasic: e.target.value})}
                    placeholder="e.g. 50,000" 
                  />
                </FormField>
                <FormField label="HRA:" required>
                  <FormInput 
                    value={formData.hra}
                    onChange={(e) => setFormData({...formData, hra: e.target.value})}
                    placeholder="e.g. 25,000" 
                  />
                </FormField>
                <FormField label="Special Allowance:" required>
                  <FormInput 
                    value={formData.specialAllowance}
                    onChange={(e) => setFormData({...formData, specialAllowance: e.target.value})}
                    placeholder="e.g. 40,000" 
                  />
                </FormField>
                <FormField label="PF Deduction:" required>
                  <FormInput 
                    value={formData.pfDeduction}
                    onChange={(e) => setFormData({...formData, pfDeduction: e.target.value})}
                    placeholder="e.g. 1,800" 
                  />
                </FormField>
                <FormField label="Net Take Home:" required>
                  <FormInput 
                    value={formData.netTakeHome}
                    onChange={(e) => setFormData({...formData, netTakeHome: e.target.value})}
                    placeholder="e.g. 1,12,500" 
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
