import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useSettings } from '../../hooks/useSettings'

const STORAGE_KEY = 'dotflow_openai_api_key'

describe('useSettings', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return null when no API key is stored', () => {
    const { result } = renderHook(() => useSettings())

    expect(result.current.apiKey).toBeNull()
  })

  it('should initialize with existing key from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, 'sk-existingkey')

    const { result } = renderHook(() => useSettings())

    expect(result.current.apiKey).toBe('sk-existingkey')
  })

  it('should save API key to localStorage when saveApiKey is called', () => {
    const { result } = renderHook(() => useSettings())

    act(() => {
      result.current.saveApiKey('sk-testkey1234')
    })

    expect(result.current.apiKey).toBe('sk-testkey1234')
    expect(localStorage.getItem(STORAGE_KEY)).toBe('sk-testkey1234')
  })

  it('should clear API key from localStorage when clearApiKey is called', () => {
    localStorage.setItem(STORAGE_KEY, 'sk-testkey1234')
    const { result } = renderHook(() => useSettings())

    act(() => {
      result.current.clearApiKey()
    })

    expect(result.current.apiKey).toBeNull()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})
