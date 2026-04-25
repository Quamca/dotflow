import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import HomePage from '../../pages/HomePage'
import { getEntries, getConnectionsForEntry } from '../../services/entryService'
import { generatePatternSummary } from '../../services/aiService'

vi.mock('../../services/entryService', () => ({
  getEntries: vi.fn(),
  getConnectionsForEntry: vi.fn(),
}))

vi.mock('../../services/aiService', () => ({
  generatePatternSummary: vi.fn(),
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

function generateMockEntries(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    ...mockEntry,
    id: `uuid-${i + 1}`,
    content: `Entry number ${i + 1}`,
  }))
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
    vi.mocked(getConnectionsForEntry).mockResolvedValue([])
    vi.mocked(generatePatternSummary).mockResolvedValue([])
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

  it('should show connection badge when entry has a connection to another entry', async () => {
    const sourceEntry = { ...mockEntry, id: 'uuid-1' }
    const targetEntry = { ...mockEntry, id: 'uuid-2', created_at: '2026-04-01T20:00:00Z' }

    vi.mocked(getEntries).mockResolvedValue([sourceEntry, targetEntry])
    vi.mocked(getConnectionsForEntry).mockImplementation((id) => {
      if (id === 'uuid-1') {
        return Promise.resolve([{
          id: 'conn-1',
          source_entry_id: 'uuid-1',
          target_entry_id: 'uuid-2',
          similarity_score: 0.85,
          connection_note: 'Similar themes',
          created_at: '2026-04-09T21:00:00Z',
        }])
      }
      return Promise.resolve([])
    })

    renderHomePage()

    expect(await screen.findByText(/connected to/i)).toBeInTheDocument()
  })

  it('should show Generate insights button when 10 or more entries exist', async () => {
    vi.mocked(getEntries).mockResolvedValue(generateMockEntries(10))
    renderHomePage()

    expect(await screen.findByRole('button', { name: /generate insights/i })).toBeInTheDocument()
  })

  it('should not show Generate insights button when fewer than 10 entries exist', async () => {
    vi.mocked(getEntries).mockResolvedValue(generateMockEntries(9))
    renderHomePage()

    await screen.findByText('Entry number 1')

    expect(screen.queryByRole('button', { name: /generate insights/i })).not.toBeInTheDocument()
  })

  it('should show loading state when generating insights', async () => {
    vi.mocked(getEntries).mockResolvedValue(generateMockEntries(10))
    vi.mocked(generatePatternSummary).mockReturnValue(new Promise(() => {}))
    localStorage.setItem(STORAGE_KEY, 'sk-testkey')

    const user = userEvent.setup()
    renderHomePage()

    await screen.findByRole('button', { name: /generate insights/i })
    await user.click(screen.getByRole('button', { name: /generate insights/i }))

    expect(screen.getByText('Generating insights…')).toBeInTheDocument()
  })

  it('should show error message when generatePatternSummary fails', async () => {
    vi.mocked(getEntries).mockResolvedValue(generateMockEntries(10))
    vi.mocked(generatePatternSummary).mockRejectedValue(new Error('API error'))
    localStorage.setItem(STORAGE_KEY, 'sk-testkey')

    const user = userEvent.setup()
    renderHomePage()

    await screen.findByRole('button', { name: /generate insights/i })
    await user.click(screen.getByRole('button', { name: /generate insights/i }))

    expect(await screen.findByText(/failed to generate insights/i)).toBeInTheDocument()
  })

  it('should show observations when generatePatternSummary succeeds', async () => {
    vi.mocked(getEntries).mockResolvedValue(generateMockEntries(10))
    vi.mocked(generatePatternSummary).mockResolvedValue(['You often write about work stress.'])
    localStorage.setItem(STORAGE_KEY, 'sk-testkey')

    const user = userEvent.setup()
    renderHomePage()

    await screen.findByRole('button', { name: /generate insights/i })
    await user.click(screen.getByRole('button', { name: /generate insights/i }))

    expect(await screen.findByText('You often write about work stress.')).toBeInTheDocument()
  })

  it('should show info message when Generate insights clicked without API key', async () => {
    vi.mocked(getEntries).mockResolvedValue(generateMockEntries(10))

    const user = userEvent.setup()
    renderHomePage()

    await screen.findByRole('button', { name: /generate insights/i })
    await user.click(screen.getByRole('button', { name: /generate insights/i }))

    expect(screen.getByText(/set your api key in settings/i)).toBeInTheDocument()
  })
})
