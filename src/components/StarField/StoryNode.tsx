import { useRef, useState } from 'react'
import { Html } from '@react-three/drei'
import type { Story } from '../../types'
import { getEmotionColor } from '../../utils/emotionColors'

interface StoryNodeProps {
  story: Story
  position: [number, number, number]
  isInteractive: boolean
  onOpenModal?: () => void
  zoneHighlight?: 'highlight'
}

const DRAG_THRESHOLD_SQ = 25
const STORY_STAR_SIZE = 0.06

export default function StoryNode({ story, position, isInteractive, onOpenModal, zoneHighlight }: StoryNodeProps) {
  const [isHovered, setIsHovered] = useState(false)
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null)
  const emotionColor = getEmotionColor(story.emotion)
  const color = isHovered ? '#1C1917' : emotionColor
  const meshScale = zoneHighlight === 'highlight' ? 2.2 : 1

  const preview = story.content.length > 80 ? `${story.content.slice(0, 80)}…` : story.content

  return (
    <group position={position}>
      <mesh
        scale={meshScale}
        onPointerDown={isInteractive ? (e) => { pointerDownPos.current = { x: e.clientX, y: e.clientY } } : undefined}
        onPointerEnter={isInteractive ? (e) => { e.stopPropagation(); setIsHovered(true) } : undefined}
        onPointerLeave={isInteractive ? (e) => { e.stopPropagation(); setIsHovered(false) } : undefined}
        onClick={isInteractive ? (e) => {
          e.stopPropagation()
          const pd = pointerDownPos.current
          if (pd) {
            const dx = e.clientX - pd.x
            const dy = e.clientY - pd.y
            if (dx * dx + dy * dy > DRAG_THRESHOLD_SQ) return
          }
          onOpenModal?.()
        } : undefined}
      >
        <sphereGeometry args={[STORY_STAR_SIZE, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {isHovered && isInteractive && (
        <Html style={{ pointerEvents: 'none' }}>
          <div
            style={{
              ...hoverTooltipBase,
              borderLeft: `2px solid ${emotionColor}`,
              boxShadow: `0 2px 12px rgba(0,0,0,0.35), 0 0 8px ${emotionColor}28`,
            }}
          >
            <div style={{ color: '#D6D3D1', lineHeight: 1.45 }}>
              {preview}
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

const hoverTooltipBase: React.CSSProperties = {
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
  padding: '7px 11px 7px 13px',
  borderRadius: '7px',
  width: '210px',
  whiteSpace: 'normal',
  userSelect: 'none',
}
