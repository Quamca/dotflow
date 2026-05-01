# Dotflow - Product Backlog

**Project:** Dotflow
**Version:** 1.5
**Last Updated:** 2026-05-01 (US-210: Contextual Follow-Up Questions Between Lines completed)
**Product Owner:** Quamca
**Repository:** https://github.com/Quamca/dotflow

---

## 🐛 Known Bugs

| ID | Description | Priority | Reported in |
|----|-------------|----------|-------------|
| BUG-001 | StarField tooltips (StoryNode + StarNode) are too narrow — content gets clipped, width needs increase | Low | US-206 manual verification |
| BUG-002 | StoryNode tooltip does not close when clicking outside — requires hovering another star or waiting 3s | Medium | US-207 manual verification |
| BUG-003 | Follow-up questions use storyContext from past entries but user has no visibility into this — questions about "rodzina" or "góry" feel like hallucinations when user doesn't realize the AI read prior stories | Medium | US-210 manual verification |
| BUG-004 | New entries are not visually distinguished from older entries in the 3D sky — user cannot easily find the most recent star; feature request: most recently added star should blink/pulse | Low | US-210 manual verification |

---

## 📊 Backlog Overview

| Milestone | Name | Status |
|-----------|------|--------|
| M1 | Core Journal + AI Follow-Up | ✅ Completed |
| M2 | Connections + Patterns | ✅ Completed |
| M2.5 | Experience Depth (pre-M3) | 🔄 In Progress |
| M3 | Multi-User + Mobile | ⏸️ Blocked — M2.5 must complete first |

> **M3 Blocker:** M3 will not start until all M2.5 P0/P1 items are complete: 3D Visualization (US-201, US-202), Story Extraction (US-206, P0), Emotion Intelligence (US-207), Contextual Follow-Up (US-210), Adaptive Pattern Summaries (US-205), Life Area Zones (US-208), AI Communication Principles document. US-204 (Onboarding, P2) and US-209 (Typed Connections, P2) may follow the M3 gate. Security/Privacy Messaging (FEATURE-015) is a M3 item, not a blocker.

> **Test Corpus:** `docs/test_corpus.md` contains 15 predefined Polish-language journal entries for manual AI verification. Use these instead of random text when verifying connection detection (US-101), pattern summary (US-102), and values extraction (US-202). See `docs/test_cases.md` section 6 for step-by-step instructions referencing specific corpus entries.

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

EPIC-002b: Dotflow M2.5 — Experience Depth (pre-M3)
├── FEATURE-011: 3D Entry Visualization ("Gwiezdne niebo")
├── FEATURE-012: Insight Feedback Loop
├── FEATURE-013: User Onboarding & Instructions         [P2 — after story model]
├── FEATURE-014: Adaptive Pattern Summaries
├── FEATURE-015: Security & Privacy Messaging           [deferred to M3]
├── FEATURE-016: Story Extraction                       [P0 — architectural pivot]
├── FEATURE-017: Emotion Intelligence per Story         [P1]
├── FEATURE-018: Contextual Follow-Up Questions         [P1] ✅ Completed
├── FEATURE-019: Life Area Zones                        [P1]
└── FEATURE-020: Typed Connection Visualization         [P2]

EPIC-003: Dotflow M3 — Multi-User + Mobile             [BLOCKED — M2.5 first]
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

**Status:** ✅ Completed

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
**Status:** ✅ Completed

---

### US-001: Initialize React + Vite + TypeScript project

**Description:**
Set up the foundational project structure. After this US, `npm run dev` serves a running React app and `npm run lint` / `npm test` both execute without errors.

**As a** developer
**I want to** have a properly configured React project with TypeScript, Tailwind, ESLint, Prettier, and Vitest
**So that** I can start building features on a solid, consistent foundation

**Status:** ✅ Completed
**Story Points:** 3
**Priority:** P0

**Acceptance Criteria:**
- [x] `npm run dev` starts app at localhost:5173
- [x] `npm run lint` passes with zero errors
- [x] `npm test` runs with zero failures (placeholder test passes)
- [x] `npm run build` produces a working production build
- [x] Tailwind CSS working (test with a colored div)
- [x] TypeScript strict mode enabled (`strict: true` in tsconfig)
- [x] `.env.example` committed with placeholder keys
- [x] `.gitignore` covers node_modules, dist, .env

**Tasks:**
- [x] **TASK-001.1:** Run `npm create vite@latest dotflow -- --template react-ts` - 30min
- [x] **TASK-001.2:** Install and configure Tailwind CSS - 30min
- [x] **TASK-001.3:** Install and configure ESLint + Prettier - 30min
- [x] **TASK-001.4:** Install and configure Vitest + React Testing Library - 30min
- [x] **TASK-001.5:** Create `.env.example` with Supabase placeholder keys - 15min
- [x] **TASK-001.6:** Write placeholder test to verify Vitest works (/qa) - 15min
- [x] **TASK-001.7:** Manual verification - 15min

---

### US-002: Create Supabase schema and configure environment

**Description:**
Create the three database tables in Supabase (entries, followups, connections) and connect the app to Supabase via the JS client. After this US, the app can read and write to the database.

**As a** developer
**I want to** have Supabase connected with the correct schema
**So that** entry data can be persisted and retrieved

**Status:** ✅ Completed
**Story Points:** 2
**Priority:** P0

**Acceptance Criteria:**
- [x] Three tables created in Supabase: `entries`, `followups`, `connections`
- [x] `@supabase/supabase-js` installed and configured
- [x] `src/services/entryService.ts` created with placeholder CRUD functions
- [x] RLS disabled on all tables (MVP — single user)
- [x] `.env` with real Supabase keys works locally

**Tasks:**
- [x] **TASK-002.1:** Run SQL schema in Supabase SQL Editor - 30min
- [x] **TASK-002.2:** Install `@supabase/supabase-js`, create `src/lib/supabase.ts` client - 15min
- [x] **TASK-002.3:** Create `src/services/entryService.ts` with stub functions - 30min
- [x] **TASK-002.4:** Write tests for entryService stubs (/qa) - 30min
- [x] **TASK-002.5:** Manual verification (test write/read from Supabase) - 15min

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
**Status:** ✅ Completed

---

### US-003: Set up GitHub Actions CI pipeline

**Description:**
Create a GitHub Actions workflow that runs on every PR to main. The workflow executes lint, test, and build. PRs with failing checks cannot be merged (enforced via branch protection).

**As a** developer
**I want to** have automated quality checks on every PR
**So that** I never accidentally merge broken code to main

**Status:** ✅ Completed
**Story Points:** 2
**Priority:** P0

**Acceptance Criteria:**
- [x] `.github/workflows/ci.yml` exists and runs on PR to main
- [x] Workflow runs: `npm run lint`, `npm test`, `npm run build`
- [x] Failing any step fails the workflow
- [x] Branch protection on main requires this check to pass
- [x] Workflow completes in under 3 minutes

