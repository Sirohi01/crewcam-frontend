'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, AlertTriangle, Loader2, FileUp, FileCheck2, Star, CheckCircle2 } from 'lucide-react';
import api from '@/lib/axios';

interface ResumeScreening {
  _id: string;
  fitScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  experienceMatch: 'under' | 'match' | 'over';
  redFlags: string[];
  summary: string;
  pros: string[];
  cons: string[];
  starRating: number;
  status: 'completed' | 'failed';
  failureReason?: string;
  createdAt: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={14} className={n <= rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'} />
      ))}
    </div>
  );
}

const scoreColor = (score: number) =>
  score >= 70 ? 'text-emerald-600 bg-emerald-50' : score >= 40 ? 'text-amber-600 bg-amber-50' : 'text-rose-600 bg-rose-50';

export default function ResumeScreeningPanel({ candidateId, resumeUrl }: { candidateId: string; resumeUrl?: string }) {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const { data: screenings, error: screeningsError } = useQuery<ResumeScreening[]>({
    queryKey: ['resume-screenings', candidateId],
    queryFn: async () => (await api.get(`/ai/hiring/resume-screen/${candidateId}`)).data,
    enabled: !!candidateId,
  });

  const screenMutation = useMutation({
    mutationFn: async () => (await api.post(`/ai/hiring/resume-screen/${candidateId}`)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resume-screenings', candidateId] }),
  });

  const handleResumeSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const data = new FormData();
      data.append('file', file);
      const uploadRes = await api.post('/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      await api.put(`/hiring/candidates/${candidateId}/status`, { resumeUrl: uploadRes.data.url });
      queryClient.invalidateQueries({ queryKey: ['candidate', candidateId] });
    } catch (err: any) {
      setUploadError(err.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const latest = screenings && screenings.length > 0 ? screenings[0] : null;
  const errorMessage = (screenMutation.error as any)?.response?.data?.message
    || (screeningsError as any)?.response?.data?.message;

  return (
    <Card className="border-zinc-200/80 dark:border-zinc-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles size={15} className="text-indigo-600" /> AI Resume Screening
        </CardTitle>
        {resumeUrl && (
          <Button
            variant="outline"
            className="text-xs h-7 px-2.5"
            disabled={screenMutation.isPending}
            onClick={() => screenMutation.mutate()}
          >
            {screenMutation.isPending ? <Loader2 size={14} className="animate-spin mr-1" /> : <Sparkles size={14} className="mr-1" />}
            {latest ? 'Re-screen' : 'Screen Resume'}
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-[11px] text-zinc-500">
          Advisory only — this score never changes the candidate&apos;s status. HR makes the final call.
        </p>

        {!resumeUrl && (
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-2 w-full rounded-md border border-dashed border-zinc-300 px-3 py-2 text-sm cursor-pointer hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800/50">
              <FileUp size={15} className="text-zinc-400" />
              <span className="text-zinc-400">{uploading ? 'Uploading...' : 'No resume on file — choose a PDF or DOCX to attach...'}</span>
              <input type="file" accept=".pdf,.docx" className="hidden" onChange={handleResumeSelect} disabled={uploading} />
            </label>
            {uploadError && <p className="text-[11px] text-rose-600">{uploadError}</p>}
          </div>
        )}

        {resumeUrl && (
          <label className="flex items-center gap-2 text-[11px] text-zinc-400 cursor-pointer hover:text-zinc-600 w-fit">
            <FileCheck2 size={13} className="text-emerald-600" /> Resume attached — replace it
            <input type="file" accept=".pdf,.docx" className="hidden" onChange={handleResumeSelect} disabled={uploading} />
          </label>
        )}

        {errorMessage && (
          <div className="flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950/30">
            <AlertTriangle size={14} className="mt-0.5 shrink-0" /> {errorMessage}
          </div>
        )}

        {resumeUrl && !latest && !errorMessage && (
          <div className="py-6 text-center text-xs text-zinc-400 border border-dashed rounded-lg">
            No screening yet — click &quot;Screen Resume&quot; to run one.
          </div>
        )}

        {latest && latest.status === 'failed' && (
          <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-700 dark:border-amber-900 dark:bg-amber-950/30">
            <AlertTriangle size={14} className="mt-0.5 shrink-0" /> Screening failed: {latest.failureReason}
          </div>
        )}

        {latest && latest.status === 'completed' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row rounded-xl border border-slate-200 overflow-hidden shadow-sm dark:border-zinc-800">
              <div className={`flex flex-col items-center justify-center p-3 w-28 shrink-0 ${scoreColor(latest.fitScore)}`}>
                <span className="text-3xl font-extrabold tracking-tighter leading-none">{latest.fitScore}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider mt-1 opacity-80">Score</span>
              </div>
              
              <div className="flex flex-col justify-center gap-1.5 flex-1 p-3 bg-slate-50/50 dark:bg-zinc-900/50">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Overall Rating</span>
                  {latest.starRating != null && <StarRating rating={latest.starRating} />}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Experience Level</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    latest.experienceMatch === 'match' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 
                    latest.experienceMatch === 'over' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
                  }`}>
                    {latest.experienceMatch}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-indigo-50/50 p-3 border border-indigo-100/50 dark:bg-indigo-900/10 dark:border-indigo-900/20">
              <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed italic relative">
                <span className="text-4xl text-indigo-200 absolute -top-4 -left-2 leading-none font-serif">"</span>
                <span className="relative z-10 pl-4 block">{latest.summary}</span>
              </p>
            </div>

            {(latest.pros?.length > 0 || latest.cons?.length > 0) && (
              <div className="flex flex-col gap-3">
                {latest.pros?.length > 0 && (
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 dark:border-emerald-900/30 dark:bg-emerald-900/10">
                    <div className="flex items-center gap-2 mb-1.5">
                      <CheckCircle2 size={14} className="text-emerald-600" />
                      <h4 className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Strengths</h4>
                    </div>
                    <ul className="text-[11px] font-medium text-emerald-700 space-y-1 pl-5">
                      {latest.pros.map((p, i) => (
                        <li key={i} className="list-disc leading-tight">{p}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {latest.cons?.length > 0 && (
                  <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-3 dark:border-rose-900/30 dark:bg-rose-900/10">
                    <div className="flex items-center gap-2 mb-1.5">
                      <AlertTriangle size={14} className="text-rose-600" />
                      <h4 className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">Weaknesses</h4>
                    </div>
                    <ul className="text-[11px] font-medium text-rose-700 space-y-1 pl-5">
                      {latest.cons.map((c, i) => (
                        <li key={i} className="list-disc leading-tight">{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-2.5">
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Matched Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {latest.matchedSkills.map((s, i) => (
                    <span key={i} className="text-[11px] font-medium px-2 py-0.5 rounded text-emerald-700 bg-emerald-50 border border-emerald-200">{s}</span>
                  ))}
                  {latest.matchedSkills.length === 0 && <span className="text-xs text-slate-400 italic">None found</span>}
                </div>
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Missing Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {latest.missingSkills.map((s, i) => (
                    <span key={i} className="text-[11px] font-medium px-2 py-0.5 rounded text-slate-600 bg-slate-50 border border-slate-200">{s}</span>
                  ))}
                  {latest.missingSkills.length === 0 && <span className="text-xs text-slate-400 italic">None</span>}
                </div>
              </div>
            </div>

            {latest.redFlags.length > 0 && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 shadow-sm dark:border-red-900/30 dark:bg-red-900/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <AlertTriangle size={14} className="text-red-600" />
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-red-800">Red Flags</h4>
                </div>
                <ul className="text-[11px] font-medium text-red-700 space-y-1 pl-5">
                  {latest.redFlags.map((f, i) => (
                    <li key={i} className="list-disc leading-tight">{f}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {screenings && screenings.length > 1 && (
          <p className="text-[10px] text-zinc-400">{screenings.length - 1} earlier screening(s) on record.</p>
        )}
      </CardContent>
    </Card>
  );
}
