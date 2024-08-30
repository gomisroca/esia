import { test, expect } from '@playwright/test';
import { d } from 'playwright-report/trace/assets/workbench-NhP651gz';

test('renders artwork list', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('artwork-list')).toBeVisible();
});

test('renders artwork cards', async ({ page }) => {
  await page.goto('/');
  const artworkList = page.getByTestId('artwork-list');

  await expect(artworkList).toContainText('The Bath');
  await expect(artworkList).toContainText('On a Balcony');
});

test('should load more artworks when scrolling to the bottom', async ({ page }) => {
  await page.goto('/');
  // Scroll to the bottom to trigger infinite scroll
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.evaluate(() => window.scrollTo(0, 0));
  // Expect new artworks to be loaded
  const newArtwork = page
    .getByTestId('artwork-list')
    .locator('div')
    .filter({ hasText: 'GroupGeorge Grey Barnard1903–' })
    .nth(2);
  await expect(newArtwork).toBeVisible({ timeout: 10000 });
});