**Tasks:**
- [x] **TASK-003.1:** Create `.github/workflows/ci.yml` with Node 20 + lint + test + build - 45min
- [x] **TASK-003.2:** Push to test branch, open PR, verify workflow runs - 15min
- [x] **TASK-003.3:** Enable required status check in GitHub branch protection settings - 15min
- [x] **TASK-003.4:** Manual verification (intentionally break lint, verify PR blocked) - 15min

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
**Status:** ✅ Completed

---

### US-004: Settings screen with API key management

**Description:**
Create the Settings screen that allows the user to enter, save, and clear their OpenAI API key. The key is masked after saving and stored in localStorage. A warning banner appears on the Home screen when no key is set.

**As a** user
**I want to** enter my OpenAI API key in Settings
**So that** AI follow-up questions are enabled when I write entries

**Status:** ✅ Completed
**Story Points:** 3
**Priority:** P0

**Acceptance Criteria:**
- [x] Settings screen accessible via ⚙ icon from Home
- [x] User can type and save an API key
- [x] Saved key is displayed masked: `sk-...xxxx` (last 4 chars visible)
- [x] User can clear the saved key
- [x] Key persists after page refresh (localStorage)
- [x] Warning banner on Home screen when no key is set
- [x] Info text: "Your key is stored locally on this device only"

**Tasks:**
- [x] **TASK-004.1:** Create `src/hooks/useSettings.ts` with get/set/clear API key - 30min
- [x] **TASK-004.2:** Create `src/pages/SettingsPage.tsx` with key input form - 45min
- [x] **TASK-004.3:** Add masked display logic (show `sk-...xxxx`) - 20min
- [x] **TASK-004.4:** Add warning banner component to HomePage - 20min
- [x] **TASK-004.5:** Add routing: Home ↔ Settings via ⚙ icon - 20min
- [x] **TASK-004.6:** Write tests for useSettings hook and warning banner (/qa) - 45min
- [x] **TASK-004.7:** Manual verification - 15min

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
**Status:** ✅ Completed

---

### US-005: New entry form and save to Supabase

**Description:**
Create the New Entry screen with a textarea and Save button. Submitting the entry saves it to Supabase and returns the user to the Home screen where the new entry appears.

**As a** user
**I want to** write a free-form journal entry and save it
**So that** my thoughts are recorded and I can review them later

**Status:** ✅ Completed
**Story Points:** 5
**Priority:** P0

**Acceptance Criteria:**
- [x] New Entry screen accessible from Home via Write button
- [x] Free-form textarea, no character limit
- [x] Save button disabled when textarea is empty
- [x] Loading state shown while saving
- [x] Entry saved to Supabase `entries` table
- [x] After save, user redirected to Home
- [x] Error state shown if save fails (content preserved)

**Tasks:**
- [x] **TASK-005.1:** Implement `entryService.createEntry()` with Supabase INSERT - 30min (done in US-002)
- [x] **TASK-005.2:** Create `src/pages/NewEntryPage.tsx` with textarea and Save button - 45min
- [x] **TASK-005.3:** Add disabled state logic (empty textarea) - 15min
- [x] **TASK-005.4:** Add loading state and error handling - 30min
- [x] **TASK-005.5:** Add routing: Home → New Entry → Home after save - 20min
- [x] **TASK-005.6:** Write tests for form submission and error states (/qa) - 45min
- [x] **TASK-005.7:** Manual verification - 15min

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
**Status:** ✅ Completed

---

### US-006: AI follow-up question generation and dialog

**Description:**
After the user submits an entry, trigger an OpenAI API call to generate 2–3 follow-up questions. Display them in a dialog, collect answers (or skips), then save the complete entry with all Q&A to Supabase.

**As a** user
**I want to** be asked 2–3 follow-up questions after writing an entry
**So that** I reflect more deeply on what I wrote

**Status:** ✅ Completed
**Story Points:** 8
**Priority:** P0

**Acceptance Criteria:**
- [x] After entry submission (with API key set), FollowUpDialog appears
- [x] AI generates 2–3 relevant questions based on entry content
- [x] Questions shown one at a time with answer textarea
- [x] User can skip any question (no answer recorded)
- [x] "Ask me more" button adds up to 2 extra questions (max total: 5)
- [x] "I'm done" button ends Q&A and shows Save Entry
- [x] All answered follow-ups saved to `followups` table linked to entry
- [x] If no API key: entry saves directly, info message shown
- [x] If OpenAI call fails: entry saves directly, error message shown

**Tasks:**
- [x] **TASK-006.1:** Create `src/services/aiService.ts` with `generateFollowUpQuestions()` - 60min
- [x] **TASK-006.2:** Create follow-up question prompt in `src/utils/prompts.ts` - 30min
- [x] **TASK-006.3:** Create `src/components/FollowUpDialog/FollowUpDialog.tsx` - 60min
- [x] **TASK-006.4:** Implement skip, answer, next, ask-me-more, I'm done logic - 45min
- [x] **TASK-006.5:** Implement `followupService.saveFollowUps()` in entryService - 30min
- [x] **TASK-006.6:** Integrate dialog into NewEntryPage flow - 30min
- [x] **TASK-006.7:** Handle no-API-key and API-failure graceful degradation - 30min
- [x] **TASK-006.8:** Write tests for aiService, dialog interactions, and degradation (/qa) - 60min
- [x] **TASK-006.9:** Manual verification - 20min

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
**Status:** ✅ Completed

---

### US-007: Home screen entry list and entry detail view

**Description:**
Implement the Home screen that loads and displays all entries from Supabase, sorted newest first. Each entry is a clickable card. Clicking opens the full detail view showing the entry content and all follow-up Q&A.

**As a** user
**I want to** see all my past entries and read them in full
**So that** I can review my thoughts and track how I've been feeling

**Status:** ✅ Completed
**Story Points:** 5
**Priority:** P1

**Acceptance Criteria:**
- [x] Home screen loads all entries from Supabase on mount
- [x] Entries displayed newest first
- [x] Each card shows: date (formatted), content preview (2 lines, truncated), emotion tags
- [x] Empty state shown when no entries: illustration + "Write your first entry" CTA
- [x] Loading skeleton shown while fetching
- [x] Clicking card navigates to Entry Detail view
- [x] Entry Detail shows: full content, date, all follow-up Q&A (questions + answers)
- [x] Back button from Detail returns to Home

