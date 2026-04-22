# Dotflow - Product Backlog

**Project:** Dotflow
**Version:** 1.0
**Last Updated:** 2026-04-09
**Product Owner:** Quamca
**Repository:** https://github.com/Quamca/dotflow

---

## 📊 Backlog Overview

| Milestone | Name | Status |
|-----------|------|--------|
| M1 | Core Journal + AI Follow-Up | 📋 Planned |
| M2 | Connections + Patterns | 📋 Planned |
| M3 | Multi-User + Mobile | 📋 Planned |

---

## 🎯 Epic Structure

```
EPIC-001: Dotflow M1 — Core Journal + AI Follow-Up
├── FEATURE-001: Project Setup & Infrastructure
├── FEATURE-002: CI/CD Pipeline
├── FEATURE-003: Settings — API Key Management
├── FEATURE-004: Entry Creation
├── FEATURE-005: AI Follow-Up Questions
└── FEATURE-006: Entry List View

EPIC-002: Dotflow M2 — Connections + Patterns
├── FEATURE-007: Entry Connection Detection
└── FEATURE-008: Pattern Summary

EPIC-003: Dotflow M3 — Multi-User + Mobile
├── FEATURE-009: Authentication
└── FEATURE-010: Mobile Application
```

---

# 📦 EPIC-001: Core Journal + AI Follow-Up

**Description:**
This epic delivers the complete MVP of Dotflow — a working personal journal where the user can write entries and receive AI-generated follow-up questions that deepen their reflection. The goal is a stable, usable daily tool that the user can open in a browser, write a thought, answer a couple of questions, and return to the next day.

This epic covers everything needed to go from zero to a deployed, functional application: project infrastructure, database setup, CI/CD pipeline, the core entry creation flow, and AI integration via the OpenAI API.

Success means the user completes their first full entry + follow-up cycle and says: "I want to do this again tomorrow."

**Business Value:**
Delivers the core value proposition: a journal that asks meaningful follow-up questions. Everything else (connections, patterns, multi-user) depends on this foundation being solid.

**Stakeholders:**
- Primary: Quamca (sole user and developer in M1)

**Success Metrics:**
- User completes at least 5 entries in first week
- Follow-up questions feel relevant and non-intrusive (subjective but testable by user)
- App loads in under 2 seconds

**Risks & Dependencies:**
- OpenAI API costs — mitigated by using GPT-4o-mini (cheapest capable model)
- Supabase free tier limits — unlikely to hit in single-user MVP
- AI question quality — requires prompt iteration during development

**Scope Boundaries:**
- **In scope:** Entry creation, AI follow-up, entry list, settings for API key, Supabase storage, Vercel deploy, CI/CD
- **Out of scope:** Entry connections, pattern summaries, user auth, mobile app, graph view

**Status:** 📋 Planned

---

## 🔧 FEATURE-001: Project Setup & Infrastructure

**Description:**
Before any feature work begins, the project needs a solid technical foundation: initialized React + Vite + TypeScript project, Tailwind CSS configured, Supabase client set up, and all development tooling in place (ESLint, Prettier, Vitest). This feature ensures every subsequent feature is built on a consistent, quality-controlled base.

**User Value:**
No direct user value — but makes everything else possible and maintainable. Without this, development is chaotic and inconsistent.

**Dependencies:**
- None (first feature)

**Scope Boundaries:**
- **Includes:** Project init, tooling config, Supabase schema creation, environment setup, branch protection
- **Excludes:** Any UI components or application logic

**Priority:** P0 (Critical)
**Status:** 📋 Planned

---

### US-001: Initialize React + Vite + TypeScript project

**Description:**
Set up the foundational project structure. After this US, `npm run dev` serves a running React app and `npm run lint` / `npm test` both execute without errors.

**As a** developer
**I want to** have a properly configured React project with TypeScript, Tailwind, ESLint, Prettier, and Vitest
**So that** I can start building features on a solid, consistent foundation

**Status:** 📋 Planned
**Story Points:** 3
**Priority:** P0

**Acceptance Criteria:**
- [ ] `npm run dev` starts app at localhost:5173
- [ ] `npm run lint` passes with zero errors
- [ ] `npm test` runs with zero failures (placeholder test passes)
- [ ] `npm run build` produces a working production build
- [ ] Tailwind CSS working (test with a colored div)
- [ ] TypeScript strict mode enabled (`strict: true` in tsconfig)
- [ ] `.env.example` committed with placeholder keys
- [ ] `.gitignore` covers node_modules, dist, .env

