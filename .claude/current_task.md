# Current Task — US-205: Depth-Driven Adaptive Insights

**Branch:** 205-depth-driven-insights
**Created:** 2026-05-01
**Status:** 🔄 In Progress

## Context
Replace fixed-milestone insight triggers with a continuous reflection depth accumulator. Every entry contributes depth points (follow-up answers: 3pts each max 15, word count tiers +1/+2/+3, connection bonus +2, <30 words = 0 flat). When the accumulator crosses a configurable threshold, `aiService.generateHolisticInsight()` is called, result persisted in localStorage, delivered via black hole hover. The black hole pulses proportionally on every save. Two insight types (holistic + connection) operate independently.

## Files to Read First
- `src/services/aiService.ts` — add `generateHolisticInsight()`
- `src/utils/prompts.ts` — add holistic insight + connection insight prompts
- `src/components/StarField/BlackHole.tsx` — heartbeat animation, glow state, hover text
- `src/components/StarField/StarField.tsx` — orchestration, depth score passing
- `src/components/ConnectionBadge.tsx` — inline connection insight display
- `src/hooks/useSettings.ts` — API key access pattern
- `src/services/entryService.ts` — understand connection detection flow

## Tasks
1. [ ] **TASK-205.2:** Create `src/utils/insightConfig.ts` — configurable depth score weights and threshold
2. [ ] **TASK-205.1:** Create `src/hooks/useDepthAccumulator.ts` — score computation + localStorage persistence
3. [ ] **TASK-205.3:** Implement `aiService.generateHolisticInsight(entries, apiKey)` + prompt in prompts.ts
4. [ ] **TASK-205.4:** Trigger holistic insight generation in NewEntryPage when accumulator threshold crossed
5. [ ] **TASK-205.5:** Persist holistic insight + unread state in localStorage; retrieve on black hole hover
6. [ ] **TASK-205.6:** Pass depth score of last entry to StarField → proportional heartbeat animation in BlackHole
7. [ ] **TASK-205.7:** Add glow/pulse to BlackHole when unread holistic insight exists; clear on first hover
8. [ ] **TASK-205.8:** Implement connection insight inline near ConnectionBadge (one sentence, specific)
9. [ ] **TASK-205.9:** Add pre-insight fallback text on black hole hover: "Keep writing — your center is forming."
10. [ ] **TASK-205.10:** Tests (/qa)
11. [ ] **TASK-205.11:** Manual verification

## Constraints
- Depth accumulator persists in localStorage under key `dotflow_depth_accumulator`
- Holistic insight persists in localStorage under key `dotflow_holistic_insight`
- Unread state persists in localStorage under key `dotflow_holistic_insight_unread`
- Story context (repeated/contradicting) stored in localStorage under key `dotflow_story_context`
- All score weights live in `insightConfig.ts` — never hardcode in business logic
- No numbers, bars, or explicit scores shown to user — purely visual feedback
- Insight does NOT regenerate on every hover — read once from localStorage
- Black hole story context responses are Polish (product copy)
- Connection insight is one sentence max, specific — not identity-level
- Max file length 300 lines — split if needed
- No `any` types

## Depth Score Model (Pennebaker)
| Signal | Points |
|---|---|
| Each follow-up answer | 3 pts (max 15 total) |
| Word count 50–150 | +1 pt |
| Word count 150–300 | +2 pts |
| Word count 300+ | +3 pts |
| Connection detected | +2 pts bonus |
| Entry < 30 words | 0 pts (flat) |
| Range | 0–20 pts |

## Black Hole Story Context Responses (Polish)
| Pattern | Response |
|---|---|
| Repeated topic | "Ten temat pojawia się kolejny raz — coś w nim jest ważnego." |
| Contradicting topic | "Tym razem inaczej — coś się zdaje zmieniać." |
| Single short entry (<30 words) | Silence |
| 3+ consecutive short entries | "Czy nie chcesz dziś pisać, czy jest coś co sprawia Ci trudność w opowiedzeniu?" |

## Acceptance Criteria
- [ ] Each entry contributes a depth score to the accumulator on save
- [ ] Depth score follows Pennebaker model (see table above)
- [ ] Accumulator threshold is a configurable constant in insightConfig.ts
- [ ] When threshold crossed: `aiService.generateHolisticInsight()` called, result in localStorage
- [ ] Accumulator resets to zero after holistic insight generated
- [ ] Black hole pulses (heartbeat) after every entry save — intensity proportional to depth score
- [ ] No numbers, bars, or explicit scores visible to user
- [ ] Black hole glows/pulses when new holistic insight is unread
- [ ] Glow clears after first hover (insight marked as read)
- [ ] Connection insight appears inline near ConnectionBadge — one sentence
- [ ] Before first holistic insight: black hole hover shows "Keep writing — your center is forming."
- [ ] All insight data persists in localStorage
- [ ] Repeated/contradicting topic detection shown on black hole hover
- [ ] Single short entry → silence on black hole
- [ ] 3+ consecutive short entries → invitation text

## After Implementation
- [ ] Run: `npm run lint`
- [ ] Run: `npm test`
- [ ] Manual verification steps (po polsku):
  1. Utwórz wpis krótki (<30 słów) — sprawdź że czarna dziura nie pulsuje mocno
  2. Utwórz wpis długi (>300 słów) z odpowiedziami na follow-up — sprawdź silny puls
  3. Po kilku wpisach sprawdź czy pojawia się glow na czarnej dziurze (insight unread)
  4. Najedź na czarną dziurę — sprawdź tekst wglądu i że glow znika
  5. Sprawdź tekst "Keep writing..." przed pierwszym wglądem
  6. Sprawdź connection insight przy ConnectionBadge
- [ ] Potwierdź weryfikację wpisując 1 → agent automatycznie uruchomi /qa