**Tasks:**
- [x] **TASK-007.1:** Implement `entryService.getEntries()` with Supabase SELECT + ORDER BY created_at DESC - done in US-002
- [x] **TASK-007.2:** Implement `entryService.getEntryById()` with followups JOIN - done in US-002
- [x] **TASK-007.3:** Create `src/components/EntryCard/EntryCard.tsx` - 30min
- [x] **TASK-007.4:** Update `src/pages/HomePage.tsx` with entry list + loading skeleton + empty state - 45min
- [x] **TASK-007.5:** Create `src/pages/EntryDetailPage.tsx` + add `/entry/:id` route to App.tsx - 30min
- [x] **TASK-007.6:** Write tests for EntryCard, empty state, and list rendering (/qa) - 45min
- [x] **TASK-007.7:** Manual verification - 15min

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

**Status:** 🔄 In Progress

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
**Status:** ✅ Completed

---

### US-101: AI connection detection on entry save

**Description:**
After a new entry is saved, run a background AI check comparing it to the 10 most recent entries. If a meaningful connection is found (score ≥ 0.7), store it and display a connection badge on the new entry.

**As a** user
**I want to** see when a new entry connects to a past entry
**So that** I can recognize recurring patterns in my thoughts and behavior

**Status:** ✅ Completed
**Story Points:** 8
**Priority:** P0

**Acceptance Criteria:**
- [x] Connection check runs in background after entry save (does not delay UI)
- [x] AI compares new entry to 10 most recent past entries
- [x] If similarity score ≥ 0.7, connection stored in `connections` table
- [x] Connection badge appears on entry card: "Connected to [date]"
- [x] Clicking badge navigates to connected entry
- [x] If no connection found: no badge, no error

**Tasks:**
- [x] **TASK-101.1:** Create connection detection prompt in `src/utils/prompts.ts` - 45min
- [x] **TASK-101.2:** Implement `aiService.findConnection()` - 60min
- [x] **TASK-101.3:** Implement `entryService.saveConnection()` - 30min
- [x] **TASK-101.4:** Implement `entryService.getConnectionsForEntry()` - 20min
- [x] **TASK-101.5:** Create `src/components/ConnectionBadge/ConnectionBadge.tsx` - 30min
- [x] **TASK-101.6:** Integrate connection check into entry save flow (background) - 30min
- [x] **TASK-101.7:** Write tests for connection detection and badge rendering (/qa) - 60min
- [x] **TASK-101.8:** Manual verification - 20min

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
**Status:** ✅ Completed

---

### US-103: Fix AI insights language — respond in entry language

**Description:**
AI-generated pattern summary observations are returned in English regardless of the language the user writes in. The prompt must instruct the AI to respond in the same language as the journal entries.

**As a** user
**I want to** receive AI insights in my own language
**So that** the summaries feel natural and readable without switching context

**Status:** ✅ Completed
**Story Points:** 1
**Priority:** P1

**Acceptance Criteria:**
- [x] Pattern summary observations are returned in the language of the journal entries
- [x] No hardcoded language in prompt — AI auto-detects from entry content

**Tasks:**
- [x] **TASK-103.1:** Update `PATTERN_SUMMARY_SYSTEM_PROMPT` in `src/utils/prompts.ts` to add language instruction - 15min
- [x] **TASK-103.2:** Manual verification (write entries in Polish, verify insights in Polish) - 10min

---

### US-102: AI pattern summary generation

**Description:**
Add a "Generate insights" button on the Home screen, visible when 10+ entries exist. Clicking generates an AI summary of recurring patterns across recent entries, displayed as 3–5 bullet observations.

**As a** user
**I want to** get an AI-generated summary of my recurring patterns
**So that** I can see behavioral trends I might not notice day to day

**Status:** ✅ Completed
**Story Points:** 5
**Priority:** P1

**Acceptance Criteria:**
- [x] "Generate insights" button visible when entry count ≥ 10
- [x] Clicking sends 10 most recent entries to AI
- [x] AI returns 3–5 bullet-point observations
- [x] Observations displayed in a readable summary card
- [x] Clear label: "AI-generated observations — not clinical advice"
- [x] Loading state during generation

**Tasks:**
- [x] **TASK-102.1:** Create pattern summary prompt in `src/utils/prompts.ts` - 30min
- [x] **TASK-102.2:** Implement `aiService.generatePatternSummary()` - 45min
- [x] **TASK-102.3:** Create `src/components/PatternSummary/PatternSummary.tsx` - 30min
- [x] **TASK-102.4:** Gate button on entry count ≥ 10 - 15min
- [x] **TASK-102.5:** Write tests for summary generation and display (/qa) - 45min
- [x] **TASK-102.6:** Manual verification - 15min

---

# 📦 EPIC-002b: Experience Depth (M2.5 — pre-M3)

**Description:**
Before opening Dotflow to other users, the product needs to feel complete, trustworthy, and intuitive for the current user. This epic covers depth of experience: a visual representation of the journal universe, smarter AI interactions, user guidance, and clear privacy communication.

**Business Value:**
Makes Dotflow genuinely compelling before it becomes multi-user. A user who understands and trusts the product is the foundation for word-of-mouth growth in M3.

**Stakeholders:**
- Quamca (sole user, product owner)

**M3 Gate:** M3 cannot begin until all features in this epic are complete.

**Status:** 🔄 In Progress

---

## 🔧 FEATURE-011: 3D Entry Visualization — "Gwiezdne niebo"

**Description:**
A 3D star-field visualization where each entry is a star in space. Connections between entries appear as constellation lines. The visualization lives as a blurred background on Home and can be toggled into full focus mode. At the center sits a "black hole" representing the user's psychological core — it grows as entries accumulate and eventually anchors a values-based positioning system.

**User Value:**
Gives the user a spatial, emotional sense of their journal universe. Progress feels visible beyond a growing list. The psychological center makes the app feel alive and personal.

**Dependencies:**
- FEATURE-007 (connections data needed for constellation lines)
- FEATURE-008 (insights data used by black hole)

**Technology:**
- `react-three-fiber` — React renderer for Three.js
- `@react-three/drei` — helpers: OrbitControls, Stars, etc.

**Scope Boundaries:**
- **Phase 1 (US-201):** Star field, toggle, orbit controls, hover preview
- **Phase 2 (US-202):** Black hole, values extraction, psychological positioning
- **Excludes:** Animated flythrough, VR mode, sharing visualization

**Priority:** P1
**Status:** ✅ Completed

---

### US-201: 3D Star Field — Basic Visualization

**Description:**
Render a 3D star field on the Home screen background. Each journal entry is a star. Existing connections appear as subtle lines between stars. A toggle button (easter egg under the Dotflow logo, top-right) switches between the normal entry list view and full 3D exploration mode.

**As a** user
**I want to** see my journal entries as stars in a 3D space
**So that** I have a visual, spatial sense of my writing history beyond a flat list

**Status:** ✅ Completed
**Story Points:** 8
**Priority:** P1

