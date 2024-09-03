import { test, expect } from '@playwright/test';

test('renders artwork cards', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('img[alt="The Bath"]')).toBeVisible();
});
