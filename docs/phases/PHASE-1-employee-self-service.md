# Phase 1 — Employee self-service (frontend)

| | |
|---|---|
| **Branch** | `agent_changes` |
| **Status** | 🚧 In progress. Slice 1B done |
| **Backend** | `crewcam-backend/docs/phases/PHASE-1-employee-self-service.md` (the `/api/v1/me` API, slice 1A) |

## Slice 1B — My Profile pages wired to real data

### Pages

| Page | Route | Now live | Still placeholder |
|---|---|---|---|
| Family Details | `/dashboard/employee/family` | Profile card; family members (add / edit / delete); emergency contacts (add / edit / delete); Other Family Information (edit); dependents count; age computed from DOB | Family document upload (empty state; storage arrives in 1D) |
| Bank Details | `/dashboard/employee/bank-details` | Primary account from HR's record (account number masked by the server); IFSC/MICR copy buttons; verification status; nominee taken from Family Information | Other accounts and bank documents (empty states) |
| Education | `/dashboard/my-profile/education-details` | Qualifications, certifications, courses (add / edit / delete); summary tiles computed from the entries | — |
| Emergency | `/dashboard/employee/emergency` | "My Emergency Contacts": live list, Call (`tel:`), Message (`sms:`), edit, add. Same data as the Family page. | Helplines, office info, alerts and safety tips are company content with no admin screen yet (sample data remains, marked in code) |

### Shared building blocks (new)

| File | Purpose |
|---|---|
| `src/services/meService.ts` | Typed client for `/me/profile`, `/me/details`, `/me/details/:section`, `/me/bank` |
| `src/hooks/useMyProfile.ts` | React Query hooks: `useMyProfile`, `useMyDetails`, `useMyBankDetails`, `useUpdateMyProfile`, `useSaveMyDetailsSection` (toasts via react-hot-toast) |
| `src/hooks/useProfileSectionEditor.ts` | Add / edit / delete state for one list section. The server replaces the whole list, so each change sends the full list. Delete asks for confirmation. |
| `src/components/profile/ProfileSummaryCard.tsx` | The left profile card, previously copied into every tab page. Same markup; initials instead of stock photos when the employee has no picture. |
| `src/components/profile/ProfileTabs.tsx` | The tab strip, with the same styling. Tabs now navigate. Documents, Skills and More Info have no page yet: they stay visible, are not links, and show a "Coming soon" tooltip. |
| `src/components/profile/ProfileEntryDialog.tsx` | One form dialog for every row type, driven by a field list. Required-field checks run client-side; the server's validation message is shown on failure. |
| `src/components/profile/profileFields.ts` | Field definitions per section (they mirror the backend Zod rules) |

### Design notes

- **Layout, spacing, colours and typography are unchanged.** Markup was kept and only the data source changed. The Education page keeps its own larger card instead of the shared one, to preserve its design.
- **Sample data removed** (no fake names, numbers or stock photos). Each list has an empty state.
- **Controls that did nothing were removed** rather than kept as decoys:
  - Education: "View Timeline", the "All" filter, the camera badge, document icons with no document
  - Bank: per-row edit/delete on fake accounts, "View Bank Update History"
  - Family: the "⋮" menu
- **"Edit Bank Details" explains** that HR manages bank changes, the safe default until slice 1E adds approval-based change requests.

### Verification

| Check | Result |
|---|---|
| `tsc --noEmit` | Pass |
| ESLint on changed files | 0 errors. 3 warnings: `<img>` for profile photos, the same pattern the existing pages use, because photo URLs are arbitrary |
| `next build` | Pass; all four routes built |
| Backend test `accepts the exact payloads the profile dialogs send` | Pass. Blank optional fields and server rows re-saved with `_id` and ISO dates round-trip |

**Not done:** a manual click-through in a browser against a running backend. Do this before release:

1. Log in as an employee.
2. Add, edit and delete a family member, an emergency contact and a qualification.
3. Reload and confirm the changes persisted.
4. Confirm the Emergency page shows the same contacts as the Family page.

### Rollback

Revert the commit. These pages become static again; no data is affected.
