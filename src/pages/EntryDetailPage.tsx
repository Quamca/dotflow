import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getEntryById } from '../services/entryService'
import type { EntryWithFollowUps } from '../types'

function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(isoString))
}

export default function EntryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [entry, setEntry] = useState<EntryWithFollowUps | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    getEntryById(id)
      .then(setEntry)
      .catch(() => setError('Wpis nie istnieje.'))
      .finally(() => setIsLoading(false))
  }, [id])

  const answeredFollowUps = entry?.followups.filter((fu) => fu.answer !== null) ?? []

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
        <span className="text-[#1C1917] text-sm font-medium">
          {entry ? formatDate(entry.created_at) : ''}
        </span>
        <div className="w-12" />
      </header>

      <main className="px-6 py-8 max-w-2xl mx-auto">
        {isLoading && (
          <div className="animate-pulse space-y-3">
            <div className="h-4 w-32 bg-[#E7E5E4] rounded" />
            <div className="h-4 w-full bg-[#E7E5E4] rounded" />
            <div className="h-4 w-full bg-[#E7E5E4] rounded" />
            <div className="h-4 w-2/3 bg-[#E7E5E4] rounded" />
          </div>
        )}

        {!isLoading && error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {!isLoading && entry && (
          <>
            <p className="text-[#1C1917] text-base leading-relaxed whitespace-pre-wrap">
              {entry.content}
            </p>

            {entry.emotions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {entry.emotions.map((emotion) => (
                  <span
                    key={emotion}
                    className="px-2 py-0.5 rounded-full bg-[#E7E5E4] text-[#78716C] text-xs"
                  >
                    {emotion}
                  </span>
                ))}
              </div>
            )}

            {answeredFollowUps.length > 0 && (
              <div className="mt-8 border-t border-[#E7E5E4] pt-6">
                <p className="text-xs text-[#78716C] uppercase tracking-wide mb-4">Pogłębienie</p>
                <div className="flex flex-col gap-5">
                  {answeredFollowUps.map((fu) => (
                    <div key={fu.id}>
                      <p className="text-sm text-[#78716C] mb-1">{fu.question}</p>
                      <p className="text-sm text-[#1C1917] leading-relaxed">{fu.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
