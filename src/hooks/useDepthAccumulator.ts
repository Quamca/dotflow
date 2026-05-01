import { DEPTH_SCORE_CONFIG, ACCUMULATOR_CONFIG, STORAGE_KEYS } from '../utils/insightConfig'

export function computeDepthScore(wordCount: number, answeredFollowUpCount: number): number {
  if (wordCount < DEPTH_SCORE_CONFIG.SHORT_ENTRY_WORD_THRESHOLD) return 0

  let score = Math.min(
    answeredFollowUpCount * DEPTH_SCORE_CONFIG.FOLLOW_UP_ANSWER_POINTS,
    DEPTH_SCORE_CONFIG.MAX_FOLLOW_UP_POINTS
  )

  if (wordCount >= DEPTH_SCORE_CONFIG.WORD_COUNT_LONG_MIN) {
    score += DEPTH_SCORE_CONFIG.WORD_COUNT_LONG_POINTS
  } else if (wordCount >= DEPTH_SCORE_CONFIG.WORD_COUNT_MEDIUM_MIN) {
    score += DEPTH_SCORE_CONFIG.WORD_COUNT_MEDIUM_POINTS
  } else if (wordCount >= DEPTH_SCORE_CONFIG.WORD_COUNT_SHORT_MIN) {
    score += DEPTH_SCORE_CONFIG.WORD_COUNT_SHORT_POINTS
  }

  return Math.min(score, DEPTH_SCORE_CONFIG.MAX_SCORE_PER_ENTRY)
}

export function useDepthAccumulator() {
  function getTotal(): number {
    return parseFloat(localStorage.getItem(STORAGE_KEYS.DEPTH_ACCUMULATOR) ?? '0') || 0
  }

  function addScore(score: number): { newTotal: number; thresholdCrossed: boolean } {
    const prev = getTotal()
    const newTotal = prev + score
    const thresholdCrossed = newTotal >= ACCUMULATOR_CONFIG.THRESHOLD && prev < ACCUMULATOR_CONFIG.THRESHOLD
    localStorage.setItem(STORAGE_KEYS.DEPTH_ACCUMULATOR, String(newTotal))
    localStorage.setItem(STORAGE_KEYS.LAST_ENTRY_DEPTH, String(score))
    return { newTotal, thresholdCrossed }
  }

  function reset(): void {
    localStorage.setItem(STORAGE_KEYS.DEPTH_ACCUMULATOR, '0')
  }

  function trackEntryLength(wordCount: number): void {
    const isShort = wordCount < DEPTH_SCORE_CONFIG.SHORT_ENTRY_WORD_THRESHOLD
    const prev = parseInt(localStorage.getItem(STORAGE_KEYS.CONSECUTIVE_SHORT_COUNT) ?? '0', 10) || 0
    localStorage.setItem(STORAGE_KEYS.CONSECUTIVE_SHORT_COUNT, String(isShort ? prev + 1 : 0))
  }

  function getConsecutiveShortCount(): number {
    return parseInt(localStorage.getItem(STORAGE_KEYS.CONSECUTIVE_SHORT_COUNT) ?? '0', 10) || 0
  }

  function getLastEntryDepthScore(): number {
    return parseFloat(localStorage.getItem(STORAGE_KEYS.LAST_ENTRY_DEPTH) ?? '0') || 0
  }

  return { getTotal, addScore, reset, trackEntryLength, getConsecutiveShortCount, getLastEntryDepthScore }
}
