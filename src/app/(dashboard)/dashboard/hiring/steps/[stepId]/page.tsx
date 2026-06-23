import HiringStepLanding from '@/components/hiring/HiringStepLanding';
import HiringRegisterShell from '@/components/hiring/registers/HiringRegisterShell';

const REGISTER_STEPS = [
  'offer-letter', 'nda', 'asset-access', 'engagement-confirm', 
  'induction', 'team-intro', 'probation-review', 'perf-eval', 
  'id-card', 'release-qa'
];

export default async function HiringStepLandingPage({ params }: { params: Promise<{ stepId: string }> }) {
  const { stepId } = await params;

  if (REGISTER_STEPS.includes(stepId)) {
    return <HiringRegisterShell stepId={stepId} />;
  }

  return <HiringStepLanding stepId={stepId} />;
}
