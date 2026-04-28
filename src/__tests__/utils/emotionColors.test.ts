import { describe, it, expect } from 'vitest'
import { getEmotionColor } from '../../utils/emotionColors'

describe('getEmotionColor', () => {
  it('should return amber color for joy', () => {
    expect(getEmotionColor('joy')).toBe('#F59E0B')
  })

  it('should return blue color for sadness', () => {
    expect(getEmotionColor('sadness')).toBe('#3B82F6')
  })

  it('should return red color for anger', () => {
    expect(getEmotionColor('anger')).toBe('#EF4444')
  })

  it('should return purple color for fear', () => {
    expect(getEmotionColor('fear')).toBe('#8B5CF6')
  })

  it('should return teal color for calm', () => {
    expect(getEmotionColor('calm')).toBe('#14B8A6')
  })

  it('should return default stone color when emotion is null', () => {
    expect(getEmotionColor(null)).toBe('#78716C')
  })

  it('should return default stone color when emotion is undefined', () => {
    expect(getEmotionColor(undefined)).toBe('#78716C')
  })

  it('should return default stone color for unknown emotion string', () => {
    expect(getEmotionColor('mixed')).toBe('#78716C')
  })

  it('should return default stone color for empty string', () => {
    expect(getEmotionColor('')).toBe('#78716C')
  })
})
