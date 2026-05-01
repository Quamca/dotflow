import { useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Line } from '@react-three/drei'
import type { Entry, Connection, Story } from '../../types'
import { getStarPosition, getAlignedStarPosition } from '../../utils/starPositions'
import StarNode from './StarNode'
import StoryNode from './StoryNode'
import ConstellationLines from './ConstellationLines'
import BlackHole from './BlackHole'

const BLACK_HOLE_MIN_SIZE = 0.3
const BLACK_HOLE_MAX_SIZE = 1.2
const BLACK_HOLE_SCALE_AT = 50

interface StarFieldProps {
  entries: Entry[]
  connections: Record<string, Connection>
  stories?: Story[]
  isInteractive: boolean
  insight?: string[] | null
  holisticInsight?: string | null
  hasUnreadInsight?: boolean
  depthScore?: number
  storyContextMessage?: string | null
  userValues?: string[]
  apiKey?: string
  onRoundLimitReached?: () => void
  onInsightRead?: () => void
}

export default function StarField({ entries, connections, stories = [], isInteractive, insight, holisticInsight, hasUnreadInsight, depthScore, storyContextMessage, userValues, apiKey, onRoundLimitReached, onInsightRead }: StarFieldProps) {
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null)

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

  const storyPositionMap = useMemo(() => {
    const map = new Map<string, [number, number, number]>()
    stories.forEach((s) => {
      if (s.position) {
        map.set(s.id, s.position)
      }
    })
    return map
  }, [stories])

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
        if (a && b) {
          lines.push({ id: `${group[i].id}-${group[i + 1].id}`, points: [a, b] })
        }
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
        />
      ))}
      {stories.map((story) => (
        <StoryNode
          key={story.id}
          story={story}
          position={storyPositionMap.get(story.id) ?? [0, 0, 0]}
          isActive={activeStoryId === story.id}
          onActivate={setActiveStoryId}
          apiKey={apiKey}
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
      <ConstellationLines connections={connections} positionMap={positionMap} />
      <BlackHole
        size={blackHoleSize}
        insight={insight ?? null}
        holisticInsight={holisticInsight ?? null}
        hasUnreadInsight={hasUnreadInsight ?? false}
        depthScore={depthScore ?? 0}
        storyContextMessage={storyContextMessage ?? null}
        isInteractive={isInteractive}
        apiKey={apiKey ?? ''}
        onRoundLimitReached={onRoundLimitReached}
        onInsightRead={onInsightRead}
      />
      {isInteractive && <OrbitControls enablePan enableZoom enableRotate makeDefault />}
    </Canvas>
  )
}
