# Dotflow - Requirements Documentation

**Version:** 1.0
**Date:** 2026-04-09
**Author:** Product Owner
**Status:** Initial requirements

**Change Log:**
- v1.0 — Initial requirements from kickoff session

---

## 1. Introduction

### 1.1 Document Purpose
This document defines the functional and non-functional requirements for Dotflow across all planned milestones.

### 1.2 Application Purpose
Dotflow is a personal reflection journal that uses AI to ask follow-up questions and surface connections between past and present entries. It helps the user understand their own patterns of thought, emotion, and behavior — without acting as a therapist or advisor.

### 1.3 Milestone Scope Overview

| Milestone | Name | Status |
|-----------|------|--------|
| M1 | Core Journal + AI Follow-Up | 📋 Planned |
| M2 | Connections + Patterns | 📋 Planned |
| M3 | Multi-User + Mobile | 📋 Planned |

---

## 2. Functional Requirements — M1: Core Journal + AI Follow-Up

### FR-001: Entry Creation

**Priority:** MUST HAVE

**Description:**
The user must be able to write a free-form journal entry. The entry is the primary unit of the application — it captures a thought, event, situation, or feeling. After submitting, the AI generates follow-up questions.

**Acceptance Criteria:**
- User can type free-form text in an input area
- User can submit the entry
- Entry is saved to Supabase after the follow-up dialog is completed (or skipped)
- Entry appears in the entry list after saving

**Related User Stories:** US-005

---

### FR-002: AI Follow-Up Questions

**Priority:** MUST HAVE

**Description:**
After an entry is submitted, the AI analyzes the content and generates 2–3 follow-up questions targeting what is missing: emotions (if not mentioned), reflective opinion (if absent), context (if unclear). The user can answer, skip individual questions, or request more questions.

**Long Entry Rule (>300 words, US-210):** If the entry exceeds 300 words, no follow-up questions are shown. The app acknowledges with a single word — *"Pięknie."* — and the user navigates to the home/sky view. This reduces post-write friction for rich, detailed entries and follows /consult guidance on self-determination theory.

**Questions Between the Lines (US-210):** AI avoids restating emotions or facts already written explicitly in the entry. Questions focus on hidden context, people mentioned in passing, and life areas the user consistently avoids addressing. AI reads current entry stories and the last 3 entries for context.

**Acceptance Criteria:**
- If entry word count ≤300: AI generates 2–3 questions after submission
- If entry word count >300: no dialog shown; "Pięknie." acknowledgment displayed; user navigates to home
- Questions target what is implicit, not what is already written
- Questions shown one at a time in a dialog
- User can answer each question with free text
- User can skip any question
- User can request up to 2 additional questions via "Ask me more" button
- Maximum total questions: 5 (3 default + 2 optional)
- Answers are saved alongside the entry

**Related User Stories:** US-006, US-210

---

### FR-003: Entry List View

**Priority:** MUST HAVE

**Description:**
The user can see all past entries in chronological order (newest first). Each entry shows its content, date, and any detected connections.

**Acceptance Criteria:**
- All entries displayed chronologically (newest first)
- Each entry card shows: date, content preview (truncated if long), emotion tags if present
- Tapping/clicking an entry expands it to show full content and follow-up Q&A
- Empty state shown when no entries exist

**Related User Stories:** US-007

---

### FR-004: Settings — OpenAI API Key

**Priority:** MUST HAVE

**Description:**
The user must be able to enter and save their OpenAI API key. Without it, AI features are disabled and the user is shown a clear message.

**Acceptance Criteria:**
- Settings screen accessible from main navigation
- User can enter, save, and clear their OpenAI API key
- Key is stored in localStorage
- If no key is set, AI features show "Add your API key in Settings" message
- Key is never displayed in full after saving (show masked: `sk-...xxxx`)

**Related User Stories:** US-004

---

### FR-005: Project Setup and Infrastructure

