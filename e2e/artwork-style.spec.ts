import { expect, test } from '@playwright/test';

test('artwork list changes when style is selected', async ({ page }) => {
  await page.goto('/');

  // Expect initial artwork list
  await expect(page.getByRole('heading', { name: 'Under the Lamp', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'On a Balcony', exact: true })).toBeVisible();

  // Click on the style list to trigger the dropdown
  const filterButton = page.locator('button[name="filterDropdown"]');
  await filterButton.click();

  // Select the style
  const styleDropdown = page.getByText('CubismModernism21st');
  const styleButton = styleDropdown.getByText('Cubism');
  await styleButton.click();

  // Expect new artwork list
  await expect(page.getByRole('heading', { name: 'The Butterfly, from Histoire' })).toBeVisible();
});
