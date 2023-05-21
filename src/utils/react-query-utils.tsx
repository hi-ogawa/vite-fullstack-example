import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
  type QueryOptions,
  useQuery,
} from "@tanstack/react-query";
import React from "react";
import { toast } from "react-hot-toast";

export function ReactQueryWrapper(props: React.PropsWithChildren) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: 0,
          },
          mutations: {
            onError: (error) => {
              console.error("mutation error", error);
              toast.error("something went wrong...");
            },
          },
        },
        queryCache: new QueryCache({
          onError: (error) => {
            console.error("query error", error);
            toast.error("something went wrong...");
          },
        }),
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
      {import.meta.env.DEV && (
        <LazyComponent
          // it seems v5 devtools have import side effect which doesn't even allow importing on server https://github.com/TanStack/query/pull/5347
          // anyway we shouldn't bother SSR-ing devtools so let's just dynamic import
          importer={() => import("@tanstack/react-query-devtools")}
          render={({ ReactQueryDevtools }) => <ReactQueryDevtools />}
        />
      )}
    </QueryClientProvider>
  );
}

export function LazyComponent<T>(props: {
  importer: () => Promise<T>;
  render: (data: T) => React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const query = useQuery(usePromiseQueryOpitons(props.importer));
  return <>{query.isSuccess ? props.render(query.data) : props.fallback}</>;
}

export function usePromiseQueryOpitons<T>(queryFn: () => Promise<T>) {
  return {
    queryKey: ["usePromise", String(queryFn)],
    queryFn,
    gcTime: Infinity,
  } satisfies QueryOptions;
}
