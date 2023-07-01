import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { trpcClientQuery } from "../src/trpc/client";

export function Page() {
  const counterQueryOptions = trpcClientQuery.getCounter.queryOptions();
  const counterQuery = useQuery(counterQueryOptions);

  const queryClient = useQueryClient();
  const counterMutation = useMutation({
    ...trpcClientQuery.updateCounter.mutationOptions(),
    onSuccess: (data) => {
      toast.success("Successfully updated", { id: "counter-mutation-success" });
      queryClient.setQueryData(counterQueryOptions.queryKey, data);
    },
  });

  const loading = counterQuery.isFetching || counterMutation.isLoading;

  return (
    <div className="flex flex-col gap-2 w-lg">
      <h2 className="text-lg">redis counter example</h2>
      <div className="flex items-center gap-3">
        <span>counter = {counterQuery.data ?? "..."}</span>
        {loading && <div className="antd-spin w-4 h-4"></div>}
      </div>
      <div className="flex items-center gap-2">
        <button
          className="antd-btn antd-btn-default px-2"
          disabled={loading}
          onClick={() => counterMutation.mutate({ delta: -1 })}
        >
          -1
        </button>
        <button
          className="antd-btn antd-btn-default px-2"
          disabled={loading}
          onClick={() => counterMutation.mutate({ delta: +1 })}
        >
          +1
        </button>
      </div>
    </div>
  );
}
