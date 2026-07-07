'use client';

import { useParams } from 'next/navigation';
import HiringStepPage from '@/components/hiring/HiringStepPage';
import InterviewEvaluationSheet from '@/components/hiring/InterviewEvaluationSheet';
import JoiningFormPage from '@/components/hiring/JoiningFormPage';
import NominationFormPage from '@/components/hiring/NominationFormPage';
import BankPayrollPage from '@/components/hiring/BankPayrollPage';
import EmergencyContactPage from '@/components/hiring/EmergencyContactPage';
import { ITPolicyPage, CodeOfConductPage } from '@/components/hiring/PolicyAcceptancePage';
import AppointmentLetterPage from '@/components/hiring/AppointmentLetterPage';

export default function HiringStepRoutePage() {
  const params = useParams<{ candidateId: string; stepId: string }>();
  const { candidateId, stepId } = params;

  // WP3 dedicated pages
  if (stepId === 'joining-form') return <JoiningFormPage candidateId={candidateId} />;
  if (stepId === 'nomination') return <NominationFormPage candidateId={candidateId} />;
  if (stepId === 'bank-payroll') return <BankPayrollPage candidateId={candidateId} />;
  if (stepId === 'emergency-contact') return <EmergencyContactPage candidateId={candidateId} />;
  if (stepId === 'it-policy-accept') return <ITPolicyPage candidateId={candidateId} />;
  if (stepId === 'code-of-conduct-accept') return <CodeOfConductPage candidateId={candidateId} />;
  if (stepId === 'appointment-letter') return <AppointmentLetterPage candidateId={candidateId} />;

  // Existing dedicated pages
  if (stepId === 'evaluation') return <InterviewEvaluationSheet candidateId={candidateId} />;

  // Generic step page for remaining steps
  return <HiringStepPage candidateId={candidateId} stepId={stepId} />;
}
