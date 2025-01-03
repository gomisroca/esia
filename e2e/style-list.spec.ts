import { test, expect } from '@playwright/test';

test('renders style list dropdown', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('button[name="filterButton"]')).toBeVisible();
});

test('renders style list options', async ({ page }) => {
  await page.goto('/');

  // Click on the style list to trigger the dropdown
  const filterButton = page.locator('button[name="filterButton"]');
  await filterButton.click();

  // Wait for the dropdown and specific options to be available
  await expect(page.getByRole('button', { name: 'Cubism' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Modernism' })).toBeVisible();
});

test('calls handleStyleChange callback when style is selected', async ({ page }) => {
  await page.goto('/');

  // Click on the style list to trigger the dropdown
  const filterButton = page.locator('button[name="filterButton"]');
  await filterButton.click();

  // Select the style
  const styleButton = page.getByRole('button', { name: 'Cubism' });
  await styleButton.click();

  // Check if the style is disabled
  await filterButton.click();
  await expect(styleButton).toBeDisabled();
});

test('clears selected style when clear button is clicked', async ({ page }) => {
  await page.goto('/');

  // Click on the style list to trigger the dropdown
  const filterButton = page.locator('button[name="filterButton"]');
  await filterButton.click();

  // Select the style
  const styleButton = page.getByRole('button', { name: 'Cubism' });
  await styleButton.click();

  // Click on the 'filter off' button to clear the style
  const filterOffButton = page.locator('button[name="filterOffButton"]');
  await filterOffButton.click();

  // Check if the style is disabled
  await filterButton.click();
  await expect(styleButton).toBeEnabled();
});
