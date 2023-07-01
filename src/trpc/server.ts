import process from "node:process";
import { tinyassert } from "@hiogawa/utils";
import { sql } from "kysely";
import { z } from "zod";
import { db } from "../db/client";
import { getRequestContext } from "../server/request-context";
import { serverConfig } from "../utils/config";
import { redis } from "../utils/redis-utils";
import { trpcProcedureBuilder, trpcRouterFactory } from "./factory";

export const trpcRoot = trpcRouterFactory({
  _healthz: trpcProcedureBuilder.query(() => ({ ok: true })),

  _debug: trpcProcedureBuilder.query(() => {
    const ctx = getRequestContext();
    return {
      versions: process.versions,
      vercelEnv: Object.fromEntries(
        Object.entries(process.env).filter(([k]) => k.startsWith("VERCEL_"))
      ),
      requestHeaders: headersEntries(ctx.request.headers),
    };
  }),

  getCounter: trpcProcedureBuilder.query(() => {
    return udpateCounter(0);
  }),

  updateCounter: trpcProcedureBuilder
    .input(
      z.object({
        delta: z.number(),
      })
    )
    .mutation(({ input }) => {
      return udpateCounter(input.delta);
    }),

  getCounterDb: trpcProcedureBuilder.query(() => {
    return updateCounterDb(0);
  }),

  updateCounterDb: trpcProcedureBuilder
    .input(
      z.object({
        delta: z.number(),
      })
    )
    .mutation(({ input }) => {
      return updateCounterDb(input.delta);
    }),

  login: trpcProcedureBuilder
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input }) => {
      const ctx = getRequestContext();
      tinyassert(!ctx.session.user);
      ctx.session.user = { name: input.name };
      await ctx.session.save();
    }),

  logout: trpcProcedureBuilder.mutation(async () => {
    const ctx = getRequestContext();
    tinyassert(ctx.session.user);
    ctx.session.destroy();
  }),

  me: trpcProcedureBuilder.query(() => {
    const ctx = getRequestContext();
    return ctx.session.user ?? null;
  }),
});

//
// postgres counter
//

const COUNTER_ID = 1;

async function updateCounterDb(delta: number): Promise<number> {
  await sql`INSERT INTO Counter (id, value) VALUES (${COUNTER_ID}, 0) ON CONFLICT DO NOTHING`.execute(
    db
  );
  const result = await sql<{
    value: number;
  }>`UPDATE Counter SET value = value + ${delta} WHERE id = ${COUNTER_ID} RETURNING value`.execute(
    db
  );
  tinyassert(result.rows.length === 1);
  return result.rows[0].value;
}

//
// redis counter
//

function udpateCounter(delta: number): Promise<number> {
  const key = `${serverConfig.APP_REDIS_PREFIX}:counter`;
  return redis.incrby(key, delta);
}

//
// misc
//

function headersEntries(headers: Headers) {
  const entries: [string, string][] = [];
  headers.forEach((v, k) => {
    entries.push([k, v]);
  });
  return entries;
}
