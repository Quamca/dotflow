import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSettings } from '../hooks/useSettings'
import { getEntries, getConnectionsForEntry } from '../services/entryService'
import { generatePatternSummary } from '../services/aiService'
import EntryCard from '../components/EntryCard/EntryCard'
import ConnectionBadge from '../components/ConnectionBadge/ConnectionBadge'
import PatternSummary from '../components/PatternSummary/PatternSummary'
import type { Entry, Connection } from '../types'

const INSIGHTS_MIN_ENTRIES = 10

export default function HomePage() {
  const navigate = useNavigate()
  const { apiKey } = useSettings()
  const [entries, setEntries] = useState<Entry[]>([])
  const [connections, setConnections] = useState<Record<string, Connection>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [observations, setObservations] = useState<string[]>([])
  const [isInsightsLoading, setIsInsightsLoading] = useState(false)
  const [insightsError, setInsightsError] = useState<string | null>(null)

  async function handleGenerateInsights() {
    if (!apiKey) {
      setInsightsError('Set your API key in Settings to use this feature.')
      return
    }
    setIsInsightsLoading(true)
    setInsightsError(null)
    setObservations([])
    try {
      const result = await generatePatternSummary(entries, apiKey)
      setObservations(result)
    } catch {
      setInsightsError('Failed to generate insights. Please try again.')
    } finally {
      setIsInsightsLoading(false)
    }
  }

  useEffect(() => {
    async function load() {
      try {
        const loadedEntries = await getEntries()
        setEntries(loadedEntries)

        // Load connections in background — failures don't affect entry display
        void Promise.allSettled(
          loadedEntries.map((e) => Promise.resolve().then(() => getConnectionsForEntry(e.id)))
        ).then((results) => {
          const connectionMap: Record<string, Connection> = {}
          results.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value.length > 0) {
              connectionMap[loadedEntries[index].id] = result.value[0]
            }
          })
          setConnections(connectionMap)
        })
      } catch {
        setError('Failed to load entries. Please refresh.')
      } finally {
        setIsLoading(false)
      }
    }
    void load()
  }, [])

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#E7E5E4]">
        <h1 className="text-[#1C1917] text-xl font-semibold">Dotflow</h1>
        <Link
          to="/settings"
          className="text-[#78716C] hover:text-[#1C1917] transition-colors"
          aria-label="Settings"
        >
          ⚙
        </Link>
      </header>

      {!apiKey && (
        <div className="mx-6 mt-4 px-4 py-3 rounded-lg bg-[#FEF3C7] border border-[#D97706] text-sm text-[#1C1917]">
          Add your API key in{' '}
          <Link to="/settings" className="font-medium underline text-[#D97706]">
            Settings
          </Link>{' '}
          to enable AI follow-up questions.
        </div>
      )}

      <main className="px-6 py-6 max-w-2xl mx-auto pb-28">
        {isLoading && <LoadingSkeleton />}

        {!isLoading && error && (
          <p className="text-sm text-red-600 mt-4">{error}</p>
        )}

        {!isLoading && !error && entries.length === 0 && <EmptyState />}

        {!isLoading && !error && entries.length >= INSIGHTS_MIN_ENTRIES && (
          <div className="mb-4">
            <button
              onClick={() => void handleGenerateInsights()}
              disabled={isInsightsLoading}
              className="text-sm text-[#78716C] hover:text-[#1C1917] transition-colors underline underline-offset-2 disabled:opacity-50"
            >
              {isInsightsLoading ? 'Generating insights…' : 'Generate insights'}
            </button>
            {insightsError && (
              <p className="mt-2 text-sm text-red-600">{insightsError}</p>
            )}
            {observations.length > 0 && (
              <div className="mt-3">
                <PatternSummary observations={observations} />
              </div>
            )}
          </div>
        )}

        {!isLoading && !error && entries.length > 0 && (
          <div className="flex flex-col gap-3">
            {entries.map((entry) => {
              const conn = connections[entry.id]
              const targetEntry = conn
                ? entries.find((e) => e.id === conn.target_entry_id)
                : undefined
              return (
                <div key={entry.id}>
                  <EntryCard
                    entry={entry}
                    onClick={() => navigate(`/entry/${entry.id}`)}
                  />
                  {targetEntry && (
                    <ConnectionBadge
                      targetId={targetEntry.id}
                      targetDate={targetEntry.created_at}
                    />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>

      <div className="fixed bottom-8 left-0 right-0 flex justify-center">
        <Link
          to="/new"
          className="px-6 py-3 rounded-full bg-[#1C1917] text-[#FAFAF9] text-sm font-medium hover:opacity-90 transition-opacity shadow-lg"
        >
          + Write
        </Link>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-3 mt-2" aria-label="Loading entries">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl border border-[#E7E5E4] bg-white px-5 py-4 animate-pulse">
          <div className="h-3 w-24 bg-[#E7E5E4] rounded mb-3" />
          <div className="h-4 w-full bg-[#E7E5E4] rounded mb-2" />
          <div className="h-4 w-3/4 bg-[#E7E5E4] rounded" />
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-24 gap-4">
      <div className="text-3xl tracking-widest text-[#E7E5E4] select-none">✦ · ✦</div>
      <p className="text-[#1C1917] text-lg font-medium">Your story starts here.</p>
      <p className="text-[#78716C] text-sm">Write your first entry to begin connecting the dots.</p>
    </div>
  )
}
