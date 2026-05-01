import { supabase } from '../lib/supabase'
import type { Story } from '../types'
import { getStoryPosition } from '../utils/starPositions'

export async function saveStories(entryId: string, storyContents: string[]): Promise<Story[]> {
  if (storyContents.length === 0) return []

  const rows = storyContents.map((content) => {
    const id = crypto.randomUUID()
    return {
      id,
      entry_id: entryId,
      content,
      position: getStoryPosition(id),
      emotion: null,
      emotion_confidence: null,
      life_area: null,
    }
  })

  const { data, error } = await supabase.from('stories').insert(rows).select()
  if (error) throw new Error(error.message)
  return (data ?? []) as Story[]
}

export async function getStoriesForEntry(entryId: string): Promise<Story[]> {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('entry_id', entryId)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []) as Story[]
}

export async function getAllStories(): Promise<Story[]> {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as Story[]
}

export async function getRecentStories(excludeEntryId: string, limit: number): Promise<Story[]> {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .neq('entry_id', excludeEntryId)
    .order('created_at', { ascending: false })
    .limit(limit * 5)

  if (error) throw new Error(error.message)

  const stories = (data ?? []) as Story[]
  const seenEntries = new Set<string>()
  const result: Story[] = []

  for (const story of stories) {
    if (!seenEntries.has(story.entry_id)) {
      seenEntries.add(story.entry_id)
      if (seenEntries.size > limit) break
    }
    if (seenEntries.size <= limit) result.push(story)
  }

  return result
}

export async function updateStoryEmotion(
  storyId: string,
  emotion: string,
  confidence: number
): Promise<void> {
  const { error } = await supabase
    .from('stories')
    .update({ emotion, emotion_confidence: confidence })
    .eq('id', storyId)

  if (error) throw new Error(error.message)
}

export async function addElaboration(storyId: string, elaboration: string): Promise<void> {
  const { data: existing, error: fetchError } = await supabase
    .from('stories')
    .select('content')
    .eq('id', storyId)
    .single()

  if (fetchError) throw new Error(fetchError.message)

  const story = existing as { content: string }
  const updatedContent = `${story.content}\n\n[Elaboration]: ${elaboration}`

  const { error } = await supabase
    .from('stories')
    .update({ content: updatedContent })
    .eq('id', storyId)

  if (error) throw new Error(error.message)
}
