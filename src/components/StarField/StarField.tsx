import { useMemo } from 'react'
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

  const BLACK_HOLE_EXCLUSION_RADIUS = 2.2

  const activeZones = useMemo(() => {
    const result: Array<{ label: string; centroid: [number, number, number]; radius: number; color: string }> = []
    zoneCentroids.forEach((centroid, areaLabel) => {
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
        const dx = p[0] - centroid[0]
        const dy = p[1] - centroid[1]
        const dz = p[2] - centroid[2]
        return Math.sqrt(dx * dx + dy * dy + dz * dz)
      })
      const avgDist = distances.reduce((a, b) => a + b, 0) / Math.max(distances.length, 1)
      const rawRadius = avgDist * 1.4 + 0.5

      // Clamp radius to keep zone sphere from overlapping the black hole center area
      const cx = centroid[0], cy = centroid[1], cz = centroid[2]
      const centroidDist = Math.sqrt(cx * cx + cy * cy + cz * cz)
      const maxRadius = Math.max(0.5, centroidDist - BLACK_HOLE_EXCLUSION_RADIUS)
      const radius = Math.min(rawRadius, maxRadius)

      result.push({ label: areaLabel, centroid, radius, color })
    })
    return result
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
