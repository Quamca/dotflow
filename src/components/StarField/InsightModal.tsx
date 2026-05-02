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

interface ElaborationState {
  status: 'idle' | 'loading' | 'shown'
  text: string | null
  note: string
  noteSaved: boolean
}

const init: ElaborationState = { status: 'idle', text: null, note: '', noteSaved: false }

export default function InsightModal({
  insight, holisticInsight, storyContextMessage, apiKey, entries, onClose, onAcknowledge,
}: InsightModalProps) {
  const [elab, setElab] = useState<ElaborationState>(init)

  const showHolistic = !!holisticInsight
  const showPattern = !showHolistic && insight && insight.length > 0
  const showFallback = !showHolistic && !showPattern && !storyContextMessage

  const insightKey = holisticInsight ?? insight?.join('\n') ?? ''
  const isAcknowledged = !!insightKey && localStorage.getItem('dotflow_acknowledged_insight') === insightKey
  const canElaborate = (showHolistic || showPattern) && !!apiKey && !isAcknowledged

  async function handleElaborate() {
    const activeInsight = holisticInsight ?? insight?.join('. ') ?? null
    if (!activeInsight || !apiKey) return
    setElab((p) => ({ ...p, status: 'loading' }))
    try {
      const text = await elaborateInsight(activeInsight, entries, apiKey)
      setElab((p) => ({ ...p, status: 'shown', text }))
    } catch {
      setElab((p) => ({ ...p, status: 'idle' }))
    }
  }

  function handleSaveNote() {
    const stored = JSON.parse(localStorage.getItem('dotflow_insight_notes') ?? '[]') as Array<{ timestamp: string; insight: string; note: string }>
    stored.unshift({ timestamp: new Date().toISOString(), insight: holisticInsight ?? '', note: elab.note })
    localStorage.setItem('dotflow_insight_notes', JSON.stringify(stored.slice(0, 50)))
    setElab((p) => ({ ...p, noteSaved: true }))
    setTimeout(() => { onAcknowledge?.(); onClose() }, 1500)
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
            <p key={i} className="text-[#1C1917] text-base leading-relaxed pl-4 border-l-2 border-[#E7E5E4]">
              {obs}
            </p>
          ))}
        </div>
      )}

      {elab.status === 'loading' && (
        <p className="mt-6 text-[#A8A29E] text-sm italic">Szukam połączeń…</p>
      )}

      {elab.status === 'shown' && elab.text && (
        <div className="mt-6 pt-6 border-t border-[#E7E5E4] flex flex-col gap-3">
          <p className="text-[#1C1917] text-base leading-relaxed">{elab.text}</p>
          {!elab.noteSaved ? (
            <>
              <textarea
                value={elab.note}
                onChange={(e) => setElab((p) => ({ ...p, note: e.target.value }))}
                placeholder="Twoje dopowiedzenie..."
                rows={2}
                className="w-full bg-white border border-[#E7E5E4] rounded-lg text-sm text-[#1C1917] placeholder-[#A8A29E] px-4 py-3 resize-none outline-none focus:border-[#A8A29E]"
              />
              <div className="flex items-center justify-between">
                <button
                  onClick={() => { setElab(init); onAcknowledge?.(); onClose() }}
                  className="text-sm text-[#78716C] border border-[#E7E5E4] px-4 py-1.5 rounded-full hover:border-[#A8A29E] transition-colors"
                >
                  Jest OK
                </button>
                <button
                  onClick={handleSaveNote}
                  disabled={!elab.note.trim()}
                  className="text-sm text-[#78716C] border border-[#E7E5E4] px-4 py-1.5 rounded-full hover:border-[#A8A29E] disabled:opacity-40 transition-colors"
                >
                  Zapisz →
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-[#78716C]">Zapisano ✓</p>
          )}
        </div>
      )}

      {elab.status === 'idle' && canElaborate && (
        <div className="mt-6 flex gap-3 flex-wrap">
          <button
            onClick={() => { onAcknowledge?.(); onClose() }}
            className="text-sm text-[#78716C] border border-[#E7E5E4] px-4 py-1.5 rounded-full hover:border-[#A8A29E] transition-colors"
          >
            To ma sens
          </button>
          <button
            onClick={() => void handleElaborate()}
            className="text-sm text-[#78716C] border border-[#E7E5E4] px-4 py-1.5 rounded-full hover:border-[#A8A29E] transition-colors"
          >
            Rozwiń
          </button>
        </div>
      )}
    </SkyModal>
  )
}
