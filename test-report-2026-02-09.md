# RestoAM Dashboard Test Report — 2026-02-09

Scope: Login (admin) → session creation → redirect to dashboard.

## Automated
- Playwright: `npm run test:e2e` (login then dashboard loads) — PASS

## Manual
- Login with admin/admin, session stored in localStorage (restoam_session).
- Logout clears session and returns to login.

## Screenshot
- demo/2026-02-09/login.png
