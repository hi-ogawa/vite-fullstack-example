import { z } from "zod";
import { trpcProcedureBuilder, trpcRouterFactory } from "./factory";

let counter = 0;

export const trpcRoot = trpcRouterFactory({
  getCounter: trpcProcedureBuilder.query(() => {
    return counter;
  }),

  updateCounter: trpcProcedureBuilder
    .input(
      z.object({
        delta: z.number(),
      })
    )
    .mutation(({ input }) => {
      counter += input.delta;
    }),
});
