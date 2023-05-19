import "virtual:uno.css";
import { tinyassert } from "@hiogawa/utils";
import React from "react";
import { createRoot } from "react-dom/client";
import { PAGE_DOM_ID, PageWrapper } from "./common";

// TODO: when is it different from PageContextServer?
// import { PageContextBuiltIn } from "vite-plugin-ssr/types";
export type PageContextClient = {
  Page: React.FC;
  pageProps?: Record<string, unknown>;
};

type RenderClient = (pageContext: PageContextClient) => void;

export const render: RenderClient = (ctx) => {
  const pageEl = document.getElementById(PAGE_DOM_ID);
  tinyassert(pageEl);

  // TODO: client navigation

  const root = createRoot(pageEl);
  const page = (
    <React.StrictMode>
      <PageWrapper>
        <ctx.Page {...ctx.pageProps} />
      </PageWrapper>
    </React.StrictMode>
  );
  root.render(page);
};
