import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import NewEntryPage from '../../pages/NewEntryPage'
import { createEntry } from '../../services/entryService'
import { generateFollowUpQuestions } from '../../services/aiService'
import { saveStories, getRecentStories } from '../../services/storyService'
import { useSettings } from '../../hooks/useSettings'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('../../services/entryService', () => ({
  createEntry: vi.fn(),
  saveFollowUps: vi.fn().mockResolvedValue(undefined),
  getEntries: vi.fn().mockResolvedValue([]),
  getEntriesWithFollowUps: vi.fn().mockResolvedValue([]),
  saveConnection: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('../../services/aiService', () => ({
  generateFollowUpQuestions: vi.fn(),
  extractStories: vi.fn().mockResolvedValue([]),
  findConnection: vi.fn().mockResolvedValue({ connected: false }),
  detectEmotionConfidence: vi.fn().mockResolvedValue({ emotion: 'mixed', confidence: 0 }),
  generateHolisticInsight: vi.fn().mockResolvedValue(''),
}))

vi.mock('../../services/storyService', () => ({
  saveStories: vi.fn().mockResolvedValue([]),
  updateStoryEmotion: vi.fn().mockResolvedValue(undefined),
  getRecentStories: vi.fn().mockResolvedValue([]),
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
    vi.mocked(saveStories).mockResolvedValue([])
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should disable Save button when textarea is empty', () => {
    renderNewEntryPage()

    expect(screen.getByRole('button', { name: /zapisz/i })).toBeDisabled()
  })

  it('should call createEntry with content when Save is clicked', async () => {
    vi.mocked(createEntry).mockResolvedValue(mockEntry)
    const user = userEvent.setup()
    renderNewEntryPage()

    await user.type(screen.getByRole('textbox'), 'Had a tough day')
    await user.click(screen.getByRole('button', { name: /zapisz/i }))

    expect(createEntry).toHaveBeenCalledWith('Had a tough day')
  })

  it('should navigate to Home after successful save when no API key', async () => {
    vi.mocked(createEntry).mockResolvedValue(mockEntry)
    const user = userEvent.setup()
    renderNewEntryPage()

    await user.type(screen.getByRole('textbox'), 'Some content')
    await user.click(screen.getByRole('button', { name: /zapisz/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('should show error message and preserve content when save fails', async () => {
    vi.mocked(createEntry).mockRejectedValue(new Error('Insert failed'))
    const user = userEvent.setup()
    renderNewEntryPage()

    await user.type(screen.getByRole('textbox'), 'My journal entry')
    await user.click(screen.getByRole('button', { name: /zapisz/i }))

    expect(await screen.findByText(/nie udało się zapisać wpisu/i)).toBeInTheDocument()
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
    await user.click(screen.getByRole('button', { name: /zapisz/i }))

    expect(await screen.findByText('How did you feel when that happened?')).toBeInTheDocument()
  })

  it('should navigate to Home without dialog when no API key is set', async () => {
    vi.mocked(createEntry).mockResolvedValue(mockEntry)
    // useSettings returns { apiKey: null } from beforeEach
    const user = userEvent.setup()
    renderNewEntryPage()

    await user.type(screen.getByRole('textbox'), 'My entry content')
    await user.click(screen.getByRole('button', { name: /zapisz/i }))

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
    await user.click(screen.getByRole('button', { name: /zapisz/i }))

    expect(await screen.findByText(/AI niedostępne/i)).toBeInTheDocument()
  })

  it('should show "Pięknie." when entry word count exceeds 300', async () => {
    // Arrange
    vi.mocked(createEntry).mockResolvedValue(mockEntry)
    vi.mocked(useSettings).mockReturnValue({
      apiKey: 'sk-testkey',
      saveApiKey: vi.fn(),
      clearApiKey: vi.fn(),
    })
    const longEntry = Array.from({ length: 301 }, (_, i) => `word${i}`).join(' ')
    const user = userEvent.setup()
    renderNewEntryPage()

    // Act
    fireEvent.change(screen.getByRole('textbox'), { target: { value: longEntry } })
    await user.click(screen.getByRole('button', { name: /zapisz/i }))

    // Assert
    expect(await screen.findByText('Pięknie.')).toBeInTheDocument()
    expect(generateFollowUpQuestions).not.toHaveBeenCalled()
  })

  it('should navigate home when "Wróć" button is clicked on Pięknie screen', async () => {
    // Arrange
    vi.mocked(createEntry).mockResolvedValue(mockEntry)
    vi.mocked(useSettings).mockReturnValue({
      apiKey: 'sk-testkey',
      saveApiKey: vi.fn(),
      clearApiKey: vi.fn(),
    })
    const longEntry = Array.from({ length: 301 }, (_, i) => `word${i}`).join(' ')
    const user = userEvent.setup()
    renderNewEntryPage()

    fireEvent.change(screen.getByRole('textbox'), { target: { value: longEntry } })
    await user.click(screen.getByRole('button', { name: /zapisz/i }))
    const backButton = await screen.findByText('Wróć →')

    // Act
    await user.click(backButton)

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('should call generateFollowUpQuestions with story context when recent stories exist', async () => {
    // Arrange
    const mockStoryForContext = {
      id: 'story-uuid-ctx',
      entry_id: 'entry-uuid-2',
      content: 'Previous story about work pressure',
      emotion: null,
      emotion_confidence: null,
      life_area: null,
      position: [1, 2, 3] as [number, number, number],
      created_at: '2026-04-30T10:00:00Z',
    }
    vi.mocked(createEntry).mockResolvedValue(mockEntry)
    vi.mocked(generateFollowUpQuestions).mockResolvedValue(['A contextual question?'])
    vi.mocked(getRecentStories).mockResolvedValue([mockStoryForContext])
    vi.mocked(useSettings).mockReturnValue({
      apiKey: 'sk-testkey',
      saveApiKey: vi.fn(),
      clearApiKey: vi.fn(),
    })
    const user = userEvent.setup()
    renderNewEntryPage()

    // Act
    await user.type(screen.getByRole('textbox'), 'Short entry text')
    await user.click(screen.getByRole('button', { name: /zapisz/i }))

    // Assert
    await waitFor(() => {
      expect(generateFollowUpQuestions).toHaveBeenCalledWith(
        'Short entry text',
        'sk-testkey',
        'Previous story about work pressure'
      )
    })
  })
})
