import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import SkyModal from '../../../components/StarField/SkyModal'

describe('SkyModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render children inside the modal', () => {
    render(<SkyModal onClose={vi.fn()}><p>Modal content</p></SkyModal>)
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('should call onClose when the X button is clicked', () => {
    const onClose = vi.fn()
    render(<SkyModal onClose={onClose}><p>Content</p></SkyModal>)
    fireEvent.click(screen.getByLabelText('Zamknij'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('should call onClose when the backdrop is clicked', () => {
    const onClose = vi.fn()
    const { container } = render(<SkyModal onClose={onClose}><p>Content</p></SkyModal>)
    fireEvent.click(container.firstChild as Element)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('should not call onClose when clicking inside the modal content', () => {
    const onClose = vi.fn()
    render(<SkyModal onClose={onClose}><p>Content</p></SkyModal>)
    fireEvent.click(screen.getByText('Content'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('should call onClose when Escape key is pressed', () => {
    const onClose = vi.fn()
    render(<SkyModal onClose={onClose}><p>Content</p></SkyModal>)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('should render footer when provided', () => {
    render(
      <SkyModal onClose={vi.fn()} footer={<button>Footer action</button>}>
        <p>Content</p>
      </SkyModal>
    )
    expect(screen.getByText('Footer action')).toBeInTheDocument()
  })

  it('should not render footer section when footer prop is not provided', () => {
    render(<SkyModal onClose={vi.fn()}><p>Content</p></SkyModal>)
    expect(screen.queryByText('Footer action')).not.toBeInTheDocument()
  })
})
