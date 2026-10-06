'use client';

import CandidateRegister from '@/components/hiring/CandidateRegister';

export default function HODEvaluationPage() {
  return (
    <CandidateRegister
      defaultStatusFilter="HOD_APPROVAL"
      customTitle="HOD Evaluation Candidates"
      customSubtitle="Candidates waiting for Head of Department review and approval."
      customViewPath={(id: string) => `/dashboard/hiring/candidates/new/create/evaluation/${id}`}
      customEditPath={(id: string) => `/dashboard/hiring/candidates/new/create/evaluation/${id}`}
    />
  );
}
