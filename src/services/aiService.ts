import { FOLLOW_UP_SYSTEM_PROMPT } from '../utils/prompts'

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
