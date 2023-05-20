import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { trpcRQ } from "../src/trpc/react-query";

export function Page() {
  const counterQuery = useQuery(trpcRQ.getCounter.queryOptions());

  const counterMutation = useMutation({
    ...trpcRQ.updateCounter.mutationOptions(),
    onSuccess: () => {
      toast.success("Successfully updated");
      counterQuery.refetch();
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg">Server State</h2>
      <div>counter = {counterQuery.isFetching ? "..." : counterQuery.data}</div>
      <div className="flex items-center gap-2">
        <button
          className="antd-btn antd-btn-default px-2"
          onClick={() => counterMutation.mutate({ delta: -1 })}
        >
          -1
        </button>
        <button
          className="antd-btn antd-btn-default px-2"
          onClick={() => counterMutation.mutate({ delta: +1 })}
        >
          +1
        </button>
      </div>
    </div>
  );
}
