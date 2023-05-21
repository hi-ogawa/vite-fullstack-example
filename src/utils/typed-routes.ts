import { tinyassert } from "@hiogawa/utils";
import { z } from "zod";
import { Z_FLASH_QUERY } from "../../renderer/flash";
import { createGetterProxy } from "./misc";

// based on https://github.com/hi-ogawa/ytsub-v3/blob/ae1e25a081e02f467c3e77d2ef312a21cb8cf37a/app/misc/routes.ts

export const ROUTES = {
  "/": {},
  "/server-counter": {},
  "/session/login": {
    q: Z_FLASH_QUERY,
  },
  "/session/me": {
    q: Z_FLASH_QUERY,
  },
  "/dummy/@id": {
    p: z.object({ id: z.number() }),
  },
};

export const $R = createRouteFormatterProxy(ROUTES);

//
// utils
//

type RouteDefBase = Record<string, { p?: z.ZodType; q?: z.ZodType }>;

type RouteFormatter<T extends RouteDefBase> = {
  [K in keyof T]: (...args: RouteFormatterArgs<T[K]>) => string;
};

type RouteFormatterArgs<R extends { p?: z.ZodType; q?: z.ZodType }> =
  R extends { p: z.ZodType; q: z.ZodType }
    ? [{ p: z.input<R["p"]>; q?: z.input<R["q"]> }]
    : R extends { p: z.ZodType }
    ? [{ p: z.input<R["p"]> }]
    : R extends { q: z.ZodType }
    ? [{ q?: z.input<R["q"]> }] | []
    : [];

export function createRouteFormatterProxy<T extends RouteDefBase>(
  routes: T
): RouteFormatter<T> {
  return createGetterProxy((path) => {
    return (arg?: { p?: {}; q?: {} }) => {
      tinyassert(typeof path === "string");
      tinyassert(path in routes);
      const route = routes[path as keyof T];
      let url = path;
      if (route.p) {
        tinyassert(arg?.p);
        for (const [k, v] of Object.entries(arg.p)) {
          url = url.replace("@" + k, String(v));
        }
      }
      if (route.q && arg?.q) {
        url += "?" + new URLSearchParams(arg.q);
      }
      return url;
    };
  }) as any;
}
