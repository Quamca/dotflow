import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useUserValues } from '../../hooks/useUserValues'

const CONFIRMED_KEY = 'dotflow_user_values'
const DISMISSED_KEY = 'dotflow_values_proposal_dismissed'

describe('useUserValues', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return empty confirmedValues when localStorage has no values', () => {
    const { result } = renderHook(() => useUserValues())

    expect(result.current.confirmedValues).toEqual([])
    expect(result.current.hasConfirmed).toBe(false)
  })

  it('should initialize with existing values from localStorage', () => {
    localStorage.setItem(CONFIRMED_KEY, JSON.stringify(['autonomy', 'growth']))

    const { result } = renderHook(() => useUserValues())

    expect(result.current.confirmedValues).toEqual(['autonomy', 'growth'])
    expect(result.current.hasConfirmed).toBe(true)
  })

  it('should save values to localStorage when confirmValues is called', () => {
    const { result } = renderHook(() => useUserValues())

    act(() => {
      result.current.confirmValues(['creativity', 'rest'])
    })

    expect(result.current.confirmedValues).toEqual(['creativity', 'rest'])
    expect(localStorage.getItem(CONFIRMED_KEY)).toBe(JSON.stringify(['creativity', 'rest']))
    expect(result.current.hasConfirmed).toBe(true)
  })

  it('should set proposalDismissed to true when dismissProposal is called', () => {
    const { result } = renderHook(() => useUserValues())

    expect(result.current.proposalDismissed).toBe(false)

    act(() => {
      result.current.dismissProposal()
    })

    expect(result.current.proposalDismissed).toBe(true)
    expect(localStorage.getItem(DISMISSED_KEY)).toBe('true')
  })

  it('should return proposalDismissed as true when flag is set in localStorage', () => {
    localStorage.setItem(DISMISSED_KEY, 'true')

    const { result } = renderHook(() => useUserValues())

    expect(result.current.proposalDismissed).toBe(true)
  })

  it('should clear all values and dismissal state when clearValues is called', () => {
    localStorage.setItem(CONFIRMED_KEY, JSON.stringify(['autonomy']))
    localStorage.setItem(DISMISSED_KEY, 'true')
    const { result } = renderHook(() => useUserValues())

    act(() => {
      result.current.clearValues()
    })

    expect(result.current.confirmedValues).toEqual([])
    expect(result.current.hasConfirmed).toBe(false)
    expect(result.current.proposalDismissed).toBe(false)
    expect(localStorage.getItem(CONFIRMED_KEY)).toBeNull()
    expect(localStorage.getItem(DISMISSED_KEY)).toBeNull()
  })
})
