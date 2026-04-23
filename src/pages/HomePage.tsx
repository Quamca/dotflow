import { Link } from 'react-router-dom'
import { useSettings } from '../hooks/useSettings'

export default function HomePage() {
  const { apiKey } = useSettings()

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#E7E5E4]">
        <h1 className="text-[#1C1917] text-xl font-semibold">Dotflow</h1>
        <Link
          to="/settings"
          className="text-[#78716C] hover:text-[#1C1917] transition-colors"
          aria-label="Settings"
        >
          ⚙
        </Link>
      </header>

      {!apiKey && (
        <div className="mx-6 mt-4 px-4 py-3 rounded-lg bg-[#FEF3C7] border border-[#D97706] text-sm text-[#1C1917]">
          Add your API key in{' '}
          <Link to="/settings" className="font-medium underline text-[#D97706]">
            Settings
          </Link>{' '}
          to enable AI follow-up questions.
        </div>
      )}

      <main className="px-6 py-8">
        <div className="text-center text-[#78716C] mt-16">
          <p className="text-lg">Your story starts here.</p>
          <p className="text-sm mt-1">Write your first entry to begin connecting the dots.</p>
        </div>
      </main>
    </div>
  )
}
