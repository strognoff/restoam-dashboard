import { test, expect } from '@playwright/test'

test('dashboard loads and shows navigation links', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('RestoAM Dashboard')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Assets' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Locations' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Workorders' })).toBeVisible()
})
