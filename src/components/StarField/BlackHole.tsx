import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { Mesh, MeshBasicMaterial } from 'three'
import { elaborateInsight } from '../../services/aiService'
import { DEPTH_SCORE_CONFIG } from '../../utils/insightConfig'
import type { Entry } from '../../types'

interface BlackHoleProps {
  size: number
  insight: string[] | null
  holisticInsight: string | null
  hasUnreadInsight: boolean
  depthScore: number
  storyContextMessage: string | null
  isInteractive: boolean
  apiKey: string
  entries: Entry[]
  isActive: boolean
  onActivate: () => void
  onDeactivate: () => void
  onRoundLimitReached?: () => void
  onInsightRead?: () => void
}

interface ElaborationState {
  status: 'idle' | 'loading' | 'shown'
  text: string | null
  dopowiedz: string
  dopowiedzSaved: boolean
}

const initialElaboration: ElaborationState = {
  status: 'idle', text: null, dopowiedz: '', dopowiedzSaved: false,
}

const MIN_SIZE = 0.3
const PULSE_SPEED = 0.8
const MIN_PULSE_AMPLITUDE = 0.04
const MAX_PULSE_AMPLITUDE = 0.22

export default function BlackHole({
  size, insight, holisticInsight, hasUnreadInsight, depthScore, storyContextMessage,
  isInteractive, apiKey, entries, isActive, onActivate, onDeactivate, onInsightRead,
}: BlackHoleProps) {
  const [agreed, setAgreed] = useState(false)
  const [elaboration, setElaboration] = useState<ElaborationState>(initialElaboration)
  // Local tooltip anchors — independent of parent's isActive to survive cursor transit
  const [isTooltipHovered, setIsTooltipHovered] = useState(false)
  const [keepOpen, setKeepOpen] = useState(false)
  const keepOpenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const meshRef = useRef<Mesh>(null)
  const glowRef = useRef<Mesh>(null)
  const unreadGlowRef = useRef<Mesh>(null)
  const hasReadRef = useRef(false)
  const glowFadingRef = useRef(false)
  const glowFadeRef = useRef(1.0)

  function startKeepOpen() {
    if (keepOpenTimerRef.current) clearTimeout(keepOpenTimerRef.current)
    setKeepOpen(true)
    keepOpenTimerRef.current = setTimeout(() => {
      setKeepOpen(false)
      keepOpenTimerRef.current = null
    }, 500)
  }

  function cancelKeepOpen() {
    if (keepOpenTimerRef.current) { clearTimeout(keepOpenTimerRef.current); keepOpenTimerRef.current = null }
    setKeepOpen(false)
  }

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
    if (meshRef.current && (isActive || isTooltipHovered)) {
      meshRef.current.rotation.y += delta * 0.3
    }
  })

  function handlePointerEnter() {
    cancelKeepOpen()
    onActivate()
    if (hasUnreadInsight && !hasReadRef.current) {
      hasReadRef.current = true
      glowFadingRef.current = true
    }
  }

  function handleMeshLeave() {
    if (elaboration.status === 'idle') {
      // Grace period: tooltip stays mounted so cursor can reach it
      startKeepOpen()
      onDeactivate()
    }
  }

  function handleTooltipMouseEnter() {
    cancelKeepOpen()
    setIsTooltipHovered(true)
    onActivate()
  }

  function handleTooltipMouseLeave() {
    setIsTooltipHovered(false)
    if (elaboration.status === 'idle') onDeactivate()
  }

  const clampedSize = Math.max(MIN_SIZE, size)
  // Tooltip stays visible while: parent active, cursor on tooltip div, grace period, or elaborating
  const showTooltip = (isActive || isTooltipHovered || keepOpen || elaboration.status !== 'idle') && isInteractive

  async function handleElaborateClick() {
    const activeInsight = holisticInsight ?? (insight && insight.length > 0 ? insight.join('. ') : null)
    if (!activeInsight || !apiKey) return
    setElaboration((prev) => ({ ...prev, status: 'loading' }))
    try {
      const text = await elaborateInsight(activeInsight, entries, apiKey)
      setElaboration((prev) => ({ ...prev, status: 'shown', text }))
    } catch {
      setElaboration((prev) => ({ ...prev, status: 'idle' }))
    }
  }

  function handleSaveDopowiedz() {
    const existing = JSON.parse(localStorage.getItem('dotflow_insight_notes') ?? '[]') as Array<{ timestamp: string; insight: string; note: string }>
    existing.unshift({ timestamp: new Date().toISOString(), insight: holisticInsight ?? '', note: elaboration.dopowiedz })
    localStorage.setItem('dotflow_insight_notes', JSON.stringify(existing.slice(0, 50)))
    setElaboration((prev) => ({ ...prev, dopowiedzSaved: true }))
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

      <mesh ref={meshRef}>
        <sphereGeometry args={[clampedSize, 24, 24]} />
        <meshStandardMaterial color="#0a0a0f" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* invisible hit area — larger than visual core to match perceived glow size */}
      <mesh
        onPointerEnter={isInteractive ? (e) => { e.stopPropagation(); handlePointerEnter() } : undefined}
        onPointerLeave={isInteractive ? (e) => { e.stopPropagation(); handleMeshLeave() } : undefined}
      >
        <sphereGeometry args={[clampedSize * 1.6, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {showTooltip && (
        <Html style={{ pointerEvents: 'none' }}>
          <div
            style={{ pointerEvents: 'auto' }}
            onMouseEnter={handleTooltipMouseEnter}
            onMouseLeave={handleTooltipMouseLeave}
          >
            <InsightTooltip
              insight={insight}
              holisticInsight={holisticInsight}
              storyContextMessage={storyContextMessage}
              isInteractive={isInteractive}
              elaboration={elaboration}
              agreed={agreed}
              onAgreeClick={() => setAgreed(true)}
              onElaborateClick={handleElaborateClick}
              onDopowiedzChange={(val) => setElaboration((prev) => ({ ...prev, dopowiedz: val }))}
              onSaveDopowiedz={handleSaveDopowiedz}
              onDismissElaboration={() => { setElaboration(initialElaboration); setAgreed(true) }}
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
  elaboration: ElaborationState
  agreed: boolean
  onAgreeClick: () => void
  onElaborateClick: () => void
  onDopowiedzChange: (val: string) => void
  onSaveDopowiedz: () => void
  onDismissElaboration: () => void
}

function InsightTooltip({
  insight, holisticInsight, storyContextMessage, isInteractive, elaboration, agreed,
  onAgreeClick, onElaborateClick, onDopowiedzChange, onSaveDopowiedz, onDismissElaboration,
}: InsightTooltipProps) {
  const showHolistic = !!holisticInsight
  const showPattern = !showHolistic && insight && insight.length > 0
  const showFallback = !showHolistic && !showPattern
  const canElaborate = (showHolistic || showPattern) && isInteractive && !agreed
  const hasElaboration = elaboration.status === 'shown' && elaboration.text

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

      {elaboration.status === 'loading' && (
        <div style={{ marginTop: '10px', color: '#A8A29E', fontSize: '12px', fontStyle: 'italic' }}>
          Szukam połączeń…
        </div>
      )}

      {hasElaboration && (
        <div style={{ marginTop: '10px', color: '#D6D3D1', fontSize: '12px', lineHeight: 1.6, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px' }}>
          {elaboration.text}
        </div>
      )}

      {hasElaboration && !elaboration.dopowiedzSaved && (
        <div style={{ marginTop: '8px' }}>
          <textarea
            value={elaboration.dopowiedz}
            onChange={(e) => onDopowiedzChange(e.target.value)}
            placeholder="Twoje dopowiedzenie..."
            rows={2}
            style={textareaStyle}
          />
          <button
            onClick={onSaveDopowiedz}
            disabled={!elaboration.dopowiedz.trim()}
            style={{ ...submitButtonStyle, opacity: elaboration.dopowiedz.trim() ? 1 : 0.4 }}
          >
            Zapisz →
          </button>
        </div>
      )}

      {hasElaboration && elaboration.dopowiedzSaved && (
        <div style={{ marginTop: '6px', color: '#A8A29E', fontSize: '12px' }}>
          Zapisano ✓
        </div>
      )}

      {hasElaboration && (
        <div style={{ marginTop: '8px' }}>
          <button onClick={onDismissElaboration} style={feedbackButtonStyle}>
            Jest OK
          </button>
        </div>
      )}

      {elaboration.status === 'idle' && canElaborate && (
        <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
          <button onClick={onAgreeClick} style={feedbackButtonStyle}>
            To ma sens
          </button>
          <button onClick={onElaborateClick} style={feedbackButtonStyle}>
            Rozwiń
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
