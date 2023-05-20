import { type RequestHandler, compose } from "@hattip/compose";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { logger } from "hono/logger";
import { renderPage } from "vite-plugin-ssr/server";
import { TRPC_ENDPOINT } from "../trpc/common";
import { trpcRoot } from "../trpc/server";

const hattipVitePluginSsr: RequestHandler = async (ctx) => {
  const pageContext = await renderPage({ urlOriginal: ctx.request.url });
  const res = pageContext.httpResponse;
  if (!res) {
    return ctx.next();
  }
  // TODO: need polyfill?
  return new Response(res.getReadableWebStream(), {
    status: res.statusCode,
    headers: {
      // TODO: extra header via custom pageContext? (e.g. set-cookie)
      "content-type": res.contentType,
    },
  });
};

const hattipTrpc: RequestHandler = (ctx) => {
  if (!ctx.url.pathname.startsWith(TRPC_ENDPOINT)) {
    return ctx.next();
  }
  return fetchRequestHandler({
    endpoint: TRPC_ENDPOINT,
    req: ctx.request,
    router: trpcRoot,
    createContext: () => ({}),
    // quick error logging
    onError: (e) => {
      console.error(e);
    },
  });
};

function createHattipLogger() {
  // borrow hono's logger with minimal compatibility hack
  // https://github.com/honojs/hono/blob/0ffd795ec6cfb67d38ab902197bb5461a4740b8f/src/middleware/logger/index.ts
  const honoLogger = logger();

  const hattipLogger: RequestHandler = async (ctx) => {
    let hattipRes!: Response;
    const honoNext = async () => {
      hattipRes = await ctx.next();
    };
    const honoReq = { method: ctx.method, raw: ctx.request };
    const honoRes = {
      get status() {
        return hattipRes.status;
      },
    };
    const honoCtx = { req: honoReq, res: honoRes };
    await honoLogger(honoCtx as any, honoNext as any);
    return hattipRes;
  };

  return hattipLogger;
}

export const hattipApp = compose(
  createHattipLogger(),
  hattipTrpc,
  hattipVitePluginSsr
);
