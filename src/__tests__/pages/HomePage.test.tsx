import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import HomePage from '../../pages/HomePage'

const STORAGE_KEY = 'dotflow_openai_api_key'

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
})
