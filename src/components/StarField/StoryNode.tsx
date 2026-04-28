import { useState } from 'react'
import { Html } from '@react-three/drei'
import type { Story } from '../../types'
import { addElaboration } from '../../services/storyService'

interface StoryNodeProps {
  story: Story
  position: [number, number, number]
}

const STORY_STAR_SIZE = 0.06

export default function StoryNode({ story, position }: StoryNodeProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isElaborating, setIsElaborating] = useState(false)
  const [elaborationText, setElaborationText] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const preview = story.content.length > 80 ? `${story.content.slice(0, 80)}…` : story.content

  async function handleElaborationSubmit() {
    if (!elaborationText.trim() || isSaving) return
    setIsSaving(true)
    try {
      await addElaboration(story.id, elaborationText.trim())
      setSaved(true)
      setIsElaborating(false)
      setElaborationText('')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <group position={position}>
      <mesh
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => {
          setIsHovered(false)
          setIsElaborating(false)
        }}
      >
        <sphereGeometry args={[STORY_STAR_SIZE, 8, 8]} />
        <meshBasicMaterial color={saved ? '#A8A29E' : '#C4B5A5'} />
      </mesh>
      {isHovered && (
        <Html style={{ pointerEvents: 'auto' }}>
          <div
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
          </div>
        </Html>
      )}
    </group>
  )
}
