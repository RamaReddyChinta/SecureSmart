import { useState } from 'react'
import { FinanceProvider } from './context/FinanceContext.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import AuthScreen from './components/common/AuthScreen.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Transactions from './pages/Transactions.jsx'
import Accounts from './pages/Accounts.jsx'
import Budgets from './pages/Budgets.jsx'
import Insights from './pages/Insights.jsx'
import Settings from './pages/Settings.jsx'
import Reports from './pages/Reports.jsx'
import Goals from './pages/Goals.jsx'

const pages = { Dashboard, Transactions, Accounts, Budgets, Goals, Reports, Insights, Settings }

export default function App() {
  return <AuthProvider><AppContent /></AuthProvider>
}
function AppContent() {
  const { session, loading, signOut } = useAuth()
  const [page, setPage] = useState('Dashboard')
  const Page = pages[page]
  if (loading) return <main className="auth-shell">Loading your session…</main>
  if (!session) return <AuthScreen />
  return <FinanceProvider><main className="app-shell"><header><div className="brand-lockup"><img src="/assets/brand/logo.svg" alt="SecureSmart"/><div><p className="eyebrow">PERSONAL FINANCE</p><p className="brand-tagline">Manage Money. Build Wealth. Secure Your Future.</p></div></div><nav>{Object.keys(pages).map(name => <button className={page === name ? 'nav-active' : ''} key={name} onClick={() => setPage(name)}>{name}</button>)}<button onClick={signOut}>Sign out</button></nav></header><Page /></main></FinanceProvider>
}