**Acceptance Criteria:**
- [x] Home background shows blurred 3D star field (one star per entry)
- [x] Constellation lines connect entries that have a saved `connection` record
- [x] Dotflow logo (top-left header) is the easter egg toggle — clicking it switches between list view and 3D mode
- [x] Clicking logo: entry list fades out, 3D scene becomes unblurred and interactive
- [x] Clicking logo again: returns to normal list view
- [x] Hover on a star shows entry preview (date + content snippet)
- [x] Orbit controls work: rotate, pan, zoom (like 3D modeling software)
- [x] Star size reflects recency or connection count (larger = more prominent)
- [x] Performance: no visible lag on 50+ entries

**Tasks:**
- [x] **TASK-201.1:** Install react-three-fiber, @react-three/drei - 15min
- [x] **TASK-201.2:** Create `src/components/StarField/StarField.tsx` — basic 3D scene - 90min
- [x] **TASK-201.3:** Map entries to star positions (stable, derived from entry id) - 30min
- [x] **TASK-201.4:** Render constellation lines from connections data - 45min
- [x] **TASK-201.5:** Add blur/unblur toggle with transition - 30min
- [x] **TASK-201.6:** Hover interaction — entry preview tooltip - 30min
- [x] **TASK-201.7:** Add OrbitControls - 15min
- [x] **TASK-201.8:** Write tests for StarField component (/qa) - 45min
- [x] **TASK-201.9:** Manual verification - 20min

---

### US-202: Black Hole & Psychological Profile

**Description:**
Add a "black hole" at the center of the star field — a visual representation of the user's psychological core. It grows subtly as entry count increases (capped at a maximum size). Hovering on it shows the current insight. The user's values are extracted semi-automatically (AI proposes 5 values after sufficient entries; user confirms or edits). Entry positions in 3D space reflect alignment with those values: closer to center = closer to the user's values.

**As a** user
**I want to** see a living center in my star field that reflects my values and grows with my entries
**So that** I feel a sense of psychological depth and personal progress in the visualization

**Status:** ✅ Completed
**Story Points:** 13
**Priority:** P1

**Acceptance Criteria:**
- [x] Black hole visible at center of 3D scene
- [x] Size scales with entry count (min size at 1 entry, max size capped at ~15% of scene)
- [x] Hover on black hole shows current pattern insight (black hole is an additional channel — does NOT replace "Generate insights" button; button stays until US-205 glow/pulse signal is implemented)
- [x] After N entries (TBD during implementation, min 5), AI proposes 5 recurring themes using observational framing: "W Twoich wpisach te tematy wracają najczęściej: X, Y, Z..."
- [x] Values modal includes: AI-proposed list, "Co z tej listy brzmi jak Twoje? Możesz zmienić, usunąć, dodać." instructions, "Żadna z tych" escape hatch + free text field
- [x] Confirmed values stored in localStorage (no DB schema change)
- [x] Star positions update to reflect value alignment once values are confirmed
- [x] Entries aligned with values appear closer to black hole; divergent entries appear further

**Tasks:**
- [x] **TASK-202.1:** Create black hole mesh in StarField scene - 45min
- [x] **TASK-202.2:** Scale black hole size based on entry count (with cap) - 20min
- [x] **TASK-202.3:** Hover on black hole → show insight (reuse PatternSummary data) - 30min
- [x] **TASK-202.4:** Implement `aiService.extractUserValues()` — proposes 5 themes using observational-data language - 60min
- [x] **TASK-202.5:** Create values confirmation modal with observational framing + escape hatch - 45min
- [x] **TASK-202.6:** Implement value alignment scoring per entry - 45min
- [x] **TASK-202.7:** Update star positions based on value alignment scores - 30min
- [x] **TASK-202.8:** Write tests (/qa) - 60min
- [x] **TASK-202.9:** Manual verification - 20min

---

## 🔧 FEATURE-012: Insight Feedback Loop

**Description:**
When the user reads an insight (from black hole hover), they can push back: "I disagree, because...". The AI responds with a single deepening question — it never updates the insight through conversation. The insight can only change when new entries are written and the depth accumulator threshold is crossed again.

**User Value:**
Transforms passive insights into a conversation. The user feels heard but also gently redirected toward writing — which is where deeper processing happens.

**Dependencies:**
- US-202 (black hole + insight display)
- AI Communication Principles document (must be defined before implementation)

**AI Behavior Rules (per docs/ai_communication_principles.md):**
- One mode only: respond with a single deepening question using observational-data language
- Insight never updates through conversation — only through new entries
- Max 2 dialogue rounds; after round 2: *"To brzmi jak coś wartego zapisania."* → highlight Write Entry button
- Never: confront contradictions between entries, even if detected
- Never: simply agree to make the user feel good
- Never: clinical interpretation

**Deepening question rules:**
- Open question, max 15 words, tone neutral-curious
- Safe openers: "Co sprawia, że...", "Skąd pochodzi to poczucie, że...", "Jak rozumiesz...", "Co w tym jest dla Ciebie ważne..."
- Forbidden: "Dlaczego...", "Ale...", any reference to the insight in the question text

**Scope Boundaries:**
- **Includes:** Disagree input, single-mode AI deepening response, max 2 round limit with write redirect
- **Excludes:** Persistence of feedback conversation (deferred decision), clinical-level interpretation

**Priority:** P1
**Status:** ✅ Completed

---

### US-203: Dialectical Insight Response

**Description:**
After viewing an insight (on black hole hover), the user can tap "I disagree" and type their reason. The AI always responds with a single deepening question — it never updates the insight. Max 2 rounds of dialogue; after round 2, the AI gently redirects to writing a new entry.

**As a** user
**I want to** be able to push back on AI insights
**So that** the insights feel like a real dialogue, not just a one-way summary I must accept

**Status:** ✅ Completed
**Story Points:** 5
**Priority:** P1

**Acceptance Criteria:**
- [x] "To nie brzmi jak ja" button visible below insight text (non-adversarial framing per Motivational Interviewing — expresses identity, not confrontation)
- [x] Clicking opens text input with placeholder: "Co sprawia, że ten wgląd nie pasuje?"
- [x] On submit: AI responds with one deepening question (observational-data language, max 15 words, neutral-curious tone)
- [x] Insight text never changes as a result of user pushback
- [x] Round 2: AI responds with a second deepening question OR closing phrase that paraphrases user's content: *"To, co opisujesz, brzmi jak coś wartego zapisania."* — not a fixed template; AI incorporates user's words so the closing feels like a conclusion, not a mechanical limit
- [x] After round 2: Write Entry button style changes from secondary to primary (Amber fill, no pulsing — pulsing creates anxiety)
- [x] Round limit is invisible to user — never communicated explicitly
- [x] AI response never confronts contradictions in user's entries
- [x] Loading state during AI response
- [x] Prompts follow rules in `docs/ai_communication_principles.md`
- [x] `generateHolisticInsight()` prompt uses observational language ("W Twoich wpisach pojawia się wzorzec...") not identity-prescribing language ("Masz tendencję do...")

