import { test, expect } from '@playwright/test';

test('displays selected artist information', async ({ page }) => {
  await page.goto('/artist/cm09zs6xe000014ca2hdva1n4');

  // Expect name of the artist
  await expect(page.getByText('Mary Cassatt')).toBeVisible();

  // Expect artist's birth and death years
  await expect(page.getByText('- 1926')).toBeVisible();
});

test('displays selected artist artworks', async ({ page }) => {
  await page.goto('/artist/cm09zs6xe000014ca2hdva1n4');

  // Expect artwork list
  await expect(page.getByRole('heading', { name: 'On a Balcony' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'The Bath' })).toBeVisible();
});
