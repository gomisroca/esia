import { expect, test } from '@playwright/test';

test('renders exhibition cards', async ({ page }) => {
  await page.goto('/exhibitions');

  await expect(page.getByRole('heading', { name: 'Kingfisher Headdresses from China' })).toBeVisible();
});
