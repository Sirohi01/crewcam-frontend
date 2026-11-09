# Phase 1 — Employee self-service (frontend)

| | |
|---|---|
| **Branch** | `agent_changes` |
| **Status** | 🚧 In progress. Slices 1B and 1C done |
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

---

## Slice 1C — the unified My Profile page (what the sidebar opens)

### Why this slice existed

The employee sidebar's **My Profile** opens `/dashboard/my-profile-extension`, a single page with in-page tabs: Personal, Family, Bank, Education, Experience, Documents, Skills, Assets, Emergency and More Info. The pages wired in 1B are a second, older design reached from links. Both exist, so both had to show the same real data.

### Approach

- **Data shared, markup separate.** The tab components are denser than the standalone pages (e.g. `p-2`/`gap-1` and a 220px card, versus `p-4`/`gap-2`). Rendering one shared component in both would change spacing in one of them. Instead, both use the same hooks (`useMyProfile`, `useMyDetails`, `useProfileSectionEditor`), the same dialog (`ProfileEntryDialog`) and the same field definitions (`profileFields.ts`). Each keeps its own layout, so an edit in one view appears in the other.
- **Bank rows** (`BankField`, `BankBadge`, the "HR manages this" message) have identical markup in both views, so they moved to `components/profile/BankFields.tsx` and are used by both.

### What changed on the unified page

| Area | Before | Now |
|---|---|---|
| Data source | `/employees/current`, which sent **PAN and Aadhaar unmasked** to the browser | `/me/profile`; masked on the server |
| Sample fallbacks | Empty real fields showed **"Rohan Mehta"'s** phone, PAN, Aadhaar, DOB, manager, PF/ESIC/UAN numbers… (26 `DUMMY.*` fallbacks plus inline literals) | "—" (or "Not assigned" for no manager); the `DUMMY` object is deleted |
| Personal tab card | Hard-coded copy of the profile card | The real `profileCardContent` |
| Photos | `randomuser.me` / `pravatar.cc` stock photos | Real photo, or initials (`ProfileAvatar`) |
| Edit Profile / Personal Information → Edit | "coming soon" | Dialog saving phone, blood group, marital status and addresses (`PATCH /me/profile`) |
| Work Information → Edit | Did nothing | Explains HR manages work details |
| Family, Bank, Education, Emergency tabs | Sample data | Live, same behaviour as the 1B pages |
| **Experience tab** | 3 sample employers; logos fetched from `logo.clearbit.com` (sent employer names to a third party) | Live CRUD. Tenure, total/average experience and the industry chart are computed from the dates. Initials instead of third-party logos. The header "Add Experience" and the tab's button open the same form. |
| **Skills tab** | 10 sample skills, sample stats, sample certifications marked "Verified" | Live CRUD. Proficiency mapped from level (Beginner 25%, Intermediate 50%, Advanced 75%, Expert 100%). Stats and breakdown computed. Certifications come from Education and show **Valid / Expired** from their expiry date. Nothing verifies them, so the false "Verified" badge is gone. |
| Appraisals widget | Called `/appraisals/my` (no such route) | `/pms/appraisals/my` |

Controls that did nothing (Sort-by, View Details, View All Skills, View Guidelines) were removed. "View All Certifications" now opens the Education tab.

**Still placeholder:**

- **Documents tab:** upload, preview, filters, paging. Needs document storage (slice 1D); the buttons say "coming soon".
- **Assets and More Info tabs:** untouched (1D).
- **Personal tab widgets:** Pay & Benefits, Time Log, Tasks, Goals read the existing queries, and are reviewed in 1C-2 together with payslip and attendance.

### Backend change in this slice

Experience rows gained these fields (model + Zod; covered by `me.test.ts`):

- `industry`
- `companyWebsite`
- `referenceName`, `referencePhone`, `referenceEmail` (phone and email validated)

A blank end date means "current role".

### Verification

| Check | Result |
|---|---|
| `tsc --noEmit` | Pass |
| ESLint, changed folders | **0 errors** (21 warnings, mostly pre-existing unused vars). The one error, a memo-dependency mismatch in `tenure`, was **pre-existing** in the original file and is fixed. |
| `next build` | Pass |
| Backend `me.test.ts` | 9/9 pass, including the new experience fields and invalid reference email |

**Not done:** manual browser click-through. Before release: open **My Profile** from the sidebar, then add, edit and delete an experience and a skill. Confirm the Family/Emergency/Education data matches the standalone pages, and that PAN and Aadhaar show masked.
