import { defineConfig, devices } from "@playwright/test";

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["html"],
    ["json", { outputFile: "test-results/results.json" }],
    ["junit", { outputFile: "test-results/results.xml" }],
    ["allure-playwright"],
    ["github"],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:3000",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",

    /* Take screenshot on failure */
    screenshot: "only-on-failure",

    /* Record video on failure */
    video: "retain-on-failure",

    /* Global test timeout */
    actionTimeout: 10000,
    navigationTimeout: 30000,

    /* Global setup for all tests */
    extraHTTPHeaders: {
      "Accept-Language": "de-DE,de;q=0.9,en;q=0.8",
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
      },
    },

    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        viewport: { width: 1920, height: 1080 },
      },
    },

    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        viewport: { width: 1920, height: 1080 },
      },
    },

    /* Test against mobile viewports. */
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },

    /* Test against branded browsers. */
    {
      name: "Microsoft Edge",
      use: { ...devices["Desktop Edge"], channel: "msedge" },
    },
    {
      name: "Google Chrome",
      use: { ...devices["Desktop Chrome"], channel: "chrome" },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  /* Global setup and teardown */
  globalSetup: require.resolve("./tests/global-setup.ts"),
  globalTeardown: require.resolve("./tests/global-teardown.ts"),

  /* Test timeout */
  timeout: 60000,

  /* Expect timeout */
  expect: {
    timeout: 10000,
    toMatchSnapshot: {
      maxDiffPixels: 10,
    },
  },

  /* Output directory */
  outputDir: "test-results/",

  /* Snapshot directory */
  snapshotDir: "tests/snapshots/",

  /* Test patterns */
  testMatch: ["**/*.spec.ts", "**/*.test.ts", "**/*.e2e.ts"],

  /* Ignore patterns */
  testIgnore: ["**/node_modules/**", "**/dist/**", "**/.next/**"],

  /* Environment variables */
  env: {
    NODE_ENV: "test",
    CI: process.env.CI || "false",
  },

  /* Custom test fixtures */
  fixtures: {
    // Custom fixtures can be defined here
  },

  /* Custom test utilities */
  use: {
    // Custom utilities can be defined here
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  /* Custom test annotations */
  annotations: {
    // Custom annotations can be defined here
  },

  /* Custom test metadata */
  metadata: {
    // Custom metadata can be defined here
  },

  /* Custom test reporters */
  reporter: [
    ["html"],
    ["json", { outputFile: "test-results/results.json" }],
    ["junit", { outputFile: "test-results/results.xml" }],
    ["allure-playwright"],
    ["github"],
  ],

  /* Custom test hooks */
  hooks: {
    // Custom hooks can be defined here
  },

  /* Custom test utilities */
  utilities: {
    // Custom utilities can be defined here
  },

  /* Custom test configurations */
  configurations: {
    // Custom configurations can be defined here
  },

  /* Custom test environments */
  environments: {
    // Custom environments can be defined here
  },

  /* Custom test suites */
  suites: {
    // Custom suites can be defined here
  },

  /* Custom test groups */
  groups: {
    // Custom groups can be defined here
  },

  /* Custom test tags */
  tags: {
    // Custom tags can be defined here
  },

  /* Custom test annotations */
  annotations: {
    // Custom annotations can be defined here
  },

  /* Custom test metadata */
  metadata: {
    // Custom metadata can be defined here
  },

  /* Custom test reporters */
  reporter: [
    ["html"],
    ["json", { outputFile: "test-results/results.json" }],
    ["junit", { outputFile: "test-results/results.xml" }],
    ["allure-playwright"],
    ["github"],
  ],

  /* Custom test hooks */
  hooks: {
    // Custom hooks can be defined here
  },

  /* Custom test utilities */
  utilities: {
    // Custom utilities can be defined here
  },

  /* Custom test configurations */
  configurations: {
    // Custom configurations can be defined here
  },

  /* Custom test environments */
  environments: {
    // Custom environments can be defined here
  },

  /* Custom test suites */
  suites: {
    // Custom suites can be defined here
  },

  /* Custom test groups */
  groups: {
    // Custom groups can be defined here
  },

  /* Custom test tags */
  tags: {
    // Custom tags can be defined here
  },
});
