const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const isSupabaseConfigured = Boolean(url && anonKey)
const configError = () => new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.')
export async function supabaseRequest(path, { method = 'GET', body, accessToken, headers = {} } = {}) {
  if (!isSupabaseConfigured) throw configError()
  if (!navigator.onLine) throw new Error('You appear to be offline. Check your connection and try again.')
  const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 15000)
  let response
  try { response = await fetch(`${url}${path}`, { method, signal: controller.signal, headers: { apikey: anonKey, ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}), ...(body ? { 'Content-Type': 'application/json' } : {}), ...headers }, ...(body ? { body: JSON.stringify(body) } : {}) }) } catch (error) { throw new Error(error.name === 'AbortError' ? 'Request timed out. Please try again.' : 'Unable to reach SecureSmart. Check your connection and try again.') } finally { clearTimeout(timeout) }
  const text = await response.text(); let data = null; try { data = text ? JSON.parse(text) : null } catch { data = { message: text } }
  if (!response.ok) throw new Error(data?.message || data?.msg || data?.error_description || 'Supabase request failed')
  return data
}
export async function supabaseUpload(path, file, accessToken) { if (!isSupabaseConfigured) throw configError(); const response = await fetch(`${url}/storage/v1/object/receipts/${path}`, { method: 'POST', headers: { apikey: anonKey, Authorization: `Bearer ${accessToken}`, 'Content-Type': file.type || 'application/octet-stream', 'x-upsert': 'true' }, body: file }); if (!response.ok) { const data = await response.json().catch(() => ({})); throw new Error(data.message || 'Receipt upload failed') } return path }
