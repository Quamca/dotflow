# Dotflow — Active Backlog (M2.5)

**Project:** Dotflow
**Version:** 1.7
**Last Updated:** 2026-05-03
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
After ~15 stories, AI detects thematic clusters and suggests hover-only zone labels. User can rename or clear a label. No default zones. No visualization of absent life areas. Stories are always the foreground — zones are ambient, secondary, and dynamic.

**As a** user
**I want** my sky to naturally group into areas of my life
**So that** I see my actual patterns — not a template of what I should be writing about

**Status:** 📋 Planned
**Story Points:** 13
**Priority:** P1

**Acceptance Criteria:**
- [ ] `aiService.classifyLifeArea(storyContent, existingAreas, apiKey)` assigns a life area label to each story (or null if unclear)
- [ ] Life area stored in `stories.life_area` field
- [ ] Stories from the same emergent area are spatially clustered in 3D space (position bias toward cluster centroid)
- [ ] Zone visual: nebula/cloud overlay with very low opacity, soft gradient, subtle ambient motion — NOT a solid colored region
- [ ] Zone label appears only on hover — not visible by default
- [ ] User can rename a zone label (stored in localStorage)
- [ ] User can clear a zone label (zone disappears without label)
- [ ] Zones only emerge when cluster has ≥5 stories in the same area
- [ ] No placeholder / empty zones for life areas the user never writes about
- [ ] Zones are fully emergent — no preset list (no "Praca", "Rodzina", "Zdrowie")
- [ ] Zones fade and reorganize dynamically when cluster themes stop returning
- [ ] Forbidden: fixed stable map layout, permanent zone boundaries, sharp edges, legend panel, percentage or count display

**Tasks:**
- [ ] **TASK-208.1:** Implement `aiService.classifyLifeArea(storyContent, existingAreas, apiKey)` - 45min
- [ ] **TASK-208.2:** Add life area prompt to `src/utils/prompts.ts` - 20min
- [ ] **TASK-208.3:** Implement zone cluster detection from `stories.life_area` values — group stories, compute cluster centroid - 40min
- [ ] **TASK-208.4:** Apply spatial clustering bias to story positions within the same zone - 30min
- [ ] **TASK-208.5:** Render zone nebula/cloud overlay in StarField (very low opacity, soft gradient, ambient motion) - 60min
- [ ] **TASK-208.6:** Add hover-only label rendering per zone cluster - 20min
- [ ] **TASK-208.7:** Create `useLifeAreaZones.ts` hook — manages labels + user renames in localStorage - 30min
- [ ] **TASK-208.8:** Implement zone fade/reorganize when cluster becomes inactive - 30min
- [ ] **TASK-208.9:** Write tests (/qa) - 45min
- [ ] **TASK-208.10:** Manual verification - 20min

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

---

## 🔧 FEATURE-021: Insight History Timeline

**Description:**
A minimalist chronological history of past holistic insights — presented as "noticed reflection moments", not a psychological profile. Each insight is temporally anchored to the period it was generated. Collapsible, scoped to a time window. No permanent profile summary.

**UX Constraint:** History must feel like a journal of reflections, not a dashboard of patterns. Date + 1–2 sentences per entry only. No dashboard feeling.

**Priority:** P2
**Status:** 📋 Planned

---

### US-211: Insight History Timeline

**Description:**
Store past holistic insights with timestamps. Show a collapsible history view: chronological list, newest first, each entry showing date + 1–2 sentence insight with temporal framing. No permanent pinned summary. No profiling UI.

**As a** user
**I want** to look back at what patterns Dotflow noticed over time
**So that** I can see how my reflective patterns have shifted — without it feeling like a permanent diagnosis

**Status:** 📋 Planned
**Story Points:** 5
**Priority:** P2

**Acceptance Criteria:**
- [ ] Past holistic insights stored in localStorage with timestamp on generation
- [ ] Insight history view available from black hole InsightModal (collapsible section)
- [ ] Format: date label + 1–2 sentence insight text, newest first
- [ ] All insight text uses temporal framing ("lately...", "in recent stories...", "in this period...")
- [ ] History is collapsible — not always expanded
- [ ] No permanent pinned profile summary
- [ ] Forbidden: confidence scores, scoring, permanent emotional profile, identity labels, dashboard UI

