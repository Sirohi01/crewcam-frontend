'use client';

import { useParams } from 'next/navigation';
import HiringStepPage from '@/components/hiring/HiringStepPage';
import InterviewEvaluationSheet from '@/components/hiring/InterviewEvaluationSheet';
import SelectionApprovalNote from '@/components/hiring/SelectionApprovalNote';
import CTCBreakupForm from '@/components/hiring/CTCBreakupForm';
import LetterOfIntentForm from '@/components/hiring/LetterOfIntentForm';
import JoiningConfirmationForm from '@/components/hiring/JoiningConfirmationForm';
import DocumentChecklistForm from '@/components/hiring/DocumentChecklistForm';
import BGVRequestForm from '@/components/hiring/BGVRequestForm';
import JoiningFormPage from '@/components/hiring/JoiningFormPage';
import NominationFormPage from '@/components/hiring/NominationFormPage';
import BankPayrollPage from '@/components/hiring/BankPayrollPage';
import EmergencyContactPage from '@/components/hiring/EmergencyContactPage';
import { ITPolicyPage, CodeOfConductPage } from '@/components/hiring/PolicyAcceptancePage';
import AppointmentLetterPage from '@/components/hiring/AppointmentLetterPage';
import AssetAccessPage from '@/components/hiring/AssetAccessPage';
import OfferLetterPage from '@/components/hiring/OfferLetterPage';
import NDAPage from '@/components/hiring/NDAPage';

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
  if (stepId === 'asset-access') return <AssetAccessPage candidateId={candidateId} />;
  if (stepId === 'offer-letter') return <OfferLetterPage candidateId={candidateId} />;
  if (stepId === 'nda') return <NDAPage candidateId={candidateId} />;

  // Existing dedicated pages
  if (stepId === 'evaluation') return <InterviewEvaluationSheet candidateId={candidateId} />;
  if (stepId === 'selection-approval') return <SelectionApprovalNote candidateId={candidateId} />;
  if (stepId === 'ctc-breakup') return <CTCBreakupForm candidateId={candidateId} />;
  if (stepId === 'loi') return <LetterOfIntentForm candidateId={candidateId} />;
  if (stepId === 'joining-confirmation') return <JoiningConfirmationForm candidateId={candidateId} />;
  if (stepId === 'doc-checklist') return <DocumentChecklistForm candidateId={candidateId} />;
  if (stepId === 'bgv') return <BGVRequestForm candidateId={candidateId} />;

  // Generic step page for remaining steps
  return <HiringStepPage candidateId={candidateId} stepId={stepId} />;
}
