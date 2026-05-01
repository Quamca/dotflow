# Current Task — US-207: Emotion Intelligence per Story

**Branch:** 207-emotion-intelligence
**Created:** 2026-04-28
**Status:** 🔄 In Progress

## Context
AI detects emotion and confidence for each story on save. Both high (>80%) and low (<80%) confidence results are assigned silently — no emotion wheel, no prompt ever. Star color = detected emotion. Correction is post-hoc only: user clicks "Dopowiedz", writes elaboration, AI re-classifies based on combined content, star changes color immediately.

## Files to Read First
- src/services/aiService.ts
- src/services/storyService.ts
- src/components/StarField/StoryNode.tsx
- src/components/StarField/StarField.tsx
- src/pages/NewEntryPage.tsx
- src/utils/prompts.ts
- src/types/index.ts

## Tasks
1. [ ] TASK-207.2: Add EMOTION_DETECTION_SYSTEM_PROMPT to src/utils/prompts.ts
2. [ ] TASK-207.1: Add detectEmotionConfidence(content, apiKey) to aiService.ts — never throws, fallback {emotion:'mixed', confidence:0}
3. [ ] TASK-207.3: Create src/utils/emotionColors.ts — getEmotionColor(emotion) maps to hex palette
4. [ ] TASK-207.5a: Add updateStoryEmotion(storyId, emotion, confidence) to storyService.ts
5. [ ] TASK-207.4: Update StoryNode.tsx — add apiKey? prop, local emotion state, color from getEmotionColor, re-classify on elaboration submit
6. [ ] TASK-207.4b: Update StarField.tsx — pass apiKey to StoryNode
7. [ ] TASK-207.5b: Update NewEntryPage.tsx extractAndSaveStories() — classify emotions per story after saveStories using Promise.allSettled

## Constraints
- No emotion wheel at any point — all classification is silent
- detectEmotionConfidence must never throw — always return fallback {emotion:'mixed', confidence:0}
- Emotion color updates immediately in local StoryNode state after elaboration re-classification
- Default color (stone #78716C) shown when emotion is null/mixed
- Use meshBasicMaterial (flat color, no lighting dependency)
- Emotion palette: joy→#F59E0B, sadness→#3B82F6, anger→#EF4444, fear→#8B5CF6, calm→#14B8A6, mixed/null→#78716C
- Re-classify on elaboration: combined content = story.content + \n\n[Elaboration]: + elaboration text

## Acceptance Criteria
- [ ] On story save, detectEmotionConfidence called per story — emotion+confidence stored in stories table
- [ ] Star color reflects emotion (palette above), stone default when null
- [ ] No emotion wheel shown at any point
- [ ] "Dopowiedz" elaboration triggers re-classification and immediate star color update in UI
- [ ] Both high and low confidence results assigned silently

## After Implementation
- [ ] Run: `npm run lint`
- [ ] Run: `npm test`
- [ ] Manual verification steps (po polsku):
  1. Napisz wpis zawierający 2-3 wyraźnie różne emocjonalnie sceny (np. stresująca rozmowa + radosne spotkanie)
  2. Zapisz wpis — wejdź w tryb 3D (kliknij logo Dotflow)
  3. Sprawdź czy gwiazdki mają różne kolory odzwierciedlające emocje
  4. Najedź na gwiazdkę — sprawdź czy kolor sfery jest widoczny
  5. Kliknij "Dopowiedz" na jednej gwiazdce, wpisz coś o innej emocji — wyślij
  6. Sprawdź czy gwiazdka zmieniła kolor po potwierdzeniu "Pięknie."
- [ ] Potwierdź weryfikację wpisując 1 → agent automatycznie uruchomi /qa
