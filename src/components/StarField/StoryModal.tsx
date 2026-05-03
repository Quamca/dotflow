import { useState } from 'react'
import type { Story } from '../../types'
import { addElaboration, updateStoryEmotion, updateStoryLifeArea } from '../../services/storyService'
import { detectEmotionConfidence, classifyLifeArea } from '../../services/aiService'
import SkyModal from './SkyModal'

interface StoryModalProps {
  story: Story
  onClose: () => void
  apiKey?: string
  existingLifeAreas?: string[]
  onElaborationSaved?: (storyId: string, emotion: string, confidence: number) => void
  onLifeAreaUpdated?: (storyId: string, lifeArea: string) => void
}

const CONFIRMATION_MS = 2000

export default function StoryModal({ story, onClose, apiKey, existingLifeAreas, onElaborationSaved, onLifeAreaUpdated }: StoryModalProps) {
  const [isElaborating, setIsElaborating] = useState(false)
  const [elaborationText, setElaborationText] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [done, setDone] = useState(false)

  const formattedDate = new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(story.created_at))

  async function handleSubmit() {
    if (!elaborationText.trim() || isSaving) return
    setIsSaving(true)
    const trimmed = elaborationText.trim()
    try {
      await addElaboration(story.id, trimmed)
      if (apiKey) {
        const combined = `${story.content}\n\n[Elaboration]: ${trimmed}`
        const [emotionResult, lifeArea] = await Promise.all([
          detectEmotionConfidence(combined, apiKey),
          classifyLifeArea(combined, existingLifeAreas ?? [], apiKey),
        ])
        await Promise.allSettled([
          updateStoryEmotion(story.id, emotionResult.emotion, emotionResult.confidence),
          lifeArea ? updateStoryLifeArea(story.id, lifeArea) : Promise.resolve(),
        ])
        onElaborationSaved?.(story.id, emotionResult.emotion, emotionResult.confidence)
        if (lifeArea) onLifeAreaUpdated?.(story.id, lifeArea)
      }
      setDone(true)
      setTimeout(onClose, CONFIRMATION_MS)
    } finally {
      setIsSaving(false)
    }
  }

  const footer = done ? undefined : (
    isElaborating ? (
      <div className="w-full flex flex-col gap-3">
        <textarea
          value={elaborationText}
          onChange={(e) => setElaborationText(e.target.value)}
          placeholder="Dopowiedz co chcesz..."
          rows={3}
          autoFocus
          className="w-full bg-white border border-[#E7E5E4] rounded-lg text-sm text-[#1C1917] placeholder-[#A8A29E] px-4 py-3 resize-none outline-none focus:border-[#A8A29E]"
        />
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => void handleSubmit()}
            disabled={isSaving || !elaborationText.trim()}
            className="px-6 py-2 rounded-full bg-[#1C1917] text-[#FAFAF9] text-sm disabled:opacity-40 hover:opacity-80 transition-opacity"
          >
            {isSaving ? '…' : 'Wyślij'}
          </button>
          <button
            onClick={() => { setIsElaborating(false); setElaborationText('') }}
            className="px-6 py-2 rounded-full border border-[#E7E5E4] text-[#78716C] text-sm hover:border-[#A8A29E] transition-colors"
          >
            Anuluj
          </button>
        </div>
      </div>
    ) : (
      <button
        onClick={() => setIsElaborating(true)}
        className="px-6 py-2 rounded-full border border-[#E7E5E4] text-[#78716C] text-sm hover:border-[#A8A29E] hover:text-[#1C1917] transition-colors"
      >
        Dopowiedz
      </button>
    )
  )

  return (
    <SkyModal onClose={onClose} footer={footer ?? undefined}>
      {done ? (
        <div className="flex items-center justify-center py-16 text-[#78716C] italic text-base">
          Pięknie.
        </div>
      ) : (
        <>
          <p className="text-sm text-[#A8A29E] mb-6">{formattedDate}</p>
          <p className="text-[#1C1917] text-base leading-relaxed whitespace-pre-wrap">
            {story.content}
          </p>
        </>
      )}
    </SkyModal>
  )
}
