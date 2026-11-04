import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig, cucumberReporter } from 'playwright-bdd';

// Mesmo caminho base usado no build (ex.: "/natalia-pandolfi-qa/" no GitHub Pages).
const BASE_PATH = (process.env.BASE_PATH ?? '/').replace(/\/?$/, '/');
const PORT = Number(process.env.PORT ?? 4321);
const BASE_URL = `http://127.0.0.1:${PORT}${BASE_PATH}`;

const testDir = defineBddConfig({
  features: 'tests/e2e/features/*.feature',
  steps: 'tests/e2e/steps/*.ts',
});

export default defineConfig({
  testDir,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  expect: { timeout: 7_000 },
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'reports/playwright' }],
    cucumberReporter('json', { outputFile: 'reports/cucumber.json' }),
    cucumberReporter('html', { outputFile: 'reports/cucumber.html' }),
  ],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // Testa o site já compilado (npm run build antes), igual ao que vai para produção.
    command: `npm run preview -- --host 127.0.0.1 --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
