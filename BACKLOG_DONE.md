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

### US-205: Depth-Driven Adaptive Insights ✅ COMPLETED

**Status:** ✅ Completed | **Story Points:** 8 | **Priority:** P1

**Description:**
Replace fixed-milestone insight triggers with a continuous reflection depth accumulator. Each entry contributes depth points based on quality signals. When the accumulator threshold is crossed, a holistic insight is generated and delivered via black hole hover. Connection insights appear inline when entries connect. The black hole pulses on every save with proportional growth feedback.

**Acceptance Criteria:**
- [x] Each entry contributes a depth score to the accumulator on save
- [x] Depth score follows Pennebaker model: 3 pts/follow-up answer (max 15), word count tier (+1/+2/+3), connection bonus (+2), <30 words = 0 flat; range 0–20
- [x] Accumulator threshold is a configurable constant (not hardcoded)
- [x] When threshold crossed: `aiService.generateHolisticInsight()` called, result persisted in localStorage
- [x] Accumulator resets to zero after holistic insight generated (perpetual cycle)
- [x] Black hole pulses once (heartbeat) after every entry save — pulse intensity proportional to depth score
- [x] No numbers, bars, or explicit scores shown to user — feedback is purely visual
- [x] Black hole glow/pulse when new holistic insight is unread
- [x] Glow clears after first hover (insight marked as read)
- [x] Connection insight: appears inline near ConnectionBadge when connection detected — one sentence, specific
- [x] Before first holistic insight: black hole hover shows: *"Keep writing — your center is forming."*
- [x] All insight persistence in localStorage; holistic insight does not regenerate on every hover
- [x] Repeated topic detected → black hole shows: *"Ten temat pojawia się kolejny raz — coś w nim jest ważnego."*
- [x] Contradicting topic detected → black hole shows: *"Tym razem inaczej — coś się zdaje zmieniać."*
- [x] Single short entry → silence (no black hole comment)
- [x] 3 or more consecutive short entries → *"Czy nie chcesz dziś pisać, czy jest coś co sprawia Ci trudność w opowiedzeniu?"*

**Tasks:**
- [x] **TASK-205.1:** Design and implement `src/hooks/useDepthAccumulator.ts` — score computation + localStorage persistence
- [x] **TASK-205.2:** Define depth score weights as configurable constants in `src/utils/insightConfig.ts`
- [x] **TASK-205.3:** Implement `aiService.generateHolisticInsight(entries, apiKey)` with cumulative-pattern prompt
- [x] **TASK-205.4:** Trigger holistic insight generation when accumulator threshold crossed
- [x] **TASK-205.5:** Persist generated holistic insight in localStorage; retrieve on hover
- [x] **TASK-205.6:** Pass depth score of last entry to StarField — trigger proportional heartbeat animation
- [x] **TASK-205.7:** Add glow/pulse to black hole when unread holistic insight exists
- [x] **TASK-205.8:** Implement connection insight display inline near ConnectionBadge
- [x] **TASK-205.9:** Add pre-insight fallback text on black hole hover
- [x] **TASK-205.10:** Write tests (/qa)
- [x] **TASK-205.11:** Manual verification

**Implementation notes:**
- Global single-tooltip system: `activeTooltipId` state in StarField parent — only one tooltip active at a time; 300ms deactivation delay uniform across all nodes
- BlackHole tooltip stability: `keepOpen` (500ms grace period) + `isTooltipHovered` — prevents flicker when cursor moves from mesh to tooltip div
- Invisible hit mesh on BlackHole: transparent sphere at `clampedSize * 1.6` radius — larger, stable pointer event target matching visual glow
- `e.stopPropagation()` on all mesh pointer events — prevents raycast bleed-through to objects behind
- "To ma sens" → `setAgreed(true)` only (no AI call); "Rozwiń" → `elaborateInsight()` AI call; "Jest OK" dismisses elaboration
- `generateHolisticInsight(entries, apiKey)` and `elaborateInsight(insight, entryExamples, apiKey)` added to aiService
- `getEntriesWithFollowUps()` added to entryService (used by depth accumulator)
- `HOLISTIC_INSIGHT_SYSTEM_PROMPT` and `INSIGHT_ELABORATION_SYSTEM_PROMPT` added to prompts.ts
- FollowUpDialog "Zmień pytanie" reroll: MAX_REROLLS=2, calls `onRequestMore()`, replaces current question

