import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { Mesh, MeshBasicMaterial } from 'three'
import { respondToInsightFeedback } from '../../services/aiService'
import { DEPTH_SCORE_CONFIG } from '../../utils/insightConfig'

interface BlackHoleProps {
  size: number
  insight: string[] | null
  holisticInsight: string | null
  hasUnreadInsight: boolean
  depthScore: number
  storyContextMessage: string | null
  isInteractive: boolean
  apiKey: string
  onRoundLimitReached?: () => void
  onInsightRead?: () => void
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
const TOOLTIP_HIDE_DELAY = 300
const MIN_PULSE_AMPLITUDE = 0.04
const MAX_PULSE_AMPLITUDE = 0.22

export default function BlackHole({
  size, insight, holisticInsight, hasUnreadInsight, depthScore, storyContextMessage,
  isInteractive, apiKey, onRoundLimitReached, onInsightRead,
}: BlackHoleProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [disagree, setDisagree] = useState<DisagreeState>({
    isActive: false, round: 0, feedbackInput: '', aiResponse: null, isLoading: false,
  })
  const meshRef = useRef<Mesh>(null)
  const glowRef = useRef<Mesh>(null)
  const unreadGlowRef = useRef<Mesh>(null)
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasReadRef = useRef(false)
  const glowFadingRef = useRef(false)
  const glowFadeRef = useRef(1.0)

  useFrame((_, delta) => {
    if (glowRef.current) {
      const t = Date.now() * 0.001 * PULSE_SPEED
      const amplitude = MIN_PULSE_AMPLITUDE + (depthScore / DEPTH_SCORE_CONFIG.MAX_SCORE_PER_ENTRY) * (MAX_PULSE_AMPLITUDE - MIN_PULSE_AMPLITUDE)
      const scale = 1 + Math.sin(t) * amplitude
      glowRef.current.scale.setScalar(scale)
    }
    if (unreadGlowRef.current && hasUnreadInsight) {
      const mat = unreadGlowRef.current.material as MeshBasicMaterial
      if (glowFadingRef.current) {
        glowFadeRef.current = Math.max(0, glowFadeRef.current - delta * 0.28)
        mat.opacity = 0.28 * glowFadeRef.current
        if (glowFadeRef.current === 0) {
          onInsightRead?.()
        }
      } else {
        mat.opacity = 0.28
        const t = Date.now() * 0.001 * PULSE_SPEED * 1.8
        const scale = 1 + Math.sin(t) * 0.14
        unreadGlowRef.current.scale.setScalar(scale)
      }
    }
    if (meshRef.current && isHovered) {
      meshRef.current.rotation.y += delta * 0.3
    }
  })

  function scheduleHide() {
    hideTimeoutRef.current = setTimeout(() => setIsHovered(false), TOOLTIP_HIDE_DELAY)
  }

  function cancelHide() {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
  }

  function handlePointerEnter() {
    cancelHide()
    setIsHovered(true)
    if (hasUnreadInsight && !hasReadRef.current) {
      hasReadRef.current = true
      glowFadingRef.current = true
    }
  }

  const clampedSize = Math.max(MIN_SIZE, size)
  const showTooltip = (isHovered && isInteractive) || disagree.isActive

  async function handleFeedbackSubmit() {
    const activeInsight = holisticInsight ? [holisticInsight] : insight
    if (!disagree.feedbackInput.trim() || disagree.isLoading || !activeInsight) return
    const nextRound = (disagree.round + 1) as 1 | 2
    setDisagree((prev) => ({ ...prev, isLoading: true }))
    try {
      const response = await respondToInsightFeedback(activeInsight, disagree.feedbackInput, nextRound, apiKey)
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

      {hasUnreadInsight && (
        <mesh ref={unreadGlowRef}>
          <sphereGeometry args={[clampedSize * 2.8, 16, 16]} />
          <meshBasicMaterial color="#a78bfa" transparent />
        </mesh>
      )}

      <mesh
        ref={meshRef}
        onPointerEnter={isInteractive ? handlePointerEnter : undefined}
        onPointerLeave={isInteractive ? () => scheduleHide() : undefined}
      >
        <sphereGeometry args={[clampedSize, 24, 24]} />
        <meshStandardMaterial color="#0a0a0f" roughness={0.2} metalness={0.8} />
      </mesh>

      {showTooltip && (
        <Html style={{ pointerEvents: 'none' }}>
          <div
            style={{ pointerEvents: 'auto' }}
            onMouseEnter={cancelHide}
            onMouseLeave={scheduleHide}
          >
            <InsightTooltip
              insight={insight}
              holisticInsight={holisticInsight}
              storyContextMessage={storyContextMessage}
              isInteractive={isInteractive}
              agreed={agreed}
              disagreeState={disagree}
              onAgreeClick={() => setAgreed(true)}
              onDisagreeClick={() => setDisagree((prev) => ({ ...prev, isActive: true }))}
              onFeedbackChange={(val) => setDisagree((prev) => ({ ...prev, feedbackInput: val }))}
              onFeedbackSubmit={handleFeedbackSubmit}
            />
          </div>
        </Html>
      )}
    </group>
  )
}

interface InsightTooltipProps {
  insight: string[] | null
  holisticInsight: string | null
  storyContextMessage: string | null
  isInteractive: boolean
  agreed: boolean
  disagreeState: DisagreeState
  onAgreeClick: () => void
  onDisagreeClick: () => void
  onFeedbackChange: (val: string) => void
  onFeedbackSubmit: () => void
}

function InsightTooltip({
  insight, holisticInsight, storyContextMessage, isInteractive, agreed, disagreeState,
  onAgreeClick, onDisagreeClick, onFeedbackChange, onFeedbackSubmit,
}: InsightTooltipProps) {
  const { isActive, round, feedbackInput, aiResponse, isLoading } = disagreeState

  const showHolistic = !!holisticInsight
  const showPattern = !showHolistic && insight && insight.length > 0
  const showFallback = !showHolistic && !showPattern

  // Silence: short entry with no story context message and no insight
  if (showFallback && !storyContextMessage) {
    return (
      <div style={tooltipStyle}>
        <div style={{ color: '#A8A29E', fontSize: '13px' }}>
          Pisz dalej — Twoje centrum się kształtuje.
        </div>
      </div>
    )
  }

  return (
    <div style={{ ...tooltipStyle, maxWidth: '300px' }}>
      {storyContextMessage && !showHolistic && !showPattern && (
        <div style={{ color: '#D6D3D1', fontSize: '13px', lineHeight: 1.6 }}>
          {storyContextMessage}
        </div>
      )}

      {showHolistic && (
        <div style={{ color: '#FAFAF9', fontSize: '13px', lineHeight: 1.6 }}>
          {holisticInsight}
        </div>
      )}

      {showPattern && (
        <>
          <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '13px', color: '#FAFAF9' }}>
            Twoje zapiski sugerują:
          </div>
          <ul style={{ margin: 0, padding: '0 0 0 14px', listStyle: 'disc' }}>
            {insight!.slice(0, 3).map((obs, i) => (
              <li key={i} style={{ color: '#A8A29E', fontSize: '13px', lineHeight: 1.6, marginBottom: '4px' }}>
                {obs}
              </li>
            ))}
          </ul>
        </>
      )}

      {aiResponse && (
        <div style={{ marginTop: '10px', color: '#D6D3D1', fontSize: '12px', fontStyle: 'italic', lineHeight: 1.6 }}>
          {aiResponse}
        </div>
      )}

      {!isActive && !agreed && isInteractive && (showHolistic || showPattern) && (
        <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
          <button onClick={onAgreeClick} style={feedbackButtonStyle}>
            To ma sens
          </button>
          <button onClick={onDisagreeClick} style={feedbackButtonStyle}>
            To nie brzmi jak ja
          </button>
        </div>
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
  fontSize: '13px',
  padding: '12px 16px',
  borderRadius: '8px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
  userSelect: 'none',
  whiteSpace: 'normal',
  minWidth: '220px',
}

const feedbackButtonStyle: React.CSSProperties = {
  flex: 1,
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.15)',
  color: '#A8A29E',
  fontSize: '12px',
  padding: '4px 8px',
  borderRadius: '4px',
  cursor: 'pointer',
}

const textareaStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '4px',
  color: '#FAFAF9',
  fontSize: '12px',
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
