function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

const STORY_RADIUS_MIN = 3.5
const STORY_RADIUS_MAX = 9.0

const ALIGNED_RADIUS_MIN = 1.5
const ALIGNED_RADIUS_MAX = 3.0
const DEFAULT_RADIUS_MIN = 3.0
const DEFAULT_RADIUS_MAX = 8.0

// Returns a stable 3D position for a story — derived from story id, not entry id.
export function getStoryPosition(storyId: string): [number, number, number] {
  return computePosition(storyId, STORY_RADIUS_MIN, STORY_RADIUS_MAX)
}

// Returns a deterministic 3D position for an entry — same id always maps to same position.
export function getStarPosition(entryId: string): [number, number, number] {
  return computePosition(entryId, DEFAULT_RADIUS_MIN, DEFAULT_RADIUS_MAX)
}

// Returns position adjusted for value alignment: aligned entries orbit closer to center.
export function getAlignedStarPosition(
  entryId: string,
  entryContent: string,
  userValues: string[]
): [number, number, number] {
  if (userValues.length === 0) return getStarPosition(entryId)

  const isAligned = userValues.some((value) =>
    entryContent.toLowerCase().includes(value.toLowerCase())
  )

  const rMin = isAligned ? ALIGNED_RADIUS_MIN : DEFAULT_RADIUS_MIN
  const rMax = isAligned ? ALIGNED_RADIUS_MAX : DEFAULT_RADIUS_MAX
  return computePosition(entryId, rMin, rMax)
}

function computePosition(
  entryId: string,
  radiusMin: number,
  radiusMax: number
): [number, number, number] {
  const seed = hashString(entryId)
  const u = seededRandom(seed)
  const v = seededRandom(seed + 1000)
  const radius = radiusMin + seededRandom(seed + 2000) * (radiusMax - radiusMin)

  const theta = u * Math.PI * 2
  const phi = Math.acos(2 * v - 1)

  return [
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi),
  ]
}
