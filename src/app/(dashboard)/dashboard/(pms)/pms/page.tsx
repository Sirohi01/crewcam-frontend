'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Target, Star, CheckCircle, FileSignature } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';

export default function PMSPage() {
  const token = useAuthStore(state => state.token);
  const user = useAuthStore(state => state.user);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'my-appraisals' | 'team-appraisals' | 'kras'>('my-appraisals');

  // Queries
  const { data: myAppraisals, isLoading: isMyLoading } = useQuery({
    queryKey: ['my-appraisals'],
    queryFn: async () => {
      const res = await fetch('http://localhost:8000/api/v1/pms/appraisals/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch my appraisals');
      return res.json();
    },
    enabled: !!token && activeTab === 'my-appraisals'
  });

  const { data: teamAppraisals, isLoading: isTeamLoading } = useQuery({
    queryKey: ['team-appraisals'],
    queryFn: async () => {
      const res = await fetch('http://localhost:8000/api/v1/pms/appraisals/team', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch team appraisals');
      return res.json();
    },
    enabled: !!token && activeTab === 'team-appraisals'
  });

  const { data: kras, isLoading: isKrasLoading } = useQuery({
    queryKey: ['kras'],
    queryFn: async () => {
      const res = await fetch('http://localhost:8000/api/v1/pms/kras/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch KRAs');
      return res.json();
    },
    enabled: !!token && activeTab === 'kras'
  });

  // Mutations
  const submitAppraisalMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch('http://localhost:8000/api/v1/pms/appraisals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to submit appraisal');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-appraisals'] });
      alert('Self appraisal submitted successfully');
      setAppraisalForm({ cycle: 'Q1 2026', selfRating: 5, selfComments: '' });
    }
  });

  const reviewAppraisalMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string, payload: any }) => {
      const res = await fetch(`http://localhost:8000/api/v1/pms/appraisals/${id}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to review appraisal');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-appraisals'] });
      alert('Appraisal reviewed successfully');
    }
  });

  const [appraisalForm, setAppraisalForm] = useState({ cycle: 'Q1 2026', selfRating: 5, selfComments: '' });

  const handleSelfSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitAppraisalMutation.mutate(appraisalForm);
  };

  const handleReview = (id: string, action: 'hod' | 'hr') => {
    const rating = prompt(`Enter ${action.toUpperCase()} Rating (1-5):`);
    const comments = prompt(`Enter ${action.toUpperCase()} Comments:`);
    if (rating && comments) {
      const payload = action === 'hod'
        ? { hodRating: Number(rating), hodComments: comments, status: 'HOD_Reviewed' }
        : { hrRating: Number(rating), hrComments: comments, status: 'HR_Finalized' };
      reviewAppraisalMutation.mutate({ id, payload });
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300 pb-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Performance Management</h1>
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-md">Appraisals, KRAs & KPIs</p>
        </div>
        <div className="flex bg-zinc-100 p-1 rounded-md dark:bg-zinc-800">
          <button
            onClick={() => setActiveTab('my-appraisals')}
            className={`px-3 py-1 text-xs font-md rounded ${activeTab === 'my-appraisals' ? 'bg-white shadow text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            My Appraisals
          </button>
          <button
            onClick={() => setActiveTab('kras')}
            className={`px-3 py-1 text-xs font-md rounded ${activeTab === 'kras' ? 'bg-white shadow text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            My KRAs
          </button>
          {(user as any)?.role !== 'Employee' && (
            <button
              onClick={() => setActiveTab('team-appraisals')}
              className={`px-3 py-1 text-xs font-md rounded ${activeTab === 'team-appraisals' ? 'bg-white shadow text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              Team Reviews
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'my-appraisals' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-md flex items-center gap-2">
                    <FileSignature size={16} className="text-indigo-600" />
                    Submit Self Appraisal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSelfSubmit} className="flex flex-col gap-4">
                    <div>
                      <label className="text-xs font-md text-zinc-700 mb-1 block">Appraisal Cycle</label>
                      <input required type="text" value={appraisalForm.cycle} onChange={e => setAppraisalForm({ ...appraisalForm, cycle: e.target.value })} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" placeholder="e.g. Q1 2026" />
                    </div>
                    <div>
                      <label className="text-xs font-md text-zinc-700 mb-1 block">Self Rating (1-5)</label>
                      <input required type="number" min="1" max="5" value={appraisalForm.selfRating} onChange={e => setAppraisalForm({ ...appraisalForm, selfRating: Number(e.target.value) })} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-md text-zinc-700 mb-1 block">Self Evaluation Comments</label>
                      <textarea required rows={4} value={appraisalForm.selfComments} onChange={e => setAppraisalForm({ ...appraisalForm, selfComments: e.target.value })} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm resize-none" placeholder="Highlight your achievements..." />
                    </div>
                    <Button type="submit" disabled={submitAppraisalMutation.isPending} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                      {submitAppraisalMutation.isPending ? 'Submitting...' : 'Submit Appraisal'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 h-full">
                <CardHeader>
                  <CardTitle className="text-md flex items-center gap-2">
                    <CheckCircle size={16} className="text-emerald-600" />
                    My Appraisal History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isMyLoading ? (
                    <div className="py-4 text-center text-sm text-zinc-500">Loading...</div>
                  ) : myAppraisals?.length === 0 ? (
                    <div className="py-8 text-center text-sm text-zinc-500 border border-dashed rounded-lg">No past appraisals found.</div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {myAppraisals?.map((app: any) => (
                        <div key={app._id} className="border rounded-lg p-4 bg-zinc-50 dark:bg-zinc-800/50">
                          <div className="flex justify-between items-center border-b pb-2 mb-2 border-zinc-200 dark:border-zinc-700">
                            <span className="font-md text-zinc-900 dark:text-zinc-100">{app.cycle}</span>
                            <span className={`text-[10px] font-md px-2 py-0.5 rounded-full ${app.status === 'HR_Finalized' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                              {app.status.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-2 bg-white rounded shadow-sm border border-zinc-100">
                              <div className="text-[10px] uppercase text-zinc-500 font-md mb-1">Self Rating</div>
                              <div className="text-xl font-black text-indigo-600">{app.selfRating}/5</div>
                            </div>
                            <div className="text-center p-2 bg-white rounded shadow-sm border border-zinc-100">
                              <div className="text-[10px] uppercase text-zinc-500 font-md mb-1">HOD Rating</div>
                              <div className="text-xl font-black text-blue-600">{app.hodRating ? `${app.hodRating}/5` : '-'}</div>
                            </div>
                            <div className="text-center p-2 bg-white rounded shadow-sm border border-zinc-100">
                              <div className="text-[10px] uppercase text-zinc-500 font-md mb-1">HR Rating</div>
                              <div className="text-xl font-black text-emerald-600">{app.hrRating ? `${app.hrRating}/5` : '-'}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'team-appraisals' && (
          <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-md flex items-center gap-2">
                <Star size={16} className="text-amber-500" />
                Team Appraisals Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isTeamLoading ? (
                <div className="py-4 text-center text-sm text-zinc-500">Loading...</div>
              ) : teamAppraisals?.length === 0 ? (
                <div className="py-8 text-center text-sm text-zinc-500 border border-dashed rounded-lg">No pending team appraisals.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500">
                      <tr>
                        <th className="p-3 font-md text-xs uppercase">Employee</th>
                        <th className="p-3 font-md text-xs uppercase">Cycle</th>
                        <th className="p-3 font-md text-xs uppercase">Self Rating</th>
                        <th className="p-3 font-md text-xs uppercase">Status</th>
                        <th className="p-3 font-md text-xs uppercase text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {teamAppraisals?.map((app: any) => (
                        <tr key={app._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                          <td className="p-3 font-medium text-zinc-900 dark:text-zinc-100">
                            {app.employeeId?.firstName} {app.employeeId?.lastName}
                          </td>
                          <td className="p-3 text-zinc-600">{app.cycle}</td>
                          <td className="p-3">
                            <span className="font-md text-indigo-600">{app.selfRating}/5</span>
                          </td>
                          <td className="p-3">
                            <span className="text-[10px] font-md px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                              {app.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            {app.status === 'Self_Submitted' && (
                              <Button size="sm" variant="outline" className="text-xs h-7 mr-2" onClick={() => handleReview(app._id, 'hod')}>
                                HOD Review
                              </Button>
                            )}
                            {app.status === 'HOD_Reviewed' && (
                              <Button size="sm" className="text-xs h-7 bg-emerald-600 hover:bg-emerald-700" onClick={() => handleReview(app._id, 'hr')}>
                                HR Finalize
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'kras' && (
          <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-md flex items-center gap-2">
                <Target size={16} className="text-blue-600" />
                My Key Result Areas (KRAs)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isKrasLoading ? (
                <div className="py-4 text-center text-sm text-zinc-500">Loading...</div>
              ) : kras?.length === 0 ? (
                <div className="py-8 text-center text-sm text-zinc-500 border border-dashed rounded-lg">No KRAs assigned yet.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {kras?.map((kra: any) => (
                    <div key={kra._id} className="border border-blue-100 rounded-lg p-4 bg-blue-50/30 dark:bg-zinc-800/50">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-md text-zinc-900 dark:text-zinc-100">{kra.title}</h3>
                        <span className="text-[10px] font-md px-2 py-0.5 rounded bg-blue-100 text-blue-800">{kra.weightage}% Weight</span>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-4">{kra.description}</p>

                      <div className="space-y-3">
                        <h4 className="text-[10px] font-md uppercase tracking-wider text-zinc-500">Key Performance Indicators</h4>
                        {kra.kpis?.map((kpi: any, idx: number) => {
                          const progress = Math.min(100, (kpi.achieved / kpi.target) * 100);
                          return (
                            <div key={idx} className="bg-white dark:bg-zinc-900 p-2 rounded border border-zinc-100 dark:border-zinc-800">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="font-medium text-zinc-800 dark:text-zinc-200">{kpi.title}</span>
                                <span className="text-zinc-500">{kpi.achieved} / {kpi.target} {kpi.unit}</span>
                              </div>
                              <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${progress >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
