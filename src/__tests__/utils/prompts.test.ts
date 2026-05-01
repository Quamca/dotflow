import { describe, it, expect } from 'vitest'
import {
  FOLLOW_UP_SYSTEM_PROMPT,
  CONNECTION_DETECTION_SYSTEM_PROMPT,
  PATTERN_SUMMARY_SYSTEM_PROMPT,
  USER_VALUES_SYSTEM_PROMPT,
  DEEPENING_QUESTION_SYSTEM_PROMPT,
  CLOSING_PHRASE_SYSTEM_PROMPT,
  STORY_EXTRACTION_SYSTEM_PROMPT,
  EMOTION_DETECTION_SYSTEM_PROMPT,
} from '../../utils/prompts'

describe('prompts', () => {
  it('should include language instruction in PATTERN_SUMMARY_SYSTEM_PROMPT', () => {
    expect(PATTERN_SUMMARY_SYSTEM_PROMPT).toContain(
      'Respond in the same language as the journal entries'
    )
  })

  it('should instruct AI to return JSON array in PATTERN_SUMMARY_SYSTEM_PROMPT', () => {
    expect(PATTERN_SUMMARY_SYSTEM_PROMPT).toContain('JSON array')
  })

  it('should instruct AI to return JSON array in FOLLOW_UP_SYSTEM_PROMPT', () => {
    expect(FOLLOW_UP_SYSTEM_PROMPT).toContain('JSON array')
  })

  it('should instruct AI to return JSON object in CONNECTION_DETECTION_SYSTEM_PROMPT', () => {
    expect(CONNECTION_DETECTION_SYSTEM_PROMPT).toContain('JSON object')
  })

  it('should instruct AI to return JSON array in USER_VALUES_SYSTEM_PROMPT', () => {
    expect(USER_VALUES_SYSTEM_PROMPT).toContain('JSON array')
  })

  it('should use observational-data language in USER_VALUES_SYSTEM_PROMPT', () => {
    expect(USER_VALUES_SYSTEM_PROMPT).toContain('observed patterns')
  })

  it('should include language instruction in USER_VALUES_SYSTEM_PROMPT', () => {
    expect(USER_VALUES_SYSTEM_PROMPT).toContain('Respond in the same language as the journal entries')
  })

  describe('DEEPENING_QUESTION_SYSTEM_PROMPT', () => {
    it('should forbid "Dlaczego" to prevent argumentation mode', () => {
      expect(DEEPENING_QUESTION_SYSTEM_PROMPT).toContain('NEVER use "Dlaczego"')
    })

    it('should forbid "Ale" to prevent opposition framing', () => {
      expect(DEEPENING_QUESTION_SYSTEM_PROMPT).toContain('NEVER use "Ale"')
    })

    it('should limit response to maximum 15 words', () => {
      expect(DEEPENING_QUESTION_SYSTEM_PROMPT).toContain('15 words')
    })

    it('should require observational language', () => {
      expect(DEEPENING_QUESTION_SYSTEM_PROMPT).toContain('observational language')
    })

    it('should include language instruction', () => {
      expect(DEEPENING_QUESTION_SYSTEM_PROMPT).toContain('Respond in the same language as the user')
    })
  })

  describe('STORY_EXTRACTION_SYSTEM_PROMPT', () => {
    it('should instruct AI to return JSON array', () => {
      expect(STORY_EXTRACTION_SYSTEM_PROMPT).toContain('JSON array')
    })

    it('should include language instruction', () => {
      expect(STORY_EXTRACTION_SYSTEM_PROMPT).toContain('Respond in the same language as the journal entry')
    })
  })

  describe('CLOSING_PHRASE_SYSTEM_PROMPT', () => {
    it('should limit response to maximum 15 words', () => {
      expect(CLOSING_PHRASE_SYSTEM_PROMPT).toContain('15 words')
    })

    it('should instruct AI to incorporate user words from their most recent message', () => {
      expect(CLOSING_PHRASE_SYSTEM_PROMPT).toContain("user's most recent message")
    })

    it('should include language instruction', () => {
      expect(CLOSING_PHRASE_SYSTEM_PROMPT).toContain('Respond in the same language as the user')
    })
  })

  describe('EMOTION_DETECTION_SYSTEM_PROMPT', () => {
    it('should instruct AI to return JSON object', () => {
      expect(EMOTION_DETECTION_SYSTEM_PROMPT).toContain('JSON object')
    })

    it('should include all six emotion categories', () => {
      expect(EMOTION_DETECTION_SYSTEM_PROMPT).toContain('"joy"')
      expect(EMOTION_DETECTION_SYSTEM_PROMPT).toContain('"sadness"')
      expect(EMOTION_DETECTION_SYSTEM_PROMPT).toContain('"anger"')
      expect(EMOTION_DETECTION_SYSTEM_PROMPT).toContain('"fear"')
      expect(EMOTION_DETECTION_SYSTEM_PROMPT).toContain('"calm"')
      expect(EMOTION_DETECTION_SYSTEM_PROMPT).toContain('"mixed"')
    })

    it('should include confidence field in example format', () => {
      expect(EMOTION_DETECTION_SYSTEM_PROMPT).toContain('"confidence"')
    })
  })
})
