import { useMutation } from "@tanstack/react-query";
import { FlashType } from "../../renderer/flash";
import { trpcClientQuery } from "../../src/trpc/client";
import { $R } from "../../src/utils/typed-routes";
import type { PageProps } from "./me.page.server";

export function Page(props: PageProps) {
  const logoutMutation = useMutation({
    ...trpcClientQuery.logout.mutationOptions(),
    onSuccess: () => {
      // simple refresh on session invalidation
      window.location.href = $R["/session/login"]({
        q: { __msg: FlashType.LogoutSuccess },
      });
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
