'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CandidateWorkflow from '@/components/hiring/CandidateWorkflow';

export default function CandidateDetailPage() {
  const params = useParams<{ candidateId: string }>();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300 pb-6">
      <Button variant="ghost" className="w-fit text-xs h-7 px-2" onClick={() => router.push('/dashboard/hiring')}>
        <ArrowLeft size={14} className="mr-1" /> Back to Pipeline
      </Button>
      <CandidateWorkflow candidateId={params.candidateId} />
    </div>
  );
}
