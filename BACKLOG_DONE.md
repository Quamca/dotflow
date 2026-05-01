# Dotflow — Completed User Stories

> Archive of all ✅ completed US. Read-only reference — do not plan work from this file.
> Active work: [BACKLOG.md](BACKLOG.md) · Status overview: [STATUS.md](STATUS.md)

---

# 📦 EPIC-001: Core Journal + AI Follow-Up ✅ Completed

---

## 🔧 FEATURE-001: Project Setup & Infrastructure ✅ Completed

### US-001: Initialize React + Vite + TypeScript project ✅ COMPLETED

**Status:** ✅ Completed | **Story Points:** 3 | **Priority:** P0

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
- [x] **TASK-001.1:** Run `npm create vite@latest dotflow -- --template react-ts`
- [x] **TASK-001.2:** Install and configure Tailwind CSS
- [x] **TASK-001.3:** Install and configure ESLint + Prettier
- [x] **TASK-001.4:** Install and configure Vitest + React Testing Library
- [x] **TASK-001.5:** Create `.env.example` with Supabase placeholder keys
- [x] **TASK-001.6:** Write placeholder test to verify Vitest works (/qa)
- [x] **TASK-001.7:** Manual verification

---

### US-002: Create Supabase schema and configure environment ✅ COMPLETED

**Status:** ✅ Completed | **Story Points:** 2 | **Priority:** P0

**Acceptance Criteria:**
- [x] Three tables created in Supabase: `entries`, `followups`, `connections`
- [x] `@supabase/supabase-js` installed and configured
- [x] `src/services/entryService.ts` created with placeholder CRUD functions
- [x] RLS disabled on all tables (MVP — single user)
- [x] `.env` with real Supabase keys works locally

**Tasks:**
- [x] **TASK-002.1:** Run SQL schema in Supabase SQL Editor
- [x] **TASK-002.2:** Install `@supabase/supabase-js`, create `src/lib/supabase.ts` client
- [x] **TASK-002.3:** Create `src/services/entryService.ts` with stub functions
- [x] **TASK-002.4:** Write tests for entryService stubs (/qa)
- [x] **TASK-002.5:** Manual verification (test write/read from Supabase)

---

## 🔧 FEATURE-002: CI/CD Pipeline ✅ Completed

### US-003: Set up GitHub Actions CI pipeline ✅ COMPLETED

**Status:** ✅ Completed | **Story Points:** 2 | **Priority:** P0

**Acceptance Criteria:**
- [x] `.github/workflows/ci.yml` exists and runs on PR to main
- [x] Workflow runs: `npm run lint`, `npm test`, `npm run build`
- [x] Failing any step fails the workflow
- [x] Branch protection on main requires this check to pass
- [x] Workflow completes in under 3 minutes

---

## 🔧 FEATURE-003: Settings — API Key Management ✅ Completed

### US-004: Settings screen with API key management ✅ COMPLETED

**Status:** ✅ Completed | **Story Points:** 3 | **Priority:** P0

**Acceptance Criteria:**
- [x] Settings screen accessible via ⚙ icon from Home
- [x] User can type and save an API key
- [x] Saved key is displayed masked: `sk-...xxxx` (last 4 chars visible)
- [x] User can clear the saved key
- [x] Key persists after page refresh (localStorage)
- [x] Warning banner on Home screen when no key is set
- [x] Info text: "Your key is stored locally on this device only"

---

## 🔧 FEATURE-004: Entry Creation ✅ Completed

### US-005: New entry form and save to Supabase ✅ COMPLETED

**Status:** ✅ Completed | **Story Points:** 5 | **Priority:** P0

**Acceptance Criteria:**
- [x] New Entry screen accessible from Home via Write button
- [x] Free-form textarea, no character limit
- [x] Save button disabled when textarea is empty
- [x] Loading state shown while saving
- [x] Entry saved to Supabase `entries` table
- [x] After save, user redirected to Home
- [x] Error state shown if save fails (content preserved)

