import "virtual:uno.css";
import { tinyassert } from "@hiogawa/utils";
import React from "react";
import { type Root, hydrateRoot } from "react-dom/client";
import { PAGE_DOM_ID, PageWrapper } from "./common";
import type { PageClientRender } from "./types";

let reactRoot: Root | undefined;

export const render: PageClientRender = (ctx) => {
  const pageEl = document.getElementById(PAGE_DOM_ID);
  tinyassert(pageEl);

  const page = (
    <React.StrictMode>
      <PageWrapper>
        <ctx.Page {...ctx.pageProps} />
      </PageWrapper>
    </React.StrictMode>
  );

  if (ctx.isHydration) {
    tinyassert(!reactRoot);
    reactRoot = hydrateRoot(pageEl, page);
  } else {
    tinyassert(reactRoot);
    reactRoot.render(page);
  }
};

// https://vite-plugin-ssr.com/clientRouting
export const clientRouting = true;
