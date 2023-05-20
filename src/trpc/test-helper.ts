import { trpcRoot } from "./server";

export function createTestTrpc() {
  const ctx = {};
  const caller = trpcRoot.createCaller(ctx);
  return { caller, ctx };
}
