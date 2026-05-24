import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'off',
    launchOptions: {
      args: ['--disable-web-security']
    }
  },
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        channel: undefined,
      },
    },
  ],
  webServer: {
    command: 'echo "Server already running"',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 0,
  },
});
