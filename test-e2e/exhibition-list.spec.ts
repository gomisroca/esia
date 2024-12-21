import { test, expect } from '@playwright/test';

test('renders exhibition cards', async ({ page }) => {
  await page.goto('/exhibitions');

  await expect(page.getByRole('link', { name: 'Kingfisher Headdresses from China' })).toBeVisible();
});
