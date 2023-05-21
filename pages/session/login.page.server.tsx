import { redirect } from "../../renderer/server-utils";
import type { OnBeforeRenderFunction } from "../../renderer/types";

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
