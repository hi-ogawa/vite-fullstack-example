#!/bin/bash
set -eu -o pipefail

# based on https://github.com/hi-ogawa/ytsub-v3/blob/6554d050aefc279a12978517a57ac013ef28f5c7/scripts/vercel.sh

# .vercel/
#   project.json
#   output/
#     config.json
#     static/  (= dist/client)
#     functions/
#       index.func/
#         .vc-config.json
#         index.js
#         server/  (= dist/server)

# vite
npx vite build
npx esbuild ./src/server/entry-vercel.ts --bundle --sourcemap --outfile=./dist/entry-vercel.js --platform=node --sourcemap=inline

# clean
rm -rf .vercel/output
mkdir -p .vercel/output/functions/index.func

# config.json
cp misc/vercel/config.json .vercel/output/config.json

# static
cp -r dist/client .vercel/output/static

# serverless
cp -r dist/server .vercel/output/functions/index.func/server
cp dist/entry-vercel.js .vercel/output/functions/index.func/index.js
cp misc/vercel/.vc-config.json .vercel/output/functions/index.func/.vc-config.json
