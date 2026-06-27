'use client';
import { OnboardingTaskBoard } from '@/components/shared/OnboardingTaskBoard';

export default function SuperAdminDeploymentsPage() {
  return (
    <OnboardingTaskBoard
      category="DEPLOYMENT"
      title="Deployments"
      description="Go-live releases, environment cutovers, and rollout status per company."
    />
  );
}
