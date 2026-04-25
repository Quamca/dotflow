import { describe, it, expect } from 'vitest'
import {
  FOLLOW_UP_SYSTEM_PROMPT,
  CONNECTION_DETECTION_SYSTEM_PROMPT,
  PATTERN_SUMMARY_SYSTEM_PROMPT,
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
})
