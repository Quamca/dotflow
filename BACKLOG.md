# Dotflow — Active Backlog (M2.5)

**Project:** Dotflow
**Version:** 1.6
**Last Updated:** 2026-05-02
**Product Owner:** Quamca
**Repository:** https://github.com/Quamca/dotflow

> This file contains only **active US** (📋 Planned or 🔄 In Progress) from the current milestone.
> See also: [STATUS.md](STATUS.md) — current sprint overview · [BACKLOG_DONE.md](BACKLOG_DONE.md) — completed US · [BACKLOG_FUTURE.md](BACKLOG_FUTURE.md) — M3 and beyond

---

## 🐛 Known Bugs

| ID | Description | Priority | Reported in |
|----|-------------|----------|-------------|
| BUG-001 | StarField tooltips (StoryNode + StarNode) are too narrow — content gets clipped, width needs increase | Low | US-206 manual verification |
| BUG-003 | Follow-up questions use storyContext from past entries but user has no visibility into this — questions about past topics feel like hallucinations | Medium | US-210 manual verification |
| BUG-004 | New entries are not visually distinguished in the 3D sky — feature request: most recently added star should blink/pulse | Low | US-210 manual verification |

---

## 📊 Milestone Overview

| Milestone | Name | Status |
|-----------|------|--------|
| M1 | Core Journal + AI Follow-Up | ✅ Completed |
| M2 | Connections + Patterns | ✅ Completed |
| M2.5 | Experience Depth (pre-M3) | 🔄 In Progress (7/10 done) |
| M3 | Multi-User + Mobile | ⏸️ Blocked — M2.5 P0/P1 must complete first |

> **M3 Blockers remaining:** US-208 (Life Area Zones, P1). US-204 (P2) and US-209 (P2) are not M3 blockers.

---

# 📦 EPIC-002b: Experience Depth — Active Items

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
