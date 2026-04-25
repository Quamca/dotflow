import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { generateFollowUpQuestions, findConnection, generatePatternSummary } from '../../services/aiService'
import type { Entry } from '../../types'

const mockNewEntry: Entry = {
  id: 'uuid-new',
  content: 'Another tough day at work.',
  emotions: [],
  tags: [],
  created_at: '2026-04-10T20:00:00Z',
  updated_at: '2026-04-10T20:00:00Z',
}

const mockPastEntry: Entry = {
  id: 'uuid-1',
  content: 'Had a tough day at work.',
  emotions: ['frustrated'],
  tags: ['work'],
  created_at: '2026-04-09T20:00:00Z',
  updated_at: '2026-04-09T20:00:00Z',
}

const mockQuestions = [
  'How did you feel when that happened?',
  'What do you think about this situation?',
]

function stubFetchSuccess(questions: string[]) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        choices: [{ message: { content: JSON.stringify(questions) } }],
      }),
    })
  )
}

describe('aiService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should return array of question strings when OpenAI responds successfully', async () => {
    // Arrange
    stubFetchSuccess(mockQuestions)

    // Act
    const result = await generateFollowUpQuestions('Had a tough meeting today', 'sk-testkey')

    // Assert
    expect(result).toEqual(mockQuestions)
    expect(result.length).toBeGreaterThanOrEqual(1)
    result.forEach((q) => expect(typeof q).toBe('string'))
  })

  it('should throw when OpenAI returns non-ok response', async () => {
    // Arrange
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 401 })
    )

    // Act & Assert
    await expect(
      generateFollowUpQuestions('content', 'sk-invalid')
    ).rejects.toThrow('OpenAI API error: 401')
  })

  it('should return empty array when OpenAI returns malformed JSON', async () => {
    // Arrange
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          choices: [{ message: { content: 'not valid json at all' } }],
        }),
      })
    )

    // Act
    const result = await generateFollowUpQuestions('content', 'sk-test')

    // Assert
    expect(result).toEqual([])
  })

  it('should cap questions at 3 when OpenAI returns more than 3', async () => {
    // Arrange
    stubFetchSuccess(['Q1?', 'Q2?', 'Q3?', 'Q4?', 'Q5?'])

    // Act
    const result = await generateFollowUpQuestions('content', 'sk-test')

    // Assert
    expect(result).toHaveLength(3)
  })

  describe('findConnection', () => {
    it('should return connection result when AI detects similarity', async () => {
      // Arrange
      const connectionResult = {
        connected: true,
        entry_id: 'uuid-1',
        score: 0.85,
        note: 'Similar work frustration',
      }
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue({
            choices: [{ message: { content: JSON.stringify(connectionResult) } }],
          }),
        })
      )

      // Act
      const result = await findConnection(mockNewEntry, [mockPastEntry], 'sk-test')

      // Assert
      expect(result.connected).toBe(true)
      expect(result.entry_id).toBe('uuid-1')
      expect(result.score).toBe(0.85)
    })

    it('should return fallback without throwing when API returns non-ok response', async () => {
      // Arrange
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({ ok: false, status: 401 })
      )

      // Act
      const result = await findConnection(mockNewEntry, [mockPastEntry], 'sk-invalid')

      // Assert
      expect(result.connected).toBe(false)
      expect(result.entry_id).toBeNull()
    })

    it('should return fallback when response JSON is malformed', async () => {
      // Arrange
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue({
            choices: [{ message: { content: 'not valid json' } }],
          }),
        })
      )

      // Act
      const result = await findConnection(mockNewEntry, [mockPastEntry], 'sk-test')

      // Assert
      expect(result.connected).toBe(false)
    })

    it('should return fallback and not call API when pastEntries is empty', async () => {
      // Arrange
      const fetchSpy = vi.fn()
      vi.stubGlobal('fetch', fetchSpy)

      // Act
      const result = await findConnection(mockNewEntry, [], 'sk-test')

      // Assert
      expect(result.connected).toBe(false)
      expect(fetchSpy).not.toHaveBeenCalled()
    })
  })

  describe('generatePatternSummary', () => {
    it('should return observations array when OpenAI responds successfully', async () => {
      // Arrange
      const mockObservations = [
        'You often write about work stress.',
        'Feelings of disconnection appear after social events.',
        'Your mood improves when you mention outdoor activities.',
      ]
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue({
            choices: [{ message: { content: JSON.stringify(mockObservations) } }],
          }),
        })
      )

      // Act
      const result = await generatePatternSummary([mockPastEntry], 'sk-test')

      // Assert
      expect(result).toEqual(mockObservations)
    })

    it('should throw when OpenAI returns non-ok response', async () => {
      // Arrange
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({ ok: false, status: 401 })
      )

      // Act & Assert
      await expect(
        generatePatternSummary([mockPastEntry], 'sk-invalid')
      ).rejects.toThrow('OpenAI API error: 401')
    })

    it('should return empty array when response JSON is malformed', async () => {
      // Arrange
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue({
            choices: [{ message: { content: 'not valid json' } }],
          }),
        })
      )

      // Act
      const result = await generatePatternSummary([mockPastEntry], 'sk-test')

      // Assert
      expect(result).toEqual([])
    })

    it('should cap observations at 5 when AI returns more than 5', async () => {
      // Arrange
      const tooMany = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue({
            choices: [{ message: { content: JSON.stringify(tooMany) } }],
          }),
        })
      )

      // Act
      const result = await generatePatternSummary([mockPastEntry], 'sk-test')

      // Assert
      expect(result).toHaveLength(5)
    })
  })
})
