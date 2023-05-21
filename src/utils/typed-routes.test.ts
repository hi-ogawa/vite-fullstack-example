import { describe, expect, it } from "vitest";
import { FlashType } from "../../renderer/flash";
import { $ROUTES, createRouteFormatterProxy } from "./typed-routes";

describe(createRouteFormatterProxy.name, () => {
  it("basic", () => {
    expect([
      $ROUTES["/session/login"]({ q: { flash: FlashType.RequireLogin } }),
      $ROUTES["/session/me"](),
      $ROUTES["/server-counter"](),
      $ROUTES["/dummy/@id"]({ p: { id: 123 } }),
    ]).toMatchInlineSnapshot(`
      [
        "/session/login?flash=0",
        "/session/me",
        "/server-counter",
        "/dummy/123",
      ]
    `);
  });
});