**Tasks:**
- [ ] **TASK-001.1:** Run `npm create vite@latest dotflow -- --template react-ts` - 30min
- [ ] **TASK-001.2:** Install and configure Tailwind CSS - 30min
- [ ] **TASK-001.3:** Install and configure ESLint + Prettier - 30min
- [ ] **TASK-001.4:** Install and configure Vitest + React Testing Library - 30min
- [ ] **TASK-001.5:** Create `.env.example` with Supabase placeholder keys - 15min
- [ ] **TASK-001.6:** Write placeholder test to verify Vitest works (/qa) - 15min
- [ ] **TASK-001.7:** Manual verification - 15min

---

### US-002: Create Supabase schema and configure environment

**Description:**
Create the three database tables in Supabase (entries, followups, connections) and connect the app to Supabase via the JS client. After this US, the app can read and write to the database.

**As a** developer
**I want to** have Supabase connected with the correct schema
**So that** entry data can be persisted and retrieved

**Status:** 📋 Planned
**Story Points:** 2
**Priority:** P0

**Acceptance Criteria:**
- [ ] Three tables created in Supabase: `entries`, `followups`, `connections`
- [ ] `@supabase/supabase-js` installed and configured
- [ ] `src/services/entryService.ts` created with placeholder CRUD functions
- [ ] RLS disabled on all tables (MVP — single user)
- [ ] `.env` with real Supabase keys works locally

**Tasks:**
- [ ] **TASK-002.1:** Run SQL schema in Supabase SQL Editor - 30min
- [ ] **TASK-002.2:** Install `@supabase/supabase-js`, create `src/lib/supabase.ts` client - 15min
- [ ] **TASK-002.3:** Create `src/services/entryService.ts` with stub functions - 30min
- [ ] **TASK-002.4:** Write tests for entryService stubs (/qa) - 30min
- [ ] **TASK-002.5:** Manual verification (test write/read from Supabase) - 15min

---

## 🔧 FEATURE-002: CI/CD Pipeline

**Description:**
Automate quality checks on every pull request. A GitHub Actions workflow runs linting, tests, and build verification on every PR to main. This prevents broken code from reaching main and enforces the Definition of Done automatically.

**User Value:**
No direct user value — but gives the developer confidence that every merge to main is working code. Critical for long-term maintainability.

**Dependencies:**
- FEATURE-001 (project must be initialized)

**Scope Boundaries:**
- **Includes:** GitHub Actions workflow for lint + test + build on PR
- **Excludes:** Automatic deployment (handled by Vercel), preview environments

**Priority:** P0 (Critical)
**Status:** 📋 Planned

---

### US-003: Set up GitHub Actions CI pipeline

**Description:**
Create a GitHub Actions workflow that runs on every PR to main. The workflow executes lint, test, and build. PRs with failing checks cannot be merged (enforced via branch protection).

**As a** developer
**I want to** have automated quality checks on every PR
**So that** I never accidentally merge broken code to main

**Status:** 📋 Planned
**Story Points:** 2
**Priority:** P0

**Acceptance Criteria:**
- [ ] `.github/workflows/ci.yml` exists and runs on PR to main
- [ ] Workflow runs: `npm run lint`, `npm test`, `npm run build`
- [ ] Failing any step fails the workflow
- [ ] Branch protection on main requires this check to pass
- [ ] Workflow completes in under 3 minutes

**Tasks:**
- [ ] **TASK-003.1:** Create `.github/workflows/ci.yml` with Node 20 + lint + test + build - 45min
- [ ] **TASK-003.2:** Push to test branch, open PR, verify workflow runs - 15min
- [ ] **TASK-003.3:** Enable required status check in GitHub branch protection settings - 15min
- [ ] **TASK-003.4:** Manual verification (intentionally break lint, verify PR blocked) - 15min

---

## 🔧 FEATURE-003: Settings — API Key Management

**Description:**
The user needs to provide their own OpenAI API key for AI features to work. This feature creates the Settings screen where the user can enter, save, and clear their API key. The key is stored locally in localStorage and never sent to any server other than OpenAI.

**User Value:**
Unlocks all AI features. Without this, the app is just a plain journal. The setup friction is worth it because the user controls their own API costs and their data stays in their own OpenAI account.

**Dependencies:**
- FEATURE-001

**Scope Boundaries:**
- **Includes:** Settings page, API key input, localStorage persistence, masked display, missing-key warning banner on Home
- **Excludes:** Any other settings (reserved for future)

