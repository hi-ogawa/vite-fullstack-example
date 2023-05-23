import "virtual:uno.css";
import { tinyassert } from "@hiogawa/utils";
import { hydrateRoot } from "react-dom/client";
import { PAGE_DOM_ID } from "./common";
import { Root } from "./root";
import type { PageClientRender } from "./types";

let reactRoot: ReturnType<typeof hydrateRoot> | undefined;

export const render: PageClientRender = (ctx) => {
  // detect `onBeforeRender` server redirection on client
  if (ctx.clientRedirect) {
    // do hard navigation for simplicity since such use cases are minor
    window.location.href = ctx.clientRedirect;
    return;
  }

  const pageEl = document.getElementById(PAGE_DOM_ID);
  tinyassert(pageEl);

  const page = (
    <Root pageContext={ctx}>
      <ctx.Page {...ctx.pageProps} />
    </Root>
  );

  if (ctx.isHydration) {
    // first page render
    tinyassert(!reactRoot);
    reactRoot = hydrateRoot(pageEl, page);
    pageEl.dataset["testid"] = "hydrated"; // for e2e
  } else {
    // client navigation
    tinyassert(reactRoot);
    reactRoot.render(page);
  }
};

// https://vite-plugin-ssr.com/clientRouting
export const clientRouting = true;
