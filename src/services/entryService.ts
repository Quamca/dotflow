import { supabase } from '../lib/supabase'
import type { Entry, EntryWithFollowUps } from '../types'

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
