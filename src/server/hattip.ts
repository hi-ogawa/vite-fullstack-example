import { type RequestHandler, compose } from "@hattip/compose";
import { typedBoolean } from "@hiogawa/utils";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { logger } from "hono/logger";
import { renderPage } from "vite-plugin-ssr/server";
import { Z_THROWN_REPONSE_PAGE_CONTEXT } from "../../renderer/server-utils";
import type { PageContextInit } from "../../renderer/types";
import { TRPC_ENDPOINT } from "../trpc/common";
import { createTrpcAppContext } from "../trpc/context";
import { trpcRoot } from "../trpc/server";
import { hattipBootstrapHandler } from "../utils/bootstrap";

//
// vite plugin ssr
//

const hattipVitePluginSsr: RequestHandler = async (ctx) => {
  const pageContext = await renderPage<{}, PageContextInit>({
    urlOriginal: ctx.request.url,
    trpcCtx: await createTrpcAppContext({
      req: ctx.request,
      resHeaders: new Headers(),
    }),
  });

  // For ssr request, use "thrown response" directly.
  // For data request, "throw response" is handled via builtin "is404" system and client can handle it e.g. in default.page.client.tsx.
  // So far, the use case of this logic is to throw redirection in server onBeforeRender.
  if (!ctx.url.pathname.endsWith(".pageContext.json")) {
    const thrown = Z_THROWN_REPONSE_PAGE_CONTEXT.safeParse(pageContext);
    if (thrown.success) {
      return thrown.data.__response;
    }
  }

  const res = pageContext.httpResponse;
  if (!res) {
    return ctx.next();
  }
  // TODO: need polyfill?
  return new Response(res.getReadableWebStream(), {
    status: res.statusCode,
    headers: {
      "content-type": res.contentType,
    },
  });
};

//
// trpc
//

const hattipTrpc: RequestHandler = (ctx) => {
  if (!ctx.url.pathname.startsWith(TRPC_ENDPOINT)) {
    return ctx.next();
  }
  return fetchRequestHandler({
    endpoint: TRPC_ENDPOINT,
    req: ctx.request,
    router: trpcRoot,
    createContext: createTrpcAppContext,
    onError: (e) => {
      // quick error logging
      console.error(e);
    },
  });
};

//
// logger
//

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

export function createHattipApp(options?: { noLogger?: boolean }) {
  const handlers = [
    hattipBootstrapHandler,
    !options?.noLogger && createHattipLogger(),
    hattipTrpc,
    hattipVitePluginSsr,
  ].filter(typedBoolean);

  return compose(handlers);
}
