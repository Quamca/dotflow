import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import EntryDetailPage from '../../pages/EntryDetailPage'
import { getEntryById } from '../../services/entryService'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('../../services/entryService', () => ({
  getEntryById: vi.fn(),
}))

const mockEntry = {
  id: 'uuid-1',
  content: 'Had a tough day at work.',
  emotions: ['frustrated'],
  tags: ['work'],
  created_at: '2026-04-09T20:00:00Z',
  updated_at: '2026-04-09T20:00:00Z',
  followups: [
    {
      id: 'fu-1',
      entry_id: 'uuid-1',
      question: 'How did you feel?',
      answer: 'Very frustrated.',
      order_index: 0,
      created_at: '2026-04-09T20:01:00Z',
    },
    {
      id: 'fu-2',
      entry_id: 'uuid-1',
      question: 'What will you do next?',
      answer: null,
      order_index: 1,
      created_at: '2026-04-09T20:02:00Z',
    },
  ],
}

function renderDetailPage(id = 'uuid-1') {
  return render(
    <MemoryRouter initialEntries={[`/entry/${id}`]}>
      <Routes>
        <Route path="/entry/:id" element={<EntryDetailPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('EntryDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should display entry content after loading', async () => {
    vi.mocked(getEntryById).mockResolvedValue(mockEntry)
    renderDetailPage()

    expect(await screen.findByText('Had a tough day at work.')).toBeInTheDocument()
  })

  it('should display only answered follow-ups and hide skipped ones', async () => {
    vi.mocked(getEntryById).mockResolvedValue(mockEntry)
    renderDetailPage()

    expect(await screen.findByText('How did you feel?')).toBeInTheDocument()
    expect(screen.getByText('Very frustrated.')).toBeInTheDocument()
    expect(screen.queryByText('What will you do next?')).not.toBeInTheDocument()
  })

  it('should show error message when entry is not found', async () => {
    vi.mocked(getEntryById).mockRejectedValue(new Error('Entry not found'))
    renderDetailPage('non-existent')

    expect(await screen.findByText(/entry not found/i)).toBeInTheDocument()
  })

  it('should navigate to home when Back button is clicked', async () => {
    vi.mocked(getEntryById).mockResolvedValue(mockEntry)
    const user = userEvent.setup()
    renderDetailPage()

    await screen.findByText('Had a tough day at work.')
    await user.click(screen.getByRole('button', { name: /back/i }))

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})
