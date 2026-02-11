# RestoAM Dashboard

A lightweight portal that links Assets, Locations, and Workorders. Mobile-friendly by default.

## Run complete local stack

### 1) Prerequisites

- Node.js 18+
- npm
- Frontend repos cloned under the same parent folder:
  - `restoam-dashboard`
  - `restoam-asset-fe`
  - `restoam-location-fe`
  - `restoam-workorders-fe`
- Backend APIs running on expected ports:
  - Assets API: `http://localhost:8080`
  - Locations API: `http://localhost:8081`
  - Workorders API: `http://localhost:8082`

### 2) Dashboard env

Create `.env` in `restoam-dashboard` (recommended: copy from template):

```bash
cp .env.example .env
```

Template values:

```bash
VITE_ASSETS_URL=http://127.0.0.1:5173
VITE_LOCATIONS_URL=http://127.0.0.1:5174
VITE_WORKORDERS_URL=http://127.0.0.1:5175

ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
SESSION_SECRET=local-dev-session-secret-change-me
```

Auth contract:
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `SESSION_SECRET`

Notes:
- Local dev defaults are allowed.
- In production, use non-default credentials and a strong secret.

### 3) Install deps

```bash
cd restoam-dashboard && npm install
cd ../restoam-asset-fe && npm install
cd ../restoam-location-fe && npm install
cd ../restoam-workorders-fe && npm install
```

### 4) Preflight check

From `restoam-dashboard`:

```bash
npm run dev:check
```

This verifies:
- required repos exist
- expected ports are free/in use
- backend reachability on `8080/8081/8082`

### 5) Start backend APIs (if not already running)

Run prerequisite check from dashboard repo:

```bash
npm run backend:up
```

Start Postgres first (required by all three APIs):

```bash
docker run -d --name restoam-postgres \
  -e POSTGRES_USER=restoam_user \
  -e POSTGRES_PASSWORD=restoam_password \
  -e POSTGRES_DB=restoam_db \
  -p 5432:5432 postgres:15
```

If Docker returns permission denied on `/var/run/docker.sock`, add your user to docker group and re-login:

```bash
sudo usermod -aG docker $USER
# logout/login, then retry docker command
```

Then start each backend service:

```bash
cd ../restoam-asset && ./gradlew bootRun --args="--server.port=8080"
cd ../restoam-location && ./gradlew bootRun --args="--server.port=8081"
cd ../restoam-workorders && ./gradlew bootRun --args="--server.port=8082"
```

### 6) Start all frontends with one command

From `restoam-dashboard`:

```bash
npm run dev:all
```

Default URLs:
- Dashboard/login: `http://127.0.0.1:5176`
- Assets: `http://127.0.0.1:5173`
- Locations: `http://127.0.0.1:5174`
- Workorders: `http://127.0.0.1:5175`

### 7) Health check command

```bash
npm run stack:health
```

Expected: all FE ports, API ports, and Postgres (`5432`) show ✅.

## Smoke test flow

1. Open `http://127.0.0.1:5176`
2. Login with `VITE_ADMIN_USER` / `VITE_ADMIN_PASS`
3. Navigate Dashboard → Assets
4. Navigate Dashboard → Locations
5. Navigate Dashboard → Workorders
6. Confirm each page loads and backend data calls succeed

## Troubleshooting

- **Port already in use**: stop the conflicting process or change port mapping.
- **Backend unreachable**: ensure APIs are running on `8080/8081/8082`.
- **Blank app / wrong links**: verify dashboard `.env` URLs.
- **Missing repo**: clone required frontend/backend repos beside `restoam-dashboard`.
- **Docker permission denied (`/var/run/docker.sock`)**: add user to docker group and re-login.

### Known upstream backend blocker (current)

At current repository HEAD:
- `restoam-location` and `restoam-workorders` fail compile with unresolved references in `cass/web/AppRoutes.kt` (`Asset`, `AssetService` symbols missing).
- `restoam-asset` starts successfully on `8080`.

This means full end-to-end stack validation is currently blocked until those two backend repos are fixed upstream or patched locally.

## Auth server run (for login/session)

```bash
npm run server
```

Runs on `http://127.0.0.1:3001` and provides:
- `GET /api/auth/me`
- `POST /api/auth/login`
- `POST /api/auth/logout`

## Auth tests

```bash
npm run test:auth
```

## Individual dashboard run

```bash
npm run dev
```
