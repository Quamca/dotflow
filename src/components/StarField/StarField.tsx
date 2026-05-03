import { useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Line } from '@react-three/drei'
import type { Entry, Connection, Story } from '../../types'
import { getStarPosition, getAlignedStarPosition, computeZoneCentroids, getClusteredStoryPosition } from '../../utils/starPositions'
import { getEmotionColor } from '../../utils/emotionColors'
import { useLifeAreaZones } from '../../hooks/useLifeAreaZones'
import StarNode from './StarNode'
import StoryNode from './StoryNode'
import ConstellationLines from './ConstellationLines'
import BlackHole from './BlackHole'
import LifeAreaZone from './LifeAreaZone'

const BLACK_HOLE_MIN_SIZE = 0.3
const BLACK_HOLE_MAX_SIZE = 1.2
const BLACK_HOLE_SCALE_AT = 50

interface StarFieldProps {
  entries: Entry[]
  connections: Record<string, Connection>
  stories?: Story[]
  isInteractive: boolean
  hasUnreadInsight?: boolean
  depthScore?: number
  insightPreview?: string | null
  userValues?: string[]
  onEntryClick?: (entry: Entry) => void
  onStoryClick?: (story: Story) => void
  onBlackHoleClick?: () => void
  onInsightRead?: () => void
}

