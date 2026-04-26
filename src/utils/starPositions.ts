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

// Returns a deterministic 3D position for an entry — same id always maps to same position.
export function getStarPosition(entryId: string): [number, number, number] {
  const seed = hashString(entryId)
  const u = seededRandom(seed)
  const v = seededRandom(seed + 1000)
  const radius = 3 + seededRandom(seed + 2000) * 5

  const theta = u * Math.PI * 2
  const phi = Math.acos(2 * v - 1)

  return [
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi),
  ]
}
