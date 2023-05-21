import { redirect } from "../../renderer/server-utils";
import type { OnBeforeRenderFunction } from "../../renderer/types";

export type PageProps = {
  name: string;
};

export const onBeforeRender: OnBeforeRenderFunction<PageProps> = (ctx) => {
  const { user } = ctx.trpcCtx.session;
  if (!user) {
    // TODO: error message/toast after redirection?
    throw redirect("/session/login");
  }

  return {
    pageContext: {
      pageProps: {
        name: user.name,
      },
    },
  };
};