**Priority:** P0 (Critical)
**Status:** 📋 Planned

---

### US-004: Settings screen with API key management

**Description:**
Create the Settings screen that allows the user to enter, save, and clear their OpenAI API key. The key is masked after saving and stored in localStorage. A warning banner appears on the Home screen when no key is set.

**As a** user
**I want to** enter my OpenAI API key in Settings
**So that** AI follow-up questions are enabled when I write entries

**Status:** 📋 Planned
**Story Points:** 3
**Priority:** P0

**Acceptance Criteria:**
- [ ] Settings screen accessible via ⚙ icon from Home
- [ ] User can type and save an API key
- [ ] Saved key is displayed masked: `sk-...xxxx` (last 4 chars visible)
- [ ] User can clear the saved key
- [ ] Key persists after page refresh (localStorage)
- [ ] Warning banner on Home screen when no key is set
- [ ] Info text: "Your key is stored locally on this device only"

**Tasks:**
- [ ] **TASK-004.1:** Create `src/hooks/useSettings.ts` with get/set/clear API key - 30min
- [ ] **TASK-004.2:** Create `src/pages/SettingsPage.tsx` with key input form - 45min
- [ ] **TASK-004.3:** Add masked display logic (show `sk-...xxxx`) - 20min
- [ ] **TASK-004.4:** Add warning banner component to HomePage - 20min
- [ ] **TASK-004.5:** Add routing: Home ↔ Settings via ⚙ icon - 20min
- [ ] **TASK-004.6:** Write tests for useSettings hook and warning banner (/qa) - 45min
- [ ] **TASK-004.7:** Manual verification - 15min

---

## 🔧 FEATURE-004: Entry Creation

**Description:**
The core feature of Dotflow — writing a journal entry. The user opens a clean writing screen, types freely, and submits. The entry is saved to Supabase. This feature covers the writing experience itself; AI follow-up questions are handled in FEATURE-005.

**User Value:**
This is the primary daily action. Without a great writing experience, nothing else matters. The interface should feel clean, distraction-free, and fast.

**Dependencies:**
- FEATURE-001, FEATURE-002 (infrastructure must be in place)

**Scope Boundaries:**
- **Includes:** New entry form, save to Supabase, navigation to/from Home, loading states, error states
- **Excludes:** AI follow-up (FEATURE-005), connection detection (FEATURE-007)

**Priority:** P0 (Critical)
**Status:** 📋 Planned

---

### US-005: New entry form and save to Supabase

**Description:**
Create the New Entry screen with a textarea and Save button. Submitting the entry saves it to Supabase and returns the user to the Home screen where the new entry appears.

**As a** user
**I want to** write a free-form journal entry and save it
**So that** my thoughts are recorded and I can review them later

**Status:** 📋 Planned
**Story Points:** 5
**Priority:** P0

**Acceptance Criteria:**
- [ ] New Entry screen accessible from Home via Write button
- [ ] Free-form textarea, no character limit
- [ ] Save button disabled when textarea is empty
- [ ] Loading state shown while saving
- [ ] Entry saved to Supabase `entries` table
- [ ] After save, user redirected to Home
- [ ] New entry appears at top of entry list
- [ ] Error state shown if save fails (content preserved)

**Tasks:**
- [ ] **TASK-005.1:** Implement `entryService.createEntry()` with Supabase INSERT - 30min
- [ ] **TASK-005.2:** Create `src/pages/NewEntryPage.tsx` with textarea and Save button - 45min
- [ ] **TASK-005.3:** Add disabled state logic (empty textarea) - 15min
- [ ] **TASK-005.4:** Add loading state and error handling - 30min
- [ ] **TASK-005.5:** Add routing: Home → New Entry → Home after save - 20min
- [ ] **TASK-005.6:** Write tests for form submission and error states (/qa) - 45min
- [ ] **TASK-005.7:** Manual verification - 15min

---

## 🔧 FEATURE-005: AI Follow-Up Questions

**Description:**
The feature that makes Dotflow more than a plain journal. After the user submits an entry, the AI analyzes the content and generates 2–3 targeted follow-up questions — asking about what's missing: emotions (if not mentioned), reflection (if absent), context (if unclear). The user answers, skips, or requests more questions before the entry is saved with the full Q&A.

**User Value:**
This is the differentiating feature. Follow-up questions nudge the user toward deeper reflection they might not have done on their own. Done well, they feel like a thoughtful friend asking the right question at the right moment.

