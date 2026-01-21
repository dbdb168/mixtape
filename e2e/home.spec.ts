import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display the landing page', async ({ page }) => {
    await page.goto('/');

    // Check h1 contains MIXTAPE
    const heading = page.locator('h1');
    await expect(heading).toContainText('MIXTAPE');

    // Check CTA is visible
    const cta = page.locator('a.btn-retro', { hasText: 'MAKE A MIXTAPE' });
    await expect(cta).toBeVisible();
  });

  test('should have working CTA button', async ({ page }) => {
    await page.goto('/');

    // Find the CTA button and check its href
    const cta = page.locator('a.btn-retro', { hasText: 'MAKE A MIXTAPE' });
    await expect(cta).toHaveAttribute('href', '/api/auth/spotify');
  });

  test('should display cassette tape visual', async ({ page }) => {
    await page.goto('/');

    // Check for cassette element
    const cassette = page.locator('.cassette');
    await expect(cassette).toBeVisible();
  });
});
