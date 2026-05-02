import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import FollowUpDialog from '../../../components/FollowUpDialog/FollowUpDialog'

const mockQuestions = [
  'How did you feel when that happened?',
  'What do you think about this situation?',
]

const mockOnSave = vi.fn()
const mockOnRequestMore = vi.fn().mockResolvedValue([])

function renderDialog(questions = mockQuestions) {
  return render(
    <FollowUpDialog
      initialQuestions={questions}
      onRequestMore={mockOnRequestMore}
      onSave={mockOnSave}
      isSaving={false}
    />
  )
}

describe('FollowUpDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should display the first question on render', () => {
    renderDialog()

    expect(screen.getByText(mockQuestions[0])).toBeInTheDocument()
  })

  it('should show next question when Pomiń is clicked', async () => {
    const user = userEvent.setup()
    renderDialog()

    await user.click(screen.getByRole('button', { name: /pomiń/i }))

    expect(screen.getByText(mockQuestions[1])).toBeInTheDocument()
  })

  it('should show next question when Dalej is clicked with an answer', async () => {
    const user = userEvent.setup()
    renderDialog()

    await user.type(screen.getByRole('textbox'), 'My answer')
    await user.click(screen.getByRole('button', { name: /dalej/i }))

    expect(screen.getByText(mockQuestions[1])).toBeInTheDocument()
  })

  it('should show Zapisz button after all questions are answered or skipped', async () => {
    const user = userEvent.setup()
    renderDialog()

    await user.click(screen.getByRole('button', { name: /pomiń/i }))
    await user.click(screen.getByRole('button', { name: /dalej/i }))

    expect(screen.getByRole('button', { name: /zapisz/i })).toBeInTheDocument()
  })

  it('should show Zapisz button when Wystarczy is clicked', async () => {
    const user = userEvent.setup()
    renderDialog()

    await user.click(screen.getByRole('button', { name: /wystarczy/i }))

    expect(screen.getByRole('button', { name: /zapisz/i })).toBeInTheDocument()
  })

  it('should show Zmień pytanie button when rerolls remain', () => {
    renderDialog()

    expect(screen.getByRole('button', { name: /zmień pytanie/i })).toBeInTheDocument()
  })

  it('should replace current question when Zmień pytanie is clicked', async () => {
    const user = userEvent.setup()
    const newQuestion = 'What did you really want in that moment?'
    const mockRequestMore = vi.fn().mockResolvedValue([newQuestion])
    render(
      <FollowUpDialog
        initialQuestions={mockQuestions}
        onRequestMore={mockRequestMore}
        onSave={mockOnSave}
        isSaving={false}
      />
    )

    await user.click(screen.getByRole('button', { name: /zmień pytanie/i }))

    expect(mockRequestMore).toHaveBeenCalled()
    expect(await screen.findByText(newQuestion)).toBeInTheDocument()
  })

  it('should hide Zmień pytanie button after 2 rerolls', async () => {
    const user = userEvent.setup()
    const mockRequestMore = vi.fn().mockResolvedValue(['Replacement question text here?'])
    render(
      <FollowUpDialog
        initialQuestions={mockQuestions}
        onRequestMore={mockRequestMore}
        onSave={mockOnSave}
        isSaving={false}
      />
    )

    await user.click(screen.getByRole('button', { name: /zmień pytanie/i }))
    await screen.findByText('Replacement question text here?')
    await user.click(screen.getByRole('button', { name: /zmień pytanie/i }))
    await screen.findAllByRole('button')

    expect(screen.queryByRole('button', { name: /zmień pytanie/i })).not.toBeInTheDocument()
  })

  it('should call onSave with only answered followups when Zapisz is clicked', async () => {
    const user = userEvent.setup()
    renderDialog()

    // Answer first question
    await user.type(screen.getByRole('textbox'), 'My answer')
    await user.click(screen.getByRole('button', { name: /dalej/i }))

    // Skip second question
    await user.click(screen.getByRole('button', { name: /pomiń/i }))

    // Save
    await user.click(screen.getByRole('button', { name: /zapisz/i }))

    expect(mockOnSave).toHaveBeenCalledWith([
      { question: mockQuestions[0], answer: 'My answer', order_index: 0 },
    ])
  })
})
