import { beforeAll, describe, expect, it } from "vitest";
import { requestContextTester } from "../server/request-context";
import { execPromise } from "../utils/node-utils";
import { createTestTrpc } from "./test-helper";

describe("redis-counter", () => {
  beforeAll(async () => {
    await execPromise("make redis/reset/test");
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

describe("postgres-counter", () => {
  beforeAll(async () => {
    await execPromise("make db/truncate/test");
  });

  it("basic", async () => {
    const trpc = await createTestTrpc();
    expect(await trpc.caller.getCounterDb()).toMatchInlineSnapshot("0");
    expect(
      await trpc.caller.updateCounterDb({ delta: 1 })
    ).toMatchInlineSnapshot("1");
    expect(await trpc.caller.getCounterDb()).toMatchInlineSnapshot("1");
  });
});

describe("me", () => {
  it("no session", async () => {
    return requestContextTester()(async () => {
      const trpc = await createTestTrpc();
      expect(await trpc.caller.me()).toMatchInlineSnapshot("null");
    });
  });

  it("with session", async () => {
    return requestContextTester({ sessionData: { user: { name: "tester" } } })(
      async () => {
        const trpc = await createTestTrpc({
          sessionData: { user: { name: "tester" } },
        });
        expect(await trpc.caller.me()).toMatchInlineSnapshot(`
        {
          "name": "tester",
        }
      `);
      }
    );
  });
});
