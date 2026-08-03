import { test as setup, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

const AUTH_FILE = "playwright/.auth/user.json";

const USER = process.env.WP_USER || "admin";
const PASS = process.env.WP_PASS || "password";

/**
 * Logs into WordPress once and stores the session for every other spec.
 *
 * Override the credentials and target with env vars:
 *   TEST_URL=http://dev.local WP_USER=admin WP_PASS=secret npx playwright test
 */
setup("authenticate", async ({ page }) => {
    fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });

    await page.goto("/wp-login.php");
    await page.fill("#user_login", USER);
    await page.fill("#user_pass", PASS);
    await page.click("#wp-submit");

    await expect(page.locator("#wpadminbar")).toBeVisible();

    await page.context().storageState({ path: AUTH_FILE });
});
