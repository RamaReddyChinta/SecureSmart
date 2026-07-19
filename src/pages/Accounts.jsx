import { useMemo, useState } from 'react'
import { useFinance } from '../context/FinanceContext.jsx'
import { formatMoney } from '../utils/formatters.js'
import AccountDialog from '../components/account/AccountDialog.jsx'
import AccountList from '../components/account/AccountList.jsx'
import ConfirmDialog from '../components/common/ConfirmDialog.jsx'
import Empty from '../components/common/Empty.jsx'

export default function Accounts() {
  const { accounts, addAccount, updateAccount, deleteAccount, loading, error } = useFinance()
  const [dialog, setDialog] = useState(null); const [deleting, setDeleting] = useState(null)
  const active = accounts.filter(x => x.is_active)
  const netWorth = useMemo(() => accounts.filter(x => x.include_in_net_worth).reduce((sum, x) => sum + Number(x.current_balance), 0), [accounts])
  const save = async account => { try { dialog?.id ? await updateAccount({ ...account, id: dialog.id }) : await addAccount(account); setDialog(null) } catch {} }
  const remove = async () => { try { await deleteAccount(deleting.id); setDeleting(null) } catch {} }
  if (loading) return <div className="dashboard-skeleton" aria-busy="true"><i/><i/><i/></div>
  return <section className="page"><div className="section-heading"><div><p className="eyebrow">FINANCIAL OVERVIEW</p><h2>Accounts</h2></div><button className="primary" onClick={() => setDialog({})}>+ Add account</button></div><div className="account-total"><span>Total balance</span><b>{formatMoney(netWorth)}</b><small>Active accounts included in net worth</small></div>{error && <p className="form-error">{error}</p>}<div className="card accounts-card">{active.length ? <AccountList accounts={active} onEdit={setDialog} onDelete={setDeleting} /> : <Empty title="Your accounts will appear here" text="Add a bank, cash, wallet, card, investment, or savings account." actionLabel="Add account" onAction={() => setDialog({})} />}</div>{accounts.some(x => !x.is_active) && <div className="card inactive-accounts"><h2>Inactive accounts</h2><AccountList accounts={accounts.filter(x => !x.is_active)} onEdit={setDialog} onDelete={setDeleting} /></div>}{dialog && <AccountDialog account={dialog.id ? dialog : null} onSave={save} onClose={() => setDialog(null)} />}{deleting && <ConfirmDialog title={`Delete ${deleting.name}?`} description="This removes the account from your workspace. This action cannot be undone." onClose={() => setDeleting(null)} onConfirm={remove} />}</section>
}
