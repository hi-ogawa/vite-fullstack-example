import type { RequestHandler } from "@hattip/compose";
import { once } from "@hiogawa/utils";
import { initializeRedis } from "./redis-utils";

export async function bootstrap() {
  await initializeRedis();
}

const bootstrapOnce = once(bootstrap);

export const hattipBootstrapHandler: RequestHandler = async (ctx) => {
  await bootstrapOnce();
  return ctx.next();
};