**Priority:** MUST HAVE

**Description:**
The project must have a working development environment, linting, testing framework, and CI/CD pipeline before any feature development begins.

**Acceptance Criteria:**
- `npm run dev` starts local development server
- `npm run lint` runs ESLint with zero errors on clean project
- `npm test` runs Vitest with zero failures
- GitHub Actions runs lint + test + build on every PR

**Related User Stories:** US-001, US-002

---

## 3. Functional Requirements — M2: Connections + Patterns

### FR-006: Entry Connection Detection

**Priority:** MUST HAVE (M2)

**Description:**
When a new entry is saved, the AI compares it to recent past entries and identifies meaningful connections — similar emotions, situations, or behavioral patterns. If a connection is found with sufficient confidence, a connection badge appears on the new entry.

**Acceptance Criteria:**
- Connection check runs automatically after entry is saved (background, non-blocking)
- If similarity score > threshold (0.7), connection is stored
- Connection badge appears on entry: "Connected to entry from [date]"
- Clicking badge shows the connected entry

**Related User Stories:** US-101 (M2)

---

### FR-007: Pattern Summary

**Priority:** SHOULD HAVE (M2)

**Description:**
After a user has 10+ entries, the app can generate a brief AI summary of recurring patterns in their entries — emotional trends, repeated situations, or behavioral triggers they may not have noticed.

**Acceptance Criteria:**
- "Generate insights" button available when 10+ entries exist
- AI produces 3–5 bullet-point observations
- Summary is clearly labeled as AI-generated, not clinical advice

**Related User Stories:** US-102 (M2)

---

## 3b. Functional Requirements — M2.5: Experience Depth

### FR-008: 3D Entry Visualization

**Priority:** SHOULD HAVE (M2.5)

**Description:**
Journal entries are visualized as stars in a 3D space. Connections between entries appear as constellation lines. The visualization lives as a blurred background on Home and can be toggled into full interactive mode via an easter egg button under the Dotflow logo.

**Acceptance Criteria:**
- 3D star field visible as blurred background on Home
- One star per entry; constellation lines for connected entries
- Toggle button switches between list view and full 3D mode
- Hover on star shows entry preview
- Orbit controls: rotate, pan, zoom (like 3D modeling software)

**Related User Stories:** US-201, US-202

---

### FR-009: Psychological Profile — Black Hole

**Priority:** SHOULD HAVE (M2.5)

**Description:**
A "black hole" at the center of the 3D visualization represents the user's psychological core. It grows subtly as entries accumulate. Hovering reveals the current AI insight. Entry positioning reflects alignment with the user's confirmed values (semi-automatically extracted by AI).

**Acceptance Criteria:**
- Black hole visible at center, size grows with entry count (capped)
- Hover shows current pattern insight (replaces "Generate insights" button)
- AI proposes 5 values after sufficient entries; user confirms or edits
- Stars positioned closer to center when entries align with user's values

**Related User Stories:** US-202

---

### FR-010: Dialectical Insight Feedback

**Priority:** SHOULD HAVE (M2.5)

**Description:**
Users can push back on AI insights. The AI responds with a single deepening question — it never updates the insight through conversation. Insights can only change when new entries are written and the depth accumulator threshold is crossed again. Max 2 rounds of dialogue; after round 2, the AI gently redirects the user to write a new entry.

**AI Behavior Contract (per docs/ai_communication_principles.md):**
- One mode only: respond with a deepening question using observational-data language
- Insight never updates through conversation — only through new entries
- Max 2 dialogue rounds; after round 2: *"To brzmi jak coś wartego zapisania."* + Write Entry CTA highlight
- Round limit is invisible to the user — never communicated explicitly
- Never confront entry contradictions even if detected
- Never simply agree to validate the user
- Never clinical interpretation

