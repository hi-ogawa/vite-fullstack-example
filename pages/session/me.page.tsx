import { useMutation } from "@tanstack/react-query";
import { trpcRQ } from "../../src/trpc/react-query";
import type { PageProps } from "./me.page.server";

export function Page(props: PageProps) {
  const logoutMutation = useMutation({
    ...trpcRQ.logout.mutationOptions(),
    onSuccess: () => {
      // simple refresh on session invalidation
      // TODO: typed route system
      window.location.href = "/session/login";
    },
  });

  return (
    <div className="flex flex-col gap-2 w-md">
      <h2 className="text-lg">Session protected route example</h2>
      <div className="flex items-center gap-3">
        <div>Hello, {props.name}</div>
        <button
          className="antd-btn antd-btn-default px-2"
          onClick={() => logoutMutation.mutate()}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
