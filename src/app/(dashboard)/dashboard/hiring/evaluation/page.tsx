"use client";
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { FormField, FormInput, FormSelect } from '@/components/shared/FormComponents';
import { Save, RotateCcw, FileText, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';

export default function EvaluationPage() {
  const [showForm, setShowForm] = useState(false);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    candidateName: '',
    round: '',
    interviewer: '',
    score: '',
    strengths: '',
    areasOfImprovement: '',
    hrDecision: '',
  });

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await api.get('/hiring/evaluation');
      setRecords(res.data.data || []);
    } catch (err) {
      console.error('Error fetching evaluation records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSave = async () => {
    try {
      await api.post('/hiring/evaluation', formData);
      setShowForm(false);
      fetchRecords();
      setFormData({
        candidateName: '',
        round: '',
        interviewer: '',
        score: '',
        strengths: '',
        areasOfImprovement: '',
        hrDecision: '',
      });
    } catch (err) {
      console.error('Error saving evaluation:', err);
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
    { key: 'round', label: 'Interview Round', width: '150px' },
    { key: 'interviewer', label: 'Interviewer', width: '150px' },
    { key: 'score', label: 'Score', width: '100px', align: 'center' as const },
    {
      key: 'decision',
      label: 'Decision',
      width: '120px',
      align: 'center' as const,
      render: (val: any) => (
        <span className={cn(
          "px-2 py-1 text-[10px] font-bold rounded uppercase",
          val === 'Selected' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
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
        title="INTERVIEW EVALUATION SHEET"
        rightElement={
          !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#0d3c68] text-white px-4 py-2 text-xs font-bold rounded hover:bg-[#0a2e50]"
            >
              + Create Evaluation
            </button>
          )
        }
      />

      {showForm ? (
        <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-white px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-[13px] font-bold text-[#0d3c68] flex items-center gap-2 uppercase tracking-tight">
              <FileText className="h-4 w-4" />
              New Evaluation
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
                <FormField label="Interview Round:" required>
                  <FormSelect 
                    value={formData.round}
                    onChange={(e) => setFormData({...formData, round: e.target.value})}
                    options={[{ label: 'Technical', value: 'Technical' }, { label: 'HR', value: 'HR' }]} 
                    placeholder="Select Round" 
                  />
                </FormField>
                <FormField label="Interviewer:" required>
                  <FormInput 
                    value={formData.interviewer}
                    onChange={(e) => setFormData({...formData, interviewer: e.target.value})}
                    placeholder="Interviewer Name" 
                  />
                </FormField>
                <FormField label="Competency Score:" required>
                  <FormInput 
                    value={formData.score}
                    onChange={(e) => setFormData({...formData, score: e.target.value})}
                    placeholder="e.g. 8/10" 
                  />
                </FormField>
                <FormField label="Strengths:">
                  <FormInput 
                    value={formData.strengths}
                    onChange={(e) => setFormData({...formData, strengths: e.target.value})}
                    placeholder="Key strengths" 
                  />
                </FormField>
                <FormField label="Areas of Improvement:">
                  <FormInput 
                    value={formData.areasOfImprovement}
                    onChange={(e) => setFormData({...formData, areasOfImprovement: e.target.value})}
                    placeholder="Improvement areas" 
                  />
                </FormField>
                <FormField label="HR Decision:" required>
                  <FormSelect 
                    value={formData.hrDecision}
                    onChange={(e) => setFormData({...formData, hrDecision: e.target.value})}
                    options={[{ label: 'Selected', value: 'Selected' }, { label: 'Rejected', value: 'Rejected' }, { label: 'Hold', value: 'Hold' }]} 
                    placeholder="Select Decision" 
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
