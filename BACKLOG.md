# Dotflow — Active Backlog (M2.5)

**Project:** Dotflow
**Version:** 1.5
**Last Updated:** 2026-05-01
**Product Owner:** Quamca
**Repository:** https://github.com/Quamca/dotflow

> This file contains only **active US** (📋 Planned or 🔄 In Progress) from the current milestone.
> See also: [STATUS.md](STATUS.md) — current sprint overview · [BACKLOG_DONE.md](BACKLOG_DONE.md) — completed US · [BACKLOG_FUTURE.md](BACKLOG_FUTURE.md) — M3 and beyond

---

## 🐛 Known Bugs

| ID | Description | Priority | Reported in |
|----|-------------|----------|-------------|
| BUG-001 | StarField tooltips (StoryNode + StarNode) are too narrow — content gets clipped, width needs increase | Low | US-206 manual verification |
| BUG-002 | StoryNode tooltip does not close when clicking outside — requires hovering another star or waiting 3s | Medium | US-207 manual verification |
| BUG-003 | Follow-up questions use storyContext from past entries but user has no visibility into this — questions about past topics feel like hallucinations | Medium | US-210 manual verification |
| BUG-004 | New entries are not visually distinguished in the 3D sky — feature request: most recently added star should blink/pulse | Low | US-210 manual verification |

---

## 📊 Milestone Overview

| Milestone | Name | Status |
|-----------|------|--------|
| M1 | Core Journal + AI Follow-Up | ✅ Completed |
| M2 | Connections + Patterns | ✅ Completed |
| M2.5 | Experience Depth (pre-M3) | 🔄 In Progress (6/10 done) |
| M3 | Multi-User + Mobile | ⏸️ Blocked — M2.5 P0/P1 must complete first |

> **M3 Blockers remaining:** US-205 (Adaptive Insights, P1), US-208 (Life Area Zones, P1). US-204 (P2) and US-209 (P2) are not M3 blockers.

---

# 📦 EPIC-002b: Experience Depth — Active Items

---

## 🔧 FEATURE-014: Adaptive Pattern Summaries

**Description:**
Pattern insights are driven by a continuous **reflection depth accumulator** — not fixed entry count milestones. Every entry contributes to the accumulator based on quality signals (follow-up answers answered, word depth, connection detected). When the accumulator crosses a threshold, a new holistic insight is computed. After delivery the accumulator resets and continues building — forever. No "nothing after 50 entries."

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
- [ ] **TASK-205.10:** Write tests (/qa) - 60min
- [ ] **TASK-205.11:** Manual verification - 20min

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

## 🔧 FEATURE-013: Contextual First-Use Onboarding

**Description:**
Onboarding is contextual — no welcome screen, no tutorial. Each AI feature explains itself exactly once, at the moment of first use, with a single sentence. The explanation disappears permanently after being seen. Users are never interrupted; they learn by doing.

**Three Onboarding Moments:**
1. **First follow-up questions** → one-liner above FollowUpDialog: *"Dotflow asks 2–3 questions to help you go deeper."*
2. **First connection detected** → tooltip on ConnectionBadge: *"I found a similarity to something you wrote earlier."*
3. **First black hole / insight hover** → hint near black hole: *"This is your center. It grows with each entry."*

**Persistence:**
Each hint's "seen" state stored in localStorage. Never shown again after first view.

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

## 🔧 FEATURE-020: Typed Connection Visualization

**Description:**
Connections between stories are visually differentiated by content type. No labels shown to user — only visual line style. Three types based on content analysis:
- Similar emotions in both stories → solid colored lines
- Similar topic/situation → dashed lines
- Similar life choices → chain-style lines

A connection filter panel in 3D mode lets the user hide/show connection types.

**UX Decision (confirmed by /consult):** No Dilts neurological level labels visible to user. No psychological typing (DISC, MBTI). Classification is content-based only, internal to the AI.

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

*Active backlog only. For completed US see [BACKLOG_DONE.md](BACKLOG_DONE.md). For M3 plans see [BACKLOG_FUTURE.md](BACKLOG_FUTURE.md).*
