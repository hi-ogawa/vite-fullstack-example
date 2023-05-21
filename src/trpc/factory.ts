import { initTRPC } from "@trpc/server";
import type { TrpcAppContext } from "./context";

const t = initTRPC.context<TrpcAppContext>().create();

export const trpcRouterFactory = t.router;
export const trpcMiddlewareFactory = t.middleware;
export const trpcProcedureBuilder = t.procedure;
