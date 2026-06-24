import HiringStepLanding from '@/components/hiring/HiringStepLanding';
import HiringRegisterShell from '@/components/hiring/registers/HiringRegisterShell';

const REGISTER_STEPS = [
  'evaluation', 'selection-approval', 'ctc-breakup', 'loi', 'joining-confirmation', 'doc-checklist', 'bgv',
  'joining-form', 'nomination', 'bank-payroll', 'emergency-contact', 'offer-letter', 'nda',
  'it-policy-accept', 'code-of-conduct-accept', 'appointment-letter', 'asset-access',
  'engagement-confirm', 'induction', 'team-intro', 'probation-review', 'perf-eval', 'id-card'
];

export default async function HiringStepLandingPage({ params }: { params: Promise<{ stepId: string }> }) {
  const { stepId } = await params;

  if (REGISTER_STEPS.includes(stepId)) {
    return <HiringRegisterShell stepId={stepId} />;
  }

  return <HiringStepLanding stepId={stepId} />;
}
