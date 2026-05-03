import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { Mesh } from 'three'

interface LifeAreaZoneProps {
  label: string
  centroid: [number, number, number]
  radius: number
  color: string
  isLabelCleared: boolean
  onRename: (newLabel: string) => void
  onClear: () => void
  getLabel: (aiLabel: string) => string
}

export default function LifeAreaZone({
  label, centroid, radius, color, isLabelCleared, onRename, onClear, getLabel,
}: LifeAreaZoneProps) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    const pulse = 1 + Math.sin(t * 0.7) * 0.02
    meshRef.current.scale.setScalar(pulse)
  })

  function handleLabelClick(e: React.MouseEvent) {
    e.stopPropagation()
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
  }

  const displayLabel = getLabel(label)

  // Label is offset above the zone sphere so it doesn't overlap other elements near centroid
  const labelOffsetY = radius + 0.6

  return (
    <group position={centroid}>
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <sphereGeometry args={[radius, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.12 : 0.07}
          depthWrite={false}
        />
      </mesh>

      {hovered && !isLabelCleared && (
        <Html position={[0, labelOffsetY, 0]} center style={{ pointerEvents: 'auto', userSelect: 'none' }}>
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
              style={{
                font: '11px DM Sans, sans-serif',
                color: '#78716C',
                background: 'rgba(250,250,249,0.75)',
                padding: '2px 6px',
                borderRadius: 4,
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