---

---

## 🔧 FEATURE-019: Life Area Zones ✅ Completed

### US-208: Life Area Zones — Emergent Clusters ✅ COMPLETED

**Status:** ✅ Completed | **Story Points:** 13 | **Priority:** P1

**Description:**
After ~15 stories, AI detects thematic clusters and suggests hover-only zone labels in the 3D sky. Stories in the same area spatially cluster. Zones render as nebula/cloud overlays (very low opacity, ambient motion, no sharp boundaries). No default zones. Labels only on hover. Zones fade and reorganize dynamically. No preset categories.

**Acceptance Criteria:**
- [x] `aiService.classifyLifeArea(storyContent, existingAreas, apiKey)` assigns a life area label to each story (or null if unclear)
- [x] Life area stored in `stories.life_area` field
- [x] Stories from the same emergent area are spatially clustered in 3D space
- [x] Zone visual: nebula/cloud overlay with very low opacity, soft gradient, subtle ambient motion
- [x] Zone label appears only on hover — not visible by default
- [x] User can rename a zone label (stored in localStorage)
- [x] User can clear a zone label (zone disappears without label)
- [x] Zones only emerge when cluster has ≥5 stories in the same area
- [x] No placeholder / empty zones for life areas the user never writes about
- [x] Zones are fully emergent — no preset list (no "Praca", "Rodzina", "Zdrowie")
- [x] Forbidden: fixed stable map layout, permanent zone boundaries, sharp edges, legend panel, percentage or count display

**Tasks:**
- [x] **TASK-208.1:** Implement `aiService.classifyLifeArea(storyContent, existingAreas, apiKey)`
- [x] **TASK-208.2:** Add `LIFE_AREA_SYSTEM_PROMPT` to `src/utils/prompts.ts`
- [x] **TASK-208.3:** Zone cluster detection from `stories.life_area` — group stories, compute centroid
- [x] **TASK-208.4:** `getZoneLocalPosition()` + `getFixedZoneCentroid()` in `starPositions.ts` — local-space clustering, no near-side bias
- [x] **TASK-208.5:** `LifeAreaZone.tsx` — nebula sphere mesh (low opacity, ambient motion, invisible hit mesh)
- [x] **TASK-208.6:** Hover-only label rendering per zone (depth-priority: nearest zone wins)
- [x] **TASK-208.7:** `useLifeAreaZones.ts` hook — label persistence + user renames in localStorage
- [x] **TASK-208.8:** Hard containment invariant: zone stars clamped to `radius − 0.2` (Pass 3b in StarField useMemo)
- [x] **TASK-208.9:** Write tests (/qa)
- [x] **TASK-208.10:** Manual verification

