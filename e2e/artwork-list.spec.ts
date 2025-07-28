import { expect, test } from '@playwright/test';

test('renders artwork cards', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'On a Balcony', exact: true })).toBeVisible();
});
