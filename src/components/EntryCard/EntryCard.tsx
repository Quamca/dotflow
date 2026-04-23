import type { Entry } from '../../types'

interface EntryCardProps {
  entry: Entry
  onClick: () => void
}

function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(isoString))
}

export default function EntryCard({ entry, onClick }: EntryCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-5 py-4 rounded-xl border border-[#E7E5E4] bg-white hover:border-[#78716C] transition-colors"
    >
      <p className="text-xs text-[#78716C] mb-2">{formatDate(entry.created_at)}</p>
      <p className="text-[#1C1917] text-sm leading-relaxed line-clamp-2">{entry.content}</p>
      {entry.emotions.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {entry.emotions.map((emotion) => (
            <span
              key={emotion}
              className="px-2 py-0.5 rounded-full bg-[#E7E5E4] text-[#78716C] text-xs"
            >
              {emotion}
            </span>
          ))}
        </div>
      )}
    </button>
  )
}
