import { createMiddleware } from "@hattip/adapter-node";
import express from "express";
import vite from "vite";
import { hattipApp } from "./hattip";

async function main() {
  const app = express();

  // vite dev server
  const viteServer = await vite.createServer({
    server: { middlewareMode: true },
  });
  app.use(viteServer.middlewares);

  // all application logic as hattip handler
  app.use(createMiddleware(hattipApp));

  // start app
  app.listen(3001, () => {
    console.log(`Server running at http://localhost:3001`);
  });
}

main();
