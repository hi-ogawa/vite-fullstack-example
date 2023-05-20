import { createServer } from "node:http";
import { createMiddleware } from "@hattip/adapter-node";
import express from "express";
import { createHattipApp } from "./hattip";
import { listenPortSearchByEnv } from "./http";

// test production build locally with express
//   pnpm build-preview
//   pnpm preview

async function main() {
  const app = express();
  const server = createServer(app);

  // serve /assets -> ./dist/client/assets
  app.use(express.static(`./dist/client`));

  // application logic
  app.use(createMiddleware(createHattipApp()));

  // start app
  const port = await listenPortSearchByEnv(server);
  console.log(`[entry-preview] Server running at http://localhost:${port}`);
}

main();
