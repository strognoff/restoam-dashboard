import { test, expect } from '@playwright/test'

test('login then dashboard loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'RestoAM Login' })).toBeVisible()
  await page.getByLabel('Username').fill('admin')
  await page.getByLabel('Password').fill('admin')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page.getByText('RestoAM Dashboard')).toBeVisible()
  await expect(page.locator('.nav a', { hasText: 'Assets' })).toBeVisible()
  await expect(page.locator('.nav a', { hasText: 'Locations' })).toBeVisible()
  await expect(page.locator('.nav a', { hasText: 'Workorders' })).toBeVisible()
})
