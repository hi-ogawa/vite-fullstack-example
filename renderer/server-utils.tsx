import { RenderErrorPage } from "vite-plugin-ssr/RenderErrorPage";
import { z } from "zod";

// remix style direct response early-return in server logic
export const Z_THROWN_REPONSE_PAGE_CONTEXT = z.object({
  __response: z.instanceof(Response),
});

type ThrownResponsePageContext = z.infer<typeof Z_THROWN_REPONSE_PAGE_CONTEXT>;

// cf. https://github.com/remix-run/react-router/blob/edf6dca2c6dde5e86f2e3e3ae8b62996d87f4ab3/packages/router/utils.ts#L1427
export function redirect(url: string, init: ResponseInit = {}) {
  init.status ??= 302;

  const headers = new Headers(init.headers);
  headers.set("location", url);

  const pageContext: ThrownResponsePageContext = {
    __response: new Response(null, {
      ...init,
      headers,
    }),
  };

  // TODO: "error page" shouldn't be necessary for this "direct response" use case, but it still shows a waring?
  // https://vite-plugin-ssr.com/error-page#details
  return RenderErrorPage({
    pageContext,
  });
}
