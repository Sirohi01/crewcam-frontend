'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, MinusSquare, X, Plus, Star, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCandidate } from './layout';
import { CircularProgress } from './CircularProgress';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';

export default function HODReviewTab() {
  const { candidate } = useCandidate();
  const [recommendation, setRecommendation] = useState<string | null>('Strongly Recommend');
  const [rating, setRating] = useState(4);

  const params = useParams() as { id: string };
  const candidateId = params?.id;
  const router = useRouter();

  const [strengths, setStrengths] = React.useState(['Relevant Experience', 'Sales Strategy', 'Client Relationship', 'Leadership Skills']);
  const [concerns, setConcerns] = React.useState(['Advanced Data Analytics', 'PPC / Google Ads']);

  const [isAddingStrength, setIsAddingStrength] = React.useState(false);
  const [newStrength, setNewStrength] = React.useState('');

  const [isAddingConcern, setIsAddingConcern] = React.useState(false);
  const [newConcern, setNewConcern] = React.useState('');

  const handleAddStrength = () => {
    if (newStrength.trim()) {
      setStrengths([...strengths, newStrength.trim()]);
      setNewStrength('');
      setIsAddingStrength(false);
    }
  };

  const handleAddConcern = () => {
    if (newConcern.trim()) {
      setConcerns([...concerns, newConcern.trim()]);
      setNewConcern('');
      setIsAddingConcern(false);
    }
  };

  const removeStrength = (s: string) => setStrengths(strengths.filter(item => item !== s));
  const removeConcern = (c: string) => setConcerns(concerns.filter(item => item !== c));

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitEvaluation = async () => {
    try {
      setIsSubmitting(true);
      
      let newStatus = 'Interviewing';
      if (recommendation === 'Hold / Consider') newStatus = 'Hold';
      if (recommendation === 'Not Recommended') newStatus = 'Rejected';

      await api.put(`/hiring/candidates/${candidateId}/status`, { 
        status: newStatus,
        rating: rating,
        comments: `Strengths: ${strengths.join(', ')}\nConcerns: ${concerns.join(', ')}` 
      });

      toast.success(`Candidate marked as ${newStatus}`);

      // Routing
      if (newStatus === 'Interviewing') {
        router.push(`/dashboard/hiring/candidates/new/create/interview-process/${candidateId}`);
      } else {
        router.push(`/dashboard/all-candidates?status=${newStatus}`);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to submit evaluation');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!candidate) return null;

  return (
    <>
      <div className="xl:col-span-8 flex flex-col gap-3 h-full">
        <Card className="border-zinc-200/80 shadow-sm rounded-xl h-full flex flex-col justify-between">
          <CardContent className="p-4 flex flex-col h-full">
            <h3 className="text-[15px] font-bold text-zinc-900 mb-1">HOD Evaluation</h3>
            <p className="text-[12px] font-medium text-zinc-500 mb-3">Please evaluate the candidate based on the role requirements and AI screening report.</p>

            {/* Recommendation */}
            <div className="mb-3">
              <label className="text-[12px] font-bold text-zinc-900 flex items-center gap-1 mb-2">
                Overall Recommendation <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                {[
                  { id: 'Strongly Recommend', icon: <ThumbsUp className="w-5 h-5 mb-2" />, desc: 'Excellent fit for the role', color: 'emerald' },
                  { id: 'Recommend', icon: <ThumbsUp className="w-5 h-5 mb-2" />, desc: 'Good fit for the role', color: 'blue' },
                  { id: 'Hold / Consider', icon: <MinusSquare className="w-5 h-5 mb-2" />, desc: 'May fit, need more evaluation', color: 'amber' },
                  { id: 'Not Recommended', icon: <ThumbsDown className="w-5 h-5 mb-2" />, desc: 'Not a good fit', color: 'rose' },
                ].map((rec) => {
                  const isSel = recommendation === rec.id;
                  return (
                    <button key={rec.id} onClick={() => setRecommendation(rec.id)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all h-[105px]
                    ${isSel
                          ? `border-${rec.color}-200 bg-${rec.color}-50/50 shadow-sm ring-1 ring-${rec.color}-500/20`
                          : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 bg-white shadow-sm'}`}>
                      <div className={`${isSel ? `text-${rec.color}-600` : 'text-zinc-400'}`}>
                        {rec.icon}
                      </div>
                      <span className={`text-[10px] xl:text-[11px] font-bold mb-1 leading-tight ${isSel ? `text-${rec.color}-700` : 'text-zinc-700'}`}>{rec.id}</span>
                      <span className={`text-[9px] xl:text-[10px] font-medium leading-tight px-1 ${isSel ? `text-${rec.color}-600/80` : 'text-zinc-500'}`}>{rec.desc}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Strengths */}
            <div className="mb-3">
              <label className="text-[12px] font-bold text-zinc-900 mb-2 block">Strengths <span className="font-medium text-zinc-500">(What did you like?)</span></label>
              <div className="flex flex-wrap items-center gap-2">
                {strengths.map(s => (
                  <div key={s} className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-md">
                    {s}
                    <X className="w-3 h-3 cursor-pointer hover:text-emerald-900 opacity-70" onClick={() => removeStrength(s)} />
                  </div>
                ))}
                {isAddingStrength ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={newStrength}
                      onChange={e => setNewStrength(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddStrength()}
                      placeholder="Add strength..."
                      autoFocus
                      className="text-[11px] px-2 py-1 rounded-md border border-zinc-200 focus:outline-none focus:border-indigo-400"
                    />
                    <button onClick={handleAddStrength} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-[11px] font-bold hover:bg-indigo-100 transition-colors">Add</button>
                    <button onClick={() => { setIsAddingStrength(false); setNewStrength(''); }} className="bg-zinc-50 text-zinc-600 px-2 py-1 rounded-md text-[11px] font-bold hover:bg-zinc-100 transition-colors">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setIsAddingStrength(true)} className="flex items-center gap-1 bg-white border border-dashed border-zinc-300 text-zinc-600 hover:text-indigo-600 hover:border-indigo-300 text-[11px] font-bold px-3 py-1 rounded-md transition-colors shadow-sm">
                    <Plus className="w-3 h-3" /> Add
                  </button>
                )}
              </div>
            </div>

            {/* Areas of Concern */}
            <div className="mb-3">
              <label className="text-[12px] font-bold text-zinc-900 mb-2 block">Areas of Concern</label>
              <div className="flex flex-wrap items-center gap-2">
                {concerns.map(c => (
                  <div key={c} className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/60 text-amber-700 text-[11px] font-bold px-2.5 py-1 rounded-md">
                    {c}
                    <X className="w-3 h-3 cursor-pointer hover:text-amber-900 opacity-70" onClick={() => removeConcern(c)} />
                  </div>
                ))}
                {isAddingConcern ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={newConcern}
                      onChange={e => setNewConcern(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddConcern()}
                      placeholder="Add concern..."
                      autoFocus
                      className="text-[11px] px-2 py-1 rounded-md border border-zinc-200 focus:outline-none focus:border-amber-400"
                    />
                    <button onClick={handleAddConcern} className="bg-amber-50 text-amber-700 px-2 py-1 rounded-md text-[11px] font-bold hover:bg-amber-100 transition-colors">Add</button>
                    <button onClick={() => { setIsAddingConcern(false); setNewConcern(''); }} className="bg-zinc-50 text-zinc-600 px-2 py-1 rounded-md text-[11px] font-bold hover:bg-zinc-100 transition-colors">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setIsAddingConcern(true)} className="flex items-center gap-1 bg-white border border-dashed border-zinc-300 text-zinc-600 hover:text-amber-600 hover:border-amber-300 text-[11px] font-bold px-3 py-1 rounded-md transition-colors shadow-sm">
                    <Plus className="w-3 h-3" /> Add
                  </button>
                )}
              </div>
            </div>

            {/* Comments */}
            <div className="mb-3">
              <label className="text-[12px] font-bold text-zinc-900 flex items-center gap-1 mb-2">
                Comments <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  className="w-full h-[120px] rounded-xl border border-zinc-200 p-3.5 text-[13px] font-medium text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all resize-none shadow-sm"
                  defaultValue={`${candidate.fullName} has strong experience and good domain knowledge. Proven track record in achieving targets.\n\nWill be a good addition to the team.`}
                />
                <div className="absolute bottom-3 right-3 text-[10px] font-bold text-zinc-400">187/1000</div>
              </div>
            </div>

            {/* Rating */}
            <div className="mb-4 flex items-center gap-3">
              <label className="text-[12px] font-bold text-zinc-900">Rating <span className="font-medium text-zinc-500">(Optional)</span></label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`w-4 h-4 cursor-pointer transition-colors ${star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-zinc-100 text-zinc-200 hover:fill-amber-200 hover:text-amber-200'}`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
              <span className="text-[11px] font-bold text-zinc-500">{rating}/5</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 lg:gap-4 pt-5 mt-auto border-t border-zinc-100">
              <Button onClick={handleSubmitEvaluation} disabled={isSubmitting} className="h-7 lg:h-8 px-2 lg:px-4 text-[10px] lg:text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm whitespace-nowrap">
                {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null} Submit Evaluation & Proceed
              </Button>
              <Button variant="outline" onClick={() => router.push(`/dashboard/hiring/candidates/new/create/ai-screening-application-evaluation/${candidateId}`)} className="h-7 lg:h-8 px-2 lg:px-4 text-[10px] lg:text-[11px] font-semibold text-indigo-700 border-indigo-200 hover:bg-indigo-50 rounded-md shadow-sm whitespace-nowrap">
                Send Back to AI Screening
              </Button>
            </div>

          </CardContent>
        </Card>
      </div>

      <div className="xl:col-span-4 flex flex-col gap-3">
        {/* AI Screening Summary (Combined Card) */}
        <Card className="border-zinc-200/80 shadow-sm rounded-xl">
          <CardHeader className="px-5 py-3.5 border-b border-zinc-100 bg-zinc-50/50 rounded-t-xl">
            <CardTitle className="text-[13px] font-bold text-zinc-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" /> AI Screening Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">

            {/* Top Section: Circle (Left) & Stats (Right) */}
            <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-4 mb-3">
              {/* Left: Circle */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <CircularProgress percentage={87} colorClass="text-emerald-500" textClass="text-emerald-600" />
                <p className="text-center text-[11px] font-bold text-emerald-600 mt-2">Good Match</p>
              </div>

              {/* Right: Stats List */}
              <div className="flex-1 space-y-2.5 flex flex-col justify-center">
                {[
                  { label: 'Skills Match', val: 90 },
                  { label: 'Experience Match', val: 85 },
                  { label: 'Education Match', val: 80 },
                  { label: 'CTC Compatibility', val: 75 },
                ].map(m => (
                  <div key={m.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="text-[10px] font-bold text-zinc-600">{m.label}</span>
                    </div>
                    <span className="text-[10px] font-bold text-zinc-700">{m.val}%</span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 mt-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-[11px] font-bold text-zinc-900">Overall Profile Match</span>
                  </div>
                  <span className="text-[11px] font-bold text-zinc-900">87%</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-[1px] bg-zinc-100 w-full mb-5"></div>

            {/* Key Matched Skills Section */}
            <div>
              <h4 className="text-[12px] font-bold text-zinc-900 mb-3">Key Matched Skills</h4>
              <div className="flex flex-col gap-3">
                {[
                  'Sales Strategy', 'Team Leadership', 'Client Relationship Management',
                  'Business Development', 'CRM'
                ].map(s => (
                  <div key={s} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-[1px]" />
                    <span className="text-[11px] font-bold text-zinc-700 leading-tight">{s}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link href="#" className="text-[11px] font-bold text-indigo-600 hover:underline">View All Skills (12)</Link>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Missing / To Improve */}
        <Card className="border-zinc-200/80 shadow-sm rounded-xl">
          <CardHeader className="px-4 py-3 border-b border-zinc-100 bg-zinc-50/50 rounded-t-xl">
            <CardTitle className="text-[13px] font-bold text-zinc-900">Missing / To Improve</CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex flex-col gap-3.5">
            {[
              'Advanced Data Analytics', 'PPC / Google Ads', 'Digital Marketing', 'Salesforce Automation'
            ].map(s => (
              <div key={s} className="flex items-start gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-rose-500 flex items-center justify-center shrink-0 mt-[1px]">
                  <div className="w-1 h-1 bg-rose-500 rounded-full"></div>
                </div>
                <span className="text-[11px] font-bold text-zinc-700 leading-tight">{s}</span>
              </div>
            ))}
            <div className="mt-2">
              <Link href="#" className="text-[11px] font-bold text-indigo-600 hover:underline">View Improvement Tips</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
