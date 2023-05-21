import { redirect } from "../../renderer/server-utils";
import type { PageContext } from "../../renderer/types";

export type PageProps = {
  name: string;
};

// TODO: typing wrapper
type OnBeforeRenderFunction = (pageContext: PageContext) => {
  pageContext: {
    pageProps: PageProps;
  };
};

export const onBeforeRender: OnBeforeRenderFunction = (ctx) => {
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