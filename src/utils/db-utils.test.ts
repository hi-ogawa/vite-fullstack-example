import { sql } from "kysely";
import { describe, expect, it } from "vitest";
import { db } from "./db-utils";

describe("sql", () => {
  it("basic", async () => {
    const result = await sql<
      [{ answer: number }]
    >`select 1 + 1 as answer`.execute(db);

    expect(result).toMatchInlineSnapshot(`
      {
        "rows": [
          {
            "answer": 2,
          },
        ],
      }
    `);
  });
});
