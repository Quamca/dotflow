import { useState, useRef } from 'react'
import { Html } from '@react-three/drei'
import type { Story } from '../../types'
import { addElaboration, updateStoryEmotion } from '../../services/storyService'
import { detectEmotionConfidence } from '../../services/aiService'
import { getEmotionColor } from '../../utils/emotionColors'

interface StoryNodeProps {
  story: Story
  position: [number, number, number]
  isActive: boolean
  onActivate: (id: string) => void
  apiKey?: string
}

const STORY_STAR_SIZE = 0.06
const HIDE_DELAY_MS = 3000
const CONFIRMATION_DURATION_MS = 2000

export default function StoryNode({ story, position, isActive, onActivate, apiKey }: StoryNodeProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isElaborating, setIsElaborating] = useState(false)
  const [elaborationText, setElaborationText] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [emotion, setEmotion] = useState<string | null>(story.emotion)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const preview = story.content.length > 80 ? `${story.content.slice(0, 80)}…` : story.content
  const tooltipVisible = isVisible && isActive

  function clearHideTimer() {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current)
      hideTimer.current = null
    }
  }

  function scheduleHide() {
    clearHideTimer()
    hideTimer.current = setTimeout(() => {
      setIsVisible(false)
      setIsElaborating(false)
    }, HIDE_DELAY_MS)
  }

  async function handleElaborationSubmit() {
    if (!elaborationText.trim() || isSaving) return
    setIsSaving(true)
    const trimmed = elaborationText.trim()
    try {
      await addElaboration(story.id, trimmed)
      if (apiKey) {
        const combinedContent = `${story.content}\n\n[Elaboration]: ${trimmed}`
        const result = await detectEmotionConfidence(combinedContent, apiKey)
        await updateStoryEmotion(story.id, result.emotion, result.confidence)
        setEmotion(result.emotion)
      }
      setIsElaborating(false)
      setElaborationText('')
      setShowConfirmation(true)
      setTimeout(() => {
        setShowConfirmation(false)
        setIsVisible(false)
      }, CONFIRMATION_DURATION_MS)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <group position={position}>
      <mesh
        onPointerEnter={() => {
          clearHideTimer()
          setIsVisible(true)
          onActivate(story.id)
        }}
        onPointerLeave={scheduleHide}
      >
        <sphereGeometry args={[STORY_STAR_SIZE, 8, 8]} />
        <meshBasicMaterial color={getEmotionColor(emotion)} />
      </mesh>
      {tooltipVisible && (
        <Html style={{ pointerEvents: 'auto' }}>
          <div
            onMouseEnter={() => { clearHideTimer(); onActivate(story.id) }}
            onMouseLeave={scheduleHide}
            style={{
              background: 'rgba(28, 25, 23, 0.95)',
              color: '#FAFAF9',
              fontSize: '12px',
              padding: '10px 14px',
              borderRadius: '8px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
              width: '220px',
            }}
          >
            {showConfirmation ? (
              <div style={{ color: '#A8A29E', textAlign: 'center', padding: '8px 0', fontStyle: 'italic' }}>
                Pięknie.
              </div>
            ) : (
            <>
            <div
              style={{
                color: '#A8A29E',
                lineHeight: 1.5,
                marginBottom: '8px',
                whiteSpace: 'normal',
              }}
            >
              {preview}
            </div>
            {!isElaborating && (
              <button
                onClick={() => setIsElaborating(true)}
                style={{
                  background: 'transparent',
                  border: '1px solid #57534E',
                  color: '#D6D3D1',
                  fontSize: '11px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                Dopowiedz
              </button>
            )}
            {isElaborating && (
              <div>
                <textarea
                  value={elaborationText}
                  onChange={(e) => setElaborationText(e.target.value)}
                  placeholder="Dopowiedz co chcesz..."
                  rows={3}
                  style={{
                    width: '100%',
                    background: '#1C1917',
                    border: '1px solid #57534E',
                    color: '#FAFAF9',
                    fontSize: '11px',
                    padding: '6px 8px',
                    borderRadius: '4px',
                    resize: 'vertical',
                    marginBottom: '6px',
                    boxSizing: 'border-box',
                  }}
                />
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={handleElaborationSubmit}
                    disabled={isSaving || !elaborationText.trim()}
                    style={{
                      flex: 1,
                      background: '#44403C',
                      border: 'none',
                      color: '#FAFAF9',
                      fontSize: '11px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      cursor: isSaving ? 'wait' : 'pointer',
                      opacity: !elaborationText.trim() ? 0.5 : 1,
                    }}
                  >
                    {isSaving ? '...' : 'Wyślij'}
                  </button>
                  <button
                    onClick={() => {
                      setIsElaborating(false)
                      setElaborationText('')
                    }}
                    style={{
                      background: 'transparent',
                      border: '1px solid #57534E',
                      color: '#A8A29E',
                      fontSize: '11px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Anuluj
                  </button>
                </div>
              </div>
            )}
            </>
            )}
          </div>
        </Html>
      )}
    </group>
  )
}
