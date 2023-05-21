import process from "node:process";
import { tinyassert } from "@hiogawa/utils";
import { z } from "zod";
import { serverConfig } from "../utils/config";
import { redis } from "../utils/redis-utils";
import { trpcProcedureBuilder, trpcRouterFactory } from "./factory";

export const trpcRoot = trpcRouterFactory({
  _healthz: trpcProcedureBuilder.query(() => ({ ok: true })),

  _debug: trpcProcedureBuilder.query(({ ctx }) => {
    return {
      versions: process.versions,
      vercelEnv: Object.fromEntries(
        Object.entries(process.env).filter(([k]) => k.startsWith("VERCEL_"))
      ),
      requestHeaders: headersEntries(ctx.req.headers),
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

  login: trpcProcedureBuilder
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      tinyassert(!ctx.session.user);
      ctx.session.user = { name: input.name };
      await ctx.session.save();
    }),

  logout: trpcProcedureBuilder.mutation(async ({ ctx }) => {
    tinyassert(ctx.session.user);
    ctx.session.destroy();
  }),

  me: trpcProcedureBuilder.query(({ ctx }) => {
    return ctx.session.user ?? null;
  }),
});

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
