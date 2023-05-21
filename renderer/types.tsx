import type React from "react";
import type { escapeInject } from "vite-plugin-ssr/server";
import type { PageContextBuiltInClientWithClientRouting } from "vite-plugin-ssr/types";

//
// page context
//

export type PageContext =
  PageContextBuiltInClientWithClientRouting<React.FC> & {
    pageProps?: Record<string, unknown>;
  };

export type PageClientRender = (ctx: PageContext) => void;

export type PageServerRender = (ctx: PageContext) => {
  documentHtml: ReturnType<typeof escapeInject>;
  pageContext: {}; // TODO: extra context can be passed to client (e.g. document title)
};
