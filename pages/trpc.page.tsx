import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { trpcRQ } from "../src/trpc/react-query";
import { Header } from "./index.page";

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
    <div>
      <Header />
      <div>
        server state = {counterQuery.isFetching ? "..." : counterQuery.data}
      </div>
      <div>
        <button onClick={() => counterMutation.mutate({ delta: -1 })}>
          -1
        </button>
        <button onClick={() => counterMutation.mutate({ delta: +1 })}>
          +1
        </button>
      </div>
    </div>
  );
}
