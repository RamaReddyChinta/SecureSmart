import { test, expect } from '@playwright/test'
test('authentication screen is usable before Supabase configuration',async({page})=>{await page.goto('/');await expect(page.getByRole('heading',{name:'SecureSmart'})).toBeVisible();await expect(page.getByRole('button',{name:'Continue with Google'})).toBeVisible()})
