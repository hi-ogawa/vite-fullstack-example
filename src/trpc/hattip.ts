import type { RequestHandler } from "@hattip/compose";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { initializeReqeustContext } from "../server/request-context";
import { TRPC_ENDPOINT } from "./common";
import { trpcRouter } from "./server";

export function trpcHandler(): RequestHandler {
  return (ctx) => {
    if (!ctx.url.pathname.startsWith(TRPC_ENDPOINT)) {
      return ctx.next();
    }
    return fetchRequestHandler({
      endpoint: TRPC_ENDPOINT,
      req: ctx.request,
      router: trpcRouter,
      createContext: async (options) => {
        await initializeReqeustContext({ responseHeaders: options.resHeaders });
        return {};
      },
      onError: (e) => {
        console.error(e);
      },
    });
  };
}
