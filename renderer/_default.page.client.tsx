import "virtual:uno.css";
import { tinyassert } from "@hiogawa/utils";
import { hydrateRoot } from "react-dom/client";
import { PAGE_DOM_ID } from "./common";
import { Root } from "./root";
import type { PageClientRender } from "./types";

let reactRoot: ReturnType<typeof hydrateRoot> | undefined;

export const render: PageClientRender = (ctx) => {
  const pageEl = document.getElementById(PAGE_DOM_ID);
  tinyassert(pageEl);

  const page = (
    <Root pageContext={ctx}>
      <ctx.Page {...ctx.pageProps} />
    </Root>
  );

  if (ctx.isHydration) {
    tinyassert(!reactRoot);
    reactRoot = hydrateRoot(pageEl, page);
    pageEl.dataset["testid"] = "hydrated"; // for e2e
  } else {
    tinyassert(reactRoot);
    reactRoot.render(page);
  }
};

// https://vite-plugin-ssr.com/clientRouting
export const clientRouting = true;
