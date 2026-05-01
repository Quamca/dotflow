import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createEntry, saveFollowUps, getEntries, saveConnection } from '../services/entryService'
import { generateFollowUpQuestions, findConnection, extractStories, detectEmotionConfidence } from '../services/aiService'
import { saveStories, updateStoryEmotion, getRecentStories } from '../services/storyService'
import { useSettings } from '../hooks/useSettings'
import FollowUpDialog from '../components/FollowUpDialog/FollowUpDialog'
import type { Entry, FollowUpInput } from '../types'

async function extractAndSaveStories(entryId: string, content: string, apiKey: string): Promise<void> {
  try {
    const storyContents = await extractStories(content, apiKey)
    const stories = await saveStories(entryId, storyContents)
    await Promise.allSettled(
      stories.map(async (story) => {
        const result = await detectEmotionConfidence(story.content, apiKey)
        await updateStoryEmotion(story.id, result.emotion, result.confidence)
      })
    )
  } catch {
    // silently ignore — story extraction is best-effort
  }
}

async function detectAndSaveConnection(newEntry: Entry, apiKey: string): Promise<void> {
  try {
    const allEntries = await getEntries()
    const pastEntries = allEntries.filter((e) => e.id !== newEntry.id).slice(0, 10)
    if (pastEntries.length === 0) return
    const result = await findConnection(newEntry, pastEntries, apiKey)
    if (result.connected && result.entry_id && result.score >= 0.7) {
      await saveConnection(newEntry.id, result.entry_id, result.score, result.note)
    }
  } catch {
    // silently ignore — connection detection is best-effort
  }
}

export default function NewEntryPage() {
  const navigate = useNavigate()
  const { apiKey } = useSettings()
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingPhase, setLoadingPhase] = useState<'saving' | 'thinking'>('saving')
  const [error, setError] = useState<string | null>(null)
  const [savedEntry, setSavedEntry] = useState<Entry | null>(null)
  const [questions, setQuestions] = useState<string[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [isSavingFollowUps, setIsSavingFollowUps] = useState(false)
  const [showPiknie, setShowPiknie] = useState(false)
  const [storyContext, setStoryContext] = useState<string | undefined>(undefined)

  const WORD_COUNT_GATE = 300

  async function handleSubmit() {
    if (!content.trim()) return
    setIsLoading(true)
    setLoadingPhase('saving')
    setError(null)

    let entry: Entry
    try {
      entry = await createEntry(content.trim())
    } catch {
      setError('Failed to save entry. Please try again.')
      setIsLoading(false)
      return
    }

    if (apiKey) {
      void detectAndSaveConnection(entry, apiKey)
      void extractAndSaveStories(entry.id, content.trim(), apiKey)
    }

    if (!apiKey) {
      navigate('/')
      return
    }

    const wordCount = content.trim().split(/\s+/).filter(Boolean).length
    if (wordCount > WORD_COUNT_GATE) {
      setShowPiknie(true)
      setIsLoading(false)
      return
    }

    setLoadingPhase('thinking')

    let context: string | undefined
    try {
      const recentStories = await getRecentStories(entry.id, 3)
      if (recentStories.length > 0) {
        context = recentStories.map((s) => s.content).join('\n---\n')
        setStoryContext(context)
      }
    } catch {
      // best-effort — proceed without context
    }

    try {
      const generated = await generateFollowUpQuestions(content.trim(), apiKey, context)
      if (generated.length > 0) {
        setSavedEntry(entry)
        setQuestions(generated)
        setShowDialog(true)
        setIsLoading(false)
        return
      }
      // AI returned empty array — entry saved, go home
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setError(`Your entry was saved. AI questions unavailable: ${msg}`)
      setIsLoading(false)
      return
    }

    navigate('/')
  }

  async function handleSaveFollowUps(followups: FollowUpInput[]) {
    if (!savedEntry) return
    setIsSavingFollowUps(true)
    try {
      await saveFollowUps(savedEntry.id, followups)
    } catch {
      // followups failed — entry already saved, navigate anyway
    }
    navigate('/')
  }

  async function handleRequestMore(): Promise<string[]> {
    if (!apiKey || !content) return []
    try {
      return await generateFollowUpQuestions(content.trim(), apiKey, storyContext)
    } catch {
      return []
    }
  }

  const loadingLabel = loadingPhase === 'thinking' ? 'Thinking...' : 'Saving...'

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#E7E5E4]">
        <button
          onClick={() => navigate('/')}
          className="text-[#78716C] hover:text-[#1C1917] transition-colors text-sm"
          aria-label="Back"
        >
          ← Back
        </button>
        <span className="text-[#1C1917] text-sm font-medium">New Entry</span>
        <div className="w-12" />
      </header>

      <main className="px-6 py-8 max-w-2xl mx-auto">
        {showPiknie ? (
          <div className="flex flex-col items-center justify-center min-h-64 gap-6 text-center">
            <p className="text-2xl text-[#1C1917] font-light">Pięknie.</p>
            <button
              onClick={() => navigate('/')}
              className="text-sm text-[#78716C] hover:text-[#1C1917] transition-colors"
            >
              Wróć →
            </button>
          </div>
        ) : !showDialog ? (
          <>
            <p className="text-[#78716C] text-sm mb-4">What&apos;s on your mind?</p>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write freely..."
              className="w-full min-h-64 p-4 rounded-lg border border-[#E7E5E4] bg-white text-[#1C1917] text-base resize-none focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent placeholder-[#78716C]"
              autoFocus
            />
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || isLoading}
              className="mt-4 w-full py-3 rounded-lg bg-[#1C1917] text-[#FAFAF9] text-sm font-medium transition-opacity disabled:opacity-40 hover:opacity-90"
            >
              {isLoading ? loadingLabel : 'Save →'}
            </button>
          </>
        ) : (
          <FollowUpDialog
            initialQuestions={questions}
            onRequestMore={handleRequestMore}
            onSave={handleSaveFollowUps}
            isSaving={isSavingFollowUps}
          />
        )}
      </main>
    </div>
  )
}
