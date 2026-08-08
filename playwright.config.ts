import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E configuration for Yappy.
 *
 * Tests run against the v3 (legacy) experience served by Vite in `test` mode
 * (see `.env.test`), which points Firebase at the local emulators. The
 * emulators themselves are started around the run by `firebase emulators:exec`
 * in the `test:e2e` script — Playwright only owns the app server below.
 */

// Dedicated port for the e2e app server so it never collides with a developer's
// normal `yarn start` dev server (which runs against real Firebase on 5173).
const PORT = 5175;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/support/global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Real-time multi-context specs are order-sensitive within a file but the
  // emulator reset per test keeps files isolated; cap workers in CI for stability.
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [
      ['list'],
      ['html', { open: 'never' }],
      ['junit', { outputFile: 'test-results/junit.xml' }],
    ]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'yarn test:app',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
