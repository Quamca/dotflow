export interface Entry {
  id: string
  content: string
  emotions: string[]
  tags: string[]
  created_at: string
  updated_at: string
}

export interface FollowUp {
  id: string
  entry_id: string
  question: string
  answer: string | null
  order_index: number
  created_at: string
}

export interface Connection {
  id: string
  source_entry_id: string
  target_entry_id: string
  similarity_score: number
  connection_note: string | null
  created_at: string
}

export interface EntryWithFollowUps extends Entry {
  followups: FollowUp[]
}

export interface FollowUpInput {
  question: string
  answer: string | null
  order_index: number
}
