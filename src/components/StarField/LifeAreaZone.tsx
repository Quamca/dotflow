import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { Mesh } from 'three'

interface LifeAreaZoneProps {
  label: string
  centroid: [number, number, number]
  radius: number
  color: string
  isActive: boolean
  isLabelCleared: boolean
  onRename: (newLabel: string) => void
  onClear: () => void
  getLabel: (aiLabel: string) => string
  onEnter: (label: string, distance: number) => void
  onLeave: (label: string) => void
  onMove: (label: string, distance: number) => void
}

const KEEP_OPEN_MS = 350

export default function LifeAreaZone({
  label, centroid, radius, color, isActive, isLabelCleared, onRename, onClear, getLabel, onEnter, onLeave, onMove,
}: LifeAreaZoneProps) {
  const visualMeshRef = useRef<Mesh>(null)
  const [isZoneHovered, setIsZoneHovered] = useState(false)
  const [isLabelHovered, setIsLabelHovered] = useState(false)
  const [keepOpen, setKeepOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
    onEnter(label, 0)  // label hover = distance 0, always wins depth ordering
  }

  function handleLabelLeave() {
    setIsLabelHovered(false)
    if (!isZoneHovered) scheduleClose()
    onLeave(label)
  }

  // Animate only the visual mesh — hit detection mesh stays at fixed scale to avoid
  // spurious pointer events caused by scale changes on the raycast target
  useFrame(({ clock }) => {
    if (!visualMeshRef.current) return
    const pulse = 1 + Math.sin(clock.getElapsedTime() * 0.7) * 0.02
    visualMeshRef.current.scale.setScalar(pulse)
  })

  function handleLabelClick(e: React.MouseEvent) {
    e.stopPropagation()
    setIsLabelHovered(false)  // span is about to unmount — its onMouseLeave won't fire
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

      {/* Visual-only mesh — animated, no pointer events */}
      <mesh ref={visualMeshRef}>
        <sphereGeometry args={[radius, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isActive ? 0.12 : 0.07}
          depthWrite={false}
        />
      </mesh>

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
                // generous padding creates a larger invisible hit area around the text
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
