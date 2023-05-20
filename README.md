# vite-fullstack-example (wip)

## tools

- rendering
  - react
  - vite-plugin-ssr
  - unocss
- api
  - trpc
  - tanstack query
- persistence
  - redis
- testing
  - playwright (e2e)
- deployment
  - vercel serverless, kv, cdn

## usage

```sh
# development
make docker/up redis/reset
pnpm i
pnpm dev

# release (see also misc/vercel/README.md)
pnpm build
pnpm release
pnpm release-production
```
