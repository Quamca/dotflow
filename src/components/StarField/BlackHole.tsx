import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { Mesh } from 'three'

interface BlackHoleProps {
  size: number
  insight: string[] | null
  isInteractive: boolean
}

const MIN_SIZE = 0.3
const PULSE_SPEED = 0.8

export default function BlackHole({ size, insight, isInteractive }: BlackHoleProps) {
  const [isHovered, setIsHovered] = useState(false)
  const meshRef = useRef<Mesh>(null)
  const glowRef = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (glowRef.current) {
      const t = Date.now() * 0.001 * PULSE_SPEED
      const scale = 1 + Math.sin(t) * 0.04
      glowRef.current.scale.setScalar(scale)
    }
    if (meshRef.current && isHovered) {
      meshRef.current.rotation.y += delta * 0.3
    }
  })

  const clampedSize = Math.max(MIN_SIZE, size)

  return (
    <group position={[0, 0, 0]}>
      {/* Glow halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[clampedSize * 1.4, 16, 16]} />
        <meshBasicMaterial color="#3b2a4a" transparent opacity={0.18} />
      </mesh>

      {/* Core */}
      <mesh
        ref={meshRef}
        onPointerEnter={isInteractive ? () => setIsHovered(true) : undefined}
        onPointerLeave={isInteractive ? () => setIsHovered(false) : undefined}
      >
        <sphereGeometry args={[clampedSize, 24, 24]} />
        <meshStandardMaterial color="#0a0a0f" roughness={0.2} metalness={0.8} />
      </mesh>

      {isHovered && isInteractive && (
        <Html style={{ pointerEvents: 'none' }}>
          <InsightTooltip insight={insight} />
        </Html>
      )}
    </group>
  )
}

function InsightTooltip({ insight }: { insight: string[] | null }) {
  if (!insight || insight.length === 0) {
    return (
      <div style={tooltipStyle}>
        <div style={{ color: '#A8A29E', fontSize: '12px' }}>
          Keep writing — your center is forming.
        </div>
      </div>
    )
  }

  return (
    <div style={{ ...tooltipStyle, maxWidth: '240px' }}>
      <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '12px', color: '#FAFAF9' }}>
        Your entries suggest:
      </div>
      <ul style={{ margin: 0, padding: '0 0 0 14px', listStyle: 'disc' }}>
        {insight.slice(0, 3).map((obs, i) => (
          <li key={i} style={{ color: '#A8A29E', fontSize: '12px', lineHeight: 1.5, marginBottom: '4px' }}>
            {obs}
          </li>
        ))}
      </ul>
    </div>
  )
}

const tooltipStyle: React.CSSProperties = {
  background: 'rgba(10, 10, 15, 0.94)',
  color: '#FAFAF9',
  fontSize: '12px',
  padding: '10px 14px',
  borderRadius: '8px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
  userSelect: 'none',
  whiteSpace: 'normal',
  minWidth: '160px',
}
