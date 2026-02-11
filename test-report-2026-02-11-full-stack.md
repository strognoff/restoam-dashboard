# Test report — 2026-02-11 (How to run all apps together)

## Objective
Run login page, dashboard, asset, location, and workorders apps together with backend APIs.

## Port mapping used
- Dashboard/login FE: 5176
- Asset FE: 5173
- Location FE: 5174
- Workorders FE: 5175
- Asset API: 8080
- Location API: 8081
- Workorders API: 8082
- Postgres: 5432

## Preflight / health evidence
Command:
```bash
npm run stack:health
```
Result:
- All 8 services reported ✅

## Runtime notes
- Docker Postgres container started (`restoam-postgres`) on 5432.
- Backends started via Gradle wrapper with port args.
- Frontends started via Vite on fixed ports.

## Upstream fixes required to run cleanly
Two backend repos had build blockers; fixed and pushed:
- `strognoff/restoam-location` commit `1ef94e1`
- `strognoff/restoam-workorders` commit `a298248`

Fix details:
- switch Gradle wrapper distribution URL from local file path to official URL
- remove invalid Kotlin `AppRoutes.kt` file that referenced non-existent `Asset` classes

## Smoke checklist
- Dashboard FE reachable on 5176 ✅
- Asset FE reachable on 5173 ✅
- Location FE reachable on 5174 ✅
- Workorders FE reachable on 5175 ✅
- APIs reachable on 8080/8081/8082 ✅
- Postgres reachable on 5432 ✅
