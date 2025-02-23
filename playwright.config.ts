import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

const apiTestPattern = "tests/api/**/*.spec.ts";
/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  //globalSetup: require.resolve('./global-setup'), // Register the global setup
  testDir: './tests',
  timeout: 60000, // Global test timeout
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    storageState: 'auth.json',
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    actionTimeout: 10000, // Timeout for each Playwright action (e.g., click, type)
    navigationTimeout: 15000, // Timeout for navigation (e.g., page.goto())
    headless: false,
    //viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    launchOptions: {
      slowMo: 50, // Slow down by 50 milliseconds
    },

  },
  expect: {
    timeout: 10000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'api-tests', // Separate project for API tests
      testMatch: [apiTestPattern], // Restrict to API test files
    },
    {
      name: 'chromium',
      use: {
        storageState: 'auth.json',
        ...devices['Desktop Chrome'],
      },
      testIgnore: [apiTestPattern], // Ignore API tests
      
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
      testIgnore: [apiTestPattern], // Ignore API tests
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
      testIgnore: [apiTestPattern], // Ignore API tests
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
