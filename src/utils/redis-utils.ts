import { Redis } from "ioredis";
import { serverConfig } from "./config";

export let redis: Redis;

export async function initializeRedis() {
  redis = new Redis(serverConfig.APP_REDIS_URL, {
    lazyConnect: true,
    maxRetriesPerRequest: 3,
  });
  await redis.ping();
}
