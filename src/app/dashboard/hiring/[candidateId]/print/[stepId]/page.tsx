'use client';

import { useParams } from 'next/navigation';
import PrintLayout from '@/components/print/PrintLayout';

// Templates
import CTCBreakupTemplate from '@/components/print/templates/CTCBreakupTemplate';
import LOITemplate from '@/components/print/templates/LOITemplate';
import OfferLetterTemplate from '@/components/print/templates/OfferLetterTemplate';
import JoiningConfirmationTemplate from '@/components/print/templates/JoiningConfirmationTemplate';
import DocumentChecklistTemplate from '@/components/print/templates/DocumentChecklistTemplate';
import BGVTemplate from '@/components/print/templates/BGVTemplate';
import AppointmentLetterTemplate from '@/components/print/templates/AppointmentLetterTemplate';
import NDATemplate from '@/components/print/templates/NDATemplate';
import IDCardTemplate from '@/components/print/templates/IDCardTemplate';

export default function PrintStepPage() {
  const params = useParams();
  const candidateId = params.candidateId as string;
  const stepId = params.stepId as string;

  let TemplateComponent = null;

  switch (stepId) {
    case 'ctcBreakup':
      TemplateComponent = <CTCBreakupTemplate candidateId={candidateId} />;
      break;
    case 'loi':
      TemplateComponent = <LOITemplate candidateId={candidateId} />;
      break;
    case 'offerLetter':
      TemplateComponent = <OfferLetterTemplate candidateId={candidateId} />;
      break;
    case 'joining-confirmation':
      TemplateComponent = <JoiningConfirmationTemplate candidateId={candidateId} />;
      break;
    case 'doc-checklist':
      TemplateComponent = <DocumentChecklistTemplate candidateId={candidateId} />;
      break;
    case 'bgv':
      TemplateComponent = <BGVTemplate candidateId={candidateId} />;
      break;
    case 'appointment-letter':
      TemplateComponent = <AppointmentLetterTemplate candidateId={candidateId} />;
      break;
    case 'nda':
      TemplateComponent = <NDATemplate candidateId={candidateId} />;
      break;
    case 'id-card':
      TemplateComponent = <IDCardTemplate candidateId={candidateId} />;
      break;
    // We will add more steps here as we migrate them
    default:
      return (
        <div className="p-10 text-center font-bold text-red-500">
          Print template not yet available for step: {stepId}
        </div>
      );
  }

  return (
    <PrintLayout>
      {TemplateComponent}
    </PrintLayout>
  );
}
