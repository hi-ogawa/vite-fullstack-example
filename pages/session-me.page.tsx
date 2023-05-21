import type { PageProps } from "./session-me.page.server";

export function Page(props: PageProps) {
  return (
    <div className="flex flex-col gap-2 w-md">
      <h2 className="text-lg">Protected route example</h2>
      <div>Hello, {props.name}</div>
    </div>
  );
}
