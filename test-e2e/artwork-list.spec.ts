import { test, expect } from '@playwright/test';

test('renders artwork list', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  await expect(page.locator('div').filter({ hasText: 'The BathMary Cassatt1890–' }).nth(2)).toBeVisible();
});

test('renders artwork cards', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  await expect(page.locator('div').filter({ hasText: 'The BathMary Cassatt1890–' }).nth(2)).toBeVisible();
  await expect(page.locator('div').filter({ hasText: 'On a BalconyMary Cassatt1878–' }).nth(2)).toBeVisible();
});

test('should load more artworks when scrolling to the bottom', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Scroll to the bottom to trigger infinite scroll
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.evaluate(() => window.scrollTo(0, 0));
  // Expect new artworks to be loaded
  await expect(page.locator('div').filter({ hasText: 'GroupGeorge Grey Barnard1903–' }).nth(2)).toBeVisible({
    timeout: 10000,
  });
});
