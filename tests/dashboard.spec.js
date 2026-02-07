import { test, expect } from '@playwright/test'

test('dashboard loads and shows navigation links', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('RestoAM Dashboard')).toBeVisible()
  await expect(page.locator('.nav a', { hasText: 'Assets' })).toBeVisible()
  await expect(page.locator('.nav a', { hasText: 'Locations' })).toBeVisible()
  await expect(page.locator('.nav a', { hasText: 'Workorders' })).toBeVisible()
})
