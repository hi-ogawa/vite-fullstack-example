import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
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
      {/* it seems v5 devtools have import side effect which doesn't even allow importing on server https://github.com/TanStack/query/pull/5347 */}
      {/* anyway we shouldn't bother SSR-ing devtools so let's just lazy load */}
      {import.meta.env.DEV && (
        <ClientOnly>
          <ReactQueryDevtools />
        </ClientOnly>
      )}
    </QueryClientProvider>
  );
}

function ClientOnly(
  props: React.PropsWithChildren<{ fallback?: React.ReactNode }>
) {
  return <>{useHydrated() ? props.children : props.fallback}</>;
}

let hydratedGlobal = false;

function useHydrated() {
  const [hydrated, setHydrated] = React.useState(hydratedGlobal);

  React.useEffect(() => {
    hydratedGlobal = true;
    setHydrated(true);
  }, []);

  return hydrated;
}
