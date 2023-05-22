import { Kysely, PostgresDialect, sql } from "kysely";
import { Pool } from "pg";
import { serverConfig } from "../utils/config";

export let db: Kysely<unknown>;

export async function initializeDb() {
  db = new Kysely<unknown>({
    dialect: new PostgresDialect({
      // TODO: let vercel/neon does pooling on production
      pool: new Pool({ connectionString: serverConfig.APP_POSTGRES_URL }),
    }),
  });
}

export async function finalizeDb() {
  await db.destroy();
}

export async function truncateDb() {
  await sql`DELETE FROM "Counter"`.execute(db);
}
