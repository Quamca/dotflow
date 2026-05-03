import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createEntry, saveFollowUps, getEntries, getEntriesWithFollowUps, saveConnection } from '../services/entryService'
import { generateFollowUpQuestions, findConnection, extractStories, detectEmotionConfidence, generateHolisticInsight, classifyLifeArea } from '../services/aiService'
import { saveStories, updateStoryEmotion, updateStoryLifeArea, getRecentStories, getAllStories } from '../services/storyService'
import { useSettings } from '../hooks/useSettings'
import { useDepthAccumulator, computeDepthScore } from '../hooks/useDepthAccumulator'
import { STORAGE_KEYS } from '../utils/insightConfig'
import FollowUpDialog from '../components/FollowUpDialog/FollowUpDialog'
import type { Entry, FollowUpInput } from '../types'

async function extractAndSaveStories(entryId: string, content: string, apiKey: string): Promise<void> {
  try {
    const storyContents = await extractStories(content, apiKey)
    const stories = await saveStories(entryId, storyContents)

    const existingStories = await getAllStories()
    const existingAreas = [...new Set(
      existingStories.map((s) => s.life_area).filter((a): a is string => a !== null)
    )]

    await Promise.allSettled(
      stories.map(async (story) => {
        const [emotionResult, lifeArea] = await Promise.all([
          detectEmotionConfidence(story.content, apiKey),
          classifyLifeArea(story.content, existingAreas, apiKey),
        ])
        await Promise.allSettled([
          updateStoryEmotion(story.id, emotionResult.emotion, emotionResult.confidence),
          lifeArea ? updateStoryLifeArea(story.id, lifeArea) : Promise.resolve(),
        ])
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
  const accumulator = useDepthAccumulator()
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingPhase, setLoadingPhase] = useState<'saving' | 'thinking'>('saving')
  const [error, setError] = useState<string | null>(null)
  const [savedEntry, setSavedEntry] = useState<Entry | null>(null)
  const [savedWordCount, setSavedWordCount] = useState(0)
  const [questions, setQuestions] = useState<string[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [isSavingFollowUps, setIsSavingFollowUps] = useState(false)
  const [showPiknie, setShowPiknie] = useState(false)
  const [storyContext, setStoryContext] = useState<string | undefined>(undefined)

  const WORD_COUNT_GATE = 300

  async function handleDepthAccumulation(wordCount: number, answeredFollowUpCount: number): Promise<void> {
    const score = computeDepthScore(wordCount, answeredFollowUpCount)
    accumulator.trackEntryLength(wordCount)
    const { thresholdCrossed } = accumulator.addScore(score)

    if (!thresholdCrossed || !apiKey) return

    accumulator.reset()
    try {
      const allEntries = await getEntriesWithFollowUps()
      const noteData = (() => {
        try { return JSON.parse(localStorage.getItem('dotflow_insight_note') ?? 'null') as { key: string; note: string } | null }
        catch { return null }
      })()
      const insight = await generateHolisticInsight(allEntries, apiKey, noteData?.note ?? undefined)
      if (insight) {
        localStorage.setItem(STORAGE_KEYS.HOLISTIC_INSIGHT, insight)
        localStorage.setItem(STORAGE_KEYS.HOLISTIC_INSIGHT_UNREAD, 'true')
        window.dispatchEvent(new CustomEvent('dotflow:insight-ready', { detail: insight }))
      }
    } catch {
      // best-effort — insight generation does not block navigation
    }
  }

  async function handleSubmit() {
    if (!content.trim()) return
    setIsLoading(true)
    setLoadingPhase('saving')
    setError(null)

    const wordCount = content.trim().split(/\s+/).filter(Boolean).length
    setSavedWordCount(wordCount)

    let entry: Entry
    try {
      entry = await createEntry(content.trim())
    } catch {
      setError('Nie udało się zapisać wpisu. Spróbuj ponownie.')
      setIsLoading(false)
      return
    }

    if (apiKey) {
      void detectAndSaveConnection(entry, apiKey)
      void extractAndSaveStories(entry.id, content.trim(), apiKey)
    }

    if (!apiKey) {
      void handleDepthAccumulation(wordCount, 0)
      navigate('/')
      return
    }

    if (wordCount > WORD_COUNT_GATE) {
      void handleDepthAccumulation(wordCount, 0)
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
      setError(`Wpis zapisany. AI niedostępne: ${msg}`)
      setIsLoading(false)
      return
    }

    void handleDepthAccumulation(wordCount, 0)
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
    const answeredCount = followups.filter((fu) => fu.answer !== null && fu.answer.trim() !== '').length
    void handleDepthAccumulation(savedWordCount, answeredCount)
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

  const loadingLabel = loadingPhase === 'thinking' ? 'Myślę...' : 'Zapisuję...'

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#E7E5E4]">
        <button
          onClick={() => navigate('/')}
          className="text-[#78716C] hover:text-[#1C1917] transition-colors text-sm"
          aria-label="Wróć"
        >
          ← Wróć
        </button>
        <span className="text-[#1C1917] text-sm font-medium">Nowy wpis</span>
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
            <p className="text-[#78716C] text-sm mb-4">Zacznij od czegokolwiek.</p>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Pisz swobodnie..."
              className="w-full min-h-64 p-4 rounded-lg border border-[#E7E5E4] bg-white text-[#1C1917] text-base resize-none focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent placeholder-[#78716C]"
              autoFocus
            />
            {content.trim().length > 0 && (() => {
              const wc = content.trim().split(/\s+/).filter(Boolean).length
              return (
                <p className={`mt-1 text-xs text-right ${wc >= WORD_COUNT_GATE ? 'text-amber-600' : 'text-[#78716C]'}`}>
                  {wc} {wc === 1 ? 'słowo' : wc < 5 ? 'słowa' : 'słów'}{wc >= WORD_COUNT_GATE ? ' — długi wpis' : ''}
                </p>
              )
            })()}
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || isLoading}
              className="mt-4 w-full py-3 rounded-lg bg-[#1C1917] text-[#FAFAF9] text-sm font-medium transition-opacity disabled:opacity-40 hover:opacity-90"
            >
              {isLoading ? loadingLabel : 'Zapisz →'}
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
