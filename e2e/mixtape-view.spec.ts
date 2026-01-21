import { test, expect } from '@playwright/test';

test.describe('Mixtape View - 404', () => {
  test('should show 404 for invalid mixtape token', async ({ page }) => {
    // Navigate to a non-existent mixtape
    await page.goto('/m/invalid-token-12345');

    // Check for GAME OVER text
    await expect(page.locator('h1')).toContainText('GAME OVER');

    // Check for MIXTAPE NOT FOUND
    await expect(page.locator('h2')).toContainText('MIXTAPE NOT FOUND');

    // Check for "tape got eaten" message
    await expect(page.getByText('tape got eaten')).toBeVisible();
  });

  test('should have CTA to make own mixtape on 404', async ({ page }) => {
    await page.goto('/m/invalid-token-12345');

    // Find the CTA to make your own mixtape
    const cta = page.locator('a.btn-retro', { hasText: 'MAKE YOUR OWN MIXTAPE' });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', '/api/auth/spotify');
  });
});
