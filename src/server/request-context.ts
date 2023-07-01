import { AsyncLocalStorage } from "node:async_hooks";
import type { RequestContext, RequestHandler } from "@hattip/compose";
import { tinyassert } from "@hiogawa/utils";
import { initializeSession } from "../utils/session-utils";

// TODO
// during dev, vite-plugin-ssr's `renderPage` loads modules on its own system,
// so everything (including this AsyncLocalStorage) is deprecated from our esbuild dev bundle.
// for now, we workaround this by persisting it to global.

// prettier-ignore
const storage: AsyncLocalStorage<RequestContext> =
  ((globalThis as any).__requestContextStorage ??= new AsyncLocalStorage());

export function getRequestContext() {
  const store = storage.getStore();
  tinyassert(store);
  return store;
}

export function requestContextProvider(): RequestHandler {
  return async (ctx) => {
    return storage.run(ctx, ctx.next);
  };
}

export async function initializeReqeustContext(options?: {
  responseHeaders?: Headers;
}) {
  const ctx = getRequestContext();
  ctx.session = await initializeSession(
    ctx.request.headers,
    // effectively readonly by dummy response headers
    options?.responseHeaders ?? new Headers()
  );
}
