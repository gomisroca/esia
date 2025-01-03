import { test, expect } from '@playwright/test';

test('renders blog image', async ({ page }) => {
  await page.goto('/exhibitions/cm2ipg66500bcbekejhyc6i97');

  await expect(page.getByRole('img', { name: 'Kingfisher Headdresses from China' })).toBeVisible();
});

test('renders blog title', async ({ page }) => {
  await page.goto('/exhibitions/cm2ipg66500bcbekejhyc6i97');

  await expect(page.getByText('Kingfisher Headdresses from China')).toBeVisible();
});

test('renders blog date', async ({ page }) => {
  await page.goto('/exhibitions/cm2ipg66500bcbekejhyc6i97');

  await expect(page.getByText('Sat May 21 2022 - Sun May 21 2023')).toBeVisible();
});

test('renders blog text', async ({ page }) => {
  await page.goto('/exhibitions/cm2ipg66500bcbekejhyc6i97');

  await expect(
    page.getByText(
      'Rare surviving examples of a fragile artistry, these headdresses and other adornments feature prized kingfisher feathers, known for their vivid turquoise-blue color.'
    )
  ).toBeVisible();
});
