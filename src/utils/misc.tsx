export function cls(...args: unknown[]) {
  return args.filter(Boolean).join(" ");
}