**Tasks:**
- [x] **TASK-203.1:** Add "I disagree" button to insight display - 20min
- [x] **TASK-203.2:** Create disagree input field + submit flow with round counter (max 2) - 30min
- [x] **TASK-203.3:** Implement `aiService.respondToInsightFeedback()` — single-mode deepening question - 60min
- [x] **TASK-203.4:** Create deepening question prompt in `src/utils/prompts.ts` per `docs/ai_communication_principles.md` - 45min
- [x] **TASK-203.5:** Implement round 2 closing phrase + Write Entry CTA highlight - 20min
- [x] **TASK-203.6:** Write tests (/qa) - 60min
- [x] **TASK-203.7:** Manual verification - 20min

---

## ✅ Pre-requisite: AI Communication Principles

**Completed 2026-04-27** via /discover + /consult session.
`docs/ai_communication_principles.md` defines:
- Observational-data language (no first-person AI voice)
- Single-mode deepening question response (no Mode A/B)
- Deepening question formulation rules (safe/forbidden openers, max 15 words, neutral-curious tone)
- Max 2 dialogue rounds, then write redirect
- Insight update policy (never through conversation, only through new entries)
- Red lines (never capitulate, never clinical)
- Based on: Motivational Interviewing, Nolen-Hoeksema, Festinger, Turkle (MIT)
- Before M3: lightweight review by a psychologist (still recommended)

**Status:** ✅ Completed

---

## 🔧 FEATURE-013: Contextual First-Use Onboarding

**Description:**
Onboarding is contextual — no welcome screen, no tutorial. Each AI feature explains itself exactly once, at the moment of first use, with a single sentence. The explanation disappears permanently after being seen. Users are never interrupted; they learn by doing.

**User Value:**
Users come to Dotflow in an emotional moment — they want to process something, not read documentation. Contextual hints teach users what they're experiencing right now, not what they might experience in the future.

**Three Onboarding Moments:**
1. **First follow-up questions** → one-liner above FollowUpDialog: *"Dotflow asks 2–3 questions to help you go deeper."*
2. **First connection detected** → tooltip on ConnectionBadge: *"I found a similarity to something you wrote earlier."*
3. **First black hole / insight hover** → hint near black hole: *"This is your center. It grows with each entry."*

**API Key Edge Case:**
Warning banner must communicate value, not just absence.
- Current: *"Add your API key in Settings."*
- New: *"Without an API key you won't see follow-up questions, connections, or insights."*

**Persistence:**
Each hint's "seen" state stored in localStorage. Never shown again after first view.

**Dependencies:**
- FEATURE-005, FEATURE-007 (hints 1 and 2)
- US-201 (hint 3 — black hole must exist)

**Priority:** P2
**Status:** 📋 Planned

---

### US-204: Contextual First-Use Hints

**Description:**
Add a one-time contextual hint to three AI feature moments: first follow-up questions dialog, first connection badge, first black hole hover. Each hint appears exactly once and is never shown again. Update the API key warning banner to communicate the value users are missing, not just the technical absence of a key.

**As a** first-time user
**I want to** understand what's happening when AI features appear for the first time
**So that** I can use Dotflow intuitively without needing a tutorial

**Status:** 📋 Planned
**Story Points:** 3
**Priority:** P2

**Acceptance Criteria:**
- [ ] First FollowUpDialog render: one-liner hint above dialog: *"Dotflow asks 2–3 questions to help you go deeper."*
- [ ] Hint gone after dialog closed — never shown again
- [ ] First ConnectionBadge render: tooltip: *"I found a similarity to something you wrote earlier."*
- [ ] First black hole hover: hint: *"This is your center. It grows with each entry."* (requires US-201)
- [ ] All hint states in localStorage: `onboarding_seen_followup`, `onboarding_seen_connection`, `onboarding_seen_blackhole`
- [ ] API key warning banner updated to name the missing features
- [ ] No hint shown more than once per installation

**Tasks:**
- [ ] **TASK-204.1:** Create `src/hooks/useOnboarding.ts` — manages seen-state per hint - 20min
- [ ] **TASK-204.2:** Add first-use hint to FollowUpDialog - 20min
- [ ] **TASK-204.3:** Add first-use tooltip to ConnectionBadge - 15min
- [ ] **TASK-204.4:** Add first-use hint to black hole hover (after US-201) - 15min
- [ ] **TASK-204.5:** Update API key warning banner copy in HomePage - 10min
- [ ] **TASK-204.6:** Write tests for useOnboarding hook and hint render (/qa) - 30min
- [ ] **TASK-204.7:** Manual verification - 15min

---

## 🔧 FEATURE-014: Adaptive Pattern Summaries

**Description:**
Pattern insights are driven by a continuous **reflection depth accumulator** — not fixed entry count milestones. Every entry contributes to the accumulator based on its quality signals (follow-up answers answered, word depth, connection detected). When the accumulator crosses a threshold, a new holistic insight is computed. After delivery the accumulator resets and continues building — forever. No "nothing after 50 entries."

Two distinct insight types operate independently:
1. **Connection Insight** — triggered immediately when a connection between entries is detected. Appears inline, near ConnectionBadge. Specific, contextual.
2. **Holistic Insight** — triggered by accumulator threshold. Delivered via black hole hover. Cumulative, identity-level.

The black hole pulses once (heartbeat) after every entry save — the size of the pulse is proportional to the entry's depth score. This creates a gardening feedback loop: write deeply → visible growth; write shallowly → barely moves.

**UX Principles (from /consult):**
- Fixed ratio with visible quality (not variable/casino): every entry always adds something; quality determines how much
- No numbers, bars, or points — user feels the difference visually, not analytically
- Accumulator threshold: configurable value, not hardcoded
- Follow-up answers weight more than word count as quality signal

**Dependencies:**
- US-202 (black hole mesh and hover interaction)
- US-101 (connection detection — needed for Connection Insight trigger)

**Scope Boundaries:**
- **Includes:** Depth accumulator, two insight types (connection + holistic), heartbeat visualization, glow/pulse for unread holistic insight
- **Excludes:** Push notifications, email delivery, explicit score display to user

**Priority:** P1
**Status:** 📋 Planned

---

### US-205: Depth-Driven Adaptive Insights

**Description:**
Replace fixed-milestone insight triggers with a continuous reflection depth accumulator. Each entry contributes depth points based on quality signals. When the accumulator threshold is crossed, a holistic insight is generated and delivered via black hole hover. Connection insights appear inline when entries connect. The black hole pulses on every save with proportional growth feedback.

**As a** user
**I want** the black hole to grow visibly when I write deeply and signal when a new insight is ready
**So that** I am motivated by reflection quality — not entry quantity — and discover insights at meaningful moments