export default function StarField({
  entries, connections, stories = [], isInteractive,
  hasUnreadInsight, depthScore, insightPreview, userValues,
  onEntryClick, onStoryClick, onBlackHoleClick, onInsightRead,
}: StarFieldProps) {
  const { getLabel, renameZone, clearZoneLabel, isLabelCleared } = useLifeAreaZones()
  const [hoveredZoneArea, setHoveredZoneArea] = useState<string | null>(null)

  const positionMap = useMemo(() => {
    const map = new Map<string, [number, number, number]>()
    entries.forEach((e) => {
      const pos = userValues && userValues.length > 0
        ? getAlignedStarPosition(e.id, e.content, userValues)
        : getStarPosition(e.id)
      map.set(e.id, pos)
    })
    return map
  }, [entries, userValues])

  const blackHoleSize = useMemo(() => {
    const t = Math.min(entries.length / BLACK_HOLE_SCALE_AT, 1)
    return BLACK_HOLE_MIN_SIZE + t * (BLACK_HOLE_MAX_SIZE - BLACK_HOLE_MIN_SIZE)
  }, [entries.length])

  const zoneCentroids = useMemo(() => computeZoneCentroids(
    stories.map((s) => ({ id: s.id, life_area: s.life_area, position: s.position }))
  ), [stories])

  const storyPositionMap = useMemo(() => {
    const map = new Map<string, [number, number, number]>()
    stories.forEach((s) => {
      if (s.position) {
        const centroid = s.life_area ? (zoneCentroids.get(s.life_area) ?? null) : null
        map.set(s.id, getClusteredStoryPosition(s.id, centroid))
      }
    })
    return map
  }, [stories, zoneCentroids])

  const sessionLines = useMemo(() => {
    const grouped = new Map<string, Story[]>()
    stories.forEach((s) => {
      const group = grouped.get(s.entry_id) ?? []
      group.push(s)
      grouped.set(s.entry_id, group)
    })
    const lines: Array<{ id: string; points: [[number, number, number], [number, number, number]] }> = []
    grouped.forEach((group) => {
      for (let i = 0; i < group.length - 1; i++) {
        const a = storyPositionMap.get(group[i].id)
        const b = storyPositionMap.get(group[i + 1].id)
        if (a && b) lines.push({ id: `${group[i].id}-${group[i + 1].id}`, points: [a, b] })
      }
    })
    return lines
  }, [stories, storyPositionMap])

  // Rule 1: zone sphere surface must be at least (BH_EXCLUSION_BASE + ZONE_SAFETY) from origin
  const BH_EXCLUSION_BASE = 1.8
  const ZONE_SAFETY_MARGIN = 0.8
  // Rule 2: zone spheres must not overlap each other (plus this margin)
  const ZONE_OVERLAP_MARGIN = 0.6
  const MIN_ZONE_RADIUS = 0.8

  const activeZones = useMemo(() => {
    type ZoneSpec = { label: string; centroid: [number, number, number]; radius: number; color: string; storyCount: number }
    const raw: ZoneSpec[] = []

    zoneCentroids.forEach((rawCentroid, areaLabel) => {
      const areaStories = stories.filter((s) => s.life_area === areaLabel)
      const emotionCounts: Record<string, number> = {}
      areaStories.forEach((s) => {
        if (s.emotion) emotionCounts[s.emotion] = (emotionCounts[s.emotion] ?? 0) + 1
      })
      const dominant = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
      const color = getEmotionColor(dominant)

      const distances = areaStories.map((s) => {
        const p = storyPositionMap.get(s.id) ?? s.position
        if (!p) return 0
        const [cx, cy, cz] = rawCentroid
        return Math.sqrt((p[0] - cx) ** 2 + (p[1] - cy) ** 2 + (p[2] - cz) ** 2)
      })
      const avgDist = distances.reduce((a, b) => a + b, 0) / Math.max(distances.length, 1)
      const rawRadius = Math.max(MIN_ZONE_RADIUS, avgDist * 1.4 + 0.5)

      // Rule 1: push centroid outward if zone sphere would encroach on black hole exclusion zone
      const [cx, cy, cz] = rawCentroid
      const centroidDist = Math.sqrt(cx * cx + cy * cy + cz * cz)
      const minAllowedDist = BH_EXCLUSION_BASE + rawRadius + ZONE_SAFETY_MARGIN
      let finalCentroid: [number, number, number]
      if (centroidDist < minAllowedDist) {
        const scale = centroidDist > 0.001 ? minAllowedDist / centroidDist : 1
        finalCentroid = [cx * scale, cy * scale, cz * scale]
        if (centroidDist <= 0.001) finalCentroid = [minAllowedDist, 0, 0]
      } else {
        finalCentroid = rawCentroid
      }

      raw.push({ label: areaLabel, centroid: finalCentroid, radius: rawRadius, color, storyCount: areaStories.length })
    })

    // Rule 2: resolve zone-zone overlaps — most populated zones keep their radius
    const sorted = [...raw].sort((a, b) => b.storyCount - a.storyCount)
    const placed: ZoneSpec[] = []
    for (const zone of sorted) {
      let r = zone.radius
      for (const other of placed) {
        const dx = zone.centroid[0] - other.centroid[0]
        const dy = zone.centroid[1] - other.centroid[1]
        const dz = zone.centroid[2] - other.centroid[2]
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
        const excess = r + other.radius + ZONE_OVERLAP_MARGIN - d
        if (excess > 0) r = Math.max(MIN_ZONE_RADIUS - 0.01, r - excess)
      }
      if (r >= MIN_ZONE_RADIUS) placed.push({ ...zone, radius: r })
    }

    return placed
  }, [zoneCentroids, stories, storyPositionMap])

  const connectionCount = useMemo(() => {
    const count: Record<string, number> = {}
    Object.values(connections).forEach((conn) => {
      count[conn.source_entry_id] = (count[conn.source_entry_id] ?? 0) + 1
      count[conn.target_entry_id] = (count[conn.target_entry_id] ?? 0) + 1
    })
    return count
  }, [connections])

  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 60 }}
      style={{ background: '#FAFAF9', width: '100%', height: '100%' }}
    >
      {entries.map((entry) => (
        <StarNode
          key={entry.id}
          entry={entry}
          position={positionMap.get(entry.id) ?? [0, 0, 0]}
          connectionCount={connectionCount[entry.id] ?? 0}
          isInteractive={isInteractive}
          onOpenModal={isInteractive ? () => onEntryClick?.(entry) : undefined}
        />
      ))}
      {stories.map((story) => (
        <StoryNode
          key={story.id}
          story={story}
          position={storyPositionMap.get(story.id) ?? [0, 0, 0]}
          isInteractive={isInteractive}
          onOpenModal={isInteractive ? () => onStoryClick?.(story) : undefined}
          zoneHighlight={
            hoveredZoneArea === null ? undefined :
            story.life_area === hoveredZoneArea ? 'highlight' : 'dim'
          }
        />
      ))}
      {sessionLines.map((line) => (
        <Line
          key={line.id}
          points={line.points}
          color="#A78BFA"
          lineWidth={0.5}
          transparent
          opacity={0.3}
        />
      ))}
      {isInteractive && activeZones.map((zone) => (
        <LifeAreaZone
          key={zone.label}
          label={zone.label}
          centroid={zone.centroid}
          radius={zone.radius}
          color={zone.color}
          isLabelCleared={isLabelCleared(zone.label)}
          getLabel={getLabel}
          onRename={(newLabel) => renameZone(zone.label, newLabel)}
          onClear={() => clearZoneLabel(zone.label)}
          onHoverChange={setHoveredZoneArea}
        />
      ))}
      <ConstellationLines connections={connections} positionMap={positionMap} />
      <BlackHole
        size={blackHoleSize}
        hasUnreadInsight={hasUnreadInsight ?? false}
        depthScore={depthScore ?? 0}
        isInteractive={isInteractive}
        insightPreview={insightPreview}
        onOpenModal={isInteractive ? onBlackHoleClick : undefined}
        onInsightRead={onInsightRead}
      />
      {isInteractive && <OrbitControls enablePan enableZoom enableRotate makeDefault />}
    </Canvas>
  )
}
