import { useState, useCallback } from 'react'

const ZONE_LABELS_KEY = 'dotflow_zone_labels'

export function useLifeAreaZones() {
  const [customLabels, setCustomLabels] = useState<Record<string, string>>(() => {
    try {
      const raw = localStorage.getItem(ZONE_LABELS_KEY)
      return raw ? (JSON.parse(raw) as Record<string, string>) : {}
    } catch {
      return {}
    }
  })

  const getLabel = useCallback(
    (aiLabel: string): string => customLabels[aiLabel] ?? aiLabel,
    [customLabels]
  )

  const renameZone = useCallback((aiLabel: string, newLabel: string) => {
    setCustomLabels((prev) => {
      const next = { ...prev, [aiLabel]: newLabel }
      localStorage.setItem(ZONE_LABELS_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const clearZoneLabel = useCallback((aiLabel: string) => {
    setCustomLabels((prev) => {
      const next = { ...prev }
      delete next[aiLabel]
      localStorage.setItem(ZONE_LABELS_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const isLabelCleared = useCallback(
    (aiLabel: string): boolean => aiLabel in customLabels && customLabels[aiLabel] === '',
    [customLabels]
  )

  return { getLabel, renameZone, clearZoneLabel, isLabelCleared, customLabels }
}
