import { tinyassert, zip } from "@hiogawa/utils";

export function cls(...args: unknown[]) {
  return args.filter(Boolean).join(" ");
}

// new RegExp(String.raw`...`) with only inner strings are escaped
// which, for example, allows easier composition for matching urls e.g.
//   regExpRaw`/username/${/\w+/}/profile`
export function regExpRaw(
  { raw }: TemplateStringsArray,
  ...params: (string | RegExp)[]
): RegExp {
  tinyassert(raw.length === params.length + 1);
  return new RegExp(
    [...zip(raw, params.map(regExpRawInner)), raw.slice(-1)].flat().join("")
  );
}

function regExpRawInner(s: string | RegExp): string {
  return s instanceof RegExp
    ? s.source
    : s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function createGetterProxy(
  propHandler: (prop: string | symbol) => unknown
): unknown {
  return new Proxy(
    {},
    {
      get(_target, prop, _receiver) {
        return propHandler(prop);
      },
    }
  );
}
