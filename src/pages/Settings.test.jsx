import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Settings from './Settings.jsx'

vi.mock('../context/AuthContext.jsx', () => ({
  useAuth: () => ({
    user: { email: 'demo@example.com', user_metadata: { full_name: 'Ava Chen' } },
    signOut: vi.fn(),
  }),
}))

vi.mock('../context/FinanceContext.jsx', () => ({
  useFinance: () => ({
    accounts: [{ id: '1', name: 'Checking', is_active: true, current_balance: 1250, include_in_net_worth: true }],
    budgets: [],
    goals: [],
    loading: false,
    error: '',
  }),
}))

describe('Settings page', () => {
  it('shows the signed-in profile and preference sections', () => {
    render(<Settings />)

    expect(screen.getByText('Ava Chen')).toBeInTheDocument()
    expect(screen.getByText('demo@example.com')).toBeInTheDocument()
    expect(screen.getByText('Account preferences')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
  })
})
