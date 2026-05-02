import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSettings } from '../hooks/useSettings'
import { useUserValues } from '../hooks/useUserValues'
import { getEntries, getConnectionsForEntry } from '../services/entryService'
import { getAllStories } from '../services/storyService'
import { generatePatternSummary, extractUserValues } from '../services/aiService'
import { STORAGE_KEYS, ACCUMULATOR_CONFIG, DEPTH_SCORE_CONFIG } from '../utils/insightConfig'
import EntryCard from '../components/EntryCard/EntryCard'
import ConnectionBadge from '../components/ConnectionBadge/ConnectionBadge'
import PatternSummary from '../components/PatternSummary/PatternSummary'
import StarField from '../components/StarField/StarField'
import SkyModal from '../components/StarField/SkyModal'
import StoryModal from '../components/StarField/StoryModal'
import InsightModal from '../components/StarField/InsightModal'
import ValuesModal from '../components/ValuesModal/ValuesModal'
import type { Entry, Connection, Story } from '../types'

const INSIGHTS_MIN_ENTRIES = 10
const VALUES_MIN_ENTRIES = 5

export default function HomePage() {
  const navigate = useNavigate()
  const { apiKey } = useSettings()
  const { confirmedValues, hasConfirmed, proposalDismissed, confirmValues, dismissProposal } = useUserValues()
  const [entries, setEntries] = useState<Entry[]>([])
  const [connections, setConnections] = useState<Record<string, Connection>>({})
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [observations, setObservations] = useState<string[]>([])
  const [isInsightsLoading, setIsInsightsLoading] = useState(false)
  const [insightsError, setInsightsError] = useState<string | null>(null)
  const [isStarFieldActive, setIsStarFieldActive] = useState(false)
  const [proposedThemes, setProposedThemes] = useState<string[] | null>(null)
  const [isValuesModalOpen, setIsValuesModalOpen] = useState(false)
  const [writeEntryHighlighted] = useState(false)
  const [openStory, setOpenStory] = useState<Story | null>(null)
  const [openEntry, setOpenEntry] = useState<Entry | null>(null)
  const [blackHoleModalOpen, setBlackHoleModalOpen] = useState(false)
  const [holisticInsight, setHolisticInsight] = useState<string | null>(
    () => localStorage.getItem(STORAGE_KEYS.HOLISTIC_INSIGHT)
  )
  const [hasUnreadInsight, setHasUnreadInsight] = useState(
    () => localStorage.getItem(STORAGE_KEYS.HOLISTIC_INSIGHT_UNREAD) === 'true'
  )
  const [lastEntryDepthScore] = useState(
    () => parseFloat(localStorage.getItem(STORAGE_KEYS.LAST_ENTRY_DEPTH) ?? '0') || 0
  )

  useEffect(() => {
    function handler(e: Event) {
      const insight = (e as CustomEvent<string>).detail
      setHolisticInsight(insight)
      setHasUnreadInsight(true)
    }
    window.addEventListener('dotflow:insight-ready', handler)
    return () => window.removeEventListener('dotflow:insight-ready', handler)
  }, [])
  const [accumulatorTotal] = useState(
    () => parseFloat(localStorage.getItem(STORAGE_KEYS.DEPTH_ACCUMULATOR) ?? '0') || 0
  )

  const hasEntries = !isLoading && !error && entries.length > 0
  const shouldOfferValues =
    !isLoading && !error && entries.length >= VALUES_MIN_ENTRIES && !hasConfirmed && !proposalDismissed && !!apiKey

  async function handleGenerateInsights() {
    if (!apiKey) {
      setInsightsError('Dodaj klucz API w Ustawieniach, aby używać tej funkcji.')
      return
    }
    setIsInsightsLoading(true)
    setInsightsError(null)
    setObservations([])
    try {
      const result = await generatePatternSummary(entries, apiKey)
      setObservations(result)
    } catch {
      setInsightsError('Nie udało się wygenerować wglądów. Spróbuj ponownie.')
    } finally {
      setIsInsightsLoading(false)
    }
  }

  useEffect(() => {
    if (!shouldOfferValues || proposedThemes !== null) return

    async function fetchThemes() {
      try {
        const themes = await extractUserValues(entries, apiKey!)
        if (themes.length > 0) {
          setProposedThemes(themes)
          setIsValuesModalOpen(true)
        }
      } catch {
        // silently fail — values proposal is non-blocking
      }
    }

    void fetchThemes()
  }, [shouldOfferValues, entries, apiKey, proposedThemes])

  useEffect(() => {
    async function load() {
      try {
        const loadedEntries = await getEntries()
        setEntries(loadedEntries)

        // Load stories in background — failures don't affect entry display
        void getAllStories().then(setStories).catch(() => {})

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
        setError('Nie udało się załadować wpisów. Odśwież stronę.')
      } finally {
        setIsLoading(false)
      }
    }
    void load()
  }, [])

  const storyContextMessage = useMemo((): string | null => {
    if (entries.length === 0) return null
    const lastEntry = entries[0]
    const wordCount = lastEntry.content.trim().split(/\s+/).filter(Boolean).length

    if (wordCount < DEPTH_SCORE_CONFIG.SHORT_ENTRY_WORD_THRESHOLD) {
      const consecutiveCount =
        parseInt(localStorage.getItem(STORAGE_KEYS.CONSECUTIVE_SHORT_COUNT) ?? '0', 10) || 0
      return consecutiveCount >= ACCUMULATOR_CONFIG.CONSECUTIVE_SHORT_THRESHOLD
        ? 'Czy nie chcesz dziś pisać, czy jest coś co sprawia Ci trudność w opowiedzeniu?'
        : null
    }

    if (entries.length < 2) return null

    return connections[lastEntry.id]
      ? 'Ten temat pojawia się kolejny raz — coś w nim jest ważnego.'
      : 'Tym razem inaczej — coś się zdaje zmieniać.'
  }, [entries, connections])

  function handleInsightRead() {
    localStorage.removeItem(STORAGE_KEYS.HOLISTIC_INSIGHT_UNREAD)
    setHasUnreadInsight(false)
  }

  function handleLogoClick() {
    if (hasEntries) setIsStarFieldActive((v) => !v)
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {isValuesModalOpen && proposedThemes && (
        <ValuesModal
          proposedThemes={proposedThemes}
          onConfirm={(values) => {
            confirmValues(values)
            setIsValuesModalOpen(false)
          }}
          onDismiss={() => {
            dismissProposal()
            setIsValuesModalOpen(false)
          }}
        />
      )}

      {/* Star field — blurred background in list mode, full interactive in 3D mode */}
      {hasEntries && (
        <div
          className={`fixed inset-0 transition-[opacity] duration-700 ${
            isStarFieldActive ? 'z-20' : 'z-0 pointer-events-none'
          }`}
          style={{
            opacity: isStarFieldActive ? 1 : 0.4,
            filter: isStarFieldActive ? 'none' : 'blur(8px)',
          }}
        >
          <StarField
            entries={entries}
            connections={connections}
            stories={stories}
            isInteractive={isStarFieldActive}
            hasUnreadInsight={hasUnreadInsight}
            depthScore={lastEntryDepthScore}
            insightPreview={holisticInsight ?? (observations.length > 0 ? observations[0] : null) ?? storyContextMessage ?? null}
            userValues={confirmedValues}
            onEntryClick={setOpenEntry}
            onStoryClick={setOpenStory}
            onBlackHoleClick={() => setBlackHoleModalOpen(true)}
            onInsightRead={handleInsightRead}
          />
        </div>
      )}

      {/* Floating logo button in 3D mode */}
      {isStarFieldActive && (
        <button
          onClick={handleLogoClick}
          className="fixed top-4 left-6 z-30 text-[#1C1917]/60 text-xl font-semibold hover:text-[#1C1917] transition-colors bg-transparent border-0"
          aria-label="Exit 3D view"
        >
          Dotflow
        </button>
      )}

      {/* DEV: depth accumulator debug overlay */}
      {isStarFieldActive && (
        <div className="fixed top-4 right-6 z-30 text-[10px] text-[#78716C]/60 font-mono leading-tight text-right">
          <div>depth: {lastEntryDepthScore}pt</div>
          <div>acc: {accumulatorTotal}pt</div>
        </div>
      )}

      {openStory && (
        <StoryModal
          story={openStory}
          onClose={() => setOpenStory(null)}
          apiKey={apiKey ?? undefined}
          onElaborationSaved={(storyId, emotion, confidence) => {
            setStories((prev) => prev.map((s) => s.id === storyId ? { ...s, emotion, emotion_confidence: confidence } : s))
          }}
        />
      )}

      {openEntry && (
        <SkyModal onClose={() => setOpenEntry(null)}>
          <p className="text-sm text-[#A8A29E] mb-6">
            {new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(openEntry.created_at))}
          </p>
          <p className="text-[#1C1917] text-base leading-relaxed whitespace-pre-wrap">
            {openEntry.content}
          </p>
        </SkyModal>
      )}

      {blackHoleModalOpen && (
        <InsightModal
          insight={observations.length > 0 ? observations : null}
          holisticInsight={holisticInsight}
          storyContextMessage={storyContextMessage}
          apiKey={apiKey ?? ''}
          entries={entries}
          onClose={() => setBlackHoleModalOpen(false)}
        />
      )}

      {/* Write Entry CTA in 3D mode — promoted to primary after round limit */}
      {isStarFieldActive && writeEntryHighlighted && (
        <div className="fixed bottom-8 left-0 right-0 flex justify-center z-30">
          <Link
            to="/new"
            className="px-6 py-3 rounded-full text-sm font-medium shadow-lg transition-opacity hover:opacity-90 bg-amber-500 text-white"
          >
            + Napisz
          </Link>
        </div>
      )}

      {/* Main content — only in list mode */}
      {!isStarFieldActive && (
        <div
          className="relative z-10 min-h-screen"
          style={undefined}
        >
          <header className="flex items-center justify-between px-6 py-4 border-b border-[#E7E5E4]">
            <button
              onClick={handleLogoClick}
              className={`text-[#1C1917] text-xl font-semibold bg-transparent border-0 p-0 ${
                hasEntries ? 'cursor-pointer' : 'cursor-default'
              }`}
              aria-label={hasEntries ? 'Explore in 3D' : undefined}
            >
              Dotflow
            </button>
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
              Dodaj klucz API w{' '}
              <Link to="/settings" className="font-medium underline text-[#D97706]">
                Ustawieniach
              </Link>
              , aby włączyć pytania pogłębiające.
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
                  {isInsightsLoading ? 'Generuję wglądy…' : 'Generuj wglądy'}
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
                          connectionInsight={conn.connection_note}
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
              + Napisz
            </Link>
          </div>
        </div>
      )}
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
      <p className="text-[#1C1917] text-lg font-medium">Twoja historia zaczyna się tutaj.</p>
      <p className="text-[#78716C] text-sm">Napisz pierwszy wpis, żeby zacząć łączyć kropki.</p>
    </div>
  )
}
