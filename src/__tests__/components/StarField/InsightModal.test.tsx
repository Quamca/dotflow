import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import InsightModal from '../../../components/StarField/InsightModal'

vi.mock('../../../services/aiService', () => ({
  elaborateInsight: vi.fn(),
}))

import { elaborateInsight } from '../../../services/aiService'

const INSIGHT_TEXT = 'Twoje zapiski wskazują na wzorzec unikania trudnych decyzji.'
const ELAB_TEXT = 'Ten wzorzec pojawia się szczególnie w sytuacjach zawodowych.'

const baseProps = {
  insight: null,
  holisticInsight: INSIGHT_TEXT,
  storyContextMessage: null,
  apiKey: 'sk-test',
  entries: [],
  onClose: vi.fn(),
  onAcknowledge: vi.fn(),
}

describe('InsightModal', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  // TC-189
  it('should show Jest OK and Rozwin buttons in initial state when not acknowledged', () => {
    render(<InsightModal {...baseProps} />)
    expect(screen.getByText('Jest OK')).toBeInTheDocument()
    expect(screen.getByText('Rozwiń')).toBeInTheDocument()
  })

  // TC-190
  it('should not show To ma sens button in initial state before elaboration', () => {
    render(<InsightModal {...baseProps} />)
    expect(screen.queryByText('To ma sens')).not.toBeInTheDocument()
  })

  // TC-191
  it('should call onAcknowledge and onClose when Jest OK clicked', () => {
    render(<InsightModal {...baseProps} />)
    fireEvent.click(screen.getByText('Jest OK'))
    expect(baseProps.onAcknowledge).toHaveBeenCalledOnce()
    expect(baseProps.onClose).toHaveBeenCalledOnce()
  })

  // TC-192
  it('should show To ma sens and hide Jest OK and Rozwin after elaboration loads', async () => {
    vi.mocked(elaborateInsight).mockResolvedValue(ELAB_TEXT)

    render(<InsightModal {...baseProps} />)
    fireEvent.click(screen.getByText('Rozwiń'))

    await waitFor(() => expect(screen.getByText(ELAB_TEXT)).toBeInTheDocument())

    expect(screen.getByText('To ma sens')).toBeInTheDocument()
    expect(screen.queryByText('Jest OK')).not.toBeInTheDocument()
    expect(screen.queryByText('Rozwiń')).not.toBeInTheDocument()
  })

  // TC-193
  it('should show textarea after Rozwin clicked and elaboration loaded', async () => {
    vi.mocked(elaborateInsight).mockResolvedValue(ELAB_TEXT)

    render(<InsightModal {...baseProps} />)
    fireEvent.click(screen.getByText('Rozwiń'))

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Twoje dopowiedzenie...')).toBeInTheDocument()
    })
  })

  // TC-194
  it('should show only Rozwin when insight is acknowledged — no Jest OK', () => {
    localStorage.setItem('dotflow_acknowledged_insight', INSIGHT_TEXT)

    render(<InsightModal {...baseProps} />)

    expect(screen.getByText('Rozwiń')).toBeInTheDocument()
    expect(screen.queryByText('Jest OK')).not.toBeInTheDocument()
    expect(screen.queryByText('To ma sens')).not.toBeInTheDocument()
  })

  // TC-195
  it('should show cached elaboration without textarea when acknowledged', () => {
    localStorage.setItem('dotflow_acknowledged_insight', INSIGHT_TEXT)
    localStorage.setItem('dotflow_elaborated_insight', JSON.stringify({ key: INSIGHT_TEXT, text: ELAB_TEXT }))

    render(<InsightModal {...baseProps} />)

    expect(screen.getByText(ELAB_TEXT)).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Twoje dopowiedzenie...')).not.toBeInTheDocument()
    expect(screen.queryByText('Rozwiń')).not.toBeInTheDocument()
  })

  // TC-196
  it('should restore cached elaboration on mount without requiring Rozwin click', () => {
    localStorage.setItem('dotflow_elaborated_insight', JSON.stringify({ key: INSIGHT_TEXT, text: ELAB_TEXT }))

    render(<InsightModal {...baseProps} />)

    expect(screen.getByText(ELAB_TEXT)).toBeInTheDocument()
    expect(screen.queryByText('Rozwiń')).not.toBeInTheDocument()
  })

  // TC-197
  it('should have Zapisz button disabled when note textarea is empty', async () => {
    vi.mocked(elaborateInsight).mockResolvedValue(ELAB_TEXT)

    render(<InsightModal {...baseProps} />)
    fireEvent.click(screen.getByText('Rozwiń'))

    await waitFor(() => expect(screen.getByText('Zapisz →')).toBeInTheDocument())
    expect(screen.getByText('Zapisz →')).toBeDisabled()
  })

  // TC-198
  it('should enable Zapisz button when note text is typed', async () => {
    vi.mocked(elaborateInsight).mockResolvedValue(ELAB_TEXT)

    render(<InsightModal {...baseProps} />)
    fireEvent.click(screen.getByText('Rozwiń'))

    await waitFor(() => expect(screen.getByPlaceholderText('Twoje dopowiedzenie...')).toBeInTheDocument())
    fireEvent.change(screen.getByPlaceholderText('Twoje dopowiedzenie...'), { target: { value: 'Moja notatka' } })

    expect(screen.getByText('Zapisz →')).not.toBeDisabled()
  })

  // TC-199
  it('should save note to dotflow_insight_note in localStorage when Zapisz clicked', async () => {
    vi.mocked(elaborateInsight).mockResolvedValue(ELAB_TEXT)

    render(<InsightModal {...baseProps} />)
    fireEvent.click(screen.getByText('Rozwiń'))

    await waitFor(() => expect(screen.getByPlaceholderText('Twoje dopowiedzenie...')).toBeInTheDocument())
    fireEvent.change(screen.getByPlaceholderText('Twoje dopowiedzenie...'), { target: { value: 'Moja notatka' } })
    fireEvent.click(screen.getByText('Zapisz →'))

    const stored = JSON.parse(localStorage.getItem('dotflow_insight_note') ?? 'null') as { key: string; note: string } | null
    expect(stored?.note).toBe('Moja notatka')
    expect(stored?.key).toBe(INSIGHT_TEXT)
  })

  // TC-200
  it('should show confirmation message after note is saved', async () => {
    vi.mocked(elaborateInsight).mockResolvedValue(ELAB_TEXT)

    render(<InsightModal {...baseProps} />)
    fireEvent.click(screen.getByText('Rozwiń'))

    await waitFor(() => expect(screen.getByPlaceholderText('Twoje dopowiedzenie...')).toBeInTheDocument())
    fireEvent.change(screen.getByPlaceholderText('Twoje dopowiedzenie...'), { target: { value: 'Moja notatka' } })
    fireEvent.click(screen.getByText('Zapisz →'))

    expect(screen.getByText('Dobrze. Twoja refleksja zostanie uwzględniona w kolejnym odkryciu.')).toBeInTheDocument()
  })

  // TC-201
  it('should call onAcknowledge and onClose after delay when note is saved', async () => {
    vi.mocked(elaborateInsight).mockResolvedValue(ELAB_TEXT)

    render(<InsightModal {...baseProps} />)
    fireEvent.click(screen.getByText('Rozwiń'))

    await waitFor(() => expect(screen.getByPlaceholderText('Twoje dopowiedzenie...')).toBeInTheDocument())

    vi.useFakeTimers()
    fireEvent.change(screen.getByPlaceholderText('Twoje dopowiedzenie...'), { target: { value: 'Moja notatka' } })
    fireEvent.click(screen.getByText('Zapisz →'))

    act(() => { vi.advanceTimersByTime(1800) })

    expect(baseProps.onAcknowledge).toHaveBeenCalledOnce()
    expect(baseProps.onClose).toHaveBeenCalledOnce()

    vi.useRealTimers()
  })

  // TC-202
  it('should call onAcknowledge and onClose when To ma sens clicked after elaboration', async () => {
    vi.mocked(elaborateInsight).mockResolvedValue(ELAB_TEXT)

    render(<InsightModal {...baseProps} />)
    fireEvent.click(screen.getByText('Rozwiń'))

    await waitFor(() => expect(screen.getByText('To ma sens')).toBeInTheDocument())
    fireEvent.click(screen.getByText('To ma sens'))

    expect(baseProps.onAcknowledge).toHaveBeenCalledOnce()
    expect(baseProps.onClose).toHaveBeenCalledOnce()
  })

  // TC-203
  it('should show saved note and confirmation on mount when note was previously saved', () => {
    const savedNote = 'Moja zapisana notatka'
    localStorage.setItem('dotflow_acknowledged_insight', INSIGHT_TEXT)
    localStorage.setItem('dotflow_elaborated_insight', JSON.stringify({ key: INSIGHT_TEXT, text: ELAB_TEXT }))
    localStorage.setItem('dotflow_insight_note', JSON.stringify({ key: INSIGHT_TEXT, note: savedNote }))

    render(<InsightModal {...baseProps} />)

    expect(screen.getByText(savedNote)).toBeInTheDocument()
    expect(screen.getByText('Dobrze. Twoja refleksja zostanie uwzględniona w kolejnym odkryciu.')).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Twoje dopowiedzenie...')).not.toBeInTheDocument()
  })

  // TC-204
  it('should show holistic insight text in the modal', () => {
    render(<InsightModal {...baseProps} />)
    expect(screen.getByText(INSIGHT_TEXT)).toBeInTheDocument()
  })

  // TC-205
  it('should show pattern observations when no holistic insight but insight array provided', () => {
    render(
      <InsightModal
        {...baseProps}
        holisticInsight={null}
        insight={['Wzorzec A', 'Wzorzec B']}
      />
    )
    expect(screen.getByText('Wzorzec A')).toBeInTheDocument()
    expect(screen.getByText('Wzorzec B')).toBeInTheDocument()
  })

  // TC-206
  it('should show fallback text when no insight content available', () => {
    render(
      <InsightModal
        {...baseProps}
        holisticInsight={null}
        insight={null}
        storyContextMessage={null}
      />
    )
    expect(screen.getByText('Pisz dalej — Twoje centrum się kształtuje.')).toBeInTheDocument()
  })
})
