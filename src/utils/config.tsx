import process from "node:process";
import { z } from "zod";

// prettier-ignore
const Z_SERVER_CONFIG = z.object({
  //
  // session
  //
  APP_SESSION_PASSWORD: z.string().min(32).default("46876d2156b52a0e0f52df65ae3cbd26"),
  APP_SESSION_NAME: z.string().default("vite-fullstack-session"),

  //
  // redis
  //
  APP_REDIS_URL: z.string().default("redis://localhost:7379/0"),
  // manage prefix manually to (ab)use single upstash redis for staging and production
  APP_REDIS_PREFIX: z.string().default("dev"),

  //
  // postgres
  //
  APP_POSTGRES_URL: z.string().default("postgres://postgres:password@localhost:6432/development"),
  APP_POSTGRES_DIRECT_URL: z.string().optional(),
});

type ServerConfig = z.infer<typeof Z_SERVER_CONFIG>;

export let serverConfig: ServerConfig;

export function initializeConfig() {
  serverConfig = Z_SERVER_CONFIG.parse(process.env);
}
