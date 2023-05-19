import { renderToString } from "react-dom/server";
import { dangerouslySkipEscape, escapeInject } from "vite-plugin-ssr/server";
import { PAGE_DOM_ID } from "./common";

// PageContext api is customizable for own need
// cf.
// import type { PageContextBuiltIn } from "vite-plugin-ssr/types";

type PageContextServer = {
  Page: React.FC;
  pageProps?: Record<string, unknown>;
};

type RenderServer = (ctx: PageContextServer) => {
  documentHtml: unknown;
  pageContext: {}; // TODO?
};

// TODO: pageProps
export const passToClient = ["pageProps"];

export const render: RenderServer = (ctx) => {
  // TODO: streaming
  const pageString = renderToString(<ctx.Page {...ctx.pageProps} />);
  const documentHtml = wrapDocumentHtml(pageString);

  return {
    documentHtml,
    pageContext: {},
  };
};

function wrapDocumentHtml(pageMarkup: string) {
  return escapeInject`
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0"
        />
        <title>Test</title>
      </head>
      <body>
        <div id="${PAGE_DOM_ID}">${dangerouslySkipEscape(pageMarkup)}</div>
      </body>
    </html>
  `;
}
