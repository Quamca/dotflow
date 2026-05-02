import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import ConnectionBadge from '../../../components/ConnectionBadge/ConnectionBadge'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderBadge(targetId = 'uuid-2', targetDate = '2026-04-09T20:00:00Z') {
  return render(
    <MemoryRouter>
      <ConnectionBadge targetId={targetId} targetDate={targetDate} />
    </MemoryRouter>
  )
}

describe('ConnectionBadge', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should display the formatted connected date', () => {
    renderBadge()

    expect(screen.getByText(/Połączono z/i)).toBeInTheDocument()
  })

  it('should navigate to connected entry when clicked', async () => {
    const user = userEvent.setup()
    renderBadge('uuid-2')

    await user.click(screen.getByRole('button'))

    expect(mockNavigate).toHaveBeenCalledWith('/entry/uuid-2')
  })
})
