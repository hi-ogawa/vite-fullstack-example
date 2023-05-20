import { defineConfig } from "@playwright/test";

const PORT = 4456;

export default defineConfig({
  testDir: "e2e",
  use: {
    baseURL: `http://localhost:${PORT}`,
  },
  projects: [
    {
      name: "chromium",
      use: {
        browserName: "chromium",
        // adapt viewport size to browser window size specified below. otherwise viewport will get clipped.
        // https://github.com/microsoft/playwright/issues/1086#issuecomment-592227413
        viewport: null,
        launchOptions: {
          args: ["--window-size=600,800"],
        },
      },
    },
  ],
  webServer: {
    command: `PORT=${PORT} STRICT_PORT=1 pnpm dev >> dev-e2e.log 2>&1`,
    port: PORT,
    reuseExistingServer: true,
  },
  forbidOnly: Boolean(process.env["CI"]),
});
