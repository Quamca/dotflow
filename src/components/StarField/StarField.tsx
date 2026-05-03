import { useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Line } from '@react-three/drei'
import type { Entry, Connection, Story } from '../../types'
import { getStarPosition, getAlignedStarPosition, getFixedZoneCentroid, getStoryPosition } from '../../utils/starPositions'
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

const ZONE_BIAS = 0.82
const CONTAINMENT_BUFFER = 0.25
const SAFETY_MARGIN = 0.2
const REPULSION_MARGIN = 0.4
const ZONE_OVERLAP_MARGIN = 0.6
const MIN_ZONE_RADIUS = 0.8

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
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleZoneEnter(zoneLabel: string) {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
    setHoveredZoneArea(zoneLabel)
  }

  function handleZoneLeave(zoneLabel: string) {
    hoverTimerRef.current = setTimeout(() => {
      setHoveredZoneArea((current) => current === zoneLabel ? null : current)
    }, 350)
  }

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

  // Life areas with ≥5 stories — only these get a zone and spatial clustering bias
  const activeAreas = useMemo(() => {
    const counts = new Map<string, number>()
    stories.forEach((s) => {
      if (s.life_area) counts.set(s.life_area, (counts.get(s.life_area) ?? 0) + 1)
    })
    const active = new Set<string>()
    counts.forEach((n, label) => { if (n >= 5) active.add(label) })
    return active
  }, [stories])

  const { storyPositionMap, activeZones } = useMemo(() => {
    type ZoneSpec = { label: string; centroid: [number, number, number]; radius: number; color: string; storyCount: number }

    // Pass 1 — zone stories: strong bias toward fixed centroid (ZONE_BIAS = 0.82)
    const posMap = new Map<string, [number, number, number]>()
    stories.forEach((s) => {
      if (s.life_area && activeAreas.has(s.life_area)) {
        const centroid = getFixedZoneCentroid(s.life_area)
        const base = getStoryPosition(s.id)
        posMap.set(s.id, [
          base[0] * (1 - ZONE_BIAS) + centroid[0] * ZONE_BIAS,
          base[1] * (1 - ZONE_BIAS) + centroid[1] * ZONE_BIAS,
          base[2] * (1 - ZONE_BIAS) + centroid[2] * ZONE_BIAS,
        ])
      } else {
        posMap.set(s.id, getStoryPosition(s.id))
      }
    })

    // Pass 2 — zone radii: maxDist + CONTAINMENT_BUFFER guarantees all stars inside
    const raw: ZoneSpec[] = []
    activeAreas.forEach((areaLabel) => {
      const areaStories = stories.filter((s) => s.life_area === areaLabel)
      const emotionCounts: Record<string, number> = {}
      areaStories.forEach((s) => {
        if (s.emotion) emotionCounts[s.emotion] = (emotionCounts[s.emotion] ?? 0) + 1
      })
      const dominant = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
      const color = getEmotionColor(dominant)

      const centroid = getFixedZoneCentroid(areaLabel)
      const [cx, cy, cz] = centroid

      let maxDist = 0
      areaStories.forEach((s) => {
        const p = posMap.get(s.id)
        if (!p) return
        const d = Math.sqrt((p[0] - cx) ** 2 + (p[1] - cy) ** 2 + (p[2] - cz) ** 2)
        if (d > maxDist) maxDist = d
      })

      if (maxDist === 0) return
      const rawRadius = Math.max(MIN_ZONE_RADIUS, maxDist + CONTAINMENT_BUFFER)
      raw.push({ label: areaLabel, centroid, radius: rawRadius, color, storyCount: areaStories.length })
    })

    // Pass 3 — zone-zone overlap: more populated zone keeps its radius
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
        if (excess > 0) r = Math.max(MIN_ZONE_RADIUS, r - excess)
      }
      if (r >= MIN_ZONE_RADIUS) placed.push({ ...zone, radius: r })
    }

    // Pass 3b — hard containment: clamp every zone star to radius − SAFETY_MARGIN
    for (const zone of placed) {
      const maxAllowed = zone.radius - SAFETY_MARGIN
      const [cx, cy, cz] = zone.centroid
      stories.forEach((s) => {
        if (s.life_area !== zone.label) return
        const p = posMap.get(s.id)
        if (!p) return
        const [px, py, pz] = p
        const dx = px - cx
        const dy = py - cy
        const dz = pz - cz
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (dist > maxAllowed && dist > 0) {
          const scale = maxAllowed / dist
          posMap.set(s.id, [cx + dx * scale, cy + dy * scale, cz + dz * scale])
        }
      })
    }

    // Pass 4 — repel non-zone stories from all zone spheres
    stories.forEach((s) => {
      if (s.life_area && activeAreas.has(s.life_area)) return
      const p = posMap.get(s.id)
      if (!p) return
      let [px, py, pz] = p
      for (const zone of placed) {
        const [cx, cy, cz] = zone.centroid
        const dx = px - cx
        const dy = py - cy
        const dz = pz - cz
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        const minDist = zone.radius + REPULSION_MARGIN
        if (dist < minDist && dist > 0) {
          const scale = minDist / dist
          px = cx + dx * scale
          py = cy + dy * scale
          pz = cz + dz * scale
        }
      }
      posMap.set(s.id, [px, py, pz])
    })

    return { storyPositionMap: posMap, activeZones: placed }
  }, [stories, activeAreas])

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
            hoveredZoneArea !== null && story.life_area === hoveredZoneArea ? 'highlight' : undefined
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
          onEnter={handleZoneEnter}
          onLeave={handleZoneLeave}
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
