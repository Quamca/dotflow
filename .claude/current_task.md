# Current Task — US-206: Story Extraction — One Entry, Many Stars

**Branch:** 206-story-extraction
**Created:** 2026-04-28
**Status:** 🔄 In Progress

## Context
Architectural pivot: the star in the 3D sky is no longer an entry — it is a story. When the user saves an entry, AI automatically extracts N distinct stories (scenes, situations, events). Each story becomes a separate star in StarField. Stories from the same entry are connected by a thin session line. Each star has a "Dopowiedz" (Elaborate) button — never deletes, only adds context. AI re-classifies on elaboration.

## Files to Read First
- `src/services/aiService.ts` — add `extractStories()`
- `src/components/StarField/StarField.tsx` — integrate StoryNode + session lines
- `src/components/StarField/StarNode.tsx` — reference for StoryNode structure
- `src/utils/starPositions.ts` — extend to derive position from story id
- `src/types/index.ts` — add Story type
- `src/pages/NewEntryPage.tsx` — trigger extractStories after entry save

## Tasks
1. [ ] **TASK-206.1:** Create `stories` table in Supabase — id, entry_id, content, emotion, emotion_confidence, life_area, position, created_at (run SQL in Supabase dashboard)
2. [ ] **TASK-206.2:** Add `Story` type to `src/types/index.ts`
3. [ ] **TASK-206.3:** Implement `aiService.extractStories(content, apiKey)` — returns `string[]` of story segments; add `STORY_EXTRACTION_SYSTEM_PROMPT` to `src/utils/prompts.ts`
4. [ ] **TASK-206.4:** Create `src/services/storyService.ts` — `saveStories(entryId, stories)`, `getStoriesForEntry(entryId)`
5. [ ] **TASK-206.5:** Extend `src/utils/starPositions.ts` — `getStoryPosition(storyId)` derives stable [x,y,z] from story UUID hash
6. [ ] **TASK-206.6:** Create `src/components/StarField/StoryNode.tsx` — star mesh + Html tooltip (story content snippet) + "Dopowiedz" button + elaboration textarea + submit
7. [ ] **TASK-206.7:** Add session lines in `StarField.tsx` — thin lines connecting stories from the same entry (distinct from constellation lines)
8. [ ] **TASK-206.8:** Integrate story extraction into `NewEntryPage.tsx` — after entry save, call `extractStories()` fire-and-forget, save to `storyService`
9. [ ] **TASK-206.9:** Write tests (/qa)
10. [ ] **TASK-206.10:** Manual verification

## Constraints
- Story extraction runs fire-and-forget after entry save — never blocks UI or delays navigation
- `extractStories()` never throws — returns `['[full entry content]']` fallback on any error (1 story = 1 star)
- Entry with 0 detectable stories → treated as 1 story (full entry content as the story)
- Session lines must be visually distinct from constellation connection lines (different color/opacity)
- "Dopowiedz" elaboration: saves elaboration text, triggers re-classification — original story content preserved
- No emotion classification in this US — `emotion` and `emotion_confidence` fields left null (handled in US-207)
- No life area classification in this US — `life_area` field left null (handled in US-208)
- Story positions derived from story id, not entry id — must be stable across re-renders
- All OpenAI calls go through `src/services/aiService.ts` — never call API directly from components

## Acceptance Criteria
- [ ] On entry save, `aiService.extractStories(content, apiKey)` called — returns array of story strings
- [ ] Each story saved to `stories` table linked to the entry
- [ ] Each story rendered as a separate `<StoryNode>` in StarField
- [ ] Stories from same entry connected by a thin session line (distinct from constellation connection lines)
- [ ] "Dopowiedz" button on each StoryNode tooltip — opens elaboration textarea
- [ ] On submit of elaboration: original story content preserved, re-classification triggered (emotion/life_area updated)
- [ ] Story positions are stable (derived from story id, not entry id)
- [ ] Entry with 0 detectable stories → treated as 1 story

## After Implementation
- [ ] Run: `npm run lint`
- [ ] Run: `npm test`
- [ ] Manual verification steps (po polsku):
  1. Napisz wpis zawierający 2-3 wyraźnie różne sceny/sytuacje (np. rano praca, wieczór spacer)
  2. Zapisz wpis
  3. Przejdź do widoku 3D — sprawdź czy pojawiło się kilka gwiazdek (nie jedna)
  4. Sprawdź czy gwiazdki z tego samego wpisu są połączone cienką linią sesji
  5. Najedź na gwiazdkę — sprawdź czy tooltip pokazuje treść tej konkretnej sceny
  6. Kliknij "Dopowiedz" na jednej gwiazdce — wpisz dodatkowy kontekst i wyślij
  7. Sprawdź w Supabase czy tabela `stories` zawiera zapisane rekordy
  8. Napisz bardzo krótki wpis (1 zdanie) — sprawdź czy pojawia się 1 gwiazdka
- [ ] Potwierdź weryfikację wpisując 1 → agent automatycznie uruchomi /qa
