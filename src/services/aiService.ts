import { FOLLOW_UP_SYSTEM_PROMPT, CONNECTION_DETECTION_SYSTEM_PROMPT, PATTERN_SUMMARY_SYSTEM_PROMPT, USER_VALUES_SYSTEM_PROMPT, DEEPENING_QUESTION_SYSTEM_PROMPT, CLOSING_PHRASE_SYSTEM_PROMPT, STORY_EXTRACTION_SYSTEM_PROMPT } from '../utils/prompts'
import type { Entry, ConnectionResult } from '../types'

export async function generateFollowUpQuestions(
  content: string,
  apiKey: string
): Promise<string[]> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: FOLLOW_UP_SYSTEM_PROMPT },
        { role: 'user', content },
      ],
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`)
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>
  }
  const text = data.choices[0]?.message?.content ?? '[]'

  try {
    const parsed = JSON.parse(text) as unknown
    if (Array.isArray(parsed)) {
      return (parsed as string[]).slice(0, 3).filter((q) => typeof q === 'string' && q.length > 0)
    }
    return []
  } catch {
    return []
  }
}

export async function generatePatternSummary(
  entries: Entry[],
  apiKey: string
): Promise<string[]> {
  const userMessage = JSON.stringify(
    entries.slice(0, 10).map((e) => ({
      content: e.content,
      created_at: e.created_at,
    }))
  )

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: PATTERN_SUMMARY_SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.5,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`)
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>
  }
  const text = data.choices[0]?.message?.content ?? '[]'

  try {
    const parsed = JSON.parse(text) as unknown
    if (Array.isArray(parsed)) {
      return (parsed as string[])
        .filter((obs) => typeof obs === 'string' && obs.length > 0)
        .slice(0, 5)
    }
    return []
  } catch {
    return []
  }
}

export async function extractUserValues(
  entries: Entry[],
  apiKey: string
): Promise<string[]> {
  const userMessage = JSON.stringify(
    entries.slice(0, 20).map((e) => ({
      content: e.content,
      created_at: e.created_at,
    }))
  )

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: USER_VALUES_SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.4,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`)
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>
  }
  const text = data.choices[0]?.message?.content ?? '[]'

  try {
    const parsed = JSON.parse(text) as unknown
    if (Array.isArray(parsed)) {
      return (parsed as string[])
        .filter((t) => typeof t === 'string' && t.length > 0)
        .slice(0, 5)
    }
    return []
  } catch {
    return []
  }
}

export async function respondToInsightFeedback(
  insight: string[],
  userFeedback: string,
  round: 1 | 2,
  apiKey: string
): Promise<string> {
  const systemPrompt = round === 1 ? DEEPENING_QUESTION_SYSTEM_PROMPT : CLOSING_PHRASE_SYSTEM_PROMPT
  const userMessage = round === 1
    ? `Insight: ${insight.join(' ')}\n\nUser feedback: ${userFeedback}`
    : `User's most recent message: ${userFeedback}`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`)
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>
  }
  return data.choices[0]?.message?.content?.trim() ?? ''
}

export async function extractStories(
  content: string,
  apiKey: string
): Promise<string[]> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: STORY_EXTRACTION_SYSTEM_PROMPT },
          { role: 'user', content },
        ],
        temperature: 0.3,
      }),
    })

    if (!response.ok) return [content]

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>
    }
    const text = data.choices[0]?.message?.content ?? '[]'

    const parsed = JSON.parse(text) as unknown
    if (Array.isArray(parsed)) {
      const stories = (parsed as string[])
        .filter((s) => typeof s === 'string' && s.trim().length >= 10)
        .slice(0, 5)
      return stories.length > 0 ? stories : [content]
    }
    return [content]
  } catch {
    return [content]
  }
}

export async function findConnection(
  newEntry: Entry,
  pastEntries: Entry[],
  apiKey: string
): Promise<ConnectionResult> {
  const fallback: ConnectionResult = { connected: false, entry_id: null, score: 0, note: '' }
  if (pastEntries.length === 0) return fallback

  try {
    const userMessage = JSON.stringify({
      new_entry: {
        id: newEntry.id,
        content: newEntry.content,
        created_at: newEntry.created_at,
      },
      past_entries: pastEntries.slice(0, 10).map((e) => ({
        id: e.id,
        content: e.content,
        created_at: e.created_at,
      })),
    })

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: CONNECTION_DETECTION_SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.3,
      }),
    })

    if (!response.ok) return fallback

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>
    }
    const raw = data.choices[0]?.message?.content ?? '{}'

    try {
      const parsed = JSON.parse(raw) as unknown
      if (
        parsed !== null &&
        typeof parsed === 'object' &&
        'connected' in parsed &&
        typeof (parsed as { connected: unknown }).connected === 'boolean'
      ) {
        return parsed as ConnectionResult
      }
      return fallback
    } catch {
      return fallback
    }
  } catch {
    return fallback
  }
}
