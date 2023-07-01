import { AsyncLocalStorage } from "node:async_hooks";
import type { RequestContext, RequestHandler } from "@hattip/compose";
import { tinyassert } from "@hiogawa/utils";
import {
  type SessionData,
  initializeSession,
  injectSessionData,
} from "../utils/session-utils";

// TODO
// during dev, vite-plugin-ssr's `renderPage` loads modules on its own system,
// so everything (including this AsyncLocalStorage) is instantiated independently from our esbuild dev bundle.
// for now, we workaround this by persisting it to global.

// pick minimal things so that it's easier to write `testRequestContext`
type MiniRequestContext = Pick<RequestContext, "request" | "session">;

// prettier-ignore
const storage: AsyncLocalStorage<MiniRequestContext> =
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

export function requestContextTester(options?: { sessionData: SessionData }) {
  return async (f: () => void | Promise<void>) => {
    const request = new Request("http://__dummy.local");
    if (options) {
      await injectSessionData(request.headers, options.sessionData);
    }
    const session = await initializeSession(request.headers, new Headers());
    const ctx: MiniRequestContext = {
      request,
      session,
    };
    return storage.run(ctx, () => f());
  };
}
