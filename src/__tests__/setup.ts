import { expect, afterEach, vi } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'

expect.extend(matchers)
afterEach(cleanup)

// ResizeObserver is not available in jsdom — mock it for react-three-fiber Canvas
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock StarField to avoid Three.js / WebGL rendering in jsdom
vi.mock('../components/StarField/StarField', () => ({
  default: () => null,
}))
