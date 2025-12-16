const { test, expect } = require('@playwright/test');

test('has link to login page', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    // Scope to nav to avoid strict mode errors with dashboard cards
    const nav = page.locator('nav').first();
    const loginLink = nav.locator('a[href*="/user/signin"]');

    // Wait ensuring hydration
    await expect(loginLink).toBeVisible();
    await loginLink.click();

    await expect(page).toHaveURL(/.*\/user\/signin/);

    // Use accessible name to ignore Sidebar H2
    await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible();
});
