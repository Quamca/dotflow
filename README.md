# Dotflow

> A journal that listens, asks, and connects the dots.

Dotflow is a personal reflection tool that turns your thoughts, events, and beliefs into connected entries. Write freely — Dotflow asks 2–3 follow-up questions to deepen your thinking, then quietly surfaces patterns and connections you may not have noticed.

---

## What It Does

- **Write** — free-form entry, like a diary
- **Reflect** — AI asks 2–3 targeted follow-up questions (emotions, thoughts, context)
- **Connect** — AI surfaces similar past entries: *"This reminds me of what you wrote 3 weeks ago..."*
- **Discover** — over time, patterns emerge: recurring emotions, beliefs, behavioral triggers

It is not a therapist. It does not give advice. It helps you understand yourself.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| AI | OpenAI GPT-4o-mini |
| Hosting | Vercel |

---

## Getting Started

See [docs/setup.md](docs/setup.md) for full setup instructions.

```powershell
git clone https://github.com/Quamca/dotflow.git
cd dotflow
npm install
cp .env.example .env
# fill in .env values
npm run dev
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [docs/architecture.md](docs/architecture.md) | System architecture and data model |
| [docs/requirements.md](docs/requirements.md) | Functional and non-functional requirements |
| [docs/wireframes.md](docs/wireframes.md) | Screen flows and UI specifications |
| [docs/design_brief.md](docs/design_brief.md) | Visual identity and design system |
| [docs/setup.md](docs/setup.md) | Development environment setup |
| [docs/test_cases.md](docs/test_cases.md) | Test strategy and test cases |
| [docs/code_snippets.md](docs/code_snippets.md) | Reusable patterns discovered during development |
| [BACKLOG.md](BACKLOG.md) | Product backlog with all epics, features, user stories |
| [MULTI_AGENT_ARCHITECTURE.md](MULTI_AGENT_ARCHITECTURE.md) | Claude Code multi-agent workflow |

---

## Multi-Agent Workflow

This project uses Claude Code with specialized agents. See [MULTI_AGENT_ARCHITECTURE.md](MULTI_AGENT_ARCHITECTURE.md).

```
/pm → /planning → /dev → manual verify → /qa → /docs
```

---

## Latest

- v1.6 — US-205: Depth-Driven Adaptive Insights — global single-tooltip system (`activeTooltipId` coordinator in StarField; 300ms uniform delay; opening a new tooltip closes the previous); BlackHole tooltip stability via `keepOpen` (500ms grace period) + `isTooltipHovered` anchors — no flicker when cursor moves from mesh to tooltip div; invisible hit mesh at `clampedSize * 1.6` for stable pointer target matching visual glow; `e.stopPropagation()` on all mesh events to prevent raycast bleed-through; `useDepthAccumulator.ts` with Pennebaker scoring (3pts/answer, word tiers, +2 connection bonus); `insightConfig.ts` configurable threshold; `generateHolisticInsight(entries, apiKey)` + `elaborateInsight(insight, entryExamples, apiKey)` in aiService; `getEntriesWithFollowUps()` in entryService; `HOLISTIC_INSIGHT_SYSTEM_PROMPT` + `INSIGHT_ELABORATION_SYSTEM_PROMPT` in prompts.ts; "To ma sens" is acknowledgment-only (`setAgreed(true)`, no AI call); "Rozwiń" triggers `elaborateInsight()` with entry examples; "Jest OK" dismisses elaboration; FollowUpDialog "Zmień pytanie" reroll (MAX_REROLLS=2)
- v1.5 — US-210: Contextual Follow-Up Between Lines — word count gate (>300 words shows *"Pięknie."* acknowledgment instead of questions, then Wróć → home); `generateFollowUpQuestions(content, apiKey, storyContext?)` accepts optional story context; `getRecentStories(excludeEntryId, limit)` in storyService fetches stories from last N distinct past entries; `FOLLOW_UP_SYSTEM_PROMPT` rewritten to focus on BETWEEN THE LINES (NEVER restate content, ask about hidden context/people/avoided life areas, use storyContext to notice patterns across entries)
- v1.4 — US-207: Emotion Intelligence per Story — AI detects emotion and confidence per story on save; `detectEmotionConfidence()` in aiService with fallback `{emotion:'mixed', confidence:0}`; `EMOTION_DETECTION_SYSTEM_PROMPT` in prompts.ts; `emotionColors.ts` maps 6 emotions to hex palette (joy/amber, sadness/blue, anger/red, fear/violet, calm/teal, mixed/stone); `updateStoryEmotion()` in storyService; StoryNode applies `meshBasicMaterial` color from emotion; re-classification triggered on "Dopowiedz" submission with combined content; tooltip timer locked during elaboration input
- v1.3 — US-206: Story Extraction — One Entry, Many Stars — AI automatically extracts N distinct stories from each entry; each story becomes a separate star in the 3D sky; stories from the same entry connected by purple session lines; "Dopowiedz" elaboration button on each story star; tooltip hover UX with 3s hide delay and one-at-a-time display; `stories` Supabase table with client-generated UUIDs for stable deterministic positions; `storyService` (saveStories, getStoriesForEntry, getAllStories, addElaboration); `extractStories()` in aiService with graceful fallback; `getStoryPosition()` with radius 3.5–9.0 distinct from entry stars
- v1.2 — US-203: Dialectical Insight Response — "To nie brzmi jak ja" button on black hole insight tooltip; disagree input with AI deepening question (max 15 words, neutral-curious, observational language); max 2 dialogue rounds; after round 2 Write Entry CTA becomes Amber primary (no pulsing); round limit invisible to user; `respondToInsightFeedback()` in aiService with DEEPENING_QUESTION_SYSTEM_PROMPT (round 1) and CLOSING_PHRASE_SYSTEM_PROMPT (round 2) that paraphrases user's own words
- v1.1 — US-202: Black Hole & Psychological Profile — black hole at center of 3D scene with pulsing glow halo and entry-count-based sizing; hover tooltip shows current insight; AI proposes 5 recurring themes (observational framing); ValuesModal with edit/remove/restore/add + "Żadna z tych" escape hatch; confirmed values stored in localStorage; star positions reflect value alignment (closer to center = more aligned)
- v1.0 — US-201: 3D Star Field — blurred star background on Home, Dotflow logo toggles interactive 3D mode; orbit controls (rotate/pan/zoom), hover entry previews, constellation lines between connected entries
- v0.9.1 — US-103: Fix AI insights language — pattern summary now responds in the language of journal entries (prompt language instruction added)
- v0.9.0 — US-102: AI pattern summary — "Generate insights" button (gated at 10+ entries), generatePatternSummary() service, PatternSummary component
- v0.8.0 — US-101: AI connection detection on entry save, ConnectionBadge component, fire-and-forget background check
- v0.7.0 — US-007: Home screen entry list, EntryCard component, Entry Detail view with follow-up Q&A
- v0.6.0 — US-006: AI follow-up questions dialog, OpenAI GPT-4o-mini integration via native fetch, graceful degradation (no key / API failure)
- v0.5.0 — US-005: New entry form with save to Supabase, floating Write button on Home, loading and error states
- v0.4.0 — US-004: Settings screen with API key management, warning banner on Home, client-side routing via react-router-dom
- v0.3.0 — US-003: GitHub Actions CI pipeline configured (lint + test + build on PR to main, branch protection enabled)
- v0.2.0 — US-002: Supabase client configured, database schema created (entries, followups, connections), entryService stubs implemented
- v0.1.0 — US-001: React + Vite + TypeScript project initialized (Tailwind CSS, ESLint, Prettier, Vitest + RTL configured)

---

## Repository

https://github.com/Quamca/dotflow
