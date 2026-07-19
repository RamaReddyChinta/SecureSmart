import { useMemo, useState } from 'react'
import { BarChart3, Landmark, PiggyBank, ReceiptText, Settings as SettingsIcon, Target, NotebookTabs, ChevronDown, ChevronUp } from 'lucide-react'
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
const primaryPages = [
  { name: 'Dashboard', icon: BarChart3 },
  { name: 'Transactions', icon: ReceiptText },
  { name: 'Accounts', icon: Landmark },
  { name: 'Budgets', icon: PiggyBank },
  { name: 'Goals', icon: Target },
]
const morePages = [
  { name: 'Reports', icon: NotebookTabs },
  { name: 'Insights', icon: BarChart3 },
  { name: 'Settings', icon: SettingsIcon },
]

export default function App() { return <AuthProvider><AppContent /></AuthProvider> }
function AppContent() {
  const { session, loading, signOut } = useAuth()
  const [page, setPage] = useState('Dashboard')
  const [moreOpen, setMoreOpen] = useState(false)
  const Page = pages[page]
  const select = name => { setPage(name); setMoreOpen(false) }
  const navItems = useMemo(() => [...primaryPages, ...morePages], [])
  if (loading) return <main className="auth-shell" aria-busy="true">Loading your session…</main>
  if (!session) return <AuthScreen />
  return <FinanceProvider><main className="app-shell"><header><div className="brand-lockup"><img src="/assets/brand/logo.svg" alt="SecureSmart"/><div><p className="eyebrow">PERSONAL FINANCE</p><p className="brand-tagline">Manage Money. Build Wealth. Secure Your Future.</p></div></div><nav aria-label="Primary navigation" className="desktop-nav">{navItems.map(({ name, icon: Icon }) => <button className={page === name ? 'nav-active' : ''} aria-current={page === name ? 'page' : undefined} key={name} onClick={() => select(name)}><Icon size={16} />{name}</button>)}<button onClick={signOut}>Sign out</button></nav></header><Page /><nav className="mobile-nav" aria-label="Mobile navigation">{primaryPages.map(({ name, icon: Icon }) => <button className={page === name ? 'nav-active' : ''} aria-current={page === name ? 'page' : undefined} key={name} onClick={() => select(name)}><Icon size={16} />{name}</button>)}<button aria-expanded={moreOpen} onClick={() => setMoreOpen(value => !value)}>{moreOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}More</button>{moreOpen && <div className="more-menu">{morePages.map(({ name, icon: Icon }) => <button className={page === name ? 'nav-active' : ''} aria-current={page === name ? 'page' : undefined} key={name} onClick={() => select(name)}><Icon size={16} />{name}</button>)}<button onClick={signOut}>Sign out</button></div>}</nav></main></FinanceProvider>
}
