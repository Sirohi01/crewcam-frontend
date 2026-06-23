import HiringStepLanding from '@/components/hiring/HiringStepLanding';

export default async function HiringStepLandingPage({ params }: { params: Promise<{ stepId: string }> }) {
  const { stepId } = await params;
  return <HiringStepLanding stepId={stepId} />;
}
