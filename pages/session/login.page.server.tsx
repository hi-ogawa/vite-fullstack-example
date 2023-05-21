import { FlashType } from "../../renderer/flash";
import { redirect } from "../../renderer/server-utils";
import type { OnBeforeRenderFunction } from "../../renderer/types";
import { $R } from "../../src/utils/typed-routes";

export const onBeforeRender: OnBeforeRenderFunction = (ctx) => {
  const { user } = ctx.trpcCtx.session;
  if (user) {
    throw redirect(
      $R["/session/me"]({ q: { flash: FlashType.AlreadyLoggedIn } })
    );
  }
  return {
    pageContext: {
      pageProps: {},
    },
  };
};