**Status:** 📋 Planned
**Story Points:** 8
**Priority:** P1

**Depth Accumulator Model:**

Depth score per entry — range 0–20 pts (based on Pennebaker Expressive Writing Research):

| Signal | Points |
|---|---|
| Each follow-up answer | 3 pts / answer (max 15) |
| Word count 50–150 | +1 pt |
| Word count 150–300 | +2 pts |
| Word count 300+ | +3 pts (capped) |
| Connection detected | +2 pts bonus |
| Entry < 30 words | 0 pts flat |

- When accumulated score ≥ threshold → generate + persist holistic insight, reset accumulator
- Threshold is a configurable constant (not hardcoded), calibrated experimentally
- **M2.5 known limitation:** Users without an API key score 0 on the highest-weight signal (no follow-up answers). Acceptable for single-user M2.5; resolved in M3 with Dotflow-owned AI.

**Two Insight Types:**

| | Connection Insight | Holistic Insight |
|---|---|---|
| Trigger | Connection detected on entry save | Depth accumulator threshold crossed |
| Location | Inline, near ConnectionBadge | Black hole hover |
| Character | Immediate, specific | Cumulative, identity-level |
| Example | *"This echoes something you felt 3 weeks ago."* | *"You tend to doubt yourself before big decisions."* |

**Black Hole Insight Behavior by Story Context:**

| Incoming story pattern | Black hole response |
|---|---|
| Same/repeated topic appears again | *"Ten temat pojawia się kolejny raz — coś w nim jest ważnego."* |
| Contradicting or different story from previous | *"Tym razem inaczej — coś się zdaje zmieniać."* |
| Single short entry (<30 words) | Silence — no comment |
| 3+ consecutive short entries | *"Czy nie chcesz dziś pisać, czy jest coś co sprawia Ci trudność w opowiedzeniu?"* |

**Acceptance Criteria:**
- [ ] Each entry contributes a depth score to the accumulator on save
- [ ] Depth score follows Pennebaker model: 3 pts/follow-up answer (max 15), word count tier (+1/+2/+3), connection bonus (+2), <30 words = 0 flat; range 0–20
- [ ] Accumulator threshold is a configurable constant (not hardcoded)
- [ ] When threshold crossed: `aiService.generateHolisticInsight()` called, result persisted in localStorage
- [ ] Accumulator resets to zero after holistic insight generated (perpetual cycle)
- [ ] Black hole pulses once (heartbeat) after every entry save — pulse intensity proportional to depth score
- [ ] No numbers, bars, or explicit scores shown to user — feedback is purely visual
- [ ] Black hole glow/pulse when new holistic insight is unread
- [ ] Glow clears after first hover (insight marked as read)
- [ ] Connection insight: appears inline near ConnectionBadge when connection detected — one sentence, specific
- [ ] Before first holistic insight: black hole hover shows: *"Keep writing — your center is forming."*
- [ ] All insight persistence in localStorage; holistic insight does not regenerate on every hover
- [ ] Repeated topic detected → black hole shows: *"Ten temat pojawia się kolejny raz — coś w nim jest ważnego."*
- [ ] Contradicting topic detected → black hole shows: *"Tym razem inaczej — coś się zdaje zmieniać."*
- [ ] Single short entry → silence (no black hole comment)
- [ ] 3 or more consecutive short entries → *"Czy nie chcesz dziś pisać, czy jest coś co sprawia Ci trudność w opowiedzeniu?"*

**Tasks:**
- [ ] **TASK-205.1:** Design and implement `src/hooks/useDepthAccumulator.ts` — score computation + localStorage persistence - 45min
- [ ] **TASK-205.2:** Define depth score weights as configurable constants in `src/utils/insightConfig.ts` - 15min
- [ ] **TASK-205.3:** Implement `aiService.generateHolisticInsight(entries, apiKey)` with cumulative-pattern prompt - 45min
- [ ] **TASK-205.4:** Trigger holistic insight generation when accumulator threshold crossed - 20min
- [ ] **TASK-205.5:** Persist generated holistic insight in localStorage; retrieve on hover - 20min
- [ ] **TASK-205.6:** Pass depth score of last entry to StarField — trigger proportional heartbeat animation - 30min
- [ ] **TASK-205.7:** Add glow/pulse to black hole when unread holistic insight exists - 20min
- [ ] **TASK-205.8:** Implement connection insight display inline near ConnectionBadge - 25min
- [ ] **TASK-205.9:** Add pre-insight fallback text on black hole hover - 10min
- [ ] **TASK-205.10:** Write tests for accumulator, threshold detection, both insight types (/qa) - 60min
- [ ] **TASK-205.11:** Manual verification - 20min

---

## 🔧 FEATURE-015: Security & Privacy Messaging

**Description:** Moved to M3. Privacy messaging for end users (registration/login flow, no API key required). Details to be defined in /discover session before M3 planning.
**Status:** ⏸️ Deferred to M3

---

## 🔧 FEATURE-016: Story Extraction

**Description:**
Architectural pivot: the star in the 3D visualization is no longer an entry — it is a **story**. When the user saves an entry, AI automatically extracts N distinct stories (scenes, situations, events) from the entry text. Each story becomes a separate star. Stories from the same entry are connected by a session line. Each star has a "Dopowiedz" (Elaborate) button — writing more about a story adds context; it never deletes or replaces the original. AI re-classifies emotion and life area based on the elaboration.

**User Value:**
One long entry can contain multiple emotionally distinct events. Treating the entry as a single star loses nuance. Story-as-star makes the 3D sky richer and psychologically truer.

**Dependencies:**
- US-201, US-202 (3D visualization must exist)

**New Supabase Table: `stories`**
- `id` (uuid PK), `entry_id` (uuid FK), `content` (text), `emotion` (text), `emotion_confidence` (float), `life_area` (text, nullable), `position` (float[], stable 3D [x,y,z]), `created_at` (timestamp)

**Scope Boundaries:**
- **Includes:** AI story extraction, `stories` table, StoryNode component in 3D scene, session lines, "Dopowiedz" elaboration flow
- **Excludes:** Emotion classification (US-207), life area clustering (US-208)

**Priority:** P0
**Status:** ✅ Completed

---

### US-206: Story Extraction — One Entry, Many Stars

**Description:**
After the user saves an entry, AI automatically segments it into N distinct stories/situations. Each story becomes a separate star in the 3D visualization. Stories from the same entry are visually connected by a thin session line. Every star has a "Dopowiedz" button — the user can add more context later; AI re-classifies based on the elaboration.

**As a** user
**I want** my entry automatically split into individual story stars
**So that** each distinct moment in my life has its own visual presence in the sky

**Status:** ✅ COMPLETED
**Story Points:** 13
**Priority:** P0

