'use strict';

const { defineConfig, devices } = require('@playwright/test');

const PORT = process.env.TEST_PORT || '13081';
const BASE = `http://127.0.0.1:${PORT}`;

module.exports = defineConfig({
  testDir : './test',
  testMatch: ['**/*.spec.js'],

  // Start the test server before any test, kill it after
  webServer: {
    command           : `TEST_PORT=${PORT} node test/test-server.js`,
    url               : `${BASE}/admin`,
    reuseExistingServer: false,
    timeout           : 15_000,
  },

  use: {
    baseURL  : BASE,
    headless : true,
    // Capture screenshot only on failure
    screenshot: 'only-on-failure',
    video     : 'retain-on-failure',
  },

  reporter: [['list']],

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
