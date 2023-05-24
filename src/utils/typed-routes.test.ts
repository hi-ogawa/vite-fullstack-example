import { describe, expect, it } from "vitest";
import { FlashType } from "../../renderer/flash";
import { $R, createRouteFormatterProxy } from "./typed-routes";

describe(createRouteFormatterProxy.name, () => {
  it("basic", () => {
    expect([
      $R["/session/login"]({ q: { flash: FlashType.RequireLogin } }),
      $R["/session/me"](),
      $R["/redis"](),
      $R["/dummy/@id"]({ p: { id: 123 } }),
    ]).toMatchInlineSnapshot(`
      [
        "/session/login?flash=0",
        "/session/me",
        "/redis",
        "/dummy/123",
      ]
    `);
  });
});
