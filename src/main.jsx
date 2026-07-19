import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'
import './auth.css'
import './accounts.css'
import './transactions.css'
import './dashboard.css'
import './budgets.css'
import './reports.css'
import './goals.css'
import './health.css'
import './brand.css'
import './accessibility.css'
import './design-system.css'
import './readiness.css'

createRoot(document.getElementById('root')).render(
  <StrictMode><App /></StrictMode>,
)
