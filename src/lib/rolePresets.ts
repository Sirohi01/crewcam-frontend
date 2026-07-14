// Quick-pick suggestions for the Create Role modal. Picking one pre-fills the role name,
// login type (which of the two company-portal login screens it uses), a sensible default
// `scope` (how much data the role can see — see Role.ts), and a starting permission set.
// Everything stays editable afterward — these are presets, not a fixed/closed list; admins
// can still type any custom role name.

export const LOGIN_TYPES = [
  { value: 'employer', label: 'Employer (Owner / Management)' },
  { value: 'employee', label: 'Employee' },
] as const;

const EMPLOYER_FULL_ACCESS_PERMISSIONS = ['*'];

// Company Settings, Subscription, Billing, Branches, Departments, Payroll Approval, Reports,
// Organization Policies, User Management, Roles & Permissions, Recruitment Approval.
const EMPLOYER_STANDARD_PERMISSIONS = [
  'COMPANY_PROFILE_READ', 'COMPANY_PROFILE_WRITE',
  'SUBSCRIPTION_READ', 'SUBSCRIPTION_WRITE',
  'BILLING_READ', 'BILLING_WRITE',
  'ORG_READ', 'ORG_WRITE',
  'PAYROLL_APPROVE',
  'REPORTS_READ',
  'MASTER_READ', 'MASTER_WRITE',
  'EMPLOYEE_READ', 'EMPLOYEE_WRITE',
  'ROLE_ADMIN',
  'RECRUITMENT_APPROVE',
];

export interface RolePreset {
  name: string;
  loginType: 'employer' | 'employee';
  scope: string;
  permissions: string[];
}

export const ROLE_PRESET_GROUPS: Array<{ group: string; roles: RolePreset[] }> = [
  {
    group: 'Employer Login',
    roles: [
      'Owner', 'Director', 'CEO', 'Managing Director', 'HR Director', 'CHRO', 'CFO', 'COO',
    ].map((name) => ({ name, loginType: 'employer', scope: 'company', permissions: EMPLOYER_FULL_ACCESS_PERMISSIONS })),
  },
  {
    group: 'Employee Login',
    roles: [
      { name: 'HR Admin', scope: 'company' },
      { name: 'HR Recruiter', scope: 'company' },
      { name: 'Reporting Manager', scope: 'team' },
      { name: 'HOD', scope: 'department' },
      { name: 'Team Leader', scope: 'team' },
      { name: 'Payroll Executive', scope: 'company' },
      { name: 'Finance', scope: 'company' },
      { name: 'Employee', scope: 'self' },
      { name: 'Intern', scope: 'self' },
      { name: 'Contract Employee', scope: 'self' },
    ].map((r) => ({ ...r, loginType: 'employee' as const, permissions: [] as string[] })),
  },
];

// "Admin" sits under Employer Login per the product spec, but — unlike Owner/CEO/etc., who
// get full (`*`) access — starts with the standard employer permission set rather than
// everything, so it reads as a distinct, slightly narrower role out of the box.
ROLE_PRESET_GROUPS[0].roles.push({ name: 'Admin', loginType: 'employer', scope: 'company', permissions: EMPLOYER_STANDARD_PERMISSIONS });

export const EMPLOYER_PERMISSION_CHIPS = [
  { label: 'Company Settings', permissions: ['COMPANY_PROFILE_READ', 'COMPANY_PROFILE_WRITE'] },
  { label: 'Subscription', permissions: ['SUBSCRIPTION_READ', 'SUBSCRIPTION_WRITE'] },
  { label: 'Billing', permissions: ['BILLING_READ', 'BILLING_WRITE'] },
  { label: 'Branches & Departments', permissions: ['ORG_READ', 'ORG_WRITE'] },
  { label: 'Payroll Approval', permissions: ['PAYROLL_APPROVE'] },
  { label: 'Reports', permissions: ['REPORTS_READ'] },
  { label: 'Organization Policies', permissions: ['MASTER_READ', 'MASTER_WRITE'] },
  { label: 'User Management', permissions: ['EMPLOYEE_READ', 'EMPLOYEE_WRITE'] },
  { label: 'Roles & Permissions', permissions: ['ROLE_ADMIN'] },
  { label: 'Recruitment Approval', permissions: ['RECRUITMENT_APPROVE'] },
];
