import { useState } from 'react'
import { Html } from '@react-three/drei'
import type { Entry } from '../../types'

interface StarNodeProps {
  entry: Entry
  position: [number, number, number]
  connectionCount: number
  isInteractive: boolean
  onOpenModal?: () => void
}

const MIN_STAR_SIZE = 0.07
const STAR_SIZE_PER_CONNECTION = 0.03
const MAX_STAR_SIZE_BONUS = 0.12

export default function StarNode({ entry, position, connectionCount, isInteractive, onOpenModal }: StarNodeProps) {
  const [isHovered, setIsHovered] = useState(false)
  const starSize = MIN_STAR_SIZE + Math.min(connectionCount * STAR_SIZE_PER_CONNECTION, MAX_STAR_SIZE_BONUS)
  const starColor = isHovered ? '#1C1917' : '#78716C'

  const formattedDate = new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date(entry.created_at))

  const preview = entry.content.length > 72 ? `${entry.content.slice(0, 72)}…` : entry.content

  return (
    <group position={position}>
      <mesh
        onPointerEnter={isInteractive ? (e) => { e.stopPropagation(); setIsHovered(true) } : undefined}
        onPointerLeave={isInteractive ? (e) => { e.stopPropagation(); setIsHovered(false) } : undefined}
        onClick={isInteractive ? (e) => { e.stopPropagation(); onOpenModal?.() } : undefined}
      >
        <sphereGeometry args={[starSize, 8, 8]} />
        <meshBasicMaterial color={starColor} />
      </mesh>

      {isHovered && isInteractive && (
        <Html style={{ pointerEvents: 'none' }}>
          <div style={hoverTooltipStyle}>
            <div style={{ color: '#A8A29E', fontSize: '10px', marginBottom: '4px', letterSpacing: '0.02em' }}>
              {formattedDate}
            </div>
            <div style={{ color: '#D6D3D1', lineHeight: 1.45 }}>
              {preview}
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

const hoverTooltipStyle: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  transform: 'translate(-50%, calc(-100% - 6px))',
  animation: 'sky-tooltip-in 150ms ease-out both',
  background: 'rgba(22, 20, 26, 0.84)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  color: '#D6D3D1',
  fontSize: '12px',
  padding: '7px 11px',
  borderRadius: '7px',
  width: '200px',
  whiteSpace: 'normal',
  boxShadow: '0 2px 12px rgba(0,0,0,0.35)',
  userSelect: 'none',
}
