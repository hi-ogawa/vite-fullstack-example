import { Redis } from "ioredis";

export let redis: Redis;

export async function initializeRedis() {
  // TODO: configurable
  const url = "redis://localhost:6379";
  redis = new Redis(url, { lazyConnect: true, maxRetriesPerRequest: 3 });
  await redis.ping();
}
