# Phase 1 — Employee self-service (frontend)

| | |
|---|---|
| **Branch** | `agent_changes` |
| **Status** | 🚧 In progress. Slices 1B, 1C, 1C-2 and 1E done |
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

---

## Slice 1C-2 — Leave, Apply Leave, Payslip, Reimbursement

All four pages linked from the employee sidebar were fully hard-coded. The layout of each is unchanged.

| Page | Now live | Still placeholder (and why) |
|---|---|---|
| **Leave** (`/dashboard/employee-leave`) | Balance card per company leave type, using the original palette in order. History with working tabs and pagination (6/page). Upcoming leaves; yearly summary and utilisation donut. "Policy highlights" lists each type's real entitlement instead of invented rules. | — |
| **Apply Leave** (`/employee-apply-leave`) | Leave types from the company. Submits to `/leaves/apply`, with half day + session, contact during leave, and attachment uploaded first via `/upload`. Shows the available balance and warns when a request exceeds it. Right column shows real balances, entitlements and the real approval flow (you → your manager → HR). Server errors (overlap, bad type) are shown. | — |
| **Payslip & Income Tax** | From issued slips and `/me/salary-structure`: take-home, annual gross, deductions, TDS deducted this FY. Payslip history with an FY filter (Indian April–March) and pagination. **View** (breakdown dialog) and **Download** (printable payslip, "Save as PDF"; every value HTML-escaped). Earnings-vs-deductions chart and year-to-date totals. | Income-tax tabs, Form 16, declarations, investment proofs and the tax dashboard need the statutory engine (**Phase 4**); they say so. "Taxable Income" was removed because it can't be computed yet. |
| **Reimbursement** | **Submit New Request** dialog (new: the page had no way to submit). Type, amount, date (not future), description, receipt upload. Request list with status tabs, search and pagination; detail dialog with reviewer comments and the receipt. Stats: pending, approved this month, reimbursed this FY, average turnaround. FY summary donut. | Imprest (cash-advance) balance, top-up and history: not modelled yet (finance ledger port, Phase 3); shown as coming soon. |

**Removed, because they were fake or dead:**

- "Cancelled" leave tab (no such status); the "⋮" row menu; "Save as Draft"; the link to a non-existent leave-policy page;
- "5 / page" and "10 / page" selects; Filter and Date-range buttons that did nothing;
- the duplicate "All Requests" tab (employees only ever see their own).

**Text corrections:**

- The "How it works" steps say **Finance Review** (approval requires `FINANCE_WRITE`), not "Manager Review".
- The apply page no longer promises email notification of the decision.

**New files:**

- `services/leaveService.ts`, `services/payslipService.ts` (INR formatting, FY helpers, print view), `services/expenseService.ts`
- `hooks/useMyLeave.ts`

**Not done:** browser click-through. Before release:

1. Apply for a full-day and a half-day leave (one with an attachment) and check both appear in history.
2. Check the half day costs 0.5 days.
3. Submit a claim with a receipt.
4. Open and print a payslip. HR must have generated at least one slip.

---

## Slice 1E — HR-approved profile changes

**Employee side:**

- **Request change** next to *Personal Information → Edit* on the unified My Profile page opens a form for name, DOB, gender, PAN, Aadhaar and UAN. Only filled-in fields are sent, with an optional note and proof upload.
- **Edit Bank Details** (standalone bank page) and **Request change** (Bank tab) open the bank version. Before, they only showed "contact HR".
- **`MyChangeRequestsBanner`** shows pending requests (with *Cancel request*) and requests decided in the last 14 days (approved, or rejected with the reason). It renders nothing when there are none, so page layouts don't change.

**HR side:** a new page, **`/dashboard/change-requests`**, with a sidebar entry under *HR & Admin Department* that requires `EMPLOYEE_WRITE`.

- Status tabs: Pending, Approved, Rejected, Cancelled.
- The review dialog shows current vs requested values (full requested values, so they can be checked against the proof), the employee's note and the proof link.
- **Approve & apply**, or **Reject** (disabled until a reason is entered).
- A user without permission sees an explanation rather than an error.

**New files:**

- `services/changeRequestService.ts`
- `components/profile/ChangeRequestDialog.tsx`, `components/profile/MyChangeRequestsBanner.tsx`
- `app/(dashboard)/dashboard/(people)/change-requests/page.tsx`

**Not done:** browser click-through. Check these with two accounts:

1. As an employee, request a PAN change with a proof file and see the pending banner.
2. As HR, approve it, and check that the employee's PAN updates and the banner turns green.
3. Request a bank change, reject it with a reason, and check the employee sees the reason.
