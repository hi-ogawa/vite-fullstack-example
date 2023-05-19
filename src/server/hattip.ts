import { RequestHandler, compose } from "@hattip/compose";
import { renderPage } from "vite-plugin-ssr/server";

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
  // TODO
  return ctx.next();
};

export const hattipApp = compose(hattipTrpc, hattipVitePluginSsr);