---

## 🔧 FEATURE-005: AI Follow-Up Questions ✅ Completed

### US-006: AI follow-up question generation and dialog ✅ COMPLETED

**Status:** ✅ Completed | **Story Points:** 8 | **Priority:** P0

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

---

## 🔧 FEATURE-006: Entry List View ✅ Completed

### US-007: Home screen entry list and entry detail view ✅ COMPLETED

**Status:** ✅ Completed | **Story Points:** 5 | **Priority:** P1

**Acceptance Criteria:**
- [x] Home screen loads all entries from Supabase on mount
- [x] Entries displayed newest first
- [x] Each card shows: date (formatted), content preview (2 lines, truncated), emotion tags
- [x] Empty state shown when no entries: illustration + "Write your first entry" CTA
- [x] Loading skeleton shown while fetching
- [x] Clicking card navigates to Entry Detail view
- [x] Entry Detail shows: full content, date, all follow-up Q&A (questions + answers)
- [x] Back button from Detail returns to Home

---

# 📦 EPIC-002: Connections + Patterns ✅ Completed

---

## 🔧 FEATURE-007: Entry Connection Detection ✅ Completed

### US-101: AI connection detection on entry save ✅ COMPLETED

**Status:** ✅ Completed | **Story Points:** 8 | **Priority:** P0

**Acceptance Criteria:**
- [x] Connection check runs in background after entry save (does not delay UI)
- [x] AI compares new entry to 10 most recent past entries
- [x] If similarity score ≥ 0.7, connection stored in `connections` table
- [x] Connection badge appears on entry card: "Connected to [date]"
- [x] Clicking badge navigates to connected entry
- [x] If no connection found: no badge, no error

---

## 🔧 FEATURE-008: Pattern Summary ✅ Completed

### US-103: Fix AI insights language — respond in entry language ✅ COMPLETED

**Status:** ✅ Completed | **Story Points:** 1 | **Priority:** P1

**Acceptance Criteria:**
- [x] Pattern summary observations are returned in the language of the journal entries
- [x] No hardcoded language in prompt — AI auto-detects from entry content

---

### US-102: AI pattern summary generation ✅ COMPLETED

**Status:** ✅ Completed | **Story Points:** 5 | **Priority:** P1

**Acceptance Criteria:**
- [x] "Generate insights" button visible when entry count ≥ 10
- [x] Clicking sends 10 most recent entries to AI
- [x] AI returns 3–5 bullet-point observations
- [x] Observations displayed in a readable summary card
- [x] Clear label: "AI-generated observations — not clinical advice"
- [x] Loading state during generation

---

# 📦 EPIC-002b: Experience Depth — Completed Items

---

## ✅ Pre-requisite: AI Communication Principles

**Completed 2026-04-27** via /discover + /consult session.
`docs/ai_communication_principles.md` defines observational-data language, single-mode deepening question response, deepening question formulation rules (safe/forbidden openers, max 15 words, neutral-curious tone), max 2 dialogue rounds then write redirect, insight update policy, and red lines.

---

## 🔧 FEATURE-011: 3D Entry Visualization — "Gwiezdne niebo" ✅ Completed

### US-201: 3D Star Field — Basic Visualization ✅ COMPLETED

**Status:** ✅ Completed | **Story Points:** 8 | **Priority:** P1

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

---

### US-202: Black Hole & Psychological Profile ✅ COMPLETED

**Status:** ✅ Completed | **Story Points:** 13 | **Priority:** P1

**Acceptance Criteria:**
- [x] Black hole visible at center of 3D scene
- [x] Size scales with entry count (min size at 1 entry, max size capped at ~15% of scene)
- [x] Hover on black hole shows current pattern insight
- [x] After N entries, AI proposes 5 recurring themes using observational framing
- [x] Values modal includes: AI-proposed list, edit instructions, "Żadna z tych" escape hatch + free text field
- [x] Confirmed values stored in localStorage
- [x] Star positions update to reflect value alignment once values are confirmed
- [x] Entries aligned with values appear closer to black hole; divergent entries appear further

