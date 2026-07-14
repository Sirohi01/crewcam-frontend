// Mirrors ROLE_SCOPES in crewcam-backend/src/models/Role.ts — keep in sync.
// Scope is purely about data breadth (how much of the company a role can see) — separate
// from the role's job title (Role.name) and which login screen it uses (Role.loginType).
export const ROLE_SCOPES = [
  { value: 'self', label: 'Self', hint: 'Only their own data' },
  { value: 'team', label: 'Team', hint: "Their direct reports' data" },
  { value: 'department', label: 'Department', hint: "Their department's data" },
  { value: 'branch', label: 'Branch', hint: "Their branch's data" },
  { value: 'company', label: 'Company', hint: 'Company-wide data' },
] as const;

const LABEL_BY_VALUE = new Map(ROLE_SCOPES.map((s) => [s.value, s.label] as const));

export const getRoleScopeLabel = (scope: string) => LABEL_BY_VALUE.get(scope as any) || scope;
