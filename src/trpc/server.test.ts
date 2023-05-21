import { beforeAll, describe, expect, it } from "vitest";
import { execPromise } from "../utils/node-utils";
import { createTestTrpc } from "./test-helper";

describe("trpc", () => {
  beforeAll(async () => {
    await execPromise("make test/setup");
  });

  it("basic", async () => {
    const trpc = await createTestTrpc();
    expect(await trpc.caller.getCounter()).toMatchInlineSnapshot("0");
    expect(await trpc.caller.updateCounter({ delta: 1 })).toMatchInlineSnapshot(
      "1"
    );
    expect(await trpc.caller.getCounter()).toMatchInlineSnapshot("1");
  });
});

describe("me", () => {
  it("no session", async () => {
    const trpc = await createTestTrpc();
    expect(await trpc.caller.me()).toMatchInlineSnapshot("null");
  });

  it("with session", async () => {
    const trpc = await createTestTrpc({
      sessionData: { user: { name: "tester" } },
    });
    expect(await trpc.caller.me()).toMatchInlineSnapshot(`
      {
        "name": "tester",
      }
    `);
  });
});
