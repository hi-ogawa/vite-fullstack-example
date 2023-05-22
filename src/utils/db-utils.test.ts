import { sql } from "kysely";
import { describe, expect, it } from "vitest";
import { db } from "./db-utils";

describe("sql", () => {
  it("basic", async () => {
    const result = await sql<[number]>`select 1 + 1`.execute(db);
    expect(result).toMatchInlineSnapshot(`
      {
        "rows": [
          {
            "?column?": 2,
          },
        ],
      }
    `);
  });
});