**Acceptance Criteria:**
- [x] On entry save, `aiService.extractStories(content, apiKey)` called — returns array of story strings
- [x] Each story saved to `stories` table linked to the entry
- [x] Each story rendered as a separate `<StoryNode>` in StarField
- [x] Stories from same entry connected by a thin session line (distinct from constellation connection lines)
- [x] "Dopowiedz" button on each StoryNode tooltip — opens elaboration textarea
- [x] On submit of elaboration: original story content preserved, AI re-classifies based on combined text
- [x] Story positions are stable (derived from story id, not entry id)
- [x] Entry with 0 detectable stories (e.g., single-word entry) → treated as 1 story

**Tasks:**
- [x] **TASK-206.1:** Create `stories` table in Supabase — id, entry_id, content, emotion, emotion_confidence, life_area, position, created_at - 20min
- [x] **TASK-206.2:** Implement `aiService.extractStories(content, apiKey)` with story segmentation prompt - 60min
- [x] **TASK-206.3:** Implement `storyService.saveStories(entryId, stories)` and `storyService.getStoriesForEntry(entryId)` - 30min
- [x] **TASK-206.4:** Create `src/components/StarField/StoryNode.tsx` — star mesh + tooltip + "Dopowiedz" button - 60min
- [x] **TASK-206.5:** Add session lines between stories from same entry in StarField - 30min
- [x] **TASK-206.6:** Implement "Dopowiedz" elaboration flow — save elaboration, call re-classification - 45min
- [x] **TASK-206.7:** Update `starPositions.ts` to derive stable position from story id - 20min
- [x] **TASK-206.8:** Write tests (/qa) — 23 tests across aiService, storyService, starPositions, prompts - 60min
- [x] **TASK-206.9:** Manual verification - 20min

---

## 🔧 FEATURE-017: Emotion Intelligence per Story

**Description:**
Each story has an AI-detected emotion and a confidence score. If confidence is above 80%, emotion is assigned silently. If below 80%, AI still assigns its best guess silently — no prompt, no wheel. The user corrects emotion post-hoc: noticing a wrong star color → "Dopowiedz" → elaboration → AI re-classifies. No emotion wheel is ever shown in the UI.

**UX Decision (confirmed by /consult):** Removing the emotion wheel from the post-write flow eliminates cumulative friction. Deferred emotion correction via "Dopowiedz" is grounded in self-determination theory — user initiates, not prompted.

**User Value:**
Star colors reflect emotional truth. The user trusts the sky more when they can correct it naturally, without being interrogated.

**Dependencies:**
- US-206 (stories must exist)

**Scope Boundaries:**
- **Includes:** Emotion detection per story, confidence threshold logic, star color mapping, post-hoc correction via "Dopowiedz"
- **Excludes:** Emotion wheel UI (explicitly removed)

**Priority:** P1
**Status:** ✅ Completed

---

### US-207: Emotion Intelligence per Story

**Description:**
AI detects emotion and confidence for each story on save. High confidence (>80%) → silent assignment. Low confidence (<80%) → best guess assigned silently, no prompt. Star color = story emotion. Correction happens post-hoc via "Dopowiedz" elaboration.

**As a** user
**I want** each star to have a color that reflects the emotion of that story
**So that** the sky gives me an honest emotional picture of my life

**Status:** ✅ COMPLETED
**Story Points:** 8
**Priority:** P1

