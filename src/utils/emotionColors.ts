const EMOTION_COLOR_MAP: Record<string, string> = {
  joy: '#F59E0B',
  sadness: '#3B82F6',
  anger: '#EF4444',
  fear: '#8B5CF6',
  calm: '#14B8A6',
}

const DEFAULT_COLOR = '#78716C'

export function getEmotionColor(emotion: string | null | undefined): string {
  if (!emotion) return DEFAULT_COLOR
  return EMOTION_COLOR_MAP[emotion] ?? DEFAULT_COLOR
}
