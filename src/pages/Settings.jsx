import { useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useFinance } from '../context/FinanceContext.jsx'
import { formatMoney } from '../utils/formatters.js'
import ConfirmDialog from '../components/common/ConfirmDialog.jsx'

export default function Settings() {
  const { user, signOut } = useAuth()
  const { accounts, budgets, goals, loading, error } = useFinance()
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)

  const stats = useMemo(() => {
    const balance = accounts.filter(account => account.is_active).reduce((sum, account) => sum + Number(account.current_balance || 0), 0)
    const monthlyBudget = budgets.filter(item => item.period === 'monthly').reduce((sum, item) => sum + Number(item.monthly_limit || 0), 0)
    return {
      balance,
      monthlyBudget,
      goals: goals.length,
    }
  }, [accounts, budgets, goals])

  const handleSignOut = async () => {
    setBusy(true)
    try {
      await signOut()
    } finally {
      setBusy(false)
      setConfirming(false)
    }
  }

  if (loading) return <div className="dashboard-skeleton" aria-busy="true"><i /><i /><i /></div>

  return (
    <section className="page settings-page">
      <div className="section-heading">
        <div>
          <p className="eyebrow">PROFILE</p>
          <h2>Settings</h2>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="card settings-card">
        <div className="settings-profile">
          <div className="settings-avatar" aria-hidden="true">{(user?.user_metadata?.full_name || user?.full_name || user?.email || 'S').charAt(0).toUpperCase()}</div>
          <div>
            <h3>{user?.user_metadata?.full_name || user?.full_name || user?.name || 'SecureSmart user'}</h3>
            <p>{user?.email || 'No email linked yet'}</p>
          </div>
        </div>

        <div className="settings-grid">
          <article className="settings-panel">
            <h3>Account preferences</h3>
            <ul>
              <li>Keep your balances, budgets, and goals synced automatically.</li>
              <li>Use the mobile navigation for fast access when you are on the go.</li>
              <li>Review your activity history at any time from the transactions view.</li>
            </ul>
          </article>
          <article className="settings-panel">
            <h3>Workspace summary</h3>
            <div className="settings-stat-row"><span>Net worth</span><strong>{formatMoney(stats.balance)}</strong></div>
            <div className="settings-stat-row"><span>Monthly budgets</span><strong>{formatMoney(stats.monthlyBudget)}</strong></div>
            <div className="settings-stat-row"><span>Active goals</span><strong>{stats.goals}</strong></div>
          </article>
        </div>

        <div className="settings-actions">
          <button type="button" className="secondary" onClick={() => setConfirming(true)}>Sign out</button>
        </div>
      </div>

      {confirming && <ConfirmDialog title="Sign out?" description="You can sign back in anytime from the welcome screen." confirmLabel="Sign out" onClose={() => setConfirming(false)} onConfirm={handleSignOut} busy={busy} />}
    </section>
  )
}
