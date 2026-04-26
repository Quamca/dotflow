import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { Entry, Connection } from '../../types'
import { getStarPosition } from '../../utils/starPositions'
import StarNode from './StarNode'
import ConstellationLines from './ConstellationLines'

interface StarFieldProps {
  entries: Entry[]
  connections: Record<string, Connection>
  isInteractive: boolean
}

export default function StarField({ entries, connections, isInteractive }: StarFieldProps) {
  const positionMap = useMemo(() => {
    const map = new Map<string, [number, number, number]>()
    entries.forEach((e) => map.set(e.id, getStarPosition(e.id)))
    return map
  }, [entries])

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
      {isInteractive && <OrbitControls enablePan enableZoom enableRotate makeDefault />}
    </Canvas>
  )
}