**Tasks:**
- [ ] **TASK-211.1:** Save holistic insights to localStorage history (key: `dotflow_insight_history`, array of `{text, timestamp}`) on generation - 20min
- [ ] **TASK-211.2:** Add collapsible "Historia refleksji" section to InsightModal - 30min
- [ ] **TASK-211.3:** Render history list: date + text, newest first, max 20 entries - 30min
- [ ] **TASK-211.4:** Write tests (/qa) - 30min
- [ ] **TASK-211.5:** Manual verification - 15min

---

## 🔧 FEATURE-022: Interactive Connection Highlighting

**Description:**
Hovering a story star highlights only its direct connections. The rest of the sky subtly fades. Lines emerge from darkness. Fast, subtle animations. Supports noticing patterns — not analytical graph exploration.

**UX Constraint:** No permanent active graph state. Highlighting resets immediately on mouse leave. Animations must be fast and non-aggressive.

**Priority:** P2
**Status:** 📋 Planned

---

### US-212: Interactive Connection Highlighting

**Description:**
When the user hovers a story star, only the direct connections of that star (and optionally up to 2 levels) become visually prominent. The remaining sky fades subtly. Connection lines animate in as emerging from darkness.

**As a** user
**I want** to see which stories connect to the one I'm hovering
**So that** I can notice patterns without needing to analyze the full graph

**Status:** 📋 Planned
**Story Points:** 5
**Priority:** P2

**Acceptance Criteria:**
- [ ] Hover on story star: direct connections of that star visually prominent
- [ ] Optional: up to 2 levels of relationships highlighted (2nd-degree at lower opacity)
- [ ] Non-connected stars: subtle fade-out (remain visible but visually recede)
- [ ] Connection lines animate in as emerging from darkness (opacity transition, < 200ms)
- [ ] Animations: fast (< 200ms), subtle — no pulsing, no blinking
- [ ] State resets immediately on mouse leave
- [ ] Forbidden: permanent active graph state, full graph reveal, labeled connection panels

**Tasks:**
- [ ] **TASK-212.1:** Add `hoveredStoryId` state to StarField — propagated to all StoryNode and ConstellationLines components - 20min
- [ ] **TASK-212.2:** StoryNode: fade non-connected stars when `hoveredStoryId` is active - 30min
- [ ] **TASK-212.3:** ConstellationLines: highlight direct connections of hovered star; fade others - 30min
- [ ] **TASK-212.4:** Connection lines: opacity transition animation (emerge from darkness) - 20min
- [ ] **TASK-212.5:** Write tests (/qa) - 30min
- [ ] **TASK-212.6:** Manual verification - 15min

---

## 🔧 FEATURE-023: Story Sequence Navigation

**Description:**
Subtle arrows in the story modal allow navigating between stories from the same entry. Maintains narrative continuity. Stars remain autonomous memory fragments — arrows only hint at shared origin.

**UX Constraint:** Small, secondary arrows. No pagination indicators. No slideshow. No auto-next.

**Priority:** P2
**Status:** 📋 Planned

---

### US-213: Story Sequence Navigation

**Description:**
Story modal shows small navigation arrows when the story has siblings (other stories from the same entry). Clicking navigates to the adjacent story. No "2/5" indicator, no swipe.

**As a** user
**I want** to move between stories from the same entry
**So that** I can follow the narrative of what I wrote without losing my place in the sky

**Status:** 📋 Planned
**Story Points:** 3
**Priority:** P2

**Acceptance Criteria:**
- [ ] Story modal detects sibling stories (same `entry_id`) from the loaded stories list
- [ ] Left/right arrows rendered in modal — small, visually secondary (not primary CTA)
- [ ] Arrows visible only when siblings exist
- [ ] Clicking arrow navigates to previous/next sibling story
- [ ] No pagination indicator ("2 of 5")
- [ ] No swipe gesture, no auto-advance, no chapter framing
- [ ] Arrows visible only inside modal — not in 3D sky

**Tasks:**
- [ ] **TASK-213.1:** StoryModal receives sibling stories as prop (or fetches via `getStoriesForEntry`) - 20min
- [ ] **TASK-213.2:** Add small prev/next arrow buttons to StoryModal (conditional render) - 25min
- [ ] **TASK-213.3:** Implement story switching within modal (update displayed story, no re-render of sky) - 20min
- [ ] **TASK-213.4:** Write tests (/qa) - 25min
- [ ] **TASK-213.5:** Manual verification - 15min

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
