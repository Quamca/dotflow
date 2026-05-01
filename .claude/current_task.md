# Current Task — US-210: Contextual Follow-Up Questions Between Lines

**Branch:** 210-contextual-followup
**Created:** 2026-05-01
**Status:** 🔄 In Progress

## Context
When a user writes a long entry (>300 words), Dotflow should skip follow-up questions and show a "Pięknie." acknowledgment — the entry is rich enough. For shorter entries, the AI follow-up questions should now be context-aware: they receive current and recent story summaries so they can ask about what's *between the lines* — people mentioned briefly, avoided topics, emotional undercurrents — not restate what the user already wrote.

## Files to Read First
- `src/pages/NewEntryPage.tsx`
- `src/services/aiService.ts`
- `src/utils/prompts.ts`
- `src/services/storyService.ts`

## Tasks
1. [ ] TASK-210.1: Add word count gate in `handleSubmit` in `NewEntryPage` — if word count >300, set `showPiknie = true`, skip AI questions
2. [ ] TASK-210.2: Add "Pięknie." UI state in `NewEntryPage` — centered text + "Wróć" button that navigates home
3. [ ] TASK-210.3: Add `getRecentStories(excludeEntryId, limit)` to `storyService.ts` — fetches stories from most recent N other entries
4. [ ] TASK-210.4: Update `generateFollowUpQuestions()` signature to accept optional `storyContext: string` and include it in the API body
5. [ ] TASK-210.5: Update `FOLLOW_UP_SYSTEM_PROMPT` — instruct AI to focus between-the-lines (people mentioned briefly, avoided areas, emotional undercurrents), never restate what's written
6. [ ] TASK-210.6: Wire in `NewEntryPage` — after entry save, fetch current entry stories + recent 3-entry stories, pass joined context to `generateFollowUpQuestions`
7. [ ] TASK-210.7: Tests (/qa)

## Constraints
- Word count: `content.trim().split(/\s+/).filter(Boolean).length`
- "Pięknie." path: entry is still saved + background tasks (extractAndSaveStories, detectAndSaveConnection) still fire
- Story context passed as plain text string (story contents joined by `\n---\n`)
- `storyContext` is optional — graceful if stories not yet available
- Max file length 300 lines — split if needed
- No `any` types

## Acceptance Criteria
- [ ] Entry with >300 words → "Pięknie." screen shown, no AI questions asked
- [ ] Entry with ≤300 words → follow-up questions generated with story context
- [ ] AI questions do not restate what the user wrote
- [ ] "Pięknie." screen has navigate-home button
- [ ] Background story/connection tasks still run on both paths

## After Implementation
- [ ] Run: `npm run lint`
- [ ] Run: `npm test`
- [ ] Manual verification steps (po polsku):
  1. Napisz wpis >300 słów → zapisz → sprawdź czy pojawia się "Pięknie." zamiast pytań
  2. Napisz wpis <300 słów → zapisz → sprawdź czy pytania są kontekstowe (nie powtarzają treści)
  3. Sprawdź czy nowe stories pojawiają się na sky po obu ścieżkach
- [ ] Potwierdź weryfikację wpisując 1 → agent automatycznie uruchomi /qa
