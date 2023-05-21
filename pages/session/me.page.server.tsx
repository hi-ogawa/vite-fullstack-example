import { FlashType } from "../../renderer/flash";
import { redirect } from "../../renderer/server-utils";
import type { OnBeforeRenderFunction } from "../../renderer/types";

export type PageProps = {
  name: string;
};

export const onBeforeRender: OnBeforeRenderFunction<PageProps> = (ctx) => {
  const { user } = ctx.trpcCtx.session;
  if (!user) {
    throw redirect("/session/login?__flash=" + FlashType.RequireLogin);
  }

  return {
    pageContext: {
      pageProps: {
        name: user.name,
      },
    },
  };
};
