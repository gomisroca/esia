import { test, expect } from '@playwright/test';

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

  // Expect new artworks to be loaded
  const newArtwork = page
    .getByTestId('artwork-style-list')
    .locator('div')
    .filter({ hasText: 'The Butterfly, from Histoire naturelle' })
    .nth(2);
  await expect(newArtwork).toBeVisible({ timeout: 10000 });
});