**Deepening question rules:**
- Open question, max 15 words, neutral-curious tone
- Safe openers: "Co sprawia, że...", "Skąd pochodzi to poczucie, że..."
- Forbidden: "Dlaczego...", "Ale...", any reference to the insight text

**Acceptance Criteria:**
- "To nie brzmi jak ja" button visible below insight (non-adversarial framing)
- User can type reason using placeholder: "Co sprawia, że ten wgląd nie pasuje?"
- AI responds with one deepening question (never updates insight)
- After 2 rounds: closing phrase paraphrases user's content (not a fixed template), Write Entry button style changes to primary (Amber fill, no pulsing)
- Round limit mechanism is invisible to user

**Related User Stories:** US-203

---

### FR-011: Contextual First-Use Onboarding

**Priority:** SHOULD HAVE (M2.5)

**Description:**
Each AI feature in Dotflow explains itself exactly once, at the moment of first use, with a single sentence. No welcome screen, no tutorial. Hints are contextual — they teach users what they are currently experiencing. All hint states are persisted in localStorage so hints never repeat.

**Onboarding Moments:**
1. First follow-up questions: one-liner above FollowUpDialog
2. First connection badge: tooltip on ConnectionBadge
3. First black hole hover: hint near center of 3D scene (M2.5, requires US-201)

**API Key Warning Update:**
Banner must communicate missing value, not just missing key: *"Without an API key you won't see follow-up questions, connections, or insights."*

**Acceptance Criteria:**
- Hints appear only on first use of each feature
- After first use, hints are permanently hidden (localStorage state)
- API key warning banner names the specific features users are missing

**Related User Stories:** US-204

---

### FR-012: Depth-Driven Adaptive Pattern Summaries

**Priority:** SHOULD HAVE (M2.5)

**Description:**
Pattern insights are driven by a continuous reflection depth accumulator — not fixed entry count. Every entry contributes a depth score (0–20 pts) based on quality signals grounded in Pennebaker Expressive Writing Research: follow-up questions answered (3 pts each, max 15), word count in tiers (50–150: +1, 150–300: +2, 300+: +3, capped), connection detected (+2 bonus), entries under 30 words score 0 flat. When the accumulator crosses a configurable threshold, a holistic insight is generated and delivered via black hole hover. The accumulator resets after delivery and continues forever — no upper limit.

Two insight types operate independently:
1. **Holistic Insight** — black hole hover, cumulative identity-level pattern
2. **Connection Insight** — inline near ConnectionBadge, immediate and specific to the detected connection

The black hole provides heartbeat feedback on every entry save — pulse intensity reflects the entry's depth score. No numbers or bars shown to user.

**AI Behavior:**
- Holistic insight prompt: focuses on cumulative patterns across all entries since last insight
- Connection insight prompt: contextualizes the specific connection in one sentence
- Pre-insight state: black hole hover shows *"Keep writing — your center is forming."*

**Black Hole Insight Behavior by Story Context:**
- Same/repeated story topic → *"Ten temat pojawia się kolejny raz — coś w nim jest ważnego."*
- Contradicting or different story from previous → *"Tym razem inaczej — coś się zdaje zmieniać."*
- Single short entry (<30 words) → silence, no comment
- 3 or more consecutive short entries → *"Czy nie chcesz dziś pisać, czy jest coś co sprawia Ci trudność w opowiedzeniu?"*

**Acceptance Criteria:**
- Depth accumulator computed per entry: 3 pts/follow-up answer (max 15), word count tiers (+1/+2/+3), connection bonus (+2), <30 words = 0 flat; range 0–20
- Accumulator threshold is configurable (not hardcoded)
- Holistic insight generated when threshold crossed, persisted, accumulator resets
- Black hole pulses proportionally after every entry save (no explicit score shown)
- Black hole glows when unread holistic insight is available
- Connection insight appears inline near ConnectionBadge when connection detected
- All insights persisted in localStorage (not regenerated on hover)
- Repeated topic: black hole responds with *"Ten temat pojawia się kolejny raz..."*
- Contradicting topic: black hole responds with *"Tym razem inaczej..."*
- Single short entry: no black hole comment (silence)
- 3+ consecutive short entries: black hole responds with invitation to share difficulty

