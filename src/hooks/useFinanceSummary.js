import { useMemo } from 'react'
import { categories } from '../data/seed.js'
export function useFinanceSummary(expenses) { return useMemo(() => { const total = expenses.reduce((sum, item) => sum + Number(item.amount), 0); const byCategory = categories.map(category => ({ category, amount: expenses.filter(x => x.category === category).reduce((sum, x) => sum + Number(x.amount), 0) })).filter(x => x.amount); return { total, byCategory } }, [expenses]) }
