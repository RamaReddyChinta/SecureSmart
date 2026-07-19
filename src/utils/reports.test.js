import { describe, expect, it } from 'vitest'
import { buildReport, reportCsv } from './reports.js'
import { accounts, budgets, transactions } from '../test/fixtures.js'
describe('reports',()=>{it('builds an income report for a date range',()=>{const report=buildReport('income',transactions,accounts,budgets,'2026-07-01','2026-07-31');expect(report.totals.income).toBe(95000);expect(report.rows).toHaveLength(1)});it('escapes export data as CSV',()=>{expect(reportCsv(buildReport('expense',transactions,accounts,budgets,'2026-07-01','2026-07-31'))).toContain('Groceries')})})