**Implementation notes:**
- Depth-priority hover: `zoneDistancesRef` Map tracks `e.distance` per zone; `activateNearestZone()` picks minimum — prevents back zone activating through front zone
- Local-space zone positioning: `getZoneLocalPosition(storyId, centroid)` uses seed offsets +5000/+6000/+7000 (independent from `getStoryPosition`) — no near-side bias toward black hole
- Fixed zone centroids: `getFixedZoneCentroid(label)` derived purely from label string hash, placed at `ZONE_CENTROID_RADIUS=6.0` from origin — stable regardless of story positions
- Pass 3b hard clamp: after zone-zone overlap resolution reduces radii, all zone stars are clamped to `radius − SAFETY_MARGIN (0.2)` to enforce containment invariant
- `isActive` prop on `LifeAreaZone` gates label visibility, visual opacity, and zone highlighting — not raw local `isZoneHovered`
- `onPointerMove: stopPropagation` removed from zone hit mesh — star tooltips use independent raycast path
- Zone label `handleLabelEnter` passes `distance=0` so hovered label always beats 3D mesh in distance comparison
- Drag threshold on StarNode, StoryNode, BlackHole: 5px (`DRAG_THRESHOLD_SQ=25`) prevents modal open after scene drag
- Zone emotion color: derived from dominant emotion in cluster stories using `getEmotionColor()`
- `useLifeAreaZones`: localStorage key `dotflow_zone_labels`, JSON `Record<aiLabel, customLabel>`, empty string = cleared

---

---

### US-214: Volumetric Nebula Rendering ✅ COMPLETED

**Status:** ✅ Completed | **Story Points:** 8 | **Priority:** P2

**Description:**
Replace the single-sphere zone overlay from US-208 with layered volumetric nebula clouds. Emotional colors blend proportionally inside the same zone — no dominant flat tint. Zones breathe and drift independently per layer. Each zone renders up to 7 sphere meshes: 2 per qualifying emotion (outer diffuse + inner concentration, max 3 emotions) + 1 ambient tie layer.

**Acceptance Criteria:**
- [x] Zone visuals use layered volumetric fog/cloud rendering instead of sphere-like overlays
- [x] Multiple emotions blend proportionally inside the same nebula
- [x] No hard color separation or visible gradient bands
- [x] Nebula density varies organically using noise distortion
- [x] Ambient movement is subtle and slow (breathing/drifting effect)
- [x] Zones remain soft and atmospheric — never become solid objects
- [x] Existing hover-only label behavior preserved
- [x] Existing zone clustering logic preserved
- [x] Performance remains stable with 50+ stories

**Tasks:**
- [x] **TASK-214.1:** Replace sphere-style zone material with layered volumetric cloud shader
- [x] **TASK-214.2:** Add multi-emotion color blending system for nebula rendering
- [x] **TASK-214.3:** Add procedural noise distortion for density variation
- [x] **TASK-214.4:** Add subtle ambient drift/breathing animation
- [x] **TASK-214.5:** Tune opacity falloff to avoid visible hard edges
- [x] **TASK-214.6:** Optimize rendering performance for multiple active nebulae
- [x] **TASK-214.7:** Write tests (/qa)
- [x] **TASK-214.8:** Manual verification

**Implementation notes:**
- `buildLayers(emotionWeights)`: filters `w > 0.05`, sorts descending, slices to max 3 emotions; each emotion produces 2 layers (outer diffuse + inner concentration); always appends 1 ambient layer (`#78716C`) — total: 2×N + 1
- Layer structure: `{ color, radiusScale, opacityBase, phaseOffset, speed, axisScale }` — each layer animated independently via `useFrame` sin/cos on scale axes
- `layerRefs = useRef<(Mesh | null)[]>([])` — per-layer ref array indexed by map position
- `ACTIVE_OPACITY_MULTIPLIER = 1.6` — boosts all layer opacities when zone is hovered (`isActive`)
- `StarField.tsx`: replaced dominant-emotion color with proportional `emotionWeights: Record<string, number>` — weight = `storyCount[emotion] / totalStories`
- Emotion threshold `> 0.05` prevents micro-weights from adding invisible/noise layers
- Tests use `querySelectorAll('mesh')` in JSDOM — Three.js JSX elements render as HTMLUnknownElements; layer count formula: `2 × N_emotions + 1 ambient + 1 hit mesh`
- `e.distance` is undefined in JSDOM (DOM PointerEvent, not Three.js ThreeEvent) — TC-309 asserts only the label argument

---

*This file is an archive. For active work see [BACKLOG.md](BACKLOG.md).*
