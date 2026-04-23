import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSettings } from '../hooks/useSettings'

function maskApiKey(key: string): string {
  return 'sk-...' + key.slice(-4)
}

export default function SettingsPage() {
  const { apiKey, saveApiKey, clearApiKey } = useSettings()
  const [inputValue, setInputValue] = useState('')
  const [isEditing, setIsEditing] = useState(!apiKey)

  function handleSave() {
    if (!inputValue.trim()) return
    saveApiKey(inputValue.trim())
    setInputValue('')
    setIsEditing(false)
  }

  function handleClear() {
    clearApiKey()
    setInputValue('')
    setIsEditing(true)
  }

  function handleChange() {
    setIsEditing(true)
    setInputValue('')
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <header className="flex items-center gap-4 px-6 py-4 border-b border-[#E7E5E4]">
        <Link
          to="/"
          className="text-[#78716C] hover:text-[#1C1917] transition-colors"
          aria-label="Back to home"
        >
          ←
        </Link>
        <h1 className="text-[#1C1917] font-semibold">Settings</h1>
      </header>

      <main className="max-w-md mx-auto px-6 py-8 space-y-6">
        <section>
          <h2 className="text-sm font-medium text-[#78716C] uppercase tracking-wide mb-3">
            OpenAI API Key
          </h2>

          {isEditing ? (
            <div className="space-y-3">
              <input
                type="password"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                placeholder="sk-..."
                className="w-full px-4 py-2.5 rounded-lg border border-[#E7E5E4] bg-[#F5F5F4] text-[#1C1917] placeholder-[#78716C] focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
                autoFocus
              />
              <button
                onClick={handleSave}
                disabled={!inputValue.trim()}
                className="w-full py-2.5 rounded-lg bg-[#1C1917] text-[#FAFAF9] font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#292524] transition-colors"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="px-4 py-2.5 rounded-lg border border-[#E7E5E4] bg-[#F5F5F4] text-[#1C1917] font-mono">
                {apiKey ? maskApiKey(apiKey) : ''}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleChange}
                  className="flex-1 py-2 rounded-lg border border-[#E7E5E4] text-[#1C1917] font-medium hover:bg-[#F5F5F4] transition-colors"
                >
                  Change
                </button>
                <button
                  onClick={handleClear}
                  className="flex-1 py-2 rounded-lg border border-[#E7E5E4] text-[#78716C] font-medium hover:bg-[#F5F5F4] transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </section>

        <p className="text-sm text-[#78716C] leading-relaxed">
          ℹ Your key is stored locally on this device only. Entry content is
          sent to OpenAI when AI features are used.
        </p>
      </main>
    </div>
  )
}
