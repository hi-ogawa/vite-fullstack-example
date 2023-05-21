import { type Page, test } from "@playwright/test";
import { execPromise } from "../src/utils/node-utils";

test.beforeAll(async () => {
  await execPromise("make test/setup");
});

test("basic", async ({ page }) => {
  await page.goto("/");
  await waitForHydration(page);

  await page.getByText("counter: 0").click();
  await page.getByRole("button", { name: "+1" }).click();
  await page.getByText("counter: 1").click();

  await page.getByRole("link", { name: "/trpc" }).click();
  await page.waitForURL("/trpc");

  await page.getByText("counter = 0").click();
  await page.getByRole("button", { name: "+1" }).click();
  await page.getByText("Successfully updated").click();
  await page.getByText("counter = 1").click();
  await page.getByRole("button", { name: "-1" }).click();
  await page.getByText("Successfully updated").click();
  await page.getByText("counter = 0").click();
});

test("session", async ({ page }) => {
  await page.goto("/session");
  await waitForHydration(page);

  await page.getByLabel("Name").click();
  await page.getByLabel("Name").fill("tester");
  await page.getByRole("button", { name: "Login" }).click();

  await page.getByText("Hello, tester").click();
  await page.getByRole("button", { name: "Logout" }).click();

  await page.getByRole("button", { name: "Login" }).waitFor();
});

//
// helper
//

async function waitForHydration(page: Page) {
  await page.getByTestId("hydrated").waitFor({ state: "attached" });
}
