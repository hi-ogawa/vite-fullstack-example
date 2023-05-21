import { type Page, expect, test } from "@playwright/test";
import { regExpRaw } from "../src/utils/misc";
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

  await page.getByRole("link", { name: "/server-counter" }).click();
  await page.waitForURL("/server-counter");

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
    await page.getByText("Successfully logged in").click();

    // check name and logout
    await page.waitForURL(regExpRaw`/session/me$`);
    await waitForHydration(page);
    await page.getByText("Hello, dev").click();
    await page.getByRole("button", { name: "Logout" }).click();
    await page.getByText("Successfully logged out").click();

    await page.waitForURL(regExpRaw`/session/login$`);
  });

  test("server redirection", async ({ page }) => {
    await page.goto("/session/me");
    await page.waitForURL("/session/login");
    await page.getByText("Login required").click();
  });

  test("client redirection", async ({ page }) => {
    await page.goto("/");
    await waitForHydration(page);

    await page.getByRole("link", { name: "/session/me" }).click();
    await page.waitForURL("/session/login");
    await page.getByText("Login required").click();
  });
});

test("active link", async ({ page }) => {
  await page.goto("/");
  await waitForHydration(page);

  // not active
  await expect(
    page.getByRole("link", { name: "/server-counter" })
  ).not.toHaveClass(/antd-menu-item-active/);

  // active
  await page.getByRole("link", { name: "/server-counter" }).click();
  await expect(page.getByRole("link", { name: "/server-counter" })).toHaveClass(
    /antd-menu-item-active/
  );
});

//
// helper
//

async function waitForHydration(page: Page) {
  await page.getByTestId("hydrated").waitFor({ state: "attached" });
}
