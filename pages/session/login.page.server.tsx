import { redirect } from "../../renderer/server-utils";
import type { PageContext } from "../../renderer/types";

type OnBeforeRenderFunction = (pageContext: PageContext) => {
  pageContext: {
    pageProps: {};
  };
};

export const onBeforeRender: OnBeforeRenderFunction = (ctx) => {
  const { user } = ctx.trpcCtx.session;
  if (user) {
    throw redirect("/session/me");
  }
  return {
    pageContext: {
      pageProps: {},
    },
  };
};
