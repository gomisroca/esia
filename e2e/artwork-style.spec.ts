import { test, expect } from '@playwright/test';

test('artwork list changes when style is selected', async ({ page }) => {
  await page.goto('/');

  // Expect initial artwork list
  const artworkList = page.getByRole('list');
  await expect(artworkList).toContainText('The Bath');
  await expect(artworkList).toContainText('On a Balcony');

  // Click on the style list to trigger the dropdown
  const filterButton = page.locator('button[name="filterDropdown"]');
  await filterButton.click();

  // Select the style
  const styleDropdown = page.getByText('CubismModernism21st');
  const styleButton = styleDropdown.getByText('Cubism');
  await styleButton.click();

  // Expect new artwork list
  const newArtwork = page.locator('img[alt="The Butterfly, from Histoire naturelle"]');
  await expect(newArtwork).toBeVisible({ timeout: 10000 });
});
