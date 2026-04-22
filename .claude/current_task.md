# Current Task — US-001: Initialize React + Vite + TypeScript project

**Branch:** 1-project-setup
**Created:** 2026-04-22
**Status:** 🔄 In Progress

## Context
This is the foundational setup US. The project currently contains only documentation — no application code exists yet. After this US, a fully configured React + Vite + TypeScript project will be in place with Tailwind CSS, ESLint, Prettier, and Vitest, enabling all subsequent feature development.

## Files to Read First
- CLAUDE.md (conventions, naming, code quality rules)
- docs/architecture.md (folder structure in section 4)

## Tasks
1. [ ] **TASK-001.1:** Initialize Vite project with `npm create vite@latest . -- --template react-ts` (use `.` to init in current dir, skip re-creating dotflow subfolder)
2. [ ] **TASK-001.2:** Install and configure Tailwind CSS v3 — `npm install -D tailwindcss postcss autoprefixer`, run `npx tailwindcss init -p`, configure `tailwind.config.js` content paths, add Tailwind directives to `src/index.css`
3. [ ] **TASK-001.3:** Install and configure ESLint + Prettier — install `prettier eslint-config-prettier`, create `.prettierrc`, extend ESLint config with prettier
4. [ ] **TASK-001.4:** Install and configure Vitest + React Testing Library — `npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom`, update `vite.config.ts` with test config
5. [ ] **TASK-001.5:** Create `.env.example` with Supabase placeholder keys (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
6. [ ] **TASK-001.6:** Set up folder structure as per `docs/architecture.md` section 4 — create empty dirs: `src/components`, `src/pages`, `src/hooks`, `src/services`, `src/types`, `src/utils`
7. [ ] **TASK-001.7 (/qa):** Write a placeholder test (`src/__tests__/setup.test.ts`) that asserts `true` — just to verify Vitest runs
8. [ ] **TASK-001.8:** Verify `.gitignore` covers `node_modules/`, `dist/`, `.env`, `coverage/`, `.cache/`
9. [ ] **TASK-001.9:** Verify `tsconfig.json` has `"strict": true`

## Constraints
- Use `.` as target directory for Vite init (project folder already exists)
- No `any` types
- Tailwind v3 (not v4) — architecture doc specifies v3
- ESLint config must not conflict with Prettier (use `eslint-config-prettier`)
- Keep `src/App.tsx` minimal — a single div with a Tailwind class to verify Tailwind works (e.g., `<div className="text-blue-500">Dotflow</div>`)

## Acceptance Criteria (from BACKLOG.md)
- [ ] `npm run dev` starts app at localhost:5173
- [ ] `npm run lint` passes with zero errors
- [ ] `npm test` runs with zero failures (placeholder test passes)
- [ ] `npm run build` produces a working production build
- [ ] Tailwind CSS working (test with a colored div)
- [ ] TypeScript strict mode enabled (`strict: true` in tsconfig)
- [ ] `.env.example` committed with placeholder keys
- [ ] `.gitignore` covers node_modules, dist, .env

## After Implementation
- [ ] Run linter: `npm run lint`
- [ ] Run tests: `npm test`
- [ ] Manual verification steps:
  1. Uruchom `npm run dev` — sprawdź czy aplikacja otwiera się na localhost:5173
  2. Sprawdź czy tekst "Dotflow" jest widoczny w kolorze (Tailwind działa)
  3. Uruchom `npm run build` — sprawdź czy folder `dist/` został utworzony
  4. Sprawdź `tsconfig.json` — potwierdź `"strict": true`
  5. Sprawdź że `.env.example` istnieje i zawiera klucze Supabase
- [ ] Wait for user manual verification confirmation before /qa
