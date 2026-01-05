import { expect, test } from '@playwright/test';

test('renders blog cards', async ({ page }) => {
  await page.goto('/blogs');

  await expect(page.getByRole('heading', { name: 'Discover the Timeless Beauty' })).toBeVisible();
});
