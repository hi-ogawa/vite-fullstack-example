import type { RequestHandler } from "@hattip/compose";
import { once } from "@hiogawa/utils";
import { initializeConfig } from "./config";
import { initializeRedis } from "./redis-utils";

// initialize globals

export async function bootstrap() {
  initializeConfig();
  await initializeRedis();
}

const bootstrapOnce = once(bootstrap);

export const hattipBootstrapHandler: RequestHandler = async (ctx) => {
  await bootstrapOnce();
  return ctx.next();
};