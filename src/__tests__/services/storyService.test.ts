import { describe, it, expect, vi, beforeEach } from 'vitest'
import { saveStories, getStoriesForEntry, getAllStories, addElaboration } from '../../services/storyService'
import { supabase } from '../../lib/supabase'
import type { Story } from '../../types'

vi.mock('../../lib/supabase', () => ({
  supabase: { from: vi.fn() },
}))

vi.mock('../../utils/starPositions', () => ({
  getStoryPosition: vi.fn(() => [1.0, 2.0, 3.0] as [number, number, number]),
}))

const mockStory: Story = {
  id: 'story-uuid-1',
  entry_id: 'entry-uuid-1',
  content: 'Rano miałem spotkanie z klientem.',
  emotion: null,
  emotion_confidence: null,
  life_area: null,
  position: [1.0, 2.0, 3.0],
  created_at: '2026-04-28T10:00:00Z',
}

describe('storyService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('saveStories', () => {
    it('should return empty array when given empty content array', async () => {
      const result = await saveStories('entry-uuid-1', [])

      expect(result).toEqual([])
      expect(supabase.from).not.toHaveBeenCalled()
    })

    it('should call Supabase insert with correct entry_id and content', async () => {
      const insertMock = vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({ data: [mockStory], error: null }),
      })
      vi.mocked(supabase.from).mockReturnValue({ insert: insertMock } as ReturnType<typeof supabase.from>)

      await saveStories('entry-uuid-1', ['Rano miałem spotkanie z klientem.'])

      expect(supabase.from).toHaveBeenCalledWith('stories')
      const insertedRows = insertMock.mock.calls[0][0] as Array<{ entry_id: string; content: string }>
      expect(insertedRows[0].entry_id).toBe('entry-uuid-1')
      expect(insertedRows[0].content).toBe('Rano miałem spotkanie z klientem.')
    })

    it('should return saved stories array when Supabase insert succeeds', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({ data: [mockStory], error: null }),
        }),
      } as ReturnType<typeof supabase.from>)

      const result = await saveStories('entry-uuid-1', ['Rano miałem spotkanie z klientem.'])

      expect(result).toHaveLength(1)
      expect(result[0].content).toBe('Rano miałem spotkanie z klientem.')
    })

    it('should throw when Supabase returns error', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({ data: null, error: { message: 'Insert failed' } }),
        }),
      } as ReturnType<typeof supabase.from>)

      await expect(
        saveStories('entry-uuid-1', ['Some content here for story.'])
      ).rejects.toThrow('Insert failed')
    })
  })

  describe('getStoriesForEntry', () => {
    it('should return stories array when Supabase query succeeds', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: [mockStory], error: null }),
          }),
        }),
      } as ReturnType<typeof supabase.from>)

      const result = await getStoriesForEntry('entry-uuid-1')

      expect(result).toHaveLength(1)
      expect(result[0].entry_id).toBe('entry-uuid-1')
    })

    it('should return empty array when no stories found', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      } as ReturnType<typeof supabase.from>)

      const result = await getStoriesForEntry('entry-uuid-1')

      expect(result).toEqual([])
    })

    it('should throw when Supabase returns error', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: null, error: { message: 'Fetch failed' } }),
          }),
        }),
      } as ReturnType<typeof supabase.from>)

      await expect(getStoriesForEntry('entry-uuid-1')).rejects.toThrow('Fetch failed')
    })
  })

  describe('getAllStories', () => {
    it('should return all stories ordered by created_at descending', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: [mockStory], error: null }),
        }),
      } as ReturnType<typeof supabase.from>)

      const result = await getAllStories()

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('story-uuid-1')
    })

    it('should return empty array when no stories exist', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      } as ReturnType<typeof supabase.from>)

      const result = await getAllStories()

      expect(result).toEqual([])
    })
  })

  describe('addElaboration', () => {
    it('should append elaboration text to existing story content', async () => {
      const updateMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      })
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { content: 'Rano miałem spotkanie.' },
              error: null,
            }),
          }),
        }),
      } as ReturnType<typeof supabase.from>)
      vi.mocked(supabase.from).mockReturnValueOnce({
        update: updateMock,
      } as ReturnType<typeof supabase.from>)

      await addElaboration('story-uuid-1', 'To było stresujące.')

      const updateArg = updateMock.mock.calls[0][0] as { content: string }
      expect(updateArg.content).toContain('Rano miałem spotkanie.')
      expect(updateArg.content).toContain('To było stresujące.')
      expect(updateArg.content).toContain('[Elaboration]')
    })

    it('should throw when Supabase fetch returns error', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Not found' },
            }),
          }),
        }),
      } as ReturnType<typeof supabase.from>)

      await expect(
        addElaboration('story-uuid-1', 'elaboration text here')
      ).rejects.toThrow('Not found')
    })
  })
})
