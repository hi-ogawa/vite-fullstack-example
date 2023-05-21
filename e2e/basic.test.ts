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

test.describe("session", () => {
  test("basic", async ({ page }) => {
    await page.goto("/");
    await waitForHydration(page);

    // login
    await page.getByRole("link", { name: "/session/login" }).click();
    await page.waitForURL("/session/login");
    await page.getByLabel("Name").click();
    await page.getByLabel("Name").fill("dev");
    await page.getByRole("button", { name: "Login" }).click();

    // check name and logout
    await page.waitForURL("/session/me");
    await waitForHydration(page);
    await page.getByText("Hello, dev").click();
    await page.getByRole("button", { name: "Logout" }).click();

    await page.waitForURL("/session/login");
  });

  test("server redirection", async ({ page }) => {
    await page.goto("/session/me");
    await page.waitForURL("/session/login");
  });

  test("client redirection", async ({ page }) => {
    await page.goto("/");
    await waitForHydration(page);

    await page.getByRole("link", { name: "/session/me" }).click();
    await page.waitForURL("/session/login");
  });
});

//
// helper
//

async function waitForHydration(page: Page) {
  await page.getByTestId("hydrated").waitFor({ state: "attached" });
}
