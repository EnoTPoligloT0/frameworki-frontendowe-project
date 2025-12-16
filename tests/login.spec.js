const { test, expect } = require('@playwright/test');

test('user can register and then sign in', async ({ page }) => {
    // Use a unique email every time to bypass "auth/too-many-requests" and "auth/email-already-in-use"
    const uniqueId = Date.now();
    const email = `testuser_${uniqueId}@example.com`;
    const password = 'TestPassword123!';

    // --- Step 1: Register ---
    await page.goto('http://localhost:3000/user/register');

    // Fill Registration
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('input[name="confirmPassword"]').fill(password); // Ensure field name matches Register page

    // Submit and wait for redirect
    await Promise.all([
        // Expect redirection to Verify or Profile
        page.waitForURL(/.*\/user\/(verify|profile)/, { timeout: 30000 }),
        page.click('button[type="submit"]')
    ]);

    // --- Step 2: Sign Out (to test Login) ---
    // Force navigate to signin to start clean, ignoring active session state for a moment
    await page.goto('http://localhost:3000/user/signin');

    // --- Step 3: Sign In ---
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);

    // Submit Logic
    await page.click('button[type="submit"]');

    // --- Step 4: Verify Success ---
    // Wait for Profile URL or Sign Out button
    try {
        await Promise.any([
            page.waitForURL(/.*\/user\/profile/, { timeout: 30000 }),
            page.waitForSelector('text=Sign Out', { state: 'visible', timeout: 30000 })
        ]);
    } catch (e) {
        const errorMsg = await page.locator('div.bg-red-50').textContent().catch(() => null);
        if (errorMsg) throw new Error(`Login failed with UI error: ${errorMsg}`);
        throw e;
    }
});
