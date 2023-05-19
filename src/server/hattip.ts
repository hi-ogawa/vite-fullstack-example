import { RequestHandler, compose } from "@hattip/compose";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
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

export const hattipApp = compose(hattipTrpc, hattipVitePluginSsr);
