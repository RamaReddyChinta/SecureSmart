import { useFinance } from '../context/FinanceContext.jsx'
import { useFinanceSummary } from '../hooks/useFinanceSummary.js'
import CategoryBreakdown from '../components/charts/CategoryBreakdown.jsx'
export default function Insights() { const { expenses } = useFinance(); const { total, byCategory } = useFinanceSummary(expenses); return <section className="card page"><h2>Insights</h2><CategoryBreakdown byCategory={byCategory} total={total} /></section> }
