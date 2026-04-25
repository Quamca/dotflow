# Current Task — US-103: Fix AI insights language — respond in entry language

**Branch:** 103-fix-ai-insights-language
**Created:** 2026-04-25
**Status:** 🔄 In Progress

## Context
The PATTERN_SUMMARY_SYSTEM_PROMPT does not instruct the AI on which language to use for its response. As a result, the AI defaults to English even when journal entries are written in Polish or another language. The fix is a one-line addition to the prompt instructing the AI to match the language of the entries.

## Files to Read First
- src/utils/prompts.ts

## Tasks
1. [ ] TASK-103.1: Update `PATTERN_SUMMARY_SYSTEM_PROMPT` in `src/utils/prompts.ts` to add language instruction
2. [ ] TASK-103.2: Manual verification (write entries in Polish, verify insights in Polish)

## Constraints
- Do not hardcode a language — AI must auto-detect from entry content
- Change only `PATTERN_SUMMARY_SYSTEM_PROMPT`, not other prompts

## Acceptance Criteria
- [ ] Pattern summary observations are returned in the language of the journal entries
- [ ] No hardcoded language in prompt — AI auto-detects from entry content

## After Implementation
- [ ] Run: `npm run lint`
- [ ] Run: `npm test`
- [ ] Manual verification steps (po polsku):
  1. Upewnij się, że masz 10+ wpisów po polsku
  2. Wejdź na Home i kliknij "Generate insights"
  3. Zweryfikuj że obserwacje są po polsku
- [ ] Potwierdź weryfikację wpisując 1
