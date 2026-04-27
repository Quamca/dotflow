import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { Mesh } from 'three'
import { respondToInsightFeedback } from '../../services/aiService'

interface BlackHoleProps {
  size: number
  insight: string[] | null
  isInteractive: boolean
  apiKey: string
  onRoundLimitReached?: () => void
}

interface DisagreeState {
  isActive: boolean
  round: 0 | 1 | 2
  feedbackInput: string
  aiResponse: string | null
  isLoading: boolean
}

const MIN_SIZE = 0.3
const PULSE_SPEED = 0.8

export default function BlackHole({ size, insight, isInteractive, apiKey, onRoundLimitReached }: BlackHoleProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [disagree, setDisagree] = useState<DisagreeState>({
    isActive: false,
    round: 0,
    feedbackInput: '',
    aiResponse: null,
    isLoading: false,
  })
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
  const showTooltip = (isHovered && isInteractive) || disagree.isActive

  async function handleFeedbackSubmit() {
    if (!disagree.feedbackInput.trim() || disagree.isLoading || !insight) return
    const nextRound = (disagree.round + 1) as 1 | 2
    setDisagree((prev) => ({ ...prev, isLoading: true }))
    try {
      const response = await respondToInsightFeedback(insight, disagree.feedbackInput, nextRound, apiKey)
      setDisagree((prev) => ({ ...prev, aiResponse: response, round: nextRound, feedbackInput: '', isLoading: false }))
      if (nextRound === 2) onRoundLimitReached?.()
    } catch {
      setDisagree((prev) => ({ ...prev, isLoading: false }))
    }
  }

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={glowRef}>
        <sphereGeometry args={[clampedSize * 1.4, 16, 16]} />
        <meshBasicMaterial color="#3b2a4a" transparent opacity={0.18} />
      </mesh>

      <mesh
        ref={meshRef}
        onPointerEnter={isInteractive ? () => setIsHovered(true) : undefined}
        onPointerLeave={isInteractive ? () => setIsHovered(false) : undefined}
      >
        <sphereGeometry args={[clampedSize, 24, 24]} />
        <meshStandardMaterial color="#0a0a0f" roughness={0.2} metalness={0.8} />
      </mesh>

      {showTooltip && (
        <Html style={{ pointerEvents: 'none' }}>
          <InsightTooltip
            insight={insight}
            isInteractive={isInteractive}
            disagreeState={disagree}
            onDisagreeClick={() => setDisagree((prev) => ({ ...prev, isActive: true }))}
            onFeedbackChange={(val) => setDisagree((prev) => ({ ...prev, feedbackInput: val }))}
            onFeedbackSubmit={handleFeedbackSubmit}
          />
        </Html>
      )}
    </group>
  )
}

interface InsightTooltipProps {
  insight: string[] | null
  isInteractive: boolean
  disagreeState: DisagreeState
  onDisagreeClick: () => void
  onFeedbackChange: (val: string) => void
  onFeedbackSubmit: () => void
}

function InsightTooltip({ insight, isInteractive, disagreeState, onDisagreeClick, onFeedbackChange, onFeedbackSubmit }: InsightTooltipProps) {
  const { isActive, round, feedbackInput, aiResponse, isLoading } = disagreeState

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
    <div style={{ ...tooltipStyle, maxWidth: '240px', pointerEvents: 'auto' }}>
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

      {aiResponse && (
        <div style={{ marginTop: '10px', color: '#D6D3D1', fontSize: '11px', fontStyle: 'italic', lineHeight: 1.5 }}>
          {aiResponse}
        </div>
      )}

      {!isActive && isInteractive && (
        <button onClick={onDisagreeClick} style={disagreeButtonStyle}>
          To nie brzmi jak ja
        </button>
      )}

      {isActive && round < 2 && (
        <div style={{ marginTop: '10px' }}>
          <textarea
            value={feedbackInput}
            onChange={(e) => onFeedbackChange(e.target.value)}
            placeholder="Co sprawia, że ten wgląd nie pasuje?"
            disabled={isLoading}
            rows={2}
            style={textareaStyle}
          />
          <button
            onClick={onFeedbackSubmit}
            disabled={isLoading || !feedbackInput.trim()}
            style={{ ...submitButtonStyle, opacity: isLoading || !feedbackInput.trim() ? 0.5 : 1 }}
          >
            {isLoading ? '...' : '→'}
          </button>
        </div>
      )}
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

const disagreeButtonStyle: React.CSSProperties = {
  marginTop: '10px',
  display: 'block',
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.15)',
  color: '#A8A29E',
  fontSize: '11px',
  padding: '4px 10px',
  borderRadius: '4px',
  cursor: 'pointer',
  width: '100%',
}

const textareaStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '4px',
  color: '#FAFAF9',
  fontSize: '11px',
  padding: '6px 8px',
  resize: 'none',
  outline: 'none',
  boxSizing: 'border-box',
}

const submitButtonStyle: React.CSSProperties = {
  marginTop: '6px',
  display: 'block',
  marginLeft: 'auto',
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.2)',
  color: '#FAFAF9',
  fontSize: '12px',
  padding: '4px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
}
