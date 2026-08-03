import { test, expect, Page } from "@playwright/test";

const SETUP_URL = "/wp-admin/edit.php?post_type=videoplayer&page=h5vp-setup";
const DASHBOARD_URL = "/wp-admin/edit.php?post_type=videoplayer&page=html5-video-player";

/** Wait for the React wizard to mount. */
const openWizard = async (page: Page) => {
    await page.goto(SETUP_URL);
    await expect(page.locator(".bPlOnboarding")).toBeVisible();
};

/** Welcome -> player defaults. */
const gotoDefaults = async (page: Page) => {
    await openWizard(page);
    await page.getByRole("button", { name: /Let's Get Started/i }).click();
    await expect(page.getByRole("heading", { name: /Set your player defaults/i })).toBeVisible();
};

/** Welcome -> defaults -> feature tour. */
const gotoFeatures = async (page: Page) => {
    await gotoDefaults(page);
    await page.getByRole("button", { name: /Continue/i }).click();
    await expect(page.getByRole("heading", { name: /What's included/i })).toBeVisible();
};

/** All the way to the final editor-choice step. */
const gotoEditor = async (page: Page) => {
    await gotoFeatures(page);
    await page.getByRole("button", { name: /^Skip$/i }).click();
    await expect(page.getByRole("heading", { name: /how will you add videos/i })).toBeVisible();
};

test.describe("Guided setup wizard", () => {
    test("renders the welcome step with progress rail and chrome hidden", async ({ page }) => {
        await openWizard(page);

        await expect(page.getByRole("heading", { name: /Welcome to HTML5 Video Player/i })).toBeVisible();
        await expect(page.locator(".bPlOnboardingProgress .progressItem")).toHaveCount(4);

        // Full-screen: the WP admin menu and toolbar are hidden.
        await expect(page.locator("#adminmenumain")).toBeHidden();
        await expect(page.locator("#wpadminbar")).toBeHidden();
    });

    test("opens the video in a modal, and only then loads the iframe", async ({ page }) => {
        await openWizard(page);

        // Nothing contacts YouTube on page load.
        await expect(page.locator("iframe")).toHaveCount(0);
        await expect(page.locator(".bPlVideoModal")).toHaveCount(0);
        await expect(page.locator(".videoFacade")).toBeVisible();

        await page.locator(".videoFacade").click();

        const modal = page.locator(".bPlVideoModal");
        await expect(modal).toBeVisible();
        await expect(modal.locator("iframe")).toBeVisible();
    });

    test("closes the video modal via the button, Escape, and the backdrop", async ({ page }) => {
        await openWizard(page);
        const modal = page.locator(".bPlVideoModal");

        await page.locator(".videoFacade").click();
        await expect(modal).toBeVisible();
        await modal.locator(".closeModal").click();
        await expect(modal).toHaveCount(0);

        await page.locator(".videoFacade").click();
        await page.keyboard.press("Escape");
        await expect(modal).toHaveCount(0);

        await page.locator(".videoFacade").click();
        await modal.locator(".bPlVideoModalOverlay").click();
        await expect(modal).toHaveCount(0);

        // Unmounting the player is what stops playback.
        await expect(page.locator("iframe")).toHaveCount(0);
    });

    test("explains a setting through the help modal", async ({ page }) => {
        await gotoDefaults(page);

        await page.locator(".fieldHelpTrigger").first().click();
        const help = page.locator(".bPlOnbHelpModal");
        await expect(help).toBeVisible();

        await page.keyboard.press("Escape");
        await expect(help).toHaveCount(0);
    });

    test("offers all three editors, including Elementor", async ({ page }) => {
        await gotoEditor(page);

        await expect(page.getByRole("radio", { name: /Gutenberg/i })).toBeVisible();
        await expect(page.getByRole("radio", { name: /Elementor/i })).toBeVisible();
        await expect(page.getByRole("radio", { name: /Shortcode/i })).toBeVisible();
    });

    test("Skip on the defaults step discards edits made on it", async ({ page }) => {
        await gotoDefaults(page);

        const toggle = page.getByRole("switch").first();
        const before = await toggle.getAttribute("aria-checked");
        await toggle.click();
        await expect(toggle).not.toHaveAttribute("aria-checked", before || "");

        // Skip must roll the edit back, not just avoid saving it — the final
        // save posts every value, including ones left in state.
        await page.getByRole("button", { name: /^Skip$/i }).click();
        await expect(page.getByRole("heading", { name: /What's included/i })).toBeVisible();

        await page.getByRole("button", { name: /^Back$/i }).click();
        await expect(page.getByRole("switch").first()).toHaveAttribute("aria-checked", before || "");
    });

    test("shows the feature tour with Included and Pro rows", async ({ page }) => {
        await gotoFeatures(page);

        await expect(page.locator(".featureBadge.isIncluded").first()).toBeVisible();
        await expect(page.locator(".featureRow.locked").first()).toBeVisible();
        await expect(page.getByRole("link", { name: /Upgrade to Pro/i })).toBeVisible();
    });

    test("swaps the instructions live as the editor choice changes", async ({ page }) => {
        await gotoEditor(page);

        await page.getByRole("radio", { name: /Gutenberg/i }).click();
        await expect(page.getByText(/Adding a video with Gutenberg/i)).toBeVisible();
        await expect(page.getByText(/Adding a video with a shortcode/i)).toHaveCount(0);

        await page.getByRole("radio", { name: /Shortcode/i }).click();
        await expect(page.getByText(/Adding a video with a shortcode/i)).toBeVisible();
        await expect(page.getByText(/Adding a video with Gutenberg/i)).toHaveCount(0);
    });

    test("persists the chosen values across a re-run", async ({ page }) => {
        await gotoDefaults(page);
        const pauseToggle = page.getByRole("switch").first();
        await pauseToggle.click();
        await expect(pauseToggle).toHaveAttribute("aria-checked", "true");
        await page.getByRole("button", { name: /Continue/i }).click();

        await page.getByRole("button", { name: /^Skip$/i }).click();
        await page.getByRole("radio", { name: /Shortcode/i }).click();
        await page.getByRole("button", { name: /Create Your First Player/i }).click();
        await page.waitForURL(/post-new\.php/);

        // Re-opening shows the saved state, not the defaults.
        await gotoDefaults(page);
        await expect(page.getByRole("switch").first()).toHaveAttribute("aria-checked", "true");
        await page.getByRole("button", { name: /Continue/i }).click();
        await page.getByRole("button", { name: /^Skip$/i }).click();
        await expect(page.getByRole("radio", { name: /Shortcode/i })).toHaveAttribute("aria-checked", "true");
    });

    test("keeps values saved when the user exits mid-wizard", async ({ page }) => {
        await gotoDefaults(page);
        const pauseToggle = page.getByRole("switch").first();
        const before = await pauseToggle.getAttribute("aria-checked");
        await pauseToggle.click();
        await page.getByRole("button", { name: /Continue/i }).click();

        // Bail out on the feature tour, before finishing.
        await page.getByRole("button", { name: /Exit Guided Setup/i }).click();
        await page.waitForURL(/page=html5-video-player/);

        await gotoDefaults(page);
        await expect(page.getByRole("switch").first()).not.toHaveAttribute("aria-checked", before || "");
    });

    test("suppresses the onboarding notice once completed", async ({ page }) => {
        await gotoEditor(page);
        await page.getByRole("button", { name: /Go to Dashboard/i }).click();
        await page.waitForURL(/page=html5-video-player/);

        await page.goto(DASHBOARD_URL);
        await expect(page.locator('[data-h5vp-notice="h5vp_dismiss_onboarding_notice"]')).toHaveCount(0);
    });

    test("exposes a Guided Setup link from the dashboard", async ({ page }) => {
        await page.goto(DASHBOARD_URL);

        const link = page.getByRole("link", { name: /Guided Setup/i });
        await expect(link).toBeVisible();
        await link.click();

        await expect(page.locator(".bPlOnboarding")).toBeVisible();
    });
});
