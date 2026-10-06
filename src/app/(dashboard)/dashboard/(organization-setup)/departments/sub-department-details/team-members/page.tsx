'use client';

import React from 'react';
import { PageHeading } from '../page';
import TeamMembersTab from '@/components/departments/TeamMembersTab';

export default function TeamMembersPage() {
  return (
    <div className="space-y-2 font-sans text-zinc-900 p-2">
      <PageHeading activeTab="Team Members" />
      <TeamMembersTab />
    </div>
  );
}
