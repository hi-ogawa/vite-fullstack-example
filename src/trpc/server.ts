import process from "node:process";
import { z } from "zod";
import { redis } from "../utils/redis-utils";
import { trpcProcedureBuilder, trpcRouterFactory } from "./factory";

export const trpcRoot = trpcRouterFactory({
  _healthz: trpcProcedureBuilder.query(() => ({ ok: true })),

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
});

//
// redis counter
//

const PREFIX = process.env["NODE_ENV"] ?? "development";
const COUNTER_KEY = `${PREFIX}:counter`;

function udpateCounter(delta: number): Promise<number> {
  return redis.incrby(COUNTER_KEY, delta);
}
