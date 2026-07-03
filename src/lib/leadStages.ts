// Friendly display names for Lead.stage values. The underlying enum stays as-is
// (LEAD/DEMO_SCHEDULED/PROPOSAL_SENT/QUOTATION_APPROVED/WON/LOST) because it's shared
// with Tenant.lifecycleStatus once a lead converts — only the label changes here.
export const STAGE_LABELS: Record<string, string> = {
  LEAD: 'New',
  DEMO_SCHEDULED: 'Demo Required',
  PROPOSAL_SENT: 'PI Sent',
  QUOTATION_APPROVED: 'PI Approved',
  WON: 'Won',
  LOST: 'Lost',
};

export const STAGE_COLOR: Record<string, string> = {
  LEAD: 'bg-blue-100 text-blue-700',
  DEMO_SCHEDULED: 'bg-indigo-100 text-indigo-700',
  PROPOSAL_SENT: 'bg-violet-100 text-violet-700',
  QUOTATION_APPROVED: 'bg-amber-100 text-amber-700',
  WON: 'bg-emerald-100 text-emerald-700',
  LOST: 'bg-zinc-100 text-zinc-500',
};

export interface LeadStageGroup {
  key: string;
  navLabel: string;
  pageTitle: string;
  subtitle: string;
  stages: string[];
}

export const LEAD_STAGE_GROUPS: LeadStageGroup[] = [
  { key: 'NEW', navLabel: 'New Lead List', pageTitle: 'New Lead List', subtitle: "Leads assigned to you that haven't been contacted yet.", stages: ['LEAD'] },
  { key: 'HOT', navLabel: 'Hot Lead List', pageTitle: 'Hot Lead List', subtitle: 'Leads in active deal-closing stages — PI sent or approved.', stages: ['PROPOSAL_SENT', 'QUOTATION_APPROVED'] },
  { key: 'COLD', navLabel: 'Cold Lead List', pageTitle: 'Cold Lead List', subtitle: "Leads that didn't convert.", stages: ['LOST'] },
  { key: 'CONFIRM', navLabel: 'Confirm Lead List', pageTitle: 'Confirm Lead List', subtitle: 'Leads that converted and are now customers.', stages: ['WON'] },
];

export function stageGroupQuery(group: LeadStageGroup): string {
  return group.stages.join(',');
}

export function findStageGroup(stageFilter: string): LeadStageGroup | undefined {
  return LEAD_STAGE_GROUPS.find((g) => stageGroupQuery(g) === stageFilter);
}
