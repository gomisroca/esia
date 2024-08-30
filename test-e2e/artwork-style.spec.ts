// Must mix elements of the other two tests, basically test if an artwork of the selected style is displayed
// And then test if the style clears when the clear button is clicked
import { test, expect } from '@playwright/test';

test('artwork list changes when style is selected', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Expect initial artwork list
  const artworkList = page.getByRole('list');
  await expect(artworkList).toContainText('The Bath');
  await expect(artworkList).toContainText('On a Balcony');

  // Click on the style list to trigger the dropdown
  const styleList = page.getByRole('button').nth(3);
  await styleList.click();

  // Select the style
  const styleDropdown = page.getByText('CubismModernism21st');
  const styleButton = styleDropdown.getByText('Cubism');
  await styleButton.click();

  // Expect new artwork list
  const newArtwork = page.getByRole('list').locator('div').filter({ hasText: 'The Butterfly, from Histoire' }).nth(1);
  await expect(newArtwork).toBeVisible({ timeout: 10000 });
});
