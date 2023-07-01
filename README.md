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
  - postgres
  - redis
- database
  - [kysely](https://github.com/kysely-org/kysely) (db client + migration)
  - [prisma](https://github.com/prisma/prisma) (shema diff)
- testing
  - [vitest](https://github.com/vitest-dev/vitest) (unit)
  - [playwright](https://github.com/microsoft/playwright) (e2e)
- infra
  - [vercel serverless](https://vercel.com/docs/concepts/functions/serverless-functions)
  - [vercel postgres](https://vercel.com/docs/storage/vercel-postgres)
  - [vercel kv](https://vercel.com/docs/storage/vercel-kv)

## usage

```sh
# development
pnpm i
make docker/up db/reset
pnpm dev

# test (unit)
pnpm test

# test (e2e)
npx playwright install chromium
pnpm test-e2e

# release (see also misc/vercel/README.md)
pnpm build
pnpm release
pnpm release-production

# db migration (see also prisma/README.md)
pnpm migrate-production status # up, down, latest
```