**Related User Stories:** US-205

---

### FR-013: Story Extraction — One Entry, Many Stars

**Priority:** MUST HAVE (M2.5 P0)

**Description:**
When an entry is saved, AI automatically extracts N distinct stories (scenes, situations, events) from the text. Each story becomes a separate star in the 3D visualization. Stories from the same entry are connected by a session line. Each story has a "Dopowiedz" (Elaborate) button — the user adds context, never replaces. AI re-classifies emotion and life area based on elaboration.

**Architectural Note:** This is a fundamental pivot — the star in the 3D sky represents a story, not an entry. All features built after US-206 operate at the story level, not the entry level.

**Acceptance Criteria:**
- AI segments each entry into N stories on save
- Each story saved to the `stories` Supabase table
- Each story rendered as a separate star in StarField
- Stories from the same entry connected by a visible session line
- "Dopowiedz" button available on every story star (never deletes, only adds context)
- AI re-classifies emotion and life area when elaboration is submitted
- Entry with no distinct stories segmented → treated as 1 story

**Related User Stories:** US-206

---

### FR-014: Emotion Intelligence per Story

**Priority:** SHOULD HAVE (M2.5 P1)

**Description:**
AI detects emotion and confidence score for each story. Both high-confidence (>80%) and low-confidence (<80%) results are assigned silently — no emotion wheel, no prompt. Star color reflects the story's emotion. Emotion correction is post-hoc only: user notices wrong color → "Dopowiedz" elaboration → AI re-classifies.

**UX Principle:** Removing the emotion wheel from the post-write flow (confirmed by /consult). Deferred correction via elaboration respects self-determination theory — user initiates, not prompted.

**Acceptance Criteria:**
- AI detects `{emotion, confidence}` per story on save
- Both high (>80%) and low (<80%) confidence results assigned silently — no UI prompt
- No emotion wheel shown at any point in the application flow
- Star color = emotion color (palette: joy/amber, sadness/blue, anger/red, fear/violet, calm/teal, mixed/stone)
- "Dopowiedz" elaboration triggers AI re-classification of emotion
- Star color updates after re-classification

**Related User Stories:** US-207

---

### FR-015: Life Area Zones — Emergent Clusters

**Priority:** SHOULD HAVE (M2.5 P1)

**Description:**
Life area zones emerge organically from accumulated stories. No default zones (no preset "Praca", "Rodzina", "Zdrowie"). After ~15 stories, clusters of thematically related stories become visible as subtle ambient glows. AI suggests a zone label shown only on hover. User can rename or clear labels. Areas the user never writes about are never shown as empty zones.

**Acceptance Criteria:**
- No preset life area zones — all zones are emergent from content
- Zones appear only when a cluster has ≥5 stories in the same area
- Zone label visible only on hover — not shown by default
- User can rename or clear any zone label
- Absent life areas are never shown as empty zones
- Zone labels stored in localStorage (user-controlled)

**Related User Stories:** US-208

---

### FR-016: Typed Connection Visualization

**Priority:** COULD HAVE (M2.5 P2)

**Description:**
Constellation lines between connected stories are visually differentiated by content type. Three visual styles based on AI classification: solid colored lines (similar emotions), dashed lines (similar topic/situation), chain-style lines (similar life choices). No labels shown to user — visual differentiation only. No Dilts, DISC, or MBTI labels visible at any point.

**Acceptance Criteria:**
- AI classifies connection type: `"emotional"` | `"thematic"` | `"life-choices"`
- Solid colored lines for emotional connections
- Dashed lines for thematic connections
- Chain-style lines for life-choice connections
- No labels on lines
- 3D filter panel allows showing/hiding each connection type
- No psychological framework labels visible to user

