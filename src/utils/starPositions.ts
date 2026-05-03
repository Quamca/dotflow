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

const CLUSTER_BIAS = 0.70

// Radius at which fixed zone centroids are placed — outside black hole exclusion zone.
const ZONE_CENTROID_RADIUS = 6.0

// Returns a deterministic centroid for a life area label — stable regardless of story positions.
// Derived purely from the label string so the same label always maps to the same point in space.
export function getFixedZoneCentroid(label: string): [number, number, number] {
  const seed = hashString(label)
  const theta = seededRandom(seed) * Math.PI * 2
  const phi = Math.acos(2 * seededRandom(seed + 1000) - 1)
  return [
    ZONE_CENTROID_RADIUS * Math.sin(phi) * Math.cos(theta),
    ZONE_CENTROID_RADIUS * Math.sin(phi) * Math.sin(theta),
    ZONE_CENTROID_RADIUS * Math.cos(phi),
  ]
}

// Returns position biased toward zone centroid when story belongs to a life area cluster.
export function getClusteredStoryPosition(
  storyId: string,
  centroid: [number, number, number] | null
): [number, number, number] {
  const base = getStoryPosition(storyId)
  if (!centroid) return base
  return [
    base[0] * (1 - CLUSTER_BIAS) + centroid[0] * CLUSTER_BIAS,
    base[1] * (1 - CLUSTER_BIAS) + centroid[1] * CLUSTER_BIAS,
    base[2] * (1 - CLUSTER_BIAS) + centroid[2] * CLUSTER_BIAS,
  ]
}

// Groups stories by life_area and computes centroids. Only areas with ≥5 stories are included.
export function computeZoneCentroids(
  stories: Array<{ id: string; life_area: string | null; position: [number, number, number] | null }>
): Map<string, [number, number, number]> {
  const groups = new Map<string, Array<[number, number, number]>>()
  for (const s of stories) {
    if (!s.life_area || !s.position) continue
    const arr = groups.get(s.life_area) ?? []
    arr.push(s.position)
    groups.set(s.life_area, arr)
  }
  const centroids = new Map<string, [number, number, number]>()
  groups.forEach((positions, area) => {
    if (positions.length < 5) return
    const cx = positions.reduce((sum, p) => sum + p[0], 0) / positions.length
    const cy = positions.reduce((sum, p) => sum + p[1], 0) / positions.length
    const cz = positions.reduce((sum, p) => sum + p[2], 0) / positions.length
    centroids.set(area, [cx, cy, cz])
  })
  return centroids
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
