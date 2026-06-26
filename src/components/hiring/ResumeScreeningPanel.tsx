'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, AlertTriangle, Loader2, FileUp, FileCheck2, Star } from 'lucide-react';
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
            <div className="flex items-center gap-3">
              <span className={`text-lg font-md px-3 py-1 rounded-md ${scoreColor(latest.fitScore)}`}>{latest.fitScore}/100</span>
              {latest.starRating != null && <StarRating rating={latest.starRating} />}
              <span className="text-xs text-zinc-500">Experience: {latest.experienceMatch}</span>
            </div>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">{latest.summary}</p>
            {(latest.pros?.length > 0 || latest.cons?.length > 0) && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] font-md uppercase tracking-wide text-zinc-400 mb-1">Pros</div>
                  <ul className="text-xs text-emerald-700 list-disc pl-4 space-y-0.5">
                    {(latest.pros || []).map((p) => <li key={p}>{p}</li>)}
                  </ul>
                </div>
                <div>
                  <div className="text-[10px] font-md uppercase tracking-wide text-zinc-400 mb-1">Cons</div>
                  <ul className="text-xs text-rose-700 list-disc pl-4 space-y-0.5">
                    {(latest.cons || []).map((c) => <li key={c}>{c}</li>)}
                  </ul>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] font-md uppercase tracking-wide text-zinc-400 mb-1">Matched Skills</div>
                <div className="flex flex-wrap gap-1">
                  {latest.matchedSkills.map((s) => (
                    <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-md uppercase tracking-wide text-zinc-400 mb-1">Missing Skills</div>
                <div className="flex flex-wrap gap-1">
                  {latest.missingSkills.map((s) => (
                    <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">{s}</span>
                  ))}
                </div>
              </div>
            </div>
            {latest.redFlags.length > 0 && (
              <div>
                <div className="text-[10px] font-md uppercase tracking-wide text-zinc-400 mb-1">Red Flags</div>
                <ul className="text-xs text-rose-600 list-disc pl-4">
                  {latest.redFlags.map((f) => <li key={f}>{f}</li>)}
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