**Related User Stories:** US-209

---

## 4. Non-Functional Requirements

### NFR-001: Performance

**Requirement:** The app must feel responsive. AI calls should not block the UI.

**Metrics:**
- Initial page load: < 2 seconds on average connection
- Entry save (before AI): < 500ms
- AI follow-up question generation: < 5 seconds (shown with loading state)
- Connection detection: runs in background, does not delay UI

---

### NFR-002: Security

**Requirement:** User data and API key must be handled safely.

**Implementation:**
- OpenAI API key stored only in localStorage, never in Supabase
- Supabase anon key is safe to expose (standard pattern)
- No sensitive data in URL parameters
- User informed that entry content is sent to OpenAI

---

### NFR-003: Usability

**Requirement:** Writing an entry should feel effortless. Maximum friction: entry → questions → done in under 2 minutes.

**Criteria:**
- Follow-up questions are short and conversational (not clinical)
- All questions can be skipped
- No account creation required
- First-time user can start writing in under 30 seconds after setup

---

### NFR-004: Reliability

**Requirement:** If AI is unavailable or API key is missing, core journal functionality still works.

**Implementation:**
- Entry can be saved without completing AI follow-up
- Clear error states when AI call fails
- Supabase offline: show error, do not lose written content

---

### NFR-005: Compatibility

**Platforms:**
- Web (primary): Chrome, Firefox, Safari — latest 2 versions
- Mobile web: iOS Safari, Chrome Android — basic functionality

---

### NFR-006: Privacy

**Requirements:**
- User is informed in Settings that their entry content is sent to OpenAI for AI features
- No analytics or tracking in MVP
- No third-party scripts beyond Supabase and OpenAI SDKs
- GDPR: not applicable for single-user personal tool (M1)

---

## 5. Data Requirements

### 5.1 Data Entities

| Entity | Description | Storage |
|--------|-------------|---------|
| Entry | A journal entry with content, emotions, tags | Supabase |
| FollowUp | A question + answer pair linked to an entry | Supabase |
| Connection | A link between two related entries | Supabase |
| Settings | User preferences including API key | localStorage |

### 5.2 Data Retention

| Data Type | Retention | Deletion Policy |
|-----------|-----------|-----------------|
| Entries | Indefinite | Manual delete (future feature) |
| Connections | Indefinite | Cascade delete with entry |
| API Key | Until user clears it | User-controlled in Settings |

---

## 6. Integration Requirements

### 6.1 External Services

| Service | Purpose | API Type |
|---------|---------|----------|
| OpenAI | Follow-up questions, connection detection | REST (official SDK) |
| Supabase | Database storage and sync | REST (official SDK) |
| Vercel | Hosting and deployment | Git-based |

---

## 7. Constraints

### 7.1 Technical Constraints
- No backend server in MVP — all logic in browser
- OpenAI API key must be supplied by user
- Supabase free tier limits: 500MB database, 2GB bandwidth/month

### 7.2 Business Constraints
- MVP is personal use only — no multi-user, no sharing
- No monetization in MVP

---

## 8. Out of Scope (for MVP — M1)

The following are explicitly NOT included in M1:
- User authentication / multiple accounts
- Graph visualization of entry connections
- Mobile application
- Export / import of entries
- Push notifications or reminders
- Public sharing of entries
- Therapist-mode or clinical features
- Offline support

---

## 9. Glossary

| Term | Definition |
|------|------------|
| Entry | A journal record written by the user |
| Follow-up question | An AI-generated question to deepen reflection after an entry |
| Connection | A detected similarity between two entries |
| Dot | Informal term for a single entry (used in product vision) |
| Pattern | A recurring theme across multiple entries, surfaced by AI |

---

*This document is updated when new requirements are discovered during /discover or /docs sessions.*
