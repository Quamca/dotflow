import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import NewEntryPage from '../../pages/NewEntryPage'
import { createEntry } from '../../services/entryService'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('../../services/entryService', () => ({
  createEntry: vi.fn(),
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

  it('should navigate to Home after successful save', async () => {
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
})