---

## 🔧 FEATURE-012: Insight Feedback Loop ✅ Completed

### US-203: Dialectical Insight Response ✅ COMPLETED

**Status:** ✅ Completed | **Story Points:** 5 | **Priority:** P1

**Acceptance Criteria:**
- [x] "To nie brzmi jak ja" button visible below insight text
- [x] Clicking opens text input with placeholder: "Co sprawia, że ten wgląd nie pasuje?"
- [x] On submit: AI responds with one deepening question (max 15 words, neutral-curious tone)
- [x] Insight text never changes as a result of user pushback
- [x] Round 2: AI responds with closing phrase paraphrasing user's own words
- [x] After round 2: Write Entry button style changes from secondary to primary (Amber fill)
- [x] Round limit is invisible to user — never communicated explicitly
- [x] AI response never confronts contradictions in user's entries
- [x] Loading state during AI response

---

## 🔧 FEATURE-016: Story Extraction ✅ Completed

### US-206: Story Extraction — One Entry, Many Stars ✅ COMPLETED

**Status:** ✅ Completed | **Story Points:** 13 | **Priority:** P0

**Acceptance Criteria:**
- [x] On entry save, `aiService.extractStories(content, apiKey)` called — returns array of story strings
- [x] Each story saved to `stories` table linked to the entry
- [x] Each story rendered as a separate `<StoryNode>` in StarField
- [x] Stories from same entry connected by a thin session line (distinct from constellation connection lines)
- [x] "Dopowiedz" button on each StoryNode tooltip — opens elaboration textarea
- [x] On submit of elaboration: original story content preserved, AI re-classifies based on combined text
- [x] Story positions are stable (derived from story id, not entry id)
- [x] Entry with 0 detectable stories (e.g., single-word entry) → treated as 1 story

---

## 🔧 FEATURE-017: Emotion Intelligence per Story ✅ Completed

### US-207: Emotion Intelligence per Story ✅ COMPLETED

**Status:** ✅ Completed | **Story Points:** 8 | **Priority:** P1

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

---

## 🔧 FEATURE-018: Contextual Follow-Up Questions ✅ Completed

### US-210: Contextual Follow-Up Questions Between Lines ✅ COMPLETED

**Status:** ✅ Completed | **Story Points:** 5 | **Priority:** P1

**Acceptance Criteria:**
- [x] If entry word count >300: no follow-up dialog shown; AI responds with *"Pięknie."* acknowledgment text; user navigates to home/sky via "Wróć →" button
- [x] If entry word count ≤300: follow-up dialog shown with updated questions
- [x] Updated `generateFollowUpQuestions()` prompt includes: current entry stories + last 3 entry stories as context
- [x] Prompt explicitly instructs AI to avoid restating emotions/facts already written in the entry
- [x] Prompt focuses on: hidden context, people mentioned briefly, life areas the user doesn't address
- [x] "Pięknie." text shown inline on NewEntryPage before navigation (not a separate screen)

**Tasks:**
- [x] **TASK-210.1:** Add word count check in NewEntryPage — branch to "Pięknie." path if >300 words
- [x] **TASK-210.2:** Add "Pięknie." UI state in NewEntryPage (text + navigate to home button)
- [x] **TASK-210.3:** Update `generateFollowUpQuestions()` signature and prompt to include story context
- [x] **TASK-210.4:** Update prompt in `src/utils/prompts.ts` with between-the-lines instruction
- [x] **TASK-210.5:** Write tests (/qa)
- [x] **TASK-210.6:** Manual verification

---

*This file is an archive. For active work see [BACKLOG.md](BACKLOG.md).*
