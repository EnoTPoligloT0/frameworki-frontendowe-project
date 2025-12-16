const { test, expect } = require('@playwright/test');

test('unauthenticated user is redirected to signin', async ({ page }) => {
    await page.goto('http://localhost:3000/user/profile');

    // Wait for redirect
    await expect(page).toHaveURL(/.*\/user\/signin/, { timeout: 30000 });

    // Verify Header (Robust)
    await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible();
});
