import { FlashType } from "../../renderer/flash";
import { redirect } from "../../renderer/server-utils";
import type { OnBeforeRenderFunction } from "../../renderer/types";

export const onBeforeRender: OnBeforeRenderFunction = (ctx) => {
  const { user } = ctx.trpcCtx.session;
  if (user) {
    throw redirect("/session/me?__flash=" + FlashType.AlreadyLoggedIn);
  }
  return {
    pageContext: {
      pageProps: {},
    },
  };
};
