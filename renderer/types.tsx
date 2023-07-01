import type React from "react";
import type { escapeInject } from "vite-plugin-ssr/server";
import type { PageContextBuiltInClientWithClientRouting } from "vite-plugin-ssr/types";
import type { RedirectPageContext } from "./server-utils";

//
// page context
//

// prettier-ignore
export type PageContext =
  PageContextBuiltInClientWithClientRouting<React.FC> &
  PageContextInit &
  Partial<RedirectPageContext> &
  {
    pageProps?: Record<string, unknown>;
  };

export type PageContextInit = {
  urlOriginal: string;
};

export type PageClientRender = (ctx: PageContext) => void;

export type PageServerRender = (ctx: PageContext) => {
  documentHtml: ReturnType<typeof escapeInject>;
  pageContext: {}; // TODO: extra context can be passed to client (e.g. document title)
};

// onBeforeRender wrapper
export type OnBeforeRenderFunction<PageProps = {}> = (ctx: PageContext) => {
  pageContext: {
    pageProps: PageProps;
  };
};
