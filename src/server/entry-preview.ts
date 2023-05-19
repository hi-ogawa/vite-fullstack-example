import { createMiddleware } from "@hattip/adapter-node";
import express from "express";
import { hattipApp } from "./hattip";

async function main() {
  const app = express();

  // serve /assets -> ./dist/client/assets
  app.use(express.static(`./dist/client`));

  // application logic
  app.use(createMiddleware(hattipApp));

  // start app
  app.listen(3001, () => {
    console.log(`Server running at http://localhost:3001`);
  });
}

main();
