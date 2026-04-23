import { supabase } from '../lib/supabase'
import type { Entry, EntryWithFollowUps, FollowUpInput } from '../types'

export async function createEntry(content: string): Promise<Entry> {
  const { data, error } = await supabase
    .from('entries')
    .insert({ content, emotions: [], tags: [] })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Entry
}

export async function getEntries(): Promise<Entry[]> {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as Entry[]
}

export async function getEntryById(id: string): Promise<EntryWithFollowUps> {
  const { data, error } = await supabase
    .from('entries')
    .select('*, followups(*)')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data as EntryWithFollowUps
}

export async function saveFollowUps(
  entryId: string,
  followups: FollowUpInput[]
): Promise<void> {
  if (followups.length === 0) return

  const rows = followups.map((fu) => ({
    entry_id: entryId,
    question: fu.question,
    answer: fu.answer,
    order_index: fu.order_index,
  }))

  const { error } = await supabase.from('followups').insert(rows)
  if (error) throw new Error(error.message)
}
