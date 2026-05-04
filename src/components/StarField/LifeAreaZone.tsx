import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { Mesh, MeshBasicMaterial } from 'three'
import { getEmotionColor } from '../../utils/emotionColors'

interface LifeAreaZoneProps {
  label: string
  centroid: [number, number, number]
  radius: number
  emotionWeights: Record<string, number>
  isActive: boolean
  isLabelCleared: boolean
  onRename: (newLabel: string) => void
  onClear: () => void
  getLabel: (aiLabel: string) => string
  onEnter: (label: string, distance: number) => void
  onLeave: (label: string) => void
  onMove: (label: string, distance: number) => void
}

interface NebulaLayer {
  color: string
  radiusScale: number
  opacityBase: number
  phaseOffset: number
  speed: number
  axisScale: [number, number, number]
}

const AMBIENT_COLOR = '#78716C'
const KEEP_OPEN_MS = 350
const ACTIVE_OPACITY_MULTIPLIER = 1.6

function buildLayers(emotionWeights: Record<string, number>): NebulaLayer[] {
  const sorted = Object.entries(emotionWeights)
    .filter(([, w]) => w > 0.05)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  const layers: NebulaLayer[] = []

  sorted.forEach(([emotion, weight], i) => {
    const color = getEmotionColor(emotion)
    const phase = i * 2.1
    // Outer diffuse sphere
    layers.push({
      color,
      radiusScale: 1.0 - i * 0.03,
      opacityBase: weight * 0.065,
      phaseOffset: phase,
      speed: 0.15 + i * 0.05,
      axisScale: [1.0, 0.92, 1.0],
    })
    // Inner concentration sphere
    layers.push({
      color,
      radiusScale: 0.58 - i * 0.04,
      opacityBase: weight * 0.090,
      phaseOffset: phase + 1.0,
      speed: 0.22 + i * 0.07,
      axisScale: [0.95, 1.0, 0.90],
    })
  })

  // Ambient tie layer — always present
  layers.push({
    color: AMBIENT_COLOR,
    radiusScale: 0.80,
    opacityBase: 0.020,
    phaseOffset: 3.7,
    speed: 0.12,
    axisScale: [1.0, 0.95, 1.0],
  })

  return layers
}

export default function LifeAreaZone({
  label, centroid, radius, emotionWeights, isActive, isLabelCleared,
  onRename, onClear, getLabel, onEnter, onLeave, onMove,
}: LifeAreaZoneProps) {
  const [isZoneHovered, setIsZoneHovered] = useState(false)
  const [isLabelHovered, setIsLabelHovered] = useState(false)
  const [keepOpen, setKeepOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const layers = useMemo(() => buildLayers(emotionWeights), [emotionWeights])
  const layerRefs = useRef<(Mesh | null)[]>([])

  const showLabel = isLabelHovered || (isActive && (isZoneHovered || keepOpen))

  function clearTimer() {
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  function scheduleClose() {
    clearTimer()
    timerRef.current = setTimeout(() => setKeepOpen(false), KEEP_OPEN_MS)
  }

  function handleZoneLeave() {
    setIsZoneHovered(false)
    if (!isLabelHovered) scheduleClose()
    onLeave(label)
  }

  function handleLabelEnter() {
    clearTimer()
    setIsLabelHovered(true)
    setKeepOpen(true)
    onEnter(label, 0)
  }

  function handleLabelLeave() {
    setIsLabelHovered(false)
    if (!isZoneHovered) scheduleClose()
    onLeave(label)
  }

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    layerRefs.current.forEach((ref, i) => {
      if (!ref || i >= layers.length) return
      const layer = layers[i]
      const breathe = 1 + Math.sin(t * layer.speed + layer.phaseOffset) * 0.04
      const sway = 1 + Math.cos(t * layer.speed * 0.7 + layer.phaseOffset) * 0.025
      ref.scale.set(
        breathe * layer.axisScale[0],
        sway * layer.axisScale[1],
        breathe * layer.axisScale[2],
      )
      const mat = ref.material as MeshBasicMaterial
      const targetOpacity = layer.opacityBase * (isActive ? ACTIVE_OPACITY_MULTIPLIER : 1)
      mat.opacity = targetOpacity
    })
  })

  function handleLabelClick(e: React.MouseEvent) {
    e.stopPropagation()
    setIsLabelHovered(false)
    setDraft(getLabel(label))
    setEditing(true)
  }

  function handleLabelSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = draft.trim()
    if (trimmed === '') {
      onClear()
    } else {
      onRename(trimmed)
    }
    setEditing(false)
    scheduleClose()
  }

  const displayLabel = getLabel(label)
  const labelOffsetY = radius + 0.6

  return (
    <group position={centroid}>
      {/* Invisible hit detection mesh — fixed scale, drives hover events */}
      <mesh
        onPointerEnter={(e) => {
          clearTimer()
          setIsZoneHovered(true)
          setKeepOpen(true)
          onEnter(label, e.distance)
        }}
        onPointerLeave={handleZoneLeave}
        onPointerMove={(e) => onMove(label, e.distance)}
      >
        <sphereGeometry args={[radius, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Nebula layers — animated independently, no pointer events */}
      {layers.map((layer, i) => (
        <mesh
          key={i}
          ref={(el) => { layerRefs.current[i] = el }}
        >
          <sphereGeometry args={[radius * layer.radiusScale, 16, 16]} />
          <meshBasicMaterial
            color={layer.color}
            transparent
            opacity={layer.opacityBase}
            depthWrite={false}
          />
        </mesh>
      ))}

      {showLabel && !isLabelCleared && (
        <Html
          position={[0, labelOffsetY, 0]}
          center
          style={{ pointerEvents: 'auto', userSelect: 'none' }}
        >
          {editing ? (
            <form onSubmit={handleLabelSubmit} style={{ display: 'inline-flex', gap: 4 }}>
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={handleLabelSubmit}
                placeholder="usuń lub zmień"
                style={{
                  font: '11px DM Sans, sans-serif',
                  color: '#78716C',
                  background: 'rgba(250,250,249,0.85)',
                  border: '1px solid #E7E5E4',
                  borderRadius: 4,
                  padding: '2px 6px',
                  outline: 'none',
                  width: 120,
                }}
              />
            </form>
          ) : (
            <span
              onClick={handleLabelClick}
              onMouseEnter={handleLabelEnter}
              onMouseLeave={handleLabelLeave}
              style={{
                display: 'inline-block',
                font: '11px DM Sans, sans-serif',
                color: '#78716C',
                background: 'rgba(250,250,249,0.75)',
                padding: '8px 16px',
                borderRadius: 6,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
              title="Kliknij aby zmienić lub usuń etykietę"
            >
              {displayLabel}
            </span>
          )}
        </Html>
      )}
    </group>
  )
}
