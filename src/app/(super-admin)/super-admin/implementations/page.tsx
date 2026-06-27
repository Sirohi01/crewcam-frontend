'use client';
import { OnboardingTaskBoard } from '@/components/shared/OnboardingTaskBoard';

export default function SuperAdminImplementationsPage() {
  return (
    <OnboardingTaskBoard
      category="IMPLEMENTATION"
      title="Implementations"
      description="Configuration and data-migration work performed for each company during onboarding."
    />
  );
}
