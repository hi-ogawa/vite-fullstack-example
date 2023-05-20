import { z } from "zod";
import { serverConfig } from "../utils/config";
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

function udpateCounter(delta: number): Promise<number> {
  const key = `${serverConfig.APP_REDIS_PREFIX}:counter`;
  return redis.incrby(key, delta);
}
