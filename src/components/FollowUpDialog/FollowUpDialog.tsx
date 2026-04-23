import { useState } from 'react'
import type { FollowUpInput } from '../../types'

interface FollowUpDialogProps {
  initialQuestions: string[]
  onRequestMore: () => Promise<string[]>
  onSave: (followups: FollowUpInput[]) => void
  isSaving: boolean
}

export default function FollowUpDialog({
  initialQuestions,
  onRequestMore,
  onSave,
  isSaving,
}: FollowUpDialogProps) {
  const [questions, setQuestions] = useState(initialQuestions)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [savedAnswers, setSavedAnswers] = useState<(string | null)[]>(
    new Array(initialQuestions.length).fill(null)
  )
  const [showSave, setShowSave] = useState(false)
  const [isRequestingMore, setIsRequestingMore] = useState(false)

  const canRequestMore = questions.length < 5

  function recordAndAdvance(answer: string | null) {
    const next = [...savedAnswers]
    while (next.length <= currentIndex) next.push(null)
    next[currentIndex] = answer
    setSavedAnswers(next)
    setCurrentAnswer('')

    if (currentIndex >= questions.length - 1) {
      setShowSave(true)
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  async function handleRequestMore() {
    setIsRequestingMore(true)
    try {
      const more = await onRequestMore()
      const slots = 5 - questions.length
      const toAdd = more.slice(0, slots)
      if (toAdd.length > 0) {
        setQuestions((prev) => [...prev, ...toAdd])
        setSavedAnswers((prev) => [...prev, ...new Array(toAdd.length).fill(null)])
      }
    } finally {
      setIsRequestingMore(false)
    }
  }

  function handleDone() {
    const next = [...savedAnswers]
    while (next.length <= currentIndex) next.push(null)
    next[currentIndex] = currentAnswer.trim() || null
    setSavedAnswers(next)
    setShowSave(true)
  }

  function handleSave() {
    const followups: FollowUpInput[] = questions
      .map((question, i) => ({
        question,
        answer: savedAnswers[i] ?? null,
        order_index: i,
      }))
      .filter((fu) => fu.answer !== null)
    onSave(followups)
  }

  if (showSave) {
    return (
      <div className="flex flex-col gap-4 mt-4">
        <p className="text-[#78716C] text-sm">Great reflections. Ready to save your entry?</p>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full py-3 rounded-lg bg-[#1C1917] text-[#FAFAF9] text-sm font-medium transition-opacity disabled:opacity-40 hover:opacity-90"
        >
          {isSaving ? 'Saving...' : 'Save Entry ✓'}
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex items-center justify-between">
        <span className="text-[#78716C] text-xs">A quick question...</span>
        <span className="text-[#78716C] text-xs">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <p className="text-[#1C1917] text-base font-medium leading-snug">
        {questions[currentIndex]}
      </p>

      <textarea
        value={currentAnswer}
        onChange={(e) => setCurrentAnswer(e.target.value)}
        placeholder="Your answer (optional)..."
        className="w-full min-h-24 p-4 rounded-lg border border-[#E7E5E4] bg-white text-[#1C1917] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent placeholder-[#78716C]"
        autoFocus
      />

      <div className="flex gap-2">
        <button
          onClick={() => recordAndAdvance(currentAnswer.trim() || null)}
          className="flex-1 py-2.5 rounded-lg bg-[#1C1917] text-[#FAFAF9] text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Next →
        </button>
        <button
          onClick={() => recordAndAdvance(null)}
          className="px-4 py-2.5 rounded-lg border border-[#E7E5E4] text-[#78716C] text-sm hover:text-[#1C1917] transition-colors"
        >
          Skip
        </button>
      </div>

      <div className="flex items-center justify-between pt-1">
        {canRequestMore ? (
          <button
            onClick={handleRequestMore}
            disabled={isRequestingMore}
            className="text-[#78716C] text-xs hover:text-[#1C1917] transition-colors disabled:opacity-40"
          >
            {isRequestingMore ? 'Loading...' : 'Ask me more'}
          </button>
        ) : (
          <span />
        )}
        <button
          onClick={handleDone}
          className="text-[#78716C] text-xs hover:text-[#1C1917] transition-colors"
        >
          I&apos;m done
        </button>
      </div>
    </div>
  )
}
