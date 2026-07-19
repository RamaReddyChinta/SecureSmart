import { useMemo, useState } from 'react'
import { BarChart3, Bell, Ellipsis, House, Landmark, NotebookTabs, PiggyBank, Plus, ReceiptText, Settings as SettingsIcon, Target } from 'lucide-react'
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
import TransactionDialog from './components/transaction/TransactionDialog.jsx'

const pages = { Dashboard, Transactions, Accounts, Budgets, Goals, Reports, Insights, Settings }
const desktopPageNames = Object.keys(pages)
const bottomNavItems = [
  { name: 'Dashboard', icon: House, label: 'Home' },
  { name: 'Transactions', icon: ReceiptText, label: 'Transactions' },
  { name: '__fab__', icon: Plus, label: 'Add', isFab: true },
  { name: 'Insights', icon: BarChart3, label: 'Insights' },
  { name: '__more__', icon: Ellipsis, label: 'More' },
]
const morePageItems = [
  { name: 'Accounts', icon: Landmark },
  { name: 'Budgets', icon: PiggyBank },
  { name: 'Goals', icon: Target },
  { name: 'Reports', icon: NotebookTabs },
  { name: 'Settings', icon: SettingsIcon },
]

export default function App() { return <AuthProvider><AppContent /></AuthProvider> }
function AppContent() {
  const { session, loading, signOut, user } = useAuth()
  const [page, setPage] = useState('Dashboard')
  const [moreOpen, setMoreOpen] = useState(false)
  const [fabOpen, setFabOpen] = useState(false)
  const [dialog, setDialog] = useState(null)
  const Page = pages[page]
  const select = name => { setPage(name); setMoreOpen(false); setFabOpen(false) }
  const openQuickAction = transactionType => { setDialog({ kind: 'transaction', transactionType }); setFabOpen(false); setMoreOpen(false) }
  const userName = user?.user_metadata?.full_name || user?.full_name || user?.name || user?.email?.split('@')[0] || 'there'
  const initials = (userName || 'S').charAt(0).toUpperCase()
  const now = new Date(); const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening'
  const navItems = useMemo(() => desktopPageNames, [])
  if (loading) return <main className="auth-shell" aria-busy="true">Loading your session…</main>
  if (!session) return <AuthScreen />
  return <FinanceProvider><main className="app-shell"><header className="app-header"><div className="brand-lockup"><img src="/assets/brand/logo.svg" alt="SecureSmart"/><div><p className="eyebrow">PERSONAL FINANCE</p><p className="brand-tagline">{greeting}, {userName}</p></div></div><div className="header-actions"><button className="icon-button" aria-label="Notifications"><Bell size={18} /></button><div className="header-avatar" aria-label={`Signed in as ${userName}`}>{initials}</div></div></header><nav aria-label="Primary navigation" className="desktop-nav">{navItems.map(name => <button className={page === name ? 'nav-active' : ''} aria-current={page === name ? 'page' : undefined} key={name} onClick={() => select(name)}>{name}</button>)}<button onClick={signOut}>Sign out</button></nav><div className="page-shell"><Page /></div><nav className="mobile-nav" aria-label="Mobile navigation">{bottomNavItems.map(item => item.name === '__fab__' ? <button aria-label="Quick add" className="fab-trigger" key={item.name} onClick={() => setFabOpen(value => !value)}><item.icon size={20} /></button> : <button className={page === item.name ? 'nav-active' : ''} aria-current={page === item.name ? 'page' : undefined} key={item.name} onClick={() => item.name === '__more__' ? setMoreOpen(value => !value) : select(item.name)}><item.icon size={18} />{item.label}</button>)}</nav>{fabOpen && <div className="fab-menu" role="menu"><button className="secondary" onClick={() => openQuickAction('expense')}>Add expense</button><button className="secondary" onClick={() => openQuickAction('income')}>Add income</button><button className="secondary" onClick={() => openQuickAction('transfer')}>Transfer</button></div>}{moreOpen && <div className="more-sheet" role="dialog" aria-label="More screens">{morePageItems.map(item => <button className={page === item.name ? 'nav-active' : ''} aria-current={page === item.name ? 'page' : undefined} key={item.name} onClick={() => select(item.name)}><item.icon size={16} />{item.name}</button>)}<button onClick={signOut}>Sign out</button></div>}{dialog?.kind === 'transaction' && <TransactionDialog transaction={dialog.id ? dialog : { transactionType: dialog.transactionType }} onClose={() => setDialog(null)} onSuccess={() => {}} />}</main></FinanceProvider>
}
