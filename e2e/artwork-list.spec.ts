import { expect, test } from '@playwright/test';

test('renders artwork cards', async ({ page }) => {
  await page.goto('/');
  await expect(
    page
      .locator('div')
      .filter({ hasText: /^1952 Exhibition Poster1952SpainPablo PicassoLinocut on cream wove paperCubism$/ })
      .nth(2)
  ).toBeVisible();
});
