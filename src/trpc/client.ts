import { createTRPCProxyClient, httpLink } from "@trpc/client";
import { TRPC_ENDPOINT } from "./common";
import type { trpcRouter } from "./server";

export const trpcClient = createTRPCProxyClient<typeof trpcRouter>({
  links: [
    httpLink({
      url: TRPC_ENDPOINT,
    }),
  ],
});
