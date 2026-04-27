import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { Entry, Connection } from '../../types'
import { getStarPosition, getAlignedStarPosition } from '../../utils/starPositions'
import StarNode from './StarNode'
import ConstellationLines from './ConstellationLines'
import BlackHole from './BlackHole'

const BLACK_HOLE_MIN_SIZE = 0.3
const BLACK_HOLE_MAX_SIZE = 1.2
const BLACK_HOLE_SCALE_AT = 50

interface StarFieldProps {
  entries: Entry[]
  connections: Record<string, Connection>
  isInteractive: boolean
  insight?: string[] | null
  userValues?: string[]
  apiKey?: string
  onRoundLimitReached?: () => void
}

export default function StarField({ entries, connections, isInteractive, insight, userValues, apiKey, onRoundLimitReached }: StarFieldProps) {
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
      <ConstellationLines connections={connections} positionMap={positionMap} />
      <BlackHole size={blackHoleSize} insight={insight ?? null} isInteractive={isInteractive} apiKey={apiKey ?? ''} onRoundLimitReached={onRoundLimitReached} />
      {isInteractive && <OrbitControls enablePan enableZoom enableRotate makeDefault />}
    </Canvas>
  )
}
