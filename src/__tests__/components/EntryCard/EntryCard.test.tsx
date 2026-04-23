import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import EntryCard from '../../../components/EntryCard/EntryCard'
import type { Entry } from '../../../types'

const mockEntry: Entry = {
  id: 'uuid-1',
  content: 'Had a tough day at work.',
  emotions: ['frustrated', 'tired'],
  tags: ['work'],
  created_at: '2026-04-15T12:00:00Z',
  updated_at: '2026-04-15T12:00:00Z',
}

describe('EntryCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should display the entry content', () => {
    render(<EntryCard entry={mockEntry} onClick={vi.fn()} />)

    expect(screen.getByText('Had a tough day at work.')).toBeInTheDocument()
  })

  it('should display the formatted date', () => {
    render(<EntryCard entry={mockEntry} onClick={vi.fn()} />)

    expect(screen.getByText('April 15, 2026')).toBeInTheDocument()
  })

  it('should display emotion tags when present', () => {
    render(<EntryCard entry={mockEntry} onClick={vi.fn()} />)

    expect(screen.getByText('frustrated')).toBeInTheDocument()
    expect(screen.getByText('tired')).toBeInTheDocument()
  })

  it('should not display emotion tags when emotions array is empty', () => {
    const entry: Entry = { ...mockEntry, emotions: [] }
    render(<EntryCard entry={entry} onClick={vi.fn()} />)

    expect(screen.queryByText('frustrated')).not.toBeInTheDocument()
  })

  it('should call onClick when card is clicked', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    render(<EntryCard entry={mockEntry} onClick={handleClick} />)

    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledOnce()
  })
})
