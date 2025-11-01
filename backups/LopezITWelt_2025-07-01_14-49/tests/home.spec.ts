import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display main heading', async ({ page }) => {
    const heading = await page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });

  test('should display service sections', async ({ page }) => {
    const serviceSections = await page.getByRole('heading', { level: 2 }).all();
    expect(serviceSections.length).toBeGreaterThan(0);
  });

  test('should have working navigation', async ({ page }) => {
    const navLinks = await page.getByRole('navigation').getByRole('link').all();
    for (const link of navLinks) {
      await expect(link).toHaveAttribute('href');
    }
  });
});
