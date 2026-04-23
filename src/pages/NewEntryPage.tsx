import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createEntry } from '../services/entryService'

export default function NewEntryPage() {
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!content.trim()) return
    setIsLoading(true)
    setError(null)
    try {
      await createEntry(content.trim())
      navigate('/')
    } catch {
      setError('Failed to save entry. Please try again.')
      setIsLoading(false)
    }
  }

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
        <p className="text-[#78716C] text-sm mb-4">What's on your mind?</p>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write freely..."
          className="w-full min-h-64 p-4 rounded-lg border border-[#E7E5E4] bg-white text-[#1C1917] text-base resize-none focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent placeholder-[#78716C]"
          autoFocus
        />

        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={!content.trim() || isLoading}
          className="mt-4 w-full py-3 rounded-lg bg-[#1C1917] text-[#FAFAF9] text-sm font-medium transition-opacity disabled:opacity-40 hover:opacity-90"
        >
          {isLoading ? 'Saving...' : 'Save →'}
        </button>
      </main>
    </div>
  )
}
