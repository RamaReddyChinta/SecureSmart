import { supabaseRequest } from './client.js'
export const listAccounts = token => supabaseRequest('/rest/v1/accounts?select=*&order=created_at.desc', { accessToken: token })
export const createAccount = (token, account) => supabaseRequest('/rest/v1/accounts', { method: 'POST', accessToken: token, body: account, headers: { Prefer: 'return=representation' } }).then(rows => rows[0])
export const updateAccount = (token, id, account) => supabaseRequest(`/rest/v1/accounts?id=eq.${id}`, { method: 'PATCH', accessToken: token, body: account, headers: { Prefer: 'return=representation' } }).then(rows => rows[0])
export const deleteAccount = (token, id) => supabaseRequest(`/rest/v1/accounts?id=eq.${id}`, { method: 'DELETE', accessToken: token })
