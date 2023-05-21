import THEME_SCRIPT from "@hiogawa/utils-experimental/dist/theme-script.global.js?raw";
import { renderToString } from "react-dom/server";
import { dangerouslySkipEscape, escapeInject } from "vite-plugin-ssr/server";
import { PAGE_DOM_ID, PageWrapper } from "./common";
import type { PageContext, PageServerRender } from "./types";

export const passToClient = [
  "pageProps",
  "trpcCtx",
] satisfies (keyof PageContext)[];

export const render: PageServerRender = (ctx) => {
  // TODO: streaming
  const page = (
    <PageWrapper>
      <ctx.Page {...ctx.pageProps} />
    </PageWrapper>
  );
  const pageString = renderToString(page);
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
        <title>Example</title>
        <link rel="icon" href="${dangerouslySkipEscape(ICON_DATA_URL)}"></link>
        <script>
          globalThis.__themeStorageKey = "vite-fullstack:theme";
          globalThis.__themeDefault = "dark";
          ${dangerouslySkipEscape(THEME_SCRIPT)}
        </script>
      </head>
      <body>
        <div id="${PAGE_DOM_ID}">${dangerouslySkipEscape(pageMarkup)}</div>
      </body>
    </html>
  `;
}

// https://remixicon.com/icon/aliens-line
const ICON_DATA_URL = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C16.6944 2 20.5 5.80558 20.5 10.5C20.5 17 15 22.5 12 22.5C9 22.5 3.5 17 3.5 10.5C3.5 5.80558 7.30558 2 12 2ZM12 4C8.41015 4 5.5 6.91015 5.5 10.5C5.5 15.2938 9.665 20.5 12 20.5C14.335 20.5 18.5 15.2938 18.5 10.5C18.5 6.91015 15.5899 4 12 4ZM17.5 11C17.6603 11 17.8186 11.0084 17.9746 11.0247C17.9916 11.1812 18 11.3396 18 11.5C18 13.9853 15.9853 16 13.5 16C13.3396 16 13.1812 15.9916 13.0252 15.9752C13.0084 15.8186 13 15.6603 13 15.5C13 13.0147 15.0147 11 17.5 11ZM6.5 11C8.98528 11 11 13.0147 11 15.5C11 15.6603 10.9916 15.8186 10.9753 15.9746C10.8186 15.9916 10.6603 16 10.5 16C8.01472 16 6 13.9853 6 11.5C6 11.3396 6.00839 11.1812 6.02475 11.0252C6.18121 11.0084 6.33963 11 6.5 11Z'%3E%3C/path%3E%3C/svg%3E`;
