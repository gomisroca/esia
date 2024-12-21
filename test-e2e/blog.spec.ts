import { test, expect } from '@playwright/test';

test('renders blog image', async ({ page }) => {
  await page.goto('/blogs/cm34dmhzw000010jd5vhjof3b');

  await expect(page.getByRole('img', { name: 'Discover the Timeless Beauty' })).toBeVisible();
});

test('renders blog title', async ({ page }) => {
  await page.goto('/blogs/cm34dmhzw000010jd5vhjof3b');

  await expect(page.getByText('Discover the Timeless Beauty')).toBeVisible();
});

test('renders blog date', async ({ page }) => {
  await page.goto('/blogs/cm34dmhzw000010jd5vhjof3b');

  await expect(page.getByText('12/11/2024')).toBeVisible();
});

test('renders blog text', async ({ page }) => {
  await page.goto('/blogs/cm34dmhzw000010jd5vhjof3b');

  await expect(page.getByText('A Glimpse into the Eternal City')).toBeVisible();
});
