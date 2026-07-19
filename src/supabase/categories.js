import { supabaseRequest } from './client.js'
export const listCategories = token => supabaseRequest('/rest/v1/categories?select=*&order=name', { accessToken: token })
export const createCategory = (token, category) => supabaseRequest('/rest/v1/categories', { method: 'POST', accessToken: token, body: category, headers: { Prefer: 'return=representation' } }).then(rows => rows[0])
