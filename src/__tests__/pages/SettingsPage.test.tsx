import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import SettingsPage from '../../pages/SettingsPage'

const STORAGE_KEY = 'dotflow_openai_api_key'

function renderSettingsPage() {
  return render(
    <MemoryRouter>
      <SettingsPage />
    </MemoryRouter>
  )
}

describe('SettingsPage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should save API key and show masked key when Save is clicked', async () => {
    const user = userEvent.setup()
    renderSettingsPage()

    await user.type(screen.getByPlaceholderText('sk-...'), 'sk-testkey1234')
    await user.click(screen.getByRole('button', { name: /save/i }))

    expect(screen.getByText('sk-...1234')).toBeInTheDocument()
    expect(localStorage.getItem(STORAGE_KEY)).toBe('sk-testkey1234')
  })

  it('should clear API key and show input field when Clear is clicked', async () => {
    const user = userEvent.setup()
    localStorage.setItem(STORAGE_KEY, 'sk-testkey1234')
    renderSettingsPage()

    await user.click(screen.getByRole('button', { name: /clear/i }))

    expect(screen.getByPlaceholderText('sk-...')).toBeInTheDocument()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})
