import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PatternSummary from '../../../components/PatternSummary/PatternSummary'

describe('PatternSummary', () => {
  it('should render observations as bullet list with heading', () => {
    // Arrange
    const observations = [
      'You often write about work stress.',
      'Feelings of disconnection appear after social events.',
    ]

    // Act
    render(<PatternSummary observations={observations} />)

    // Assert
    expect(screen.getByText('Your patterns')).toBeInTheDocument()
    expect(screen.getByText('You often write about work stress.')).toBeInTheDocument()
    expect(screen.getByText('Feelings of disconnection appear after social events.')).toBeInTheDocument()
  })

  it('should render nothing when observations array is empty', () => {
    // Arrange & Act
    const { container } = render(<PatternSummary observations={[]} />)

    // Assert
    expect(container.firstChild).toBeNull()
  })
})
