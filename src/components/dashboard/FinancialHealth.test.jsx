import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import FinancialHealth from './FinancialHealth.jsx'
import { accounts, budgets, goals, transactions } from '../../test/fixtures.js'
describe('FinancialHealth',()=>{it('renders financial score and risk alerts',()=>{render(<FinancialHealth transactions={transactions} accounts={accounts} budgets={budgets} goals={goals}/>);expect(screen.getByText('FINANCIAL HEALTH SCORE')).toBeInTheDocument();expect(screen.getByText('Risk alerts')).toBeInTheDocument()})})
