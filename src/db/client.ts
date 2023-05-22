import process from "node:process";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { serverConfig } from "../utils/config";

export let db: Kysely<unknown>;

export async function initializeDb() {
  db = new Kysely<unknown>({
    dialect: new PostgresDialect({
      // TODO: let vercel/neon does pooling on production
      pool: new Pool({ connectionString: serverConfig.APP_POSTGRES_URL }),
    }),
    // DEBUG=kysely for client query logging
    log: process.env["DEBUG"]?.includes("kysely") ? ["query", "error"] : [],
  });
}

export async function finalizeDb() {
  await db.destroy();
}
