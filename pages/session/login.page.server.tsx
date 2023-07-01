import { FlashType } from "../../renderer/flash";
import { redirect } from "../../renderer/server-utils";
import type { OnBeforeRenderFunction } from "../../renderer/types";
import { getRequestContext } from "../../src/server/request-context";
import { $R } from "../../src/utils/typed-routes";

export const onBeforeRender: OnBeforeRenderFunction = () => {
  const { user } = getRequestContext().session;
  if (user) {
    throw redirect(
      $R["/session/me"]({ q: { __msg: FlashType.AlreadyLoggedIn } })
    );
  }
  return {
    pageContext: {
      pageProps: {},
    },
  };
};
