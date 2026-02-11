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
VITE_ADMIN_USER=admin
VITE_ADMIN_PASS=admin
```

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

If prerequisites are present, start each backend service:

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

## Individual dashboard run

```bash
npm run dev
```
