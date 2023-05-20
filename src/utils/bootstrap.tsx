import type { RequestHandler } from "@hattip/compose";
import { once } from "@hiogawa/utils";
import { initializeConfig } from "./config";
import { finalizeRedis, initializeRedis } from "./redis-utils";

// initialize/finalize globals

export async function bootstrap() {
  initializeConfig();
  await initializeRedis();
}

export async function shutdown() {
  await finalizeRedis();
}

//
// integrate to request handler
//

const bootstrapOnce = once(bootstrap);

export const hattipBootstrapHandler: RequestHandler = async (ctx) => {
  await bootstrapOnce();
  return ctx.next();
};
