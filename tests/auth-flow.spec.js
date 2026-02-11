import { test, expect } from '@playwright/test';

test('login flow screenshots', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'RestoAM Login' })).toBeVisible();
  await page.screenshot({ path: 'demo/login-page-auth.png', fullPage: true });

  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password').fill('admin');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByText('RestoAM Dashboard')).toBeVisible();
  await page.screenshot({ path: 'demo/dashboard-after-login.png', fullPage: true });
});
