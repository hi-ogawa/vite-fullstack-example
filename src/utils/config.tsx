import process from "node:process";
import { z } from "zod";

const Z_SERVER_CONFIG = z.object({
  APP_REDIS_URL: z.string().default("redis://localhost:6379"),
  APP_REDIS_PREFIX: z.string().default("dev"),
});

type ServerConfig = z.infer<typeof Z_SERVER_CONFIG>;

export let serverConfig: ServerConfig;

export function initializeConfig() {
  serverConfig = Z_SERVER_CONFIG.parse(process.env);
}
