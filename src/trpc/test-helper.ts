import { type SessionData, injectSessionData } from "../utils/session-utils";
import { createTrpcAppContext } from "./context";
import { trpcRoot } from "./server";

// TODO: setup for asyncLocalStorage

export async function createTestTrpc(options?: { sessionData: SessionData }) {
  const req = new Request("http://__dummy.local");
  if (options) {
    await injectSessionData(req.headers, options.sessionData);
  }
  const ctx = await createTrpcAppContext({
    req,
    resHeaders: new Headers(),
  });
  const caller = trpcRoot.createCaller(ctx);
  return { caller, ctx };
}
