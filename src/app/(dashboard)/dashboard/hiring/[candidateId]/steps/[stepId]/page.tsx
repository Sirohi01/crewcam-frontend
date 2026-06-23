'use client';

import { useParams } from 'next/navigation';
import HiringStepPage from '@/components/hiring/HiringStepPage';
import InterviewEvaluationSheet from '@/components/hiring/InterviewEvaluationSheet';

export default function HiringStepRoutePage() {
  const params = useParams<{ candidateId: string; stepId: string }>();
  if (params.stepId === 'evaluation') return <InterviewEvaluationSheet candidateId={params.candidateId} />;
  return <HiringStepPage candidateId={params.candidateId} stepId={params.stepId} />;
}