**Dependencies:**
- FEATURE-003 (API key required), FEATURE-004 (entry creation flow)

**Scope Boundaries:**
- **Includes:** AI question generation via OpenAI, follow-up dialog UI, answer capture, save with Q&A, graceful degradation when no API key
- **Excludes:** Connection detection (FEATURE-007), pattern analysis (FEATURE-008)

**Priority:** P0 (Critical)
**Status:** 📋 Planned

---

### US-006: AI follow-up question generation and dialog

**Description:**
After the user submits an entry, trigger an OpenAI API call to generate 2–3 follow-up questions. Display them in a dialog, collect answers (or skips), then save the complete entry with all Q&A to Supabase.

**As a** user
**I want to** be asked 2–3 follow-up questions after writing an entry
**So that** I reflect more deeply on what I wrote

**Status:** 📋 Planned
**Story Points:** 8
**Priority:** P0

**Acceptance Criteria:**
- [ ] After entry submission (with API key set), FollowUpDialog appears
- [ ] AI generates 2–3 relevant questions based on entry content
- [ ] Questions shown one at a time with answer textarea
- [ ] User can skip any question (no answer recorded)
- [ ] "Ask me more" button adds up to 2 extra questions (max total: 5)
- [ ] "I'm done" button ends Q&A and shows Save Entry
- [ ] All answered follow-ups saved to `followups` table linked to entry
- [ ] If no API key: entry saves directly, info message shown
- [ ] If OpenAI call fails: entry saves directly, error message shown

**Tasks:**
- [ ] **TASK-006.1:** Create `src/services/aiService.ts` with `generateFollowUpQuestions()` - 60min
- [ ] **TASK-006.2:** Create follow-up question prompt in `src/utils/prompts.ts` - 30min
- [ ] **TASK-006.3:** Create `src/components/FollowUpDialog/FollowUpDialog.tsx` - 60min
- [ ] **TASK-006.4:** Implement skip, answer, next, ask-me-more, I'm done logic - 45min
- [ ] **TASK-006.5:** Implement `followupService.saveFollowUps()` in entryService - 30min
- [ ] **TASK-006.6:** Integrate dialog into NewEntryPage flow - 30min
- [ ] **TASK-006.7:** Handle no-API-key and API-failure graceful degradation - 30min
- [ ] **TASK-006.8:** Write tests for aiService, dialog interactions, and degradation (/qa) - 60min
- [ ] **TASK-006.9:** Manual verification - 20min

---

## 🔧 FEATURE-006: Entry List View

**Description:**
The Home screen shows all past entries in reverse chronological order. Each entry is a card showing date, content preview, and emotion tags. Clicking a card opens the full entry with all follow-up Q&A. This is the user's daily starting point — where they see their history and decide what to write next.

**User Value:**
Makes the journal useful over time. Without this, every entry disappears after writing. The list is where the user sees their "dots" accumulating.

**Dependencies:**
- FEATURE-004 (entries must exist to display)

**Scope Boundaries:**
- **Includes:** Entry list with cards, empty state, entry detail view, chronological sort
- **Excludes:** Connection badges (added in FEATURE-007), search/filter (post-MVP)

**Priority:** P1 (High)
**Status:** 📋 Planned

---

### US-007: Home screen entry list and entry detail view

**Description:**
Implement the Home screen that loads and displays all entries from Supabase, sorted newest first. Each entry is a clickable card. Clicking opens the full detail view showing the entry content and all follow-up Q&A.

**As a** user
**I want to** see all my past entries and read them in full
**So that** I can review my thoughts and track how I've been feeling

**Status:** 📋 Planned
**Story Points:** 5
**Priority:** P1

**Acceptance Criteria:**
- [ ] Home screen loads all entries from Supabase on mount
- [ ] Entries displayed newest first
- [ ] Each card shows: date (formatted), content preview (2 lines, truncated), emotion tags
- [ ] Empty state shown when no entries: illustration + "Write your first entry" CTA
- [ ] Loading skeleton shown while fetching
- [ ] Clicking card navigates to Entry Detail view
- [ ] Entry Detail shows: full content, date, all follow-up Q&A (questions + answers)
- [ ] Back button from Detail returns to Home

