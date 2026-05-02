import { useState } from 'react'
import type { Entry } from '../../types'
import { elaborateInsight } from '../../services/aiService'
import SkyModal from './SkyModal'

interface InsightModalProps {
  insight: string[] | null
  holisticInsight: string | null
  storyContextMessage: string | null
  apiKey: string
  entries: Entry[]
  onClose: () => void
  onAcknowledge?: () => void
}

const NOTE_CONFIRMATION = 'Dobrze. Twoja refleksja zostanie uwzględniona w kolejnym odkryciu.'

function getStoredElab(key: string): string | null {
  try {
    const d = JSON.parse(localStorage.getItem('dotflow_elaborated_insight') ?? 'null') as { key: string; text: string } | null
    return d?.key === key ? d.text : null
  } catch { return null }
}

function getStoredNote(key: string): string | null {
  try {
    const d = JSON.parse(localStorage.getItem('dotflow_insight_note') ?? 'null') as { key: string; note: string } | null
    return d?.key === key ? d.note : null
  } catch { return null }
}

export default function InsightModal({
  insight, holisticInsight, storyContextMessage, apiKey, entries, onClose, onAcknowledge,
}: InsightModalProps) {
  const showHolistic = !!holisticInsight
  const showPattern = !showHolistic && insight && insight.length > 0
  const showFallback = !showHolistic && !showPattern && !storyContextMessage
  const hasInsightContent = showHolistic || showPattern

  const insightKey = holisticInsight ?? insight?.join('\n') ?? ''
  const isAcknowledged = !!insightKey && localStorage.getItem('dotflow_acknowledged_insight') === insightKey

  const [elabStatus, setElabStatus] = useState<'idle' | 'loading' | 'shown'>(() =>
    getStoredElab(insightKey) ? 'shown' : 'idle'
  )
  const [elabText, setElabText] = useState<string | null>(() => getStoredElab(insightKey))
  const [noteInput, setNoteInput] = useState('')
  const [savedNote, setSavedNote] = useState<string | null>(() => getStoredNote(insightKey))

  // Initial state: "Jest OK" + "Rozwiń"
  // After "Jest OK": acknowledged → only "Rozwiń" remains
  // After "Rozwiń": elaboration shown → "Jest OK" replaced by "To ma sens", textarea appears
  // After "To ma sens" or "Zapisz →": acknowledged → no buttons, elaboration (+ note) persisted
  const showJestOK = hasInsightContent && !!apiKey && !isAcknowledged && elabStatus === 'idle'
  const showRozwin = hasInsightContent && !!apiKey && elabStatus === 'idle'
  const showNoteInput = !isAcknowledged && elabStatus === 'shown' && !savedNote

  async function handleElaborate() {
    const cached = getStoredElab(insightKey)
    if (cached) { setElabText(cached); setElabStatus('shown'); return }
    const activeInsight = holisticInsight ?? insight?.join('. ') ?? null
    if (!activeInsight || !apiKey) return
    setElabStatus('loading')
    try {
      const text = await elaborateInsight(activeInsight, entries, apiKey)
      localStorage.setItem('dotflow_elaborated_insight', JSON.stringify({ key: insightKey, text }))
      setElabText(text)
      setElabStatus('shown')
    } catch {
      setElabStatus('idle')
    }
  }

  function handleSaveNote() {
    const history = JSON.parse(localStorage.getItem('dotflow_insight_notes') ?? '[]') as Array<{ timestamp: string; insight: string; note: string }>
    history.unshift({ timestamp: new Date().toISOString(), insight: holisticInsight ?? '', note: noteInput })
    localStorage.setItem('dotflow_insight_notes', JSON.stringify(history.slice(0, 50)))
    localStorage.setItem('dotflow_insight_note', JSON.stringify({ key: insightKey, note: noteInput }))
    setSavedNote(noteInput)
    setTimeout(() => { onAcknowledge?.(); onClose() }, 1800)
  }

  return (
    <SkyModal onClose={onClose}>
      {showFallback && (
        <p className="text-[#78716C] text-base leading-relaxed">
          Pisz dalej — Twoje centrum się kształtuje.
        </p>
      )}
      {storyContextMessage && !showHolistic && !showPattern && (
        <p className="text-[#1C1917] text-base leading-relaxed">{storyContextMessage}</p>
      )}
      {showHolistic && (
        <p className="text-[#1C1917] text-base leading-relaxed">{holisticInsight}</p>
      )}
      {showPattern && (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-[#78716C] mb-1">Twoje zapiski sugerują:</p>
          {insight!.map((obs, i) => (
            <p key={i} className="text-[#1C1917] text-base leading-relaxed pl-4 border-l-2 border-[#E7E5E4]">{obs}</p>
          ))}
        </div>
      )}

      {elabStatus === 'loading' && (
        <p className="mt-6 text-[#A8A29E] text-sm italic">Szukam połączeń…</p>
      )}

      {elabStatus === 'shown' && elabText && (
        <div className="mt-6 pt-6 border-t border-[#E7E5E4] flex flex-col gap-3">
          <p className="text-[#1C1917] text-base leading-relaxed">{elabText}</p>
          {savedNote && (
            <>
              <p className="text-[#78716C] text-sm leading-relaxed border-l-2 border-[#E7E5E4] pl-3 italic">{savedNote}</p>
              <p className="text-xs text-[#A8A29E]">{NOTE_CONFIRMATION}</p>
            </>
          )}
          {showNoteInput && (
            <>
              <textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Twoje dopowiedzenie..."
                rows={2}
                className="w-full bg-white border border-[#E7E5E4] rounded-lg text-sm text-[#1C1917] placeholder-[#A8A29E] px-4 py-3 resize-none outline-none focus:border-[#A8A29E]"
              />
              <div className="flex items-center justify-between">
                <button
                  onClick={() => { onAcknowledge?.(); onClose() }}
                  className="text-sm text-[#78716C] border border-[#E7E5E4] px-4 py-1.5 rounded-full hover:border-[#A8A29E] transition-colors"
                >
                  To ma sens
                </button>
                <button
                  onClick={handleSaveNote}
                  disabled={!noteInput.trim()}
                  className="text-sm text-[#78716C] border border-[#E7E5E4] px-4 py-1.5 rounded-full hover:border-[#A8A29E] disabled:opacity-40 transition-colors"
                >
                  Zapisz →
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {(showJestOK || showRozwin) && (
        <div className="mt-6 flex gap-3 flex-wrap">
          {showJestOK && (
            <button
              onClick={() => { onAcknowledge?.(); onClose() }}
              className="text-sm text-[#78716C] border border-[#E7E5E4] px-4 py-1.5 rounded-full hover:border-[#A8A29E] transition-colors"
            >
              Jest OK
            </button>
          )}
          {showRozwin && (
            <button
              onClick={() => void handleElaborate()}
              className="text-sm text-[#78716C] border border-[#E7E5E4] px-4 py-1.5 rounded-full hover:border-[#A8A29E] transition-colors"
            >
              Rozwiń
            </button>
          )}
        </div>
      )}
    </SkyModal>
  )
}
