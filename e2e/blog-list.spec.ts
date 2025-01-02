import { test, expect } from '@playwright/test';

test('renders blog cards', async ({ page }) => {
  await page.goto('/blogs');

  await expect(page.getByRole('link', { name: 'Discover the Timeless Beauty' })).toBeVisible();
});
