# Current Task — US-002: Create Supabase schema and configure environment

**Branch:** 2-supabase-schema
**Created:** 2026-04-23
**Status:** 🔄 In Progress

## Context
Project infrastructure is in place (US-001 done). This US connects the app to Supabase: creates the three database tables (entries, followups, connections), installs and configures the Supabase JS client, and creates entryService.ts with stub CRUD functions. After this US the app has a working database layer ready for feature implementation.

## Files to Read First
- docs/architecture.md (section 2 — ERD, section 4 — folder structure)
- docs/setup.md (section 3 — Supabase setup, full SQL schema)
- .env.example (to know which env vars are expected)

## Tasks
1. [ ] **TASK-002.1 (manual — user does this):** Run SQL schema in Supabase SQL Editor — create `entries`, `followups`, `connections` tables + disable RLS. SQL is in `docs/setup.md` section 3.3 and 3.4.
2. [ ] **TASK-002.2:** Install `@supabase/supabase-js` — `npm install @supabase/supabase-js`
3. [ ] **TASK-002.3:** Create `src/lib/supabase.ts` — initialize Supabase client using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` env vars
4. [ ] **TASK-002.4:** Create `src/types/index.ts` — define TypeScript types: `Entry`, `FollowUp`, `Connection` matching the DB schema
5. [ ] **TASK-002.5:** Create `src/services/entryService.ts` — implement stub functions: `createEntry()`, `getEntries()`, `getEntryById()`. Stubs should have correct signatures and return types but can throw `new Error('Not implemented')` for now.
6. [ ] **TASK-002.6 (/qa):** Write tests for entryService stubs — verify functions exist and have correct signatures (mocked Supabase)

## Constraints
- All Supabase calls go through `src/services/entryService.ts` — never import supabase client directly in components
- Client initialized once in `src/lib/supabase.ts`, imported by services only
- No `any` types — use types from `src/types/index.ts`
- Max 300 lines per file
- Env vars must use `VITE_` prefix to be accessible in Vite

## Acceptance Criteria (from BACKLOG.md)
- [ ] Three tables created in Supabase: `entries`, `followups`, `connections`
- [ ] `@supabase/supabase-js` installed and configured
- [ ] `src/services/entryService.ts` created with placeholder CRUD functions
- [ ] RLS disabled on all tables (MVP — single user)
- [ ] `.env` with real Supabase keys works locally

## After Implementation
- [ ] Run linter: `npm run lint`
- [ ] Run tests: `npm test`
- [ ] Manual verification steps:
  1. Sprawdź Supabase Dashboard — potwierdź że tabele `entries`, `followups`, `connections` istnieją
  2. Sprawdź że RLS jest wyłączony na każdej tabeli (Table Editor → tabela → Auth policies → "RLS disabled")
  3. Sprawdź że `src/lib/supabase.ts` istnieje i importuje się bez błędów (`npm run build` nie rzuca błędów)
  4. Sprawdź że `src/services/entryService.ts` eksportuje funkcje `createEntry`, `getEntries`, `getEntryById`
  5. Sprawdź że `src/types/index.ts` zawiera typy `Entry`, `FollowUp`, `Connection`
- [ ] Wait for user manual verification confirmation before /qa
