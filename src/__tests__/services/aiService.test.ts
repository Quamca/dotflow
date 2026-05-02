import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { generateFollowUpQuestions, findConnection, generatePatternSummary, extractUserValues, respondToInsightFeedback, extractStories, detectEmotionConfidence, generateHolisticInsight, elaborateInsight } from '../../services/aiService'
import { DEEPENING_QUESTION_SYSTEM_PROMPT, CLOSING_PHRASE_SYSTEM_PROMPT } from '../../utils/prompts'
import type { Entry, EntryWithFollowUps } from '../../types'

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

  it('should include story context in user message when storyContext is provided', async () => {
    // Arrange
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        choices: [{ message: { content: '["A question?"]' } }],
      }),
    })
    vi.stubGlobal('fetch', fetchSpy)

    // Act
    await generateFollowUpQuestions('My entry today', 'sk-test', 'Past story about work')

    // Assert
    const body = JSON.parse(fetchSpy.mock.calls[0][1].body as string) as {
      messages: Array<{ role: string; content: string }>
    }
    const userMessage = body.messages[1].content
    expect(userMessage).toContain('My entry today')
    expect(userMessage).toContain('Past story about work')
    expect(userMessage).toContain('[Context from past entries]')
  })

  it('should send only entry content when storyContext is not provided', async () => {
    // Arrange
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        choices: [{ message: { content: '["A question?"]' } }],
      }),
    })
    vi.stubGlobal('fetch', fetchSpy)

    // Act
    await generateFollowUpQuestions('My entry today', 'sk-test')

    // Assert
    const body = JSON.parse(fetchSpy.mock.calls[0][1].body as string) as {
      messages: Array<{ role: string; content: string }>
    }
    const userMessage = body.messages[1].content
    expect(userMessage).toBe('My entry today')
    expect(userMessage).not.toContain('[Context from past entries]')
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

  describe('respondToInsightFeedback', () => {
    function stubFetchText(text: string) {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue({
            choices: [{ message: { content: text } }],
          }),
        })
      )
    }

    it('should return response string when round is 1 and API succeeds', async () => {
      // Arrange
      stubFetchText('Co sprawia, że to poczucie jest silne właśnie teraz?')

      // Act
      const result = await respondToInsightFeedback(['insight text'], 'user feedback', 1, 'sk-test')

      // Assert
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should return response string when round is 2 and API succeeds', async () => {
      // Arrange
      stubFetchText('To, co opisujesz, brzmi jak coś wartego zapisania.')

      // Act
      const result = await respondToInsightFeedback(['insight text'], 'my response', 2, 'sk-test')

      // Assert
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should throw when OpenAI returns non-ok response', async () => {
      // Arrange
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({ ok: false, status: 401 })
      )

      // Act & Assert
      await expect(
        respondToInsightFeedback(['insight'], 'feedback', 1, 'sk-invalid')
      ).rejects.toThrow('OpenAI API error: 401')
    })

    it('should use DEEPENING_QUESTION_SYSTEM_PROMPT for round 1', async () => {
      // Arrange
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          choices: [{ message: { content: 'Deepening question?' } }],
        }),
      })
      vi.stubGlobal('fetch', fetchMock)

      // Act
      await respondToInsightFeedback(['insight'], 'feedback', 1, 'sk-test')

      // Assert
      const body = JSON.parse(fetchMock.mock.calls[0][1].body as string) as { messages: Array<{ role: string; content: string }> }
      expect(body.messages[0].content).toBe(DEEPENING_QUESTION_SYSTEM_PROMPT)
    })

    it('should use CLOSING_PHRASE_SYSTEM_PROMPT for round 2', async () => {
      // Arrange
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          choices: [{ message: { content: 'Closing phrase.' } }],
        }),
      })
      vi.stubGlobal('fetch', fetchMock)

      // Act
      await respondToInsightFeedback(['insight'], 'my response', 2, 'sk-test')

      // Assert
      const body = JSON.parse(fetchMock.mock.calls[0][1].body as string) as { messages: Array<{ role: string; content: string }> }
      expect(body.messages[0].content).toBe(CLOSING_PHRASE_SYSTEM_PROMPT)
    })

    it('should return empty string when response content is missing', async () => {
      // Arrange
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue({
            choices: [{ message: { content: null } }],
          }),
        })
      )

      // Act
      const result = await respondToInsightFeedback(['insight'], 'feedback', 1, 'sk-test')

      // Assert
      expect(result).toBe('')
    })
  })

  describe('extractUserValues', () => {
    it('should return array of theme strings when OpenAI responds successfully', async () => {
      // Arrange
      const mockThemes = ['autonomy', 'relationships', 'growth', 'creativity', 'rest']
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue({
            choices: [{ message: { content: JSON.stringify(mockThemes) } }],
          }),
        })
      )

      // Act
      const result = await extractUserValues([mockPastEntry], 'sk-test')

      // Assert
      expect(result).toEqual(mockThemes)
      result.forEach((t) => expect(typeof t).toBe('string'))
    })

    it('should throw when OpenAI returns non-ok response', async () => {
      // Arrange
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({ ok: false, status: 401 })
      )

      // Act & Assert
      await expect(
        extractUserValues([mockPastEntry], 'sk-invalid')
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
      const result = await extractUserValues([mockPastEntry], 'sk-test')

      // Assert
      expect(result).toEqual([])
    })

    it('should cap themes at 5 when AI returns more than 5', async () => {
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
      const result = await extractUserValues([mockPastEntry], 'sk-test')

      // Assert
      expect(result).toHaveLength(5)
    })
  })

  describe('extractStories', () => {
    const sampleContent = 'Rano miałem spotkanie. Wieczorem poszedłem na spacer.'

    it('should return array of story strings when OpenAI responds successfully', async () => {
      // Arrange
      const mockStories = ['Rano miałem spotkanie.', 'Wieczorem poszedłem na spacer.']
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue({
            choices: [{ message: { content: JSON.stringify(mockStories) } }],
          }),
        })
      )

      // Act
      const result = await extractStories(sampleContent, 'sk-test')

      // Assert
      expect(result).toEqual(mockStories)
      result.forEach((s) => expect(typeof s).toBe('string'))
    })

    it('should return fallback [content] when OpenAI returns non-ok response', async () => {
      // Arrange
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({ ok: false, status: 401 })
      )

      // Act
      const result = await extractStories(sampleContent, 'sk-invalid')

      // Assert
      expect(result).toEqual([sampleContent])
    })

    it('should return fallback [content] when response JSON is malformed', async () => {
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
      const result = await extractStories(sampleContent, 'sk-test')

      // Assert
      expect(result).toEqual([sampleContent])
    })

    it('should return fallback [content] when fetch throws', async () => {
      // Arrange
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))

      // Act
      const result = await extractStories(sampleContent, 'sk-test')

      // Assert
      expect(result).toEqual([sampleContent])
    })

    it('should return fallback [content] when AI returns empty array', async () => {
      // Arrange
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue({
            choices: [{ message: { content: '[]' } }],
          }),
        })
      )

      // Act
      const result = await extractStories(sampleContent, 'sk-test')

      // Assert
      expect(result).toEqual([sampleContent])
    })

    it('should cap stories at 5 when AI returns more than 5', async () => {
      // Arrange
      const tooMany = ['S1 long enough story text here.', 'S2 long enough story text here.', 'S3 long enough story text here.', 'S4 long enough story text here.', 'S5 long enough story text here.', 'S6 long enough story text here.']
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
      const result = await extractStories(sampleContent, 'sk-test')

      // Assert
      expect(result).toHaveLength(5)
    })

    it('should filter out stories shorter than 10 characters', async () => {
      // Arrange
      const withShort = ['Hi.', 'This story is long enough to pass the filter.']
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue({
            choices: [{ message: { content: JSON.stringify(withShort) } }],
          }),
        })
      )

      // Act
      const result = await extractStories(sampleContent, 'sk-test')

      // Assert
      expect(result).toHaveLength(1)
      expect(result[0]).toBe('This story is long enough to pass the filter.')
    })
  })

  describe('detectEmotionConfidence', () => {
    const storyContent = 'Dzisiaj byłem na spacerze i poczułem wielki spokój.'

    it('should return emotion and confidence when API responds with valid JSON', async () => {
      // Arrange
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue({
            choices: [{ message: { content: JSON.stringify({ emotion: 'calm', confidence: 0.92 }) } }],
          }),
        })
      )

      // Act
      const result = await detectEmotionConfidence(storyContent, 'sk-test')

      // Assert
      expect(result.emotion).toBe('calm')
      expect(result.confidence).toBe(0.92)
    })

    it('should return fallback {emotion:mixed, confidence:0} when API returns non-ok response', async () => {
      // Arrange
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({ ok: false, status: 401 })
      )

      // Act
      const result = await detectEmotionConfidence(storyContent, 'sk-invalid')

      // Assert
      expect(result).toEqual({ emotion: 'mixed', confidence: 0 })
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
      const result = await detectEmotionConfidence(storyContent, 'sk-test')

      // Assert
      expect(result).toEqual({ emotion: 'mixed', confidence: 0 })
    })

    it('should return fallback when fetch throws a network error', async () => {
      // Arrange
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))

      // Act
      const result = await detectEmotionConfidence(storyContent, 'sk-test')

      // Assert
      expect(result).toEqual({ emotion: 'mixed', confidence: 0 })
    })
  })

  describe('generateHolisticInsight', () => {
    const mockEntriesWithFollowUps: EntryWithFollowUps[] = [
      {
        ...mockPastEntry,
        followups: [{ id: 'fu-1', entry_id: 'uuid-1', question: 'Q?', answer: 'A', order_index: 0, created_at: '2026-04-09T20:01:00Z' }],
      },
    ]

    it('should return insight string when API responds successfully', async () => {
      // Arrange
      const insightText = 'Across your entries, moments of tension appear before breakthroughs.'
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue({
            choices: [{ message: { content: insightText } }],
          }),
        })
      )

      // Act
      const result = await generateHolisticInsight(mockEntriesWithFollowUps, 'sk-test')

      // Assert
      expect(result).toBe(insightText)
    })

    it('should throw when OpenAI returns non-ok response', async () => {
      // Arrange
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 401 }))

      // Act & Assert
      await expect(
        generateHolisticInsight(mockEntriesWithFollowUps, 'sk-invalid')
      ).rejects.toThrow('OpenAI API error: 401')
    })

    it('should return empty string when response content is missing', async () => {
      // Arrange
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue({ choices: [{ message: { content: null } }] }),
        })
      )

      // Act
      const result = await generateHolisticInsight(mockEntriesWithFollowUps, 'sk-test')

      // Assert
      expect(result).toBe('')
    })

    // TC-207
    it('should include previousNote in user message when provided', async () => {
      // Arrange
      const fetchSpy = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ choices: [{ message: { content: 'Insight.' } }] }),
      })
      vi.stubGlobal('fetch', fetchSpy)

      // Act
      await generateHolisticInsight(mockEntriesWithFollowUps, 'sk-test', 'Moja refleksja na temat poprzedniego wglądu')

      // Assert
      const body = JSON.parse((fetchSpy.mock.calls[0][1] as RequestInit).body as string) as { messages: Array<{ role: string; content: string }> }
      const userMessage = body.messages.find((m) => m.role === 'user')?.content ?? ''
      expect(userMessage).toContain('Moja refleksja na temat poprzedniego wglądu')
      expect(userMessage).toContain("User's reflection on the previous insight")
    })

    // TC-208
    it('should not include previousNote section in user message when note is undefined', async () => {
      // Arrange
      const fetchSpy = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ choices: [{ message: { content: 'Insight.' } }] }),
      })
      vi.stubGlobal('fetch', fetchSpy)

      // Act
      await generateHolisticInsight(mockEntriesWithFollowUps, 'sk-test')

      // Assert
      const body = JSON.parse((fetchSpy.mock.calls[0][1] as RequestInit).body as string) as { messages: Array<{ role: string; content: string }> }
      const userMessage = body.messages.find((m) => m.role === 'user')?.content ?? ''
      expect(userMessage).not.toContain("User's reflection")
    })
  })

  describe('elaborateInsight', () => {
    it('should return elaboration string when API responds successfully', async () => {
      // Arrange
      const elaborationText = 'W Twoich zapiskach kilka razy pojawił się podobny moment wątpliwości.'
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue({
            choices: [{ message: { content: elaborationText } }],
          }),
        })
      )

      // Act
      const result = await elaborateInsight('Across your entries...', [mockPastEntry], 'sk-test')

      // Assert
      expect(result).toBe(elaborationText)
    })

    it('should throw when OpenAI returns non-ok response', async () => {
      // Arrange
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

      // Act & Assert
      await expect(
        elaborateInsight('some insight', [mockPastEntry], 'sk-invalid')
      ).rejects.toThrow('OpenAI API error: 500')
    })

    it('should return empty string when response content is missing', async () => {
      // Arrange
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: vi.fn().mockResolvedValue({ choices: [{ message: { content: null } }] }),
        })
      )

      // Act
      const result = await elaborateInsight('some insight', [mockPastEntry], 'sk-test')

      // Assert
      expect(result).toBe('')
    })
  })
})
