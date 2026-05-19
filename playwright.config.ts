import { defineConfig } from "@playwright/test";

const TEST_URL = process.env.TEST_URL || "http://127.0.0.1:9400"; // Can be changed to http://dev.local

export default defineConfig({
    testDir: "./tests",
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1,
    reporter: "html",
    timeout: 60_000,
    expect: {
        timeout: 10_000,
    },
    projects: [
        {
            name: "setup",
            testMatch: /.*new.*\.setup\.ts/,
        },
        {
            name: "chromium",
            testMatch: "tests/new/*.spec.ts",
            use: {
                browserName: "chromium",
                storageState: "playwright/.auth/user.json",
            },
            dependencies: ["setup"],
        },
    ],
    use: {
        screenshot: "on",//"only-on-failure",
        trace: "on-first-retry",
        headless: true,
        baseURL: TEST_URL,
    },
});