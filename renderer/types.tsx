import type React from "react";
import type { PageContextBuiltInClientWithClientRouting } from "vite-plugin-ssr/types";

//
// page context
//

export type PageContext = IntersectionReplace<
  PageContextBuiltInClientWithClientRouting,
  {
    Page: React.FC;
    pageProps?: Record<string, unknown>;
  }
>;

export type PageClientRender = (ctx: PageContext) => void;

export type PageServerRender = (ctx: PageContext) => {
  documentHtml: unknown;
  pageContext: {}; // TODO: extra context can be passed to client (e.g. document title)
};

//
// utils
//

// cf. https://github.com/sindresorhus/type-fest/blob/1fce25cf8afadd4d4013e8f0ee64d045eda45cd7/source/except.d.ts
type StrictOmit<T, K extends keyof T> = Omit<T, K>;

type IntersectionReplace<T1, T2> = StrictOmit<T1, keyof T1 & keyof T2> & T2;
