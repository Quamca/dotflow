import { Line } from '@react-three/drei'
import type { Connection } from '../../types'

interface ConstellationLinesProps {
  connections: Record<string, Connection>
  positionMap: Map<string, [number, number, number]>
}

export default function ConstellationLines({ connections, positionMap }: ConstellationLinesProps) {
  return (
    <>
      {Object.values(connections).map((conn) => {
        const start = positionMap.get(conn.source_entry_id)
        const end = positionMap.get(conn.target_entry_id)
        if (!start || !end) return null
        return (
          <Line
            key={conn.id}
            points={[start, end]}
            color="#D6D3D1"
            lineWidth={1}
            transparent
            opacity={0.5}
          />
        )
      })}
    </>
  )
}
