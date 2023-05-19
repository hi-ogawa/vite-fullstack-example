import { createMiddleware } from "@hattip/adapter-node";
import express from "express";
import vite from "vite";
import { hattipApp } from "./hattip";

// TODO
// - server build and reload
// - itegrate trpc
// - production entry point

/*

## development

npx esbuild ./src/server/entry-dev.ts --bundle --external:vite --external:vite-plugin-ssr --sourcemap --outfile=./dist/dev.js --platform=node --watch
npx nodemon ./dist/dev.js --watch ./dist/dev.js

## production

npx vite build
npx esbuild ./src/server/entry-preview.ts --bundle --sourcemap --outfile=./dist/preview.js --platform=node
NODE_ENV=production node ./dist/preview.js

*/

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
