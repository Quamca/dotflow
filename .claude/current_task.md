# Current Task — US-006: AI follow-up question generation and dialog

**Branch:** 6-ai-followup-questions
**Created:** 2026-04-23
**Status:** 🔄 In Progress

## Context
Implement the AI follow-up question feature — the core differentiator of Dotflow. After an entry is saved to Supabase, if the user has an API key set, call OpenAI to generate 2–3 follow-up questions and display them one at a time in a FollowUpDialog. The user answers or skips each question. After the dialog, followups are saved and the user is redirected to Home. If no API key or OpenAI fails, the entry saves directly without dialog.

## Files to Read First
- `src/pages/NewEntryPage.tsx` — change save flow: entry saves first, then show dialog if API key set
- `src/services/entryService.ts` — add `saveFollowUps()` function here
- `src/hooks/useSettings.ts` — read apiKey from here (already implemented)
- `src/types/index.ts` — FollowUp type already defined
- `docs/wireframes.md` — S-003 spec (Follow-Up Dialog screen)
- `docs/architecture.md` — AI Service Pattern, section 8 (Follow-Up Questions Prompt)

## Tasks
1. [ ] TASK-006.1: Create `src/services/aiService.ts` with `generateFollowUpQuestions(content: string, apiKey: string): Promise<string[]>` — calls OpenAI REST API directly (no SDK install needed), returns array of question strings
2. [ ] TASK-006.2: Create `src/utils/prompts.ts` with follow-up question prompt (see architecture.md section 8)
3. [ ] TASK-006.5: Add `saveFollowUps(entryId: string, followups: Array<{ question: string; answer: string | null; order_index: number }>): Promise<void>` to `src/services/entryService.ts`
4. [ ] TASK-006.3 + 006.4: Create `src/components/FollowUpDialog/FollowUpDialog.tsx` with full dialog logic: one question at a time, answer textarea, Skip, Next, Ask me more (max total 5), I'm done, Save Entry ✓
5. [ ] TASK-006.6: Integrate dialog into `NewEntryPage.tsx` — new flow: createEntry → if apiKey: generateQuestions → show FollowUpDialog → saveFollowUps → navigate('/'); if no apiKey: navigate('/') directly
6. [ ] TASK-006.7: Handle graceful degradation — no API key: skip dialog, show info message; OpenAI failure: skip dialog, show error message; entry always saved regardless
7. [ ] TASK-006.8: Write tests (/qa — after manual verification)
8. [ ] TASK-006.9: Manual verification

## Constraints
- Call OpenAI API via native `fetch` — do NOT install the `openai` npm package (no backend, direct REST call from browser)
- OpenAI endpoint: `https://api.openai.com/v1/chat/completions`, model: `gpt-4o-mini`
- All OpenAI calls go through `src/services/aiService.ts` — never call fetch to OpenAI from components
- All Supabase calls go through `src/services/entryService.ts` — never call supabase from components
- Read API key only via `useSettings` hook in components
- Entry is saved FIRST (createEntry), THEN dialog is shown — entry.id is needed to link followups
- FollowUpDialog receives: questions array, onSave(answers) callback, onSkipAll() callback
- FollowUpDialog max questions: 5 (3 default + 2 from "Ask me more")
- Design system: Ink `#1C1917`, Cream `#FAFAF9`, Stone `#E7E5E4`, Warm Stone `#78716C`, Amber `#D97706`
- No `any` type — use proper TypeScript types
- Keep FollowUpDialog under 300 lines — extract helpers if needed

## Acceptance Criteria
- [ ] After entry submission (with API key set), FollowUpDialog appears
- [ ] AI generates 2–3 relevant questions based on entry content
- [ ] Questions shown one at a time with answer textarea
- [ ] User can skip any question (no answer recorded)
- [ ] "Ask me more" button adds up to 2 extra questions (max total: 5)
- [ ] "I'm done" button ends Q&A early and shows Save Entry
- [ ] All answered follow-ups saved to `followups` table linked to entry
- [ ] If no API key: entry saves directly, info message shown
- [ ] If OpenAI call fails: entry saves directly, error message shown

## After Implementation
- [ ] Run: `npm run lint`
- [ ] Run: `npm test`
- [ ] Manual verification steps (po polsku):
  1. Upewnij się, że masz ustawiony klucz API w Settings
  2. Uruchom `npm run dev`, otwórz http://localhost:5173
  3. Kliknij "+ Write", wpisz tekst np. "Miałem dziś trudne spotkanie w pracy" i kliknij Save →
  4. Sprawdź czy przycisk zmienia się na "Thinking..." podczas ładowania pytań
  5. Sprawdź czy dialog pojawia się z pierwszym pytaniem
  6. Odpowiedz na pytanie i kliknij Next →
  7. Kliknij "Skip" na kolejnym pytaniu — sprawdź czy przechodzi dalej bez zapisu
  8. Kliknij "Save Entry ✓" — sprawdź czy wracasz na Home
  9. Sprawdź w Supabase Dashboard → followups table: czy odpowiedzi są zapisane z poprawnym entry_id
  10. Usuń klucz API w Settings, wróć na /new, wpisz tekst, kliknij Save — sprawdź czy wpis zapisuje się od razu BEZ dialogu, z info komunikatem
- [ ] Potwierdź weryfikację wpisując 1