**Tasks:**
- [ ] **TASK-007.1:** Implement `entryService.getEntries()` with Supabase SELECT + ORDER BY created_at DESC - 30min
- [ ] **TASK-007.2:** Implement `entryService.getEntryById()` with followups JOIN - 30min
- [ ] **TASK-007.3:** Create `src/components/EntryCard/EntryCard.tsx` - 30min
- [ ] **TASK-007.4:** Create `src/pages/HomePage.tsx` with list + loading + empty states - 45min
- [ ] **TASK-007.5:** Create `src/pages/EntryDetailPage.tsx` - 30min
- [ ] **TASK-007.6:** Write tests for EntryCard, empty state, and list rendering (/qa) - 45min
- [ ] **TASK-007.7:** Manual verification - 15min

---

# 📦 EPIC-002: Connections + Patterns

**Description:**
Building on the foundation of M1, this epic adds the "connecting the dots" intelligence — the feature that makes Dotflow unique. When a new entry is saved, the AI compares it to past entries and identifies meaningful connections. If a connection is found, a subtle badge appears linking the two entries. Over time, a Pattern Summary feature surfaces recurring themes the user may not consciously recognize.

This is where Dotflow graduates from "AI-enhanced journal" to "self-knowledge tool."

**Business Value:**
Delivers the differentiated value proposition. Connection detection and pattern insights are what separate Dotflow from any standard journaling app. This makes the product worth recommending.

**Stakeholders:**
- Primary: Quamca (user and developer)
- Future: potential early users if product shared

**Success Metrics:**
- Connection detection fires on at least 20% of entries (meaningful, not noise)
- User notices at least one non-obvious pattern in their behavior
- Pattern summary is read (not ignored)

**Risks & Dependencies:**
- Connection quality depends on prompt quality — requires iteration
- Requires 5+ entries to have meaningful connections to detect
- OpenAI cost increases with connection detection (more tokens per entry save)

**Scope Boundaries:**
- **In scope:** Connection detection on entry save, connection badge in entry list/detail, pattern summary generation
- **Out of scope:** Graph visualization (Post-MVP), automated insights via email

**Status:** 📋 Planned

---

## 🔧 FEATURE-007: Entry Connection Detection

**Description:**
After an entry is saved, the AI compares it to the 10 most recent past entries and identifies whether any share a meaningful emotional or situational pattern. If similarity score exceeds the threshold (0.7), a connection record is saved and a subtle badge appears on the entry.

**User Value:**
The moment a user sees "Connected to entry from 3 weeks ago" and reads the linked entry and thinks "wow, I do this every time" — that's the core value of Dotflow delivered.

**Dependencies:**
- EPIC-001 fully complete (entries must exist)

**Scope Boundaries:**
- **Includes:** AI connection detection, connection storage, connection badge in UI
- **Excludes:** Graph view (future), manual connection creation (future)

**Priority:** P0 (Critical for M2)
**Status:** 📋 Planned

---

### US-101: AI connection detection on entry save

**Description:**
After a new entry is saved, run a background AI check comparing it to the 10 most recent entries. If a meaningful connection is found (score ≥ 0.7), store it and display a connection badge on the new entry.

**As a** user
**I want to** see when a new entry connects to a past entry
**So that** I can recognize recurring patterns in my thoughts and behavior

**Status:** 📋 Planned
**Story Points:** 8
**Priority:** P0

**Acceptance Criteria:**
- [ ] Connection check runs in background after entry save (does not delay UI)
- [ ] AI compares new entry to 10 most recent past entries
- [ ] If similarity score ≥ 0.7, connection stored in `connections` table
- [ ] Connection badge appears on entry card: "Connected to [date]"
- [ ] Clicking badge navigates to connected entry
- [ ] If no connection found: no badge, no error

**Tasks:**
- [ ] **TASK-101.1:** Create connection detection prompt in `src/utils/prompts.ts` - 45min
- [ ] **TASK-101.2:** Implement `aiService.findConnection()` - 60min
- [ ] **TASK-101.3:** Implement `entryService.saveConnection()` - 30min
- [ ] **TASK-101.4:** Implement `entryService.getConnectionsForEntry()` - 20min
- [ ] **TASK-101.5:** Create `src/components/ConnectionBadge/ConnectionBadge.tsx` - 30min
- [ ] **TASK-101.6:** Integrate connection check into entry save flow (background) - 30min
- [ ] **TASK-101.7:** Write tests for connection detection and badge rendering (/qa) - 60min
- [ ] **TASK-101.8:** Manual verification - 20min

---

## 🔧 FEATURE-008: Pattern Summary

**Description:**
When the user has 10+ entries, a "Generate insights" button becomes available. Clicking it sends recent entries to the AI, which returns 3–5 observations about recurring patterns — emotional trends, repeated situations, or behavioral triggers.

