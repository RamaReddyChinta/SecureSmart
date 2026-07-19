import { categories } from '../../data/seed.js'
import { currency } from '../../utils/formatters.js'
import Empty from '../common/Empty.jsx'
export default function CategoryBreakdown({ byCategory, total }) { if (!byCategory.length) return <Empty text="Add an expense to see your breakdown." />; return <div className="breakdown">{[...byCategory].sort((a,b) => b.amount-a.amount).map(({ category, amount }) => <div className="category" key={category}><div><span className={`dot dot-${categories.indexOf(category)}`} /><b>{category}</b></div><strong>{currency.format(amount)}</strong><div className="bar"><i className={`fill-${categories.indexOf(category)}`} style={{ width: `${amount / total * 100}%` }} /></div></div>)}</div> }
