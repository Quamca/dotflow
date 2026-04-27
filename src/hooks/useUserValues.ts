import { useState } from 'react'

const CONFIRMED_VALUES_KEY = 'dotflow_user_values'
const PENDING_PROPOSAL_KEY = 'dotflow_values_proposal_dismissed'

export interface UserValuesState {
  confirmedValues: string[]
  hasConfirmed: boolean
  proposalDismissed: boolean
}

export function useUserValues() {
  const [confirmedValues, setConfirmedValues] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(CONFIRMED_VALUES_KEY)
      return raw ? (JSON.parse(raw) as string[]) : []
    } catch {
      return []
    }
  })

  const [proposalDismissed, setProposalDismissed] = useState<boolean>(
    () => localStorage.getItem(PENDING_PROPOSAL_KEY) === 'true'
  )

  function confirmValues(values: string[]) {
    localStorage.setItem(CONFIRMED_VALUES_KEY, JSON.stringify(values))
    setConfirmedValues(values)
  }

  function dismissProposal() {
    localStorage.setItem(PENDING_PROPOSAL_KEY, 'true')
    setProposalDismissed(true)
  }

  function clearValues() {
    localStorage.removeItem(CONFIRMED_VALUES_KEY)
    localStorage.removeItem(PENDING_PROPOSAL_KEY)
    setConfirmedValues([])
    setProposalDismissed(false)
  }

  return {
    confirmedValues,
    hasConfirmed: confirmedValues.length > 0,
    proposalDismissed,
    confirmValues,
    dismissProposal,
    clearValues,
  }
}
