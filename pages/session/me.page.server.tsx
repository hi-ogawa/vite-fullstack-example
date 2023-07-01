import { FlashType } from "../../renderer/flash";
import { redirect } from "../../renderer/server-utils";
import type { OnBeforeRenderFunction } from "../../renderer/types";
import { getRequestContext } from "../../src/server/request-context";
import { $R } from "../../src/utils/typed-routes";

export type PageProps = {
  name: string;
};

export const onBeforeRender: OnBeforeRenderFunction<PageProps> = () => {
  const { user } = getRequestContext().session;
  if (!user) {
    throw redirect(
      $R["/session/login"]({ q: { __msg: FlashType.RequireLogin } })
    );
  }

  return {
    pageContext: {
      pageProps: {
        name: user.name,
      },
    },
  };
};