**Emotion Color Palette:**
- Joy / gratitude → warm amber (#F59E0B)
- Sadness / grief → deep blue (#3B82F6)
- Anger / frustration → red (#EF4444)
- Fear / anxiety → violet (#8B5CF6)
- Calm / acceptance → teal (#14B8A6)
- Mixed / unclear → neutral stone (#78716C, default)

**Acceptance Criteria:**
- [x] On story save, `aiService.detectEmotionConfidence(storyContent, apiKey)` called — returns `{emotion, confidence}`
- [x] Emotion and confidence stored in `stories` table
- [x] Star color in StoryNode reflects emotion (color mapping from palette above)
- [x] Both high-confidence (>80%) and low-confidence (<80%) results assigned silently — no UI prompt shown either way
- [x] No emotion wheel shown at any point in the flow
- [x] "Dopowiedz" elaboration triggers re-classification: `aiService.detectEmotionConfidence(originalContent + elaboration, apiKey)` → updates story emotion
- [x] Star color updates after re-classification
- [x] Default color (stone) shown before emotion is classified

**Tasks:**
- [x] **TASK-207.1:** Implement `aiService.detectEmotionConfidence(storyContent, apiKey)` - 45min
- [x] **TASK-207.2:** Add emotion prompt to `src/utils/prompts.ts` - 20min
- [x] **TASK-207.3:** Map emotion strings to color hex values in `src/utils/emotionColors.ts` - 20min
- [x] **TASK-207.4:** Update StoryNode to apply color from emotion mapping - 20min
- [x] **TASK-207.5:** Trigger re-classification on "Dopowiedz" submission - 30min
- [x] **TASK-207.6:** Write tests (/qa) - 45min
- [x] **TASK-207.7:** Manual verification - 15min

---

## 🔧 FEATURE-018: Contextual Follow-Up Questions Between Lines

**Description:**
Follow-up questions are rewritten: AI no longer asks about emotions or facts already written explicitly. It asks about what is between the lines — hidden context, people mentioned in passing, life areas the user never addresses. AI has access to stories from the current entry and recent past entries.

**Long Entry Rule (confirmed by /consult):** If the entry is >300 words, no follow-up questions are shown. The app responds with a single word: *"Pięknie."* — an acknowledgment of depth, not an evaluation. The user then explores the sky.

**User Value:**
Questions that ask about what's already written feel redundant and surveillance-like. Questions that find what's missing feel like a thoughtful friend noticed something.

**Dependencies:**
- US-206 (stories must exist — AI reads current stories for context)

**Scope Boundaries:**
- **Includes:** Updated follow-up prompt with story context, long entry threshold (>300 words), "Pięknie." acknowledgment
- **Excludes:** Emotion wheel (removed in US-207)

**Priority:** P1
**Status:** ✅ Completed

---

### US-210: Contextual Follow-Up Questions Between Lines

**Description:**
Rewrite follow-up question generation so AI avoids restating what was already written. AI reads current entry stories and last 3 entries to find implicit context, unmentioned people, recurring avoidance patterns. Entries >300 words receive only "Pięknie." — no questions.

**As a** user
**I want** follow-up questions that ask about what I didn't write
**So that** the questions feel like real insight, not a form to fill

**Status:** ✅ COMPLETED
**Story Points:** 5
**Priority:** P1

**Acceptance Criteria:**
- [x] If entry word count >300: no follow-up dialog shown; AI responds with *"Pięknie."* acknowledgment text; user navigates to home/sky
- [x] If entry word count ≤300: follow-up dialog shown with updated questions
- [x] Updated `generateFollowUpQuestions()` prompt includes: current entry stories + last 3 entry stories as context
- [x] Prompt explicitly instructs AI to avoid restating emotions/facts already written in the entry
- [x] Prompt focuses on: hidden context, people mentioned briefly, life areas the user doesn't address
- [x] "Pięknie." text shown inline on NewEntryPage before navigation (not a separate screen)

**Tasks:**
- [x] **TASK-210.1:** Add word count check in NewEntryPage — branch to "Pięknie." path if >300 words - 15min
- [x] **TASK-210.2:** Add "Pięknie." UI state in NewEntryPage (text + navigate to home button) - 20min
- [x] **TASK-210.3:** Update `generateFollowUpQuestions()` signature and prompt to include story context - 45min
- [x] **TASK-210.4:** Update prompt in `src/utils/prompts.ts` with between-the-lines instruction - 30min
- [x] **TASK-210.5:** Write tests (/qa) - 45min
- [x] **TASK-210.6:** Manual verification - 15min

---

## 🔧 FEATURE-019: Life Area Zones

**Description:**
Life area zones emerge organically from stories accumulated in the sky — no default zones (no "Praca", "Rodzina", "Zdrowie" preset). After ~15 stories, clusters of thematically related stars become visible. AI suggests a zone label (hover-only). User can rename the label or leave it blank (no label = no zone). Areas the user never writes about are not shown as empty zones.

**User Value:**
Default life area zones create a surveillance feeling — "you haven't written about Health this week." Emergent zones reflect the user's actual life, not a template of what life should look like.

**Dependencies:**
- US-206 (stories must exist and accumulate)
- US-207 (emotion per story — clusters may also reflect emotional similarity)

**Scope Boundaries:**
- **Includes:** Life area classification per story, cluster emergence after ~15 stories, hover-only label, user renaming
- **Excludes:** Any default/preset zones, empty zone visualization

**Priority:** P1
**Status:** 📋 Planned

---

### US-208: Life Area Zones — Emergent Clusters

**Description:**
After ~15 stories, AI detects thematic clusters and suggests hover-only zone labels. User can rename or clear a label. No default zones. No visualization of absent life areas.

**As a** user
**I want** my sky to naturally group into areas of my life
**So that** I see my actual patterns — not a template of what I should be writing about

**Status:** 📋 Planned
**Story Points:** 8
**Priority:** P1

**Acceptance Criteria:**
- [ ] `aiService.classifyLifeArea(storyContent, existingAreas, apiKey)` assigns a life area label to each story (or null if unclear)
- [ ] Life area stored in `stories.life_area` field
- [ ] Zone clusters rendered in 3D as subtle ambient glows grouping nearby story stars
- [ ] Zone label appears only on hover — not visible by default
- [ ] User can rename a zone label (stored in localStorage)
- [ ] User can clear a zone label (zone disappears without label)
- [ ] Zones only emerge when cluster has ≥5 stories in the same area
- [ ] No placeholder / empty zones for life areas the user never writes about
- [ ] Zones are fully emergent — no preset list (no "Praca", "Rodzina", etc.)

**Tasks:**
- [ ] **TASK-208.1:** Implement `aiService.classifyLifeArea(storyContent, existingAreas, apiKey)` - 45min
- [ ] **TASK-208.2:** Add life area prompt to `src/utils/prompts.ts` - 20min
- [ ] **TASK-208.3:** Implement zone cluster detection from `stories.life_area` values — group stories, compute cluster centroid - 40min
- [ ] **TASK-208.4:** Render zone ambient glow in StarField (visible only when cluster ≥5 stories) - 45min
- [ ] **TASK-208.5:** Add hover-only label rendering per zone cluster - 20min
- [ ] **TASK-208.6:** Create `useLifeAreaZones.ts` hook — manages labels + user renames in localStorage - 30min
- [ ] **TASK-208.7:** Write tests (/qa) - 45min
- [ ] **TASK-208.8:** Manual verification - 20min

---

## 🔧 FEATURE-020: Typed Connection Visualization

**Description:**
Connections between stories are visually differentiated by content type. No labels shown to user — only visual line style. Three types based on content analysis:
- Similar emotions in both stories → solid colored lines
- Similar topic/situation → dashed lines
- Similar life choices → chain-style lines

A connection filter panel in 3D mode lets the user hide/show connection types.

**UX Decision (confirmed by /consult):** No Dilts neurological level labels visible to user. No psychological typing (DISC, MBTI). Classification is content-based only, internal to the AI. Visual differentiation communicates "these are different kinds of connections" without naming the framework.

**Dependencies:**
- US-206 (story-level connections), US-208 (life area context for life-choice classification)

**Scope Boundaries:**
- **Includes:** Connection type classification, visual line styles per type, 3D filter panel
- **Excludes:** Any visible psychological labels, DISC/MBTI/Dilts labels

**Priority:** P2
**Status:** 📋 Planned

---

### US-209: Typed Connection Visualization

**Description:**
Add visual type differentiation to constellation lines between connected stories. Three line styles based on content: solid colored (emotional similarity), dashed (thematic similarity), chain (similar life choices). Filter panel in 3D mode to show/hide types.

**As a** user
**I want** to see different kinds of connections between my stories visually
**So that** I can explore what kind of patterns keep appearing in my life

**Status:** 📋 Planned
**Story Points:** 8
**Priority:** P2

**Acceptance Criteria:**
- [ ] `aiService.classifyConnectionType(story1, story2, apiKey)` returns `"emotional" | "thematic" | "life-choices"`
- [ ] Connection type stored in `connections.type` field
- [ ] Solid colored lines render for `emotional` connections
- [ ] Dashed lines render for `thematic` connections
- [ ] Chain-style lines render for `life-choices` connections
- [ ] No labels on lines — visual differentiation only
- [ ] Filter panel visible in 3D interactive mode: checkboxes to show/hide each type
- [ ] Filter state persisted in localStorage
- [ ] No Dilts labels, no DISC/MBTI, no psychological typing visible to user

**Tasks:**
- [ ] **TASK-209.1:** Add `type` column to `connections` table in Supabase - 10min
- [ ] **TASK-209.2:** Implement `aiService.classifyConnectionType(story1, story2, apiKey)` - 45min
- [ ] **TASK-209.3:** Add connection type prompt to `src/utils/prompts.ts` - 20min
- [ ] **TASK-209.4:** Update `ConstellationLines.tsx` to render three distinct line styles by type - 45min
- [ ] **TASK-209.5:** Create 3D filter panel component in StarField - 30min
- [ ] **TASK-209.6:** Persist filter state in localStorage via `useConnectionFilter.ts` hook - 20min
- [ ] **TASK-209.7:** Write tests (/qa) - 45min
- [ ] **TASK-209.8:** Manual verification - 20min

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
