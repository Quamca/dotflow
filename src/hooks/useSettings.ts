import { useState } from 'react'

const API_KEY_STORAGE_KEY = 'dotflow_openai_api_key'

export function useSettings() {
  const [apiKey, setApiKey] = useState<string | null>(
    () => localStorage.getItem(API_KEY_STORAGE_KEY)
  )

  function saveApiKey(key: string) {
    localStorage.setItem(API_KEY_STORAGE_KEY, key)
    setApiKey(key)
  }

  function clearApiKey() {
    localStorage.removeItem(API_KEY_STORAGE_KEY)
    setApiKey(null)
  }

  return { apiKey, saveApiKey, clearApiKey }
}
