import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createEntry, getEntries, getEntryById } from '../../services/entryService'
import { supabase } from '../../lib/supabase'
import type { Entry, EntryWithFollowUps } from '../../types'

vi.mock('../../lib/supabase', () => ({
  supabase: { from: vi.fn() },
}))

const mockEntry: Entry = {
  id: 'uuid-1',
  content: 'Had a tough day at work.',
  emotions: ['frustrated'],
  tags: ['work'],
  created_at: '2026-04-09T20:00:00Z',
  updated_at: '2026-04-09T20:00:00Z',
}

const mockEntryWithFollowUps: EntryWithFollowUps = {
  ...mockEntry,
  followups: [
    {
      id: 'uuid-fu-1',
      entry_id: 'uuid-1',
      question: 'How did you feel?',
      answer: 'Frustrated.',
      order_index: 0,
      created_at: '2026-04-09T20:01:00Z',
    },
  ],
}

describe('entryService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createEntry', () => {
    it('should return a new entry when save succeeds', async () => {
      // Arrange
      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockEntry, error: null }),
          }),
        }),
      } as unknown as ReturnType<typeof supabase.from>)

      // Act
      const result = await createEntry('Had a tough day at work.')

      // Assert
      expect(result).toEqual(mockEntry)
    })

    it('should throw an error when Supabase returns an error', async () => {
      // Arrange
      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Insert failed' } }),
          }),
        }),
      } as unknown as ReturnType<typeof supabase.from>)

      // Act & Assert
      await expect(createEntry('some content')).rejects.toThrow('Insert failed')
    })
  })

  describe('getEntries', () => {
    it('should return list of entries when fetch succeeds', async () => {
      // Arrange
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: [mockEntry], error: null }),
        }),
      } as unknown as ReturnType<typeof supabase.from>)

      // Act
      const result = await getEntries()

      // Assert
      expect(result).toEqual([mockEntry])
    })

    it('should return empty array when no entries exist', async () => {
      // Arrange
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      } as unknown as ReturnType<typeof supabase.from>)

      // Act
      const result = await getEntries()

      // Assert
      expect(result).toEqual([])
    })

    it('should throw an error when Supabase returns an error', async () => {
      // Arrange
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: null, error: { message: 'Fetch failed' } }),
        }),
      } as unknown as ReturnType<typeof supabase.from>)

      // Act & Assert
      await expect(getEntries()).rejects.toThrow('Fetch failed')
    })
  })

  describe('getEntryById', () => {
    it('should return entry with follow-ups when found', async () => {
      // Arrange
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockEntryWithFollowUps, error: null }),
          }),
        }),
      } as unknown as ReturnType<typeof supabase.from>)

      // Act
      const result = await getEntryById('uuid-1')

      // Assert
      expect(result).toEqual(mockEntryWithFollowUps)
      expect(result.followups).toHaveLength(1)
    })

    it('should throw an error when entry is not found', async () => {
      // Arrange
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Entry not found' } }),
          }),
        }),
      } as unknown as ReturnType<typeof supabase.from>)

      // Act & Assert
      await expect(getEntryById('non-existent-id')).rejects.toThrow('Entry not found')
    })
  })
})
