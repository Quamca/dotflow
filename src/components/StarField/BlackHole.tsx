import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { Mesh, MeshBasicMaterial } from 'three'
import { DEPTH_SCORE_CONFIG } from '../../utils/insightConfig'

interface BlackHoleProps {
  size: number
  hasUnreadInsight: boolean
  depthScore: number
  isInteractive: boolean
  insightPreview?: string | null
  onOpenModal?: () => void
  onInsightRead?: () => void
}

const MIN_SIZE = 0.3
const PULSE_SPEED = 0.8
const MIN_PULSE_AMPLITUDE = 0.04
const MAX_PULSE_AMPLITUDE = 0.22

export default function BlackHole({
  size, hasUnreadInsight, depthScore, isInteractive, insightPreview, onOpenModal, onInsightRead,
}: BlackHoleProps) {
  const meshRef = useRef<Mesh>(null)
  const glowRef = useRef<Mesh>(null)
  const unreadGlowRef = useRef<Mesh>(null)
  const hasReadRef = useRef(false)
  const glowFadingRef = useRef(false)
  const glowFadeRef = useRef(1.0)
  const isHoveredRef = useRef(false)
  const [isHovered, setIsHovered] = useState(false)

  const tooltipText = insightPreview
    ? (insightPreview.length > 110 ? `${insightPreview.slice(0, 110)}…` : insightPreview)
    : 'Pisz dalej — Twoje centrum się kształtuje.'

  useFrame((_, delta) => {
    if (glowRef.current) {
      const t = Date.now() * 0.001 * PULSE_SPEED
      const amplitude = MIN_PULSE_AMPLITUDE + (depthScore / DEPTH_SCORE_CONFIG.MAX_SCORE_PER_ENTRY) * (MAX_PULSE_AMPLITUDE - MIN_PULSE_AMPLITUDE)
      glowRef.current.scale.setScalar(1 + Math.sin(t) * amplitude)
    }
    if (unreadGlowRef.current && hasUnreadInsight) {
      const mat = unreadGlowRef.current.material as MeshBasicMaterial
      if (glowFadingRef.current) {
        glowFadeRef.current = Math.max(0, glowFadeRef.current - delta * 0.28)
        mat.opacity = 0.28 * glowFadeRef.current
        if (glowFadeRef.current === 0) onInsightRead?.()
      } else {
        mat.opacity = 0.28
        const t = Date.now() * 0.001 * PULSE_SPEED * 1.8
        unreadGlowRef.current.scale.setScalar(1 + Math.sin(t) * 0.14)
      }
    }
    if (meshRef.current && isHoveredRef.current) {
      meshRef.current.rotation.y += delta * 0.3
    }
  })

  function handleClick() {
    if (hasUnreadInsight && !hasReadRef.current) {
      hasReadRef.current = true
      glowFadingRef.current = true
    }
    onOpenModal?.()
  }

  const clampedSize = Math.max(MIN_SIZE, size)

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={glowRef}>
        <sphereGeometry args={[clampedSize * 1.4, 16, 16]} />
        <meshBasicMaterial color="#3b2a4a" transparent opacity={0.18} />
      </mesh>

      {hasUnreadInsight && (
        <mesh ref={unreadGlowRef}>
          <sphereGeometry args={[clampedSize * 2.8, 16, 16]} />
          <meshBasicMaterial color="#a78bfa" transparent />
        </mesh>
      )}

      <mesh ref={meshRef}>
        <sphereGeometry args={[clampedSize, 24, 24]} />
        <meshStandardMaterial color="#0a0a0f" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* invisible hit area — larger than visual core */}
      <mesh
        onPointerEnter={isInteractive ? (e) => { e.stopPropagation(); isHoveredRef.current = true; setIsHovered(true) } : undefined}
        onPointerLeave={isInteractive ? (e) => { e.stopPropagation(); isHoveredRef.current = false; setIsHovered(false) } : undefined}
        onClick={isInteractive ? (e) => { e.stopPropagation(); handleClick() } : undefined}
      >
        <sphereGeometry args={[clampedSize * 1.6, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {isHovered && isInteractive && (
        <Html style={{ pointerEvents: 'none' }}>
          <div style={blackHoleTooltipStyle}>
            {tooltipText}
          </div>
        </Html>
      )}
    </group>
  )
}

const blackHoleTooltipStyle: React.CSSProperties = {
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
  lineHeight: '1.45',
  padding: '8px 13px',
  borderRadius: '7px',
  width: '240px',
  whiteSpace: 'normal',
  boxShadow: '0 2px 12px rgba(0,0,0,0.35)',
  userSelect: 'none',
}
