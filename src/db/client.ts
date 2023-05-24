import process from "node:process";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { serverConfig } from "../utils/config";

export let db: Kysely<unknown>;

// use direct connection for production migration
export async function initializeDb(options?: { direct?: boolean }) {
  db = new Kysely<unknown>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString:
          (options?.direct && serverConfig.APP_POSTGRES_DIRECT_URL) ||
          serverConfig.APP_POSTGRES_URL,
      }),
    }),
    // DEBUG=kysely for client query logging
    log: process.env["DEBUG"]?.includes("kysely") ? ["query", "error"] : [],
  });
}

export async function finalizeDb() {
  await db.destroy();
}
