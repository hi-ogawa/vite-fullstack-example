import type React from "react";
import type { escapeInject } from "vite-plugin-ssr/server";
import type { PageContextBuiltInClientWithClientRouting } from "vite-plugin-ssr/types";
import type { TrpcAppContext } from "../src/trpc/context";

//
// page context
//

export type PageContext =
  PageContextBuiltInClientWithClientRouting<React.FC> & {
    pageProps?: Record<string, unknown>;
  } & PageContextInit;

export type PageContextInit = {
  urlOriginal: string;
  trpcCtx: TrpcAppContext; // reuse session logic from trpc. client will only sees serialized one.
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
