import { describe, it, expect } from 'vitest'
import { getStarPosition, getAlignedStarPosition, getStoryPosition } from '../../utils/starPositions'

describe('getStarPosition', () => {
  it('should return a tuple of 3 numbers for a given entry id', () => {
    const pos = getStarPosition('uuid-1')

    expect(pos).toHaveLength(3)
    pos.forEach((coord) => expect(typeof coord).toBe('number'))
  })

  it('should return the same position for the same entry id', () => {
    const pos1 = getStarPosition('uuid-abc-123')
    const pos2 = getStarPosition('uuid-abc-123')

    expect(pos1).toEqual(pos2)
  })

  it('should return different positions for different entry ids', () => {
    const pos1 = getStarPosition('uuid-1')
    const pos2 = getStarPosition('uuid-2')

    expect(pos1).not.toEqual(pos2)
  })

  it('should return position with radius in expected range (3 to 8)', () => {
    const [x, y, z] = getStarPosition('uuid-range-test')
    const radius = Math.sqrt(x * x + y * y + z * z)

    expect(radius).toBeGreaterThanOrEqual(3)
    expect(radius).toBeLessThanOrEqual(8)
  })
})

describe('getAlignedStarPosition', () => {
  it('should return a tuple of 3 numbers', () => {
    const pos = getAlignedStarPosition('uuid-1', 'autonomy is important', ['autonomy'])

    expect(pos).toHaveLength(3)
    pos.forEach((coord) => expect(typeof coord).toBe('number'))
  })

  it('should return same position for same inputs', () => {
    const pos1 = getAlignedStarPosition('uuid-abc', 'growth mindset', ['growth'])
    const pos2 = getAlignedStarPosition('uuid-abc', 'growth mindset', ['growth'])

    expect(pos1).toEqual(pos2)
  })

  it('should position aligned entry within inner radius range (1.5 to 3)', () => {
    const [x, y, z] = getAlignedStarPosition('entry-aligned-001', 'autonomy is important', ['autonomy'])
    const radius = Math.sqrt(x * x + y * y + z * z)

    expect(radius).toBeGreaterThanOrEqual(1.5)
    expect(radius).toBeLessThanOrEqual(3)
  })

  it('should position non-aligned entry within outer radius range (3 to 8)', () => {
    const [x, y, z] = getAlignedStarPosition('entry-noalign-001', 'went to the park today', ['autonomy'])
    const radius = Math.sqrt(x * x + y * y + z * z)

    expect(radius).toBeGreaterThanOrEqual(3)
    expect(radius).toBeLessThanOrEqual(8)
  })

  it('should fall back to default position when no user values provided', () => {
    const aligned = getAlignedStarPosition('uuid-fallback', 'any content', [])
    const defaultPos = getStarPosition('uuid-fallback')

    expect(aligned).toEqual(defaultPos)
  })
})

describe('getStoryPosition', () => {
  it('should return a tuple of 3 numbers for a given story id', () => {
    const pos = getStoryPosition('story-uuid-1')

    expect(pos).toHaveLength(3)
    pos.forEach((coord) => expect(typeof coord).toBe('number'))
  })

  it('should return the same position for the same story id', () => {
    const pos1 = getStoryPosition('story-uuid-stable')
    const pos2 = getStoryPosition('story-uuid-stable')

    expect(pos1).toEqual(pos2)
  })

  it('should return different positions for different story ids', () => {
    const pos1 = getStoryPosition('story-uuid-aaa')
    const pos2 = getStoryPosition('story-uuid-bbb')

    expect(pos1).not.toEqual(pos2)
  })

  it('should return position within story radius range (3.5 to 9.0)', () => {
    const [x, y, z] = getStoryPosition('story-uuid-range')
    const radius = Math.sqrt(x * x + y * y + z * z)

    expect(radius).toBeGreaterThanOrEqual(3.5)
    expect(radius).toBeLessThanOrEqual(9.0)
  })

  it('should return different position from entry star with same id string', () => {
    const storyPos = getStoryPosition('shared-id')
    const entryPos = getStarPosition('shared-id')

    expect(storyPos).not.toEqual(entryPos)
  })
})
