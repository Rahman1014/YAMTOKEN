// tests/wallet.spec.ts
// @ts-nocheck
import { test, expect } from '@playwright/test';

test('should connect wallet and display avatar', async ({ page }) => {
  // Mock window.ethereum before the page loads
  await page.addInitScript(() => {
    window.ethereum = {
      isMetaMask: true,
      request: async ({ method, params }) => {
        if (method === 'eth_requestAccounts') {
          return ['0x123456789abcdef123456789abcdef12345678']; // Mocked wallet address
        }
        // Handle other methods if necessary
        return null;
      },
      on: (eventName, callback) => {
        // Mock event listeners if needed
      },
      removeListener: (eventName, callback) => {
        // Mock removeListener if needed
      },
    };
  });

  // Navigate to your app
  await page.goto('http://localhost:3000'); // Replace with your app's URL

  // Check that the "Connect Wallet" button is visible
  const connectButton = page.locator('text=Connect Wallet');
  await expect(connectButton).toBeVisible();

  // Click the "Connect Wallet" button
  await connectButton.click();

  // Wait for the div with the avatar to appear
  const avatarDiv = page.locator('div.MuiAvatar-root'); // Target the avatar div based on the class
  await expect(avatarDiv).toBeVisible();
});
