import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import HomePage from '../../pages/HomePage'
import { getEntries } from '../../services/entryService'

vi.mock('../../services/entryService', () => ({
  getEntries: vi.fn(),
}))

const STORAGE_KEY = 'dotflow_openai_api_key'

const mockEntry = {
  id: 'uuid-1',
  content: 'Had a tough day at work.',
  emotions: ['frustrated'],
  tags: ['work'],
  created_at: '2026-04-09T20:00:00Z',
  updated_at: '2026-04-09T20:00:00Z',
}

function renderHomePage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  )
}

describe('HomePage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    vi.mocked(getEntries).mockResolvedValue([])
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should show warning banner when no API key is set', () => {
    renderHomePage()

    expect(screen.getByText(/Add your API key in/i)).toBeInTheDocument()
  })

  it('should not show warning banner when API key is set', () => {
    localStorage.setItem(STORAGE_KEY, 'sk-testkey1234')

    renderHomePage()

    expect(screen.queryByText(/Add your API key in/i)).not.toBeInTheDocument()
  })

  it('should show Write button on Home screen', () => {
    renderHomePage()

    expect(screen.getByRole('link', { name: /write/i })).toBeInTheDocument()
  })

  it('should show empty state when no entries exist', async () => {
    vi.mocked(getEntries).mockResolvedValue([])
    renderHomePage()

    expect(await screen.findByText(/your story starts here/i)).toBeInTheDocument()
  })

  it('should show entry card content when entries exist', async () => {
    vi.mocked(getEntries).mockResolvedValue([mockEntry])
    renderHomePage()

    expect(await screen.findByText('Had a tough day at work.')).toBeInTheDocument()
  })

  it('should show error message when loading entries fails', async () => {
    vi.mocked(getEntries).mockRejectedValue(new Error('Fetch failed'))
    renderHomePage()

    expect(await screen.findByText(/failed to load entries/i)).toBeInTheDocument()
  })
})
