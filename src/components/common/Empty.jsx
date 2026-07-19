import { Inbox, Plus } from 'lucide-react'

export default function Empty({ title = 'Nothing here yet', text, actionLabel, onAction, icon: Icon = Inbox }) {
  return <section className="empty-state"><span aria-hidden="true"><Icon size={24} /></span><h3>{title}</h3><p>{text}</p>{actionLabel && <button className="primary" onClick={onAction}>{actionLabel}</button>}</section>
}
