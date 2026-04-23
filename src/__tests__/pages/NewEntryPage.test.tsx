import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import NewEntryPage from '../../pages/NewEntryPage'
import { createEntry } from '../../services/entryService'
import { generateFollowUpQuestions } from '../../services/aiService'
import { useSettings } from '../../hooks/useSettings'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('../../services/entryService', () => ({
  createEntry: vi.fn(),
  saveFollowUps: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('../../services/aiService', () => ({
  generateFollowUpQuestions: vi.fn(),
}))

vi.mock('../../hooks/useSettings', () => ({
  useSettings: vi.fn(),
}))

const mockEntry = {
  id: 'uuid-1',
  content: 'Had a tough day at work.',
  emotions: [],
  tags: [],
  created_at: '2026-04-23T10:00:00Z',
  updated_at: '2026-04-23T10:00:00Z',
}

function renderNewEntryPage() {
  return render(
    <MemoryRouter>
      <NewEntryPage />
    </MemoryRouter>
  )
}

describe('NewEntryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useSettings).mockReturnValue({
      apiKey: null,
      saveApiKey: vi.fn(),
      clearApiKey: vi.fn(),
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should disable Save button when textarea is empty', () => {
    renderNewEntryPage()

    expect(screen.getByRole('button', { name: /save/i })).toBeDisabled()
  })

  it('should call createEntry with content when Save is clicked', async () => {
    vi.mocked(createEntry).mockResolvedValue(mockEntry)
    const user = userEvent.setup()
    renderNewEntryPage()

    await user.type(screen.getByRole('textbox'), 'Had a tough day')
    await user.click(screen.getByRole('button', { name: /save/i }))

    expect(createEntry).toHaveBeenCalledWith('Had a tough day')
  })

  it('should navigate to Home after successful save when no API key', async () => {
    vi.mocked(createEntry).mockResolvedValue(mockEntry)
    const user = userEvent.setup()
    renderNewEntryPage()

    await user.type(screen.getByRole('textbox'), 'Some content')
    await user.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('should show error message and preserve content when save fails', async () => {
    vi.mocked(createEntry).mockRejectedValue(new Error('Insert failed'))
    const user = userEvent.setup()
    renderNewEntryPage()

    await user.type(screen.getByRole('textbox'), 'My journal entry')
    await user.click(screen.getByRole('button', { name: /save/i }))

    expect(await screen.findByText(/failed to save entry/i)).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveValue('My journal entry')
  })

  it('should show follow-up dialog with first question after save when API key is set', async () => {
    vi.mocked(createEntry).mockResolvedValue(mockEntry)
    vi.mocked(generateFollowUpQuestions).mockResolvedValue([
      'How did you feel when that happened?',
      'What do you think about this situation?',
    ])
    vi.mocked(useSettings).mockReturnValue({
      apiKey: 'sk-testkey',
      saveApiKey: vi.fn(),
      clearApiKey: vi.fn(),
    })
    const user = userEvent.setup()
    renderNewEntryPage()

    await user.type(screen.getByRole('textbox'), 'My entry content')
    await user.click(screen.getByRole('button', { name: /save/i }))

    expect(await screen.findByText('How did you feel when that happened?')).toBeInTheDocument()
  })

  it('should navigate to Home without dialog when no API key is set', async () => {
    vi.mocked(createEntry).mockResolvedValue(mockEntry)
    // useSettings returns { apiKey: null } from beforeEach
    const user = userEvent.setup()
    renderNewEntryPage()

    await user.type(screen.getByRole('textbox'), 'My entry content')
    await user.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'))
    expect(screen.queryByText(/a quick question/i)).not.toBeInTheDocument()
  })

  it('should show AI unavailable error when OpenAI call fails', async () => {
    vi.mocked(createEntry).mockResolvedValue(mockEntry)
    vi.mocked(generateFollowUpQuestions).mockRejectedValue(new Error('OpenAI API error: 401'))
    vi.mocked(useSettings).mockReturnValue({
      apiKey: 'sk-testkey',
      saveApiKey: vi.fn(),
      clearApiKey: vi.fn(),
    })
    const user = userEvent.setup()
    renderNewEntryPage()

    await user.type(screen.getByRole('textbox'), 'My entry content')
    await user.click(screen.getByRole('button', { name: /save/i }))

    expect(await screen.findByText(/AI questions unavailable/i)).toBeInTheDocument()
  })
})
