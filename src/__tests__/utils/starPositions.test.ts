import { describe, it, expect } from 'vitest'
import { getStarPosition } from '../../utils/starPositions'

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
