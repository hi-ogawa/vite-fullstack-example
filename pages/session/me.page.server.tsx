import { FlashType } from "../../renderer/flash";
import { redirect } from "../../renderer/server-utils";
import type { OnBeforeRenderFunction } from "../../renderer/types";
import { $R } from "../../src/utils/typed-routes";

export type PageProps = {
  name: string;
};

export const onBeforeRender: OnBeforeRenderFunction<PageProps> = (ctx) => {
  const { user } = ctx.trpcCtx.session;
  if (!user) {
    throw redirect(
      $R["/session/login"]({ q: { flash: FlashType.RequireLogin } })
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
