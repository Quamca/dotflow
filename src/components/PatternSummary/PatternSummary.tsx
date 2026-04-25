interface PatternSummaryProps {
  observations: string[]
}

export default function PatternSummary({ observations }: PatternSummaryProps) {
  if (observations.length === 0) return null

  return (
    <div className="rounded-xl border border-[#E7E5E4] bg-white px-5 py-4 mb-4">
      <h2 className="text-[#1C1917] text-sm font-semibold mb-3">Your patterns</h2>
      <ul className="flex flex-col gap-2">
        {observations.map((obs, i) => (
          <li key={i} className="flex gap-2 text-sm text-[#44403C]">
            <span className="text-[#78716C] shrink-0">·</span>
            <span>{obs}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
