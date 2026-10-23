# Security Fixes — Manual Test Plan

This folder holds the verification plan for the Critical/High auth-flow fixes.
`crewcam-frontend` has no test runner configured (no Jest/Vitest/RTL), so the
frontend-touching fixes are verified manually here with exact steps + expected
results — the backend fixes already have automated coverage in
`crewcam-backend/src/tests/security-fixes/` (run with `npm test` in that repo).

Use this file interactively: check each box as we verify it together.

## Setup

```bash
# Terminal 1 — backend
cd crewcam-backend && npm run dev        # http://localhost:8000

# Terminal 2 — frontend
cd crewcam-frontend && npm run dev       # http://localhost:3000
```

You'll need one existing login (email/employee code + password) in the local
DB to exercise the authenticated pages. The automated backend tests don't
require this — only the manual steps below do.

---

## 1. [Critical] CORS no longer reflects arbitrary origins

**Automated:** `crewcam-backend/src/tests/security-fixes/cors.test.ts`

**Manual cross-check (curl):**

```bash
# Untrusted origin — should NOT see this origin echoed back in the response headers
curl -i -H "Origin: https://evil-attacker.example" http://localhost:8000/api/health | grep -i "access-control-allow-origin"
# Expect: no output (header absent) or a value that is NOT https://evil-attacker.example

# Configured origin — should be echoed back
curl -i -H "Origin: http://localhost:3000" http://localhost:8000/api/health | grep -i "access-control-allow-origin"
# Expect: access-control-allow-origin: http://localhost:3000
```

- [ ] Untrusted origin curl shows no `access-control-allow-origin: https://evil-attacker.example`
- [ ] Trusted origin curl shows `access-control-allow-origin: http://localhost:3000`

---

## 2. [Critical] Password reset token no longer leaks outside dev/test

**Automated:** `crewcam-backend/src/tests/security-fixes/resetTokenNotLeakedInProd.test.ts`

**Manual cross-check:**

```bash
# With the backend's .env NODE_ENV=development (local default), the dev-convenience
# field is still present — that's expected locally:
curl -s -X POST http://localhost:8000/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"<a real user email in your local DB>"}' | jq
```

- [ ] Response includes `resetToken` when `NODE_ENV=development` (local default — expected)
- [ ] Temporarily set `NODE_ENV=production` in `crewcam-backend/.env`, restart the backend, repeat the same curl, and confirm `resetToken` is **absent** from the response. Revert `.env` back to `development` afterward.

---

## 3. [Critical] No hardcoded fallback JWT secret

**Automated:** `crewcam-backend/src/tests/security-fixes/jwtSecretFallback.test.ts` (covers this directly; nothing to re-verify via the UI — a wrong/missing secret would simply break every login, which the automated test already asserts throws in a simulated production environment).

- [ ] Automated backend test passes (`npm test` in `crewcam-backend`, see `jwtSecretFallback.test.ts` in the output)

---

## 4. [High] Hardcoded super-admin email backdoor removed

**Automated:** `crewcam-backend/src/tests/security-fixes/superAdminBypassRemoved.test.ts`

**Manual cross-check (if you have an account literally named `admin@crewcam.app` in a non-prod DB):**

1. Log in as that account via the employer/employee login screen.
2. Try to access a super-admin-only area (e.g. the super-admin tenants list, if that UI is reachable from this account's portal).
3. Expect: **403 Forbidden** — this account should now be treated exactly like any other account with its real assigned role, not auto-granted super-admin.

- [ ] Automated backend test passes
- [ ] (If applicable) manual check above returns 403, not 200

---

## 5. [High] Login response no longer leaks the JWT in the body

**Automated:** `crewcam-backend/src/tests/security-fixes/loginTokenNotLeaked.test.ts`

**Manual cross-check (browser DevTools):**

1. Open the Network tab, go to `/login` (or `/employer-login`), submit valid credentials.
2. Click the `verify-otp` (or `login`) request → **Response** tab.
3. Confirm the JSON body has a `user` object but **no `token` field**.
4. Click the **Cookies** tab (Application → Cookies in Chrome) and confirm `token_employer` (or `token_super_admin`) is present with the **HttpOnly** flag checked.

- [ ] Response body has no `token` field
- [ ] `token_employer` cookie present and marked HttpOnly

---

## 6. [High] `authStore` no longer persists a token in localStorage

1. Log in successfully.
2. Open DevTools → Application → Local Storage → `http://localhost:3000`.
3. Inspect the `auth-storage` key's JSON value.

- [ ] The stored JSON contains `user`, `tenantId`, `isAuthenticated` — **no `token` key**
- [ ] (Regression check) You are still able to navigate protected `/dashboard/*` pages after a hard refresh — session persistence still works, purely via the httpOnly cookie + `isAuthenticated` flag, not a stored token

---

## 7. [High] Security & Sessions settings pages actually work now

Previously these pages (`/dashboard/settings/security`, `/dashboard/settings/sessions`) were **permanently broken**: they sent `Authorization: Bearer ${authStore.token}` where `token` was always `null` (every request 401'd), and hardcoded `http://localhost:8000` instead of the configured API URL. They now use the shared cookie-authenticated `api` client.

**`/dashboard/settings/security`:**
- [ ] Page loads without a console/network error
- [ ] Click **"Set up Authenticator App"** → a QR code and secret render (was previously impossible — the backend route `POST /auth/2fa/setup` didn't even exist; it's now wired up)
- [ ] Scan the QR with an authenticator app (or compute the TOTP from the secret), enter the 6-digit code, click **Verify & Enable** → success alert, 2FA enabled
- [ ] Disable 2FA with a fresh code → success alert

**`/dashboard/settings/sessions`:**
- [ ] Page loads and lists at least the current session (no infinite "Loading sessions..." / network 401)
- [ ] Revoking a non-current session removes it from the list

---

## 8. [High] Finance & PMS pages were silently dead — now load data

Discovered while removing the unused `token` field: these pages gated their entire data-fetching on `enabled: !!token`, and since `token` was always `null`, **the queries never fired at all** — the pages always showed an empty/loading state, forever, regardless of whether you were logged in. They now use the shared cookie-authenticated `api` client like everything else.

- [ ] `/dashboard/finance/expenses` — expense list loads; submitting a new expense works
- [ ] `/dashboard/finance/agreements` — agreement list loads; creating one works
- [ ] `/dashboard/pms` — "My Appraisals", "Team Appraisals", and "KRAs" tabs each load data when clicked

---

## Regression sanity checks (make sure nothing else broke)

- [ ] Normal login (`/login`, `/employer-login`) still works end-to-end and redirects to `/dashboard`
- [ ] Logging out clears the session and redirects to `/login`
- [ ] A 401 from an expired/invalid session still redirects to `/login` (via the `lib/axios.ts` response interceptor, unchanged by this round of fixes)
- [ ] `npm run build` succeeds in both `crewcam-backend` and `crewcam-frontend` (already verified once by Claude during the fix — re-run if you pull these changes fresh)
