import { useNavigate } from 'react-router-dom'

interface ConnectionBadgeProps {
  targetId: string
  targetDate: string
  connectionInsight?: string | null
}

function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(isoString))
}

export default function ConnectionBadge({ targetId, targetDate, connectionInsight }: ConnectionBadgeProps) {
  const navigate = useNavigate()

  function handleClick() {
    navigate(`/entry/${targetId}`)
  }

  return (
    <div className="ml-5 mt-1">
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E7E5E4] text-[#78716C] text-xs hover:bg-[#D6D3D1] transition-colors"
      >
        ↔ Connected to {formatDate(targetDate)}
      </button>
      {connectionInsight && connectionInsight.length > 0 && (
        <p className="mt-1 text-xs text-[#78716C] italic leading-relaxed">{connectionInsight}</p>
      )}
    </div>
  )
}
