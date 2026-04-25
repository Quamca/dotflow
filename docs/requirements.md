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

**Acceptance Criteria:**
- AI generates 2–3 questions after entry submission
- Questions are shown one at a time or as a dialog
- User can answer each question with free text
- User can skip any question
- User can request up to 2 additional questions via "Ask me more" button
- Maximum total questions: 5 (3 default + 2 optional)
- Answers are saved alongside the entry

**Related User Stories:** US-006

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
Users can push back on AI insights. The AI responds dialectically: it either updates the insight when given genuine new information, or gently holds its position when the pushback is emotional. The AI never confronts contradictions in entries.

**AI Behavior Contract:**
- Mode A — new information received: acknowledge and update insight
- Mode B — emotional pushback: hold position warmly, add a deepening question
- Never confront entry contradictions even if detected
- Never simply agree to validate the user

**Acceptance Criteria:**
- "I disagree" option visible below insight
- User can type reason for disagreement
- AI responds in Mode A or Mode B based on content
- Mode A: insight updates; Mode B: deepening question displayed

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

**Acceptance Criteria:**
- Depth accumulator computed per entry: 3 pts/follow-up answer (max 15), word count tiers (+1/+2/+3), connection bonus (+2), <30 words = 0 flat; range 0–20
- Accumulator threshold is configurable (not hardcoded)
- Holistic insight generated when threshold crossed, persisted, accumulator resets
- Black hole pulses proportionally after every entry save (no explicit score shown)
- Black hole glows when unread holistic insight is available
- Connection insight appears inline near ConnectionBadge when connection detected
- All insights persisted in localStorage (not regenerated on hover)

**Related User Stories:** US-205

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
