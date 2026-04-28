import { useState, useRef } from 'react'
import { Html } from '@react-three/drei'
import type { Entry } from '../../types'

interface StarNodeProps {
  entry: Entry
  position: [number, number, number]
  connectionCount: number
  isInteractive: boolean
}

const MIN_STAR_SIZE = 0.07
const STAR_SIZE_PER_CONNECTION = 0.03
const MAX_STAR_SIZE_BONUS = 0.12
const HIDE_DELAY_MS = 3000

export default function StarNode({ entry, position, connectionCount, isInteractive }: StarNodeProps) {
  const [isVisible, setIsVisible] = useState(false)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const starSize = MIN_STAR_SIZE + Math.min(connectionCount * STAR_SIZE_PER_CONNECTION, MAX_STAR_SIZE_BONUS)
  const starColor = isVisible ? '#1C1917' : '#78716C'

  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(entry.created_at))

  const preview = entry.content.length > 60 ? `${entry.content.slice(0, 60)}…` : entry.content

  function clearHideTimer() {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current)
      hideTimer.current = null
    }
  }

  function scheduleHide() {
    clearHideTimer()
    hideTimer.current = setTimeout(() => setIsVisible(false), HIDE_DELAY_MS)
  }

  return (
    <group position={position}>
      <mesh
        onPointerEnter={isInteractive ? () => { clearHideTimer(); setIsVisible(true) } : undefined}
        onPointerLeave={isInteractive ? scheduleHide : undefined}
      >
        <sphereGeometry args={[starSize, 8, 8]} />
        <meshBasicMaterial color={starColor} />
      </mesh>
      {isVisible && isInteractive && (
        <Html style={{ pointerEvents: 'none' }}>
          <div
            style={{
              background: 'rgba(28, 25, 23, 0.92)',
              color: '#FAFAF9',
              fontSize: '12px',
              padding: '8px 12px',
              borderRadius: '8px',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              userSelect: 'none',
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>{formattedDate}</div>
            <div
              style={{
                color: '#A8A29E',
                lineHeight: 1.4,
                whiteSpace: 'normal',
                maxWidth: '180px',
              }}
            >
              {preview}
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}
