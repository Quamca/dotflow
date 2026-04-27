import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ValuesModal from '../../../components/ValuesModal/ValuesModal'

const mockProposedThemes = ['autonomy', 'relationships', 'growth', 'creativity', 'rest']

function renderModal(overrides?: Partial<Parameters<typeof ValuesModal>[0]>) {
  const onConfirm = vi.fn()
  const onDismiss = vi.fn()
  render(
    <ValuesModal
      proposedThemes={mockProposedThemes}
      onConfirm={onConfirm}
      onDismiss={onDismiss}
      {...overrides}
    />
  )
  return { onConfirm, onDismiss }
}

describe('ValuesModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should display proposed themes in the list', () => {
    renderModal()

    expect(screen.getByText('autonomy')).toBeInTheDocument()
    expect(screen.getByText('growth')).toBeInTheDocument()
    expect(screen.getByText('rest')).toBeInTheDocument()
  })

  it('should display observational framing heading', () => {
    renderModal()

    expect(screen.getByText(/W Twoich wpisach te tematy wracają najczęściej/i)).toBeInTheDocument()
  })

  it('should call onDismiss when Pomiń button is clicked', async () => {
    const user = userEvent.setup()
    const { onDismiss } = renderModal()

    await user.click(screen.getByRole('button', { name: /pomiń/i }))

    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('should call onConfirm with original themes when Zatwierdź is clicked', async () => {
    const user = userEvent.setup()
    const { onConfirm } = renderModal()

    await user.click(screen.getByRole('button', { name: /zatwierdź/i }))

    expect(onConfirm).toHaveBeenCalledWith(mockProposedThemes)
  })

  it('should remove a theme from list when × button is clicked', async () => {
    const user = userEvent.setup()
    const { onConfirm } = renderModal()

    const removeButtons = screen.getAllByRole('button', { name: '×' })
    await user.click(removeButtons[0])

    await user.click(screen.getByRole('button', { name: /zatwierdź/i }))

    const confirmed = (onConfirm.mock.calls[0] as [string[]])[0]
    expect(confirmed).not.toContain('autonomy')
    expect(confirmed).toContain('relationships')
  })

  it('should show textarea when Żadna z tych checkbox is checked', async () => {
    const user = userEvent.setup()
    renderModal()

    expect(screen.queryByPlaceholderText(/wpisz swoje tematy/i)).not.toBeInTheDocument()

    await user.click(screen.getByRole('checkbox'))

    expect(screen.getByPlaceholderText(/wpisz swoje tematy/i)).toBeInTheDocument()
  })

  it('should call onConfirm with custom themes when Żadna z tych is selected and text is typed', async () => {
    const user = userEvent.setup()
    const { onConfirm } = renderModal()

    await user.click(screen.getByRole('checkbox'))
    await user.type(screen.getByPlaceholderText(/wpisz swoje tematy/i), 'praca, rodzina, zdrowie')

    await user.click(screen.getByRole('button', { name: /zatwierdź/i }))

    expect(onConfirm).toHaveBeenCalledWith(['praca', 'rodzina', 'zdrowie'])
  })
})
