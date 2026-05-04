import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import LifeAreaZone from '../../../components/StarField/LifeAreaZone'

vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
}))

vi.mock('@react-three/drei', () => ({
  Html: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// Suppress React DOM warnings about Three.js-specific props (position, args, depthWrite, etc.)
const originalError = console.error
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const msg = typeof args[0] === 'string' ? args[0] : ''
    if (
      msg.includes('Unknown prop') ||
      msg.includes('Invalid value for prop') ||
      msg.includes('React does not recognize') ||
      msg.includes('did not recognize')
    ) return
    originalError.call(console, ...args)
  }
})
afterAll(() => {
  console.error = originalError
})

const defaultProps = {
  label: 'praca',
  centroid: [0, 0, 0] as [number, number, number],
  radius: 2,
  emotionWeights: { joy: 0.6, sadness: 0.4 },
  isActive: true,
  isLabelCleared: false,
  onRename: vi.fn(),
  onClear: vi.fn(),
  getLabel: (l: string) => l,
  onEnter: vi.fn(),
  onLeave: vi.fn(),
  onMove: vi.fn(),
}

describe('LifeAreaZone', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => vi.restoreAllMocks())

  // TC-298–302: nebula layer generation
  describe('nebula layer generation', () => {
    it('should render 6 meshes (hit + 5 layers) when 2 emotions qualify', () => {
      // { joy: 0.6, sadness: 0.4 } → 2 × 2 layers + 1 ambient + 1 hit = 6
      const { container } = render(<LifeAreaZone {...defaultProps} />)
      expect(container.querySelectorAll('mesh')).toHaveLength(6)
    })

    it('should render 2 meshes (hit + ambient only) when emotionWeights is empty', () => {
      // {} → 0 emotion layers + 1 ambient + 1 hit = 2
      const { container } = render(<LifeAreaZone {...defaultProps} emotionWeights={{}} />)
      expect(container.querySelectorAll('mesh')).toHaveLength(2)
    })

    it('should render 4 meshes (hit + 3 layers) when single emotion qualifies', () => {
      // { joy: 1.0 } → 1 × 2 layers + 1 ambient + 1 hit = 4
      const { container } = render(
        <LifeAreaZone {...defaultProps} emotionWeights={{ joy: 1.0 }} />
      )
      expect(container.querySelectorAll('mesh')).toHaveLength(4)
    })

    it('should render 8 meshes (hit + 7 layers) when 3 emotions qualify', () => {
      // { joy: 0.5, sadness: 0.3, anger: 0.2 } → 3 × 2 + 1 ambient + 1 hit = 8
      const { container } = render(
        <LifeAreaZone {...defaultProps} emotionWeights={{ joy: 0.5, sadness: 0.3, anger: 0.2 }} />
      )
      expect(container.querySelectorAll('mesh')).toHaveLength(8)
    })

    it('should exclude emotions with weight ≤ 0.05 from layer generation', () => {
      // { joy: 0.9, fear: 0.05 } → fear excluded (not > 0.05) → 1 × 2 + 1 ambient + 1 hit = 4
      const { container } = render(
        <LifeAreaZone {...defaultProps} emotionWeights={{ joy: 0.9, fear: 0.05 }} />
      )
      expect(container.querySelectorAll('mesh')).toHaveLength(4)
    })
  })

  // TC-303–308: label visibility and editing
  describe('label behavior', () => {
    it('should not render zone label when isLabelCleared is true even when hovered', () => {
      const { container } = render(
        <LifeAreaZone {...defaultProps} isLabelCleared={true} />
      )
      const hitMesh = container.querySelectorAll('mesh')[0]
      fireEvent.pointerEnter(hitMesh)
      expect(screen.queryByText('praca')).toBeNull()
    })

    it('should render zone label after pointer enters hit mesh when isActive is true', () => {
      const { container } = render(<LifeAreaZone {...defaultProps} isActive={true} />)
      const hitMesh = container.querySelectorAll('mesh')[0]
      fireEvent.pointerEnter(hitMesh)
      expect(screen.getByText('praca')).toBeTruthy()
    })

    it('should display custom label text returned by getLabel', () => {
      const getLabel = vi.fn().mockReturnValue('zona robocza')
      const { container } = render(<LifeAreaZone {...defaultProps} getLabel={getLabel} />)
      fireEvent.pointerEnter(container.querySelectorAll('mesh')[0])
      expect(screen.getByText('zona robocza')).toBeTruthy()
    })

    it('should show edit input when label span is clicked', () => {
      const { container } = render(<LifeAreaZone {...defaultProps} />)
      fireEvent.pointerEnter(container.querySelectorAll('mesh')[0])
      fireEvent.click(screen.getByText('praca'))
      expect(screen.getByPlaceholderText('usuń lub zmień')).toBeTruthy()
    })

    it('should call onRename with trimmed text when edit form is submitted with text', () => {
      const onRename = vi.fn()
      const { container } = render(<LifeAreaZone {...defaultProps} onRename={onRename} />)
      fireEvent.pointerEnter(container.querySelectorAll('mesh')[0])
      fireEvent.click(screen.getByText('praca'))
      const input = screen.getByPlaceholderText('usuń lub zmień') as HTMLInputElement
      fireEvent.change(input, { target: { value: '  nowa praca  ' } })
      fireEvent.submit(input.closest('form')!)
      expect(onRename).toHaveBeenCalledWith('nowa praca')
    })

    it('should call onClear when edit form is submitted with empty text', () => {
      const onClear = vi.fn()
      const { container } = render(<LifeAreaZone {...defaultProps} onClear={onClear} />)
      fireEvent.pointerEnter(container.querySelectorAll('mesh')[0])
      fireEvent.click(screen.getByText('praca'))
      const input = screen.getByPlaceholderText('usuń lub zmień') as HTMLInputElement
      fireEvent.change(input, { target: { value: '' } })
      fireEvent.submit(input.closest('form')!)
      expect(onClear).toHaveBeenCalled()
    })
  })

  // TC-309: callback propagation
  describe('event callbacks', () => {
    it('should call onEnter with label when pointer enters hit mesh', () => {
      const onEnter = vi.fn()
      const { container } = render(<LifeAreaZone {...defaultProps} onEnter={onEnter} />)
      fireEvent.pointerEnter(container.querySelectorAll('mesh')[0])
      // DOM PointerEvent has no .distance (Three.js-specific) — verify label arg only
      expect(onEnter).toHaveBeenCalledOnce()
      expect(onEnter.mock.calls[0][0]).toBe('praca')
    })
  })
})
