import { defineConfig, devices } from "@playwright/test";

const externalBase = process.env.E2E_BASE_URL;
const localClientHeaders = (ip: string) => externalBase ? {} : { extraHTTPHeaders: { "x-real-ip": ip } };

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 35_000,
  expect: { timeout: 8_000 },
  reporter: [["list"], ["json", { outputFile: "test-results/e2e-results.json" }]],
  use: {
    baseURL: externalBase ?? "http://127.0.0.1:3100",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], ...localClientHeaders("192.0.2.10") },
    },
    {
      name: "mobile",
      use: {
        viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true,
        ...localClientHeaders("192.0.2.11"),
      },
    },
  ],
  webServer: externalBase ? undefined : {
    command: "node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100/api/health",
    reuseExistingServer: false,
    timeout: 30_000,
    // The local E2E ingress is the only place that trusts this synthetic client
    // header. Production/public E2E runs never send the synthetic client header.
    env: {
      CHAT_PROVIDER: "mock", OPENROUTER_API_KEY: "synthetic-browser-test", NEXT_TELEMETRY_DISABLED: "1",
      CHAT_TRUSTED_PROXY_IP_HEADER: "x-real-ip",
    },
  },
});
