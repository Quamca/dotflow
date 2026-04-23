import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createEntry, saveFollowUps } from '../services/entryService'
import { generateFollowUpQuestions } from '../services/aiService'
import { useSettings } from '../hooks/useSettings'
import FollowUpDialog from '../components/FollowUpDialog/FollowUpDialog'
import type { Entry, FollowUpInput } from '../types'

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

    if (!apiKey) {
      navigate('/')
      return
    }

    setLoadingPhase('thinking')
    try {
      const generated = await generateFollowUpQuestions(content.trim(), apiKey)
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
      return await generateFollowUpQuestions(content.trim(), apiKey)
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
        {!showDialog ? (
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
