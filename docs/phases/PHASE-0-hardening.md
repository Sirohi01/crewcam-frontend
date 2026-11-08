# Phase 0 — Security hardening (frontend part)

| | |
|---|---|
| **Branch** | `agent_changes` |
| **Base commit** | `300f237` |
| **Date** | 2026-11-08 |
| **Status** | Done. Built; not yet deployed |
| **Main write-up** | `crewcam-backend/docs/phases/PHASE-0-hardening.md` (most Phase 0 work was in the backend) |

## Changes

### Duplicate pages removed

Each pair below had two copies of the same screen. The one kept is the one the app actually links to. The other is removed, and a temporary (307) redirect in `next.config.ts` keeps old links and bookmarks working.

| Removed | Kept (linked) | Difference between the copies |
|---|---|---|
| `/dashboard/my-request` | `/dashboard/my-requests` | Breadcrumb markup only |
| `/dashboard/my-task` | `/dashboard/my-tasks` | Breadcrumb markup only |
| `/dashboard/payslip-income-tax` | `/dashboard/payslip-and-income-tax` | Removed copy had a broken class (`px-1t`) and wrong figures (₹10000, "₹78(78%)") |

- **Why 307, not 308:** browsers cache permanent redirects, so a 307 keeps rollback possible.
- **Design left as-is:** `my-tasks` keeps its inline breadcrumb rather than the shared `Breadcrumb` component; changing designs needs approval.

### Not duplicates (kept)

`settings/sidebar` ("Side Bar List") vs `settings/sidebar-management`, and `settings/roles` vs `settings/role-rights`, are separate features with their own sidebar entries.

### Repo hygiene

Two `hiring-verify*.log` files are no longer tracked, and `*.log` was added to `.gitignore`.

### Frontend effects of backend changes

- **403 on some org-setup saves:** business units, divisions, cost centres, department documents/policies/custom fields, and custom fields return 403 to users without `ORG_WRITE`. The pages already show API errors; grant the permission in **Settings → Role Rights** if an employee-login role needs it.
- **Saved budgets load again:** `add-budget-allocation` previously got a 500 whenever a saved budget existed. It now loads, and owners arrive populated (the page's `extractId` already handles that).
- **`x-tenant-id` header:** `lib/axios.ts` still sends it. The backend now ignores it, which is harmless. Remove it when that file is next changed.

## Verification

| Check | Result |
|---|---|
| `tsc --noEmit` | Pass, 0 errors |
| `next build` | Pass |
| Redirects in `.next/routes-manifest.json` | All 3 present, status 307 |
| Kept pages built; removed pages absent from build output | Confirmed |

**Not done:** manual browser check.

## Rollback

Revert the commit. The redirects are temporary, so no browser holds a cached permanent redirect.