**User Value:**
Gives the user a bird's-eye view of their patterns without requiring them to read all entries. The AI does the synthesis work.

**Dependencies:**
- FEATURE-007 (connections should exist to make patterns richer)

**Scope Boundaries:**
- **Includes:** Insights button (gated at 10 entries), AI summary generation, display of bullet-point observations
- **Excludes:** Persistent insight storage, scheduled insights, email delivery

**Priority:** P1 (High for M2)
**Status:** 📋 Planned

---

### US-102: AI pattern summary generation

**Description:**
Add a "Generate insights" button on the Home screen, visible when 10+ entries exist. Clicking generates an AI summary of recurring patterns across recent entries, displayed as 3–5 bullet observations.

**As a** user
**I want to** get an AI-generated summary of my recurring patterns
**So that** I can see behavioral trends I might not notice day to day

**Status:** 📋 Planned
**Story Points:** 5
**Priority:** P1

**Acceptance Criteria:**
- [ ] "Generate insights" button visible when entry count ≥ 10
- [ ] Clicking sends 10 most recent entries to AI
- [ ] AI returns 3–5 bullet-point observations
- [ ] Observations displayed in a readable summary card
- [ ] Clear label: "AI-generated observations — not clinical advice"
- [ ] Loading state during generation

**Tasks:**
- [ ] **TASK-102.1:** Create pattern summary prompt in `src/utils/prompts.ts` - 30min
- [ ] **TASK-102.2:** Implement `aiService.generatePatternSummary()` - 45min
- [ ] **TASK-102.3:** Create `src/components/PatternSummary/PatternSummary.tsx` - 30min
- [ ] **TASK-102.4:** Gate button on entry count ≥ 10 - 15min
- [ ] **TASK-102.5:** Write tests for summary generation and display (/qa) - 45min
- [ ] **TASK-102.6:** Manual verification - 15min

---

# 📦 EPIC-003: Multi-User + Mobile

**Description:**
Extends Dotflow beyond a single-user personal tool to support multiple accounts and mobile usage. This epic enables Supabase Auth, Row Level Security, a backend proxy for the OpenAI API key (so users don't need their own), and a React Native mobile companion.

This is the productization epic — turning a personal tool into something shareable.

**Business Value:**
Unlocks the ability to share Dotflow with others, gather feedback from real users, and potentially monetize. Also unlocks mobile use case — writing entries on the go.

**Stakeholders:**
- Future early users / beta testers
- Quamca as product owner exploring wider release

**Success Metrics:**
- 3+ real users using the app for 2+ weeks
- Mobile app installs > 10

**Risks & Dependencies:**
- Requires backend server (breaks MVP's no-server architecture)
- Auth adds complexity and potential friction for new users
- React Native is a significant scope increase

**Scope Boundaries:**
- **In scope:** Supabase Auth, RLS, backend proxy for OpenAI, React Native app
- **Out of scope:** Payment/subscription, admin panel, social features

**Status:** 📋 Planned

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| 📋 | Planned |
| 🔄 | In Progress |
| ✅ | Completed |
| ⏸️ | On Hold |
| ❌ | Cancelled |

---

## Story Point Scale (Fibonacci)

| Points | Complexity | Typical Duration |
|--------|------------|------------------|
| 1 | Trivial | < 1 hour |
| 2 | Simple | 1–2 hours |
| 3 | Moderate | 2–4 hours |
| 5 | Complex | 4–8 hours |
| 8 | Very Complex | 1–2 days |
| 13 | Epic-level | 2–3 days |
| 21 | Should be split | 3+ days |

---

## Priority Definitions

| Priority | Definition | SLA |
|----------|------------|-----|
| P0 | Critical — blocks everything | Immediate |
| P1 | High — core functionality | This sprint |
| P2 | Medium — important but not urgent | Next sprint |
| P3 | Low — nice to have | Backlog |

---

## Definition of Done (Global)

A User Story is DONE when:
- [ ] All Acceptance Criteria are met
- [ ] Code passes linting (`npm run lint`)
- [ ] All tests pass (`npm test`)
- [ ] Test coverage meets standards
- [ ] Manual verification completed
- [ ] Code reviewed (self-review for solo dev)
- [ ] Documentation updated (/docs agent)
- [ ] PR merged to main
- [ ] Branch cleaned up

---

*This backlog is a living document — update after every /discover, /planning, and /docs session.*
