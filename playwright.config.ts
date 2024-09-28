import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // Path to your test files
  retries: 1,
  use: {
    headless: true, // Set headless to true so the browser runs without a GUI
    screenshot: 'on',
    video: 'retain-on-failure',
  },
});