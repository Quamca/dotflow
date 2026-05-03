import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useLifeAreaZones } from '../../hooks/useLifeAreaZones'

const STORAGE_KEY = 'dotflow_zone_labels'

describe('useLifeAreaZones', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getLabel', () => {
    it('should return the AI label unchanged when no custom label is set', () => {
      const { result } = renderHook(() => useLifeAreaZones())

      expect(result.current.getLabel('nowa rola')).toBe('nowa rola')
    })

    it('should return the custom label after renameZone', () => {
      const { result } = renderHook(() => useLifeAreaZones())

      act(() => {
        result.current.renameZone('nowa rola', 'awans')
      })

      expect(result.current.getLabel('nowa rola')).toBe('awans')
    })
  })

  describe('renameZone', () => {
    it('should persist custom label to localStorage', () => {
      const { result } = renderHook(() => useLifeAreaZones())

      act(() => {
        result.current.renameZone('twórczość', 'projekty')
      })

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Record<string, string>
      expect(stored['twórczość']).toBe('projekty')
    })

    it('should initialize from existing localStorage data on mount', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ 'nowa rola': 'kariera' }))

      const { result } = renderHook(() => useLifeAreaZones())

      expect(result.current.getLabel('nowa rola')).toBe('kariera')
    })
  })

  describe('clearZoneLabel', () => {
    it('should persist empty string for cleared label to localStorage', () => {
      const { result } = renderHook(() => useLifeAreaZones())

      act(() => {
        result.current.clearZoneLabel('relacje')
      })

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Record<string, string>
      expect(stored['relacje']).toBe('')
    })
  })

  describe('isLabelCleared', () => {
    it('should return false when label has not been cleared', () => {
      const { result } = renderHook(() => useLifeAreaZones())

      expect(result.current.isLabelCleared('nowa rola')).toBe(false)
    })

    it('should return true after clearZoneLabel is called', () => {
      const { result } = renderHook(() => useLifeAreaZones())

      act(() => {
        result.current.clearZoneLabel('twórczość')
      })

      expect(result.current.isLabelCleared('twórczość')).toBe(true)
    })

    it('should return false for label that has a non-empty custom name', () => {
      const { result } = renderHook(() => useLifeAreaZones())

      act(() => {
        result.current.renameZone('relacje', 'bliskie osoby')
      })

      expect(result.current.isLabelCleared('relacje')).toBe(false)
    })

    it('should return true when cleared label was initialized from localStorage', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ 'zdrowie': '' }))

      const { result } = renderHook(() => useLifeAreaZones())

      expect(result.current.isLabelCleared('zdrowie')).toBe(true)
    })
  })
})
