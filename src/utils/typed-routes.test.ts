import { describe, expect, it } from "vitest";
import { FlashType } from "../../renderer/flash";
import { $R, createRouteFormatterProxy } from "./typed-routes";

describe(createRouteFormatterProxy.name, () => {
  it("basic", () => {
    expect([
      $R["/session/login"]({ q: { flash: FlashType.RequireLogin } }),
      $R["/session/me"](),
      $R["/server-counter"](),
      $R["/dummy/@id"]({ p: { id: 123 } }),
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
