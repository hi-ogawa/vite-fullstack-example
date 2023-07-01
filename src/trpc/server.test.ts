import { beforeAll, describe, expect, it } from "vitest";
import { requestContextTester } from "../server/request-context";
import { execPromise } from "../utils/node-utils";
import { trpcCaller } from "./server";

describe("redis-counter", () => {
  beforeAll(async () => {
    await execPromise("make redis/reset/test");
  });

  it("basic", async () => {
    expect(await trpcCaller.getCounter()).toMatchInlineSnapshot("0");
    expect(await trpcCaller.updateCounter({ delta: 1 })).toMatchInlineSnapshot(
      "1"
    );
    expect(await trpcCaller.getCounter()).toMatchInlineSnapshot("1");
  });
});

describe("postgres-counter", () => {
  beforeAll(async () => {
    await execPromise("make db/truncate/test");
  });

  it("basic", async () => {
    expect(await trpcCaller.getCounterDb()).toMatchInlineSnapshot("0");
    expect(
      await trpcCaller.updateCounterDb({ delta: 1 })
    ).toMatchInlineSnapshot("1");
    expect(await trpcCaller.getCounterDb()).toMatchInlineSnapshot("1");
  });
});

describe("me", () => {
  it("no session", async () => {
    return requestContextTester()(async () => {
      expect(await trpcCaller.me()).toMatchInlineSnapshot("null");
    });
  });

  it("with session", async () => {
    return requestContextTester({ sessionData: { user: { name: "tester" } } })(
      async () => {
        expect(await trpcCaller.me()).toMatchInlineSnapshot(`
        {
          "name": "tester",
        }
      `);
      }
    );
  });
});
