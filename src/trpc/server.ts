import process from "node:process";
import { tinyassert } from "@hiogawa/utils";
import { initTRPC } from "@trpc/server";
import { sql } from "kysely";
import { z } from "zod";
import { db } from "../db/client";
import { getRequestContext } from "../server/request-context";
import { serverConfig } from "../utils/config";
import { redis } from "../utils/redis-utils";

const $t = initTRPC.create();

export const trpcRouter = $t.router({
  _healthz: $t.procedure.query(() => ({ ok: true })),

  _debug: $t.procedure.query(() => {
    const ctx = getRequestContext();
    return {
      versions: process.versions,
      vercelEnv: Object.fromEntries(
        Object.entries(process.env).filter(([k]) => k.startsWith("VERCEL_"))
      ),
      requestHeaders: headersEntries(ctx.request.headers),
    };
  }),

  getCounter: $t.procedure.query(() => {
    return udpateCounter(0);
  }),

  updateCounter: $t.procedure
    .input(
      z.object({
        delta: z.number(),
      })
    )
    .mutation(({ input }) => {
      return udpateCounter(input.delta);
    }),

  getCounterDb: $t.procedure.query(() => {
    return updateCounterDb(0);
  }),

  updateCounterDb: $t.procedure
    .input(
      z.object({
        delta: z.number(),
      })
    )
    .mutation(({ input }) => {
      return updateCounterDb(input.delta);
    }),

  login: $t.procedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input }) => {
      const ctx = getRequestContext();
      tinyassert(!ctx.session.user);
      ctx.session.user = { name: input.name };
      await ctx.session.save();
    }),

  logout: $t.procedure.mutation(async () => {
    const ctx = getRequestContext();
    tinyassert(ctx.session.user);
    ctx.session.destroy();
  }),

  me: $t.procedure.query(() => {
    const ctx = getRequestContext();
    return ctx.session.user ?? null;
  }),
});

export const trpcCaller = trpcRouter.createCaller({});

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
