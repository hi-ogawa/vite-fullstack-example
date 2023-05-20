import { Server, createServer } from "node:http";
import { createMiddleware } from "@hattip/adapter-node";
import express from "express";
import vite from "vite";
import { createHattipApp } from "./hattip";
import { listenPortSearchByEnv } from "./http";
import { shutdown } from "../utils/bootstrap";
import process from "node:process";

// cf. https://github.com/sapphi-red/vite-setup-catalogue/blob/48cde75352005aa1c1780f5eccf022db5619e285/examples/middleware-mode/server.js

async function main() {
  const app = express();
  const server = createServer(app);

  // vite dev server
  const viteServer = await vite.createServer({
    server: { middlewareMode: true, hmr: { server } },
  });
  app.use(viteServer.middlewares);

  // all application logic as hattip handler
  app.use(createMiddleware(createHattipApp()));

  // start app
  const port = await listenPortSearchByEnv(server);
  console.log(`[entry-dev] Server running at http://localhost:${port}`);

  setupShutdown(server);
}

function setupShutdown(server: Server) {
  process.once("SIGUSR2", async () => {
    console.log(`[entry-dev] SIGTERM received`);
    await serverClosePromsie(server);
    await shutdown();
  });
}

function serverClosePromsie(server: Server) {
  return new Promise((resolve, reject) => {
    server.close(e => {
      e ? reject(e) : resolve(e);
    });
  });
}

main();
