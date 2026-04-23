import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { generateFollowUpQuestions } from '../../services/aiService'

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
})
