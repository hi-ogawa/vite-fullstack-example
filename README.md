# vite-fullstack-example

## stack

- rendering
  - [react](https://github.com/facebook/react)
  - [vite-plugin-ssr](https://github.com/brillout/vite-plugin-ssr)
  - [unocss](https://github.com/unocss/unocss/)
- api
  - [trpc](https://github.com/trpc/trpc)
  - [tanstack react query](https://github.com/TanStack/query)
- persistence
  - redis
- testing
  - [vitest](https://github.com/vitest-dev/vitest) (unit)
  - [playwright](https://github.com/microsoft/playwright) (e2e)
- infra
  - [vercel serverless](https://vercel.com/docs/concepts/functions/serverless-functions)
  - [vercel kv](https://vercel.com/docs/storage/vercel-kv)

## usage

```sh
# development
make docker/up
pnpm i
pnpm dev

# release (see also misc/vercel/README.md)
pnpm build
pnpm release
pnpm release-production
```
