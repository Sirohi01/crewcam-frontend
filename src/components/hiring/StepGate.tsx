'use client';

interface StepGateProps {
  unlocked?: boolean;
  blockedBy?: string[];
  compact?: boolean;
}

export default function StepGate({ unlocked = false, blockedBy = [], compact = false }: StepGateProps) {
  return null;
}
