# Current Task — US-203: Dialectical Insight Response

**Branch:** 203-dialectical-insight-response
**Created:** 2026-04-27
**Status:** 🔄 In Progress

## Context
Adding the ability for the user to push back on holistic insights shown on black hole hover. The AI responds with a single deepening question (never updates the insight). Max 2 rounds of dialogue — after round 2 the AI paraphrases the user's words in a closing phrase and the Write Entry button becomes visually primary. The round limit is never communicated to the user.

UX refinements from /consult:
- Button label: "To nie brzmi jak ja" (not "I disagree" — avoids adversarial framing)
- Input placeholder: "Co sprawia, że ten wgląd nie pasuje?"
- Closing phrase: AI paraphrases user content (not a fixed template)
- Write Entry highlight: secondary → primary style (Amber fill), no pulsing

## Files to Read First
- `src/components/StarField/BlackHole.tsx` — insight tooltip lives here; add disagree button
- `src/services/aiService.ts` — add respondToInsightFeedback()
- `src/utils/prompts.ts` — add DEEPENING_QUESTION_SYSTEM_PROMPT
- `docs/ai_communication_principles.md` — prompt rules (safe/forbidden openers, max 15 words, observational language)
- `src/components/StarField/StarField.tsx` — Write Entry button location (for highlight logic)
- `src/pages/HomePage.tsx` — Write Entry button rendered here; needs highlight prop

## Tasks
1. [ ] **TASK-203.1:** Add "To nie brzmi jak ja" button to BlackHole insight tooltip (visible only in interactive mode, only when insight exists) - 20min
2. [ ] **TASK-203.2:** Add disagree input field + submit flow inside BlackHole tooltip with round counter state (max 2, hidden from user) - 30min
3. [ ] **TASK-203.3:** Implement `aiService.respondToInsightFeedback(insight, userFeedback, round, apiKey)` — single deepening question on round 1, paraphrased closing phrase on round 2 - 60min
4. [ ] **TASK-203.4:** Create `DEEPENING_QUESTION_SYSTEM_PROMPT` in `src/utils/prompts.ts` per `docs/ai_communication_principles.md` rules - 45min
5. [ ] **TASK-203.5:** On round 2 completion — render closing phrase + emit `onRoundLimitReached` prop upward (BlackHole → StarField → HomePage) to trigger Write Entry highlight (secondary → primary, Amber fill, no pulsing) - 20min
6. [ ] **TASK-203.6:** Write tests (/qa) - 60min
7. [ ] **TASK-203.7:** Manual verification - 20min

## Constraints
- "To nie brzmi jak ja" button only visible in interactive mode (isInteractive prop) and when insight is not null
- AI NEVER updates the insight text — only responds with a question or closing phrase
- Round counter is internal state — never displayed or communicated to user
- Max 2 rounds — round 1: deepening question; round 2: paraphrased closing phrase
- Closing phrase must incorporate user's own words (not a fixed template)
- Write Entry highlight: style change only (secondary → primary), NO pulsing animation
- All OpenAI calls go through aiService.ts — never call fetch directly from component
- Prompt must follow docs/ai_communication_principles.md:
  - Safe openers: "Co sprawia, że...", "Skąd pochodzi to poczucie, że...", "Jak rozumiesz...", "Co w tym jest dla Ciebie ważne..."
  - Forbidden: "Dlaczego...", "Ale...", any reference to insight text
  - Max 15 words, neutral-curious tone
  - Observational language in closing phrase ("W Twoich słowach..." not "Ty uważasz...")
- generateHolisticInsight() prompt must use observational language ("W Twoich wpisach pojawia się wzorzec...") not identity-prescribing ("Masz tendencję do...")

## Acceptance Criteria
- [ ] "To nie brzmi jak ja" button visible below insight text (interactive mode only)
- [ ] Clicking opens text input with placeholder: "Co sprawia, że ten wgląd nie pasuje?"
- [ ] On submit: AI responds with one deepening question (max 15 words, neutral-curious, observational language)
- [ ] Insight text never changes as a result of user pushback
- [ ] Round 2: AI paraphrases user's content in closing phrase (not fixed template)
- [ ] After round 2: Write Entry button changes from secondary to primary style (Amber fill, no pulsing)
- [ ] Round limit is invisible to user — never communicated explicitly
- [ ] AI response never confronts contradictions in user's entries
- [ ] Loading state during AI response
- [ ] generateHolisticInsight() prompt uses observational language

## After Implementation
- [ ] Run: `npm run lint`
- [ ] Run: `npm test`
- [ ] Manual verification steps (po polsku):
  1. Otwórz aplikację, upewnij się że masz ustawiony klucz API i min. 5 wpisów z wygenerowanym pattern summary
  2. Kliknij logo Dotflow aby wejść w tryb 3D
  3. Najedź na czarną dziurę — powinna pojawić się tooltip z wglądem
  4. Sprawdź: pod wglądem widoczny przycisk "To nie brzmi jak ja"
  5. Kliknij przycisk — powinno pojawić się pole z placeholderem "Co sprawia, że ten wgląd nie pasuje?"
  6. Wpisz dowolny tekst i zatwierdź (runda 1)
  7. Sprawdź: AI odpowiada jednym pytaniem (max 15 słów, neutralny ton) — wgląd NIE zmienił się
  8. Wpisz kolejną odpowiedź i zatwierdź (runda 2)
  9. Sprawdź: AI odpowiada frazą zamykającą która nawiązuje do Twoich słów
  10. Sprawdź: przycisk Write Entry zmienił styl na primary (bursztynowe tło, bez pulsowania)
  11. Sprawdź: nigdzie nie pojawia się komunikat o limicie rund
  12. Sprawdź: wgląd na czarnej dziurze nadal pokazuje oryginalny tekst (nie zmienił się)
- [ ] Potwierdź weryfikację wpisując 1 → agent automatycznie uruchomi /qa
