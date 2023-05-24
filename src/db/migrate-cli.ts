import fs from "node:fs";
import process from "node:process";
import { tinyassert } from "@hiogawa/utils";
import { consola } from "consola";
import {
  type Migration,
  type MigrationProvider,
  type MigrationResultSet,
  Migrator,
  sql,
} from "kysely";
import { z } from "zod";
import { initializeConfig } from "../utils/config";
import { db, finalizeDb, initializeDb } from "./client";

// raw sql based migration cli with custom MigrationProvider
// cf. https://github.com/kysely-org/kysely#migrations

const Z_COMMAND = z.enum(["status", "up", "down", "latest"]).default("status");

async function mainCli() {
  const args = process.argv.slice(2);
  const command = Z_COMMAND.parse(args[0]);

  const migrationsDir = `${__dirname}/migrations`;
  const migrator = new Migrator({
    db,
    provider: new RawSqlMigrationProvider({
      directory: migrationsDir,
    }),
  });

  switch (command) {
    case "status": {
      const result = await migrator.getMigrations();
      for (const info of result) {
        console.log(
          `${info.name}: ${info.executedAt?.toISOString() ?? "(pending)"}`
        );
      }
      return;
    }
    case "up": {
      const result = await migrator.migrateUp();
      handleResult(result);
      return;
    }
    case "down": {
      const result = await migrator.migrateDown();
      handleResult(result);
      return;
    }
    case "latest": {
      const result = await migrator.migrateToLatest();
      handleResult(result);
      return;
    }
  }
}

function handleResult(result: MigrationResultSet) {
  console.log(":: executed migrations");
  console.log(result.results);
  if (result.error) {
    throw result.error;
  }
}

//
// RawSqlMigrationProvider
//

class RawSqlMigrationProvider implements MigrationProvider {
  constructor(private options: { directory: string }) {}

  async getMigrations(): Promise<Record<string, Migration>> {
    const migrations: Record<string, Migration> = {};
    const baseDir = this.options.directory;
    const nameDirs = await fs.promises.readdir(baseDir);
    for (const name of nameDirs) {
      const upFile = `${baseDir}/${name}/up.sql`;
      const downFile = `${baseDir}/${name}/down.sql`;
      tinyassert(fs.existsSync(upFile));
      migrations[name] = {
        up: await readSqlFile(upFile),
        down: fs.existsSync(downFile) ? await readSqlFile(downFile) : undefined,
      };
    }
    return migrations;
  }
}

async function readSqlFile(filepath: string): Promise<Migration["up"]> {
  const content = await fs.promises.readFile(filepath, "utf-8");
  return async (db) => {
    await sql.raw(content).execute(db);
  };
}

//
// main
//

async function main() {
  initializeConfig();
  await initializeDb({ direct: true });
  try {
    await mainCli();
  } catch (e) {
    consola.error(e);
  } finally {
    await finalizeDb();
  }
}

main();
