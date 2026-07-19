import { defineConfig } from "@playwright/test";

/**
 * Playwright config for EAP Frontend E2E tests.
 * Tests against production build (dist/) via vite preview.
 * Uses system Chromium at /usr/bin/chromium (no download needed).
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  reporter: "line",
  timeout: 30_000,

  use: {
    baseURL: "http://localhost:3000",
    executablePath: "/usr/bin/chromium",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    viewport: { width: 1280, height: 720 },
  },

  webServer: {
    command: "echo 'use existing vite dev on 3000'",
    url: "http://localhost:3000",
    timeout: 5_000,
    reuseExistingServer: true,
  },
});
