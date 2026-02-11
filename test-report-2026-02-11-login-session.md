# Test report — 2026-02-11 (Login/session task)

## Automated checks
- `npm run test:auth` => PASS (2 tests)
  - login failure => 401
  - login success persists session
  - logout clears session
- `npx playwright test tests/auth-flow.spec.js` => PASS

## Manual checklist results
- Unauthenticated user redirected to `/login` (UI routing) ✅
- Successful login lands on dashboard (`/`) ✅
- Page refresh keeps session (`/api/auth/me` + cookie session) ✅
- Logout returns user to `/login` ✅

## Evidence artifacts
- Login screenshot: `demo/login-page-auth.png`
- Post-login dashboard screenshot: `demo/dashboard-after-login.png`

## API/guard checks
- `GET /api/dashboard/summary` unauthenticated => `401 Unauthorized` ✅
- Same endpoint after login => `200 { ok:true, username }` ✅
