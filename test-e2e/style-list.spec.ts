import { test, expect } from '@playwright/test';

test('renders style list dropdown', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('button').nth(3)).toBeVisible();
});

test('renders style list options', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Click on the style list to trigger the dropdown
  const styleList = page.getByRole('button').nth(3);
  await styleList.click();

  // Wait for the dropdown and specific options to be available
  const styleDropdown = page.getByText('CubismModernism21st');
  await expect(styleDropdown).toContainText('Cubism');
  await expect(styleDropdown).toContainText('Modernism');
});

test('calls handleStyleChange callback when style is selected', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  // Click on the style list to trigger the dropdown
  const styleList = page.getByRole('button').nth(3);
  await styleList.click();

  // Select the style
  const styleDropdown = page.getByText('CubismModernism21st');
  const styleButton = styleDropdown.getByText('Cubism');
  await styleButton.click();

  // Check if the style is disabled
  await styleList.click();
  await expect(styleButton).toBeDisabled();
});

test('clears selected style when clear button is clicked', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  // Click on the style list to trigger the dropdown
  const styleList = page.getByRole('button').nth(3);
  await styleList.click();

  // Select the style
  const styleDropdown = page.getByText('CubismModernism21st');
  const styleButton = styleDropdown.getByText('Cubism');
  await styleButton.click();

  // Click on the 'filter off' button to clear the style
  const styleOff = page.getByRole('button').nth(4);
  await styleOff.click();

  // Check if the style is disabled
  await styleList.click();
  await expect(styleButton).toBeEnabled();
});
