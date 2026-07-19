import { supabaseRequest } from './client.js'
const key = 'securesmart-auth'
const read = () => { const item = document.cookie.split('; ').find(x => x.startsWith(`${key}=`)); try { return item ? JSON.parse(decodeURIComponent(item.slice(key.length + 1))) : null } catch { return null } }
const write = session => { document.cookie = `${key}=${encodeURIComponent(JSON.stringify(session))}; path=/; max-age=2592000; samesite=lax${location.protocol === 'https:' ? '; secure' : ''}` }
export const getStoredSession = () => read()
export const clearStoredSession = () => { document.cookie = `${key}=; path=/; max-age=0; samesite=lax` }
export const persistSession = session => { write(session); return session }
export async function refreshStoredSession() { const session = read(); if (!session?.refresh_token) return session; try { return persistSession(await supabaseRequest('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: { refresh_token: session.refresh_token } })) } catch { clearStoredSession(); return null } }
export async function signInWithPassword(email, password) { return persistSession(await supabaseRequest('/auth/v1/token?grant_type=password', { method: 'POST', body: { email, password } })) }
export async function signUp(email, password, fullName) { return supabaseRequest('/auth/v1/signup', { method: 'POST', body: { email, password, data: { full_name: fullName } } }) }
export function signInWithGoogle() { const url = import.meta.env.VITE_SUPABASE_URL; const redirect = `${location.origin}${location.pathname}`; location.assign(`${url}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirect)}`) }
export function captureOAuthSession() { const values = new URLSearchParams(location.hash.slice(1)); if (!values.get('access_token')) return null; const session = { access_token: values.get('access_token'), refresh_token: values.get('refresh_token'), user: { id: values.get('user_id') } }; history.replaceState({}, document.title, location.pathname); return persistSession(session) }
export async function signOut(accessToken) { try { await supabaseRequest('/auth/v1/logout', { method: 'POST', accessToken }) } finally { clearStoredSession() } }
