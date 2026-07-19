import { supabaseRequest } from './client.js'
export const listBudgets = token => supabaseRequest('/rest/v1/budgets?select=*&order=month.desc', { accessToken: token })
export const saveBudget = (token, budget) => supabaseRequest('/rest/v1/budgets?on_conflict=user_id,category_id,period,month', { method: 'POST', accessToken: token, body: budget, headers: { Prefer: 'resolution=merge-duplicates,return=representation' } }).then(rows => rows[0])
export const deleteBudget = (token, id) => supabaseRequest(`/rest/v1/budgets?id=eq.${id}`, { method: 'DELETE', accessToken: token })
